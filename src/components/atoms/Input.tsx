import type { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export default function Input({
  label,
  error,
  helperText,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id || props.name;

  return (
    <div className="form-control">
      {label && (
        <label className="label" htmlFor={inputId}>
          <span className="label-text">{label}</span>
        </label>
      )}
      <input
        id={inputId}
        className={`input input-bordered w-full ${error ? "input-error" : ""} ${className}`}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={
          error
            ? `${inputId}-error`
            : helperText
              ? `${inputId}-helper`
              : undefined
        }
        {...props}
      />
      {error && (
        <label className="label">
          <span className="label-text-alt text-error" id={`${inputId}-error`}>
            {error}
          </span>
        </label>
      )}
      {helperText && !error && (
        <label className="label">
          <span className="label-text-alt" id={`${inputId}-helper`}>
            {helperText}
          </span>
        </label>
      )}
    </div>
  );
}
