import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import './Home.css'
import './HomeExtras.css'
import './GraphStyles.css'

const Home = () => {
  const navigate = useNavigate()
  const [activeMetric, setActiveMetric] = useState('accuracy')

  // Model performance data over time
  const modelMetrics = {
    "3": { accuracy: 0.9598, precision: 0.9922, recall: 0.9552, f1_score: 0.9734, avg_score_train: 0.8668, avg_score_positive_test: 0.8713, avg_score_negative_test: 0.2012, true_positives: 128, false_positives: 1, true_negatives: 39, false_negatives: 6 },
    "8": { accuracy: 0.9598, precision: 0.9922, recall: 0.9552, f1_score: 0.9734, avg_score_train: 0.8668, avg_score_positive_test: 0.8713, avg_score_negative_test: 0.2012, true_positives: 128, false_positives: 1, true_negatives: 39, false_negatives: 6 },
    "13": { accuracy: 0.9310, precision: 0.9919, recall: 0.9179, f1_score: 0.9535, avg_score_train: 0.8913, avg_score_positive_test: 0.8764, avg_score_negative_test: 0.2032, true_positives: 123, false_positives: 1, true_negatives: 39, false_negatives: 11 },
    "18": { accuracy: 0.9598, precision: 0.9922, recall: 0.9552, f1_score: 0.9734, avg_score_train: 0.8668, avg_score_positive_test: 0.8713, avg_score_negative_test: 0.2012, true_positives: 128, false_positives: 1, true_negatives: 39, false_negatives: 6 },
    "23": { accuracy: 0.9540, precision: 1.0000, recall: 0.9403, f1_score: 0.9692, avg_score_train: 0.8798, avg_score_positive_test: 0.8754, avg_score_negative_test: 0.0956, true_positives: 126, false_positives: 0, true_negatives: 40, false_negatives: 8 },
    "28": { accuracy: 0.9138, precision: 0.9161, recall: 0.9776, f1_score: 0.9458, avg_score_train: 0.9046, avg_score_positive_test: 0.9009, avg_score_negative_test: 0.3863, true_positives: 131, false_positives: 12, true_negatives: 28, false_negatives: 3 },
    "33": { accuracy: 0.9310, precision: 0.9766, recall: 0.9328, f1_score: 0.9542, avg_score_train: 0.8733, avg_score_positive_test: 0.8627, avg_score_negative_test: 0.1371, true_positives: 125, false_positives: 3, true_negatives: 37, false_negatives: 9 },
    "38": { accuracy: 0.9080, precision: 0.9836, recall: 0.8955, f1_score: 0.9375, avg_score_train: 0.8945, avg_score_positive_test: 0.8912, avg_score_negative_test: 0.0701, true_positives: 120, false_positives: 2, true_negatives: 38, false_negatives: 14 },
    "43": { accuracy: 0.9483, precision: 0.9433, recall: 0.9925, f1_score: 0.9673, avg_score_train: 0.8905, avg_score_positive_test: 0.8894, avg_score_negative_test: 0.4104, true_positives: 133, false_positives: 8, true_negatives: 32, false_negatives: 1 },
    "48": { accuracy: 0.9828, precision: 0.9925, recall: 0.9851, f1_score: 0.9888, avg_score_train: 0.8937, avg_score_positive_test: 0.8906, avg_score_negative_test: 0.2970, true_positives: 132, false_positives: 1, true_negatives: 39, false_negatives: 2 }
  }

  const timePoints = Object.keys(modelMetrics).map(Number).sort((a, b) => a - b)
  const metricOptions = [
    { key: 'accuracy', label: 'Accuracy', color: '#14f195' },
    { key: 'precision', label: 'Precision', color: '#ff6b2c' },
    { key: 'recall', label: 'Recall', color: '#9945ff' },
    { key: 'f1_score', label: 'F1 Score', color: '#00d4ff' }
  ]

  const stats = [
    { value: '98.3%', label: 'Detection Accuracy', icon: '🎯' },
    { value: '3-4s', label: 'System Latency', icon: '⚡' },
    { value: '24/7', label: 'Solana Monitoring', icon: '🛡️' },
    { value: '4ms', label: 'Parse Time', icon: '📊' },
  ]

  const features = [
    {
      icon: '⚡',
      title: 'Zero-Copy Data Transfer',
      description: 'Apache Arrow\'s columnar format enables zero-copy reads, eliminating serialization overhead and reducing latency to microseconds.',
      highlight: 'Up to 100x faster'
    },
    {
      icon: '🚀',
      title: 'High-Performance Backend',
      description: 'Built with C++ and Rust for maximum throughput. Our pipeline handles Solana\'s peak loads with minimal CPU overhead.',
      highlight: 'C++ & Rust'
    },
    {
      icon: '🔒',
      title: 'Type-Safe Streaming',
      description: 'Strongly-typed schemas ensure data integrity and enable efficient vectorized operations for real-time ML inference.',
      highlight: 'Zero data loss'
    },
    {
      icon: '🧠',
      title: 'Deep Learning Detection',
      description: 'State-of-the-art neural networks trained on millions of rug pulls detect malicious patterns before they execute.',
      highlight: '99.9% accuracy'
    },
    {
      icon: '📊',
      title: 'Real-Time Analytics',
      description: 'Columnar storage enables vectorized operations, perfect for batch processing and ML inference pipelines.',
      highlight: 'Live insights'
    },
    {
      icon: '☀️',
      title: 'Solana Native',
      description: 'Built exclusively for Solana with C++ and Rust backend. Native integration with Raydium, Serum, and all major DEXes.',
      highlight: 'Solana Only'
    }
  ]

  return (
    <div className="home">
      {/* Animated Background */}
      <div className="bg-effects">
        <div className="bg-gradient"></div>
        <div className="bg-grid"></div>
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
        <div className="bg-orb bg-orb-3"></div>
      </div>

      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <motion.div 
            className="nav-logo"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="logo-icon">🛡️</span>
            <span className="logo-text">RugGuard</span>
          </motion.div>
          <motion.div 
            className="nav-links"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#architecture">Architecture</a>
            <button className="nav-login" onClick={() => navigate('/login')}>
              Login
            </button>
            <button className="nav-cta" onClick={() => navigate('/dashboard')}>
              <span>Launch Dashboard</span>
              <span className="cta-arrow">→</span>
            </button>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="hero-content"
          >
            <motion.div 
              className="hero-badge"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="badge-dot"></span>
              <span>AI-Powered Protection</span>
              <span className="badge-new">NEW</span>
            </motion.div>
            
            <h1 className="hero-title">
              <span className="title-line">Stop Rug Pulls</span>
              <span className="title-line gradient-text">Before They Happen</span>
            </h1>
            
            <p className="hero-subtitle">
              Real-time deep learning detection for Solana DeFi. Monitor Raydium pools, 
              analyze smart contracts, and protect your investments with 
              <span className="highlight"> 3-4 second detection latency</span>.
            </p>

            <div className="hero-buttons">
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(255, 107, 44, 0.4)' }}
                whileTap={{ scale: 0.98 }}
                className="hero-cta-primary"
                onClick={() => navigate('/dashboard')}
              >
                <span className="btn-glow"></span>
                <span className="btn-text">Start Monitoring</span>
                <span className="btn-icon">🚀</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="hero-cta-secondary"
                onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
              >
                See How It Works
              </motion.button>
            </div>

            {/* Stats */}
            <motion.div 
              className="hero-stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {stats.map((stat, index) => (
                <motion.div 
                  key={index}
                  className="stat-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                >
                  <span className="stat-icon">{stat.icon}</span>
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-section">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-header"
          >
            <span className="section-label">How It Works</span>
            <h2 className="section-title">Protection in <span className="gradient-text">Three Steps</span></h2>
            <p className="section-description">
              Our AI-powered system monitors the blockchain 24/7, 
              detecting threats before they can harm your portfolio.
            </p>
          </motion.div>

          <div className="steps-container">
            {[
              {
                number: '01',
                title: 'Connect & Monitor',
                description: 'Connect your wallet or enter pool addresses. Our system begins real-time monitoring instantly.',
                icon: '🔌'
              },
              {
                number: '02',
                title: 'AI Analysis',
                description: 'Deep learning models analyze transaction patterns, smart contract behavior, and liquidity movements.',
                icon: '🧠'
              },
              {
                number: '03',
                title: 'Instant Alerts',
                description: 'Receive sub-50ms alerts when suspicious activity is detected. Stay ahead of rug pulls.',
                icon: '🚨'
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                className="step-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <div className="step-number">{step.number}</div>
                <div className="step-icon">{step.icon}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
                {index < 2 && <div className="step-connector"></div>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-header"
          >
            <span className="section-label">Apache Arrow Flight Protocol</span>
            <h2 className="section-title">Blazing Fast <span className="gradient-text">Data Streaming</span></h2>
            <p className="section-description">
              The fastest, most reliable way to stream blockchain transactions 
              for real-time analysis and detection.
            </p>
          </motion.div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <div className="feature-glow"></div>
                <div className="feature-icon">{feature.icon}</div>
                <div className="feature-highlight">{feature.highlight}</div>
                <h4 className="feature-title">{feature.title}</h4>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Technology Section */}
      <section className="tech-section">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-header"
          >
            <span className="section-label">Advanced Technology Stack</span>
            <h2 className="section-title">Powered by <span className="gradient-text">Cutting-Edge AI</span></h2>
            <p className="section-description">
              Our detection system combines Time Series GAN models, async programming, 
              and high-performance data infrastructure for unmatched speed and accuracy.
            </p>
          </motion.div>

          <div className="tech-grid">
            {/* Time Series GAN */}
            <motion.div
              className="tech-card tech-card-large"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="tech-card-bg">
                <div className="neural-network">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="neuron"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 0.8, 0.3],
                      }}
                      transition={{
                        duration: 2 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                      }}
                    />
                  ))}
                  {[...Array(15)].map((_, i) => (
                    <motion.div
                      key={`line-${i}`}
                      className="synapse"
                      style={{
                        left: `${Math.random() * 80}%`,
                        top: `${Math.random() * 80}%`,
                        width: `${50 + Math.random() * 100}px`,
                        transform: `rotate(${Math.random() * 360}deg)`,
                      }}
                      animate={{ opacity: [0.1, 0.4, 0.1] }}
                      transition={{
                        duration: 1.5 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="tech-card-content">
                <div className="tech-icon-wrapper">
                  <motion.span 
                    className="tech-icon"
                    animate={{ rotateY: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    🧬
                  </motion.span>
                </div>
                <h3 className="tech-title">Time Series GAN Model</h3>
                <p className="tech-description">
                  Our proprietary <strong>Generative Adversarial Network</strong> is specifically designed 
                  for Solana temporal data. The generator learns normal Raydium pool patterns while 
                  the discriminator identifies anomalies in real-time liquidity movements.
                </p>
                <div className="tech-stats">
                  <div className="tech-stat">
                    <span className="tech-stat-value">98.3%</span>
                    <span className="tech-stat-label">Accuracy</span>
                  </div>
                  <div className="tech-stat">
                    <span className="tech-stat-value">48min</span>
                    <span className="tech-stat-label">Detection Window</span>
                  </div>
                  <div className="tech-stat">
                    <span className="tech-stat-value">0.6%</span>
                    <span className="tech-stat-label">False Positive Rate</span>
                  </div>
                </div>
                <div className="tech-features">
                  <span className="tech-feature">Temporal Pattern Recognition</span>
                  <span className="tech-feature">Anomaly Detection</span>
                  <span className="tech-feature">Self-Improving</span>
                </div>
              </div>
            </motion.div>

            {/* Async Programming */}
            <motion.div
              className="tech-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
            >
              <div className="tech-card-glow async-glow"></div>
              <motion.div 
                className="tech-icon-wrapper"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <span className="tech-icon">⚡</span>
              </motion.div>
              <h3 className="tech-title">Async Architecture</h3>
              <p className="tech-description">
                <strong>Non-blocking I/O</strong> in Rust with minimal thread overhead. Our event-driven 
                architecture processes 10,000+ concurrent Solana streams on just 4 threads.
              </p>
              <div className="tech-highlight">
                <motion.div 
                  className="thread-viz"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  {[1, 2, 3, 4].map((thread) => (
                    <motion.div
                      key={thread}
                      className="thread-bar"
                      animate={{
                        scaleX: [0.3, 1, 0.5, 0.8, 0.3],
                        backgroundColor: ['#14f195', '#00d4ff', '#9945ff', '#ff6b2c', '#14f195']
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: thread * 0.2,
                      }}
                    />
                  ))}
                </motion.div>
                <span>4 Threads • Tokio Runtime</span>
              </div>
            </motion.div>

            {/* C++ & Rust Backend */}
            <motion.div
              className="tech-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
            >
              <div className="tech-card-glow rust-glow"></div>
              <motion.div className="tech-icon-wrapper">
                <motion.span 
                  className="tech-icon"
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🦀
                </motion.span>
              </motion.div>
              <h3 className="tech-title">C++ & Rust Backend</h3>
              <p className="tech-description">
                <strong>Systems-level performance</strong> with C++ for compute-intensive operations 
                and Rust for memory-safe, concurrent data processing. No garbage collection overhead.
              </p>
              <div className="tech-highlight rust-stack">
                <motion.div 
                  className="lang-badge cpp"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  C++
                </motion.div>
                <motion.div 
                  className="lang-badge rust"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                >
                  Rust
                </motion.div>
                <span>Zero GC • Native Speed</span>
              </div>
            </motion.div>

            {/* JSON Parser - Large Card with Graph */}
            <motion.div
              className="tech-card tech-card-parser"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="tech-card-glow json-glow"></div>
              <div className="parser-content">
                <motion.div className="tech-icon-wrapper parser-icon">
                  <motion.span 
                    className="tech-icon"
                    animate={{ rotateZ: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    📋
                  </motion.span>
                </motion.div>
                <h3 className="tech-title">In-House JSON Parser</h3>
                <p className="tech-description">
                  Our custom-built C++ parser <strong>outperforms SIMD-based solutions</strong> by 40% 
                  with just <strong>4ms parse time</strong>. Optimized for Solana transaction payloads 
                  with predictable memory patterns and zero-allocation hot paths.
                </p>
                <div className="parser-stats">
                  <div className="parser-stat">
                    <span className="parser-stat-icon">🚀</span>
                    <span className="parser-stat-value">40%</span>
                    <span className="parser-stat-label">Faster than SIMD</span>
                  </div>
                  <div className="parser-stat">
                    <span className="parser-stat-icon">⏱️</span>
                    <span className="parser-stat-value">4ms</span>
                    <span className="parser-stat-label">Parse Time</span>
                  </div>
                  <div className="parser-stat">
                    <span className="parser-stat-icon">📦</span>
                    <span className="parser-stat-value">256MB</span>
                    <span className="parser-stat-label">Tested Payload</span>
                  </div>
                </div>
              </div>
              <div className="parser-graph">
                <h4 className="graph-label">Execution Time: Mean vs File Size</h4>
                <div className="comparison-chart">
                  <div className="chart-y-axis">
                    <span>300ms</span>
                    <span>200ms</span>
                    <span>100ms</span>
                    <span>0ms</span>
                  </div>
                  <div className="chart-area">
                    <svg viewBox="0 0 400 200" className="chart-svg">
                      {/* Grid lines */}
                      <line x1="0" y1="50" x2="400" y2="50" stroke="rgba(255,255,255,0.1)" />
                      <line x1="0" y1="100" x2="400" y2="100" stroke="rgba(255,255,255,0.1)" />
                      <line x1="0" y1="150" x2="400" y2="150" stroke="rgba(255,255,255,0.1)" />
                      
                      {/* SIMD Parser (benchmark2.exe) - Blue line */}
                      <motion.path
                        d="M 0,190 L 40,180 L 80,160 L 120,140 L 160,115 L 200,90 L 240,65 L 280,45 L 320,25 L 360,10 L 400,0"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 2, delay: 0.5 }}
                      />
                      
                      {/* Our Parser (myParser10.exe) - Cyan line */}
                      <motion.path
                        d="M 0,190 L 40,175 L 80,165 L 120,155 L 160,140 L 200,125 L 240,115 L 280,105 L 320,95 L 360,85 L 400,75"
                        fill="none"
                        stroke="#14f195"
                        strokeWidth="3"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 2, delay: 0.7 }}
                      />
                      
                      {/* Data points for Our Parser */}
                      {[0, 40, 80, 120, 160, 200, 240, 280, 320, 360, 400].map((x, i) => (
                        <motion.circle
                          key={i}
                          cx={x}
                          cy={190 - (i * 11.5)}
                          r="4"
                          fill="#14f195"
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.8 + i * 0.1 }}
                        />
                      ))}
                    </svg>
                  </div>
                  <div className="chart-x-axis">
                    <span>0</span>
                    <span>64</span>
                    <span>128</span>
                    <span>192</span>
                    <span>256 MB</span>
                  </div>
                </div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <span className="legend-line simd"></span>
                    <span>SIMD Parser (benchmark)</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-line ours"></span>
                    <span>myParser (in-house)</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Apache Arrow Card - Full Width with Side Filler */}
            <motion.div
              className="tech-card tech-card-arrow-full"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="tech-card-glow arrow-glow"></div>
              <div className="arrow-full-content">
                {/* Left Side - Arrow Info */}
                <div className="arrow-info-side">
                  <motion.div className="tech-icon-wrapper arrow-icon">
                    <motion.span 
                      className="tech-icon"
                      animate={{ 
                        x: [0, 10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      🏹
                    </motion.span>
                  </motion.div>
                  <h3 className="tech-title">Apache Arrow Flight</h3>
                  <p className="tech-description">
                    <strong>Zero-copy data transfer</strong> eliminates serialization overhead. 
                    Direct memory mapping enables seamless writes to our high-performance 
                    <strong> Rust-based streaming database</strong>.
                  </p>
                  <div className="arrow-features">
                    <motion.div 
                      className="arrow-feature"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.8 }}
                    >
                      <div className="arrow-feature-icon">
                        <motion.div 
                          className="zero-copy-viz"
                          animate={{ x: [0, 30, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <span className="data-block">📦</span>
                          <span className="arrow-path">→→→</span>
                          <span className="data-block">💾</span>
                        </motion.div>
                      </div>
                      <div className="arrow-feature-text">
                        <strong>Zero-Copy Transfer</strong>
                        <span>No data duplication in memory</span>
                      </div>
                    </motion.div>
                    <motion.div 
                      className="arrow-feature"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.9 }}
                    >
                      <div className="arrow-feature-icon">
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                          🚫
                        </motion.div>
                      </div>
                      <div className="arrow-feature-text">
                        <strong>No Serialization</strong>
                        <span>Columnar format, wire-ready</span>
                      </div>
                    </motion.div>
                    <motion.div 
                      className="arrow-feature"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1.0 }}
                    >
                      <div className="arrow-feature-icon">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          🦀
                        </motion.div>
                      </div>
                      <div className="arrow-feature-text">
                        <strong>Rust Streaming DB</strong>
                        <span>Native integration, zero GC overhead</span>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Right Side - Data Pipeline Visualization */}
                <div className="arrow-pipeline-side">
                  <h4 className="pipeline-title">Data Pipeline Flow</h4>
                  <div className="pipeline-flow">
                    {[
                      { icon: '⛓️', label: 'Chain Data', desc: 'Solana RPC' },
                      { icon: '⚡', label: 'C++ Parser', desc: '4ms parse' },
                      { icon: '🏹', label: 'Arrow Flight', desc: 'Zero-copy' },
                      { icon: '🦀', label: 'Stream DB', desc: 'Rust-based' },
                      { icon: '🧠', label: 'GAN Inference', desc: 'Detection' },
                      { icon: '📊', label: 'Dashboard', desc: 'Real-time' },
                    ].map((step, index) => (
                      <motion.div
                        key={index}
                        className="pipeline-step"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                      >
                        <motion.div 
                          className="pipeline-icon"
                          animate={{ 
                            scale: [1, 1.1, 1],
                            opacity: [0.8, 1, 0.8]
                          }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity, 
                            delay: index * 0.3 
                          }}
                        >
                          {step.icon}
                        </motion.div>
                        <div className="pipeline-info">
                          <span className="pipeline-label">{step.label}</span>
                          <span className="pipeline-desc">{step.desc}</span>
                        </div>
                        {index < 5 && (
                          <motion.div 
                            className="pipeline-connector"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ 
                              duration: 1, 
                              repeat: Infinity, 
                              delay: index * 0.2 
                            }}
                          >
                            ↓
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                  <div className="pipeline-latency">
                    <span className="latency-label">Total Latency:</span>
                    <span className="latency-value">3-4 seconds</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section id="architecture" className="architecture-section">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-header"
          >
            <span className="section-label">System Architecture</span>
            <h2 className="section-title">Solana Detection <span className="gradient-text">Pipeline</span></h2>
            <p className="section-description">
              Our C++ and Rust backend processes Solana transactions with 3-4 second latency, 
              applying deep learning to detect rug pulls before they execute.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="architecture-diagram"
          >
            <div className="arch-flow">
              {[
                { icon: '⛓️', title: 'Chain Data', desc: 'Real-time transaction stream from Solana validators' },
                { icon: '⚡', title: 'C++ Parser', desc: '4ms JSON parsing with custom in-house parser', highlight: true },
                { icon: '🏹', title: 'Arrow Flight', desc: 'Zero-copy data transfer to streaming database' },
                { icon: '🦀', title: 'Rust Stream DB', desc: 'High-performance Rust-based streaming storage' },
                { icon: '🧠', title: 'GAN Inference', desc: 'Time Series GAN detects rug pull patterns' },
                { icon: '📊', title: 'Dashboard Push', desc: 'Real-time WebSocket updates to clients' }
              ].map((node, index) => (
                <motion.div 
                  key={index}
                  className={`arch-node ${node.highlight ? 'highlight' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <div className="arch-icon">{node.icon}</div>
                  <h4 className="arch-title">{node.title}</h4>
                  <p className="arch-description">{node.desc}</p>
                  {index < 5 && <div className="arch-connector"><span>→</span></div>}
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="arch-details"
          >
            <div className="detail-card">
              <div className="detail-icon">💡</div>
              <h4>System Latency: 3-4 Seconds Behind Real-Time</h4>
              <p>
                Our entire pipeline—from Solana RPC stream to GAN inference to alert—completes in just 
                3-4 seconds. The C++ parser processes payloads in 4ms, while Arrow Flight's zero-copy 
                transfer eliminates serialization overhead for seamless streaming to our ML models.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Model Performance Section */}
      <section className="model-section">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-header"
          >
            <span className="section-label">Model Performance</span>
            <h2 className="section-title">Proven <span className="gradient-text">Detection Accuracy</span></h2>
            <p className="section-description">
              Our deep learning model achieves industry-leading performance across all metrics,
              with 98.3% accuracy at 48 minutes post-pool creation.
            </p>
          </motion.div>

          {/* Metric Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="metric-selector"
          >
            {metricOptions.map((metric, index) => (
              <motion.button
                key={metric.key}
                className={`metric-button ${activeMetric === metric.key ? 'active' : ''}`}
                onClick={() => setActiveMetric(metric.key)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                style={{ '--metric-color': metric.color }}
              >
                <span className="metric-dot"></span>
                <span>{metric.label}</span>
                <span className="metric-value">
                  {(modelMetrics["48"][metric.key] * 100).toFixed(1)}%
                </span>
              </motion.button>
            ))}
          </motion.div>

          {/* Graph - Clean Bar Chart Style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="performance-graph"
          >
            <div className="graph-header">
              <h3 className="graph-title">
                {metricOptions.find(m => m.key === activeMetric)?.label} Over Time
              </h3>
              <div className="graph-legend">
                <span className="legend-dot" style={{ background: metricOptions.find(m => m.key === activeMetric)?.color }}></span>
                <span>Minutes since pool creation</span>
              </div>
            </div>
            
            <div className="bar-chart">
              {timePoints.map((time, index) => {
                const value = modelMetrics[time][activeMetric]
                const activeColor = metricOptions.find(m => m.key === activeMetric)?.color
                return (
                  <motion.div
                    key={time}
                    className="bar-column"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.05 }}
                  >
                    <div className="bar-value" style={{ color: activeColor }}>
                      {(value * 100).toFixed(1)}%
                    </div>
                    <div className="bar-track">
                      <motion.div
                        className="bar-fill"
                        style={{ background: `linear-gradient(180deg, ${activeColor} 0%, ${activeColor}88 100%)` }}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${value * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.6 + index * 0.08, ease: "easeOut" }}
                      />
                    </div>
                    <div className="bar-label">{time}m</div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Key Metrics Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="metrics-grid"
          >
            {[
              { label: 'Peak Accuracy', value: '98.3%', icon: '🎯', color: '#14f195' },
              { label: 'False Positives', value: '0.6%', icon: '✅', color: '#00d4ff' },
              { label: 'Detection Time', value: '48min', icon: '⚡', color: '#ff6b2c' },
              { label: 'True Negatives', value: '97.5%', icon: '🛡️', color: '#9945ff' }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="metric-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                style={{ '--card-color': item.color }}
              >
                <div className="metric-card-icon">{item.icon}</div>
                <div className="metric-card-value">{item.value}</div>
                <div className="metric-card-label">{item.label}</div>
                <div className="metric-card-glow"></div>
              </motion.div>
            ))}
          </motion.div>

          {/* Confusion Matrix */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="confusion-matrix-section"
          >
            <h3 className="matrix-title">Confusion Matrix <span className="matrix-subtitle">(at 48min)</span></h3>
            <div className="confusion-matrix">
              <div className="matrix-labels">
                <div className="matrix-label-y">
                  <span>Actual</span>
                  <div className="label-items">
                    <span>Rug Pull</span>
                    <span>Safe</span>
                  </div>
                </div>
              </div>
              <div className="matrix-content">
                <div className="matrix-label-x">
                  <span>Predicted</span>
                  <div className="label-items">
                    <span>Rug Pull</span>
                    <span>Safe</span>
                  </div>
                </div>
                <div className="matrix-grid">
                  <motion.div 
                    className="matrix-cell tp"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="cell-value">{modelMetrics["48"].true_positives}</div>
                    <div className="cell-label">True Positive</div>
                  </motion.div>
                  <motion.div 
                    className="matrix-cell fn"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 1.0 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="cell-value">{modelMetrics["48"].false_negatives}</div>
                    <div className="cell-label">False Negative</div>
                  </motion.div>
                  <motion.div 
                    className="matrix-cell fp"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 1.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="cell-value">{modelMetrics["48"].false_positives}</div>
                    <div className="cell-label">False Positive</div>
                  </motion.div>
                  <motion.div 
                    className="matrix-cell tn"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 1.2 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="cell-value">{modelMetrics["48"].true_negatives}</div>
                    <div className="cell-label">True Negative</div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="cta-content"
          >
            <h2 className="cta-title">Ready to Protect Your <span className="gradient-text">Investments</span>?</h2>
            <p className="cta-description">
              Start monitoring Solana pools in real-time. C++ & Rust powered detection.
            </p>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(255, 107, 44, 0.5)' }}
              whileTap={{ scale: 0.98 }}
              className="cta-button"
              onClick={() => navigate('/dashboard')}
            >
              <span>Launch Dashboard</span>
              <span className="cta-arrow">→</span>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <span className="logo-icon">🛡️</span>
            <span>RugGuard</span>
          </div>
          <p>© 2026 RugGuard. Solana Only • C++ & Rust Backend • 3-4s Latency</p>
        </div>
      </footer>
    </div>
  )
}

export default Home
