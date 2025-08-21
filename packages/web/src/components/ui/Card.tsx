'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const Card = forwardRef(
  (
    {
      className,
      variant = 'default',
      padding = 'md',
      hover = false,
      animated = true,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = [
      'rounded-xl',
      'transition-all duration-200',
    ];

    const variantClasses = {
      default: [
        'bg-white border border-gray-200 shadow-sm',
      ],
      elevated: [
        'bg-white shadow-lg border border-gray-100',
      ],
      outlined: [
        'bg-white border-2 border-gray-200',
      ],
      glass: [
        'bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg',
      ],
    };

    const paddingClasses = {
      none: '',
      sm: 'p-3',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10',
    };

    const hoverClasses = hover ? [
      'hover:shadow-md hover:-translate-y-1',
      'cursor-pointer',
    ] : [];

    const classes = clsx(
      baseClasses,
      variantClasses[variant],
      paddingClasses[padding],
      hoverClasses,
      className
    );

    const CardComponent = (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );

    if (animated && hover) {
      return (
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          {CardComponent}
        </motion.div>
      );
    }

    return CardComponent;
  }
);

Card.displayName = 'Card';

export { Card };
