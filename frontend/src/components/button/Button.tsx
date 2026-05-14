import "./Button.css";

type ButtonProps = {
  text: string;
  type?: "button" | "submit";
  onClick?: () => void;
};

export default function Button({ text, type = "button", onClick }: ButtonProps) {
  return (
    <div className="button-group">
      <button
        type={type}
        onClick={onClick}
      >
      {text}
      </button>
    </div>
  );
}
