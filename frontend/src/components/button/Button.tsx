import "./Button.css";

type ButtonProps = {
  text: string;
  type?: "button" | "submit";
  onClick?: () => void;
  bgColor?: string;
  color?: string;
  active?: boolean;
};

export default function Button({ text, bgColor, color, type="button", active=false, onClick }: ButtonProps) {
  return (
    <div className="button-group">
      <button
        type={type}
        onClick={onClick}
        style={{ backgroundColor: bgColor, color: color, active:active }}
      >
      {text}
      </button>
    </div>
  );
}
