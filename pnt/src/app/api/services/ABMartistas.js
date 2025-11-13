import { mockApiFetch } from "./helper/fechtMockapi";

const ARTISTAS_RESOURCE = "/artistas";

function resolveResourcePath(id) {
  if (!id) {
    throw new Error("Se requiere un id");
  }
  return `${ARTISTAS_RESOURCE}/${id}`;
}

export function listarArtistas(searchParams) {
  return mockApiFetch(ARTISTAS_RESOURCE, { searchParams });
}

export function obtenerArtista(id) {
  return mockApiFetch(resolveResourcePath(id));
}

export function crearArtista(payload) {
  return mockApiFetch(ARTISTAS_RESOURCE, {
    method: "POST",
    body: payload,
  });
}

export function actualizarArtista(id, payload) {
  return mockApiFetch(resolveResourcePath(id), {
    method: "PUT",
    body: payload,
  });
}

export function eliminarArtista(id) {
  return mockApiFetch(resolveResourcePath(id), {
    method: "DELETE",
  });
}
