import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth";

export default function AdminLogin() {
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = () => {
        const ok = login(password);

        if (ok) {
            navigate("/admin/panel");
        } else {
            alert("senha inválida!");
        }
    };

    return  (
        <div style={{ padding: 40 }}>
            <h1>Admin</h1>

            <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleLogin}>
                Entrar
            </button>
        </div>
    );
}
