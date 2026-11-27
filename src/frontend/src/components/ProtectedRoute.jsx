import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, requireAdminTi = false }) {
    const { autenticado, carregando, usuario } = useAuth();

    if (carregando) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-fundo-fundo text-pri">
                <p className="text-base font-medium text-sec">Carregando sessão...</p>
            </div>
        );
    }

    if (!autenticado) {
        return <Navigate to="/login" replace />;
    }

    if (requireAdminTi && (usuario?.perfil !== "ti" || !usuario?.is_admin_ti)) {
        return <Navigate to="/tela-principal" replace />;
    }

    return children;
}

export default ProtectedRoute;
