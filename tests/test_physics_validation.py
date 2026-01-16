"""
Physics Engine Validation Tests

Validates the golf ball physics engine against industry benchmark data from
TrackMan and Titleist.

Run with: python -m pytest tests/test_physics_validation.py -v
"""

import sys
import os
import io

# Fix encoding for Windows console
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

# Add the project root to the path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.physics import (
    calculate_trajectory,
    calculate_air_density,
    calculate_wind_components,
    calculate_impact_breakdown,
    STANDARD_AIR_DENSITY,
    MPH_TO_MPS,
)
from app.models.requests import ShotData, WeatherConditions


def print_header(title: str):
    print("\n" + "=" * 60)
    print(f" {title}")
    print("=" * 60)


def print_result(test_name: str, expected: float, actual: float, tolerance: float, unit: str = "yards"):
    """Print test result with PASS/FAIL status."""
    diff = actual - expected
    passed = abs(diff) <= tolerance
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"  {test_name}:")
    print(f"    Expected: {expected:.1f} {unit}")
    print(f"    Actual:   {actual:.1f} {unit}")
    print(f"    Diff:     {diff:+.1f} {unit}")
    print(f"    Status:   {status}")
    return passed


def test_wind_effects():
    """
    Test 1: Wind Effects (TrackMan Benchmark)

    Using a 7-iron with ~165 yard baseline carry.

    Benchmarks:
    - 10 mph headwind: ~149 yards (-10%, ~-16 yds)
    - 20 mph headwind: ~130-135 yards (-20 to 22%, ~-32 yds)
    - 10 mph tailwind: ~178 yards (+7-8%, ~+13 yds)
    - 20 mph tailwind: ~185 yards (+12%, ~+20 yds)

    Critical check: Headwind should hurt ~1.5-2x MORE than tailwind helps.
    """
    print_header("TEST 1: WIND EFFECTS (TrackMan Benchmark)")

    # 7-iron shot parameters (TrackMan avg amateur)
    # Higher ball speed needed to achieve 165 yard carry
    shot = ShotData(
        ball_speed_mph=132,  # Increased for ~165 yard baseline
        launch_angle_deg=16.5,
        spin_rate_rpm=6500,
        spin_axis_deg=0,
        direction_deg=0
    )

    results = []

    # Baseline (no wind)
    baseline = calculate_trajectory(
        ball_speed_mph=shot.ball_speed_mph,
        launch_angle_deg=shot.launch_angle_deg,
        spin_rate_rpm=shot.spin_rate_rpm,
        spin_axis_deg=shot.spin_axis_deg,
        direction_deg=shot.direction_deg,
        air_density=STANDARD_AIR_DENSITY,
        headwind_mps=0,
        crosswind_mps=0,
    )

    print(f"\n  Baseline (calm): {baseline['carry_yards']:.1f} yards")

    # Test conditions
    test_cases = [
        ("10 mph Headwind", 10, 0, 149, -16, 10),   # expected carry, expected change, tolerance
        ("20 mph Headwind", 20, 0, 133, -32, 10),   # TrackMan says -20 to 22%
        ("10 mph Tailwind", 10, 180, 178, +13, 8),
        ("20 mph Tailwind", 20, 180, 185, +20, 8),
    ]

    headwind_effects = []
    tailwind_effects = []

    for name, wind_speed, wind_dir, expected_carry, expected_change, tolerance in test_cases:
        headwind_mps, crosswind_mps = calculate_wind_components(wind_speed, wind_dir)

        result = calculate_trajectory(
            ball_speed_mph=shot.ball_speed_mph,
            launch_angle_deg=shot.launch_angle_deg,
            spin_rate_rpm=shot.spin_rate_rpm,
            spin_axis_deg=shot.spin_axis_deg,
            direction_deg=shot.direction_deg,
            air_density=STANDARD_AIR_DENSITY,
            headwind_mps=headwind_mps,
            crosswind_mps=crosswind_mps,
        )

        actual_change = result['carry_yards'] - baseline['carry_yards']

        print(f"\n  {name}:")
        print(f"    Carry: {result['carry_yards']:.1f} yards")
        print(f"    Change: {actual_change:+.1f} yards (expected: {expected_change:+.1f})")
        print(f"    % Change: {(actual_change / baseline['carry_yards']) * 100:.1f}%")

        passed = abs(actual_change - expected_change) <= tolerance
        results.append(passed)
        print(f"    Status: {'✅ PASS' if passed else '❌ FAIL'}")

        if wind_dir == 0:  # Headwind
            headwind_effects.append(abs(actual_change))
        else:  # Tailwind
            tailwind_effects.append(abs(actual_change))

    # Asymmetry check
    print("\n  ASYMMETRY CHECK (Headwind should hurt ~1.5-2x more than tailwind helps):")
    for i, (hw, tw) in enumerate(zip(headwind_effects, tailwind_effects)):
        speed = 10 if i == 0 else 20
        ratio = hw / tw if tw > 0 else 0
        passed = 1.3 <= ratio <= 2.5
        results.append(passed)
        print(f"    {speed} mph: Headwind={hw:.1f} / Tailwind={tw:.1f} = {ratio:.2f}x")
        print(f"    Status: {'✅ PASS' if passed else '❌ FAIL'} (expected: 1.5-2.0x)")

    return all(results)


def test_altitude_effects():
    """
    Test 2: Altitude Effects (Titleist Benchmark)

    Using a driver with 250 yard baseline at sea level.

    Benchmarks:
    - 2,500 ft: +2.5-3% (~+7 yds)
    - 5,280 ft (Denver): +6% (~+15 yds)
    - 7,500 ft (Mexico City): +9% (~+22 yds)

    Rule: ~2-2.5 yards per 1,000 feet.
    """
    print_header("TEST 2: ALTITUDE EFFECTS (Titleist Benchmark)")

    # Driver shot parameters
    shot = ShotData(
        ball_speed_mph=167,
        launch_angle_deg=10.5,
        spin_rate_rpm=2700,
        spin_axis_deg=0,
        direction_deg=0
    )

    results = []

    # Baseline at sea level
    baseline_density = calculate_air_density(70, 0, 50, 29.92)
    baseline = calculate_trajectory(
        ball_speed_mph=shot.ball_speed_mph,
        launch_angle_deg=shot.launch_angle_deg,
        spin_rate_rpm=shot.spin_rate_rpm,
        spin_axis_deg=shot.spin_axis_deg,
        direction_deg=shot.direction_deg,
        air_density=baseline_density,
        headwind_mps=0,
        crosswind_mps=0,
    )

    print(f"\n  Baseline (sea level, 70°F): {baseline['carry_yards']:.1f} yards")
    print(f"  Air density: {baseline_density:.4f} kg/m³")

    test_cases = [
        ("2,500 ft", 2500, 7, 12),
        ("5,280 ft (Denver)", 5280, 15, 12),
        ("7,500 ft (Mexico City)", 7500, 22, 12),
    ]

    for name, altitude, expected_gain, tolerance in test_cases:
        alt_density = calculate_air_density(70, altitude, 50, 29.92)

        result = calculate_trajectory(
            ball_speed_mph=shot.ball_speed_mph,
            launch_angle_deg=shot.launch_angle_deg,
            spin_rate_rpm=shot.spin_rate_rpm,
            spin_axis_deg=shot.spin_axis_deg,
            direction_deg=shot.direction_deg,
            air_density=alt_density,
            headwind_mps=0,
            crosswind_mps=0,
        )

        actual_gain = result['carry_yards'] - baseline['carry_yards']
        pct_gain = (actual_gain / baseline['carry_yards']) * 100

        print(f"\n  {name}:")
        print(f"    Air density: {alt_density:.4f} kg/m³ ({(1 - alt_density/baseline_density)*100:.1f}% less)")
        print(f"    Carry: {result['carry_yards']:.1f} yards")
        print(f"    Gain: {actual_gain:+.1f} yards ({pct_gain:+.1f}%)")
        print(f"    Expected: +{expected_gain} yards")

        passed = abs(actual_gain - expected_gain) <= tolerance
        results.append(passed)
        print(f"    Status: {'✅ PASS' if passed else '❌ FAIL'}")

    return all(results)


def test_temperature_effects():
    """
    Test 3: Temperature Effects (TrackMan Benchmark)

    Using a mid-iron with 155 yard baseline at 70°F.

    Benchmarks:
    - 40°F: -4 to 5 yards
    - 100°F: +4 to 5 yards

    Rule: ~1.5 yards per 10°F change.
    """
    print_header("TEST 3: TEMPERATURE EFFECTS (TrackMan Benchmark)")

    # Mid-iron shot parameters
    shot = ShotData(
        ball_speed_mph=115,
        launch_angle_deg=17.0,
        spin_rate_rpm=6500,
        spin_axis_deg=0,
        direction_deg=0
    )

    results = []

    # Baseline at 70°F
    baseline_density = calculate_air_density(70, 0, 50, 29.92)
    baseline = calculate_trajectory(
        ball_speed_mph=shot.ball_speed_mph,
        launch_angle_deg=shot.launch_angle_deg,
        spin_rate_rpm=shot.spin_rate_rpm,
        spin_axis_deg=shot.spin_axis_deg,
        direction_deg=shot.direction_deg,
        air_density=baseline_density,
        headwind_mps=0,
        crosswind_mps=0,
    )

    print(f"\n  Baseline (70°F): {baseline['carry_yards']:.1f} yards")

    test_cases = [
        ("40°F (cold)", 40, -4.5, 3),
        ("100°F (hot)", 100, +4.5, 3),
    ]

    for name, temp, expected_change, tolerance in test_cases:
        temp_density = calculate_air_density(temp, 0, 50, 29.92)

        result = calculate_trajectory(
            ball_speed_mph=shot.ball_speed_mph,
            launch_angle_deg=shot.launch_angle_deg,
            spin_rate_rpm=shot.spin_rate_rpm,
            spin_axis_deg=shot.spin_axis_deg,
            direction_deg=shot.direction_deg,
            air_density=temp_density,
            headwind_mps=0,
            crosswind_mps=0,
        )

        actual_change = result['carry_yards'] - baseline['carry_yards']

        print(f"\n  {name}:")
        print(f"    Air density: {temp_density:.4f} kg/m³")
        print(f"    Carry: {result['carry_yards']:.1f} yards")
        print(f"    Change: {actual_change:+.1f} yards (expected: {expected_change:+.1f})")

        passed = abs(actual_change - expected_change) <= tolerance
        results.append(passed)
        print(f"    Status: {'✅ PASS' if passed else '❌ FAIL'}")

    return all(results)


def test_crosswind_effects():
    """
    Test 4: Crosswind Effects

    Using a 6-iron with 153 yard carry.

    Benchmarks:
    - 10 mph crosswind: ~13 yards drift (~40 feet)
    - 20 mph crosswind: ~27 yards drift (~81 feet)
    """
    print_header("TEST 4: CROSSWIND EFFECTS")

    # 6-iron shot parameters
    shot = ShotData(
        ball_speed_mph=125,
        launch_angle_deg=16.0,
        spin_rate_rpm=6200,
        spin_axis_deg=0,
        direction_deg=0
    )

    results = []

    # Baseline (no wind)
    baseline = calculate_trajectory(
        ball_speed_mph=shot.ball_speed_mph,
        launch_angle_deg=shot.launch_angle_deg,
        spin_rate_rpm=shot.spin_rate_rpm,
        spin_axis_deg=shot.spin_axis_deg,
        direction_deg=shot.direction_deg,
        air_density=STANDARD_AIR_DENSITY,
        headwind_mps=0,
        crosswind_mps=0,
    )

    print(f"\n  Baseline: {baseline['carry_yards']:.1f} yards, lateral: {baseline['lateral_drift_yards']:.1f}")

    test_cases = [
        ("10 mph L-R crosswind", 10, 90, 13, 5),
        ("20 mph L-R crosswind", 20, 90, 27, 8),
    ]

    for name, wind_speed, wind_dir, expected_drift, tolerance in test_cases:
        headwind_mps, crosswind_mps = calculate_wind_components(wind_speed, wind_dir)

        result = calculate_trajectory(
            ball_speed_mph=shot.ball_speed_mph,
            launch_angle_deg=shot.launch_angle_deg,
            spin_rate_rpm=shot.spin_rate_rpm,
            spin_axis_deg=shot.spin_axis_deg,
            direction_deg=shot.direction_deg,
            air_density=STANDARD_AIR_DENSITY,
            headwind_mps=headwind_mps,
            crosswind_mps=crosswind_mps,
        )

        actual_drift = abs(result['lateral_drift_yards'] - baseline['lateral_drift_yards'])

        print(f"\n  {name}:")
        print(f"    Carry: {result['carry_yards']:.1f} yards")
        print(f"    Lateral drift: {actual_drift:.1f} yards (expected: ~{expected_drift} yards)")

        passed = abs(actual_drift - expected_drift) <= tolerance
        results.append(passed)
        print(f"    Status: {'✅ PASS' if passed else '❌ FAIL'}")

    return all(results)


def run_all_tests():
    """Run all validation tests and report results."""
    print("\n" + "=" * 60)
    print(" GOLF PHYSICS ENGINE VALIDATION")
    print(" Comparing against TrackMan and Titleist benchmark data")
    print("=" * 60)

    results = {
        "Wind Effects": test_wind_effects(),
        "Altitude Effects": test_altitude_effects(),
        "Temperature Effects": test_temperature_effects(),
        "Crosswind Effects": test_crosswind_effects(),
    }

    print_header("SUMMARY")
    all_passed = True
    for test_name, passed in results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"  {test_name}: {status}")
        if not passed:
            all_passed = False

    print("\n" + "=" * 60)
    if all_passed:
        print(" ALL TESTS PASSED")
    else:
        print(" SOME TESTS FAILED - Physics engine needs adjustment")
    print("=" * 60 + "\n")

    return all_passed


if __name__ == "__main__":
    run_all_tests()
