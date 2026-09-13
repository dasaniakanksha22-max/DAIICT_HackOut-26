export type SiteType = 'solar' | 'wind' | 'hybrid';

export type RiskLevel = 'normal' | 'elevated' | 'critical';

export type RolePerspective = 'grid_operator' | 'plant_owner' | 'energy_trader';

export interface RenewableSite {
  id: string;
  name: string;
  state: string;
  location: string;
  type: SiteType;
  capacityMW: number;
  bessCapacityMWh: number;
  bessMaxPowerMW: number;
  lat: number;
  lon: number;
  gridIntertieKV: number;
  operator: string;
  historicalAnnualYieldGWh: number;
  description: string;
}

export interface HourlyForecastPoint {
  time: string;
  hour: number;
  dateStr: string;
  timestamp: number;
  blockIndex: number; // 15-min block (1 to 96) or 1-hr
  p10MW: number;      // Conservative lower bound
  p50MW: number;      // Expected median forecast
  p90MW: number;      // Optimistic upper bound
  scheduleMW: number; // Contracted day-ahead schedule
  ghi: number;        // Global Horizontal Irradiance (W/m²)
  dni: number;        // Direct Normal Irradiance (W/m²)
  windSpeed100m: number; // m/s
  temperatureC: number;  // °C
  cloudCoverPct: number; // 0 - 100%
  uncertaintySpreadMW: number;
  riskLevel: RiskLevel;
  // Dispatch actions output by PuLP optimizer
  bessDispatchMW: number; // Positive = discharging, Negative = charging
  bessSoCPct: number;     // 10% - 90%
  curtailmentMW: number;  // Spilled clean energy if grid constrained
  reserveCallMW: number;  // Peaker backup requirement avoided
  dsmPenaltyRiskInr: number; // Indian CERC deviation settlement penalty exposure
}

export interface ShapFactor {
  featureName: string;
  category: 'atmospheric' | 'aerodynamic' | 'thermal' | 'grid_lag';
  valueDisplay: string;
  impactMW: number; // Delta against base expectation
  impactPercentage: number;
  direction: 'positive' | 'negative';
  description: string;
}

export interface DispatchAction {
  id: string;
  title: string;
  type: 'bess_charge' | 'bess_discharge' | 'curtailment' | 'spinning_reserve' | 'demand_response';
  scheduledTime: string;
  targetMW: number;
  durationHours: number;
  priority: 'critical' | 'recommended' | 'optional';
  costSavingsInr: number;
  carbonReductionTons: number;
  status: 'pending' | 'executed' | 'dismissed';
  rationale: string;
}

export interface GridRiskSummary {
  overallLevel: RiskLevel;
  gridFrequencyHz: number;
  maxUncertaintySpreadMW: number;
  peakDeficitMW: number;
  peakSurplusMW: number;
  totalCurtailmentRiskMWh: number;
  totalBessAbsorptionMWh: number;
  estimatedDsmPenaltyRiskInr: number;
  avoidedDsmPenaltyInr: number;
  co2DisplacedTons: number;
}

export interface ScenarioPreset {
  id: string;
  name: string;
  tagline: string;
  description: string;
  cloudMultiplier: number;
  windMultiplier: number;
  tempOffsetC: number;
  gridCongestionActive: boolean;
  thermalMtlConstraint: boolean;
}
