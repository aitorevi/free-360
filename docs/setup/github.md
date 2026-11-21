# Configuración de seguridad en GitHub

Estos ajustes no se pueden hacer desde el código: hay que activarlos a mano una vez.

En el repositorio → **Settings** → **Advanced Security** (o **Code security**):

1. **Dependabot alerts** → _Enable_.
2. **Dependabot security updates** → _Enable_.
3. **Secret scanning** → _Enable_.
4. **Push protection** → _Enable_. Rechaza los pushes que contengan claves conocidas.
5. **Private vulnerability reporting** → _Enable_. Permite el reporte privado que describe `SECURITY.md`.

Recomendado además, en **Settings** → **Branches** → regla para `main`:

- _Require a pull request before merging_.
- _Require status checks to pass_: marca **Lint, tipos y tests** y **Escaneo de secretos (gitleaks)**.

## Instalar gitleaks en tu Mac

```bash
brew install gitleaks
```

Sin gitleaks instalado, el hook de pre-commit bloquea los commits a propósito.
