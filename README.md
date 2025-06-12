# RPN Calculator API

A REST API for performing calculations in Reverse Polish Notation (RPN) with operation storage in a PostgreSQL database.

## Features

- RPN expression calculation
- REST API with FastAPI
- Operation storage in PostgreSQL
- CSV export of operations
- Unit tests
- Docker deployment
- Poetry dependency management

## Prerequisites

- Docker and Docker Compose
- Python 3.11+
- Poetry (for local development)

## Installation

### Using Docker

1. Clone the repository
2. Launch the application with Docker Compose:
```bash
docker-compose up --build
```

### Local Development

1. Clone the repository
2. Install Poetry if you haven't already:
```bash
curl -sSL https://install.python-poetry.org | python3 -
```

3. Install dependencies:
```bash
poetry install
```

4. Run the application:
```bash
poetry run uvicorn api.main:app --reload
```

## Usage

The API will be available at: http://localhost:8000

### Endpoints

- POST `/calculate`
  - Body: `{"expression": "3 4 +"}`
  - Returns the calculation result

- GET `/export`
  - Downloads a CSV file containing operation history

### API Documentation

Swagger documentation is available at: http://localhost:8000/docs

## Development

### Running Tests
```bash
poetry run pytest
```

### Code Formatting
```bash
poetry run black .
poetry run isort .
```

### Linting
```bash
poetry run flake8
```

## Project Structure

```
.
├── api/                    # API package
│   ├── __init__.py
│   ├── main.py            # FastAPI application
│   ├── calculator.py      # RPN calculation logic
│   └── database.py        # Database configuration
├── tests/                 # Test package
│   └── api/              # API tests
│       └── test_calculator.py
├── Dockerfile
├── docker-compose.yml
├── pyproject.toml
└── README.md
```

## RPN Expression Examples

- Addition: `3 4 +` → 7
- Subtraction: `5 3 -` → 2
- Multiplication: `4 5 *` → 20
- Division: `10 2 /` → 5
- Complex expressions: `3 4 5 * +` → 23 