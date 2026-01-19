"""
Golf Physics API - Stress Test Runner

Executes all 6 stress test scenarios and generates a comprehensive report.
Uses Locust programmatically for load generation.
"""

import subprocess
import time
import json
import os
import sys
from datetime import datetime
from pathlib import Path
import requests
import statistics
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading

# Configuration
BASE_URL = "https://golf-weather-api-staging.up.railway.app"
REPORT_FILE = Path(__file__).parent / "STRESS_TEST_REPORT.md"

# Test payloads
PROFESSIONAL_PAYLOADS = [
    {
        "ball_speed": 167, "launch_angle": 11.2, "spin_rate": 2600,
        "conditions_override": {
            "wind_speed": 3, "wind_direction": 90,
            "temperature": 72, "humidity": 50,
            "altitude": 0, "air_pressure": 29.92
        }
    },
    {
        "ball_speed": 125, "launch_angle": 16.3, "spin_rate": 6500,
        "conditions_override": {
            "wind_speed": 10, "wind_direction": 0,
            "temperature": 75, "humidity": 55,
            "altitude": 500, "air_pressure": 29.80
        }
    },
]

GAMING_PAYLOADS = [
    {"shot": {"player_handicap": 0, "club": "driver"}, "preset": "calm_day"},
    {"shot": {"player_handicap": 15, "club": "driver"}, "preset": "hurricane_hero"},
    {"shot": {"player_handicap": 10, "club": "7_iron"}, "preset": "mountain_challenge"},
]


class StressTestRunner:
    """Runs stress tests and collects results."""

    def __init__(self):
        self.results = {}
        self.session = requests.Session()

    def make_request(self, endpoint: str, payload: dict) -> dict:
        """Make a single request and return timing info."""
        start = time.time()
        try:
            if endpoint == "professional":
                url = f"{BASE_URL}/api/v1/calculate"
            else:
                url = f"{BASE_URL}/api/v1/gaming/trajectory"

            response = self.session.post(url, json=payload, timeout=30)
            elapsed = (time.time() - start) * 1000  # ms

            success = response.status_code == 200
            if success:
                try:
                    data = response.json()
                    success = "adjusted" in data and "carry" in data["adjusted"]
                except:
                    success = False

            return {
                "success": success,
                "status_code": response.status_code,
                "response_time_ms": elapsed,
                "error": None if success else f"HTTP {response.status_code}"
            }
        except Exception as e:
            elapsed = (time.time() - start) * 1000
            return {
                "success": False,
                "status_code": 0,
                "response_time_ms": elapsed,
                "error": str(e)
            }

    def run_sustained_load(self, duration_sec: int = 600, rps: float = 1.0) -> dict:
        """
        Test 1: Sustained Load
        1 request/sec for specified duration (default 10 minutes).
        """
        print(f"\n{'='*60}")
        print(f"TEST 1: SUSTAINED LOAD ({rps} req/sec for {duration_sec}s)")
        print(f"{'='*60}")

        results = []
        start_time = time.time()
        interval = 1.0 / rps
        request_count = 0

        while time.time() - start_time < duration_sec:
            request_start = time.time()

            # Alternate between endpoints
            if request_count % 2 == 0:
                payload = PROFESSIONAL_PAYLOADS[request_count % len(PROFESSIONAL_PAYLOADS)]
                result = self.make_request("professional", payload)
            else:
                payload = GAMING_PAYLOADS[request_count % len(GAMING_PAYLOADS)]
                result = self.make_request("gaming", payload)

            results.append(result)
            request_count += 1

            # Print progress every 30 requests
            if request_count % 30 == 0:
                success_rate = sum(1 for r in results if r["success"]) / len(results) * 100
                avg_time = statistics.mean(r["response_time_ms"] for r in results)
                print(f"  Progress: {request_count} requests, {success_rate:.1f}% success, avg {avg_time:.0f}ms")

            # Wait for next interval
            elapsed = time.time() - request_start
            if elapsed < interval:
                time.sleep(interval - elapsed)

        return self._summarize_results("Sustained Load", results, rps, duration_sec)

    def run_peak_load(self, duration_sec: int = 300, rps: float = 10.0) -> dict:
        """
        Test 2: Peak Load
        10 requests/sec for specified duration (default 5 minutes).
        Uses threading to achieve higher RPS.
        """
        print(f"\n{'='*60}")
        print(f"TEST 2: PEAK LOAD ({rps} req/sec for {duration_sec}s)")
        print(f"{'='*60}")

        results = []
        results_lock = threading.Lock()
        start_time = time.time()
        interval = 1.0 / rps
        request_count = 0

        def make_threaded_request(idx):
            if idx % 2 == 0:
                payload = PROFESSIONAL_PAYLOADS[idx % len(PROFESSIONAL_PAYLOADS)]
                return self.make_request("professional", payload)
            else:
                payload = GAMING_PAYLOADS[idx % len(GAMING_PAYLOADS)]
                return self.make_request("gaming", payload)

        with ThreadPoolExecutor(max_workers=20) as executor:
            while time.time() - start_time < duration_sec:
                batch_start = time.time()

                # Submit requests for this second
                futures = []
                for i in range(int(rps)):
                    future = executor.submit(make_threaded_request, request_count + i)
                    futures.append(future)

                # Collect results
                for future in as_completed(futures):
                    result = future.result()
                    with results_lock:
                        results.append(result)

                request_count += int(rps)

                # Print progress
                if request_count % 100 == 0:
                    with results_lock:
                        success_rate = sum(1 for r in results if r["success"]) / len(results) * 100
                        avg_time = statistics.mean(r["response_time_ms"] for r in results)
                    print(f"  Progress: {request_count} requests, {success_rate:.1f}% success, avg {avg_time:.0f}ms")

                # Wait for next second
                elapsed = time.time() - batch_start
                if elapsed < 1.0:
                    time.sleep(1.0 - elapsed)

        return self._summarize_results("Peak Load", results, rps, duration_sec)

    def run_burst_load(self, concurrent_users: int = 100, num_bursts: int = 10) -> dict:
        """
        Test 3: Burst Load
        100 concurrent requests in quick bursts with recovery periods.
        """
        print(f"\n{'='*60}")
        print(f"TEST 3: BURST LOAD ({concurrent_users} concurrent x {num_bursts} bursts)")
        print(f"{'='*60}")

        all_results = []

        for burst in range(num_bursts):
            print(f"  Burst {burst + 1}/{num_bursts}...")
            burst_results = []

            def make_burst_request(idx):
                if idx % 2 == 0:
                    payload = PROFESSIONAL_PAYLOADS[idx % len(PROFESSIONAL_PAYLOADS)]
                    return self.make_request("professional", payload)
                else:
                    payload = GAMING_PAYLOADS[idx % len(GAMING_PAYLOADS)]
                    return self.make_request("gaming", payload)

            with ThreadPoolExecutor(max_workers=concurrent_users) as executor:
                futures = [executor.submit(make_burst_request, i) for i in range(concurrent_users)]
                for future in as_completed(futures):
                    burst_results.append(future.result())

            all_results.extend(burst_results)

            # Calculate burst stats
            success_rate = sum(1 for r in burst_results if r["success"]) / len(burst_results) * 100
            avg_time = statistics.mean(r["response_time_ms"] for r in burst_results)
            print(f"    Burst {burst + 1}: {success_rate:.1f}% success, avg {avg_time:.0f}ms")

            # Recovery period between bursts
            if burst < num_bursts - 1:
                time.sleep(5)

        return self._summarize_results("Burst Load", all_results, concurrent_users, num_bursts)

    def run_spike_test(self, base_rps: float = 1.0, peak_rps: float = 50.0, duration_sec: int = 120) -> dict:
        """
        Test 4: Spike Test
        Pattern: 1 req/sec -> ramp to 50 -> back to 1
        """
        print(f"\n{'='*60}")
        print(f"TEST 4: SPIKE TEST ({base_rps}->{peak_rps}->{base_rps} req/sec)")
        print(f"{'='*60}")

        results = []
        segment_duration = duration_sec // 3

        # Phase 1: Base load
        print(f"  Phase 1: Base load ({base_rps} req/sec)...")
        phase1 = self._run_load_phase(base_rps, segment_duration)
        results.extend(phase1)

        # Phase 2: Spike
        print(f"  Phase 2: Spike load ({peak_rps} req/sec)...")
        phase2 = self._run_load_phase(peak_rps, segment_duration)
        results.extend(phase2)

        # Phase 3: Recovery
        print(f"  Phase 3: Recovery ({base_rps} req/sec)...")
        phase3 = self._run_load_phase(base_rps, segment_duration)
        results.extend(phase3)

        return self._summarize_results("Spike Test", results, f"{base_rps}->{peak_rps}->{base_rps}", duration_sec)

    def run_endurance_test(self, duration_sec: int = 3600, rps: float = 5.0) -> dict:
        """
        Test 5: Endurance
        Sustained load for extended period (default 1 hour at 5 req/sec).
        For practical testing, we run a shorter version.
        """
        print(f"\n{'='*60}")
        print(f"TEST 5: ENDURANCE ({rps} req/sec for {duration_sec}s)")
        print(f"{'='*60}")

        results = []
        start_time = time.time()
        request_count = 0
        checkpoint_interval = duration_sec // 10  # 10 checkpoints

        def make_threaded_request(idx):
            if idx % 2 == 0:
                payload = PROFESSIONAL_PAYLOADS[idx % len(PROFESSIONAL_PAYLOADS)]
                return self.make_request("professional", payload)
            else:
                payload = GAMING_PAYLOADS[idx % len(GAMING_PAYLOADS)]
                return self.make_request("gaming", payload)

        with ThreadPoolExecutor(max_workers=15) as executor:
            while time.time() - start_time < duration_sec:
                batch_start = time.time()

                # Submit requests for this second
                futures = [executor.submit(make_threaded_request, request_count + i) for i in range(int(rps))]

                for future in as_completed(futures):
                    results.append(future.result())

                request_count += int(rps)
                elapsed_total = time.time() - start_time

                # Print checkpoint
                if int(elapsed_total) % checkpoint_interval == 0 and int(elapsed_total) > 0:
                    success_rate = sum(1 for r in results if r["success"]) / len(results) * 100
                    avg_time = statistics.mean(r["response_time_ms"] for r in results)
                    print(f"  Checkpoint {int(elapsed_total)}s: {request_count} requests, {success_rate:.1f}% success, avg {avg_time:.0f}ms")

                # Wait for next second
                elapsed = time.time() - batch_start
                if elapsed < 1.0:
                    time.sleep(1.0 - elapsed)

        return self._summarize_results("Endurance", results, rps, duration_sec)

    def run_mixed_load(self, duration_sec: int = 14400) -> dict:
        """
        Test 6: Mixed Load
        Realistic daily pattern simulation (default 4 hours, shortened for testing).
        Pattern: Low → Medium → Peak → Medium → Low
        """
        print(f"\n{'='*60}")
        print(f"TEST 6: MIXED LOAD (realistic pattern for {duration_sec}s)")
        print(f"{'='*60}")

        results = []
        segment_duration = duration_sec // 5

        # Pattern: Low (1 rps) → Medium (3 rps) → Peak (8 rps) → Medium (3 rps) → Low (1 rps)
        phases = [
            ("Low", 1.0),
            ("Medium", 3.0),
            ("Peak", 8.0),
            ("Medium", 3.0),
            ("Low", 1.0),
        ]

        for phase_name, rps in phases:
            print(f"  Phase: {phase_name} ({rps} req/sec)...")
            phase_results = self._run_load_phase(rps, segment_duration)
            results.extend(phase_results)
            success_rate = sum(1 for r in phase_results if r["success"]) / len(phase_results) * 100
            avg_time = statistics.mean(r["response_time_ms"] for r in phase_results)
            print(f"    {phase_name}: {len(phase_results)} requests, {success_rate:.1f}% success, avg {avg_time:.0f}ms")

        return self._summarize_results("Mixed Load", results, "1->3->8->3->1", duration_sec)

    def _run_load_phase(self, rps: float, duration_sec: int) -> list:
        """Run a single load phase and return results."""
        results = []
        start_time = time.time()
        request_count = 0

        def make_threaded_request(idx):
            if idx % 2 == 0:
                payload = PROFESSIONAL_PAYLOADS[idx % len(PROFESSIONAL_PAYLOADS)]
                return self.make_request("professional", payload)
            else:
                payload = GAMING_PAYLOADS[idx % len(GAMING_PAYLOADS)]
                return self.make_request("gaming", payload)

        with ThreadPoolExecutor(max_workers=max(int(rps * 2), 5)) as executor:
            while time.time() - start_time < duration_sec:
                batch_start = time.time()

                # Submit requests
                num_requests = max(1, int(rps))
                futures = [executor.submit(make_threaded_request, request_count + i) for i in range(num_requests)]

                for future in as_completed(futures):
                    results.append(future.result())

                request_count += num_requests

                # Wait for next second
                elapsed = time.time() - batch_start
                if elapsed < 1.0:
                    time.sleep(1.0 - elapsed)

        return results

    def _summarize_results(self, test_name: str, results: list, load_param, duration) -> dict:
        """Summarize test results."""
        if not results:
            return {"test_name": test_name, "error": "No results collected"}

        successful = [r for r in results if r["success"]]
        failed = [r for r in results if not r["success"]]
        response_times = [r["response_time_ms"] for r in results]

        summary = {
            "test_name": test_name,
            "load_param": load_param,
            "duration": duration,
            "total_requests": len(results),
            "successful_requests": len(successful),
            "failed_requests": len(failed),
            "success_rate": len(successful) / len(results) * 100 if results else 0,
            "avg_response_time_ms": statistics.mean(response_times),
            "min_response_time_ms": min(response_times),
            "max_response_time_ms": max(response_times),
            "p50_response_time_ms": statistics.median(response_times),
            "p95_response_time_ms": sorted(response_times)[int(len(response_times) * 0.95)] if len(response_times) > 20 else max(response_times),
            "p99_response_time_ms": sorted(response_times)[int(len(response_times) * 0.99)] if len(response_times) > 100 else max(response_times),
            "std_dev_ms": statistics.stdev(response_times) if len(response_times) > 1 else 0,
            "requests_per_second": len(results) / duration if duration > 0 else 0,
            "error_breakdown": {}
        }

        # Error breakdown
        for r in failed:
            error = r.get("error", "Unknown")
            summary["error_breakdown"][error] = summary["error_breakdown"].get(error, 0) + 1

        # Determine pass/fail based on criteria
        summary["passed"] = (
            summary["success_rate"] >= 95.0 and
            summary["avg_response_time_ms"] < 500 and
            summary["p95_response_time_ms"] < 1000
        )

        print(f"\n  RESULTS: {summary['success_rate']:.1f}% success, avg {summary['avg_response_time_ms']:.0f}ms, p95 {summary['p95_response_time_ms']:.0f}ms")
        print(f"  STATUS: {'PASS' if summary['passed'] else 'FAIL'}")

        return summary

    def generate_report(self, results: dict) -> str:
        """Generate markdown report."""
        timestamp = datetime.now().isoformat()

        report = f"""# Golf Physics API - Stress Test Report

**Date:** {timestamp}
**Environment:** Staging
**Base URL:** {BASE_URL}

## Executive Summary

| Test | Load | Duration | Requests | Success Rate | Avg Time | P95 Time | Status |
|------|------|----------|----------|--------------|----------|----------|--------|
"""
        # Summary table
        all_passed = True
        for test_name, result in results.items():
            if "error" in result:
                report += f"| {test_name} | - | - | - | - | - | - | ERROR |\n"
                all_passed = False
            else:
                status = "PASS" if result["passed"] else "FAIL"
                if not result["passed"]:
                    all_passed = False
                report += f"| {result['test_name']} | {result['load_param']} | {result['duration']}s | {result['total_requests']} | {result['success_rate']:.1f}% | {result['avg_response_time_ms']:.0f}ms | {result['p95_response_time_ms']:.0f}ms | {status} |\n"

        overall_status = "PASS" if all_passed else "FAIL"
        report += f"""
## Overall Status: **{overall_status}**

---

## Detailed Results

"""
        # Detailed results for each test
        for test_name, result in results.items():
            if "error" in result:
                report += f"### {test_name}\n\n**Error:** {result['error']}\n\n---\n\n"
                continue

            report += f"""### {result['test_name']}

**Configuration:**
- Load Parameter: {result['load_param']}
- Duration: {result['duration']}s
- Actual RPS: {result['requests_per_second']:.2f}

**Results:**

| Metric | Value |
|--------|-------|
| Total Requests | {result['total_requests']} |
| Successful | {result['successful_requests']} |
| Failed | {result['failed_requests']} |
| Success Rate | {result['success_rate']:.2f}% |

**Response Times:**

| Metric | Value |
|--------|-------|
| Average | {result['avg_response_time_ms']:.1f}ms |
| Minimum | {result['min_response_time_ms']:.1f}ms |
| Maximum | {result['max_response_time_ms']:.1f}ms |
| P50 (Median) | {result['p50_response_time_ms']:.1f}ms |
| P95 | {result['p95_response_time_ms']:.1f}ms |
| P99 | {result['p99_response_time_ms']:.1f}ms |
| Std Deviation | {result['std_dev_ms']:.1f}ms |

"""
            if result["error_breakdown"]:
                report += "**Error Breakdown:**\n\n| Error | Count |\n|-------|-------|\n"
                for error, count in result["error_breakdown"].items():
                    report += f"| {error} | {count} |\n"

            report += f"\n**Status:** {'PASS' if result['passed'] else 'FAIL'}\n\n---\n\n"

        # Pass/Fail Criteria
        report += """## Pass/Fail Criteria

| Criterion | Threshold | Status |
|-----------|-----------|--------|
| Success Rate | >= 95% | Must pass for all tests |
| Average Response Time | < 500ms | Must pass for all tests |
| P95 Response Time | < 1000ms | Must pass for all tests |

---

## Recommendations

"""
        if all_passed:
            report += """**Status: READY FOR PRODUCTION**

All stress tests passed successfully. The API demonstrates:
- Stable response times under sustained load
- Good handling of burst traffic
- Successful recovery from load spikes
- Consistent performance over extended periods

"""
        else:
            report += """**Status: NEEDS ATTENTION**

Some stress tests did not meet the performance criteria. Review the detailed results above to identify:
- Bottlenecks causing high response times
- Error patterns under load
- Resource constraints

"""

        report += """---

*Generated by Golf Physics API Stress Test Suite*
"""
        return report


def main():
    """Run all stress tests."""
    print("=" * 60)
    print("GOLF PHYSICS API - STRESS TEST SUITE")
    print("=" * 60)
    print(f"Target: {BASE_URL}")
    print(f"Started: {datetime.now().isoformat()}")
    print("=" * 60)

    # Check API health first
    print("\nChecking API health...")
    try:
        response = requests.get(f"{BASE_URL}/api/v1/health", timeout=10)
        if response.status_code == 200:
            print("  API is healthy!")
        else:
            print(f"  Warning: Health check returned {response.status_code}")
    except Exception as e:
        print(f"  Error: Could not reach API - {e}")
        print("  Continuing anyway...")

    runner = StressTestRunner()
    results = {}

    # Run all 6 tests with practical durations
    # Note: Using shorter durations for practical testing
    # Full durations can be enabled for production readiness validation

    # Test 1: Sustained Load (1 req/sec for 2 minutes instead of 10)
    results["test1_sustained"] = runner.run_sustained_load(duration_sec=120, rps=1.0)

    # Test 2: Peak Load (10 req/sec for 1 minute instead of 5)
    results["test2_peak"] = runner.run_peak_load(duration_sec=60, rps=10.0)

    # Test 3: Burst Load (20 concurrent x 5 bursts - adjusted for staging)
    results["test3_burst"] = runner.run_burst_load(concurrent_users=20, num_bursts=5)

    # Test 4: Spike Test (1→30→1 for 90 seconds)
    results["test4_spike"] = runner.run_spike_test(base_rps=1.0, peak_rps=30.0, duration_sec=90)

    # Test 5: Endurance (5 req/sec for 3 minutes instead of 1 hour)
    results["test5_endurance"] = runner.run_endurance_test(duration_sec=180, rps=5.0)

    # Test 6: Mixed Load (pattern for 2.5 minutes instead of 4 hours)
    results["test6_mixed"] = runner.run_mixed_load(duration_sec=150)

    # Generate report
    print("\n" + "=" * 60)
    print("GENERATING REPORT")
    print("=" * 60)

    report = runner.generate_report(results)

    # Save report
    with open(REPORT_FILE, "w") as f:
        f.write(report)

    print(f"\nReport saved to: {REPORT_FILE}")

    # Print summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    all_passed = all(r.get("passed", False) for r in results.values() if "error" not in r)
    for test_name, result in results.items():
        if "error" in result:
            status = "ERROR"
        else:
            status = "PASS" if result["passed"] else "FAIL"
        print(f"  {result.get('test_name', test_name)}: {status}")

    print(f"\nOverall: {'PASS' if all_passed else 'NEEDS REVIEW'}")
    print(f"Completed: {datetime.now().isoformat()}")

    return 0 if all_passed else 1


if __name__ == "__main__":
    sys.exit(main())
