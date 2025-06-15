#!/usr/bin/env python3
import os
import sys
from importlib import import_module


def get_env(key: str) -> str:
    """Retrieves an environment variable or raises an error if not defined."""
    value = os.getenv(key)
    if value is None:
        raise ValueError(f"Environment variable {key} is not defined")
    return value


def main():
    # Configure environment variables
    entrypoint = get_env("ENTRYPOINT")
    host = get_env("HOST")
    port = int(get_env("PORT"))

    # Check entrypoint syntax
    if ":" not in entrypoint:
        print(f"Error: Entrypoint '{entrypoint}' must be in the format 'module:app'")
        sys.exit(1)

    # Split module and application
    module_path, app_name = entrypoint.split(":")

    try:
        # Dynamic module import
        module = import_module(module_path)
        app = getattr(module, app_name)

        # Import uvicorn here to avoid unnecessary imports
        import uvicorn

        # Start the application
        uvicorn.run(app, host=host, port=port, log_level="info")
    except ImportError as e:
        print(f"Error: Unable to import module '{module_path}': {e}")
        sys.exit(1)
    except AttributeError as e:
        print(
            f"Error: Unable to find application '{app_name}' in module '{module_path}': {e}"
        )
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
