import "./Input.css";

type InputProps = {
  label: string;
  value?: string | number;
  type?: string; 
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Input({ label, value, type = "text", onChange }: InputProps) {
  return (
    <div className="input-group">
      <input
        type={type}
        placeholder=" "
        value={value || ""}
        onChange={onChange}
        required
      />
      <label>{label}</label>
    </div>
  );
}
