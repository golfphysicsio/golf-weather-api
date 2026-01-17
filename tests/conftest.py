"""
Pytest configuration and fixtures for API testing.

IMPORTANT: Environment variables must be set BEFORE importing the app
because settings are loaded at import time.
"""

import os
import hashlib

# Set up a test API key for testing purposes
# This MUST happen before any app imports
TEST_API_KEY = "golf_test_key_for_unit_tests_only"
TEST_API_KEY_HASH = hashlib.sha256(TEST_API_KEY.encode()).hexdigest()

# Set the environment variable BEFORE any imports that might load settings
os.environ["APIKEY_TEST_CLIENT"] = TEST_API_KEY_HASH

# Now we can safely import pytest
import pytest


@pytest.fixture(scope="session", autouse=True)
def setup_test_environment():
    """Set up environment variables for testing."""
    # Store original value if any
    original_value = os.environ.get("APIKEY_TEST_CLIENT")

    # Ensure the key is set (it should already be set above)
    os.environ["APIKEY_TEST_CLIENT"] = TEST_API_KEY_HASH

    yield

    # Restore original state
    if original_value is None:
        os.environ.pop("APIKEY_TEST_CLIENT", None)
    else:
        os.environ["APIKEY_TEST_CLIENT"] = original_value
