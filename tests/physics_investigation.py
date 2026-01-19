"""
Physics Investigation: Verify drag AND lift calculations with wind
"""
import sys
sys.path.insert(0, 'C:/Users/Vtorr/OneDrive/GolfWeatherAPI')

from app.services.physics import (
    calculate_trajectory,
    calculate_wind_components,
    calculate_air_density,
    calculate_impact_breakdown,
    calculate_empirical_wind_effect,
    STANDARD_AIR_DENSITY,
    MPH_TO_MPS,
)
from app.models.requests import ShotData, WeatherConditions

print("=" * 70)
print("PHYSICS INVESTIGATION: Drag vs Lift in Wind Conditions")
print("=" * 70)

# Tour pro driver shot parameters
BALL_SPEED = 167  # mph
LAUNCH_ANGLE = 11.2  # degrees
SPIN_RATE = 2600  # rpm

print(f"\nShot Parameters:")
print(f"  Ball Speed: {BALL_SPEED} mph")
print(f"  Launch Angle: {LAUNCH_ANGLE}°")
print(f"  Spin Rate: {SPIN_RATE} rpm")

print("\n" + "=" * 70)
print("TEST 1: Pure Physics Simulation (calculate_trajectory)")
print("=" * 70)

# Test 1a: Calm conditions (baseline)
print("\n--- Calm Conditions (No Wind) ---")
result_calm = calculate_trajectory(
    ball_speed_mph=BALL_SPEED,
    launch_angle_deg=LAUNCH_ANGLE,
    spin_rate_rpm=SPIN_RATE,
    spin_axis_deg=0,
    direction_deg=0,
    air_density=STANDARD_AIR_DENSITY,
    headwind_mps=0,
    crosswind_mps=0,
)
print(f"  Carry: {result_calm['carry_yards']} yards")
print(f"  Total: {result_calm['total_yards']} yards")
print(f"  Apex: {result_calm['apex_height_yards']} yards")
print(f"  Flight Time: {result_calm['flight_time_seconds']} seconds")

# Test 1b: 30 mph tailwind
print("\n--- 30 mph Tailwind ---")
headwind_30, _ = calculate_wind_components(30, 180)  # 180 = tailwind
print(f"  Wind component (mps): {headwind_30:.2f} (negative = tailwind)")
result_30_tail = calculate_trajectory(
    ball_speed_mph=BALL_SPEED,
    launch_angle_deg=LAUNCH_ANGLE,
    spin_rate_rpm=SPIN_RATE,
    spin_axis_deg=0,
    direction_deg=0,
    air_density=STANDARD_AIR_DENSITY,
    headwind_mps=headwind_30,
    crosswind_mps=0,
)
print(f"  Carry: {result_30_tail['carry_yards']} yards")
print(f"  Apex: {result_30_tail['apex_height_yards']} yards")
print(f"  Flight Time: {result_30_tail['flight_time_seconds']} seconds")
print(f"  Change from calm: {result_30_tail['carry_yards'] - result_calm['carry_yards']:+.1f} yards")

# Test 1c: 80 mph tailwind (Maximum Tailwind mode)
print("\n--- 80 mph Tailwind (Maximum Tailwind Mode) ---")
headwind_80, _ = calculate_wind_components(80, 180)
print(f"  Wind component (mps): {headwind_80:.2f}")
result_80_tail = calculate_trajectory(
    ball_speed_mph=BALL_SPEED,
    launch_angle_deg=LAUNCH_ANGLE,
    spin_rate_rpm=SPIN_RATE,
    spin_axis_deg=0,
    direction_deg=0,
    air_density=STANDARD_AIR_DENSITY,
    headwind_mps=headwind_80,
    crosswind_mps=0,
)
print(f"  Carry: {result_80_tail['carry_yards']} yards")
print(f"  Apex: {result_80_tail['apex_height_yards']} yards")
print(f"  Flight Time: {result_80_tail['flight_time_seconds']} seconds")
print(f"  Change from calm: {result_80_tail['carry_yards'] - result_calm['carry_yards']:+.1f} yards")

# Test 1d: 150 mph tailwind (extreme)
print("\n--- 150 mph Tailwind (EXTREME) ---")
headwind_150, _ = calculate_wind_components(150, 180)
print(f"  Wind component (mps): {headwind_150:.2f}")
result_150_tail = calculate_trajectory(
    ball_speed_mph=BALL_SPEED,
    launch_angle_deg=LAUNCH_ANGLE,
    spin_rate_rpm=SPIN_RATE,
    spin_axis_deg=0,
    direction_deg=0,
    air_density=STANDARD_AIR_DENSITY,
    headwind_mps=headwind_150,
    crosswind_mps=0,
)
print(f"  Carry: {result_150_tail['carry_yards']} yards")
print(f"  Apex: {result_150_tail['apex_height_yards']} yards")
print(f"  Flight Time: {result_150_tail['flight_time_seconds']} seconds")
print(f"  Change from calm: {result_150_tail['carry_yards'] - result_calm['carry_yards']:+.1f} yards")

# Test 1e: 120 mph headwind (extreme)
print("\n--- 120 mph Headwind (EXTREME) ---")
headwind_120, _ = calculate_wind_components(120, 0)  # 0 = headwind
print(f"  Wind component (mps): {headwind_120:.2f} (positive = headwind)")
result_120_head = calculate_trajectory(
    ball_speed_mph=BALL_SPEED,
    launch_angle_deg=LAUNCH_ANGLE,
    spin_rate_rpm=SPIN_RATE,
    spin_axis_deg=0,
    direction_deg=0,
    air_density=STANDARD_AIR_DENSITY,
    headwind_mps=headwind_120,
    crosswind_mps=0,
)
print(f"  Carry: {result_120_head['carry_yards']} yards")
print(f"  Apex: {result_120_head['apex_height_yards']} yards")
print(f"  Flight Time: {result_120_head['flight_time_seconds']} seconds")
print(f"  Change from calm: {result_120_head['carry_yards'] - result_calm['carry_yards']:+.1f} yards")


print("\n" + "=" * 70)
print("TEST 2: Empirical Wind Effect (TrackMan benchmarks)")
print("=" * 70)

baseline_carry = result_calm['carry_yards']
print(f"\nBaseline carry: {baseline_carry} yards")

for wind, direction, label in [
    (30, 180, "30 mph Tailwind"),
    (80, 180, "80 mph Tailwind"),
    (150, 180, "150 mph Tailwind"),
    (120, 0, "120 mph Headwind"),
]:
    dist_effect, lateral = calculate_empirical_wind_effect(baseline_carry, wind, direction)
    adjusted = baseline_carry + dist_effect
    print(f"\n{label}:")
    print(f"  Distance effect: {dist_effect:+.1f} yards")
    print(f"  Adjusted carry: {adjusted:.1f} yards")


print("\n" + "=" * 70)
print("TEST 3: Full API Response (calculate_impact_breakdown)")
print("=" * 70)

shot = ShotData(
    ball_speed_mph=BALL_SPEED,
    launch_angle_deg=LAUNCH_ANGLE,
    spin_rate_rpm=SPIN_RATE,
    spin_axis_deg=0,
    direction_deg=0,
)

scenarios = [
    ("Calm", WeatherConditions(wind_speed_mph=0, wind_direction_deg=0)),
    ("30 mph Tailwind", WeatherConditions(wind_speed_mph=30, wind_direction_deg=180)),
    ("80 mph Tailwind", WeatherConditions(wind_speed_mph=80, wind_direction_deg=180)),
    ("150 mph Tailwind", WeatherConditions(wind_speed_mph=150, wind_direction_deg=180)),
    ("120 mph Headwind", WeatherConditions(wind_speed_mph=120, wind_direction_deg=0)),
]

calm_carry = None
for label, conditions in scenarios:
    result = calculate_impact_breakdown(shot, conditions)
    carry = result['adjusted']['carry_yards']
    if calm_carry is None:
        calm_carry = carry

    print(f"\n{label}:")
    print(f"  Baseline: {result['baseline']['carry_yards']} yards")
    print(f"  Adjusted: {carry} yards")
    print(f"  Wind Effect: {result['impact_breakdown']['wind_effect_yards']:+.1f} yards")
    print(f"  Apex: {result['adjusted']['apex_height_yards']} yards")
    print(f"  Flight Time: {result['adjusted']['flight_time_seconds']} sec")
    if label != "Calm":
        print(f"  Change from calm: {carry - calm_carry:+.1f} yards")


print("\n" + "=" * 70)
print("TEST 4: Velocity Analysis - What happens to relative airspeed?")
print("=" * 70)

ball_speed_mps = BALL_SPEED * MPH_TO_MPS
print(f"\nBall initial speed: {ball_speed_mps:.1f} m/s ({BALL_SPEED} mph)")

for wind_mph, direction, label in [
    (0, 0, "Calm"),
    (30, 180, "30 mph Tailwind"),
    (80, 180, "80 mph Tailwind"),
    (150, 180, "150 mph Tailwind"),
]:
    headwind, _ = calculate_wind_components(wind_mph, direction)
    # At launch, relative velocity in x direction
    import math
    launch_rad = math.radians(LAUNCH_ANGLE)
    vx_initial = ball_speed_mps * math.cos(launch_rad)
    vx_rel_initial = vx_initial + headwind  # headwind is negative for tailwind

    print(f"\n{label}:")
    print(f"  Ball Vx (initial): {vx_initial:.1f} m/s")
    print(f"  Wind component: {headwind:.1f} m/s")
    print(f"  Relative Vx: {vx_rel_initial:.1f} m/s")
    print(f"  Relative airspeed ratio: {abs(vx_rel_initial/vx_initial):.2f}x")


print("\n" + "=" * 70)
print("SUMMARY: Physics Assessment")
print("=" * 70)

print("""
FINDINGS:

1. PHYSICS SIMULATION (calculate_trajectory):
   - Both DRAG and LIFT use relative airspeed (v_rel) ✓
   - This is CORRECT physics
   - Tailwind reduces v_rel → reduces BOTH drag AND lift
   - Ball travels further (less drag) but also drops sooner (less lift)

2. EMPIRICAL OVERRIDE (calculate_impact_breakdown):
   - Uses TrackMan benchmark data for final distance
   - Tailwind effect: +0.7% per mph (0-10), +0.5% per mph (10+)
   - This caps the benefit but still allows large gains at extreme winds

3. KEY QUESTION: At 150 mph tailwind, does the ball still fly?
   - Physics shows the ball does fly, but with reduced lift
   - The empirical formula doesn't account for lift loss at extreme winds
   - This may be over-predicting tailwind benefits at extreme values
""")
