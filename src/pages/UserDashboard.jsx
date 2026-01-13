import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import './UserDashboard.css'

const UserDashboard = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [pools, setPools] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [addingPool, setAddingPool] = useState(false)
  const [error, setError] = useState('')
  const wsRef = useRef(null)
  const [wsConnected, setWsConnected] = useState(false)

  const [newPool, setNewPool] = useState({
    pool_address: '',
    base_mint: '',
    quote_mint: '',
    base_vault: '',
    quote_vault: ''
  })

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      navigate('/login')
      return
    }
    
    const userData = JSON.parse(storedUser)
    setUser(userData)
    
    // Fetch user's pools
    fetchUserPools(userData.username)
    
    // Connect to WebSocket for real-time updates
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsUrl = `${protocol}//${window.location.host}/ws`
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = () => {
      console.log('WebSocket connected')
      setWsConnected(true)
      // Subscribe to user's pools
      ws.send(JSON.stringify({ type: 'subscribe_user', username: userData.username }))
    }

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        if (message.type === 'pool_update') {
          // Update pool if it belongs to this user
          setPools((prevPools) => {
            const existingIndex = prevPools.findIndex(
              (p) => p.pool_address === message.data.pool_address
            )
            if (existingIndex >= 0) {
              const updated = [...prevPools]
              updated[existingIndex] = {
                ...updated[existingIndex],
                ...message.data,
              }
              return updated
            }
            return prevPools
          })
        } else if (message.type === 'user_update') {
          // Update user credits
          setUser(prev => ({ ...prev, credits: message.data.credits }))
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }

    ws.onerror = () => setWsConnected(false)
    ws.onclose = () => setWsConnected(false)

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [navigate])

  const fetchUserPools = async (username) => {
    try {
      const response = await fetch(`/api/user/${username}/pools`)
      const data = await response.json()
      if (response.ok) {
        setPools(data.pools || [])
      }
    } catch (error) {
      console.error('Error fetching user pools:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  const handleInputChange = (e) => {
    setNewPool(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
  }

  const handleAddPool = async (e) => {
    e.preventDefault()
    setAddingPool(true)
    setError('')

    try {
      // 1. Send to external endpoint
      try {
        await fetch('http://20.46.50.39:8080/new_pools', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pool_address: newPool.pool_address,
            base_mint: newPool.base_mint,
            quote_mint: newPool.quote_mint,
            base_vault: newPool.base_vault,
            quote_vault: newPool.quote_vault
          })
        })
      } catch (externalError) {
        console.warn('External endpoint not reachable:', externalError)
      }

      // 2. Fetch from Raydium API
      let raydiumData = null
      try {
        const raydiumResponse = await fetch(
          `https://api-v3.raydium.io/pools/key/ids?ids=${newPool.pool_address}`
        )
        const raydiumResult = await raydiumResponse.json()
        if (raydiumResult.success && raydiumResult.data && raydiumResult.data.length > 0) {
          raydiumData = raydiumResult.data[0]
        }
      } catch (raydiumError) {
        console.warn('Raydium API error:', raydiumError)
      }

      // 3. Add pool to user's dashboard
      const poolData = {
        ...newPool,
        status: 'Monitoring',
        added_at: new Date().toISOString()
      }

      // If we got Raydium data, enhance the pool data
      if (raydiumData) {
        const quoteMint = raydiumData.mintA
        const baseMint = raydiumData.mintB
        poolData.base_name = baseMint?.name || baseMint?.symbol || 'Unknown'
        poolData.quote_name = quoteMint?.name || quoteMint?.symbol || 'Unknown'
        poolData.base_symbol = baseMint?.symbol || 'N/A'
        poolData.quote_symbol = quoteMint?.symbol || 'N/A'
        poolData.image_url = baseMint?.logoURI || null
        poolData.quote_image_url = quoteMint?.logoURI || null
      }

      // Save to server
      const response = await fetch(`/api/user/${user.username}/pools`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(poolData)
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to add pool')
      }

      // Update local state
      setPools(prev => [result.pool, ...prev])
      setUser(prev => ({ ...prev, credits: result.credits }))
      
      // Reset form and close modal
      setNewPool({
        pool_address: '',
        base_mint: '',
        quote_mint: '',
        base_vault: '',
        quote_vault: ''
      })
      setShowAddModal(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setAddingPool(false)
    }
  }

  const formatAddress = (address) => {
    if (!address) return 'N/A'
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'safe':
        return '#14f195'
      case 'monitoring':
        return '#00d4ff'
      case 'warning':
        return '#fbbf24'
      case 'rug pull detected':
        return '#ef4444'
      default:
        return '#9ca3af'
    }
  }

  if (!user) {
    return <div className="loading-screen">Loading...</div>
  }

  return (
    <div className="user-dashboard">
      {/* Background */}
      <div className="dashboard-bg">
        <div className="dashboard-bg-gradient"></div>
        <div className="dashboard-bg-grid"></div>
      </div>

      {/* Header */}
      <header className="user-header">
        <div className="header-left">
          <motion.div 
            className="user-logo"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="logo-icon">🛡️</span>
            <span className="logo-text">RugGuard</span>
          </motion.div>
        </div>
        
        <div className="header-right">
          <div className="connection-status">
            <span className={`status-dot ${wsConnected ? 'connected' : ''}`}></span>
            <span>{wsConnected ? 'Live' : 'Offline'}</span>
          </div>
          
          <div className="credits-display">
            <span className="credits-icon">💎</span>
            <span className="credits-value">{user.credits?.toLocaleString()}</span>
            <span className="credits-label">Credits</span>
          </div>

          <div className="user-info">
            <span className="user-avatar">👤</span>
            <span className="user-name">{user.username}</span>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="user-main">
        {/* Dashboard Title */}
        <div className="dashboard-title-section">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Your Pool Dashboard
          </motion.h1>
          <p>Monitor your pools in real-time. Results will appear as they are processed.</p>
        </div>

        {/* Stats Bar */}
        <motion.div
          className="user-stats"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="stat-card">
            <span className="stat-icon">📊</span>
            <span className="stat-value">{pools.length}</span>
            <span className="stat-label">Total Pools</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">✅</span>
            <span className="stat-value safe">
              {pools.filter(p => p.status?.toLowerCase() === 'safe').length}
            </span>
            <span className="stat-label">Safe</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">⚠️</span>
            <span className="stat-value warning">
              {pools.filter(p => p.status?.toLowerCase() === 'warning').length}
            </span>
            <span className="stat-label">Warning</span>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🚨</span>
            <span className="stat-value danger">
              {pools.filter(p => p.status?.toLowerCase().includes('rug')).length}
            </span>
            <span className="stat-label">Rug Detected</span>
          </div>
        </motion.div>

        {/* Add Pool Button */}
        <motion.button
          className="add-pool-btn"
          onClick={() => setShowAddModal(true)}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="plus-icon">+</span>
          <span>Add New Pool</span>
        </motion.button>

        {/* Pools Grid */}
        {pools.length === 0 ? (
          <motion.div
            className="empty-pools"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="empty-icon">📭</div>
            <h2>No Pools Yet</h2>
            <p>Click the "Add New Pool" button above to start monitoring pools</p>
          </motion.div>
        ) : (
          <div className="user-pools-grid">
            <AnimatePresence>
              {pools.map((pool, index) => (
                <motion.div
                  key={pool.pool_address}
                  className={`user-pool-card ${pool.status?.toLowerCase().includes('rug') ? 'rug-detected' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  style={{ '--status-color': getStatusColor(pool.status) }}
                >
                  {/* Status Badge */}
                  <div className="pool-status-badge" style={{ backgroundColor: getStatusColor(pool.status) }}>
                    {pool.status || 'Monitoring'}
                    {pool.confidence_score !== undefined && pool.confidence_score !== null && (
                      <span className="confidence-badge">
                        {(pool.confidence_score * 100).toFixed(1)}%
                      </span>
                    )}
                  </div>

                  {/* Pool Header */}
                  <div className="pool-card-header">
                    {pool.image_url ? (
                      <img src={pool.image_url} alt="" className="pool-token-image" />
                    ) : (
                      <div className="pool-token-placeholder">
                        {pool.base_name?.charAt(0) || '?'}
                      </div>
                    )}
                    <div className="pool-names">
                      <h3>{pool.base_name || 'Unknown'} / {pool.quote_name || 'Unknown'}</h3>
                      <span className="pool-pair">{pool.base_symbol || 'N/A'} / {pool.quote_symbol || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Pool Details */}
                  <div className="pool-card-details">
                    <div className="detail-row">
                      <span className="label">Pool Address</span>
                      <a 
                        href={`https://solscan.io/account/${pool.pool_address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="value link"
                      >
                        {formatAddress(pool.pool_address)} ↗
                      </a>
                    </div>
                    <div className="detail-row">
                      <span className="label">Base Mint</span>
                      <span className="value">{formatAddress(pool.base_mint)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Quote Mint</span>
                      <span className="value">{formatAddress(pool.quote_mint)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Base Vault</span>
                      <span className="value">{formatAddress(pool.base_vault)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Quote Vault</span>
                      <span className="value">{formatAddress(pool.quote_vault)}</span>
                    </div>
                  </div>

                  {/* Added Time */}
                  {pool.added_at && (
                    <div className="pool-timestamp">
                      Added: {new Date(pool.added_at).toLocaleString()}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Navigate to Public Dashboard */}
        <motion.button
          className="public-dashboard-btn"
          onClick={() => navigate('/dashboard')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          View Public Dashboard →
        </motion.button>
      </main>

      {/* Add Pool Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              className="add-pool-modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Add New Pool to Monitor</h2>
                <button className="close-modal" onClick={() => setShowAddModal(false)}>×</button>
              </div>

              <form onSubmit={handleAddPool} className="add-pool-form">
                <div className="form-field">
                  <label>Pool Address *</label>
                  <input
                    type="text"
                    name="pool_address"
                    value={newPool.pool_address}
                    onChange={handleInputChange}
                    placeholder="Enter pool address..."
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Base Mint *</label>
                  <input
                    type="text"
                    name="base_mint"
                    value={newPool.base_mint}
                    onChange={handleInputChange}
                    placeholder="Enter base mint address..."
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Quote Mint *</label>
                  <input
                    type="text"
                    name="quote_mint"
                    value={newPool.quote_mint}
                    onChange={handleInputChange}
                    placeholder="Enter quote mint address..."
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Base Vault *</label>
                  <input
                    type="text"
                    name="base_vault"
                    value={newPool.base_vault}
                    onChange={handleInputChange}
                    placeholder="Enter base vault address..."
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Quote Vault *</label>
                  <input
                    type="text"
                    name="quote_vault"
                    value={newPool.quote_vault}
                    onChange={handleInputChange}
                    placeholder="Enter quote vault address..."
                    required
                  />
                </div>

                {error && (
                  <div className="modal-error">
                    ⚠️ {error}
                  </div>
                )}

                <div className="modal-actions">
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="monitor-btn"
                    disabled={addingPool}
                  >
                    {addingPool ? (
                      <span className="spinner"></span>
                    ) : (
                      <>
                        <span>🎯</span>
                        <span>Start Monitoring</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default UserDashboard
