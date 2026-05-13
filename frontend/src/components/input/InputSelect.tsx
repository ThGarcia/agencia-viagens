import "./Input.css";

type Option = {
    value: string;
    label: string;
};

type SelectInputProps = {
    label: string;
    value: string;
    options: Option[];
    onChange: (value: string) => void;
};

export default function SelectInput({
    label,
    value,
    options,
    onChange
}: SelectInputProps) {
    return (
        <div className="input-group">
            <select
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                required
            >
                <option value="" disabled>
                    Selecione
                </option>

                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>

            <label>{label}</label>
        </div>
    );
}
