import { BookOpen, FileCode2, PanelLeft, Sun } from "lucide-react";
import { Badge } from "../../core/badge/Badge";
import { Button } from "../../core/button/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../core/card/Card";

function CodeBlock({ children }: { children: string }) {
  return <pre className="docs-resource-code"><code>{children}</code></pre>;
}

export function ResourcePage({ kind, onNavigate }: { kind: "usage" | "contracts" | "preferences"; onNavigate: (path: string) => void }) {
  if (kind === "preferences") {
    return (
      <article className="docs-page">
        <div className="docs-page-heading"><div><Badge variant="secondary">Workspace</Badge><h1>Preferences</h1><p>Atur tampilan katalog tanpa mengubah contract komponen.</p></div></div>
        <div className="docs-resource-grid">
          <Card><CardHeader><CardTitle><Sun size={18} /> Theme mode</CardTitle><CardDescription>Gunakan kontrol Preferences pada shell untuk memilih Light, Dark, atau System.</CardDescription></CardHeader><CardContent><Button variant="outline" onClick={() => onNavigate("/docs/usage")}>Read usage guide</Button></CardContent></Card>
          <Card><CardHeader><CardTitle><PanelLeft size={18} /> Sidebar behavior</CardTitle><CardDescription>Sidebar dapat diperluas atau diringkas melalui tombol shell.</CardDescription></CardHeader><CardContent><p className="showcase-muted">Pengaturan ini bersifat lokal pada workspace katalog.</p></CardContent></Card>
        </div>
      </article>
    );
  }

  const usage = kind === "usage";
  return (
    <article className="docs-page">
      <div className="docs-page-heading"><div><Badge variant="secondary">Resources</Badge><h1>{usage ? "Usage guide" : "Contracts"}</h1><p>{usage ? "Muat grouped remote module dan gunakan component contract dari consumer." : "Batas data, routing, state, dan presentation antara consumer dan Remote UI."}</p></div></div>
      <div className="docs-resource-grid">
        <Card>
          <CardHeader><CardTitle>{usage ? <BookOpen size={18} /> : <FileCode2 size={18} />} {usage ? "Load a remote module" : "Ownership boundary"}</CardTitle><CardDescription>{usage ? "Consumer memilih channel dan resolver Module Federation." : "Remote UI tidak memanggil API atau menyimpan business state."}</CardDescription></CardHeader>
          <CardContent>{usage ? <CodeBlock>{'const remote = await loadRemote("edjavu_ui/core");\nconst { Button } = remote;'}</CodeBlock> : <ul className="docs-resource-list"><li>Consumer: data, route, auth, permission, persistence, dan adapter.</li><li>Remote UI: render, accessibility, local interaction, dan state presentation.</li></ul>}</CardContent>
          <CardContent><Button variant="outline" onClick={() => onNavigate(usage ? "/docs/contracts" : "/docs/usage")}>{usage ? "Read contracts" : "Read usage guide"}</Button></CardContent>
        </Card>
        <Card><CardHeader><CardTitle>Published channels</CardTitle><CardDescription>Gunakan channel eksplisit untuk menghindari asset path tanpa versi.</CardDescription></CardHeader><CardContent><CodeBlock>{"/v1/assets/remoteEntry.js\n/v1/mf-manifest.json\n/canary/assets/remoteEntry.js"}</CodeBlock></CardContent></Card>
      </div>
    </article>
  );
}
