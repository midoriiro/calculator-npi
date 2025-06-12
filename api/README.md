# RPN Calculator API

This is the API component of the RPN Calculator project, providing a REST API for performing calculations in Reverse Polish Notation (RPN) with operation storage in PostgreSQL.

## Project Structure

```
api/
├── src/               # Source code
│   ├── __init__.py
│   ├── main.py       # FastAPI application
│   ├── calculator.py # RPN calculation logic
│   └── database.py   # Database configuration
└── tests/            # Tests
    ├── __init__.py
    └── test_calculator.py
```

## Development Setup

### Prerequisites

- Python 3.11+
- Poetry
- PostgreSQL

### Installation

1. Install dependencies:
```bash
poetry install
```

2. Set up environment variables:
```bash
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/calculator"
```

### Development Tasks

The project includes several VSCode tasks for development:

#### Running the Application
- `Run API` - Starts the FastAPI server with hot reload
- `Install Dependencies` - Installs project dependencies

#### Testing
- `Run Tests` - Runs all tests
- `Run Tests with Coverage` - Runs tests with coverage report

#### Code Quality
- `Format Code` - Formats code using black and isort
- `Lint Code` - Runs flake8 linter

#### Dependency Management
- `Add Dependency` - Adds a new production dependency
- `Add Dev Dependency` - Adds a new development dependency

### API Endpoints

#### Calculate Expression
```http
POST /calculate
Content-Type: application/json

{
    "expression": "3 4 +"
}
```

Response:
```json
{
    "result": 7
}
```

#### Export Operations
```http
GET /export
```

Returns a CSV file containing all operations history.

### Testing

Run tests with:
```bash
poetry run pytest
```

Run tests with coverage:
```bash
poetry run pytest --cov=api
```

### Code Style

The project uses:
- Black for code formatting
- isort for import sorting
- flake8 for linting

Format code with:
```bash
poetry run black .
poetry run isort .
```

### Debugging

The project includes VSCode launch configurations:
- "Python: FastAPI" - Debug the FastAPI application
- "Python: Current File" - Debug the current file
- "Python: Debug Tests" - Debug tests

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection URL | Required |

## Contributing

1. Format your code:
```bash
poetry run black .
poetry run isort .
```

2. Run tests:
```bash
poetry run pytest
```

3. Check linting:
```bash
poetry run flake8
``` 