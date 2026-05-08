import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import { Suspense, lazy } from "react";

const Home = lazy(() => import("../pages/Home"));
const TravelDetails = lazy(() => import("../pages/TravelDetails"));
const CreateContract = lazy(() => import("../pages/CreateContract"));
const ContractDetails = lazy(() => import("../pages/ContractDetails"));
const AdminContracts = lazy(() => import("../pages/AdminContracts"));
const WaitResponse = lazy(() => import("../pages/WaitResponse"));
const AdminApprove = lazy(() => import("../pages/AdminApprove"));
const AdminTravels = lazy(() => import("../pages/AdminTravels"));
const AdminPanel = lazy(() => import("../pages/AdminPanel"));
const AdminLogin = lazy(() => import("../pages/AdminLogin"));
const AdminRomming = lazy(() => import("../pages/AdminRomming"));
const AdminRommingList = lazy(() => import("../pages/AdminRommingList"));
const AdminFinancial = lazy(() => import("../pages/AdminFinancial"));
const AdminFinancialList = lazy(() => import("../pages/AdminFinancialList"));
const Test = lazy(() => import("../pages/Test"));

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
                    <Route path="/obrigado" element={<WaitResponse />} />
                    <Route path="/admin" element={<AdminLogin />} />
                    <Route path="/test/:token" element={<Test />} />
                    <Route path="/admin/contratos/:id"
                        element={
                            <ProtectedRoute>
                                <AdminApprove />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/admin/contratos"
                        element={
                            <ProtectedRoute>
                                <AdminContracts />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/admin/viagens"
                        element={
                            <ProtectedRoute>
                                <AdminTravels />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/admin/homming/:id"
                        element={
                            <ProtectedRoute>
                                <AdminRomming />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/admin/homming"
                        element={
                            <ProtectedRoute>
                                <AdminRommingList />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/admin/financeiro/:travelId"
                        element={
                            <ProtectedRoute>
                                <AdminFinancial />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/admin/financeiro"
                        element={
                            <ProtectedRoute>
                                <AdminFinancialList />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/admin/panel"
                        element={
                            <ProtectedRoute>
                                <AdminPanel />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}
