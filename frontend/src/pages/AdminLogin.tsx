import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth";

import Input from "../components/input/Input";
import Button from "../components/button/Button";

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

            <Input
            type="password"
            label="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />

            <Button onClick={handleLogin} text="Entrar" />
        </div>
    );
}
