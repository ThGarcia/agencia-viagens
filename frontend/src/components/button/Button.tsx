import "./Button.css";

type ButtonProps = {
  text: string;
  type?: "button" | "submit";
  onClick?: () => void;
  bgColor?: string;
  color?: string;
  active?: boolean;
  activeColor?: string;
};

export default function Button({
  text,
  bgColor,
  color,
  type = "button",
  onClick,
  active = false,
  activeColor,
}: ButtonProps) {
  const backgroundColor = active ? activeColor || bgColor : bgColor;
  const textColor = active ? "#fff" : color;

  return (
    <div className="button-group">
      <button
        type={type}
        onClick={onClick}
        style={{ backgroundColor, color: textColor }}
      >
      {text}
      </button>
    </div>
  );
}
