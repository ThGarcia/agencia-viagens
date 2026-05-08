import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getContractByToken } from "../services/contractService";
import type { ContractResponse } from "../types/contract";
import { isAuthenticated } from "../services/auth";

import Loader from "../components/Loader";
import img from "../assets/contract-logo.png";

export default function ContractDetails() {
    const { token } = useParams();
    const [contract, setContract] = useState<ContractResponse | null>(null);
    const isAdmin = isAuthenticated();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) return;

        getContractByToken(token)
            .then(setContract)
            .catch(() => alert("Contrato não encontrado"));
    }, [token]);

    const handleWhatsApp = () => {
        if (!contract) return;
        const link = window.location.href;
        const phone = contract.clientPhone.replace(/\D/g, "");
        const message = encodeURIComponent(
            `Olá ${contract.clientName}!\n\nSeu contrato da viagem *${contract.travel.title}* está pronto!\n\nAcesse e confira os detalhes aqui:\n${link}`
        );
        window.open(`https://wa.me/55${phone}?text=${message}`, "_blank");
    };

    const handleBack = () => {
        navigate("/admin/contratos");
    };

    if (!contract) return <Loader />;

    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleString("pt-br", { month: "long" });
    const year = today.getFullYear();

    return (
        <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
            {isAdmin && (
                <div style={{
                    background: "#f0f4f8",
                    padding: 20,
                    borderRadius: 8,
                    marginBottom: 30,
                    border: "2px dashed #007bff",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <div>
                        <h4 style={{ margin: 0, color: "#007bff" }}>Painel Administrativo</h4>
                        <p style={{ margin: 0, fontSize: 14 }}>Status Atual: <strong>{contract.status}</strong></p>
                    </div>
                    <button onClick={handleBack}>
                        Voltar
                    </button>
                    <button
                        onClick={handleWhatsApp}
                        style={{
                            backgroundColor: "#25D366",
                            color: "white",
                            padding: "10px 20px",
                            border: "none",
                            borderRadius: 5,
                            fontWeight: "bold",
                            cursor: "pointer"
                        }}
                    >
                        Enviar p/ WhatsApp do Cliente
                    </button>
                </div>
            )}
            
            <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
                <h1>Contrato: {token} - {contract.status}</h1>
                <div className="contract">
                    <img src={img} alt="logo contrato Sharoin Turismo" />
                    <p className="title">CONTRATO DE VIAGEM</p>
                    <p className="text">O presente contrato de prestação de serviços de turismo, representado neste ato pela Sharon Agência de Viagens e Turismo, CNPJ: 43.525.498/0001-19, representada por Marcia Aparecida Batista Luchini, sito à Avenida Nove de Julho, nº 794, na cidade de Assis/SP, celular (18) 99691-1524, a seguir denominada CONTRATADA, e de outro lado, na qualidade de CONTRATANTE, e assim, a seguir simplesmente denominado, comparece a pessoa de</p>
                    <div>
                        <p className="text">CONTRATANTE: {contract.clientName}, portador(a) RG: {contract?.clientRg}, do CPF: {contract.clientCpf}, nascido(a): {contract.clientBirthDate}, com endereço: {contract.addressStreet}, {contract.addressNumber}{" "}{contract.addressComplement && `, ${contract.addressComplement}`}, {contract.addressNeighborhood}, CEP: {contract.addressZip}, {contract.addressCity}/ {contract.addressState}, Telefone: {contract.clientPhone}.</p>
                        {contract.passengers?.length > 0 &&
                            contract.passengers.map((p, index) =>
                            (<p key={index} className="text">ACOMPANHANTE: {p.name}, portador(a) do RG: {p?.rg}, e do CPF: {p.cpf}, nascido(a): {p.birthDate}.</p>
                            ))}
                    </div>
                    <div>
                        <p className="text">A CONTRATADA receberá pelo serviço prestado o valor total deR$ {contract.priceTotal}.</p>
                        <p className="text">Forma de pagamento: {contract.paymentMethod}.</p>
                    </div>
                    <div>
                        <p className="text">Destino da viagem: {contract.travel.title}.</p>
                        <p className="text">Incluso:</p>
                        <ul className="list">
                            {contract.travel.inclusions.map((i, index) => (
                                <li key={index}><p>• {i}</p></li>
                            ))}
                        </ul>
                    </div>
                    <p className="text">Data da saída: {contract.travel.departureDate}, com data de retorno: {contract.travel.returnDate}.</p>
                    <p className="text">CONDIÇÕES DE CANCELAMENTO</p>
                    <div>
                        <p className="text">A viagem será cancelada por parte da CONTRATADA, caso não atinja o número de passageiros correspondente a (mínimo de 25 pessoas), a mesma comunicará a todos os clientes com antecedência de 15 (quinze dias), os quais serão reembolsados.</p>
                        <p className="text">Caso o CONTRATANTE deseje cancelar a viagem, deverá comunicar a CONTRATADA com antecedência mínima de 30 (trinta) dias antes da data prevista para a viagem. Neste caso, o CONTRATANTE poderá transferir a viagem para outra pessoa ou optar por deixar o valor integral como crédito para uma próxima viagem. Caso o cancelamento seja realizado com menos de 15 (quinze) dias de antecedência, será cobrada uma taxa de 30% sobre o valor total da viagem, ficando o CONTRATANTE com um crédito de 70% do valor pago para utilização em uma próxima viagem.</p>
                        <p className="text">A descrição da mesma será feita neste contrato, no campo abaixo:</p>
                        <p className="text">Assim por estarem justos e contratados, assinam o presente contrato de viagem em duas vias de igual teor para um só fim.</p>
                    </div>
                    <p className="text">Assis, {day} de {month} de {year}</p>
                    <div className="signature">
                        <p className="text">CONTRATANTE</p>
                        <p className="text">SHARON TURISMO</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
