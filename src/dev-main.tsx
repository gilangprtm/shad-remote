import { useState } from "react";
import { createRoot } from "react-dom/client";
import { AppShell } from "./shell/app-shell/AppShell";
import { ComponentDocsPage, isDocsPath } from "./components/docs/ComponentDocsPage";
import { ComponentShowcase } from "./components/showcase/ComponentShowcase";
import { LandingPage } from "./components/landing/LandingPage";
import { ResourcePage } from "./components/docs/ResourcePage";
import "./styles/styles.css";

function titleForPath(path: string) {
  if (path === "/") return "Overview";
  return path.split("/").filter(Boolean).pop()?.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) ?? "Documentation";
}

function Demo() {
  const [path, setPath] = useState(() => window.location.pathname);
  const title = titleForPath(path);
  const navigate = (url: string) => { window.history.replaceState({}, "", url); window.dispatchEvent(new CustomEvent("edjavu:navigate", { detail: url })); setPath(url); };
  const content = path === "/" ? <LandingPage onNavigate={navigate} /> : path === "/docs/usage" ? <ResourcePage kind="usage" onNavigate={navigate} /> : path === "/docs/contracts" ? <ResourcePage kind="contracts" onNavigate={navigate} /> : path === "/preferences" ? <ResourcePage kind="preferences" onNavigate={navigate} /> : isDocsPath(path) ? <ComponentDocsPage path={path} /> : <ComponentShowcase />;
  return <AppShell title={title} breadcrumbs={[{ label: "Remote UI", href: "/" }, { label: title }]} onNavigate={navigate}>{content}</AppShell>;
}

createRoot(document.getElementById("root")!).render(<Demo />);
