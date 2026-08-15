# Admin IPs — SPA local

Simple single-page app to manage local IP lists loaded from Excel/CSV files.

Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173 and sube un `.csv` o `.xlsx` con columnas `IP`, `Nombre de máquina`, `Grupo de trabajo`.

Notas
- El parseo y procesamiento se hace entero en el navegador con SheetJS (`xlsx`).
- Estado se infiere por `Nombre de máquina`: si hay nombre → `ocupada`, si no → `libre`.
- La grilla visual asume CIDR /24 para la vista de mapa; puedes introducir el CIDR manualmente.
