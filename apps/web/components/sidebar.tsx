'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { HomeIcon, TrendingIcon } from './icons';

type SidebarItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
};

const SIDEBAR_ITEMS: SidebarItem[] = [
  { name: 'HOME', href: '/', icon: <HomeIcon /> },
  { name: 'TRENDING', href: '/trending', icon: <TrendingIcon /> },
  { name: 'SUBSCRIPTIONS', href: '/subscriptions', icon: <TrendingIcon /> },
  { name: 'COMMUNITY', href: '/community', icon: <TrendingIcon /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Check if we're on mobile screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 769);
      if (window.innerWidth >= 769) {
        setIsSidebarOpen(false); // Close sidebar on desktop
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Handle click outside to close mobile sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar');
      const mobileMenuButton = document.querySelector('.mobile-menu-btn');

      if (
        isMobile &&
        isSidebarOpen &&
        sidebar &&
        mobileMenuButton &&
        !sidebar.contains(event.target as Node) &&
        !(event.target as Element).classList.contains('mobile-menu-btn') &&
        !mobileMenuButton.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile, isSidebarOpen]);

  return (
    <>
      {/* Sidebar overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        id="sidebar"
        className={`sidebar ${isMobile ? (isSidebarOpen ? 'sidebar--open' : 'sidebar--closed') : ''}`}
      >
        <div className="logo-container">
          <Link href="/" className="logo-link">
            <div className="logo-gradient">
              <span className="logo-text">STROOMP</span>
            </div>
          </Link>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-list">
            {SIDEBAR_ITEMS.map((item) => (
              <li key={item.href} className="nav-item">
                <Link
                  href={item.href}
                  className={`nav-link ${pathname === item.href ? 'nav-link--active' : ''}`}
                  onClick={() => isMobile && setIsSidebarOpen(false)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">JD</div>
            <span className="user-name">JohnDoe</span>
          </div>
        </div>

        <style jsx>{`
          .sidebar {
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            width: 100px; /* Ubah dari 80px ke 100px */
            background-color: var(--color-background-secondary);
            display: flex;
            flex-direction: column;
            z-index: var(--z-fixed);
            padding: var(--spacing-lg) 0;
            transition: var(--transition-normal);
            box-shadow: var(--shadow-md);
            overflow: hidden;
            max-width: 100vw;
          }

          .sidebar--closed {
            transform: translateX(-100%);
          }

          .sidebar--open {
            transform: translateX(0);
            width: 320px; /* Ubah dari 280px ke 320px */
            overflow: hidden;
            max-width: 100vw;
          }

          .sidebar--open .nav-text {
            display: block;
            font-size: var(--font-size-lg);
            margin-left: var(--spacing-md);
          }

          .sidebar--open .nav-icon {
            margin-right: var(--spacing-md);
            margin-bottom: 0;
          }

          .sidebar--open .nav-link {
            flex-direction: row;
            justify-content: flex-start;
            padding: var(--spacing-md) var(--spacing-lg);
          }

          .logo-container {
            display: flex;
            justify-content: center;
            margin-bottom: var(--spacing-xl);
            padding: 0 var(--spacing-md);
          }

          .sidebar--open .logo-container {
            justify-content: flex-start;
            padding-left: var(--spacing-lg);
          }

          .logo-link {
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
          }

          .sidebar--open .logo-link {
            justify-content: flex-start;
          }

          .logo-gradient {
            background: var(--gradient-primary);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            padding: var(--spacing-xs) var(--spacing-sm);
            border-radius: var(--border-radius-md);
          }

          .logo-text {
            font-size: var(--font-size-xxxl);
            font-weight: var(--font-weight-bold);
            background: var(--gradient-primary);
          }

          .sidebar-nav {
            flex: 1;
          }

          .nav-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .nav-item {
            margin-bottom: var(--spacing-sm);
          }

          .nav-link {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: var(--spacing-lg) var(--spacing-sm);
            text-decoration: none;
            transition: var(--transition-normal);
            border-radius: var(--border-radius-lg);
            color: var(--color-text-secondary);
            position: relative;
            overflow: hidden;
          }

          .nav-link::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 3px;
            height: 100%;
            background: var(--gradient-primary);
            transform: scaleY(0);
            transition: var(--transition-normal);
            border-radius: var(--border-radius-full);
          }

          .nav-link:hover {
            background: rgba(255, 255, 255, 0.05);
            color: var(--color-text-primary);
          }

          .nav-link:hover::before {
            transform: scaleY(1);
          }

          .nav-link--active {
            background: rgba(255, 215, 0, 0.1);
            color: var(--color-brand-primary);
          }

          .nav-link--active::before {
            transform: scaleY(1);
            background: var(--gradient-primary);
          }

          .nav-icon {
            margin-bottom: var(--spacing-xs);
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .nav-text {
            font-size: var(--font-size-xs);
            font-weight: var(--font-weight-medium);
            text-transform: uppercase;
            display: none; /* Hidden by default, shown on mobile sidebar open */
          }

          .sidebar-footer {
            padding: var(--spacing-lg) var(--spacing-md);
            border-top: 1px solid rgba(255, 255, 255, 0.08);
          }

          .user-profile {
            display: flex;
            align-items: center;
            gap: var(--spacing-md);
            padding: var(--spacing-sm);
          }

          .sidebar--open .user-profile {
            padding-left: var(--spacing-sm);
          }

          .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: var(--border-radius-full);
            background: var(--gradient-secondary);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: var(--font-weight-semibold);
            font-size: var(--font-size-sm);
          }

          .user-name {
            display: none;
            font-weight: var(--font-weight-medium);
            color: var(--color-text-primary);
          }

          .sidebar--open .user-name {
            display: block;
          }

          .sidebar-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: var(--color-overlay);
            z-index: var(--z-overlay);
            display: block;
            backdrop-filter: blur(4px);
          }

          @media (min-width: 769px) {
            .sidebar {
              transform: translateX(0) !important;
            }

            .sidebar-overlay {
              display: none;
            }

            .nav-text {
              display: block;
              font-size: var(--font-size-lg);
              margin-left: var(--spacing-md);
            }

            .nav-icon {
              margin-right: var(--spacing-md);
              margin-bottom: 0;
            }

            .nav-link {
              flex-direction: row;
              justify-content: flex-start;
              padding: var(--spacing-md) var(--spacing-lg);
            }

            .logo-container {
              justify-content: flex-start;
              padding-left: var(--spacing-lg);
            }

            .logo-link {
              justify-content: flex-start;
            }

            .user-name {
              display: block;
            }
          }
        `}</style>
      </aside>
    </>
  );
}
