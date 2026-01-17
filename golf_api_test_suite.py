#!/usr/bin/env python3
"""
Golf Weather Physics API - Comprehensive Validation Test Suite
Based on TrackMan, Titleist, and industry benchmark data

BENCHMARK DATA SOURCES:
- TrackMan Tour Averages (PGA/LPGA)
- Titleist Learning Lab (altitude calculations)  
- GolfWRX wind studies
- Shot Scope amateur distance data
- Andrew Rice Golf (temperature studies)

KEY BENCHMARKS:
Wind Effects (6-iron baseline ~153 yds at 80mph club speed):
  - 10 mph headwind: -10% (~-15 yds)
  - 20 mph headwind: -22% (~-34 yds)
  - 10 mph tailwind: +7% (~+11 yds)
  - 20 mph tailwind: +12% (~+18 yds)
  - 10 mph crosswind: ~13 yds lateral drift
  - 20 mph crosswind: ~27 yds lateral drift

Altitude Effects (Titleist formula: elevation_ft × 0.00116):
  - Denver 5,280 ft: +6.1%
  - 2,500 ft: +2.9%
  - 7,500 ft: +8.7%

Temperature Effects (Andrew Rice):
  - 2 yards per 10°F change (driver)
  - 1.5 yards per 10°F change (irons)
"""

import requests
import json
from dataclasses import dataclass
from typing import Optional, List, Tuple
import math

# API endpoint
API_BASE = "https://frontend-one-mauve-10.vercel.app"

@dataclass
class TestScenario:
    name: str
    club: str
    baseline_carry: float  # Expected carry at sea level, 70°F, no wind
    temperature: float  # Fahrenheit
    wind_speed: float  # mph
    wind_direction: float  # degrees (0=N, 90=E, 180=S, 270=W)
    shot_direction: float  # degrees
    altitude: float  # feet
    humidity: float  # percentage
    expected_carry_min: float  # Expected adjusted carry (min)
    expected_carry_max: float  # Expected adjusted carry (max)
    expected_drift_min: float  # Expected lateral drift (min) - positive = right
    expected_drift_max: float  # Expected lateral drift (max)
    tolerance_yards: float = 8.0  # Acceptable error margin
    category: str = "general"

# Mid-handicap player baseline distances (carry, in yards)
# Based on Shot Scope 10-15 handicap data
BASELINE_DISTANCES = {
    "Driver": 225,
    "3-Wood": 200,
    "5-Wood": 185,
    "4-Iron": 175,
    "5-Iron": 165,
    "6-Iron": 155,
    "7-Iron": 145,
    "8-Iron": 135,
    "9-Iron": 125,
    "PW": 115,
    "GW": 100,
    "SW": 85,
    "LW": 70
}

def calculate_expected_wind_effect(baseline: float, wind_speed: float, wind_angle: float) -> Tuple[float, float, float, float]:
    """
    Calculate expected carry and drift based on TrackMan benchmarks.
    wind_angle: 0 = pure headwind, 180 = pure tailwind, 90/270 = crosswind
    Returns: (min_carry, max_carry, min_drift, max_drift)
    """
    # Decompose wind into head/tail and cross components
    headwind_component = wind_speed * math.cos(math.radians(wind_angle))  # positive = headwind
    crosswind_component = abs(wind_speed * math.sin(math.radians(wind_angle)))
    
    # Calculate carry effect using TrackMan benchmarks
    carry_effect = 0
    if headwind_component > 0:  # Headwind
        # HW 10 mph: -10%, HW 20 mph: -22%
        # Non-linear: roughly -1% per mph up to 10, then -1.2% per mph above 10
        if headwind_component <= 10:
            carry_effect = -headwind_component * 0.01 * baseline
        else:
            carry_effect = -0.10 * baseline - (headwind_component - 10) * 0.012 * baseline
    else:  # Tailwind (negative headwind_component)
        tailwind = abs(headwind_component)
        # TW 10 mph: +7%, TW 20 mph: +12%
        if tailwind <= 10:
            carry_effect = tailwind * 0.007 * baseline
        else:
            carry_effect = 0.07 * baseline + (tailwind - 10) * 0.005 * baseline
    
    # Calculate lateral drift using benchmark: 6-iron at 10 mph = ~13 yards, 20 mph = ~27 yards
    # Scale by club distance (shorter clubs = less drift)
    drift_scale = baseline / 155  # 155 is 6-iron baseline
    if crosswind_component <= 10:
        drift = crosswind_component * 1.3 * drift_scale
    else:
        drift = 13 * drift_scale + (crosswind_component - 10) * 1.4 * drift_scale
    
    expected_carry = baseline + carry_effect
    
    # Return ranges with ±15% tolerance
    tolerance = 0.15
    return (
        expected_carry * (1 - tolerance),
        expected_carry * (1 + tolerance),
        drift * 0.5,  # Min drift
        drift * 1.5   # Max drift
    )

def calculate_expected_altitude_effect(baseline: float, altitude_ft: float) -> Tuple[float, float]:
    """
    Calculate expected altitude effect based on Titleist formula.
    Formula: altitude_ft × 0.00116 = percentage increase
    """
    pct_increase = altitude_ft * 0.00116
    expected = baseline * (1 + pct_increase)
    tolerance = 0.20  # ±20% tolerance
    return (expected * (1 - tolerance), expected * (1 + tolerance))

def calculate_expected_temp_effect(baseline: float, temp_f: float, club: str) -> float:
    """
    Calculate expected temperature effect.
    Rule: ~2 yards per 10°F change from 75°F for driver, ~1.5 for irons
    """
    temp_diff = temp_f - 75
    if "Driver" in club or "Wood" in club:
        return (temp_diff / 10) * 2
    else:
        return (temp_diff / 10) * 1.5

# Generate 50 test scenarios
TEST_SCENARIOS = [
    # === WIND TESTS (15 scenarios) ===
    
    # Pure headwind tests
    TestScenario(
        name="6-Iron 10mph Headwind",
        club="6-Iron",
        baseline_carry=155,
        temperature=70,
        wind_speed=10,
        wind_direction=180,  # Wind from south (into player facing north)
        shot_direction=0,
        altitude=0,
        humidity=50,
        expected_carry_min=125,  # -10% = 139, but benchmarks show more
        expected_carry_max=145,
        expected_drift_min=0,
        expected_drift_max=2,
        category="wind_headwind"
    ),
    TestScenario(
        name="6-Iron 20mph Headwind",
        club="6-Iron",
        baseline_carry=155,
        temperature=70,
        wind_speed=20,
        wind_direction=180,
        shot_direction=0,
        altitude=0,
        humidity=50,
        expected_carry_min=110,  # -22% = ~121, allow range
        expected_carry_max=130,
        expected_drift_min=0,
        expected_drift_max=2,
        category="wind_headwind"
    ),
    TestScenario(
        name="7-Iron 15mph Headwind",
        club="7-Iron",
        baseline_carry=145,
        temperature=70,
        wind_speed=15,
        wind_direction=180,
        shot_direction=0,
        altitude=0,
        humidity=50,
        expected_carry_min=115,  
        expected_carry_max=135,
        expected_drift_min=0,
        expected_drift_max=2,
        category="wind_headwind"
    ),
    TestScenario(
        name="Driver 20mph Headwind",
        club="Driver",
        baseline_carry=225,
        temperature=70,
        wind_speed=20,
        wind_direction=180,
        shot_direction=0,
        altitude=0,
        humidity=50,
        expected_carry_min=165,  # -22% = ~176, drivers affected more
        expected_carry_max=195,
        expected_drift_min=0,
        expected_drift_max=3,
        category="wind_headwind"
    ),
    
    # Pure tailwind tests
    TestScenario(
        name="6-Iron 10mph Tailwind",
        club="6-Iron",
        baseline_carry=155,
        temperature=70,
        wind_speed=10,
        wind_direction=0,  # Wind from north (helping player facing north)
        shot_direction=0,
        altitude=0,
        humidity=50,
        expected_carry_min=160,  # +7% = ~166
        expected_carry_max=175,
        expected_drift_min=0,
        expected_drift_max=2,
        category="wind_tailwind"
    ),
    TestScenario(
        name="6-Iron 20mph Tailwind",
        club="6-Iron",
        baseline_carry=155,
        temperature=70,
        wind_speed=20,
        wind_direction=0,
        shot_direction=0,
        altitude=0,
        humidity=50,
        expected_carry_min=168,  # +12% = ~174
        expected_carry_max=185,
        expected_drift_min=0,
        expected_drift_max=2,
        category="wind_tailwind"
    ),
    TestScenario(
        name="Driver 15mph Tailwind",
        club="Driver",
        baseline_carry=225,
        temperature=70,
        wind_speed=15,
        wind_direction=0,
        shot_direction=0,
        altitude=0,
        humidity=50,
        expected_carry_min=235,  
        expected_carry_max=260,
        expected_drift_min=0,
        expected_drift_max=3,
        category="wind_tailwind"
    ),
    
    # Crosswind tests
    TestScenario(
        name="6-Iron 10mph Crosswind (L→R)",
        club="6-Iron",
        baseline_carry=155,
        temperature=70,
        wind_speed=10,
        wind_direction=270,  # Wind from west
        shot_direction=0,
        altitude=0,
        humidity=50,
        expected_carry_min=150,  
        expected_carry_max=162,
        expected_drift_min=8,   # ~13 yards expected
        expected_drift_max=18,
        category="wind_crosswind"
    ),
    TestScenario(
        name="6-Iron 20mph Crosswind (L→R)",
        club="6-Iron",
        baseline_carry=155,
        temperature=70,
        wind_speed=20,
        wind_direction=270,
        shot_direction=0,
        altitude=0,
        humidity=50,
        expected_carry_min=148,  
        expected_carry_max=165,
        expected_drift_min=18,   # ~27 yards expected
        expected_drift_max=35,
        category="wind_crosswind"
    ),
    TestScenario(
        name="9-Iron 15mph Crosswind",
        club="9-Iron",
        baseline_carry=125,
        temperature=70,
        wind_speed=15,
        wind_direction=90,  # Wind from east
        shot_direction=0,
        altitude=0,
        humidity=50,
        expected_carry_min=118,  
        expected_carry_max=132,
        expected_drift_min=10,   
        expected_drift_max=22,
        category="wind_crosswind"
    ),
    
    # Quartering wind tests
    TestScenario(
        name="6-Iron 15mph Quartering Headwind",
        club="6-Iron",
        baseline_carry=155,
        temperature=70,
        wind_speed=15,
        wind_direction=225,  # SW wind = quartering headwind
        shot_direction=0,
        altitude=0,
        humidity=50,
        expected_carry_min=130,  
        expected_carry_max=150,
        expected_drift_min=5,   
        expected_drift_max=18,
        category="wind_quartering"
    ),
    TestScenario(
        name="8-Iron 12mph Quartering Tailwind",
        club="8-Iron",
        baseline_carry=135,
        temperature=70,
        wind_speed=12,
        wind_direction=315,  # NW wind = quartering tailwind
        shot_direction=0,
        altitude=0,
        humidity=50,
        expected_carry_min=138,  
        expected_carry_max=152,
        expected_drift_min=3,   
        expected_drift_max=12,
        category="wind_quartering"
    ),
    
    # Asymmetry test: headwind should hurt MORE than tailwind helps
    TestScenario(
        name="Asymmetry Check - 7-Iron 10mph HW",
        club="7-Iron",
        baseline_carry=145,
        temperature=70,
        wind_speed=10,
        wind_direction=180,
        shot_direction=0,
        altitude=0,
        humidity=50,
        expected_carry_min=125,  # Should lose ~14-16 yds
        expected_carry_max=138,
        expected_drift_min=0,
        expected_drift_max=2,
        category="wind_asymmetry"
    ),
    TestScenario(
        name="Asymmetry Check - 7-Iron 10mph TW",
        club="7-Iron",
        baseline_carry=145,
        temperature=70,
        wind_speed=10,
        wind_direction=0,
        shot_direction=0,
        altitude=0,
        humidity=50,
        expected_carry_min=150,  # Should gain ~10-12 yds
        expected_carry_max=162,
        expected_drift_min=0,
        expected_drift_max=2,
        category="wind_asymmetry"
    ),
    
    # Strong wind test
    TestScenario(
        name="PW 25mph Headwind",
        club="PW",
        baseline_carry=115,
        temperature=70,
        wind_speed=25,
        wind_direction=180,
        shot_direction=0,
        altitude=0,
        humidity=50,
        expected_carry_min=75,  # Very significant loss
        expected_carry_max=95,
        expected_drift_min=0,
        expected_drift_max=3,
        category="wind_extreme"
    ),
    
    # === ALTITUDE TESTS (12 scenarios) ===
    
    TestScenario(
        name="Driver Denver (5,280 ft)",
        club="Driver",
        baseline_carry=225,
        temperature=70,
        wind_speed=0,
        wind_direction=0,
        shot_direction=0,
        altitude=5280,
        humidity=50,
        expected_carry_min=233,  # +6.1% = ~238
        expected_carry_max=250,
        expected_drift_min=0,
        expected_drift_max=1,
        category="altitude"
    ),
    TestScenario(
        name="6-Iron Denver (5,280 ft)",
        club="6-Iron",
        baseline_carry=155,
        temperature=70,
        wind_speed=0,
        wind_direction=0,
        shot_direction=0,
        altitude=5280,
        humidity=50,
        expected_carry_min=160,  # +6.1% = ~165
        expected_carry_max=175,
        expected_drift_min=0,
        expected_drift_max=1,
        category="altitude"
    ),
    TestScenario(
        name="7-Iron 2,500 ft Elevation",
        club="7-Iron",
        baseline_carry=145,
        temperature=70,
        wind_speed=0,
        wind_direction=0,
        shot_direction=0,
        altitude=2500,
        humidity=50,
        expected_carry_min=147,  # +2.9% = ~149
        expected_carry_max=158,
        expected_drift_min=0,
        expected_drift_max=1,
        category="altitude"
    ),
    TestScenario(
        name="Driver 7,500 ft (Mexico City)",
        club="Driver",
        baseline_carry=225,
        temperature=70,
        wind_speed=0,
        wind_direction=0,
        shot_direction=0,
        altitude=7500,
        humidity=50,
        expected_carry_min=240,  # +8.7% = ~245
        expected_carry_max=260,
        expected_drift_min=0,
        expected_drift_max=1,
        category="altitude"
    ),
    TestScenario(
        name="9-Iron Denver",
        club="9-Iron",
        baseline_carry=125,
        temperature=70,
        wind_speed=0,
        wind_direction=0,
        shot_direction=0,
        altitude=5280,
        humidity=50,
        expected_carry_min=130,  # +6.1% = ~133
        expected_carry_max=142,
        expected_drift_min=0,
        expected_drift_max=1,
        category="altitude"
    ),
    TestScenario(
        name="PW 1,000 ft Elevation",
        club="PW",
        baseline_carry=115,
        temperature=70,
        wind_speed=0,
        wind_direction=0,
        shot_direction=0,
        altitude=1000,
        humidity=50,
        expected_carry_min=115,  # +1.2% = ~116
        expected_carry_max=122,
        expected_drift_min=0,
        expected_drift_max=1,
        category="altitude"
    ),
    TestScenario(
        name="5-Iron 4,000 ft",
        club="5-Iron",
        baseline_carry=165,
        temperature=70,
        wind_speed=0,
        wind_direction=0,
        shot_direction=0,
        altitude=4000,
        humidity=50,
        expected_carry_min=170,  # +4.6% = ~173
        expected_carry_max=182,
        expected_drift_min=0,
        expected_drift_max=1,
        category="altitude"
    ),
    TestScenario(
        name="8-Iron Sea Level (baseline check)",
        club="8-Iron",
        baseline_carry=135,
        temperature=70,
        wind_speed=0,
        wind_direction=0,
        shot_direction=0,
        altitude=0,
        humidity=50,
        expected_carry_min=130,  # Should be ~baseline
        expected_carry_max=142,
        expected_drift_min=0,
        expected_drift_max=1,
        category="altitude"
    ),
    
    # Extreme altitude
    TestScenario(
        name="Driver 9,500 ft (Summit County CO)",
        club="Driver",
        baseline_carry=225,
        temperature=70,
        wind_speed=0,
        wind_direction=0,
        shot_direction=0,
        altitude=9500,
        humidity=50,
        expected_carry_min=245,  # +11% = ~250
        expected_carry_max=270,
        expected_drift_min=0,
        expected_drift_max=1,
        category="altitude_extreme"
    ),
    TestScenario(
        name="6-Iron 10,000 ft",
        club="6-Iron",
        baseline_carry=155,
        temperature=70,
        wind_speed=0,
        wind_direction=0,
        shot_direction=0,
        altitude=10000,
        humidity=50,
        expected_carry_min=168,  # +11.6% = ~173
        expected_carry_max=185,
        expected_drift_min=0,
        expected_drift_max=1,
        category="altitude_extreme"
    ),
    
    # Low altitude (near sea level)
    TestScenario(
        name="Driver Sea Level Pebble Beach",
        club="Driver",
        baseline_carry=225,
        temperature=60,
        wind_speed=0,
        wind_direction=0,
        shot_direction=0,
        altitude=50,
        humidity=70,
        expected_carry_min=218,  # Slight cold effect
        expected_carry_max=232,
        expected_drift_min=0,
        expected_drift_max=1,
        category="altitude"
    ),
    TestScenario(
        name="7-Iron Castle Pines (6,500 ft)",
        club="7-Iron",
        baseline_carry=145,
        temperature=70,
        wind_speed=0,
        wind_direction=0,
        shot_direction=0,
        altitude=6500,
        humidity=40,
        expected_carry_min=153,  # +7.5% = ~156
        expected_carry_max=168,
        expected_drift_min=0,
        expected_drift_max=1,
        category="altitude"
    ),
    
    # === TEMPERATURE TESTS (8 scenarios) ===
    
    TestScenario(
        name="Driver Cold Morning (45°F)",
        club="Driver",
        baseline_carry=225,
        temperature=45,
        wind_speed=0,
        wind_direction=0,
        shot_direction=0,
        altitude=0,
        humidity=50,
        expected_carry_min=215,  # -6 yards from 75°F baseline
        expected_carry_max=228,
        expected_drift_min=0,
        expected_drift_max=1,
        category="temperature"
    ),
    TestScenario(
        name="Driver Hot Summer (95°F)",
        club="Driver",
        baseline_carry=225,
        temperature=95,
        wind_speed=0,
        wind_direction=0,
        shot_direction=0,
        altitude=0,
        humidity=50,
        expected_carry_min=227,  # +4 yards from 75°F baseline
        expected_carry_max=238,
        expected_drift_min=0,
        expected_drift_max=1,
        category="temperature"
    ),
    TestScenario(
        name="7-Iron Freezing (32°F)",
        club="7-Iron",
        baseline_carry=145,
        temperature=32,
        wind_speed=0,
        wind_direction=0,
        shot_direction=0,
        altitude=0,
        humidity=50,
        expected_carry_min=135,  # -6.5 yards from 75°F
        expected_carry_max=148,
        expected_drift_min=0,
        expected_drift_max=1,
        category="temperature"
    ),
    TestScenario(
        name="6-Iron Hot Day (100°F)",
        club="6-Iron",
        baseline_carry=155,
        temperature=100,
        wind_speed=0,
        wind_direction=0,
        shot_direction=0,
        altitude=0,
        humidity=50,
        expected_carry_min=157,  # +3.75 yards from 75°F
        expected_carry_max=168,
        expected_drift_min=0,
        expected_drift_max=1,
        category="temperature"
    ),
    TestScenario(
        name="PW Cold (50°F)",
        club="PW",
        baseline_carry=115,
        temperature=50,
        wind_speed=0,
        wind_direction=0,
        shot_direction=0,
        altitude=0,
        humidity=50,
        expected_carry_min=108,  
        expected_carry_max=118,
        expected_drift_min=0,
        expected_drift_max=1,
        category="temperature"
    ),
    TestScenario(
        name="9-Iron Warm (85°F)",
        club="9-Iron",
        baseline_carry=125,
        temperature=85,
        wind_speed=0,
        wind_direction=0,
        shot_direction=0,
        altitude=0,
        humidity=50,
        expected_carry_min=125,  
        expected_carry_max=132,
        expected_drift_min=0,
        expected_drift_max=1,
        category="temperature"
    ),
    TestScenario(
        name="8-Iron Standard (70°F)",
        club="8-Iron",
        baseline_carry=135,
        temperature=70,
        wind_speed=0,
        wind_direction=0,
        shot_direction=0,
        altitude=0,
        humidity=50,
        expected_carry_min=130,  
        expected_carry_max=142,
        expected_drift_min=0,
        expected_drift_max=1,
        category="temperature"
    ),
    TestScenario(
        name="Driver Mild (65°F)",
        club="Driver",
        baseline_carry=225,
        temperature=65,
        wind_speed=0,
        wind_direction=0,
        shot_direction=0,
        altitude=0,
        humidity=50,
        expected_carry_min=220,  
        expected_carry_max=232,
        expected_drift_min=0,
        expected_drift_max=1,
        category="temperature"
    ),
    
    # === COMBINED CONDITIONS (10 scenarios) ===
    
    TestScenario(
        name="Denver Summer (5280ft + 85°F + calm)",
        club="6-Iron",
        baseline_carry=155,
        temperature=85,
        wind_speed=0,
        wind_direction=0,
        shot_direction=0,
        altitude=5280,
        humidity=25,
        expected_carry_min=165,  # +6% altitude + ~2 yds temp
        expected_carry_max=180,
        expected_drift_min=0,
        expected_drift_max=1,
        category="combined"
    ),
    TestScenario(
        name="Scottish Links (sea level + 52°F + 22mph headwind)",
        club="6-Iron",
        baseline_carry=155,
        temperature=52,
        wind_speed=22,
        wind_direction=180,
        shot_direction=0,
        altitude=30,
        humidity=80,
        expected_carry_min=105,  # Big headwind + cold
        expected_carry_max=130,
        expected_drift_min=0,
        expected_drift_max=3,
        category="combined"
    ),
    TestScenario(
        name="Phoenix Summer (1086ft + 105°F)",
        club="Driver",
        baseline_carry=225,
        temperature=105,
        wind_speed=5,
        wind_direction=0,
        shot_direction=0,
        altitude=1086,
        humidity=15,
        expected_carry_min=235,  
        expected_carry_max=255,
        expected_drift_min=0,
        expected_drift_max=2,
        category="combined"
    ),
    TestScenario(
        name="Pebble Beach #7 (ocean wind + cool)",
        club="GW",
        baseline_carry=100,
        temperature=58,
        wind_speed=15,
        wind_direction=225,  # Quartering headwind
        shot_direction=0,
        altitude=75,
        humidity=75,
        expected_carry_min=82,  
        expected_carry_max=100,
        expected_drift_min=4,
        expected_drift_max=12,
        category="combined"
    ),
    TestScenario(
        name="TPC Sawgrass #17 (sea level + humid)",
        club="9-Iron",
        baseline_carry=125,
        temperature=78,
        wind_speed=12,
        wind_direction=315,  # Quartering tailwind
        shot_direction=0,
        altitude=15,
        humidity=85,
        expected_carry_min=128,  
        expected_carry_max=145,
        expected_drift_min=3,
        expected_drift_max=10,
        category="combined"
    ),
    TestScenario(
        name="Winter Golf (40°F + 10mph headwind)",
        club="7-Iron",
        baseline_carry=145,
        temperature=40,
        wind_speed=10,
        wind_direction=180,
        shot_direction=0,
        altitude=500,
        humidity=60,
        expected_carry_min=118,  
        expected_carry_max=138,
        expected_drift_min=0,
        expected_drift_max=2,
        category="combined"
    ),
    TestScenario(
        name="Mexico City Altitude (7350ft + warm)",
        club="8-Iron",
        baseline_carry=135,
        temperature=80,
        wind_speed=5,
        wind_direction=90,  # Crosswind
        shot_direction=0,
        altitude=7350,
        humidity=45,
        expected_carry_min=148,  # +8.5% altitude
        expected_carry_max=165,
        expected_drift_min=2,
        expected_drift_max=8,
        category="combined"
    ),
    TestScenario(
        name="Salt Lake City (4226ft + cold morning)",
        club="5-Iron",
        baseline_carry=165,
        temperature=48,
        wind_speed=8,
        wind_direction=135,  # SE wind
        shot_direction=0,
        altitude=4226,
        humidity=35,
        expected_carry_min=162,  
        expected_carry_max=182,
        expected_drift_min=2,
        expected_drift_max=10,
        category="combined"
    ),
    TestScenario(
        name="Miami Sea Level (hot + humid)",
        club="6-Iron",
        baseline_carry=155,
        temperature=92,
        wind_speed=8,
        wind_direction=45,  # NE quartering tailwind
        shot_direction=0,
        altitude=6,
        humidity=90,
        expected_carry_min=158,  
        expected_carry_max=172,
        expected_drift_min=2,
        expected_drift_max=8,
        category="combined"
    ),
    TestScenario(
        name="Reno Nevada (4505ft + dry)",
        club="Driver",
        baseline_carry=225,
        temperature=75,
        wind_speed=10,
        wind_direction=270,  # West crosswind
        shot_direction=0,
        altitude=4505,
        humidity=20,
        expected_carry_min=235,  
        expected_carry_max=255,
        expected_drift_min=10,
        expected_drift_max=25,
        category="combined"
    ),
    
    # === SANITY CHECK / EDGE CASES (5 scenarios) ===
    
    TestScenario(
        name="SANITY: 9-Iron can't go 200+ yards",
        club="9-Iron",
        baseline_carry=125,
        temperature=100,
        wind_speed=25,
        wind_direction=0,  # Strong tailwind
        shot_direction=0,
        altitude=10000,  # Extreme altitude
        humidity=10,
        expected_carry_min=140,  
        expected_carry_max=175,  # Should NOT exceed 175
        expected_drift_min=0,
        expected_drift_max=3,
        category="sanity"
    ),
    TestScenario(
        name="SANITY: PW shouldn't hit 150+ yards",
        club="PW",
        baseline_carry=115,
        temperature=105,
        wind_speed=20,
        wind_direction=0,  # Tailwind
        shot_direction=0,
        altitude=9000,
        humidity=10,
        expected_carry_min=130,  
        expected_carry_max=155,  # Should NOT exceed 155
        expected_drift_min=0,
        expected_drift_max=2,
        category="sanity"
    ),
    TestScenario(
        name="SANITY: Driver in extreme headwind still travels",
        club="Driver",
        baseline_carry=225,
        temperature=40,
        wind_speed=35,
        wind_direction=180,
        shot_direction=0,
        altitude=0,
        humidity=50,
        expected_carry_min=120,  # Should still travel 120+ yards
        expected_carry_max=175,
        expected_drift_min=0,
        expected_drift_max=5,
        category="sanity"
    ),
    TestScenario(
        name="SANITY: LW stays short",
        club="LW",
        baseline_carry=70,
        temperature=90,
        wind_speed=15,
        wind_direction=0,
        shot_direction=0,
        altitude=5280,
        humidity=30,
        expected_carry_min=75,  
        expected_carry_max=95,  # Should NOT exceed 95
        expected_drift_min=0,
        expected_drift_max=3,
        category="sanity"
    ),
    TestScenario(
        name="SANITY: Calm conditions = baseline",
        club="7-Iron",
        baseline_carry=145,
        temperature=70,
        wind_speed=0,
        wind_direction=0,
        shot_direction=0,
        altitude=0,
        humidity=50,
        expected_carry_min=140,  # Should be within 5 yards of baseline
        expected_carry_max=150,
        expected_drift_min=0,
        expected_drift_max=1,
        category="sanity"
    ),
]

def get_club_params(club: str) -> dict:
    """Return typical launch parameters for a mid-handicap player."""
    club_data = {
        "Driver": {"ball_speed": 150, "launch_angle": 12, "spin_rate": 2800},
        "3-Wood": {"ball_speed": 140, "launch_angle": 11, "spin_rate": 3500},
        "5-Wood": {"ball_speed": 135, "launch_angle": 12, "spin_rate": 4000},
        "4-Iron": {"ball_speed": 125, "launch_angle": 14, "spin_rate": 4500},
        "5-Iron": {"ball_speed": 120, "launch_angle": 15, "spin_rate": 5000},
        "6-Iron": {"ball_speed": 115, "launch_angle": 17, "spin_rate": 5500},
        "7-Iron": {"ball_speed": 110, "launch_angle": 19, "spin_rate": 6000},
        "8-Iron": {"ball_speed": 105, "launch_angle": 21, "spin_rate": 7000},
        "9-Iron": {"ball_speed": 100, "launch_angle": 24, "spin_rate": 8000},
        "PW": {"ball_speed": 95, "launch_angle": 27, "spin_rate": 9000},
        "GW": {"ball_speed": 88, "launch_angle": 30, "spin_rate": 9500},
        "SW": {"ball_speed": 80, "launch_angle": 32, "spin_rate": 10000},
        "LW": {"ball_speed": 72, "launch_angle": 35, "spin_rate": 10500},
    }
    return club_data.get(club, club_data["7-Iron"])

def call_api(scenario: TestScenario) -> Optional[dict]:
    """Call the golf physics API with the given scenario."""
    params = get_club_params(scenario.club)
    
    payload = {
        "ball_speed": params["ball_speed"],
        "launch_angle": params["launch_angle"],
        "spin_rate": params["spin_rate"],
        "shot_direction": scenario.shot_direction,
        "conditions": {
            "temperature": scenario.temperature,
            "wind_speed": scenario.wind_speed,
            "wind_direction": scenario.wind_direction,
            "altitude": scenario.altitude,
            "humidity": scenario.humidity
        }
    }
    
    try:
        response = requests.post(
            f"{API_BASE}/api/trajectory",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        if response.status_code == 200:
            return response.json()
        else:
            print(f"  API Error: {response.status_code} - {response.text[:200]}")
            return None
    except Exception as e:
        print(f"  Request Error: {e}")
        return None

def run_tests():
    """Run all test scenarios and generate a report."""
    print("=" * 80)
    print("GOLF WEATHER PHYSICS API - VALIDATION TEST SUITE")
    print("=" * 80)
    print(f"\nAPI Endpoint: {API_BASE}")
    print(f"Total Test Scenarios: {len(TEST_SCENARIOS)}")
    print("\n" + "=" * 80)
    
    results = []
    passed = 0
    failed = 0
    errors = 0
    
    categories = {}
    
    for i, scenario in enumerate(TEST_SCENARIOS, 1):
        print(f"\n[{i}/{len(TEST_SCENARIOS)}] {scenario.name}")
        print(f"  Club: {scenario.club} | Baseline: {scenario.baseline_carry} yds")
        print(f"  Conditions: {scenario.temperature}°F, {scenario.wind_speed}mph wind, {scenario.altitude}ft alt")
        
        response = call_api(scenario)
        
        if response is None:
            errors += 1
            result = {
                "scenario": scenario,
                "status": "ERROR",
                "actual_carry": None,
                "actual_drift": None,
                "message": "API call failed"
            }
        else:
            # Extract results - handle different response structures
            if "adjusted" in response:
                actual_carry = response["adjusted"].get("carry", 0)
                actual_drift = abs(response["adjusted"].get("lateral_drift", 0))
            elif "carry" in response:
                actual_carry = response.get("carry", 0)
                actual_drift = abs(response.get("lateral_drift", 0))
            else:
                actual_carry = response.get("adjusted_carry", 0)
                actual_drift = abs(response.get("drift", 0))
            
            # Check carry distance
            carry_pass = scenario.expected_carry_min <= actual_carry <= scenario.expected_carry_max
            
            # Check lateral drift
            drift_pass = scenario.expected_drift_min <= actual_drift <= scenario.expected_drift_max
            
            if carry_pass and drift_pass:
                passed += 1
                status = "PASS"
                message = "Within expected range"
            else:
                failed += 1
                status = "FAIL"
                messages = []
                if not carry_pass:
                    if actual_carry < scenario.expected_carry_min:
                        messages.append(f"Carry too SHORT: {actual_carry:.1f} < {scenario.expected_carry_min}")
                    else:
                        messages.append(f"Carry too LONG: {actual_carry:.1f} > {scenario.expected_carry_max}")
                if not drift_pass:
                    if actual_drift < scenario.expected_drift_min:
                        messages.append(f"Drift too LOW: {actual_drift:.1f} < {scenario.expected_drift_min}")
                    else:
                        messages.append(f"Drift too HIGH: {actual_drift:.1f} > {scenario.expected_drift_max}")
                message = "; ".join(messages)
            
            result = {
                "scenario": scenario,
                "status": status,
                "actual_carry": actual_carry,
                "actual_drift": actual_drift,
                "message": message,
                "response": response
            }
            
            print(f"  Expected carry: {scenario.expected_carry_min:.0f}-{scenario.expected_carry_max:.0f} yds")
            print(f"  Actual carry:   {actual_carry:.1f} yds")
            print(f"  Expected drift: {scenario.expected_drift_min:.0f}-{scenario.expected_drift_max:.0f} yds")
            print(f"  Actual drift:   {actual_drift:.1f} yds")
            print(f"  Status: {status}")
            if status != "PASS":
                print(f"  Issue: {message}")
        
        results.append(result)
        
        # Track by category
        cat = scenario.category
        if cat not in categories:
            categories[cat] = {"pass": 0, "fail": 0, "error": 0}
        if result["status"] == "PASS":
            categories[cat]["pass"] += 1
        elif result["status"] == "FAIL":
            categories[cat]["fail"] += 1
        else:
            categories[cat]["error"] += 1
    
    # Generate summary report
    print("\n" + "=" * 80)
    print("SUMMARY REPORT")
    print("=" * 80)
    
    total = len(TEST_SCENARIOS)
    print(f"\nOverall Results:")
    print(f"  PASSED: {passed}/{total} ({100*passed/total:.1f}%)")
    print(f"  FAILED: {failed}/{total} ({100*failed/total:.1f}%)")
    print(f"  ERRORS: {errors}/{total} ({100*errors/total:.1f}%)")
    
    print(f"\nResults by Category:")
    for cat, stats in sorted(categories.items()):
        cat_total = stats["pass"] + stats["fail"] + stats["error"]
        print(f"  {cat}:")
        print(f"    Pass: {stats['pass']}/{cat_total} | Fail: {stats['fail']} | Error: {stats['error']}")
    
    # List all failures
    failures = [r for r in results if r["status"] == "FAIL"]
    if failures:
        print(f"\n{'=' * 80}")
        print("FAILED TESTS DETAIL")
        print("=" * 80)
        for r in failures:
            s = r["scenario"]
            print(f"\n❌ {s.name}")
            print(f"   Club: {s.club} | Baseline: {s.baseline_carry} yds")
            print(f"   Conditions: {s.temperature}°F, {s.wind_speed}mph wind @ {s.wind_direction}°, {s.altitude}ft")
            print(f"   Expected: {s.expected_carry_min:.0f}-{s.expected_carry_max:.0f} yds carry, {s.expected_drift_min:.0f}-{s.expected_drift_max:.0f} yds drift")
            print(f"   Got: {r['actual_carry']:.1f} yds carry, {r['actual_drift']:.1f} yds drift")
            print(f"   Issue: {r['message']}")
    
    # Critical issues summary
    print(f"\n{'=' * 80}")
    print("CRITICAL ISSUES TO INVESTIGATE")
    print("=" * 80)
    
    # Check for systematic issues
    wind_hw_fails = [r for r in results if r["status"] == "FAIL" and "headwind" in r["scenario"].category.lower()]
    wind_tw_fails = [r for r in results if r["status"] == "FAIL" and "tailwind" in r["scenario"].category.lower()]
    alt_fails = [r for r in results if r["status"] == "FAIL" and "altitude" in r["scenario"].category.lower()]
    sanity_fails = [r for r in results if r["status"] == "FAIL" and "sanity" in r["scenario"].category.lower()]
    
    if wind_hw_fails:
        print(f"\n⚠️  HEADWIND CALCULATION ISSUE: {len(wind_hw_fails)} failures")
        print("   The API may not be applying headwind effect strongly enough.")
        print("   Expected: -10% for 10mph, -22% for 20mph headwind")
    
    if wind_tw_fails:
        print(f"\n⚠️  TAILWIND CALCULATION ISSUE: {len(wind_tw_fails)} failures")
        print("   Check tailwind effect: should be +7% for 10mph, +12% for 20mph")
    
    if alt_fails:
        print(f"\n⚠️  ALTITUDE CALCULATION ISSUE: {len(alt_fails)} failures")
        print("   Expected: altitude_ft × 0.00116 = % increase")
        print("   Denver (5280ft) should give +6.1% distance")
    
    if sanity_fails:
        print(f"\n🚨 SANITY CHECK FAILURES: {len(sanity_fails)} failures")
        print("   The API may be producing unrealistic results!")
        for r in sanity_fails:
            print(f"   - {r['scenario'].name}: {r['actual_carry']:.1f} yds (max expected: {r['scenario'].expected_carry_max})")
    
    # Asymmetry check
    hw_test = next((r for r in results if "Asymmetry Check - 7-Iron 10mph HW" in r["scenario"].name), None)
    tw_test = next((r for r in results if "Asymmetry Check - 7-Iron 10mph TW" in r["scenario"].name), None)
    
    if hw_test and tw_test and hw_test["actual_carry"] and tw_test["actual_carry"]:
        baseline = 145
        hw_loss = baseline - hw_test["actual_carry"]
        tw_gain = tw_test["actual_carry"] - baseline
        ratio = hw_loss / tw_gain if tw_gain > 0 else 0
        
        print(f"\n📊 WIND ASYMMETRY CHECK:")
        print(f"   Headwind loss: {hw_loss:.1f} yds")
        print(f"   Tailwind gain: {tw_gain:.1f} yds")
        print(f"   Ratio (should be ~1.5-2.0): {ratio:.2f}")
        
        if ratio < 1.3:
            print("   ⚠️  Headwind effect too weak compared to tailwind!")
        elif ratio > 2.5:
            print("   ⚠️  Headwind effect too strong compared to tailwind!")
        else:
            print("   ✅ Asymmetry ratio looks reasonable")
    
    return results

if __name__ == "__main__":
    results = run_tests()
