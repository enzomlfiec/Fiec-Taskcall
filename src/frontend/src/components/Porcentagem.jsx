const Porcentagem = ({ valor, cor, corfundo }) => {
  return (
    <div
      className="w-22 h-22 rounded-full flex items-center justify-center"
      style={{
        background: `conic-gradient(${cor} 0% ${valor}%, ${corfundo} ${valor}% 100%)`,
      }}>
      <div className="w-16 h-16 rounded-full bg-[#302442] flex items-center justify-center">
        <span className="text-[24px] font-bold " style={{ color: cor }}>
          {valor}%
        </span>
      </div>
    </div>
  );
};

export default Porcentagem;
