import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

const Home = lazy(() => import("../pages/Home"));
const TravelDetails = lazy(() => import("../pages/TravelDetails"));
const CreateContract = lazy(() => import("../pages/CreateContract"));
const ContractDetails = lazy(() => import("../pages/ContractDetails"));
const ApproveContract = lazy(() => import("../pages/ApproveContract"));
const AdminContracts = lazy(() => import("../pages/AdminContracts"));
const WaitResponse = lazy(() => import("../pages/WaitResponse"));

import Loader from "../components/Loader";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Suspense fallback={<Loader />}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/viagem/:id" element={<TravelDetails />} />
                    <Route path="/contrato/" element={<CreateContract />} />
                    <Route path="/contrato/:token" element={<ContractDetails />} />
                    <Route path="/admin/contrato/:id" element={<ApproveContract />} />
                    <Route path="/admin/contratos" element={<AdminContracts />} />
                    <Route path="/obrigado" element={<WaitResponse />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}
