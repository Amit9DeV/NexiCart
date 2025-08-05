import React from 'react';

const Card = React.forwardRef(({ 
  className = '', 
  variant = 'default',
  children, 
  ...props 
}, ref) => {
  const baseClasses = 'transition-all duration-300';
  
  const variants = {
    default: 'card-modern',
    elevated: 'bg-white shadow-lg hover:shadow-xl border border-gray-100 rounded-2xl',
    outlined: 'bg-white border-2 border-gray-200 hover:border-indigo-300 rounded-2xl',
    ghost: 'bg-transparent hover:bg-gray-50 rounded-2xl',
    gradient: 'bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-2xl shadow-md hover:shadow-lg',
    glass: 'bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg hover:shadow-xl',
    dark: 'bg-gray-900 text-white border border-gray-800 rounded-2xl shadow-lg hover:shadow-xl',
    premium: 'bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl shadow-md hover:shadow-lg'
  };

  const classes = `${baseClasses} ${variants[variant]} ${className}`;

  return (
    <div
      ref={ref}
      className={classes}
      {...props}
    >
      {children}
    </div>
  );
});

const CardHeader = React.forwardRef(({ 
  className = '', 
  children, 
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={`p-6 pb-0 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

const CardTitle = React.forwardRef(({ 
  className = '', 
  children, 
  variant = 'default',
  ...props 
}, ref) => {
  const titleVariants = {
    default: 'text-xl font-semibold text-gray-900 mb-2',
    gradient: 'text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2',
    large: 'text-2xl font-bold text-gray-900 mb-3',
    small: 'text-lg font-medium text-gray-900 mb-2'
  };

  return (
    <h3
      ref={ref}
      className={`${titleVariants[variant]} ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
});

const CardDescription = React.forwardRef(({ 
  className = '', 
  children, 
  ...props 
}, ref) => {
  return (
    <p
      ref={ref}
      className={`text-gray-600 leading-relaxed ${className}`}
      {...props}
    >
      {children}
    </p>
  );
});

const CardContent = React.forwardRef(({ 
  className = '', 
  children, 
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={`p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

const CardFooter = React.forwardRef(({ 
  className = '', 
  children, 
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={`p-6 pt-0 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

const CardBadge = React.forwardRef(({ 
  className = '', 
  children, 
  variant = 'default',
  ...props 
}, ref) => {
  const badgeVariants = {
    default: 'bg-indigo-100 text-indigo-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    gradient: 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
  };

  return (
    <span
      ref={ref}
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${badgeVariants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
});

const CardImage = React.forwardRef(({ 
  className = '', 
  src, 
  alt, 
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={`relative overflow-hidden rounded-t-2xl ${className}`}
      {...props}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
      />
    </div>
  );
});

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardTitle.displayName = 'CardTitle';
CardDescription.displayName = 'CardDescription';
CardContent.displayName = 'CardContent';
CardFooter.displayName = 'CardFooter';
CardBadge.displayName = 'CardBadge';
CardImage.displayName = 'CardImage';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardBadge, CardImage };
