'use client';

import { useState, useEffect } from 'react';
import { Stream, StreamStatus, UserProfile } from '@stroomp/shared-types';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';

// Mock data for demonstration
const mockStreams: Stream[] = [
  {
    id: '1',
    title: 'Gaming with Pro Players - Live Tournament Finals',
    description: 'Watch the most exciting gaming tournament finals live',
    category: 'GAMING',
    status: StreamStatus.LIVE,
    streamer: {
      id: 's1',
      walletAddress: 'GamingPro123...',
      username: 'GamingChamp',
      profileImageUrl: ''
    },
    viewers: 12456,
    startTime: new Date(Date.now() - 3600000) // 1 hour ago
  },
  {
    id: '2',
    title: 'Music Concert - Live Performance',
    description: 'Amazing live music performance from top artists',
    category: 'MUSIC',
    status: StreamStatus.ENDED,
    streamer: {
      id: 's2',
      walletAddress: 'MusicLover456...',
      username: 'MusicMaster',
      profileImageUrl: ''
    },
    viewers: 8765,
    startTime: new Date(Date.now() - 86400000) // 1 day ago
  },
  {
    id: '3',
    title: 'Tech Talk - Latest AI Innovations',
    description: 'Exploring the newest AI technologies and trends',
    category: 'TECH',
    status: StreamStatus.ENDED,
    streamer: {
      id: 's3',
      walletAddress: 'TechExpert789...',
      username: 'TechGuru',
      profileImageUrl: ''
    },
    viewers: 5432,
    startTime: new Date(Date.now() - 172800000) // 2 days ago
  },
  {
    id: '4',
    title: 'Educational Stream - Learn Web Development',
    description: 'Comprehensive tutorial on modern web development',
    category: 'EDUCATION',
    status: StreamStatus.ENDED,
    streamer: {
      id: 's4',
      walletAddress: 'DevTeacher321...',
      username: 'WebDevPro',
      profileImageUrl: ''
    },
    viewers: 6543,
    startTime: new Date(Date.now() - 259200000) // 3 days ago
  }
];

// Mock analytics data
const mockAnalytics = {
  totalViewers: 25840,
  totalEarnings: 42.75, // in SOL
  totalStreams: 15,
  avgViewers: 1245,
  topCountries: [
    { name: 'USA', value: 35 },
    { name: 'UK', value: 15 },
    { name: 'Germany', value: 12 },
    { name: 'Japan', value: 10 },
    { name: 'Canada', value: 8 }
  ],
  viewerGrowth: [
    { day: 'Mon', viewers: 1200 },
    { day: 'Tue', viewers: 1900 },
    { day: 'Wed', viewers: 1500 },
    { day: 'Thu', viewers: 2100 },
    { day: 'Fri', viewers: 2800 },
    { day: 'Sat', viewers: 3200 },
    { day: 'Sun', viewers: 2800 }
  ],
  donations: [
    { day: 'Mon', amount: 2.5 },
    { day: 'Tue', amount: 1.8 },
    { day: 'Wed', amount: 3.2 },
    { day: 'Thu', amount: 4.1 },
    { day: 'Fri', amount: 5.3 },
    { day: 'Sat', amount: 3.8 },
    { day: 'Sun', amount: 4.7 }
  ]
};

export default function StreamerDashboard() {
  const { connected, publicKey } = useWallet();
  const [activeTab, setActiveTab] = useState('overview');
  const [streams, setStreams] = useState<Stream[]>(mockStreams);
  const [analytics, setAnalytics] = useState(mockAnalytics);

  // In a real app, this would fetch data from an API
  useEffect(() => {
    // Simulate data loading
  }, []);

  const formatWalletAddress = (address: string) => {
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Streamer Dashboard</h1>
          <div className="wallet-info">
            {connected && publicKey ? (
              <div className="connected-wallet">
                <div className="wallet-address">{formatWalletAddress(publicKey.toString())}</div>
              </div>
            ) : (
              <WalletMultiButton />
            )}
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab ${activeTab === 'streams' ? 'active' : ''}`}
            onClick={() => setActiveTab('streams')}
          >
            My Streams
          </button>
          <button 
            className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
          <button 
            className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>

        <div className="dashboard-main">
          {activeTab === 'overview' && (
            <div className="overview-section">
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Total Viewers</h3>
                  <p className="stat-value">{analytics.totalViewers.toLocaleString()}</p>
                  <p className="stat-change">+12.4% from last week</p>
                </div>
                <div className="stat-card">
                  <h3>Earnings</h3>
                  <p className="stat-value">{analytics.totalEarnings} SOL</p>
                  <p className="stat-change">+8.2% from last week</p>
                </div>
                <div className="stat-card">
                  <h3>Total Streams</h3>
                  <p className="stat-value">{analytics.totalStreams}</p>
                  <p className="stat-change">+3 from last week</p>
                </div>
                <div className="stat-card">
                  <h3>Avg. Viewers</h3>
                  <p className="stat-value">{analytics.avgViewers.toLocaleString()}</p>
                  <p className="stat-change">+5% from last week</p>
                </div>
              </div>

              <div className="charts-section">
                <div className="chart-card">
                  <h3>Viewer Growth</h3>
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={analytics.viewerGrowth}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="day" stroke="var(--color-text-tertiary)" />
                        <YAxis stroke="var(--color-text-tertiary)" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'var(--color-background-secondary)', 
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--border-radius-md)'
                          }} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="viewers" 
                          stroke="var(--color-brand-primary)" 
                          fill="var(--color-brand-primary)" 
                          fillOpacity={0.2} 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="chart-card">
                  <h3>Donations (SOL)</h3>
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analytics.donations}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="day" stroke="var(--color-text-tertiary)" />
                        <YAxis stroke="var(--color-text-tertiary)" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'var(--color-background-secondary)', 
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--border-radius-md)'
                          }} 
                        />
                        <Bar dataKey="amount" fill="var(--color-brand-primary)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'streams' && (
            <div className="streams-section">
              <div className="section-header">
                <h2>My Streams</h2>
                <button className="create-stream-btn">
                  + Create Stream
                </button>
              </div>
              
              <div className="streams-grid">
                {streams.map((stream) => (
                  <div key={stream.id} className="stream-card">
                    <div className="stream-thumb">
                      <img 
                        src={`https://picsum.photos/seed/${stream.id}/400/225`} 
                        alt={stream.title} 
                      />
                      <div className="stream-status">
                        <span className={`status-badge ${stream.status.toLowerCase()}`}>
                          {stream.status}
                        </span>
                      </div>
                    </div>
                    <div className="stream-info">
                      <h3>{stream.title}</h3>
                      <div className="stream-meta">
                        <span>{stream.viewers.toLocaleString()} viewers</span>
                        <span>{stream.category}</span>
                      </div>
                      <div className="stream-actions">
                        <button className="action-btn">Edit</button>
                        <button className="action-btn">View</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="analytics-section">
              <div className="section-header">
                <h2>Analytics</h2>
              </div>
              
              <div className="analytics-content">
                <div className="analytics-metrics">
                  <div className="metric-card">
                    <h4>Top Countries</h4>
                    <div className="top-countries">
                      {analytics.topCountries.map((country, index) => (
                        <div key={index} className="country-item">
                          <span className="country-name">{country.name}</span>
                          <span className="country-percentage">{country.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="metric-card">
                    <h4>Engagement</h4>
                    <div className="engagement-metrics">
                      <div className="engagement-item">
                        <span className="label">Average Watch Time</span>
                        <span className="value">32 min</span>
                      </div>
                      <div className="engagement-item">
                        <span className="label">Chat Messages</span>
                        <span className="value">1,248</span>
                      </div>
                      <div className="engagement-item">
                        <span className="label">Donations</span>
                        <span className="value">42</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="audience-insights">
                  <h4>Audience Insights</h4>
                  <div className="insights-grid">
                    <div className="insight-card">
                      <h5>Peak Hours</h5>
                      <p>7 PM - 10 PM (GMT+0)</p>
                    </div>
                    <div className="insight-card">
                      <h5>Most Active Day</h5>
                      <p>Friday</p>
                    </div>
                    <div className="insight-card">
                      <h5>Top Donator</h5>
                      <p>0x45a...b2c</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Settings</h2>
              </div>
              
              <div className="settings-content">
                <div className="settings-form">
                  <div className="form-group">
                    <label htmlFor="stream-title">Stream Title</label>
                    <input 
                      id="stream-title" 
                      type="text" 
                      placeholder="Enter stream title"
                      className="input-field"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="stream-category">Category</label>
                    <select id="stream-category" className="input-field">
                      <option value="">Select a category</option>
                      <option value="GAMING">Gaming</option>
                      <option value="MUSIC">Music</option>
                      <option value="EDUCATION">Education</option>
                      <option value="LIFESTYLE">Lifestyle</option>
                      <option value="TECH">Technology</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="stream-description">Description</label>
                    <textarea 
                      id="stream-description" 
                      placeholder="Describe your stream"
                      rows={4}
                      className="input-field"
                    />
                  </div>
                  
                  <button className="save-settings-btn">
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .dashboard-page {
          background-color: var(--color-background-main);
          min-height: 100vh;
        }
        
        .dashboard-header {
          background: var(--color-background-tertiary);
          padding: var(--spacing-lg);
          border-bottom: 1px solid var(--color-border);
        }
        
        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .header-content h1 {
          margin: 0;
          color: var(--color-text-primary);
          font-size: var(--font-size-xl);
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .wallet-info {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }
        
        .connected-wallet {
          padding: var(--spacing-sm) var(--spacing-md);
          background: rgba(255, 255, 255, 0.05);
          border-radius: var(--border-radius-full);
          border: 1px solid var(--color-border);
        }
        
        .wallet-address {
          color: var(--color-text-primary);
          font-size: var(--font-size-sm);
        }
        
        .dashboard-tabs {
          display: flex;
          gap: var(--spacing-xs);
          padding: 0 var(--spacing-lg);
          background: var(--color-background-tertiary);
          border-bottom: 1px solid var(--color-border);
        }
        
        .tab {
          padding: var(--spacing-lg) var(--spacing-xl);
          background: transparent;
          border: none;
          color: var(--color-text-secondary);
          cursor: pointer;
          font-size: var(--font-size-md);
          font-weight: var(--font-weight-medium);
          transition: var(--transition-fast);
          border-bottom: 2px solid transparent;
        }
        
        .tab:hover {
          color: var(--color-text-primary);
        }
        
        .tab.active {
          color: var(--color-brand-primary);
          border-bottom: 2px solid var(--color-brand-primary);
        }
        
        .dashboard-main {
          max-width: 1400px;
          margin: var(--spacing-xl) auto;
          padding: 0 var(--spacing-lg);
        }
        
        .overview-section {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xl);
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: var(--spacing-lg);
        }
        
        .stat-card {
          background: var(--color-background-secondary);
          padding: var(--spacing-xl);
          border-radius: var(--border-radius-lg);
          border: 1px solid var(--color-border);
        }
        
        .stat-card h3 {
          margin: 0 0 var(--spacing-md) 0;
          color: var(--color-text-tertiary);
          font-size: var(--font-size-sm);
        }
        
        .stat-value {
          margin: 0 0 var(--spacing-xs) 0;
          color: var(--color-text-primary);
          font-size: var(--font-size-xxxl);
          font-weight: var(--font-weight-bold);
        }
        
        .stat-change {
          margin: 0;
          color: var(--color-success);
          font-size: var(--font-size-sm);
        }
        
        .charts-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-xl);
        }
        
        .chart-card {
          background: var(--color-background-secondary);
          padding: var(--spacing-xl);
          border-radius: var(--border-radius-lg);
          border: 1px solid var(--color-border);
        }
        
        .chart-card h3 {
          margin: 0 0 var(--spacing-lg) 0;
          color: var(--color-text-primary);
          font-size: var(--font-size-lg);
        }
        
        .chart-container {
          height: 300px;
        }
        
        .streams-section {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xl);
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-lg);
        }
        
        .section-header h2 {
          margin: 0;
          color: var(--color-text-primary);
          font-size: var(--font-size-xxl);
        }
        
        .create-stream-btn {
          background: var(--color-brand-primary);
          color: #000;
          border: none;
          padding: var(--spacing-md) var(--spacing-lg);
          border-radius: var(--border-radius-full);
          font-weight: var(--font-weight-bold);
          cursor: pointer;
          transition: var(--transition-fast);
        }
        
        .create-stream-btn:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        
        .streams-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: var(--spacing-xl);
        }
        
        .stream-card {
          background: var(--color-background-secondary);
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          border: 1px solid var(--color-border);
          transition: var(--transition-fast);
        }
        
        .stream-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }
        
        .stream-thumb {
          position: relative;
          width: 100%;
          height: 169px;
          overflow: hidden;
        }
        
        .stream-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .stream-status {
          position: absolute;
          top: var(--spacing-md);
          left: var(--spacing-md);
        }
        
        .status-badge {
          display: inline-block;
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--border-radius-full);
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-bold);
          text-transform: uppercase;
        }
        
        .status-badge.live {
          background: var(--color-error);
          color: white;
        }
        
        .status-badge.ended {
          background: var(--color-background-card);
          color: var(--color-text-tertiary);
        }
        
        .stream-info {
          padding: var(--spacing-lg);
        }
        
        .stream-info h3 {
          margin: 0 0 var(--spacing-sm) 0;
          color: var(--color-text-primary);
          font-size: var(--font-size-lg);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .stream-meta {
          display: flex;
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-md);
          color: var(--color-text-tertiary);
          font-size: var(--font-size-sm);
        }
        
        .stream-actions {
          display: flex;
          gap: var(--spacing-md);
        }
        
        .action-btn {
          flex: 1;
          padding: var(--spacing-sm);
          border-radius: var(--border-radius-md);
          border: 1px solid var(--color-border);
          background: transparent;
          color: var(--color-text-primary);
          cursor: pointer;
          transition: var(--transition-fast);
        }
        
        .action-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .analytics-section {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xl);
        }
        
        .analytics-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-xl);
        }
        
        .metric-card {
          background: var(--color-background-secondary);
          padding: var(--spacing-xl);
          border-radius: var(--border-radius-lg);
          border: 1px solid var(--color-border);
        }
        
        .metric-card h4 {
          margin: 0 0 var(--spacing-lg) 0;
          color: var(--color-text-primary);
          font-size: var(--font-size-lg);
        }
        
        .top-countries {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }
        
        .country-item {
          display: flex;
          justify-content: space-between;
          padding-bottom: var(--spacing-sm);
          border-bottom: 1px solid var(--color-border);
        }
        
        .country-name {
          color: var(--color-text-primary);
        }
        
        .country-percentage {
          color: var(--color-brand-primary);
          font-weight: var(--font-weight-bold);
        }
        
        .engagement-metrics {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }
        
        .engagement-item {
          display: flex;
          justify-content: space-between;
          padding-bottom: var(--spacing-sm);
          border-bottom: 1px solid var(--color-border);
        }
        
        .engagement-item .label {
          color: var(--color-text-secondary);
        }
        
        .engagement-item .value {
          color: var(--color-text-primary);
          font-weight: var(--font-weight-medium);
        }
        
        .audience-insights h4 {
          margin: 0 0 var(--spacing-lg) 0;
          color: var(--color-text-primary);
          font-size: var(--font-size-lg);
        }
        
        .insights-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--spacing-md);
        }
        
        .insight-card {
          background: var(--color-background-tertiary);
          padding: var(--spacing-lg);
          border-radius: var(--border-radius-md);
          border: 1px solid var(--color-border);
        }
        
        .insight-card h5 {
          margin: 0 0 var(--spacing-sm) 0;
          color: var(--color-text-tertiary);
          font-size: var(--font-size-sm);
        }
        
        .insight-card p {
          margin: 0;
          color: var(--color-text-primary);
          font-weight: var(--font-weight-medium);
        }
        
        .settings-section {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xl);
        }
        
        .settings-content {
          background: var(--color-background-secondary);
          padding: var(--spacing-xl);
          border-radius: var(--border-radius-lg);
          border: 1px solid var(--color-border);
        }
        
        .settings-form {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xl);
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }
        
        .form-group label {
          color: var(--color-text-secondary);
          font-size: var(--font-size-sm);
        }
        
        .input-field {
          padding: var(--spacing-md);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-md);
          color: var(--color-text-primary);
          font-family: var(--font-family-primary);
        }
        
        .save-settings-btn {
          background: var(--color-brand-primary);
          color: #000;
          border: none;
          padding: var(--spacing-md) var(--spacing-lg);
          border-radius: var(--border-radius-full);
          font-weight: var(--font-weight-bold);
          cursor: pointer;
          align-self: flex-start;
          transition: var(--transition-fast);
        }
        
        .save-settings-btn:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        
        @media (max-width: 1024px) {
          .charts-section {
            grid-template-columns: 1fr;
          }
          
          .analytics-content {
            grid-template-columns: 1fr;
          }
        }
        
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .header-content {
            flex-direction: column;
            gap: var(--spacing-lg);
          }
          
          .dashboard-tabs {
            overflow-x: auto;
          }
          
          .streams-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}