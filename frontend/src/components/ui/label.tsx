import React from "react"

export function Label({ 
  children, 
  className, 
  ...props 
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={className} style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }} {...props}>{children}</label>
}
