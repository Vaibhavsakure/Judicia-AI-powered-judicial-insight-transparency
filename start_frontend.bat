@echo off
REM Start Frontend (Windows)
REM Run this from the PROJECT ROOT (judicial-ai/) folder

echo 🎨 Starting Judicial AI Frontend...
echo.

REM Activate virtual environment if it exists
if exist "venv\Scripts\activate.bat" (
    echo ✅ Activating virtual environment...
    call venv\Scripts\activate.bat
) else (
    echo ⚠️  Virtual environment not found. Using system Python.
)

echo.
echo 🌐 Starting Streamlit UI on http://localhost:8501
echo.

cd frontend
streamlit run app.py