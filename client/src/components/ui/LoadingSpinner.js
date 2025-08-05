import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'default', color = 'indigo', text = 'Loading...' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    default: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colors = {
    indigo: 'border-indigo-500',
    purple: 'border-purple-500',
    blue: 'border-blue-500',
    green: 'border-green-500',
    red: 'border-red-500',
    yellow: 'border-yellow-500'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        className={`${sizes[size]} border-2 border-gray-200 border-t-${color} rounded-full animate-spin`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-600 font-medium"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

// Modern skeleton loader
const Skeleton = ({ className = '', lines = 1, height = 'h-4' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`${height} bg-gray-200 rounded-lg mb-2 ${index === lines - 1 ? 'w-3/4' : ''}`}
        />
      ))}
    </div>
  );
};

// Modern card skeleton
const CardSkeleton = () => {
  return (
    <div className="card-modern p-6">
      <div className="animate-pulse">
        <div className="w-full h-48 bg-gray-200 rounded-xl mb-4" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
    </div>
  );
};

// Modern button skeleton
const ButtonSkeleton = ({ size = 'default' }) => {
  const sizes = {
    sm: 'h-8 w-20',
    default: 'h-10 w-24',
    lg: 'h-12 w-32',
    xl: 'h-14 w-40'
  };

  return (
    <div className={`${sizes[size]} bg-gray-200 rounded-xl animate-pulse`} />
  );
};

export { LoadingSpinner, Skeleton, CardSkeleton, ButtonSkeleton }; 