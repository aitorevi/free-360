import { describe, expect, it } from "vitest";
import { API_VERSION, apiPath } from "./version.ts";

describe("versión de la API", () => {
  it("es v1", () => {
    expect(API_VERSION).toBe("v1");
  });

  it("construye rutas bajo el prefijo de versión", () => {
    expect(apiPath("/locations")).toBe("/v1/locations");
  });

  it("rechaza rutas que no empiezan por /", () => {
    expect(() => apiPath("locations")).toThrow();
  });
});
