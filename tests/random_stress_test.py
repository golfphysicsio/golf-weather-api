#!/usr/bin/env python3
"""
Golf Weather Physics API - Random Scenario Stress Test
Tests 30 randomized real-world scenarios to verify realistic, intuitive results.
"""

import requests
import sys

# Fix encoding for Windows
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

API_BASE = "https://golf-weather-api.vercel.app"

RANDOM_SCENARIOS = [
    # === MORNING ROUND SCENARIOS ===
    {
        "name": "Early morning tee time, slight dew",
        "club": "Driver",
        "ball_speed": 150,
        "launch_angle": 12,
        "spin_rate": 2800,
        "conditions": {"temperature": 58, "wind_speed": 3, "wind_direction": 45, "altitude": 200, "humidity": 85},
        "check": "Should be slightly shorter than standard (~230-245 yds)"
    },
    {
        "name": "Frost delay just lifted, cold and calm",
        "club": "7-Iron",
        "ball_speed": 110,
        "launch_angle": 19,
        "spin_rate": 6000,
        "conditions": {"temperature": 38, "wind_speed": 0, "wind_direction": 0, "altitude": 800, "humidity": 70},
        "check": "Cold = shorter. Expect ~165-175 yds"
    },

    # === AFTERNOON WIND SCENARIOS ===
    {
        "name": "Afternoon sea breeze kicks up",
        "club": "6-Iron",
        "ball_speed": 115,
        "launch_angle": 17,
        "spin_rate": 5500,
        "conditions": {"temperature": 72, "wind_speed": 18, "wind_direction": 0, "altitude": 50, "humidity": 65},
        "check": "Strong headwind = big loss. Expect ~140-155 yds"
    },
    {
        "name": "Downwind par 5, going for it",
        "club": "3-Wood",
        "ball_speed": 145,
        "launch_angle": 11,
        "spin_rate": 3500,
        "conditions": {"temperature": 78, "wind_speed": 15, "wind_direction": 180, "altitude": 300, "humidity": 55},
        "check": "Tailwind + warm = bomb. Expect ~225-250 yds"
    },
    {
        "name": "Crosswind approach to tucked pin",
        "club": "8-Iron",
        "ball_speed": 105,
        "launch_angle": 21,
        "spin_rate": 7000,
        "conditions": {"temperature": 70, "wind_speed": 12, "wind_direction": 90, "altitude": 400, "humidity": 50},
        "check": "Should drift 15-30 yards right"
    },

    # === EXTREME WEATHER ===
    {
        "name": "Desert summer - Phoenix at 2pm",
        "club": "9-Iron",
        "ball_speed": 100,
        "launch_angle": 24,
        "spin_rate": 8000,
        "conditions": {"temperature": 108, "wind_speed": 5, "wind_direction": 135, "altitude": 1100, "humidity": 12},
        "check": "Hot + altitude = longer. Expect ~165-180 yds"
    },
    {
        "name": "Scottish Open - horizontal rain",
        "club": "5-Iron",
        "ball_speed": 120,
        "launch_angle": 15,
        "spin_rate": 5000,
        "conditions": {"temperature": 52, "wind_speed": 28, "wind_direction": 30, "altitude": 50, "humidity": 95},
        "check": "Brutal headwind + cold. Expect ~145-170 yds, big reduction"
    },
    {
        "name": "Mountain golf - Vail at 8,000 ft",
        "club": "PW",
        "ball_speed": 95,
        "launch_angle": 27,
        "spin_rate": 9000,
        "conditions": {"temperature": 65, "wind_speed": 8, "wind_direction": 180, "altitude": 8000, "humidity": 30},
        "check": "High altitude + tailwind. Expect ~175-195 yds"
    },

    # === FAMOUS HOLES ===
    {
        "name": "Amen Corner - 12th at Augusta (downhill, wind swirls)",
        "club": "8-Iron",
        "ball_speed": 105,
        "launch_angle": 21,
        "spin_rate": 7000,
        "conditions": {"temperature": 72, "wind_speed": 10, "wind_direction": 60, "altitude": 350, "humidity": 60},
        "check": "Quartering headwind, expect ~155-170 yds with drift"
    },
    {
        "name": "17th at Sawgrass - island green, nerves",
        "club": "PW",
        "ball_speed": 95,
        "launch_angle": 27,
        "spin_rate": 9000,
        "conditions": {"temperature": 82, "wind_speed": 14, "wind_direction": 100, "altitude": 10, "humidity": 80},
        "check": "Crosswind over water. Check drift is 12-25 yds"
    },
    {
        "name": "Pebble Beach 7 - into the ocean wind",
        "club": "GW",
        "ball_speed": 88,
        "launch_angle": 30,
        "spin_rate": 9500,
        "conditions": {"temperature": 60, "wind_speed": 20, "wind_direction": 15, "altitude": 80, "humidity": 75},
        "check": "Strong headwind on short shot. Expect ~115-135 yds"
    },
    {
        "name": "St Andrews 17 - Road Hole approach",
        "club": "5-Iron",
        "ball_speed": 120,
        "launch_angle": 15,
        "spin_rate": 5000,
        "conditions": {"temperature": 55, "wind_speed": 22, "wind_direction": 45, "altitude": 30, "humidity": 80},
        "check": "Cold + quartering headwind. Expect ~160-180 yds"
    },

    # === CLUB SELECTION EDGE CASES ===
    {
        "name": "Driver in 30mph headwind - should I even hit this?",
        "club": "Driver",
        "ball_speed": 150,
        "launch_angle": 12,
        "spin_rate": 2800,
        "conditions": {"temperature": 65, "wind_speed": 30, "wind_direction": 0, "altitude": 500, "humidity": 50},
        "check": "Massive headwind. Expect ~160-195 yds (30%+ loss)"
    },
    {
        "name": "LW from 60 yards in calm conditions",
        "club": "LW",
        "ball_speed": 72,
        "launch_angle": 35,
        "spin_rate": 10500,
        "conditions": {"temperature": 70, "wind_speed": 2, "wind_direction": 90, "altitude": 100, "humidity": 50},
        "check": "Should be ~105-115 yds based on API baseline"
    },
    {
        "name": "Punch shot - 7-iron with low trajectory",
        "club": "7-Iron",
        "ball_speed": 100,
        "launch_angle": 12,
        "spin_rate": 4500,
        "conditions": {"temperature": 70, "wind_speed": 20, "wind_direction": 0, "altitude": 200, "humidity": 50},
        "check": "Lower launch = less wind effect. Expect ~115-135 yds"
    },

    # === ALTITUDE TRANSITIONS ===
    {
        "name": "Sea level player visiting Denver",
        "club": "7-Iron",
        "ball_speed": 110,
        "launch_angle": 19,
        "spin_rate": 6000,
        "conditions": {"temperature": 75, "wind_speed": 5, "wind_direction": 180, "altitude": 5280, "humidity": 35},
        "check": "Denver altitude + slight tailwind. Expect ~185-205 yds"
    },
    {
        "name": "Mexico City championship - 7,350 ft",
        "club": "6-Iron",
        "ball_speed": 115,
        "launch_angle": 17,
        "spin_rate": 5500,
        "conditions": {"temperature": 78, "wind_speed": 0, "wind_direction": 0, "altitude": 7350, "humidity": 45},
        "check": "Extreme altitude. Expect ~195-215 yds"
    },
    {
        "name": "Bandon Dunes - sea level but windy",
        "club": "4-Iron",
        "ball_speed": 125,
        "launch_angle": 14,
        "spin_rate": 4500,
        "conditions": {"temperature": 58, "wind_speed": 25, "wind_direction": 70, "altitude": 100, "humidity": 70},
        "check": "Quartering headwind + crosswind. Expect ~160-185 yds + drift"
    },

    # === TEMPERATURE EXTREMES ===
    {
        "name": "Winter golf - 40F, fingers numb",
        "club": "Driver",
        "ball_speed": 145,
        "launch_angle": 12,
        "spin_rate": 2800,
        "conditions": {"temperature": 40, "wind_speed": 10, "wind_direction": 45, "altitude": 300, "humidity": 60},
        "check": "Cold + headwind component. Expect ~200-225 yds"
    },
    {
        "name": "Vegas summer - 112F",
        "club": "8-Iron",
        "ball_speed": 105,
        "launch_angle": 21,
        "spin_rate": 7000,
        "conditions": {"temperature": 112, "wind_speed": 8, "wind_direction": 180, "altitude": 2000, "humidity": 8},
        "check": "Scorching + altitude + tailwind. Expect ~180-200 yds"
    },

    # === TRICKY COMBINATIONS ===
    {
        "name": "High altitude but strong headwind - cancel out?",
        "club": "6-Iron",
        "ball_speed": 115,
        "launch_angle": 17,
        "spin_rate": 5500,
        "conditions": {"temperature": 70, "wind_speed": 18, "wind_direction": 0, "altitude": 6000, "humidity": 40},
        "check": "+7% altitude vs -18% headwind = net negative. Expect ~155-175 yds"
    },
    {
        "name": "Sea level, hot, strong tailwind - max distance",
        "club": "Driver",
        "ball_speed": 155,
        "launch_angle": 12,
        "spin_rate": 2600,
        "conditions": {"temperature": 95, "wind_speed": 20, "wind_direction": 180, "altitude": 50, "humidity": 70},
        "check": "Everything helping. Expect ~275-300 yds"
    },
    {
        "name": "Cold, sea level, calm - baseline cold weather",
        "club": "5-Iron",
        "ball_speed": 120,
        "launch_angle": 15,
        "spin_rate": 5000,
        "conditions": {"temperature": 45, "wind_speed": 0, "wind_direction": 0, "altitude": 50, "humidity": 55},
        "check": "Cold but no wind. Expect ~180-195 yds"
    },

    # === SCORING SHOTS ===
    {
        "name": "GW to tight pin, back into wind",
        "club": "GW",
        "ball_speed": 88,
        "launch_angle": 30,
        "spin_rate": 9500,
        "conditions": {"temperature": 68, "wind_speed": 12, "wind_direction": 0, "altitude": 600, "humidity": 50},
        "check": "Headwind on wedge. Expect ~120-138 yds"
    },
    {
        "name": "SW from 85 yards, downwind",
        "club": "SW",
        "ball_speed": 80,
        "launch_angle": 32,
        "spin_rate": 10000,
        "conditions": {"temperature": 75, "wind_speed": 10, "wind_direction": 180, "altitude": 400, "humidity": 50},
        "check": "Tailwind helps wedge. Expect ~130-150 yds"
    },

    # === SANITY CHECKS ===
    {
        "name": "Perfect conditions - no excuses",
        "club": "7-Iron",
        "ball_speed": 110,
        "launch_angle": 19,
        "spin_rate": 6000,
        "conditions": {"temperature": 72, "wind_speed": 0, "wind_direction": 0, "altitude": 300, "humidity": 50},
        "check": "Near-perfect conditions. Should be close to baseline ~172-178 yds"
    },
    {
        "name": "Everything against you",
        "club": "6-Iron",
        "ball_speed": 115,
        "launch_angle": 17,
        "spin_rate": 5500,
        "conditions": {"temperature": 38, "wind_speed": 25, "wind_direction": 0, "altitude": 0, "humidity": 90},
        "check": "Freezing + gale headwind. Expect ~120-150 yds (30-35% loss)"
    },
    {
        "name": "Everything helping you",
        "club": "6-Iron",
        "ball_speed": 115,
        "launch_angle": 17,
        "spin_rate": 5500,
        "conditions": {"temperature": 100, "wind_speed": 20, "wind_direction": 180, "altitude": 8000, "humidity": 20},
        "check": "Hot + altitude + tailwind. Expect ~215-240 yds"
    },
    {
        "name": "Random Tuesday afternoon",
        "club": "9-Iron",
        "ball_speed": 100,
        "launch_angle": 24,
        "spin_rate": 8000,
        "conditions": {"temperature": 76, "wind_speed": 7, "wind_direction": 120, "altitude": 450, "humidity": 55},
        "check": "Typical conditions. Should be ~155-175 yds with slight drift"
    },
    {
        "name": "Last hole, need to hit the fairway",
        "club": "3-Wood",
        "ball_speed": 145,
        "launch_angle": 11,
        "spin_rate": 3500,
        "conditions": {"temperature": 70, "wind_speed": 12, "wind_direction": 75, "altitude": 500, "humidity": 50},
        "check": "Crosswind off tee. Expect ~200-225 yds with 15-30 yd drift"
    },
]


def call_api(scenario):
    """Call the API with correct payload format."""
    payload = {
        "shot": {
            "ball_speed_mph": scenario["ball_speed"],
            "launch_angle_deg": scenario["launch_angle"],
            "spin_rate_rpm": scenario["spin_rate"],
            "spin_axis_deg": 0,
            "direction_deg": 0
        },
        "conditions": {
            "temperature_f": scenario["conditions"]["temperature"],
            "wind_speed_mph": scenario["conditions"]["wind_speed"],
            "wind_direction_deg": scenario["conditions"]["wind_direction"],
            "altitude_ft": scenario["conditions"]["altitude"],
            "humidity_pct": scenario["conditions"]["humidity"]
        }
    }

    response = requests.post(
        f"{API_BASE}/v1/trajectory",
        json=payload,
        headers={"Content-Type": "application/json"},
        timeout=30
    )

    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"API Error: {response.status_code} - {response.text[:100]}")


def run_stress_test():
    print("=" * 80)
    print("GOLF WEATHER API - RANDOM SCENARIO STRESS TEST")
    print("=" * 80)
    print(f"\nAPI Endpoint: {API_BASE}")
    print(f"Total Scenarios: {len(RANDOM_SCENARIOS)}")
    print("\n" + "=" * 80)

    results = []

    for i, scenario in enumerate(RANDOM_SCENARIOS, 1):
        print(f"\n[{i}/30] {scenario['name']}")
        print(f"  Club: {scenario['club']} | Ball Speed: {scenario['ball_speed']} mph")

        cond = scenario["conditions"]
        print(f"  Conditions: {cond['temperature']}F, {cond['wind_speed']}mph @ {cond['wind_direction']}deg, {cond['altitude']}ft alt")

        try:
            data = call_api(scenario)

            carry = data["adjusted"]["carry_yards"]
            drift = abs(data["adjusted"]["lateral_drift_yards"])

            print(f"  Result: {carry:.1f} yds carry, {drift:.1f} yds drift")
            print(f"  Expected: {scenario['check']}")

            results.append({
                "name": scenario["name"],
                "club": scenario["club"],
                "carry": carry,
                "drift": drift,
                "conditions": scenario["conditions"],
                "expected": scenario["check"],
                "status": "OK"
            })

        except Exception as e:
            print(f"  ERROR: {e}")
            results.append({
                "name": scenario["name"],
                "club": scenario["club"],
                "error": str(e),
                "status": "ERROR"
            })

    # Summary Table
    print("\n" + "=" * 80)
    print("RESULTS SUMMARY TABLE")
    print("=" * 80)
    print(f"\n{'Scenario':<50} {'Carry':>8} {'Drift':>8} {'Status':>10}")
    print("-" * 80)

    for r in results:
        if r["status"] == "OK":
            status = "OK"
            carry_str = f"{r['carry']:.1f}"
            drift_str = f"{r['drift']:.1f}"
        else:
            status = "ERROR"
            carry_str = "-"
            drift_str = "-"

        name = r["name"][:48] if len(r["name"]) > 48 else r["name"]
        print(f"{name:<50} {carry_str:>8} {drift_str:>8} {status:>10}")

    # Analysis
    print("\n" + "=" * 80)
    print("INTUITIVE CHECK ANALYSIS")
    print("=" * 80)

    ok_results = [r for r in results if r["status"] == "OK"]

    # Check for any obvious issues
    issues = []

    for r in ok_results:
        carry = r["carry"]
        drift = r["drift"]
        cond = r["conditions"]

        # Flag impossibly long/short shots
        if carry > 320:
            issues.append(f"! {r['name']}: {carry:.0f} yds seems impossibly long")
        if carry < 50:
            issues.append(f"! {r['name']}: {carry:.0f} yds seems impossibly short")

        # Flag crosswind without drift
        if cond["wind_speed"] >= 10 and cond["wind_direction"] in [90, 270] and drift < 5:
            issues.append(f"! {r['name']}: Strong crosswind but only {drift:.1f} yds drift")

        # Flag tailwind making shot shorter (wrong direction)
        if cond["wind_direction"] == 180 and cond["wind_speed"] >= 10:
            # Tailwind should help, not hurt
            pass  # Would need baseline to compare

    if issues:
        print("\nPotential Issues Detected:")
        for issue in issues:
            print(f"  {issue}")
    else:
        print("\nNo obvious issues detected - all results appear intuitive!")

    # Wind effect summary
    print("\n" + "-" * 40)
    print("Wind Effect Samples:")

    # Find headwind vs tailwind examples
    headwind_shots = [r for r in ok_results if r["conditions"]["wind_direction"] == 0 and r["conditions"]["wind_speed"] >= 15]
    tailwind_shots = [r for r in ok_results if r["conditions"]["wind_direction"] == 180 and r["conditions"]["wind_speed"] >= 15]

    if headwind_shots:
        print(f"  Headwind shots (15+ mph):")
        for r in headwind_shots[:3]:
            print(f"    - {r['name'][:30]}: {r['carry']:.0f} yds")

    if tailwind_shots:
        print(f"  Tailwind shots (15+ mph):")
        for r in tailwind_shots[:3]:
            print(f"    - {r['name'][:30]}: {r['carry']:.0f} yds")

    # Altitude effect
    print("\n" + "-" * 40)
    print("Altitude Effect Samples:")

    high_alt = [r for r in ok_results if r["conditions"]["altitude"] >= 5000]
    sea_level = [r for r in ok_results if r["conditions"]["altitude"] <= 100]

    if high_alt:
        print(f"  High altitude (5000+ ft):")
        for r in high_alt[:3]:
            print(f"    - {r['name'][:30]}: {r['carry']:.0f} yds @ {r['conditions']['altitude']}ft")

    print("\n" + "=" * 80)
    print("TEST COMPLETE")
    print("=" * 80)

    return results


if __name__ == "__main__":
    run_stress_test()
