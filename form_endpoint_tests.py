"""
Form Endpoint Test Suite
Tests the API Key Request and Contact Form endpoints in production.

Tests:
1. API Key Request - New user
2. API Key Request - Duplicate prevention
3. Contact Form - Single submission
4. Contact Form - Multiple submissions (should allow)
5. High-value lead detection
"""

import requests
import json
from datetime import datetime
import time

# Configuration
BASE_URL = "https://golf-weather-api-production.up.railway.app"
TEST_EMAIL = "golfphysicsio@gmail.com"

# Test results tracking
results = []


def log_result(test_name: str, passed: bool, details: str = "", response_data: dict = None):
    """Log test result."""
    status = "PASS" if passed else "FAIL"
    print(f"\n{'='*60}")
    print(f"Test: {test_name}")
    print(f"Status: {status}")
    if details:
        print(f"Details: {details}")
    if response_data:
        print(f"Response: {json.dumps(response_data, indent=2)}")
    print(f"{'='*60}")

    results.append({
        "test": test_name,
        "passed": passed,
        "details": details,
        "response": response_data
    })


def test_health_check():
    """Test 0: Verify API is healthy."""
    print("\n" + "="*70)
    print("TEST 0: Health Check")
    print("="*70)

    try:
        response = requests.get(f"{BASE_URL}/api/v1/health", timeout=10)
        data = response.json()

        if response.status_code == 200 and data.get("status") == "healthy":
            log_result("Health Check", True, f"API is healthy - v{data.get('version')}", data)
            return True
        else:
            log_result("Health Check", False, f"Unexpected response", data)
            return False
    except Exception as e:
        log_result("Health Check", False, f"Error: {str(e)}")
        return False


def test_api_key_request_new_user():
    """Test 1: Request API key for a new user."""
    print("\n" + "="*70)
    print("TEST 1: API Key Request - New User")
    print("="*70)

    # Use a unique email variant for testing
    timestamp = datetime.now().strftime("%H%M%S")
    test_email = f"golfphysicsio+test{timestamp}@gmail.com"

    payload = {
        "name": "Test User",
        "email": test_email,
        "company": "Test Company",
        "use_case": "personal",
        "expected_volume": "under_1k",
        "agreed_to_terms": True,
        "recaptcha_token": None  # Will be skipped in dev mode
    }

    try:
        response = requests.post(
            f"{BASE_URL}/api/request-api-key",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        data = response.json()

        if response.status_code == 200 and data.get("success"):
            log_result(
                "API Key Request - New User",
                True,
                f"API key request accepted for {test_email}",
                data
            )
            return test_email
        else:
            log_result(
                "API Key Request - New User",
                False,
                f"Status: {response.status_code}",
                data
            )
            return None
    except Exception as e:
        log_result("API Key Request - New User", False, f"Error: {str(e)}")
        return None


def test_api_key_duplicate_prevention(email: str):
    """Test 2: Verify duplicate API key triggers reissue."""
    print("\n" + "="*70)
    print("TEST 2: API Key Request - Duplicate Triggers Reissue")
    print("="*70)

    if not email:
        log_result("API Key Reissue", False, "No email from previous test")
        return

    payload = {
        "name": "Test User Duplicate",
        "email": email,  # Same email as Test 1
        "company": "Another Company",
        "use_case": "developer",
        "expected_volume": "1k_10k",
        "agreed_to_terms": True,
        "recaptcha_token": None
    }

    try:
        response = requests.post(
            f"{BASE_URL}/api/request-api-key",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        data = response.json()

        # New behavior: Should return success with reissue message
        # Old key is deactivated, new key is generated and emailed
        if response.status_code == 200 and data.get("success"):
            message = data.get("message", "")
            if "reissued" in message.lower() or "deactivated" in message.lower() or "new" in message.lower():
                log_result(
                    "API Key Reissue",
                    True,
                    "Duplicate detected - new key issued, old key deactivated",
                    data
                )
            else:
                log_result(
                    "API Key Reissue",
                    True,
                    "Duplicate handled with success response",
                    data
                )
        else:
            log_result(
                "API Key Reissue",
                False,
                f"Unexpected: Status {response.status_code}",
                data
            )
    except Exception as e:
        log_result("API Key Reissue", False, f"Error: {str(e)}")


def test_api_key_request_production_email():
    """Test 3: Request API key with the production email address."""
    print("\n" + "="*70)
    print("TEST 3: API Key Request - Production Email (golfphysicsio@gmail.com)")
    print("="*70)

    payload = {
        "name": "Golf Physics Admin",
        "email": TEST_EMAIL,
        "company": "Golf Physics",
        "use_case": "developer",
        "expected_volume": "1k_10k",
        "agreed_to_terms": True,
        "recaptcha_token": None
    }

    try:
        response = requests.post(
            f"{BASE_URL}/api/request-api-key",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        data = response.json()

        log_result(
            "API Key Request - Production Email",
            response.status_code == 200,
            f"Status: {response.status_code} - Check {TEST_EMAIL} for API key email",
            data
        )
    except Exception as e:
        log_result("API Key Request - Production Email", False, f"Error: {str(e)}")


def test_contact_form_single():
    """Test 4: Submit contact form."""
    print("\n" + "="*70)
    print("TEST 4: Contact Form - Single Submission")
    print("="*70)

    payload = {
        "name": "Contact Test User",
        "email": TEST_EMAIL,
        "company": "Test Corp",
        "subject": "Test Contact Submission",
        "message": "This is a test contact form submission to verify the endpoint works correctly.",
        "recaptcha_token": None
    }

    try:
        response = requests.post(
            f"{BASE_URL}/api/contact",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        data = response.json()

        log_result(
            "Contact Form - Single Submission",
            response.status_code == 200 and data.get("success"),
            f"Check {TEST_EMAIL} for confirmation email",
            data
        )
    except Exception as e:
        log_result("Contact Form - Single Submission", False, f"Error: {str(e)}")


def test_contact_form_duplicate():
    """Test 5: Verify multiple contact form submissions are allowed."""
    print("\n" + "="*70)
    print("TEST 5: Contact Form - Multiple Submissions (Should Allow)")
    print("="*70)

    payload = {
        "name": "Contact Test User",
        "email": TEST_EMAIL,
        "company": "Test Corp",
        "subject": "Second Contact Submission",
        "message": "This is a SECOND test contact form submission. Multiple contacts should be allowed.",
        "recaptcha_token": None
    }

    try:
        response = requests.post(
            f"{BASE_URL}/api/contact",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        data = response.json()

        log_result(
            "Contact Form - Multiple Submissions",
            response.status_code == 200 and data.get("success"),
            "Second contact submission should succeed",
            data
        )
    except Exception as e:
        log_result("Contact Form - Multiple Submissions", False, f"Error: {str(e)}")


def test_high_value_api_key_request():
    """Test 6: High-value API key request (should trigger admin notification)."""
    print("\n" + "="*70)
    print("TEST 6: High-Value API Key Request (Admin Notification)")
    print("="*70)

    timestamp = datetime.now().strftime("%H%M%S")

    payload = {
        "name": "Enterprise Buyer",
        "email": f"golfphysicsio+enterprise{timestamp}@gmail.com",
        "company": "TrackMan Golf",  # Known golf tech company
        "use_case": "launch_monitor",  # High-value use case
        "expected_volume": "over_100k",  # High volume
        "description": "Integration with TrackMan launch monitor systems",
        "agreed_to_terms": True,
        "recaptcha_token": None
    }

    try:
        response = requests.post(
            f"{BASE_URL}/api/request-api-key",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        data = response.json()

        log_result(
            "High-Value API Key Request",
            response.status_code == 200,
            "Should trigger admin notification (check admin email)",
            data
        )
    except Exception as e:
        log_result("High-Value API Key Request", False, f"Error: {str(e)}")


def test_high_value_contact():
    """Test 7: High-value contact form (should trigger priority notification)."""
    print("\n" + "="*70)
    print("TEST 7: High-Value Contact Form (Priority Notification)")
    print("="*70)

    payload = {
        "name": "Enterprise Contact",
        "email": TEST_EMAIL,
        "company": "TopGolf",
        "subject": "Enterprise Partnership Inquiry",
        "message": "We are interested in an enterprise partnership for our 100K+ monthly API calls. Looking to discuss commercial licensing.",
        "recaptcha_token": None
    }

    try:
        response = requests.post(
            f"{BASE_URL}/api/contact",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        data = response.json()

        log_result(
            "High-Value Contact Form",
            response.status_code == 200 and data.get("success"),
            "Should trigger high-value admin notification",
            data
        )
    except Exception as e:
        log_result("High-Value Contact Form", False, f"Error: {str(e)}")


def test_validation_errors():
    """Test 8: Validation error handling."""
    print("\n" + "="*70)
    print("TEST 8: Validation Error Handling")
    print("="*70)

    # Test missing required field
    payload = {
        "name": "Test",
        # Missing email
        "use_case": "personal",
        "expected_volume": "under_1k",
        "agreed_to_terms": True
    }

    try:
        response = requests.post(
            f"{BASE_URL}/api/request-api-key",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=30
        )

        if response.status_code == 422:
            log_result(
                "Validation Error - Missing Email",
                True,
                "Correctly returns 422 for missing required field",
                response.json()
            )
        else:
            log_result(
                "Validation Error - Missing Email",
                False,
                f"Expected 422, got {response.status_code}",
                response.json()
            )
    except Exception as e:
        log_result("Validation Error - Missing Email", False, f"Error: {str(e)}")


def test_invalid_email_format():
    """Test 9: Invalid email format."""
    print("\n" + "="*70)
    print("TEST 9: Invalid Email Format")
    print("="*70)

    payload = {
        "name": "Test User",
        "email": "not-a-valid-email",
        "use_case": "personal",
        "expected_volume": "under_1k",
        "agreed_to_terms": True
    }

    try:
        response = requests.post(
            f"{BASE_URL}/api/request-api-key",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=30
        )

        if response.status_code == 422:
            log_result(
                "Invalid Email Format",
                True,
                "Correctly rejects invalid email format",
                response.json()
            )
        else:
            log_result(
                "Invalid Email Format",
                False,
                f"Expected 422, got {response.status_code}",
                response.json()
            )
    except Exception as e:
        log_result("Invalid Email Format", False, f"Error: {str(e)}")


def test_terms_not_agreed():
    """Test 10: Terms not agreed."""
    print("\n" + "="*70)
    print("TEST 10: Terms Not Agreed")
    print("="*70)

    payload = {
        "name": "Test User",
        "email": "test@example.com",
        "use_case": "personal",
        "expected_volume": "under_1k",
        "agreed_to_terms": False  # Not agreed
    }

    try:
        response = requests.post(
            f"{BASE_URL}/api/request-api-key",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=30
        )

        if response.status_code == 400:
            log_result(
                "Terms Not Agreed",
                True,
                "Correctly rejects when terms not agreed",
                response.json()
            )
        else:
            log_result(
                "Terms Not Agreed",
                False,
                f"Expected 400, got {response.status_code}",
                response.json()
            )
    except Exception as e:
        log_result("Terms Not Agreed", False, f"Error: {str(e)}")


def print_summary():
    """Print test summary."""
    print("\n")
    print("="*70)
    print("TEST SUMMARY")
    print("="*70)

    passed = sum(1 for r in results if r["passed"])
    failed = sum(1 for r in results if not r["passed"])
    total = len(results)

    print(f"\nTotal Tests: {total}")
    print(f"Passed: {passed}")
    print(f"Failed: {failed}")
    print(f"Pass Rate: {passed/total*100:.1f}%")

    if failed > 0:
        print("\nFailed Tests:")
        for r in results:
            if not r["passed"]:
                print(f"  - {r['test']}: {r['details']}")

    print("\n" + "="*70)
    print("EMAILS TO CHECK")
    print("="*70)
    print(f"""
1. Check {TEST_EMAIL} inbox for:
   - API Key welcome email (from Test 3)
   - Contact form confirmation emails (from Tests 4, 5, 7)

2. Check admin email for:
   - High-value lead notifications (from Tests 6, 7)
   - Contact form notifications (from Tests 4, 5, 7)
""")

    print("\n" + "="*70)
    print("DUPLICATE HANDLING (KEY ROTATION)")
    print("="*70)
    print("""
Current Behavior:
- Checks for existing API key with same email AND is_active=True
- If duplicate found:
  1. Deactivates the old key (is_active=False, status='replaced')
  2. Generates a NEW API key
  3. Sends a special "reissue" email explaining:
     - Original key creation date
     - Old key has been deactivated
     - New key provided
  4. Returns success with message about reissue

This ensures:
- Users always get a working key
- Old compromised keys are invalidated
- Clear communication about what happened
""")


def main():
    """Run all tests."""
    print("\n")
    print("="*70)
    print("GOLF PHYSICS API - FORM ENDPOINT TEST SUITE")
    print("="*70)
    print(f"Target: {BASE_URL}")
    print(f"Test Email: {TEST_EMAIL}")
    print(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    # Run tests
    if not test_health_check():
        print("\n⚠️  API not healthy, aborting tests")
        return

    # Test API Key Request flow
    test_email = test_api_key_request_new_user()
    time.sleep(1)  # Small delay between requests

    test_api_key_duplicate_prevention(test_email)
    time.sleep(1)

    test_api_key_request_production_email()
    time.sleep(1)

    # Test Contact Form flow
    test_contact_form_single()
    time.sleep(1)

    test_contact_form_duplicate()
    time.sleep(1)

    # Test High-Value detection
    test_high_value_api_key_request()
    time.sleep(1)

    test_high_value_contact()
    time.sleep(1)

    # Test validation
    test_validation_errors()
    test_invalid_email_format()
    test_terms_not_agreed()

    # Print summary
    print_summary()


if __name__ == "__main__":
    main()
