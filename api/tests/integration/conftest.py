import os
import time

import pytest
import requests
from dotenv import dotenv_values


@pytest.fixture(scope="session")
def environment():
    """
    Fixture that loads environment variables from the specified file
    and checks for required variables.

    Returns:
        dict: Dictionary containing the loaded environment variables

    Raises:
        ValueError: If ENV_FILE_PATH is not defined
        ValueError: If API_URL is not defined
        ValueError: If CONTAINER_COMPOSE_FILE_PATH is not defined
        ValueError: If CONTAINER_COMPOSE_FILE_NAME is not defined
    """
    env_file = os.environ.get("ENV_FILE_PATH")
    if not env_file:
        raise ValueError("ENV_FILE_PATH environment variable is not defined")

    env = dotenv_values(env_file)

    if not env.get("API_URL"):
        raise ValueError("API_URL environment variable is not defined")

    if not env.get("CONTAINER_COMPOSE_FILE_PATH"):
        raise ValueError(
            "CONTAINER_COMPOSE_FILE_PATH environment variable is not defined"
        )

    if not env.get("CONTAINER_COMPOSE_FILE_NAME"):
        raise ValueError(
            "CONTAINER_COMPOSE_FILE_NAME environment variable is not defined"
        )

    return env


@pytest.fixture(scope="session")
def api_client(environment):
    """
    Fixture for making HTTP requests to the API.

    Args:
        environment (dict): Dictionary containing environment variables

    Returns:
        function: A function to make HTTP requests

    Raises:
        ValueError: If API_URL environment variable is not set
    """
    base_url = environment.get("API_URL")
    if not base_url:
        raise ValueError("API_URL environment variable is not set")

    def _make_request(method: str, endpoint: str, **kwargs):
        """
        Make an HTTP request to the API.

        Args:
            method (str): HTTP method (GET, POST, etc.)
            endpoint (str): API endpoint
            **kwargs: Additional arguments for requests.request

        Returns:
            Response: The API response
        """
        url = f"{base_url}{endpoint}"
        return requests.request(method, url, **kwargs)

    wait_api(_make_request)

    return _make_request


@pytest.fixture(scope="function", autouse=True)
def clear_operations(api_client):
    """
    Clears all operations from the database.
    """
    api_client("DELETE", "/clear")
    yield


def wait_api(api_client, max_retries=5, delay=2):
    """
    Waits for the health endpoint to return a successful response.

    Args:
        api_client: API client for making requests
        max_retries (int): Maximum number of retry attempts
        delay (int): Delay between attempts in seconds

    Returns:
        bool: True if the health endpoint is available, False otherwise
    """
    for _ in range(max_retries):
        response = api_client("GET", "/health")
        if response.status_code == 200:
            return True
        time.sleep(delay)
    return False
