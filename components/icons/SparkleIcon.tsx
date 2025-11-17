
import React from 'react';

const SparkleIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 3L9.25 8.75L3.5 10.5L9.25 12.25L12 18L14.75 12.25L20.5 10.5L14.75 8.75L12 3Z" />
    <path d="M4 4L5 6" />
    <path d="M19 19L20 21" />
    <path d="M2 12H4" />
    <path d="M20 12H22" />
    <path d="M5 18L4 20" />
    <path d="M20 4L19 6" />
  </svg>
);

export default SparkleIcon;
