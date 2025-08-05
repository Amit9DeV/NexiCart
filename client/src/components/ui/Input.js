import React from 'react';

const Input = React.forwardRef(({ 
  className = '', 
  type = 'text',
  size = 'default',
  error,
  success,
  icon,
  iconPosition = 'left',
  ...props 
}, ref) => {
  const baseClasses = 'w-full transition-all duration-200 focus-ring disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizes = {
    sm: 'px-3 py-2 text-sm rounded-lg',
    default: 'px-4 py-3 rounded-xl',
    lg: 'px-6 py-4 text-lg rounded-xl'
  };

  const states = {
    default: 'border-2 border-gray-200 bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10',
    error: 'border-2 border-red-500 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10',
    success: 'border-2 border-green-500 bg-green-50 focus:border-green-500 focus:ring-4 focus:ring-green-500/10'
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
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        {React.cloneElement(inputElement, {
          className: `${classes} ${iconPosition === 'left' ? 'pl-12' : 'pr-12'}`
        })}
        {iconPosition === 'right' && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
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
