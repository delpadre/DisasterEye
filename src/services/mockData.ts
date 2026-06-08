// ============================================================
// Dados simulados (fallback) — representam o retorno da API Java
// que processa dados do INPE/NASA. Usado quando offline ou sem chave.
// ============================================================

import { DisasterAlert, FireRiskForecast, GlobalFireHotspot, SmokePlumeForecast } from '@/types';

export const MOCK_ALERTS: DisasterAlert[] = [
  {
    id: 'ALT-2024-0912',
    type: 'wildfire',
    severity: 'critical',
    title: 'Foco de queimada de grande extensão',
    location: 'Porto Velho',
    state: 'RO',
    coordinates: { latitude: -8.7619, longitude: -63.9039 },
    detectedAt: '2026-05-28T09:14:00Z',
    description:
      'Sensor MODIS detectou anomalia térmica persistente em área florestal. Propagação acelerada por baixa umidade.',
    source: 'INPE',
    affectedAreaKm2: 142.5,
    confidence: 96,
  },
  {
    id: 'ALT-2024-0911',
    type: 'flood',
    severity: 'high',
    title: 'Transbordamento de rio em zona urbana',
    location: 'Blumenau',
    state: 'SC',
    coordinates: { latitude: -26.9194, longitude: -49.0661 },
    detectedAt: '2026-05-28T07:42:00Z',
    description:
      'Imagens de radar Sentinel indicam expansão da lâmina d\'água sobre área residencial após chuvas intensas.',
    source: 'NASA',
    affectedAreaKm2: 38.2,
    confidence: 89,
  },
  {
    id: 'ALT-2024-0910',
    type: 'wildfire',
    severity: 'high',
    title: 'Cluster de focos no cerrado',
    location: 'Cuiabá',
    state: 'MT',
    coordinates: { latitude: -15.601, longitude: -56.0974 },
    detectedAt: '2026-05-28T05:20:00Z',
    description:
      'Múltiplos focos identificados pelo programa Queimadas do INPE em vegetação seca do bioma cerrado.',
    source: 'INPE',
    affectedAreaKm2: 76.0,
    confidence: 91,
  },
  {
    id: 'ALT-2024-0909',
    type: 'storm',
    severity: 'moderate',
    title: 'Sistema convectivo intenso',
    location: 'Santos',
    state: 'SP',
    coordinates: { latitude: -23.9608, longitude: -46.3336 },
    detectedAt: '2026-05-27T22:10:00Z',
    description:
      'Satélite GOES-16 registra formação de células de tempestade com potencial de granizo no litoral.',
    source: 'NASA',
    affectedAreaKm2: 21.7,
    confidence: 78,
  },
  {
    id: 'ALT-2024-0908',
    type: 'drought',
    severity: 'moderate',
    title: 'Déficit hídrico prolongado',
    location: 'Petrolina',
    state: 'PE',
    coordinates: { latitude: -9.3891, longitude: -40.5027 },
    detectedAt: '2026-05-27T14:30:00Z',
    description:
      'Índice de vegetação NDVI em queda acentuada indica estresse hídrico severo na região do submédio São Francisco.',
    source: 'NASA',
    affectedAreaKm2: 310.4,
    confidence: 84,
  },
  {
    id: 'ALT-2024-0907',
    type: 'flood',
    severity: 'low',
    title: 'Acúmulo de água em planície',
    location: 'Pelotas',
    state: 'RS',
    coordinates: { latitude: -31.7654, longitude: -52.3376 },
    detectedAt: '2026-05-27T11:05:00Z',
    description:
      'Pequeno alagamento detectado em área de planície, monitoramento preventivo ativado.',
    source: 'INPE',
    affectedAreaKm2: 9.3,
    confidence: 72,
  },
  {
    id: 'ALT-2024-0906',
    type: 'wildfire',
    severity: 'critical',
    title: 'Incêndio avançando sobre unidade de conservação',
    location: 'Alta Floresta',
    state: 'MT',
    coordinates: { latitude: -9.8756, longitude: -56.0861 },
    detectedAt: '2026-05-27T03:48:00Z',
    description:
      'Frente de fogo de alta intensidade radiativa próxima a área protegida da Amazônia legal.',
    source: 'INPE',
    affectedAreaKm2: 205.1,
    confidence: 98,
  },
];

// ============================================================
// Previsão de risco de ignição — simula retorno da NASA SMAP.
// Dados coerentes com regiões brasileiras historicamente críticas.
// ============================================================

export const MOCK_FIRE_RISK: FireRiskForecast[] = [
  {
    id: 'FRK-2026-001',
    region: 'Norte do Mato Grosso',
    state: 'MT',
    coordinates: { latitude: -10.5, longitude: -55.4 },
    soilMoisture: 8.2,
    vegetationStress: 'extreme',
    temperature: 38,
    windSpeedKmh: 25,
    humidity: 18,
    vulnerabilityIndex: 94,
    ignitionWindowHours: 24,
    recommendation:
      'Risco crítico de ignição nas próximas 24h. Mobilização imediata de brigadas e proibição de queima controlada.',
    source: 'NASA SMAP',
  },
  {
    id: 'FRK-2026-002',
    region: 'Pantanal Sul',
    state: 'MS',
    coordinates: { latitude: -19.0, longitude: -57.6 },
    soilMoisture: 11.5,
    vegetationStress: 'severe',
    temperature: 36,
    windSpeedKmh: 22,
    humidity: 24,
    vulnerabilityIndex: 87,
    ignitionWindowHours: 48,
    recommendation:
      'Estresse hídrico severo no bioma. Posicionar equipes de combate e iniciar monitoramento aéreo.',
    source: 'NASA SMAP',
  },
  {
    id: 'FRK-2026-003',
    region: 'Sertão de Pernambuco',
    state: 'PE',
    coordinates: { latitude: -8.4, longitude: -38.2 },
    soilMoisture: 6.4,
    vegetationStress: 'extreme',
    temperature: 41,
    windSpeedKmh: 18,
    humidity: 14,
    vulnerabilityIndex: 91,
    ignitionWindowHours: 36,
    recommendation:
      'Déficit hídrico prolongado detectado por GRACE-FO. Alta probabilidade de propagação rápida.',
    source: 'NASA GRACE-FO',
  },
  {
    id: 'FRK-2026-004',
    region: 'Cerrado Tocantinense',
    state: 'TO',
    coordinates: { latitude: -10.2, longitude: -48.3 },
    soilMoisture: 14.8,
    vegetationStress: 'moderate',
    temperature: 34,
    windSpeedKmh: 16,
    humidity: 32,
    vulnerabilityIndex: 68,
    ignitionWindowHours: 72,
    recommendation:
      'Vulnerabilidade moderada. Manter vigilância em áreas de borda de mata.',
    source: 'NASA SMAP',
  },
  {
    id: 'FRK-2026-005',
    region: 'Sul do Pará',
    state: 'PA',
    coordinates: { latitude: -7.8, longitude: -52.4 },
    soilMoisture: 9.1,
    vegetationStress: 'severe',
    temperature: 37,
    windSpeedKmh: 20,
    humidity: 21,
    vulnerabilityIndex: 83,
    ignitionWindowHours: 48,
    recommendation:
      'Solo crítico e ventos de leste. Acionar protocolo de prevenção em áreas indígenas próximas.',
    source: 'NASA SMAP',
  },
  {
    id: 'FRK-2026-006',
    region: 'Vale do Paraíba',
    state: 'SP',
    coordinates: { latitude: -23.0, longitude: -45.5 },
    soilMoisture: 19.2,
    vegetationStress: 'normal',
    temperature: 28,
    windSpeedKmh: 12,
    humidity: 58,
    vulnerabilityIndex: 32,
    ignitionWindowHours: 168,
    recommendation: 'Condições estáveis. Sem necessidade de mobilização especial.',
    source: 'NASA SMAP',
  },
];

// ============================================================
// Rota da Fumaça — simula retorno do MODIS sobre aerossóis e
// trajetória dos ventos a partir de focos de queimada ativos.
// ============================================================

export const MOCK_SMOKE_PLUMES: SmokePlumeForecast[] = [
  {
    id: 'SMK-2026-001',
    sourceAlertId: 'ALT-2024-0906', // Alta Floresta - MT (queimada crítica do mock principal)
    sourceLocation: 'Alta Floresta — MT',
    windDirection: 'SE',
    windDirectionDegrees: 135,
    windSpeedKmh: 18,
    affectedCities: [
      { name: 'Sinop', state: 'MT', distanceKm: 320, etaHours: 6, pm25Reduction: 42, impact: 'high' },
      { name: 'Cuiabá', state: 'MT', distanceKm: 580, etaHours: 14, pm25Reduction: 28, impact: 'moderate' },
      { name: 'Goiânia', state: 'GO', distanceKm: 980, etaHours: 28, pm25Reduction: 15, impact: 'moderate' },
      { name: 'Brasília', state: 'DF', distanceKm: 1120, etaHours: 34, pm25Reduction: 9, impact: 'low' },
    ],
    source: 'NASA MODIS',
  },
  {
    id: 'SMK-2026-002',
    sourceAlertId: 'ALT-2024-0912', // Porto Velho - RO
    sourceLocation: 'Porto Velho — RO',
    windDirection: 'E',
    windDirectionDegrees: 90,
    windSpeedKmh: 15,
    affectedCities: [
      { name: 'Ji-Paraná', state: 'RO', distanceKm: 280, etaHours: 7, pm25Reduction: 48, impact: 'hazardous' },
      { name: 'Vilhena', state: 'RO', distanceKm: 620, etaHours: 16, pm25Reduction: 22, impact: 'moderate' },
      { name: 'Cuiabá', state: 'MT', distanceKm: 1180, etaHours: 32, pm25Reduction: 11, impact: 'low' },
    ],
    source: 'NASA MODIS',
  },
  {
    id: 'SMK-2026-003',
    sourceAlertId: 'ALT-2024-0910', // Cuiabá - MT
    sourceLocation: 'Cuiabá — MT',
    windDirection: 'S',
    windDirectionDegrees: 180,
    windSpeedKmh: 21,
    affectedCities: [
      { name: 'Campo Grande', state: 'MS', distanceKm: 690, etaHours: 12, pm25Reduction: 31, impact: 'high' },
      { name: 'Dourados', state: 'MS', distanceKm: 920, etaHours: 19, pm25Reduction: 18, impact: 'moderate' },
      { name: 'Maringá', state: 'PR', distanceKm: 1380, etaHours: 30, pm25Reduction: 8, impact: 'low' },
    ],
    source: 'NASA MAIA',
  },
];

// ============================================================
// Focos globais simulados — coerentes com regiões historicamente
// críticas detectadas pela NASA FIRMS. Cada ponto representa um
// hotspot real-time de queimada/anomalia térmica.
// ============================================================

const now = () => new Date(Date.now() - Math.random() * 18 * 3600 * 1000).toISOString();

const makeHotspot = (
  id: string,
  lat: number,
  lon: number,
  region: string,
  confidence: 'low' | 'nominal' | 'high' = 'nominal',
  brightness = 320 + Math.random() * 60,
  satellite: 'Terra' | 'Aqua' | 'Suomi-NPP' | 'NOAA-20' = 'Suomi-NPP'
): GlobalFireHotspot => ({
  id,
  latitude: lat,
  longitude: lon,
  brightness: Math.round(brightness),
  confidence,
  satellite,
  acquiredAt: now(),
  region,
});

export const MOCK_GLOBAL_HOTSPOTS: GlobalFireHotspot[] = [
  // ---------- Amazônia brasileira ----------
  makeHotspot('FRM-001', -3.1, -60.0, 'Amazônia · BR', 'high', 358),
  makeHotspot('FRM-002', -5.5, -57.5, 'Amazônia · BR', 'high', 372),
  makeHotspot('FRM-003', -9.8, -56.0, 'Mato Grosso · BR', 'high', 365),
  makeHotspot('FRM-004', -8.7, -63.9, 'Rondônia · BR', 'high', 350),
  makeHotspot('FRM-005', -7.8, -52.4, 'Pará · BR', 'nominal'),
  makeHotspot('FRM-006', -11.0, -55.3, 'Amazônia · BR', 'nominal'),
  makeHotspot('FRM-007', -15.6, -56.1, 'Cerrado · BR', 'nominal'),
  makeHotspot('FRM-008', -19.0, -57.6, 'Pantanal · BR', 'high', 380),
  makeHotspot('FRM-009', -10.5, -68.5, 'Acre · BR', 'nominal'),
  makeHotspot('FRM-010', -6.4, -64.7, 'Amazônia · BR', 'nominal'),
  makeHotspot('FRM-011', -13.2, -54.0, 'Mato Grosso · BR', 'high', 340),
  makeHotspot('FRM-012', -8.0, -49.5, 'Tocantins · BR', 'low'),

  // ---------- África subsaariana (queima de savana) ----------
  makeHotspot('FRM-020', -8.5, 23.5, 'RDC', 'high', 355, 'Terra'),
  makeHotspot('FRM-021', -12.0, 27.0, 'Zâmbia', 'high', 348),
  makeHotspot('FRM-022', -14.5, 31.0, 'Moçambique', 'nominal'),
  makeHotspot('FRM-023', -11.5, 17.0, 'Angola', 'high', 342),
  makeHotspot('FRM-024', 6.5, 22.0, 'Rep. Centro-Africana', 'nominal'),
  makeHotspot('FRM-025', 9.0, 30.0, 'Sudão do Sul', 'nominal'),
  makeHotspot('FRM-026', -2.5, 28.5, 'África Central', 'nominal'),
  makeHotspot('FRM-027', -16.0, 35.5, 'Moçambique', 'low'),
  makeHotspot('FRM-028', 7.5, 12.0, 'Nigéria · Norte', 'nominal'),
  makeHotspot('FRM-029', -18.0, 25.0, 'Botsuana', 'nominal'),

  // ---------- Sudeste Asiático ----------
  makeHotspot('FRM-040', -2.2, 113.5, 'Bornéu · Indonésia', 'high', 360),
  makeHotspot('FRM-041', -0.8, 101.5, 'Sumatra · Indonésia', 'high', 345),
  makeHotspot('FRM-042', -3.5, 115.0, 'Bornéu · Indonésia', 'nominal'),
  makeHotspot('FRM-043', 19.5, 99.5, 'Tailândia · Norte', 'nominal'),
  makeHotspot('FRM-044', 22.0, 95.5, 'Mianmar', 'low'),

  // ---------- Austrália ----------
  makeHotspot('FRM-050', -14.5, 132.0, 'Território Norte · AUS', 'nominal'),
  makeHotspot('FRM-051', -17.5, 138.0, 'Queensland · AUS', 'nominal'),
  makeHotspot('FRM-052', -25.5, 119.0, 'Austrália Ocidental', 'low'),

  // ---------- Sibéria (Rússia) ----------
  makeHotspot('FRM-060', 62.0, 130.0, 'Iacútia · Rússia', 'high', 332, 'NOAA-20'),
  makeHotspot('FRM-061', 65.5, 145.0, 'Iacútia · Rússia', 'nominal'),
  makeHotspot('FRM-062', 58.0, 110.0, 'Sibéria · Rússia', 'nominal'),
  makeHotspot('FRM-063', 61.5, 120.0, 'Sibéria · Rússia', 'high', 328),
  makeHotspot('FRM-064', 55.0, 88.0, 'Sibéria Oriental', 'low'),

  // ---------- América do Norte ----------
  makeHotspot('FRM-070', 38.5, -120.5, 'Califórnia · EUA', 'high', 355, 'Aqua'),
  makeHotspot('FRM-071', 44.0, -120.0, 'Oregon · EUA', 'nominal'),
  makeHotspot('FRM-072', 53.5, -118.0, 'Alberta · Canadá', 'high', 340),
  makeHotspot('FRM-073', 58.0, -125.0, 'Colúmbia Britânica', 'nominal'),

  // ---------- Mediterrâneo / Europa do Sul ----------
  makeHotspot('FRM-080', 38.0, 22.5, 'Grécia', 'high', 338),
  makeHotspot('FRM-081', 40.0, -7.0, 'Portugal', 'nominal'),
  makeHotspot('FRM-082', 41.5, 14.0, 'Itália · Sul', 'low'),

  // ---------- México / América Central ----------
  makeHotspot('FRM-090', 17.5, -91.0, 'Chiapas · México', 'nominal'),
  makeHotspot('FRM-091', 15.0, -88.0, 'Honduras', 'low'),
];
