import Login from "./pages/Login";
import "../style.css";
import Inbox from "./pages/Inbox";
import TelaPrincipal from "./pages/TelaPrincipal";
import Registro from "./components/Registro";
import PageNotFound from "./pages/PageNotFound";
import React from "react";
import Configuracoes from "./pages/Configuracoes";
import InfoUsuario from "./components/Usuario/InfoUsuario";
import GerenciarUsuarios from "./pages/GerenciarUsuarios";
import ProtectedRoute from "./components/ProtectedRoute";
import { Routes, Route } from "react-router-dom";
import CriacaoChamado from "./components/Chamado/Inbox/CriacaoChamado";

function lerPreferenciaLocal(chave, valorPadrao) {
  try {
    const bruto = localStorage.getItem(chave);
    if (bruto !== null) {
      return JSON.parse(bruto);
    }
    localStorage.setItem(chave, JSON.stringify(valorPadrao));
    return valorPadrao;
  } catch {
    return valorPadrao;
  }
}

function App() {
  const [simpleAnims, setSimpleAnims] = React.useState(() => {
    const val = lerPreferenciaLocal("simpleAnims", false);
    return val === true || val === "true";
  });
  const [fontSize, setFontSize] = React.useState(() => lerPreferenciaLocal("fontSize", "default"));
  const [corTema, setCorTema] = React.useState(() => lerPreferenciaLocal("corTema", "system"));
  const [prefersLight, setPrefersLight] = React.useState(() =>
    Boolean(window.matchMedia?.("(prefers-color-scheme: light)")?.matches)
  );
  const [collapsed, setCollapsed] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia?.("(prefers-color-scheme: light)");
    if (!mq) return;
    const onChange = (e) => setPrefersLight(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const isClaro = corTema === true || (corTema === "system" && prefersLight);

  React.useEffect(() => {
    if (isClaro) {
      document.documentElement.classList.add("claro");
    } else {
      document.documentElement.classList.remove("claro");
    }
  }, [isClaro]);

  React.useEffect(() => {
    document.documentElement.classList.remove("font-small", "font-default", "font-large");
    const fontClass =
      fontSize === "small" ? "font-small" : fontSize === "large" ? "font-large" : "font-default";
    document.documentElement.classList.add(fontClass);
  }, [fontSize]);

  React.useEffect(() => {
    if (simpleAnims) {
      document.documentElement.classList.add("reduce-motion");
    } else {
      document.documentElement.classList.remove("reduce-motion");
    }
  }, [simpleAnims]);

  React.useEffect(() => {
    const handleStorage = () => {
      setCorTema(lerPreferenciaLocal("corTema", "system"));
      const anims = lerPreferenciaLocal("simpleAnims", false);
      setSimpleAnims(anims === true || anims === "true");
      setFontSize(lerPreferenciaLocal("fontSize", "default"));
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <div
      className={`${isClaro ? "claro scheme-light" : "scheme-dark"} min-h-screen ${
        simpleAnims ? "reduce-motion **:duration-0 **:transition-none" : ""
      }`}
    >
      <Routes>
        <Route path="/" element={<Login isClaro={isClaro} />} />
        <Route path="/login" element={<Login isClaro={isClaro} />} />
        <Route path="/registro" element={<Registro isClaro={isClaro} />} />

        <Route
          path="/tela-principal"
          element={
            <ProtectedRoute>
              <TelaPrincipal collapsed={collapsed} setCollapsed={setCollapsed} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inbox"
          element={
            <ProtectedRoute>
              <Inbox collapsed={collapsed} setCollapsed={setCollapsed} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inbox/criacaochamado"
          element={
            <ProtectedRoute>
              <CriacaoChamado collapsed={collapsed} setCollapsed={setCollapsed} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/configuracoes"
          element={
            <ProtectedRoute>
              <Configuracoes
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                corTema={corTema}
                setCorTema={setCorTema}
                simpleAnims={simpleAnims}
                setSimpleAnims={setSimpleAnims}
                fontSize={fontSize}
                setFontSize={setFontSize}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/usuario"
          element={
            <ProtectedRoute>
              <InfoUsuario collapsed={collapsed} setCollapsed={setCollapsed} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/usuarios"
          element={
            <ProtectedRoute requireAdminTi>
              <GerenciarUsuarios collapsed={collapsed} setCollapsed={setCollapsed} />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
