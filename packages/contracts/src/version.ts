export const API_VERSION = "v1";

export function apiPath(path: string): string {
  if (!path.startsWith("/")) {
    throw new Error(`La ruta debe empezar por "/": ${path}`);
  }
  return `/${API_VERSION}${path}`;
}
