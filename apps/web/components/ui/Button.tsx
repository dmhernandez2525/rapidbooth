import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  href,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-sans font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary:
      "bg-harvest-gold text-forest-green-900 hover:bg-harvest-gold-600 focus:ring-harvest-gold-400 shadow-md hover:shadow-lg",
    secondary:
      "bg-forest-green text-white hover:bg-forest-green-800 focus:ring-forest-green-400 shadow-md hover:shadow-lg",
    outline:
      "border-2 border-forest-green text-forest-green hover:bg-forest-green hover:text-white focus:ring-forest-green-400",
    ghost:
      "text-forest-green hover:bg-forest-green-50 focus:ring-forest-green-200",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
