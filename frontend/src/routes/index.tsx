import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

const Home = lazy(() => import("../pages/Home"));
const TravelDetails = lazy(() => import("../pages/TravelDetails"));
const CreateContract = lazy(() => import("../pages/CreateContract"));
const ContractDetails = lazy(() => import("../pages/ContractDetails"));
const AdminContracts = lazy(() => import("../pages/AdminContracts"));
const WaitResponse = lazy(() => import("../pages/WaitResponse"));
const AdminApprove = lazy(() => import("../pages/AdminApprove"));
const AdminTravels = lazy(() => import("../pages/AdminTravels"));

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
                    <Route path="/admin/contratos" element={<AdminContracts />} />
                    <Route path="/obrigado" element={<WaitResponse />} />
                    <Route path="/admin/contracts/:id" element={<AdminApprove />} />
                    <Route path="/admin/viagens" element={<AdminTravels />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}
