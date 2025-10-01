'use client';

import { useState } from 'react';
import {
  SearchIcon,
  UploadIcon,
  SubscribeIcon,
  MicrophoneIcon,
  UserIcon,
} from './icons';
import WalletConnection from './wallet-connection-wrapper';

const CATEGORIES = ['GAMING', 'IRL', 'MUSIC', 'CREATIVE', 'SPORTS'];

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');

  const toggleMobileMenu = () => {
    // Find the sidebar element and toggle its open state
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      const isOpen = sidebar.classList.contains('sidebar--open');
      sidebar.classList.toggle('sidebar--closed', isOpen);
      sidebar.classList.toggle('sidebar--open', !isOpen);
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <nav className="category-nav">
            <ul className="category-list">
              {CATEGORIES.map((category) => (
                <li key={category} className="category-item">
                  <a
                    href="#"
                    className={`category-link ${category === 'GAMING' ? 'category-link--active' : ''}`}
                  >
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="header-center">
          <div className="search-container">
            <div className="search-wrapper">
              <SearchIcon className="search-icon" />
              <input
                type="text"
                placeholder="Search streams, creators, games..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="header-right">
          <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 12H21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M3 6H21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M3 18H21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <div className="header-actions">
            <button className="mic-btn">
              <MicrophoneIcon />
            </button>
            <button className="upload-btn">
              <UploadIcon />
              <span>Upload</span>
            </button>
            <WalletConnection />
          </div>
        </div>
      </div>

      <style jsx>{`
        .header {
          background: rgba(15, 15, 25, 0.8);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding: var(--spacing-md) var(--spacing-lg);
          position: sticky;
          top: 0;
          z-index: var(--z-sticky);
          transition: var(--transition-normal);
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto;
          gap: 2.5rem; /* Tambah gap antar bagian utama */
        }

        .header-left {
          flex: 1;
          min-width: 0;
        }

        .header-center {
          flex: 2;
          min-width: 0;
          display: flex;
          justify-content: center;
          padding: 0 1.5rem; /* Tambah padding kiri-kanan agar tidak terlalu mepet */
        }

        .header-right {
          flex: 1;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          min-width: 0;
        }

        @media (min-width: 769px) {
          .header-content {
            padding-left: 100px; /* Account for sidebar width */
          }
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          color: var(--color-text-primary);
          cursor: pointer;
          padding: var(--spacing-sm);
          border-radius: var(--border-radius-full);
          transition: var(--transition-fast);
        }

        .mobile-menu-btn:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: flex;
            margin-right: var(--spacing-md);
          }

          .category-nav,
          .header-actions {
            display: none;
          }

          .header-center {
            flex: 1;
          }

          .search-container {
            margin: 0;
            max-width: 100%;
          }
        }

        .category-nav {
          display: flex;
          align-items: center;
        }

        .category-list {
          display: flex;
          list-style: none;
          padding: 0;
          margin: 0;
          gap: 1.5rem; /* Tambah jarak antar kategori */
        }

        .category-item {
          padding: 0;
          margin: 0;
        }

        .category-link {
          text-decoration: none;
          color: var(--color-text-secondary);
          font-size: var(--font-size-md);
          font-weight: var(--font-weight-medium);
          transition: var(--transition-fast);
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--border-radius-full);
          position: relative;
          white-space: nowrap;
        }

        .category-link:hover {
          color: var(--color-text-primary);
          background-color: rgba(255, 255, 255, 0.05);
        }

        .category-link--active {
          color: var(--color-brand-primary);
        }

        .category-link--active::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--color-brand-primary);
          border-radius: var(--border-radius-full);
        }

        .search-container {
          width: 100%;
          max-width: 520px;
          position: relative;
          padding: 0 0.5rem; /* Tambah padding agar tidak terlalu mepet */
        }

        .search-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          border-radius: var(--border-radius-md); /* Tambahkan ini */
          overflow: hidden; /* Agar sudut input rapi */
        }

        .search-icon {
          position: absolute;
          left: var(--spacing-lg);
          color: var(--color-text-tertiary);
          z-index: 2;
          transition: var(--transition-fast);
        }

        .search-input {
          width: 100%;
          padding: var(--spacing-lg) var(--spacing-lg) var(--spacing-lg)
            calc(var(--spacing-lg) * 2.5);
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--border-radius-md); /* Ubah dari full ke md */
          color: var(--color-text-primary);
          font-size: var(--font-size-md);
          outline: none;
          transition: var(--transition-normal);
          box-shadow: var(--shadow-sm);
          z-index: 1;
        }

        .search-input:focus {
          border-color: var(--color-brand-primary);
          outline: none;
          box-shadow:
            0 0 0 3px rgba(255, 215, 0, 0.2),
            var(--shadow-md);
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-2px);
        }

        .search-input:focus + .search-icon {
          color: var(--color-brand-primary);
        }

        .header-actions {
          display: flex;
          gap: 1.25rem; /* Tambah jarak antar tombol aksi */
          align-items: center;
        }

        .mic-btn,
        .upload-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-md);
          border-radius: var(--border-radius-full);
          font-size: var(--font-size-md);
          font-weight: var(--font-weight-semibold);
          cursor: pointer;
          transition: var(--transition-normal);
          border: 1px solid transparent;
        }

        .mic-btn {
          background: rgba(255, 255, 255, 0.05);
          color: var(--color-text-primary);
          border: 1px solid var(--color-border);
        }

        .mic-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--color-brand-primary);
        }

        .upload-btn {
          background: var(--color-brand-primary);
          color: #000;
          border: none;
        }

        .upload-btn:hover {
          background: #e6c200;
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .upload-btn:active {
          transform: translateY(0);
        }
      `}</style>
    </header>
  );
}