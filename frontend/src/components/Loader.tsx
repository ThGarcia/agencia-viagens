import "../styles/Loader.css";

export default function Loader() {
  return (
    <div className="loader-container">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="loader-card">
          <div className="loader-title"></div>
          <div className="loader-line"></div>
          <div className="loader-line short"></div>
        </div>
      ))}
    </div>
  );
}
