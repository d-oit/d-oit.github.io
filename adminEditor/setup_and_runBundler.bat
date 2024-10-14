@echo off
echo Installing required Python libraries...
pip install requests csscompressor jsmin

echo Running the Python script...
python bundle_script.py

echo Done!
pause
