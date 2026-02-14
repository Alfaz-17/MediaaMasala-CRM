import React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string;
  size?: string;
}

export function Button({ 
  children, 
  variant,
  size,
  className = "",
  ...props 
}: ButtonProps) {
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
    cursor: "pointer",
    border: "1px solid transparent",
    padding: size === "sm" ? "0.25rem 0.75rem" : "0.5rem 1rem",
    height: size === "sm" ? "1.75rem" : "2.25rem",
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
      className={className}
      style={{
        ...baseStyle,
        ...variantStyles,
        ...widthStyle,
        ...props.style
      }} 
      {...props}
    >
      {children}
    </button>
  )
}

