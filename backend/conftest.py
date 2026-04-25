"""
backend/conftest.py
-------------------
Ensures pytest can resolve `pawpal_system` regardless of whether it is run
from the project root or from inside the backend/ directory.
"""

import sys
from pathlib import Path

# Insert the backend/ directory at the front of sys.path so that
# `import pawpal_system` resolves to backend/pawpal_system.py in all cases.
sys.path.insert(0, str(Path(__file__).resolve().parent))
