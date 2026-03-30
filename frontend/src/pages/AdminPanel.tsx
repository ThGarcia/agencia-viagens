import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/auth";

export default function AdminPanel() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin");
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Painel Admin</h1>

      <div style={{ marginTop: 20 }}>
        <Link to="/admin/viagens">
          <button>✈️ Gerenciar Viagens</button>
        </Link>

        <Link to="/admin/contratos">
          <button>📄 Gerenciar Contratos</button>
        </Link>

        <Link to="/admin/homming">
          <button>📋 Homming List</button>
        </Link>
      </div>

      <button onClick={handleLogout} style={{ marginTop: 20 }}>
        Sair
      </button>
    </div>
  );
}
