#!/bin/bash

echo "Starting Font Subsetter Backend..."

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Create directories if they don't exist
mkdir -p uploads outputs

# Start the server
python -m app.main
