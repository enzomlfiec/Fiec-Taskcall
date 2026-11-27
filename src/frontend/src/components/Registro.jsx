import { useNavigate, Link } from "react-router-dom";
import React, { useEffect } from "react";
import { EyeClosed, Eye } from "lucide-react";
import { alertaAviso, alertaErro, alertaSucesso } from "../utils/alertaSite";
import { authApi } from "../services/api";

function analisarEmailInstitucional(email) {
  const limpo = String(email || "")
    .trim()
    .toLowerCase();
  const matchFiec = limpo.match(/^([^@]+)@fiec\.edu\.br$/);
  if (!matchFiec) {
    return { validoFiec: false, exigeRm: false, rmEsperado: null };
  }
  const localPart = matchFiec[1];
  const matchDigitos = localPart.match(/(\d+)/);
  if (matchDigitos) {
    return { validoFiec: true, exigeRm: true, rmEsperado: matchDigitos[1] };
  }
  return { validoFiec: true, exigeRm: false, rmEsperado: null };
}

function Registro({ isClaro = false }) {
  const navigate = useNavigate();
  const [campoRM, setCampoRM] = React.useState("");
  const [campoNome, setCampoNome] = React.useState("");
  const [campoEmail, setCampoEmail] = React.useState("");
  const [campoSenha, setCampoSenha] = React.useState("");
  const [campoValid, setCampoValid] = React.useState(false);
  const [enviando, setEnviando] = React.useState(false);
  const [passtype, setPassType] = React.useState("password");

  const infoEmail = analisarEmailInstitucional(campoEmail);

  useEffect(() => {
    const camposBasicos =
      campoNome.trim() !== "" &&
      campoEmail.trim() !== "" &&
      campoSenha.length >= 8;
    const rmOk = !infoEmail.exigeRm || campoRM.trim() !== "";
    setCampoValid(camposBasicos && rmOk);
  }, [campoNome, campoSenha, campoRM, campoEmail, infoEmail.exigeRm]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (enviando) return;

    if (!infoEmail.validoFiec) {
      await alertaAviso({
        title: "E-mail inválido",
        text: "Utilize seu e-mail institucional do domínio @fiec.edu.br.",
      });
      return;
    }

    if (infoEmail.exigeRm && campoRM.trim() !== infoEmail.rmEsperado) {
      await alertaAviso({
        title: "RM divergente",
        text: `Para e-mails de alunos/estagiários, o Nº de Identificação (RM) deve corresponder ao número presente no e-mail (${infoEmail.rmEsperado}).`,
      });
      return;
    }

    setEnviando(true);
    try {
      await authApi.register({
        nome: campoNome.trim(),
        email: campoEmail.trim().toLowerCase(),
        rm: campoRM.trim() !== "" ? campoRM.trim() : null,
        senha: campoSenha,
      });

      await alertaSucesso({
        title: "Cadastro realizado!",
        text: `Conta de ${campoNome.trim()} criada com sucesso. Faça login para continuar.`,
        confirmButtonText: "Ir para o login",
      });
      navigate("/login");
    } catch (err) {
      await alertaErro({
        title: "Erro ao cadastrar",
        text:
          err.message ||
          "Não foi possível cadastrar o usuário. Revise os dados e tente novamente.",
      });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex flex-col relative min-h-screen w-full items-center justify-center bg-login bg-cover bg-center px-4 py-6">
      <div className="flex flex-col relative w-full items-center justify-center gap-4">
        <img
          id="logo"
          src={isClaro ? "/assets/logo/logo-hor-claro.png" : "/assets/logo/logo-hor.png"}
          alt="Logo FIEC Taskcall"
          className="w-full max-w-125 px-4"
        />
        <div className="flex w-full max-w-xl flex-col gap-4 items-baseline">
          <form
            onSubmit={handleSubmit}
            className="relative flex w-full flex-col items-center text-pri bg-fundo-medio/30 backdrop-blur-sm p-6 sm:p-12 md:p-16 md:px-20 gap-3 rounded-3xl sm:rounded-4xl border-sec border-2"
          >
            <div className="flex w-full flex-col gap-3 items-baseline">
              <div className="flex items-center justify-center mb-1">
                <h1 className="select-none text-2xl sm:text-3xl font-bold">
                  Cadastro
                </h1>
              </div>

              <div>
                <label htmlFor="registro-nome" className="font-bold">
                  Nome
                </label>
                <span
                  className="text-accent font-bold select-none"
                  aria-hidden="true"
                >
                  {" "}
                  *{" "}
                </span>
              </div>
              <input
                id="registro-nome"
                value={campoNome}
                onChange={(e) => setCampoNome(e.target.value)}
                className="text-pri bg-fundo-profundo font-medium w-full rounded-md p-2.5 focus-visible:outline-2 focus-visible:outline-accent"
                type="text"
                required
                placeholder="*Insira o nome do usuário."
              />

              <div>
                <label htmlFor="registro-rm" className="font-bold">
                  Nº de Identificação
                </label>
                {infoEmail.exigeRm && (
                  <span
                    className="text-accent font-bold select-none"
                    aria-hidden="true"
                  >
                    {" "}
                    *{" "}
                  </span>
                )}
              </div>
              <input
                id="registro-rm"
                value={campoRM}
                onChange={(e) => setCampoRM(e.target.value)}
                className="text-pri bg-fundo-profundo font-medium w-full rounded-md p-2.5 focus-visible:outline-2 focus-visible:outline-accent"
                type="number"
                required={infoEmail.exigeRm}
                placeholder={
                  infoEmail.exigeRm
                    ? "*Insira o RM correspondente ao seu e-mail."
                    : "Opcional para professores (@fiec.edu.br)."
                }
              />

              <div>
                <label htmlFor="registro-email" className="font-bold">
                  Email
                </label>
                <span
                  className="text-accent font-bold select-none"
                  aria-hidden="true"
                >
                  {" "}
                  *{" "}
                </span>
              </div>
              <input
                id="registro-email"
                value={campoEmail}
                onChange={(e) => setCampoEmail(e.target.value)}
                className="text-pri bg-fundo-profundo font-medium w-full rounded-md p-2.5 focus-visible:outline-2 focus-visible:outline-accent"
                type="email"
                required
                placeholder="*Insira o Email @fiec.edu.br do usuário."
              />

              <div>
                <label htmlFor="registro-senha" className="font-bold">
                  Senha
                </label>
                <span
                  className="text-accent font-bold select-none"
                  aria-hidden="true"
                >
                  {" "}
                  *{" "}
                </span>
              </div>
              <div className="flex w-full flex-row items-center justify-center gap-2">
                <input
                  id="registro-senha"
                  value={campoSenha}
                  onChange={(e) => setCampoSenha(e.target.value)}
                  className="text-pri bg-fundo-profundo font-medium w-full rounded-md p-2.5 [&::-ms-reveal]:hidden [&::-webkit-password-toggle-button]:hidden focus-visible:outline-2 focus-visible:outline-accent"
                  type={passtype}
                  required
                  placeholder="*Insira a senha vinculada ao perfil (mín. 8 caracteres)."
                  minLength={8}
                />
                <button
                  type="button"
                  aria-label={
                    passtype === "password" ? "Mostrar senha" : "Ocultar senha"
                  }
                  aria-pressed={passtype === "text"}
                  className="cursor-pointer rounded p-1.5 text-pri focus-visible:outline-2 focus-visible:outline-accent"
                  onClick={() =>
                    setPassType((prev) =>
                      prev === "password" ? "text" : "password",
                    )
                  }
                >
                  {passtype === "password" ? <EyeClosed /> : <Eye />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center mt-5 mb-2">
              <button
                type="submit"
                disabled={!campoValid || enviando}
                className="botao text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed! disabled:hover:scale-97 disabled:bg-[#740510] bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pri"
              >
                {enviando ? "Cadastrando..." : "Cadastrar"}
              </button>
            </div>

            <p className="text-sm sm:text-base text-center">
              Já tem uma conta?
              <Link
                to="/login"
                className="text-accent font-semibold ml-2 hover:underline focus-visible:outline-2 focus-visible:outline-accent rounded"
              >
                Faça login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Registro;
