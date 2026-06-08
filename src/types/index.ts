// ============================================================
// Tipagem central do DisasterEye
// ============================================================

export type DisasterType = 'flood' | 'wildfire' | 'storm' | 'drought';

export type DisasterSeverity = 'low' | 'moderate' | 'high' | 'critical';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface DisasterAlert {
  id: string;
  type: DisasterType;
  severity: DisasterSeverity;
  title: string;
  location: string;
  state: string;
  coordinates: Coordinates;
  detectedAt: string; // ISO date
  description: string;
  source: 'INPE' | 'NASA';
  affectedAreaKm2: number;
  confidence: number; // 0-100
  satelliteImage?: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  city: string;
}

export interface DashboardStats {
  activeAlerts: number;
  criticalAlerts: number;
  monitoredAreas: number;
  resolvedToday: number;
}

// Filtros e ordenação para a listagem
export type SortOption = 'recent' | 'severity' | 'area';

export interface AlertFilters {
  type: DisasterType | 'all';
  severity: DisasterSeverity | 'all';
  search: string;
  sort: SortOption;
}

// Estado do tema
export type ThemeMode = 'light' | 'dark';

// ============================================================
// Previsão de risco de ignição — dados da missão NASA SMAP
// (Soil Moisture Active Passive). Calcula um Índice de
// Vulnerabilidade Espacial combinando umidade do solo, vento,
// temperatura e estresse da vegetação.
// ============================================================

export type VegetationStress = 'normal' | 'moderate' | 'severe' | 'extreme';

export interface FireRiskForecast {
  id: string;
  region: string;
  state: string;
  coordinates: Coordinates;
  soilMoisture: number; // % volumétrica (SMAP)
  vegetationStress: VegetationStress;
  temperature: number; // °C
  windSpeedKmh: number;
  humidity: number; // %
  vulnerabilityIndex: number; // 0-100
  ignitionWindowHours: number; // janela prevista
  recommendation: string;
  source: 'NASA SMAP' | 'NASA GRACE-FO';
}

// ============================================================
// Rota da fumaça — dados do instrumento MODIS (Terra/Aqua).
// Mostra para onde a fuligem está sendo levada pelos ventos
// e o impacto previsto em cidades distantes.
// ============================================================

export type AirQualityImpact = 'low' | 'moderate' | 'high' | 'hazardous';

export interface SmokeImpactedCity {
  name: string;
  state: string;
  distanceKm: number;
  etaHours: number;
  pm25Reduction: number; // queda prevista na qualidade do ar (%)
  impact: AirQualityImpact;
}

export interface SmokePlumeForecast {
  id: string;
  sourceAlertId: string;
  sourceLocation: string;
  windDirection: 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';
  windDirectionDegrees: number; // 0-359 para visualização
  windSpeedKmh: number;
  affectedCities: SmokeImpactedCity[];
  source: 'NASA MODIS' | 'NASA MAIA';
}

// ============================================================
// Focos globais em tempo real — dados da NASA FIRMS
// (Fire Information for Resource Management System).
// Cada ponto é um foco detectado por sensores MODIS/VIIRS.
// ============================================================

export type HotspotConfidence = 'low' | 'nominal' | 'high';

export interface GlobalFireHotspot {
  id: string;
  latitude: number;
  longitude: number;
  brightness: number; // temperatura de brilho em Kelvin
  confidence: HotspotConfidence;
  satellite: 'Terra' | 'Aqua' | 'Suomi-NPP' | 'NOAA-20';
  acquiredAt: string; // ISO
  region: string; // rótulo geográfico aproximado
}
