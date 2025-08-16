import React from 'react';
import Image from 'next/image';

const Card = React.forwardRef(({ 
  className = '', 
  variant = 'default',
  children, 
  ...props 
}, ref) => {
  const baseClasses = 'transition-all duration-300';
  
  const variants = {
    default: 'liquid-glass-card',
    elevated: 'liquid-glass shadow-lg hover:shadow-xl border border-white/30 rounded-2xl',
    outlined: 'liquid-glass border-2 border-white/40 hover:border-white/60 rounded-2xl',
    ghost: 'bg-transparent hover:bg-white/10 rounded-2xl',
    gradient: 'liquid-glass bg-gradient-to-br from-white/15 to-white/5 border border-white/30 rounded-2xl shadow-md hover:shadow-lg',
    glass: 'liquid-glass rounded-2xl shadow-lg hover:shadow-xl',
    dark: 'liquid-glass text-black border border-white/30 rounded-2xl shadow-lg hover:shadow-xl',
    premium: 'liquid-glass bg-gradient-to-br from-indigo-500/25 to-purple-500/25 border border-indigo-300/40 rounded-2xl shadow-md hover:shadow-lg'
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
    default: 'text-xl font-semibold text-black mb-2',
    gradient: 'text-xl font-semibold bg-gradient-to-r from-black to-black bg-clip-text text-transparent mb-2',
    large: 'text-2xl font-bold text-black mb-3',
    small: 'text-lg font-medium text-black mb-2'
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
      className={`text-black/80 leading-relaxed ${className}`}
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
    default: 'liquid-glass text-black font-semibold',
    success: 'liquid-glass text-green-800 border-green-800/40 font-semibold',
    warning: 'liquid-glass text-yellow-800 border-yellow-800/40 font-semibold',
    error: 'liquid-glass text-red-800 border-red-800/40 font-semibold',
    gradient: 'liquid-glass bg-gradient-to-r from-indigo-500/80 to-purple-500/80 text-black font-semibold'
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
      <Image
        src={src}
        alt={alt}
        width={400}
        height={300}
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
