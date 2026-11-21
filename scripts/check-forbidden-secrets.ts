// Falla si aparecen referencias a credenciales de servidor fuera de apps/api.
// La clave service_role y la conexión directa a Postgres solo pueden vivir en la API.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const FORBIDDEN = [
  /service_role/i,
  /SUPABASE_SERVICE_ROLE_KEY/,
  /postgres(ql)?:\/\/[^\s"'`]*:[^\s"'`@]+@/i, // URL de conexión con contraseña
];

// Rutas donde se permite mencionarlas (documentación y reglas, nunca valores reales).
const ALLOWED_PREFIXES = ["apps/api/", "docs/", "supabase/", "scripts/check-forbidden-secrets.ts"];
const ALLOWED_FILES = new Set(["CLAUDE.md", "SECURITY.md", "README.md"]);

const files = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard"], {
  encoding: "utf8",
})
  .split("\n")
  .filter(Boolean)
  .filter((f) => !ALLOWED_FILES.has(f) && !ALLOWED_PREFIXES.some((p) => f.startsWith(p)));

const violations: string[] = [];
for (const file of files) {
  let content: string;
  try {
    content = readFileSync(file, "utf8");
  } catch {
    continue; // archivo borrado en el árbol de trabajo
  }
  content.split("\n").forEach((line, i) => {
    if (FORBIDDEN.some((re) => re.test(line))) {
      violations.push(`${file}:${i + 1}`);
    }
  });
}

if (violations.length > 0) {
  console.error("Credenciales de servidor fuera de apps/api:");
  for (const v of violations) console.error(`  - ${v}`);
  process.exit(1);
}
console.log(`check-forbidden-secrets: OK (${files.length} archivos revisados)`);
