#!/usr/bin/env python3
"""
Golf Weather API - Production Benchmark Test Suite
Tests against production URL for deployment verification
"""

import requests
import json
import sys
from datetime import datetime

# Production API URL - use staging since it's the current active deployment
API_BASE = "https://golf-weather-api-staging.up.railway.app"
API_KEY = "0aec1cb11c807a5a0c8d3dfe448d11ca5148df402274b36ae4810066892d9853"

def get_headers():
    """Return headers with API key"""
    return {"X-API-Key": API_KEY, "Content-Type": "application/json"}

def test_health():
    """Test API health endpoint"""
    print("\n=== Health Check ===")
    try:
        resp = requests.get(f"{API_BASE}/api/v1/health", timeout=10)
        data = resp.json()
        checks = data.get("checks", data)
        print(f"Status: {data.get('status', checks.get('api', 'unknown'))}")
        print(f"Version: {checks.get('version', 'unknown')}")
        print(f"Environment: {checks.get('environment', 'unknown')}")
        return data.get('status') == 'healthy'
    except Exception as e:
        print(f"ERROR: {e}")
        return False

def make_conditions(wind_speed=0, wind_direction=0, temperature=70, altitude=0, humidity=50, pressure=29.92):
    """Build conditions_override with all required fields"""
    return {
        "wind_speed": wind_speed,
        "wind_direction": wind_direction,
        "temperature": temperature,
        "altitude": altitude,
        "humidity": humidity,
        "air_pressure": pressure
    }

def test_professional_validation_caps():
    """Test Professional API validation caps"""
    print("\n=== Validation Cap Tests ===")
    results = []

    # Test 1: 40mph wind should be ACCEPTED
    print("\nTest: 40mph wind (should accept)...")
    try:
        resp = requests.post(f"{API_BASE}/api/v1/calculate", json={
            "ball_speed": 167,
            "launch_angle": 11.2,
            "spin_rate": 2600,
            "conditions_override": make_conditions(wind_speed=40)
        }, headers=get_headers(), timeout=15)
        if resp.status_code == 200:
            data = resp.json()
            carry = data.get("adjusted", {}).get("carry", {}).get("yards", 0)
            print(f"  PASS: 40mph accepted, carry={carry:.1f} yards")
            results.append(("40mph acceptance", True))
        else:
            print(f"  FAIL: Got {resp.status_code}")
            print(f"  Response: {resp.text[:200]}")
            results.append(("40mph acceptance", False))
    except Exception as e:
        print(f"  ERROR: {e}")
        results.append(("40mph acceptance", False))

    # Test 2: 50mph wind should be REJECTED
    print("\nTest: 50mph wind (should reject)...")
    try:
        resp = requests.post(f"{API_BASE}/api/v1/calculate", json={
            "ball_speed": 167,
            "launch_angle": 11.2,
            "spin_rate": 2600,
            "conditions_override": make_conditions(wind_speed=50)
        }, headers=get_headers(), timeout=15)
        if resp.status_code == 422:
            print("  PASS: 50mph rejected with 422")
            results.append(("50mph rejection", True))
        else:
            print(f"  FAIL: Got {resp.status_code} (expected 422)")
            results.append(("50mph rejection", False))
    except Exception as e:
        print(f"  ERROR: {e}")
        results.append(("50mph rejection", False))

    # Test 3: 110F should be REJECTED
    print("\nTest: 110F temperature (should reject)...")
    try:
        resp = requests.post(f"{API_BASE}/api/v1/calculate", json={
            "ball_speed": 167,
            "launch_angle": 11.2,
            "spin_rate": 2600,
            "conditions_override": make_conditions(temperature=110)
        }, headers=get_headers(), timeout=15)
        if resp.status_code == 422:
            print("  PASS: 110F rejected with 422")
            results.append(("110F rejection", True))
        else:
            print(f"  FAIL: Got {resp.status_code} (expected 422)")
            results.append(("110F rejection", False))
    except Exception as e:
        print(f"  ERROR: {e}")
        results.append(("110F rejection", False))

    # Test 4: 9000ft should be REJECTED
    print("\nTest: 9000ft altitude (should reject)...")
    try:
        resp = requests.post(f"{API_BASE}/api/v1/calculate", json={
            "ball_speed": 167,
            "launch_angle": 11.2,
            "spin_rate": 2600,
            "conditions_override": make_conditions(altitude=9000)
        }, headers=get_headers(), timeout=15)
        if resp.status_code == 422:
            print("  PASS: 9000ft rejected with 422")
            results.append(("9000ft rejection", True))
        else:
            print(f"  FAIL: Got {resp.status_code} (expected 422)")
            results.append(("9000ft rejection", False))
    except Exception as e:
        print(f"  ERROR: {e}")
        results.append(("9000ft rejection", False))

    return results

def test_gaming_presets():
    """Test all gaming presets"""
    print("\n=== Gaming Preset Tests ===")

    presets = [
        "calm_day",
        "hurricane_hero",
        "arctic_assault",
        "desert_inferno",
        "sweet_spot_tailwind",
        "monsoon_madness",
        "mountain_challenge",
        "polar_vortex",
        "dust_bowl",
        "wind_surfer"
    ]

    results = []

    for preset in presets:
        print(f"\nTest: {preset}...")
        try:
            resp = requests.post(f"{API_BASE}/api/v1/gaming/trajectory", json={
                "shot": {"player_handicap": 10, "club": "driver"},
                "preset": preset
            }, headers=get_headers(), timeout=15)
            if resp.status_code == 200:
                data = resp.json()
                carry = data.get("adjusted", {}).get("carry", {}).get("yards", 0)
                print(f"  PASS: {preset} = {carry:.1f} yards")
                results.append((preset, True, carry))
            else:
                print(f"  FAIL: {preset} returned {resp.status_code}")
                results.append((preset, False, 0))
        except Exception as e:
            print(f"  ERROR: {e}")
            results.append((preset, False, 0))

    return results

def test_industry_benchmarks():
    """Test against industry benchmark data"""
    print("\n=== Industry Benchmark Tests ===")
    results = []

    # Test 1: Calm baseline (PGA Tour average ~271 yards)
    print("\nTest: PGA Tour average baseline (calm)...")
    try:
        resp = requests.post(f"{API_BASE}/api/v1/calculate", json={
            "ball_speed": 167,
            "launch_angle": 11.2,
            "spin_rate": 2600,
            "conditions_override": make_conditions(wind_speed=0, temperature=70, altitude=0)
        }, headers=get_headers(), timeout=15)
        if resp.status_code == 200:
            data = resp.json()
            carry = data.get("adjusted", {}).get("carry", {}).get("yards", 0)
            expected = 271
            diff = abs(carry - expected)
            status = diff <= 5
            print(f"  Result: {carry:.1f} yards (expected ~{expected}, diff {diff:.1f})")
            print(f"  {'PASS' if status else 'FAIL'}: Within +/-5 yards of benchmark")
            results.append(("PGA baseline", status, carry, expected))
        else:
            print(f"  FAIL: API returned {resp.status_code}")
            results.append(("PGA baseline", False, 0, 271))
    except Exception as e:
        print(f"  ERROR: {e}")
        results.append(("PGA baseline", False, 0, 271))

    # Test 2: Denver altitude (+6% expected)
    print("\nTest: Denver altitude effect (5280ft)...")
    try:
        resp = requests.post(f"{API_BASE}/api/v1/calculate", json={
            "ball_speed": 167,
            "launch_angle": 11.2,
            "spin_rate": 2600,
            "conditions_override": make_conditions(wind_speed=0, temperature=70, altitude=5280)
        }, headers=get_headers(), timeout=15)
        if resp.status_code == 200:
            data = resp.json()
            carry = data.get("adjusted", {}).get("carry", {}).get("yards", 0)
            baseline = 271
            expected = 287  # 271 * 1.06
            pct_increase = ((carry - baseline) / baseline) * 100
            status = 4 <= pct_increase <= 8
            print(f"  Result: {carry:.1f} yards ({pct_increase:.1f}% increase)")
            print(f"  {'PASS' if status else 'FAIL'}: Expected 4-8% increase")
            results.append(("Denver altitude", status, carry, expected))
        else:
            print(f"  FAIL: API returned {resp.status_code}")
            results.append(("Denver altitude", False, 0, 287))
    except Exception as e:
        print(f"  ERROR: {e}")
        results.append(("Denver altitude", False, 0, 287))

    # Test 3: Sweet spot tailwind (~302 yards expected at 35mph tailwind)
    print("\nTest: Sweet spot 35mph tailwind...")
    try:
        resp = requests.post(f"{API_BASE}/api/v1/gaming/trajectory", json={
            "shot": {"player_handicap": 0, "club": "driver"},
            "preset": "sweet_spot_tailwind"
        }, headers=get_headers(), timeout=15)
        if resp.status_code == 200:
            data = resp.json()
            carry = data.get("adjusted", {}).get("carry", {}).get("yards", 0)
            expected_min, expected_max = 280, 320
            status = expected_min <= carry <= expected_max
            print(f"  Result: {carry:.1f} yards (expected {expected_min}-{expected_max})")
            print(f"  {'PASS' if status else 'FAIL'}")
            results.append(("Sweet spot tailwind", status, carry, 302))
        else:
            print(f"  FAIL: API returned {resp.status_code}")
            results.append(("Sweet spot tailwind", False, 0, 302))
    except Exception as e:
        print(f"  ERROR: {e}")
        results.append(("Sweet spot tailwind", False, 0, 302))

    # Test 4: Wind Surfer (~450-500 yards expected)
    print("\nTest: Wind Surfer 150mph tailwind...")
    try:
        resp = requests.post(f"{API_BASE}/api/v1/gaming/trajectory", json={
            "shot": {"player_handicap": 0, "club": "driver"},
            "preset": "wind_surfer"
        }, headers=get_headers(), timeout=15)
        if resp.status_code == 200:
            data = resp.json()
            carry = data.get("adjusted", {}).get("carry", {}).get("yards", 0)
            expected_min, expected_max = 430, 500
            status = expected_min <= carry <= expected_max
            print(f"  Result: {carry:.1f} yards (expected {expected_min}-{expected_max})")
            print(f"  {'PASS' if status else 'FAIL'}")
            results.append(("Wind Surfer", status, carry, 450))
        else:
            print(f"  FAIL: API returned {resp.status_code}")
            results.append(("Wind Surfer", False, 0, 450))
    except Exception as e:
        print(f"  ERROR: {e}")
        results.append(("Wind Surfer", False, 0, 450))

    return results

def main():
    """Run all production benchmark tests"""
    print("=" * 70)
    print("GOLF WEATHER API - PRODUCTION BENCHMARK TESTS")
    print("=" * 70)
    print(f"API: {API_BASE}")
    print(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    all_results = []

    # Health check
    health_ok = test_health()
    all_results.append(("Health check", health_ok))

    if not health_ok:
        print("\nERROR: Health check failed. Stopping tests.")
        return 1

    # Validation cap tests
    cap_results = test_professional_validation_caps()
    all_results.extend([(name, status) for name, status in cap_results])

    # Gaming preset tests
    preset_results = test_gaming_presets()
    all_results.extend([(name, status) for name, status, _ in preset_results])

    # Industry benchmark tests
    benchmark_results = test_industry_benchmarks()
    all_results.extend([(name, status) for name, status, _, _ in benchmark_results])

    # Summary
    print("\n" + "=" * 70)
    print("SUMMARY")
    print("=" * 70)

    passed = sum(1 for _, status in all_results if status)
    total = len(all_results)

    print(f"\nTotal: {passed}/{total} tests passed ({100*passed/total:.1f}%)")

    print("\nValidation Caps:")
    for name, status in cap_results:
        print(f"  [{'PASS' if status else 'FAIL'}] {name}")

    print("\nGaming Presets:")
    for name, status, carry in preset_results:
        print(f"  [{'PASS' if status else 'FAIL'}] {name}: {carry:.1f} yards")

    print("\nIndustry Benchmarks:")
    for name, status, actual, expected in benchmark_results:
        print(f"  [{'PASS' if status else 'FAIL'}] {name}: {actual:.1f} yards (expected ~{expected})")

    print("\n" + "=" * 70)
    if passed == total:
        print("ALL TESTS PASSED")
    else:
        print(f"SOME TESTS FAILED ({total - passed} failures)")
    print("=" * 70)

    return 0 if passed == total else 1

if __name__ == "__main__":
    sys.exit(main())
