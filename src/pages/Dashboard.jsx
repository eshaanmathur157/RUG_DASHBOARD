import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import './Dashboard.css'

// Hardcoded pools data (keeping your existing data)
const HARDCODED_POOLS = [
  { pool_address: 'CF2Nm1yJ81wgn6YbHDyPRumjK2mtC8VL2FeuT4AEEmNc', base_mint: 'oQTWMwCxgwd31f5EdS2Woqdqd5pLCxKR1A6NapqHBH3', quote_mint: 'So11111111111111111111111111111111111111112', base_name: 'HONDA', quote_name: 'SOL', status: 'RUG PULL DETECTED', confidence_score: 0.89, liquidity_usd: '$3.00', solscan_link: 'https://solscan.io/account/CF2Nm1yJ81wgn6YbHDyPRumjK2mtC8VL2FeuT4AEEmNc' },
  { pool_address: '39S2G6mdbsUGbsfbYX6copevaByh4GJ5Re2SEneTcrty', base_name: 'DORM', quote_name: 'SOL', status: 'Monitoring', liquidity_usd: '$12,450.00', solscan_link: 'https://solscan.io/account/39S2G6mdbsUGbsfbYX6copevaByh4GJ5Re2SEneTcrty' },
  { pool_address: 'CRGpsB3bpowtpTBVtWH5b7Kwvo88rLR99VjShZsco7Kw', base_name: 'ZKLP', quote_name: 'SOL', status: 'Monitoring', liquidity_usd: '$8,320.00', solscan_link: 'https://solscan.io/account/CRGpsB3bpowtpTBVtWH5b7Kwvo88rLR99VjShZsco7Kw' },
  { pool_address: 'DWwzw6RHXbceFjG2kbJGvJ9j5Ee1xeV4vRTvyieT7xKN', base_name: 'HKDS', quote_name: 'USDT', status: 'Safe', confidence_score: 0.001, liquidity_usd: '$28,321.00', solscan_link: 'https://solscan.io/account/DWwzw6RHXbceFjG2kbJGvJ9j5Ee1xeV4vRTvyieT7xKN' },
  { pool_address: 'Aoodjn6Cj84E9QEm5WAaKCzLzafnuHyez4oyibs92u5K', base_name: 'USDT', quote_name: 'MBOSSS', status: 'Safe', confidence_score: 0.000002, liquidity_usd: '$15,420.00', image_url: 'https://img-v1.raydium.io/icon/BgvTgZA2HrbNYNwfQ1RmtG17dDxJ4UkfWwboCRrpciHu.png', solscan_link: 'https://solscan.io/account/Aoodjn6Cj84E9QEm5WAaKCzLzafnuHyez4oyibs92u5K' },
  { pool_address: '6pNim8MuWBM9kgs229pwucxsmoBQVp3Vo6mTP5U2E8VC', base_name: '孙子', quote_name: 'WSOL', status: 'RUG PULL DETECTED', confidence_score: 0.888492, liquidity_usd: '$1,234.00', image_url: 'https://img-v1.raydium.io/icon/FtWrksHqQg38mtRLzEmR5RrsDdVozpnd5Vj1vpjtDNqf.png', solscan_link: 'https://solscan.io/account/6pNim8MuWBM9kgs229pwucxsmoBQVp3Vo6mTP5U2E8VC' },
  { pool_address: '6RCGKkBqJnuNCMUSnZKDcUmXb7h2kC75HyG2GMjLYW88', base_name: '孙子', quote_name: 'WSOL', status: 'RUG PULL DETECTED', confidence_score: 0.880607, liquidity_usd: '$892.00', image_url: 'https://img-v1.raydium.io/icon/Cb1mGu12e9q9zwJTvVo7VDjj2uPFye3MNPqYv3UJfLoQ.png', solscan_link: 'https://solscan.io/account/6RCGKkBqJnuNCMUSnZKDcUmXb7h2kC75HyG2GMjLYW88' },
  { pool_address: '2S3ddzcZV4MqMZzChtvRwNsDnfbMq8fLF5BG3hmyAHxP', base_name: 'WhiteOora', quote_name: 'WSOL', status: 'Warning', confidence_score: 0.529649, liquidity_usd: '$6,754.00', image_url: 'https://img-v1.raydium.io/icon/9123QteaiUREQFqTynhEnKkKqHoFJ2R3d8KjznAq3Tt9.png', solscan_link: 'https://solscan.io/account/2S3ddzcZV4MqMZzChtvRwNsDnfbMq8fLF5BG3hmyAHxP' },
  { pool_address: 'HHPT5tvjtfi6JmFgA5oDtTxHYY4hxJ8WUdaHz6W2ZhuD', base_name: 'Buttcoin', quote_name: 'WSOL', status: 'RUG PULL DETECTED', confidence_score: 0.865494, liquidity_usd: '$2,103.00', image_url: 'https://img-v1.raydium.io/icon/AixXR8gDYbJhE331qe4GMt9f4sTAkSH85nKBwUxgJo4C.png', solscan_link: 'https://solscan.io/account/HHPT5tvjtfi6JmFgA5oDtTxHYY4hxJ8WUdaHz6W2ZhuD' },
  { pool_address: '5ULPuDwRZej4Cei9SoWV9nMsxPfoSCD7jBM86zvj9wBd', base_name: 'FINANCE', quote_name: 'USD1', status: 'Safe', confidence_score: 0.067038, liquidity_usd: '$9,234.00', solscan_link: 'https://solscan.io/account/5ULPuDwRZej4Cei9SoWV9nMsxPfoSCD7jBM86zvj9wBd' },
  { pool_address: '6787QfpxtUPiwhi82DRcour1Qr1KgcNP47XfMQYPR541', base_name: 'MYBAD', quote_name: 'WSOL', status: 'RUG PULL DETECTED', confidence_score: 0.877646, liquidity_usd: '$567.00', solscan_link: 'https://solscan.io/account/6787QfpxtUPiwhi82DRcour1Qr1KgcNP47XfMQYPR541' },
  { pool_address: 'DWCXG1gUdiZ8QfU1ifq9VGW6YjH6nu8EKVf9KD566cyB', base_name: 'PIXEL', quote_name: 'WSOL', status: 'Safe', confidence_score: 0.000453, liquidity_usd: '$11,890.00', solscan_link: 'https://solscan.io/account/DWCXG1gUdiZ8QfU1ifq9VGW6YjH6nu8EKVf9KD566cyB' },
  { pool_address: 'A9QEnfFwXQNGCnpb4SUbZJ5ryXspvHRKmZEmiUtipRec', base_name: '死了么', quote_name: 'WSOL', status: 'RUG PULL DETECTED', confidence_score: 0.762043, liquidity_usd: '$3,421.00', image_url: 'https://img-v1.raydium.io/icon/kiKfYnoJwoQXKkcRJUAyuxs7E5e2BxTRzW3VfbWbtzP.png', solscan_link: 'https://solscan.io/account/A9QEnfFwXQNGCnpb4SUbZJ5ryXspvHRKmZEmiUtipRec' },
  { pool_address: 'DER9Vcjv5REUAEpe4fjKZiLq4T52pRy8z7jMvSCzuNC5', base_name: 'SPIDER', quote_name: 'WSOL', status: 'Warning', confidence_score: 0.480546, liquidity_usd: '$5,123.00', image_url: 'https://img-v1.raydium.io/icon/94Kkab1MBP2Az39KJq6xsJcRyr3GrxgavQRCrBKrvCzV.png', solscan_link: 'https://solscan.io/account/DER9Vcjv5REUAEpe4fjKZiLq4T52pRy8z7jMvSCzuNC5' },
  { pool_address: '56gi65rNwpv2mvt1pN3kkmZTaMuqEJDK2sPjCg1AnuS3', base_name: 'WhalGold', quote_name: 'WSOL', status: 'Safe', confidence_score: 0.000029, liquidity_usd: '$22,150.00', image_url: 'https://img-v1.raydium.io/icon/C4V9x1gzLfGwF2k3P2puTRj6kWnee5y61mCdzBqiqrid.png', solscan_link: 'https://solscan.io/account/56gi65rNwpv2mvt1pN3kkmZTaMuqEJDK2sPjCg1AnuS3' },
  { pool_address: '248HJ7PBggHF7z5Rb5j4jVMLBKRmpF5e5veCYVN59BXn', base_name: 'GodWhale', quote_name: 'WSOL', status: 'Warning', confidence_score: 0.534259, liquidity_usd: '$7,890.00', image_url: 'https://img-v1.raydium.io/icon/6GwFdhNNuDNZd5FEaQev4A7UEgTHFQDk2GEX4dkhnGpW.png', solscan_link: 'https://solscan.io/account/248HJ7PBggHF7z5Rb5j4jVMLBKRmpF5e5veCYVN59BXn' },
  { pool_address: '33rkRJLs5xvFHDurDcxaxR8nhrVcnuh5FvWdyGZp8Wdk', base_name: 'MTROLL', quote_name: 'WSOL', status: 'RUG PULL DETECTED', confidence_score: 0.839163, liquidity_usd: '$1,456.00', image_url: 'https://img-v1.raydium.io/icon/7yjNtgfZZby2z49EDBmPQnESjhqsSGXBPXJC6iMU5uGZ.png', solscan_link: 'https://solscan.io/account/33rkRJLs5xvFHDurDcxaxR8nhrVcnuh5FvWdyGZp8Wdk' },
  { pool_address: '2irfyNGxxaDecgN5ym9agitH4fCmHvE7RZthYGEfp4FM', base_name: '死了么', quote_name: 'WSOL', status: 'RUG PULL DETECTED', confidence_score: 0.885593, liquidity_usd: '$789.00', image_url: 'https://img-v1.raydium.io/icon/DX9PoLhcgqj22S6KK9gYtdHEYH3NwkW8NxLrX82LrSoi.png', solscan_link: 'https://solscan.io/account/2irfyNGxxaDecgN5ym9agitH4fCmHvE7RZthYGEfp4FM' },
  { pool_address: 'T9LNaVdjjL97zVfw4fMdAuXJcESUoabxcYkcSGF8UFL', base_name: 'SIGHT', quote_name: 'WSOL', status: 'Warning', confidence_score: 0.397231, liquidity_usd: '$4,567.00', image_url: 'https://img-v1.raydium.io/icon/4DgYiGMdizHBqvSxPGxEtM5zgwnMoao5pPSHPdrZYwd6.png', solscan_link: 'https://solscan.io/account/T9LNaVdjjL97zVfw4fMdAuXJcESUoabxcYkcSGF8UFL' },
  { pool_address: 'HkYKQydbRrieBRZ4GEf9ddYh9VPhpKU5rp9UVXrwMbYR', base_name: 'Ballsack', quote_name: 'WSOL', status: 'Monitoring', confidence_score: 0.177038, liquidity_usd: '$8,234.00', image_url: 'https://img-v1.raydium.io/icon/BEKZQmtk8zbpARGgjEVu3vxiB28dxskUPoDBqViSSKzX.png', solscan_link: 'https://solscan.io/account/HkYKQydbRrieBRZ4GEf9ddYh9VPhpKU5rp9UVXrwMbYR' },
  { pool_address: '89H47RsuppyUprHw7rNBWyY8spPJ616ezqLbBhEPFiSV', base_name: 'TROJAN', quote_name: 'WSOL', status: 'Warning', confidence_score: 0.461926, liquidity_usd: '$6,123.00', image_url: 'https://img-v1.raydium.io/icon/EYt87KB6q36h8Ft114hDkKbw6mi8EFJCFvdgcZQF2CBE.png', solscan_link: 'https://solscan.io/account/89H47RsuppyUprHw7rNBWyY8spPJ616ezqLbBhEPFiSV' },
  { pool_address: '78LxbbqeEXdKE4WpU2n6ezBB9SnmSKVhbzpuVo8itQWm', base_name: 'UNlON', quote_name: 'WSOL', status: 'RUG PULL DETECTED', confidence_score: 0.886108, liquidity_usd: '$934.00', image_url: 'https://img-v1.raydium.io/icon/BH73Yp81Kgkc48agPPbTm2EY1rUHw9Qv5JisaCG8u7QQ.png', solscan_link: 'https://solscan.io/account/78LxbbqeEXdKE4WpU2n6ezBB9SnmSKVhbzpuVo8itQWm' },
  { pool_address: 'CNiEGxusm2CAHhdM2raTAVYo4RoG4xVtntDHxPenFxmN', base_name: 'PORKICOIN', quote_name: 'WSOL', status: 'RUG PULL DETECTED', confidence_score: 0.890009, liquidity_usd: '$678.00', image_url: 'https://img-v1.raydium.io/icon/FyjrxduuCjtN2uuKNFdjbb1qHh1g2z7wddJcRfVxsaTc.png', solscan_link: 'https://solscan.io/account/CNiEGxusm2CAHhdM2raTAVYo4RoG4xVtntDHxPenFxmN' },
  { pool_address: 'Lnp7qsDRwTtTyHjwaxkZrXJRzHXuRnKxdT9Wn5q1A8K', base_name: 'WHP', quote_name: 'WSOL', status: 'Monitoring', confidence_score: 0.120314, liquidity_usd: '$10,567.00', image_url: 'https://img-v1.raydium.io/icon/GQGPHRpU3gDLP6R4WgPQz8m7YsZtgdT7jtQEr8aBKNYE.png', solscan_link: 'https://solscan.io/account/Lnp7qsDRwTtTyHjwaxkZrXJRzHXuRnKxdT9Wn5q1A8K' },
  { pool_address: 'HZ9ZG5Kofqqhs5FkD2Qme7Bf15ocZLed1b8JrGfJxDja', base_name: 'WhiteCat', quote_name: 'WSOL', status: 'Safe', confidence_score: 0.077855, liquidity_usd: '$13,890.00', image_url: 'https://img-v1.raydium.io/icon/8F9AFyfrLm3nvkajAkk8frESZaK71JaybRqZNRP1WgRC.png', solscan_link: 'https://solscan.io/account/HZ9ZG5Kofqqhs5FkD2Qme7Bf15ocZLed1b8JrGfJxDja' },
  { pool_address: 'CDFcaf4YW3Yf4QTNkesMf1D9JKAbMsrm34WZyMhT7oUP', base_name: '老子', quote_name: 'WSOL', status: 'RUG PULL DETECTED', confidence_score: 0.82833, liquidity_usd: '$1,123.00', image_url: 'https://img-v1.raydium.io/icon/AfKRfEcUroLcmXFxcm6dgpEoBMKg77tXJ3aqW1KiaHJp.png', solscan_link: 'https://solscan.io/account/CDFcaf4YW3Yf4QTNkesMf1D9JKAbMsrm34WZyMhT7oUP' },
  { pool_address: 'EN7gJra4UocGLQsHF6Wis5ajvySozvqJ3x4HL4SJx4Rv', base_name: 'GROK', quote_name: 'WSOL', status: 'Safe', confidence_score: 0.005144, liquidity_usd: '$45,678.00', image_url: 'https://img-v1.raydium.io/icon/GVwejvqd7JK6Z4QF9s6erqvqTNB27cBadoiszNrmJehE.png', solscan_link: 'https://solscan.io/account/EN7gJra4UocGLQsHF6Wis5ajvySozvqJ3x4HL4SJx4Rv' }
]

const STATUS_FILTERS = [
  { key: 'all', label: 'All Pools', icon: '📊', color: '#9ca3af' },
  { key: 'safe', label: 'Safe', icon: '✅', color: '#14f195' },
  { key: 'monitoring', label: 'Monitoring', icon: '👁️', color: '#00d4ff' },
  { key: 'warning', label: 'Warning', icon: '⚠️', color: '#fbbf24' },
  { key: 'rug', label: 'Rug Pull', icon: '🚨', color: '#ef4444' }
]

const SORT_OPTIONS = [
  { key: 'confidence-desc', label: 'Highest Risk First' },
  { key: 'confidence-asc', label: 'Lowest Risk First' },
  { key: 'name-asc', label: 'Name A-Z' },
  { key: 'name-desc', label: 'Name Z-A' }
]

const Dashboard = () => {
  const navigate = useNavigate()
  const [pools, setPools] = useState(HARDCODED_POOLS)
  const [wsConnected, setWsConnected] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('confidence-desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(true)
  const POOLS_PER_PAGE = 12

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsUrl = `${protocol}//${window.location.host}/ws`
    const ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      setWsConnected(true)
    }

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        if (message.type === 'pool_update') {
          setPools((prevPools) => {
            const existingIndex = prevPools.findIndex(
              (p) => p.pool_address === message.data.pool_address
            )
            if (existingIndex >= 0) {
              const updated = [...prevPools]
              updated[existingIndex] = { ...updated[existingIndex], ...message.data }
              return updated
            }
            return [...prevPools, message.data]
          })
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }

    ws.onerror = () => setWsConnected(false)
    ws.onclose = () => setWsConnected(false)

    fetch('/api/pools')
      .then((res) => res.json())
      .then((data) => {
        const fetchedPoolAddresses = new Set(data.map(p => p.pool_address))
        const uniqueHardcoded = HARDCODED_POOLS.filter(p => !fetchedPoolAddresses.has(p.pool_address))
        setPools([...uniqueHardcoded, ...data])
      })
      .catch(() => setPools(HARDCODED_POOLS))

    return () => ws.close()
  }, [])

  // Stats
  const stats = useMemo(() => ({
    total: pools.length,
    safe: pools.filter(p => p.status?.toLowerCase() === 'safe').length,
    monitoring: pools.filter(p => p.status?.toLowerCase() === 'monitoring').length,
    warning: pools.filter(p => p.status?.toLowerCase() === 'warning').length,
    rugPull: pools.filter(p => p.status?.toLowerCase().includes('rug')).length,
    avgRisk: pools.reduce((acc, p) => acc + (p.confidence_score || 0), 0) / pools.length
  }), [pools])

  // Filter and sort
  const processedPools = useMemo(() => {
    let result = [...pools]

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(pool => {
        const status = pool.status?.toLowerCase() || ''
        if (statusFilter === 'rug') return status.includes('rug')
        return status === statusFilter
      })
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(pool =>
        pool.pool_address?.toLowerCase().includes(query) ||
        pool.base_name?.toLowerCase().includes(query) ||
        pool.quote_name?.toLowerCase().includes(query)
      )
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'confidence-desc':
          return (b.confidence_score || 0) - (a.confidence_score || 0)
        case 'confidence-asc':
          return (a.confidence_score || 0) - (b.confidence_score || 0)
        case 'name-asc':
          return (a.base_name || '').localeCompare(b.base_name || '')
        case 'name-desc':
          return (b.base_name || '').localeCompare(a.base_name || '')
        default:
          return 0
      }
    })

    return result
  }, [pools, statusFilter, searchQuery, sortBy])

  // Pagination
  const totalPages = Math.ceil(processedPools.length / POOLS_PER_PAGE)
  const paginatedPools = processedPools.slice(
    (currentPage - 1) * POOLS_PER_PAGE,
    currentPage * POOLS_PER_PAGE
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter, sortBy])

  const formatAddress = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : 'N/A'

  const getStatusColor = (status) => {
    const s = status?.toLowerCase() || ''
    if (s.includes('rug')) return '#ef4444'
    if (s === 'warning') return '#fbbf24'
    if (s === 'monitoring') return '#00d4ff'
    if (s === 'safe') return '#14f195'
    return '#9ca3af'
  }

  const getRiskLevel = (score) => {
    if (score >= 0.75) return { label: 'CRITICAL', color: '#ef4444' }
    if (score >= 0.5) return { label: 'HIGH', color: '#f97316' }
    if (score >= 0.25) return { label: 'MEDIUM', color: '#fbbf24' }
    return { label: 'LOW', color: '#14f195' }
  }

  return (
    <div className="dashboard-v2">
      {/* Animated Background */}
      <div className="dash-bg">
        <div className="dash-bg-gradient"></div>
        <div className="dash-bg-grid"></div>
        <div className="dash-bg-orb dash-bg-orb-1"></div>
        <div className="dash-bg-orb dash-bg-orb-2"></div>
        <div className="dash-bg-orb dash-bg-orb-3"></div>
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="dash-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.header 
        className="dash-header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="dash-header-content">
          <div className="dash-header-left">
            <motion.button 
              className="dash-back-btn"
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>←</span> Back
            </motion.button>
            <div className="dash-title-group">
              <h1 className="dash-title">
                <span className="dash-title-icon">🛡️</span>
                Pool Monitor
              </h1>
              <div className="dash-live-indicator">
                <motion.span 
                  className={`live-dot ${wsConnected ? 'connected' : ''}`}
                  animate={wsConnected ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="live-text">{wsConnected ? 'LIVE' : 'OFFLINE'}</span>
              </div>
            </div>
          </div>
          <div className="dash-header-right">
            <motion.button
              className="dash-login-btn"
              onClick={() => navigate('/login')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login / Sign Up
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Stats Cards */}
      <motion.div 
        className="dash-stats"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {[
          { label: 'Total Pools', value: stats.total, icon: '📊', color: '#9ca3af' },
          { label: 'Safe', value: stats.safe, icon: '✅', color: '#14f195' },
          { label: 'Monitoring', value: stats.monitoring, icon: '👁️', color: '#00d4ff' },
          { label: 'Warning', value: stats.warning, icon: '⚠️', color: '#fbbf24' },
          { label: 'Rug Pulls', value: stats.rugPull, icon: '🚨', color: '#ef4444' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            className="dash-stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            style={{ '--stat-color': stat.color }}
          >
            <div className="stat-glow"></div>
            <span className="stat-icon">{stat.icon}</span>
            <span className="stat-value">{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Controls */}
      <motion.div 
        className="dash-controls"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {/* Search */}
        <div className="dash-search">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search pools by name or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <motion.button 
              className="search-clear"
              onClick={() => setSearchQuery('')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ×
            </motion.button>
          )}
        </div>

        {/* Filters Toggle */}
        <motion.button
          className={`filter-toggle ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>⚙️</span> Filters
        </motion.button>

        {/* View Mode Toggle */}
        <div className="view-toggle">
          <motion.button
            className={viewMode === 'grid' ? 'active' : ''}
            onClick={() => setViewMode('grid')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ▦
          </motion.button>
          <motion.button
            className={viewMode === 'list' ? 'active' : ''}
            onClick={() => setViewMode('list')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ☰
          </motion.button>
        </div>
      </motion.div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="dash-filter-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Status Filters */}
            <div className="filter-section">
              <h3>Status Filter</h3>
              <div className="filter-buttons">
                {STATUS_FILTERS.map((filter) => (
                  <motion.button
                    key={filter.key}
                    className={`filter-btn ${statusFilter === filter.key ? 'active' : ''}`}
                    onClick={() => setStatusFilter(filter.key)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ '--filter-color': filter.color }}
                  >
                    <span className="filter-icon">{filter.icon}</span>
                    <span>{filter.label}</span>
                    <span className="filter-count">
                      {filter.key === 'all' ? stats.total :
                       filter.key === 'safe' ? stats.safe :
                       filter.key === 'monitoring' ? stats.monitoring :
                       filter.key === 'warning' ? stats.warning :
                       stats.rugPull}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div className="filter-section">
              <h3>Sort By</h3>
              <div className="sort-buttons">
                {SORT_OPTIONS.map((option) => (
                  <motion.button
                    key={option.key}
                    className={`sort-btn ${sortBy === option.key ? 'active' : ''}`}
                    onClick={() => setSortBy(option.key)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Info */}
      <div className="dash-results-info">
        Showing {paginatedPools.length} of {processedPools.length} pools
        {searchQuery && <span> matching "{searchQuery}"</span>}
        {statusFilter !== 'all' && <span> • Filtered by: {STATUS_FILTERS.find(f => f.key === statusFilter)?.label}</span>}
      </div>

      {/* Pools Grid/List */}
      <div className={`dash-pools ${viewMode}`}>
        <AnimatePresence mode="popLayout">
          {paginatedPools.map((pool, index) => {
            const riskLevel = getRiskLevel(pool.confidence_score || 0)
            const statusColor = getStatusColor(pool.status)
            
            return (
              <motion.div
                key={pool.pool_address}
                className={`dash-pool-card ${pool.status?.toLowerCase().includes('rug') ? 'rug-detected' : ''}`}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -8, scale: 1.02 }}
                layout
                style={{ '--status-color': statusColor }}
              >
                {/* Glowing border effect for rug pulls */}
                {pool.status?.toLowerCase().includes('rug') && (
                  <motion.div 
                    className="rug-glow"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                {/* Card Header */}
                <div className="card-header">
                  <div className="token-info">
                    {pool.image_url ? (
                      <motion.img 
                        src={pool.image_url} 
                        alt="" 
                        className="token-image"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    ) : (
                      <div className="token-placeholder">
                        {pool.base_name?.charAt(0) || '?'}
                      </div>
                    )}
                    <div className="token-names">
                      <h3>{pool.base_name} / {pool.quote_name}</h3>
                      <span className="pool-address">{formatAddress(pool.pool_address)}</span>
                    </div>
                  </div>
                  <motion.div 
                    className="status-badge"
                    style={{ backgroundColor: statusColor }}
                    animate={pool.status?.toLowerCase().includes('rug') ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {pool.status?.toLowerCase().includes('rug') ? '🚨' : 
                     pool.status?.toLowerCase() === 'warning' ? '⚠️' :
                     pool.status?.toLowerCase() === 'safe' ? '✅' : '👁️'}
                  </motion.div>
                </div>

                {/* Risk Meter */}
                {pool.confidence_score !== undefined && (
                  <div className="risk-meter">
                    <div className="risk-header">
                      <span className="risk-label">Risk Score</span>
                      <span className="risk-value" style={{ color: riskLevel.color }}>
                        {(pool.confidence_score * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="risk-bar">
                      <motion.div 
                        className="risk-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${pool.confidence_score * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        style={{ 
                          background: `linear-gradient(90deg, #14f195 0%, #fbbf24 50%, #ef4444 100%)`,
                        }}
                      />
                      <motion.div 
                        className="risk-glow"
                        style={{ left: `${pool.confidence_score * 100}%`, backgroundColor: riskLevel.color }}
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    </div>
                    <div className="risk-levels">
                      <span>LOW</span>
                      <span>MEDIUM</span>
                      <span>HIGH</span>
                      <span>CRITICAL</span>
                    </div>
                  </div>
                )}

                {/* Pool Details */}
                <div className="card-details">
                  <div className="detail-item">
                    <span className="detail-label">Status</span>
                    <span className="detail-value status" style={{ color: statusColor }}>
                      {pool.status}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Liquidity</span>
                    <span className="detail-value liquidity">{pool.liquidity_usd || 'N/A'}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="card-actions">
                  <motion.a
                    href={pool.solscan_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action-btn primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>View on Solscan</span>
                    <span>↗</span>
                  </motion.a>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {processedPools.length === 0 && (
        <motion.div 
          className="dash-empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="empty-icon">🔍</span>
          <h2>No pools found</h2>
          <p>Try adjusting your filters or search query</p>
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div 
          className="dash-pagination"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Previous
          </motion.button>
          
          <div className="page-numbers">
            {[...Array(totalPages)].map((_, i) => (
              <motion.button
                key={i}
                className={currentPage === i + 1 ? 'active' : ''}
                onClick={() => setCurrentPage(i + 1)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {i + 1}
              </motion.button>
            ))}
          </div>

          <motion.button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Next →
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}

export default Dashboard
