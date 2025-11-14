#!/bin/bash

echo "Setting up Font Subsetter Backend..."

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "Created .env file. Please update it with your settings."
fi

# Create directories
mkdir -p uploads outputs

echo "Backend setup complete!"
echo "Run './start.sh' to start the server"
