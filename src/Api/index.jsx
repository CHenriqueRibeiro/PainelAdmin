export const buscarCep = async (cep) => {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro na busca de CEP:", error);
    throw error;
  }
};

export const obterCoordenadas = async (endereco) => {
  try {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${endereco}&key=fbb87def325a48768cbc78cc3708bc9f`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro na obtenção de coordenadas:", error);
    throw error;
  }
};
