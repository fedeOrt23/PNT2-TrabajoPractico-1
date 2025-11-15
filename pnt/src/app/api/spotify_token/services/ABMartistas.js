
const API_URL = "https://690160fdff8d792314bd3f83.mockapi.io/api/v1/artistas";

export const getAllArtists = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Error al obtener los artistas");
  }
  return await response.json();
};

export const getArtistSongs = async (artistId) => {
  const response = await fetch(`${API_URL}/${artistId}/canciones`);
  if (!response.ok) {
    if (response.status === 404) return [];
    throw new Error("Error al obtener las canciones del artista");
  }
  return await response.json();
};

export const getArtistById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    if (response.status === 404) return null; 
    throw new Error(`Error al obtener el artista con id ${id}`);
  }
  return await response.json();
};


export const createArtist = async (data) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Error al crear el artista");
  }
  return await response.json();
};


export const updateArtist = async (id, data) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    if (response.status === 404) return null; 
    throw new Error(`Error al actualizar el artista con id ${id}`);
  }
  return await response.json();
};


export const deleteArtist = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  return response.ok;
};