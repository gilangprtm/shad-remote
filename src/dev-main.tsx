import { useState } from "react";
import { createRoot } from "react-dom/client";
import { AppShell } from "./shell/app-shell/AppShell";
import { ComponentDocsPage, isDocsPath } from "./components/docs/ComponentDocsPage";
import { ComponentShowcase } from "./components/showcase/ComponentShowcase";
import "./styles/styles.css";

function titleForPath(path: string) {
  if (path === "/") return "Overview";
  return path.split("/").filter(Boolean).pop()?.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) ?? "Documentation";
}

function Demo() {
  const [path, setPath] = useState(() => window.location.pathname);
  const title = titleForPath(path);
  return (
    <AppShell
      title={title}
      breadcrumbs={[{ label: "Remote UI", href: "/" }, { label: title }]}
      onNavigate={(url) => setPath(url)}
    >
      {isDocsPath(path) ? <ComponentDocsPage path={path} /> : <ComponentShowcase />}
    </AppShell>
  );
}

createRoot(document.getElementById("root")!).render(<Demo />);
