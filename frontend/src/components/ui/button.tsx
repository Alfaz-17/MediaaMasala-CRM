import React from "react"

import { Loader2 } from "lucide-react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string;
  size?: string;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ 
  children, 
  variant,
  size,
  className = "",
  loading = false,
  disabled,
  ...props 
}, ref) => {
  const isOutline = variant === "outline"
  const isGhost = variant === "ghost"
  const isSecondary = variant === "secondary"
  const isLink = variant === "link"

  // Base styles that were previously hardcoded or messed up
  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "0.5rem",
    fontSize: "0.75rem",
    fontWeight: 600,
    transition: "all 0.2s",
    cursor: (disabled || loading) ? "not-allowed" : "pointer",
    border: "1px solid transparent",
    padding: size === "sm" ? "0.25rem 0.75rem" : "0.5rem 1rem",
    height: size === "sm" ? "1.75rem" : "2.25rem",
    opacity: (disabled || loading) ? 0.7 : 1,
  }

  const variantStyles: React.CSSProperties = {
    background: isOutline || isGhost || isLink ? "transparent" : (isSecondary ? "var(--secondary)" : "#000"),
    color: isOutline || isGhost ? "inherit" : (isLink ? "var(--primary)" : "#fff"),
    borderColor: isOutline ? "rgba(0,0,0,0.1)" : "transparent",
    textDecoration: isLink ? "underline" : "none",
  }

  // Handle width full if requested in className
  const widthStyle = className.includes("w-full") ? { width: "100%" } : {}

  return (
    <button 
      ref={ref}
      className={className}
      disabled={disabled || loading}
      style={{
        ...baseStyle,
        ...variantStyles,
        ...widthStyle,
        ...props.style
      }} 
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
})
Button.displayName = "Button"

