# Quick Start Guide

Get the Font Subsetter application running in 5 minutes!

## Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- Python 3.9+ ([Download](https://www.python.org/downloads/))

## Step 1: Setup Backend (2 minutes)

```bash
cd backend

# Run the setup script
./setup.sh

# Or manually:
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

## Step 2: Setup Frontend (1 minute)

```bash
cd frontend
npm install
cp .env.example .env
```

## Step 3: Setup MCP Server (Optional, 1 minute)

```bash
cd mcp-server
npm install
npm run build
cp .env.example .env
```

## Step 4: Start the Application

Open 3 terminal windows:

### Terminal 1: Backend
```bash
cd backend
./start.sh

# Or manually:
source venv/bin/activate
python -m app.main
```

✅ Backend running at `http://localhost:8000`

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```

✅ Frontend running at `http://localhost:5173`

### Terminal 3: MCP Server (Optional)
```bash
cd mcp-server
npm run dev
```

✅ MCP Server ready for Claude Code

## Step 5: Use the Application

1. Open your browser to `http://localhost:5173`
2. Upload a font file (TTF, OTF, WOFF, or WOFF2)
3. Select characters you want to include
4. Export your optimized font!

## Using with Claude Code

1. Open this directory in Claude Code
2. Run `/mcp` to verify the servers are connected
3. Try commands like:
   - "Show me all MCP tools available"
   - "Help me subset a font"

## Troubleshooting

### Port already in use
```bash
# Check what's using port 8000
lsof -i :8000

# Or use a different port in backend/.env
PORT=8001
```

### Python module not found
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

### MCP server not connecting
```bash
# Make sure to build first
cd mcp-server
npm run build

# Restart Claude Code
```

## What's Next?

- Read the [README.md](README.md) for detailed documentation
- Explore the API at `http://localhost:8000/docs`
- Check out the example fonts in the `examples/` folder (if available)

## Need Help?

- Check the [Troubleshooting section](README.md#troubleshooting) in README
- Review the [API documentation](http://localhost:8000/docs) when backend is running
- Open an issue on GitHub

Happy font subsetting! 🎨
