import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/auth";

import Button from "../components/button/Button";

export default function AdminPanel() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin");
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Painel Admin</h1>

      <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", width: "100%" }}>
          <Button text="✈️ Gerenciar Viagens" onClick={() => navigate("/admin/viagens")} />
          <Button text="📄 Gerenciar Contratos" onClick={() => navigate("/admin/contratos")} />
          <Button text="📋 Homming List" onClick={() => navigate("/admin/homming")} />
          <Button text="💰 Financeiro" onClick={() => navigate("/admin/financeiro")} />
      </div>
      <Button text="Sair" onClick={handleLogout} />
    </div>
  );
}
