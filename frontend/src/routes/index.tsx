import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense } from "react";

import Home from "../pages/Home";
import CreateContract from "../pages/CreateContract";
import ContractDetails from "../pages/ContractDetails";

import Spinner from "../components/Spinner";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Suspense fallback={<Spinner />}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/contrato" element={<CreateContract />} />
                    <Route path="/contrato/:token" element={<ContractDetails />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}
