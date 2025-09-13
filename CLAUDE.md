# Claude Instructions

- **Rule**: No Unicode characters in print statements
  **Reason**: Windows charmap encoding error

- **Rule**: Use forward slashes for Windows .venv activation paths
  **Reason**: Bash command `.venv/Scripts/activate` works, but `.venv\Scripts\activate` does not