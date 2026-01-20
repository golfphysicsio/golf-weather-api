"""
Generate V3 Professional API Test Data - 50 Scenarios
Real-world weather conditions with various handicap types.
Expected values calculated from actual physics engine.
"""
import csv
import math
import sys
sys.path.insert(0, '.')

from app.services.physics import calculate_impact_breakdown
from app.models.requests import ShotData, WeatherConditions

scenarios = []

def add(scenario_type, handicap_cat, handicap, club, ball_speed, launch_angle, spin_rate, spin_axis,
        temp, humid, wind_speed, wind_dir, altitude, pressure, tolerance, notes):
    """Add a test scenario with calculated expected values."""

    shot = ShotData(
        ball_speed_mph=ball_speed,
        launch_angle_deg=launch_angle,
        spin_rate_rpm=spin_rate,
        spin_axis_deg=spin_axis,
        direction_deg=0
    )

    # Reference conditions for baseline
    ref_cond = WeatherConditions(
        temperature_f=70, humidity_pct=50, altitude_ft=0,
        pressure_inhg=29.92, wind_speed_mph=0, wind_direction_deg=0
    )
    ref_result = calculate_impact_breakdown(shot, ref_cond, 'professional')
    baseline = round(ref_result['baseline']['carry_yards'])

    # Actual conditions
    actual_cond = WeatherConditions(
        temperature_f=temp, humidity_pct=humid, altitude_ft=altitude,
        pressure_inhg=pressure, wind_speed_mph=wind_speed, wind_direction_deg=wind_dir
    )
    actual_result = calculate_impact_breakdown(shot, actual_cond, 'professional')
    expected_carry = round(actual_result['adjusted']['carry_yards'])

    # Lateral drift (crosswind formula)
    crosswind = wind_speed * math.sin(math.radians(wind_dir))
    lateral_drift = round(crosswind * 1.3 * (baseline / 100))

    scenarios.append({
        'scenario_type': scenario_type,
        'handicap_category': handicap_cat,
        'handicap': handicap,
        'club': club,
        'ball_speed_mph': ball_speed,
        'launch_angle_deg': launch_angle,
        'spin_rate_rpm': spin_rate,
        'spin_axis_deg': spin_axis,
        'baseline_carry_yards': baseline,
        'temperature_f': temp,
        'humidity_pct': humid,
        'wind_speed_mph': wind_speed,
        'wind_direction_deg': wind_dir,
        'altitude_ft': altitude,
        'air_pressure_inhg': pressure,
        'expected_carry_yards': expected_carry,
        'expected_lateral_drift_yards': lateral_drift,
        'tolerance_yards': tolerance,
        'notes': notes
    })

# =================================================================
# SECTION 1: BASELINE REFERENCES (5 scenarios)
# Reference shots for each handicap level - no weather effects
# =================================================================
add('baseline', 'low', 2, 'driver', 171, 10.5, 2450, 0, 70, 50, 0, 0, 0, 29.92, 2,
    'LOW handicap driver baseline (tour-like)')
add('baseline', 'mid', 14, 'driver', 155, 12.8, 3100, 0, 70, 50, 0, 0, 0, 29.92, 2,
    'MID handicap driver baseline')
add('baseline', 'high', 24, 'driver', 140, 15.0, 3700, 0, 70, 50, 0, 0, 0, 29.92, 2,
    'HIGH handicap driver baseline')
add('baseline', 'low', 5, '7-iron', 132, 16.5, 6800, 0, 70, 50, 0, 0, 0, 29.92, 2,
    'LOW handicap 7-iron baseline')
add('baseline', 'high', 26, '7-iron', 108, 21.0, 8200, 0, 70, 50, 0, 0, 0, 29.92, 2,
    'HIGH handicap 7-iron baseline')

# =================================================================
# SECTION 2: DESERT SOUTHWEST - Phoenix, Scottsdale (8 scenarios)
# Hot, dry, moderate altitude
# =================================================================
add('desert', 'low', 3, 'driver', 170, 10.8, 2500, -1, 98, 18, 8, 45, 1200, 29.85, 5,
    'Phoenix summer AM - hot/dry + quartering wind')
add('desert', 'mid', 12, 'driver', 157, 12.5, 3000, 2, 105, 12, 5, 180, 1400, 29.78, 5,
    'Scottsdale peak heat - very hot + light tailwind')
add('desert', 'high', 22, '5-iron', 122, 18.0, 6400, 0, 102, 15, 10, 0, 1100, 29.82, 4,
    'Phoenix afternoon - hot + headwind')
add('desert', 'low', 4, '5-iron', 142, 14.5, 5200, -1, 95, 20, 12, 315, 1300, 29.80, 5,
    'Desert morning - warm/dry + quartering headwind from right')
add('desert', 'mid', 15, '7-iron', 118, 18.5, 7500, 0, 88, 25, 6, 270, 1000, 29.88, 3,
    'Arizona spring - warm + crosswind R-L')
add('desert', 'high', 28, 'driver', 135, 16.0, 3900, 3, 92, 22, 15, 0, 1500, 29.75, 6,
    'Desert windy day - warm + moderate headwind')
add('desert', 'low', 2, '9-iron', 115, 21.5, 8400, 0, 100, 18, 8, 90, 1200, 29.82, 3,
    'Scottsdale hot day - short iron + crosswind L-R')
add('desert', 'mid', 16, 'PW', 98, 26.5, 9600, 0, 96, 20, 10, 180, 1350, 29.78, 3,
    'Desert calm approach - hot + tailwind')

# =================================================================
# SECTION 3: COASTAL CALIFORNIA - Pebble Beach, Torrey Pines (7 scenarios)
# Moderate temps, high humidity near ocean, afternoon winds
# =================================================================
add('coastal', 'low', 4, 'driver', 168, 11.2, 2600, -2, 62, 78, 18, 315, 0, 30.02, 7,
    'Pebble Beach PM - cool/humid + strong quartering headwind')
add('coastal', 'mid', 13, 'driver', 156, 12.6, 3050, 0, 58, 82, 20, 0, 0, 30.05, 7,
    'Torrey Pines marine layer - cool/humid + strong headwind')
add('coastal', 'high', 20, '5-iron', 126, 17.2, 6100, 2, 65, 75, 15, 270, 50, 29.98, 5,
    'Pacific coast afternoon - moderate + crosswind R-L')
add('coastal', 'low', 5, '3-wood', 158, 12.0, 3400, -1, 60, 80, 12, 45, 0, 30.00, 5,
    'Ocean side morning - cool/humid + quartering headwind')
add('coastal', 'mid', 14, '7-iron', 120, 18.0, 7400, 0, 68, 72, 8, 180, 0, 29.95, 3,
    'Coastal evening - mild + light tailwind')
add('coastal', 'high', 25, 'driver', 138, 15.5, 3800, 4, 55, 85, 22, 0, 0, 30.08, 8,
    'Windy coast - cold/humid + very strong headwind')
add('coastal', 'low', 3, '5-iron', 144, 14.2, 5100, 0, 64, 76, 10, 135, 0, 30.00, 4,
    'Late afternoon coast - quartering tailwind from left')

# =================================================================
# SECTION 4: MOUNTAIN COURSES - Colorado, Utah (7 scenarios)
# High altitude is the dominant factor
# =================================================================
add('mountain', 'low', 2, 'driver', 172, 10.2, 2400, 0, 72, 35, 5, 0, 5280, 29.92, 5,
    'Denver elevation - altitude boost + light headwind')
add('mountain', 'mid', 11, 'driver', 160, 12.0, 2850, -2, 68, 40, 10, 180, 6500, 29.90, 6,
    'Mountain resort - high altitude + moderate tailwind')
add('mountain', 'high', 23, '5-iron', 124, 17.5, 6300, 0, 75, 38, 8, 90, 7000, 29.88, 5,
    'Extreme altitude - 7000ft + crosswind L-R')
add('mountain', 'low', 4, '7-iron', 130, 17.0, 6900, 0, 65, 42, 12, 45, 5500, 29.85, 5,
    'Colorado summer - altitude + quartering headwind')
add('mountain', 'mid', 15, 'driver', 154, 13.0, 3200, 2, 58, 30, 15, 315, 4800, 29.78, 6,
    'Mountain morning - cool/dry + quartering headwind')
add('mountain', 'high', 30, '7-iron', 105, 22.0, 8500, 0, 78, 45, 6, 180, 6000, 29.82, 4,
    'High altitude beginner - altitude helps + tailwind')
add('mountain', 'low', 3, 'PW', 104, 25.5, 9700, 0, 70, 40, 10, 270, 5280, 29.92, 4,
    'Denver approach - altitude + crosswind R-L')

# =================================================================
# SECTION 5: SOUTHEAST - Florida, Georgia (6 scenarios)
# Hot, very humid, sea level, afternoon storms
# =================================================================
add('southeast', 'low', 5, 'driver', 167, 11.5, 2650, 0, 92, 88, 6, 180, 0, 29.75, 4,
    'Florida summer - hot/humid + light tailwind (storm coming)')
add('southeast', 'mid', 12, 'driver', 158, 12.5, 2950, -1, 88, 92, 12, 45, 0, 29.70, 5,
    'Augusta spring - warm/very humid + quartering wind')
add('southeast', 'high', 21, '5-iron', 125, 17.5, 6200, 2, 95, 85, 8, 0, 50, 29.72, 4,
    'Florida afternoon - hot/humid + headwind')
add('southeast', 'low', 4, '7-iron', 133, 16.2, 6700, 0, 85, 80, 10, 270, 0, 29.80, 4,
    'Georgia summer - warm/humid + crosswind R-L')
add('southeast', 'mid', 16, '9-iron', 102, 24.0, 9100, 0, 90, 82, 5, 90, 0, 29.78, 3,
    'Southeast calm morning - humid + light crosswind')
add('southeast', 'high', 26, 'driver', 136, 16.2, 3950, 3, 78, 75, 15, 0, 0, 29.85, 6,
    'Southern windy day - moderate headwind')

# =================================================================
# SECTION 6: MIDWEST - Illinois, Ohio (5 scenarios)
# Variable conditions, moderate everything
# =================================================================
add('midwest', 'low', 3, 'driver', 169, 11.0, 2550, -1, 75, 55, 12, 0, 800, 29.90, 5,
    'Midwest summer - moderate + headwind')
add('midwest', 'mid', 13, 'driver', 157, 12.4, 3000, 0, 52, 45, 18, 180, 650, 30.05, 6,
    'Midwest fall - cool + strong tailwind')
add('midwest', 'high', 22, '5-iron', 123, 17.8, 6350, 0, 68, 58, 10, 315, 750, 29.95, 4,
    'Midwest spring - mild + quartering headwind')
add('midwest', 'low', 5, '5-iron', 141, 14.8, 5300, 0, 45, 40, 8, 90, 600, 30.10, 4,
    'Cold midwest day - cool/dry + crosswind')
add('midwest', 'mid', 14, '7-iron', 119, 18.2, 7500, 0, 80, 62, 6, 225, 700, 29.88, 3,
    'Summer afternoon - warm + quartering tailwind')

# =================================================================
# SECTION 7: LINKS/BRITISH ISLES STYLE (5 scenarios)
# Cool, windy, moderate humidity
# =================================================================
add('links', 'low', 2, 'driver', 171, 10.5, 2450, 0, 55, 70, 25, 0, 0, 29.85, 9,
    'Scottish links - cool/windy + extreme headwind')
add('links', 'mid', 12, '5-iron', 134, 15.5, 5700, 0, 52, 75, 20, 270, 0, 29.80, 6,
    'Irish coast - cool/humid + strong crosswind')
add('links', 'high', 24, 'driver', 139, 15.2, 3750, 2, 58, 68, 18, 45, 0, 29.75, 7,
    'Windy links - quartering headwind challenge')
add('links', 'low', 4, '7-iron', 131, 16.8, 6850, 0, 48, 72, 15, 180, 0, 29.90, 5,
    'Links tailwind - cool/humid + helping wind')
add('links', 'mid', 15, '3-wood', 150, 13.5, 3800, -1, 50, 78, 22, 315, 0, 29.78, 7,
    'Open Championship style - cold + strong quartering wind')

# =================================================================
# SECTION 8: EXTREME CONDITIONS (7 scenarios)
# Boundary testing with realistic extremes
# =================================================================
add('extreme', 'low', 1, 'driver', 178, 9.5, 2250, -2, 110, 10, 0, 0, 0, 29.60, 5,
    'Peak heat + low pressure - max hot/dry')
add('extreme', 'mid', 10, 'driver', 162, 11.8, 2800, 0, 38, 25, 0, 0, 0, 30.30, 5,
    'Cold winter day - high pressure')
add('extreme', 'high', 20, 'driver', 145, 14.5, 3500, 0, 70, 50, 30, 0, 0, 29.92, 10,
    'Hurricane force headwind - extreme wind test')
add('extreme', 'low', 3, 'driver', 170, 10.8, 2500, 0, 85, 50, 25, 180, 5280, 29.92, 8,
    'Denver + strong tailwind - altitude + wind combo')
add('extreme', 'mid', 14, '5-iron', 133, 15.8, 5750, 0, 65, 90, 15, 90, 0, 29.70, 5,
    'Humid + crosswind + low pressure combo')
add('extreme', 'high', 28, '7-iron', 107, 21.5, 8300, 0, 100, 85, 8, 45, 2000, 29.75, 4,
    'Hot/humid + altitude + quartering wind')
add('extreme', 'low', 2, 'PW', 105, 25.0, 9500, 0, 75, 50, 20, 315, 3500, 29.88, 5,
    'Short iron in challenging conditions')


# Write to CSV
output_file = 'tests/professional_api_test_v3.csv'
with open(output_file, 'w', newline='') as f:
    fieldnames = [
        'shot_id', 'scenario_type', 'handicap_category', 'handicap', 'club',
        'ball_speed_mph', 'launch_angle_deg', 'spin_rate_rpm', 'spin_axis_deg',
        'baseline_carry_yards', 'temperature_f', 'humidity_pct', 'wind_speed_mph',
        'wind_direction_deg', 'altitude_ft', 'air_pressure_inhg',
        'expected_carry_yards', 'expected_lateral_drift_yards', 'tolerance_yards', 'notes'
    ]
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()

    for i, scenario in enumerate(scenarios, 1):
        scenario['shot_id'] = i
        writer.writerow(scenario)

print(f"Generated {len(scenarios)} test scenarios")
print(f"Output: {output_file}")

# Print summary by scenario type
from collections import Counter
type_counts = Counter(s['scenario_type'] for s in scenarios)
print("\nScenario distribution:")
for stype, count in sorted(type_counts.items()):
    print(f"  {stype}: {count}")

# Print summary by handicap category
hc_counts = Counter(s['handicap_category'] for s in scenarios)
print("\nHandicap distribution:")
for hc, count in sorted(hc_counts.items()):
    print(f"  {hc}: {count}")
