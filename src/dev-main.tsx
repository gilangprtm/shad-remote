import { createRoot } from "react-dom/client";
import { AppShell } from "./shell/app-shell/AppShell";
import { ComponentShowcase } from "./components/showcase/ComponentShowcase";
import "./styles/styles.css";

function Demo() {
  return (
    <AppShell
      title="Overview"
      breadcrumbs={[{ label: "Remote UI" }, { label: "Overview" }]}
      onNavigate={(url) => {
        if (url === "/") window.history.replaceState({}, "", "/");
      }}
    >
      <ComponentShowcase />
    </AppShell>
  );
}

createRoot(document.getElementById("root")!).render(<Demo />);
