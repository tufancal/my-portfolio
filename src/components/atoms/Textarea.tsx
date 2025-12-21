import type { TextareaHTMLAttributes } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export default function Textarea({
  label,
  error,
  helperText,
  className = "",
  id,
  ...props
}: TextareaProps) {
  const textareaId = id || props.name;

  return (
    <div className="form-control grid">
      {label && (
        <label className="label" htmlFor={textareaId}>
          <span className="label-text">{label}</span>
        </label>
      )}
      <textarea
        id={textareaId}
        className={`textarea textarea-bordered w-full ${error ? "textarea-error" : ""} ${className}`}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={
          error
            ? `${textareaId}-error`
            : helperText
              ? `${textareaId}-helper`
              : undefined
        }
        {...props}
      />
      {error && (
        <label className="label">
          <span
            className="label-text-alt text-error"
            id={`${textareaId}-error`}
          >
            {error}
          </span>
        </label>
      )}
      {helperText && !error && (
        <label className="label">
          <span className="label-text-alt" id={`${textareaId}-helper`}>
            {helperText}
          </span>
        </label>
      )}
    </div>
  );
}
