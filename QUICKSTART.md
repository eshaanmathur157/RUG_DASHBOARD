# Quick Start Guide

## Running the Application

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the Backend Server
Open a terminal and run:
```bash
npm run dev:server
```

This will:
- Connect to Redis at `20.46.50.39:6379`
- Listen to the `pool-monitor` channel
- Start WebSocket server on port 3001
- Process pool payloads with 40s delay
- Fetch data from DexScreener API

### Step 3: Start the Frontend
Open another terminal and run:
```bash
npm run dev
```

Or run both together:
```bash
npm run dev:all
```

### Step 4: Access the Dashboard
Navigate to: `http://localhost:5173/dashboard`

## How It Works

1. **Redis Listener**: The backend subscribes to the `pool-monitor` channel on Redis
2. **Pool Processing**: When a pool payload is received:
   - Wait 40 seconds
   - Fetch pool data from DexScreener API
   - Extract: image URL, social handle, liquidity, token names
   - Broadcast to all connected dashboard clients via WebSocket
3. **Dashboard Display**: The frontend displays each pool in a beautiful card with:
   - Pool address (with Solscan link)
   - Base and quote mints
   - Token names
   - Token image
   - Liquidity in USD
   - Social media handle
   - Status: MONITORING

## Environment Variables (Optional)

Create a `.env` file in the root directory:

```
VITE_WS_URL=ws://localhost:3001/ws
VITE_API_URL=http://localhost:3001
```

## Troubleshooting

- **WebSocket not connecting**: Make sure the backend server is running on port 3001
- **Redis connection error**: Verify Redis is accessible at `20.46.50.39:6379`
- **No pools showing**: Check that pools are being published to the `pool-monitor` channel

