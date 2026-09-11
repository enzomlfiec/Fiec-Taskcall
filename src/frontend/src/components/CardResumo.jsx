import Porcentagem from "./Porcentagem";

const CardResumo = ({ icone, titulo, porcentagem, cor, corfundo }) => {
  return (
    <div className="flex gap-10 p-8">
      <div className="flex w-[415px] h-[169px] rounded-3xl bg-razo items-center justify-between p-5">
        <div
          className="w-[91px] h-[91px] flex items-center justify-center rounded-2xl shrink-0 shadow-lg/50"
          style={{ backgroundColor: cor }}>
          <img src={icone} alt="" className="w-14 h-14" />
        </div>

        <span className="w-[180px] text-center text-white font-bold text-2xl">
          {titulo}
        </span>

        <Porcentagem valor={porcentagem} cor={cor} corfundo={corfundo} />
      </div>
    </div>
  );
};

export default CardResumo;
