import axios from 'axios';

const API_BASE_URL = 'https://collectionapi.metmuseum.org/public/';

export const fetchCollections = async ({filters}: {filters: {departmentId?: number, artist?: string}}) => {
  try {
    let url = `${API_BASE_URL}collection/v1/search?hasImages=true&q=painting`;

    if(filters.departmentId) {
      url += `&departmentId=${filters.departmentId}`;
    }

    if(filters.artist) {
      url += `&artistOrCulture=${filters.artist}`;
    }

    const response = await axios.get(url);

    if (response.status !== 200) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    throw error;
  }
};


export const fetchObjectDetails = async (objectId: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}collection/v1/objects/${objectId}`);

    if (response.status !== 200) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar detalhes da coleção:", error);
    throw error;
  }
}


export const fetchDepartments = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}collection/v1/departments`);

    if (response.status !== 200) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar departamentos:", error);
    throw error;
  }
}