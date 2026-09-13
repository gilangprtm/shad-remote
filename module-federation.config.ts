export const federationConfig = {
  name: "edjavu_ui",
  filename: "remoteEntry.js",
  exposes: {
    "./core": "./src/exposes/core.ts",
    "./composites": "./src/exposes/composites.ts",
    "./shell": "./src/exposes/shell.ts",
    "./Button": "./src/exposes/Button.ts",
    "./Dialog": "./src/exposes/Dialog.ts",
    "./DataTable": "./src/exposes/DataTable.ts",
    "./AppShell": "./src/exposes/AppShell.ts",
    "./platform": "./src/exposes/platform.ts",
  },
  shared: { react: { import: true }, "react-dom": { import: true } },
};
