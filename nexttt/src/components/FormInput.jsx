"use client"

import { forwardRef } from "react"

const FormInput = forwardRef(({ label, error, type = "text", className = "", ...props }, ref) => {
  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <input
        ref={ref}
        type={type}
        className={`form-input ${error ? "border-red-500 focus:ring-red-500" : ""} ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
})

FormInput.displayName = "FormInput"

export default FormInput
