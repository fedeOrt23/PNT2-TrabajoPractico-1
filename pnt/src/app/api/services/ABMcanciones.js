const DEFAULT_MOCK_API_BASE =
  "https://690160fdff8d792314bd3f83.mockapi.io/api/v1";
const CANCIONES_RESOURCE = "/canciones";
const MOCK_API_BASE_URL =
  process.env.NEXT_PUBLIC_MOCK_API_BASE?.replace(/\/$/, "") ||
  DEFAULT_MOCK_API_BASE;

function resolveCancionPath(id) {
  if (!id) {
    throw new Error("Se requiere un id");
  }
  return `${CANCIONES_RESOURCE}/${id}`;
}


async function obtenerCanciones() {
  const response = await fetch(`${MOCK_API_BASE_URL}${CANCIONES_RESOURCE}`);

  if (!response.ok) {
    const detalles = await response.text();
    throw new Error(`Error ${response.status}: ${detalles}`);
  }

  return response.json();
}


async function obtenerCancion(id) {
  const path = resolveCancionPath(id);
  const response = await fetch(`${MOCK_API_BASE_URL}${path}`);

  if (!response.ok) {
    const detalles = await response.text();
    throw new Error(`Error ${response.status}: ${detalles}`);
  }

  return response.json();
}


async function crearCancion(payload) {
  if (!payload) {
    throw new Error("Se requiere un payload para crear la canción");
  }

  const response = await fetch(`${MOCK_API_BASE_URL}${CANCIONES_RESOURCE}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const detalles = await response.text();
    throw new Error(`Error ${response.status}: ${detalles}`);
  }

  return response.json();
}

async function actualizarCancion(id, payload) {
  if (!payload) {
    throw new Error("Se requiere un payload para actualizar la canción");
  }

  const path = resolveCancionPath(id);
  const response = await fetch(`${MOCK_API_BASE_URL}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const detalles = await response.text();
    throw new Error(`Error ${response.status}: ${detalles}`);
  }

  return response.json();
}


async function eliminarCancion(id) {
  const path = resolveCancionPath(id);

  const response = await fetch(`${MOCK_API_BASE_URL}${path}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const detalles = await response.text();
    throw new Error(`Error ${response.status}: ${detalles}`);
  }

  return response.status === 204 ? null : response.json();
}

export {
  obtenerCanciones,
  obtenerCancion,
  crearCancion,
  actualizarCancion,
  eliminarCancion,
};
