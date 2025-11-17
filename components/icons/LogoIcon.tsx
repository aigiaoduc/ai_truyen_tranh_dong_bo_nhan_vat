import React from 'react';

const LogoIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#818cf8', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#a855f7', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" stroke="url(#grad1)" />
    <polyline points="14 2 14 8 20 8" stroke="url(#grad1)" />
    <path d="M9 12h2" stroke="url(#grad1)" />
    <path d="M9 16h6" stroke="url(#grad1)" />
  </svg>
);

export default LogoIcon;