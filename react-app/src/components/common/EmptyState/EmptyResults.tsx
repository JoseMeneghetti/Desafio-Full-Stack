import searchImg from "../../../assets/search.png";

const EmptyResults = () => {
  return (
    <div className="w-full flex flex-row justify-center my-4">
      <div className="flex flex-col gap-8 justify-center items-center">
        <div className="w-42 h-42 p-4 border-2 rounded-full bg-gray-200 flex items-center justify-center">
          <img src={searchImg} alt="Sem resultados" className="w-24" />
        </div>

        <span className="text-lg text-white ">Nenhum resultado encontrado</span>
        <span>Tente ajustar sua busca para achar o que esta procurando.</span>
      </div>
    </div>
  );
};

export default EmptyResults;
