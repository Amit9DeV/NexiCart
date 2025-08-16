import React from 'react';
import { motion } from 'framer-motion';

const Button = React.forwardRef(({ 
  children, 
  className = '', 
  variant = 'default', 
  size = 'default', 
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  glass = true,
  ...props 
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus-ring disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    default: glass ? 'btn-sophisticated btn-sophisticated-primary' : 'btn-sophisticated btn-sophisticated-primary',
    secondary: glass ? 'btn-sophisticated btn-sophisticated-secondary' : 'btn-sophisticated btn-sophisticated-secondary',
    outline: glass ? 'btn-sophisticated btn-sophisticated-secondary' : 'btn-sophisticated btn-sophisticated-secondary',
    ghost: 'btn-sophisticated btn-sophisticated-secondary',
    destructive: glass ? 'btn-sophisticated btn-sophisticated-danger' : 'btn-sophisticated btn-sophisticated-danger',
    success: glass ? 'btn-sophisticated btn-sophisticated-success' : 'btn-sophisticated btn-sophisticated-success',
    warning: glass ? 'btn-sophisticated btn-sophisticated-warning' : 'btn-sophisticated btn-sophisticated-warning'
  };
  
  const sizes = {
    sm: 'btn-sophisticated-sm',
    default: '',
    lg: 'btn-sophisticated-lg',
    xl: 'btn-sophisticated-xl'
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <motion.button
      ref={ref}
      className={classes}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.02, y: -2 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      {...props}
    >
      {loading ? (
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2" />
          Loading...
        </div>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className="mr-2">{icon}</span>
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <span className="ml-2">{icon}</span>
          )}
        </>
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';

export { Button };
