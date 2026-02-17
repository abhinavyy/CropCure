#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Check and install Python dependencies if needed
"""
import sys
import subprocess
import os

# Fix Windows console encoding
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

def check_module(module_name):
    """Check if a Python module is installed"""
    try:
        # Handle module names with dashes (like flask-cors -> flask_cors)
        import_name = module_name.replace("-", "_")
        __import__(import_name)
        return True
    except ImportError:
        return False

def install_dependencies():
    """Install dependencies from requirements.txt"""
    requirements_path = os.path.join(os.path.dirname(__file__), "requirements.txt")
    
    if not os.path.exists(requirements_path):
        print("[X] requirements.txt not found!")
        return False
    
    print("[*] Installing Python dependencies...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", requirements_path], 
                            stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT)
        print("[OK] Dependencies installed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"[X] Failed to install dependencies. Error code: {e.returncode}")
        print("Please install manually: pip install -r requirements.txt")
        return False

def main():
    # Check for critical modules
    critical_modules = ["flask", "flask_cors"]
    missing_modules = []
    
    for module in critical_modules:
        if not check_module(module):
            missing_modules.append(module)
    
    if missing_modules:
        print(f"[!] Missing Python modules: {', '.join(missing_modules)}")
        print("Installing dependencies from requirements.txt...")
        if install_dependencies():
            # Verify installation
            missing_after = [m for m in critical_modules if not check_module(m)]
            if missing_after:
                print(f"[X] Still missing modules: {', '.join(missing_after)}")
                print("Please install manually: pip install -r requirements.txt")
                return False
            print("[OK] All dependencies are now installed!")
            return True
        else:
            return False
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
