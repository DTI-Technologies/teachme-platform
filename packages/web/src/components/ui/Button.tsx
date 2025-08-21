'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const Button = forwardRef(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      animated = true,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = [
      'inline-flex items-center justify-center font-medium rounded-lg',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'transition-all duration-200',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      fullWidth && 'w-full',
    ];

    const variantClasses = {
      primary: [
        'bg-primary-500 text-white shadow-sm',
        'hover:bg-primary-600 focus:ring-primary-500',
        'disabled:hover:bg-primary-500',
      ],
      secondary: [
        'bg-secondary-500 text-white shadow-sm',
        'hover:bg-secondary-600 focus:ring-secondary-500',
        'disabled:hover:bg-secondary-500',
      ],
      outline: [
        'border border-primary-500 text-primary-500 bg-transparent',
        'hover:bg-primary-500 hover:text-white focus:ring-primary-500',
        'disabled:hover:bg-transparent disabled:hover:text-primary-500',
      ],
      ghost: [
        'text-gray-700 bg-transparent',
        'hover:bg-gray-100 focus:ring-gray-500',
        'disabled:hover:bg-transparent',
      ],
      danger: [
        'bg-red-500 text-white shadow-sm',
        'hover:bg-red-600 focus:ring-red-500',
        'disabled:hover:bg-red-500',
      ],
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
      xl: 'px-8 py-4 text-lg',
    };

    const classes = clsx(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className
    );

    const ButtonComponent = (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="mr-2">
            <div className="spinner"></div>
          </div>
        )}
        {children}
      </button>
    );

    if (animated && !disabled && !loading) {
      return (
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={fullWidth ? 'w-full' : 'inline-block'}
        >
          {ButtonComponent}
        </motion.div>
      );
    }

    return ButtonComponent;
  }
);

Button.displayName = 'Button';

export { Button };
