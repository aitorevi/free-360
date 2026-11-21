import { defineConfig } from "vitest/config";

// Los tests *.int.test.ts necesitan Postgres y solo se ejecutan con INTEGRATION=1.
const integration = process.env["INTEGRATION"] === "1";

export default defineConfig({
  test: {
    include: integration ? ["test/**/*.int.test.ts"] : ["test/**/*.test.ts"],
    exclude: integration ? [] : ["test/**/*.int.test.ts"],
  },
});
