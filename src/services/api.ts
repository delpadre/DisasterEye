
import axios, { AxiosError, AxiosInstance } from 'axios';
import { DisasterAlert, FireRiskForecast, GlobalFireHotspot, SmokePlumeForecast, WeatherData } from '@/types';
import { MOCK_ALERTS, MOCK_FIRE_RISK, MOCK_GLOBAL_HOTSPOTS, MOCK_SMOKE_PLUMES } from './mockData';

const API_BASE_URL = 'http://192.168.X.X:8080/api';

const OPENWEATHER_KEY = 'SUA_CHAVE_OPENWEATHER';

const client: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor de requisição — log / auth
client.interceptors.request.use(
  (config) => {
    if (__DEV__) console.log(`[API] → ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de resposta — tratamento centralizado de erro
client.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const msg =
      status === 404
        ? 'Recurso não encontrado'
        : status === 500
        ? 'Erro interno no servidor'
        : 'Falha de conexão com o serviço';
    if (__DEV__) console.warn(`[API] ✕ ${msg}`);
    return Promise.reject(new Error(msg));
  }
);

// Simula latência de rede para os mocks
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Busca alertas de desastres processados pela API Java (INPE/NASA).
 * Em caso de falha, usa dados simulados para a app seguir funcional.
 */
export async function fetchDisasterAlerts(): Promise<DisasterAlert[]> {
  try {
    const { data } = await client.get<DisasterAlert[]>('/v1/alerts');
    return data;
  } catch {
    await delay(900); // simula carregamento
    return MOCK_ALERTS;
  }
}

/** Busca um alerta específico por id. */
export async function fetchAlertById(id: string): Promise<DisasterAlert | undefined> {
  try {
    const { data } = await client.get<DisasterAlert>(`/v1/alerts/${id}`);
    return data;
  } catch {
    await delay(300);
    return MOCK_ALERTS.find((a) => a.id === id);
  }
}

/**
 * Clima por coordenada via OpenWeather — usado no detalhe do alerta
 * para correlacionar condição meteorológica com o evento.
 * O parâmetro `type` é usado apenas no fallback simulado para gerar
 * condições coerentes com o tipo de desastre.
 */
export async function fetchWeather(
  lat: number,
  lon: number,
  type?: import('@/types').DisasterType
): Promise<WeatherData | null> {
  try {
    const { data } = await axios.get(
      'https://api.openweathermap.org/data/2.5/weather',
      {
        params: { lat, lon, appid: OPENWEATHER_KEY, units: 'metric', lang: 'pt_br' },
        timeout: 8000,
      }
    );
    return {
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      city: data.name,
    };
  } catch {
    await delay(500);
    // ---- Fallback simulado coerente com o tipo + variação por coordenada ----
    // PRNG determinístico: mesma coordenada gera sempre o mesmo clima.
    const seed = Math.abs(Math.sin(lat * 12.9898 + lon * 78.233) * 43758.5453);
    const rand = (min: number, max: number, offset = 0) => {
      const x = (seed + offset) % 1;
      return min + x * (max - min);
    };

    // Perfis por tipo de desastre
    const profile = {
      wildfire: { temp: [32, 41], hum: [12, 28], wind: [4, 11], desc: 'céu limpo, baixa umidade', icon: '01d' },
      drought:  { temp: [35, 43], hum: [8, 22],  wind: [2, 7],  desc: 'ensolarado, ar muito seco', icon: '01d' },
      flood:    { temp: [21, 27], hum: [78, 96], wind: [3, 8],  desc: 'chuva forte, ar saturado', icon: '10d' },
      storm:    { temp: [23, 29], hum: [68, 88], wind: [9, 18], desc: 'tempestade com descargas', icon: '11d' },
    } as const;

    const key: keyof typeof profile = type && type in profile ? (type as keyof typeof profile) : 'wildfire';
    const p = profile[key];

    return {
      temperature: Math.round(rand(p.temp[0], p.temp[1], 0)),
      humidity: Math.round(rand(p.hum[0], p.hum[1], 1)),
      windSpeed: Number(rand(p.wind[0], p.wind[1], 2).toFixed(1)),
      description: p.desc,
      icon: p.icon,
      city: 'Região monitorada',
    };
  }
}

/**
 * Previsão de risco de ignição — dados da missão NASA SMAP
 * (umidade do solo) cruzados com vento e temperatura.
 * Esses dados normalmente vêm de endpoints como:
 *   https://nsidc.org/data/smap (Earthdata)
 *   https://grace.jpl.nasa.gov/data/
 * Processados pelo back-end Java e expostos em /v1/forecast/fire-risk.
 */
export async function fetchFireRiskForecast(): Promise<FireRiskForecast[]> {
  try {
    const { data } = await client.get<FireRiskForecast[]>('/v1/forecast/fire-risk');
    return data;
  } catch {
    await delay(700);
    return MOCK_FIRE_RISK;
  }
}

/**
 * Rota da fumaça — calculada a partir de aerossóis MODIS
 * (instrumento a bordo dos satélites Terra/Aqua) e direção do vento
 * na alta atmosfera. Conecta queimadas a cidades distantes.
 */
export async function fetchSmokePlumes(): Promise<SmokePlumeForecast[]> {
  try {
    const { data } = await client.get<SmokePlumeForecast[]>('/v1/forecast/smoke-plumes');
    return data;
  } catch {
    await delay(700);
    return MOCK_SMOKE_PLUMES;
  }
}

/**
 * Busca a rota da fumaça associada a um alerta específico.
 * Usado na tela de detalhe para mostrar o impacto downstream.
 */
export async function fetchSmokePlumeForAlert(
  alertId: string
): Promise<SmokePlumeForecast | undefined> {
  try {
    const { data } = await client.get<SmokePlumeForecast>(
      `/v1/forecast/smoke-plumes/by-alert/${alertId}`
    );
    return data;
  } catch {
    await delay(300);
    return MOCK_SMOKE_PLUMES.find((p) => p.sourceAlertId === alertId);
  }
}

// ============================================================
// NASA FIRMS — focos ativos globais em tempo real.
// API gratuita (precisa de MAP_KEY: https://firms.modaps.eosdis.nasa.gov/api/map_key)
// Atualizada a cada 3h pelos satélites VIIRS (Suomi-NPP, NOAA-20) e MODIS (Terra, Aqua).
// ============================================================

const FIRMS_MAP_KEY = 'SUA_CHAVE_FIRMS'; // obter em https://firms.modaps.eosdis.nasa.gov/api/map_key

/**
 * Busca focos ativos do mundo nas últimas 24h.
 * O endpoint retorna CSV — fazemos parse mínimo. Em qualquer falha
 * (sem chave, sem rede), cai para o mock realista.
 */
export async function fetchGlobalFireHotspots(): Promise<GlobalFireHotspot[]> {
  try {
    // Source: VIIRS_SNPP_NRT (Near Real-Time), área: world, range: 1 dia
    const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${FIRMS_MAP_KEY}/VIIRS_SNPP_NRT/world/1`;
    const { data } = await axios.get<string>(url, { timeout: 10000, responseType: 'text' });

    if (typeof data !== 'string' || !data.includes('latitude')) {
      throw new Error('Resposta FIRMS inválida');
    }

    // Parse CSV: latitude,longitude,brightness,scan,track,acq_date,acq_time,satellite,confidence,...
    const lines = data.trim().split('\n');
    const header = lines[0].split(',');
    const idx = (k: string) => header.indexOf(k);

    const hotspots: GlobalFireHotspot[] = lines.slice(1).map((line, i) => {
      const f = line.split(',');
      const conf = (f[idx('confidence')] || 'n').toLowerCase();
      return {
        id: `FRM-LIVE-${i}`,
        latitude: parseFloat(f[idx('latitude')]),
        longitude: parseFloat(f[idx('longitude')]),
        brightness: parseFloat(f[idx('bright_ti4')] || f[idx('brightness')] || '320'),
        confidence: conf.startsWith('h') ? 'high' : conf.startsWith('l') ? 'low' : 'nominal',
        satellite: 'Suomi-NPP',
        acquiredAt: `${f[idx('acq_date')]}T${(f[idx('acq_time')] || '0000').padStart(4, '0')}:00Z`,
        region: 'Detecção FIRMS',
      };
    });

    return hotspots;
  } catch {
    await delay(900);
    return MOCK_GLOBAL_HOTSPOTS;
  }
}
