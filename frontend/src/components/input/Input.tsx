import { useState } from "react";
import "./Input.css";

type InputProps = {
  label: string;
  value?: string | number | null;
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validator?: (value: string) => boolean;
  errorMessage?: string;
};

export default function Input({
  label,
  value,
  type = "text",
  onChange,
  validator,
  errorMessage = "Campo invalido"
}: InputProps) {
  const [hasError, setHasError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    if (validator) {
      setHasError(e.target.value.trim() !== "" && !validator(e.target.value));
    }

    onChange?.(e);
  };

  return (
    <div className="input-group">
      <input
        type={type}
        placeholder=" "
        value={value ?? ""}
        onChange={handleChange}
        readOnly={!onChange}
        required
      />

      <label>{label}</label>
      {hasError && <span className="input-error">⚠️ {errorMessage}</span>}
    </div>
  );
}
