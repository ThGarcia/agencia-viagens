import { useParams } from "react-router-dom";

export default function ContractDetails() {
    const { token } = useParams();

    return <h1>Token de Acesso: {token}</h1>;
}
