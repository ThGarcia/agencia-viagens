import "./Input.css";

type InputProps = {
  label: string;
  value?: string | number | null;
  type?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validator?: (value: string) => boolean;
};

export default function Input({
  label,
  value,
  type = "text",
  onChange,
  validator
}: InputProps) {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    if (validator) {
      validator(e.target.value);
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
    </div>
  );
}
