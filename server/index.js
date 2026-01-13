import express from 'express';
import { WebSocketServer } from 'ws';
import http from 'http';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

// Store active WebSocket connections
const clients = new Set();

// Store pool data
const poolDataMap = new Map();

// Store user data
const usersMap = new Map();

// Path to persist pool data
const POOLS_DATA_FILE = path.join(__dirname, 'pools-data.json');
const USERS_DATA_FILE = path.join(__dirname, 'users-data.json');

// Initialize default user (eshaan)
function initializeDefaultUsers() {
  if (!usersMap.has('eshaan')) {
    usersMap.set('eshaan', {
      username: 'eshaan',
      password: '123456',
      credits: 10000,
      pools: [],
      createdAt: new Date().toISOString()
    });
    saveUsersData();
  }
}

// Save users data to file
function saveUsersData() {
  try {
    const usersArray = Array.from(usersMap.entries());
    fs.writeFileSync(USERS_DATA_FILE, JSON.stringify(usersArray, null, 2));
    console.log(`Saved ${usersArray.length} users to file`);
  } catch (error) {
    console.error('Error saving users data:', error);
  }
}

// Load users data from file
function loadUsersData() {
  try {
    if (fs.existsSync(USERS_DATA_FILE)) {
      const data = fs.readFileSync(USERS_DATA_FILE, 'utf-8');
      const usersArray = JSON.parse(data);
      usersArray.forEach(([username, userData]) => {
        usersMap.set(username, userData);
      });
      console.log(`Loaded ${usersArray.length} users from file`);
    }
    // Always ensure default user exists
    initializeDefaultUsers();
  } catch (error) {
    console.error('Error loading users data:', error);
    initializeDefaultUsers();
  }
}

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('Client connected');
  clients.add(ws);

  // Send all existing pool data to new client
  poolDataMap.forEach((data) => {
    ws.send(JSON.stringify({ type: 'pool_update', data }));
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Broadcast to all clients
function broadcast(data) {
  const message = JSON.stringify(data);
  clients.forEach((client) => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(message);
    }
  });
}

// Save pool data to file
function savePoolData() {
  try {
    const poolsArray = Array.from(poolDataMap.entries());
    fs.writeFileSync(POOLS_DATA_FILE, JSON.stringify(poolsArray, null, 2));
    console.log(`Saved ${poolsArray.length} pools to file`);
  } catch (error) {
    console.error('Error saving pool data:', error);
  }
}

// Load pool data from file
function loadPoolData() {
  try {
    if (fs.existsSync(POOLS_DATA_FILE)) {
      const data = fs.readFileSync(POOLS_DATA_FILE, 'utf-8');
      const poolsArray = JSON.parse(data);
      
      poolsArray.forEach(([address, poolData]) => {
        poolDataMap.set(address, poolData);
      });
      
      console.log(`Loaded ${poolsArray.length} pools from file`);
    } else {
      console.log('No existing pool data file found');
    }
  } catch (error) {
    console.error('Error loading pool data:', error);
  }
}

// Fetch Raydium pool data
async function fetchRaydiumPoolData(poolAddress) {
  try {
    const response = await fetch(
      `https://api-v3.raydium.io/pools/key/ids?ids=${poolAddress}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Raydium data:', error);
    return null;
  }
}

// Determine status based on confidence score
function determineStatus(confidenceScore) {
  if (confidenceScore >= 0.7) {
    return 'RUG PULL DETECTED';
  } else if (confidenceScore >= 0.3) {
    return 'Warning';
  } else if (confidenceScore >= 0.1) {
    return 'Monitoring';
  } else {
    return 'Safe';
  }
}

// Process new pool from rug_update endpoint
async function processNewPool(update) {
  console.log('Processing new pool:', update.pool_address);
  
  try {
    // Fetch Raydium data
    const raydiumData = await fetchRaydiumPoolData(update.pool_address);
    
    if (!raydiumData || !raydiumData.success || !raydiumData.data || raydiumData.data.length === 0) {
      console.error('No Raydium data found for pool:', update.pool_address);
      return;
    }

    const poolData = raydiumData.data[0];
    
    // Extract data - mintA is quote, mintB is base
    const quoteMint = poolData.mintA;
    const baseMint = poolData.mintB;
    const quoteVault = poolData.vault.A;
    const baseVault = poolData.vault.B;

    const poolInfo = {
      pool_address: update.pool_address,
      base_mint: baseMint.address,
      quote_mint: quoteMint.address,
      base_vault: baseVault,
      quote_vault: quoteVault,
      base_name: baseMint.name || baseMint.symbol || 'Unknown',
      quote_name: quoteMint.name || quoteMint.symbol || 'Unknown',
      base_symbol: baseMint.symbol || 'N/A',
      quote_symbol: quoteMint.symbol || 'N/A',
      image_url: baseMint.logoURI || null,
      quote_image_url: quoteMint.logoURI || null,
      liquidity_usd: 'N/A',
      social_handle: 'Info not found',
      solscan_link: `https://solscan.io/account/${update.pool_address}`,
      status: 'Monitoring',
      confidence_score: null,
    };

    // Store in map
    poolDataMap.set(update.pool_address, poolInfo);
    
    // Save to file
    savePoolData();
    
    // Broadcast to all clients
    broadcast({ type: 'pool_update', data: poolInfo });
    
    console.log('New pool added:', poolInfo.pool_address);
  } catch (error) {
    console.error('Error processing new pool:', error);
  }
}

// Process confidence score update
async function processConfidenceUpdate(update) {
  console.log('Processing confidence update:', update.pool_address, update.confidence_score);
  
  const existingPool = poolDataMap.get(update.pool_address);
  
  if (!existingPool) {
    console.log('Pool not found in map, skipping confidence update:', update.pool_address);
    return;
  }

  // Update confidence score and status
  const confidenceScore = parseFloat(update.confidence_score);
  const newStatus = determineStatus(confidenceScore);

  try {
    // Fetch fresh data from Raydium API
    const raydiumData = await fetchRaydiumPoolData(update.pool_address);
    
    let updatedPool = {
      ...existingPool,
      confidence_score: confidenceScore,
      status: newStatus,
    };

    // If we got fresh Raydium data, update the pool info
    if (raydiumData && raydiumData.success && raydiumData.data && raydiumData.data.length > 0) {
      const poolData = raydiumData.data[0];
      
      // Extract updated data - mintA is quote, mintB is base
      const quoteMint = poolData.mintA;
      const baseMint = poolData.mintB;
      const quoteVault = poolData.vault.A;
      const baseVault = poolData.vault.B;

      // Merge with fresh data
      updatedPool = {
        ...updatedPool,
        base_mint: baseMint.address,
        quote_mint: quoteMint.address,
        base_vault: baseVault,
        quote_vault: quoteVault,
        base_name: baseMint.name || baseMint.symbol || updatedPool.base_name,
        quote_name: quoteMint.name || quoteMint.symbol || updatedPool.quote_name,
        base_symbol: baseMint.symbol || updatedPool.base_symbol,
        quote_symbol: quoteMint.symbol || updatedPool.quote_symbol,
        image_url: baseMint.logoURI || updatedPool.image_url,
        quote_image_url: quoteMint.logoURI || updatedPool.quote_image_url,
      };

      console.log('Refreshed pool data from Raydium API');
    }

    // Store updated data
    poolDataMap.set(update.pool_address, updatedPool);
    
    // Save to file
    savePoolData();
    
    // Broadcast to all clients
    broadcast({ type: 'pool_update', data: updatedPool });
    
    console.log(`Pool ${update.pool_address} updated: ${newStatus} (${(confidenceScore * 100).toFixed(1)}%)`);
  } catch (error) {
    console.error('Error refreshing pool data:', error);
    
    // Still update confidence score even if Raydium query fails
    const updatedPool = {
      ...existingPool,
      confidence_score: confidenceScore,
      status: newStatus,
    };

    poolDataMap.set(update.pool_address, updatedPool);
    
    // Save to file
    savePoolData();
    
    broadcast({ type: 'pool_update', data: updatedPool });
  }
}

// Poll rug_update endpoint
async function pollRugUpdate() {
  try {
    const response = await fetch('http://20.46.50.39:8080/rug_update');
    
    if (!response.ok) {
      console.error('Error fetching rug_update:', response.statusText);
      return;
    }

    const updates = await response.json();
    
    if (!Array.isArray(updates) || updates.length === 0) {
      return; // No updates
    }

    console.log(`Received ${updates.length} update(s)`);

    // Process each update
    for (const update of updates) {
      if (update.base_mint && update.quote_mint) {
        // New pool
        await processNewPool(update);
      } else if (update.confidence_score !== undefined) {
        // Confidence score update
        await processConfidenceUpdate(update);
      } else {
        console.log('Unknown update format:', update);
      }
    }
  } catch (error) {
    console.error('Error polling rug_update:', error.message);
  }
}

// Start polling
function startPolling() {
  console.log('Started polling rug_update endpoint every 1 second');
  setInterval(pollRugUpdate, 1000);
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', pools: poolDataMap.size });
});

// Get all pools endpoint
app.get('/api/pools', (req, res) => {
  const pools = Array.from(poolDataMap.values());
  res.json(pools);
});

// ==================== AUTH ENDPOINTS ====================

// Login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const user = usersMap.get(username);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  if (user.password !== password) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  // Return user data without password
  const { password: _, ...userWithoutPassword } = user;
  res.json({ success: true, user: userWithoutPassword });
});

// Signup
app.post('/api/auth/signup', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  if (username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  if (usersMap.has(username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  const newUser = {
    username,
    password,
    credits: 10000,
    pools: [],
    createdAt: new Date().toISOString()
  };

  usersMap.set(username, newUser);
  saveUsersData();

  // Return user data without password
  const { password: _, ...userWithoutPassword } = newUser;
  res.json({ success: true, user: userWithoutPassword });
});

// ==================== USER POOL ENDPOINTS ====================

// Get user's pools
app.get('/api/user/:username/pools', (req, res) => {
  const { username } = req.params;
  
  const user = usersMap.get(username);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({ pools: user.pools || [] });
});

// Add pool to user's dashboard
app.post('/api/user/:username/pools', async (req, res) => {
  const { username } = req.params;
  const poolData = req.body;
  
  const user = usersMap.get(username);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Check if pool already exists for this user
  const existingPool = user.pools.find(p => p.pool_address === poolData.pool_address);
  if (existingPool) {
    return res.status(400).json({ error: 'Pool already being monitored' });
  }

  // Deduct credits (optional - 100 credits per pool)
  const creditCost = 100;
  if (user.credits < creditCost) {
    return res.status(400).json({ error: 'Insufficient credits' });
  }

  user.credits -= creditCost;

  // Add pool to user's list
  const newPool = {
    ...poolData,
    added_at: new Date().toISOString(),
    status: 'Monitoring'
  };

  user.pools.unshift(newPool);
  saveUsersData();

  // Also add to global pool monitoring
  if (!poolDataMap.has(poolData.pool_address)) {
    poolDataMap.set(poolData.pool_address, {
      ...newPool,
      user: username
    });
    savePoolData();
  }

  res.json({ 
    success: true, 
    pool: newPool,
    credits: user.credits
  });
});

// Update user pool (when results come in)
app.put('/api/user/:username/pools/:poolAddress', (req, res) => {
  const { username, poolAddress } = req.params;
  const updateData = req.body;
  
  const user = usersMap.get(username);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const poolIndex = user.pools.findIndex(p => p.pool_address === poolAddress);
  if (poolIndex === -1) {
    return res.status(404).json({ error: 'Pool not found' });
  }

  user.pools[poolIndex] = {
    ...user.pools[poolIndex],
    ...updateData
  };

  saveUsersData();

  res.json({ success: true, pool: user.pools[poolIndex] });
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Load existing pool data
  loadPoolData();
  
  // Load existing users data
  loadUsersData();
  
  // Start polling for updates
  startPolling();
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing connections...');
  savePoolData();
  server.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, closing connections...');
  savePoolData();
  server.close();
  process.exit(0);
});
