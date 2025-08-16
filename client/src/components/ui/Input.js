import React from 'react';

const Input = React.forwardRef(({ 
  className = '', 
  type = 'text',
  size = 'default',
  error,
  success,
  icon,
  iconPosition = 'left',
  glass = true,
  ...props 
}, ref) => {
  const baseClasses = 'w-full transition-all duration-300 focus-ring disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizes = {
    sm: 'px-3 py-2 text-sm rounded-lg',
    default: 'px-4 py-3 rounded-xl',
    lg: 'px-6 py-4 text-lg rounded-xl'
  };

  const states = {
    default: glass 
      ? 'liquid-glass-input placeholder:text-black/60' 
      : 'border-2 border-white/20 bg-white/10 text-black placeholder:text-black/60 focus:border-white/40 focus:ring-4 focus:ring-white/20 font-medium',
    error: glass 
      ? 'liquid-glass-input text-red-800 border-red-800/50 placeholder:text-red-800/60 focus:ring-2 focus:ring-red-800/50' 
      : 'border-2 border-red-800/50 bg-red-500/10 text-red-800 focus:border-red-800 focus:ring-4 focus:ring-red-800/20 font-medium',
    success: glass 
      ? 'liquid-glass-input text-green-800 border-green-800/50 placeholder:text-green-800/60 focus:ring-2 focus:ring-green-800/50' 
      : 'border-2 border-green-800/50 bg-green-500/10 text-green-800 focus:border-green-800 focus:ring-4 focus:ring-green-800/20 font-medium'
  };

  const stateClass = error ? states.error : success ? states.success : states.default;
  const classes = `${baseClasses} ${sizes[size]} ${stateClass} ${className}`;

  const inputElement = (
    <input
      type={type}
      className={classes}
      ref={ref}
      {...props}
    />
  );

  if (icon) {
    return (
      <div className="relative">
        {iconPosition === 'left' && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black/60">
            {icon}
          </div>
        )}
        {React.cloneElement(inputElement, {
          className: `${classes} ${iconPosition === 'left' ? 'pl-12' : 'pr-12'}`
        })}
        {iconPosition === 'right' && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black/60">
            {icon}
          </div>
        )}
      </div>
    );
  }

  return inputElement;
});

Input.displayName = 'Input';

export { Input };
