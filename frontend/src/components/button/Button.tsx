import "./Button.css";

type ButtonProps = {
  text: string;
  type?: "button" | "submit";
  onClick?: () => void;
  bgColor?: string;
  color?: string;
};

export default function Button({ text, bgColor, color, type="button", onClick }: ButtonProps) {
  return (
    <div className="button-group">
      <button
        type={type}
        onClick={onClick}
        style={{ backgroundColor: bgColor, color: color }}
      >
      {text}
      </button>
    </div>
  );
}
