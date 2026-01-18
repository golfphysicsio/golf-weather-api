from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


# ============================================================================
# DUAL-UNIT VALUE MODELS
# These models contain both imperial and metric values
# ============================================================================


class DualTemperature(BaseModel):
    """Temperature in both Fahrenheit and Celsius."""
    fahrenheit: float
    celsius: float


class DualDistance(BaseModel):
    """Distance in both yards and meters."""
    yards: float
    meters: float


class DualAltitude(BaseModel):
    """Altitude in both feet and meters."""
    feet: float
    meters: float


class DualSpeed(BaseModel):
    """Speed in both mph and km/h."""
    mph: float
    kmh: float


class DualPressure(BaseModel):
    """Pressure in both inHg and hPa."""
    inhg: float
    hpa: float


class DualTrajectoryPoint(BaseModel):
    """Trajectory point with dual-unit coordinates."""
    x: DualDistance  # Distance downrange
    y: DualDistance  # Height
    z: DualDistance  # Lateral position (positive = right)


# ============================================================================
# LEGACY SINGLE-UNIT MODELS (kept for backward compatibility)
# ============================================================================


class TrajectoryPoint(BaseModel):
    x: float  # Distance downrange (yards)
    y: float  # Height (yards)
    z: float  # Lateral position (yards, positive = right)


class AdjustedResults(BaseModel):
    carry_yards: float
    total_yards: float
    lateral_drift_yards: float
    apex_height_yards: float
    flight_time_seconds: float
    landing_angle_deg: float


class ImpactBreakdown(BaseModel):
    wind_effect_yards: float
    wind_lateral_yards: float
    temperature_effect_yards: float
    altitude_effect_yards: float
    humidity_effect_yards: float
    total_adjustment_yards: float


class ConditionsUsed(BaseModel):
    location: Optional[str] = None
    wind_speed_mph: float
    wind_direction_deg: float
    temperature_f: float
    altitude_ft: float
    humidity_pct: float
    pressure_inhg: float
    conditions_text: Optional[str] = None
    fetched_at: Optional[datetime] = None


class TrajectoryResponse(BaseModel):
    adjusted: AdjustedResults
    baseline: AdjustedResults
    impact_breakdown: ImpactBreakdown
    equivalent_calm_distance_yards: float
    trajectory_points: List[TrajectoryPoint]
    conditions_used: Optional[ConditionsUsed] = None


class ConditionsResponse(BaseModel):
    location: str
    wind_speed_mph: float
    wind_direction_deg: float
    temperature_f: float
    altitude_ft: float
    humidity_pct: float
    pressure_inhg: float
    conditions_text: str
    fetched_at: datetime


# ============================================================================
# DUAL-UNIT RESPONSE MODELS
# These contain both imperial and metric values in every response
# ============================================================================


class DualAdjustedResults(BaseModel):
    """Trajectory results with both imperial and metric units."""
    carry: DualDistance
    total: DualDistance
    lateral_drift: DualDistance
    apex_height: DualDistance
    flight_time_seconds: float
    landing_angle_deg: float


class DualImpactBreakdown(BaseModel):
    """Impact breakdown with both imperial and metric units."""
    wind_effect: DualDistance
    wind_lateral: DualDistance
    temperature_effect: DualDistance
    altitude_effect: DualDistance
    humidity_effect: DualDistance
    total_adjustment: DualDistance


class DualConditionsUsed(BaseModel):
    """Conditions with both imperial and metric units."""
    source: Optional[str] = None  # "real", "override", or "preset"
    preset_name: Optional[str] = None  # Name of preset if used
    location: Optional[str] = None
    wind_speed: DualSpeed
    wind_direction_deg: float
    temperature: DualTemperature
    altitude: DualAltitude
    humidity_pct: float
    pressure: DualPressure
    conditions_text: Optional[str] = None
    fetched_at: Optional[datetime] = None


class DualTrajectoryResponse(BaseModel):
    """
    Full trajectory response with both imperial and metric units.

    This response format returns all measurements in both unit systems,
    allowing clients to display values in their preferred units without
    additional API calls.
    """
    adjusted: DualAdjustedResults
    baseline: DualAdjustedResults
    impact_breakdown: DualImpactBreakdown
    equivalent_calm_distance: DualDistance
    trajectory_points: List[DualTrajectoryPoint]
    conditions_used: Optional[DualConditionsUsed] = None
    units_preference: str = "imperial"  # Indicates client's stated preference


class DualConditionsResponse(BaseModel):
    """
    Conditions response with both imperial and metric units.

    Returns weather conditions in both unit systems.
    """
    location: str
    wind_speed: DualSpeed
    wind_direction_deg: float
    temperature: DualTemperature
    altitude: DualAltitude
    humidity_pct: float
    pressure: DualPressure
    conditions_text: str
    fetched_at: datetime
    units_preference: str = "imperial"  # Indicates client's stated preference


class HealthResponse(BaseModel):
    status: str
    version: str
    timestamp: datetime


# ============================================================================
# GAMING ENHANCEMENT RESPONSE MODELS
# ============================================================================


class PresetConditions(BaseModel):
    """Weather conditions for a preset."""
    wind_speed: float
    wind_direction: float
    temperature: float
    humidity: float
    altitude: float
    air_pressure: float


class WeatherPreset(BaseModel):
    """A single weather preset."""
    name: str
    description: str
    conditions: PresetConditions
    difficulty: str
    tags: List[str]


class PresetsResponse(BaseModel):
    """Response for GET /api/v1/presets endpoint."""
    presets: dict  # Key: preset_id, Value: WeatherPreset
    count: int


class GamingConditionsUsed(BaseModel):
    """Extended conditions for gaming responses."""
    source: str  # "real", "override", or "preset"
    preset_name: Optional[str] = None
    handicap_tier: Optional[str] = None  # "scratch", "low", "mid", "high"
    player_handicap: Optional[int] = None
    club: Optional[str] = None
    stock_carry: Optional[float] = None  # Expected carry for this handicap/club
    wind_speed_mph: float
    wind_direction_deg: float
    temperature_f: float
    altitude_ft: float
    humidity_pct: float
    pressure_inhg: float
    location: Optional[str] = None
    conditions_text: Optional[str] = None


class GamingTrajectoryResponse(BaseModel):
    """
    Gaming-enhanced trajectory response.

    Includes all standard trajectory data plus:
    - Source of conditions (real, override, or preset)
    - Handicap tier information if using handicap-based distances
    - Stock carry distance for comparison
    """
    adjusted: DualAdjustedResults
    baseline: DualAdjustedResults
    impact_breakdown: DualImpactBreakdown
    equivalent_calm_distance: DualDistance
    trajectory_points: List[DualTrajectoryPoint]
    conditions_used: GamingConditionsUsed
    units_preference: str = "imperial"
