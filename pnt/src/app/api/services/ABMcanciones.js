import { mockApiFetch } from "./helper/fechtMockapi";

const CANCIONES_RESOURCE = "/canciones";

function resolveResourcePath(id) {
  if (!id) {
    throw new Error("Se requiere un id");
  }
  return `${CANCIONES_RESOURCE}/${id}`;
}

export function listarCanciones(searchParams) {
  return mockApiFetch(CANCIONES_RESOURCE, { searchParams });
}

export function obtenerCancion(id) {
  return mockApiFetch(resolveResourcePath(id));
}

export function crearCancion(payload) {
  return mockApiFetch(CANCIONES_RESOURCE, {
    method: "POST",
    body: payload,
  });
}

export function actualizarCancion(id, payload) {
  return mockApiFetch(resolveResourcePath(id), {
    method: "PUT",
    body: payload,
  });
}

export function eliminarCancion(id) {
  return mockApiFetch(resolveResourcePath(id), {
    method: "DELETE",
  });
}
