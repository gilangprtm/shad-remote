import { ArrowRight, BookOpen, Boxes, Code2, ShieldCheck } from "lucide-react";
import { Badge } from "../../core/badge/Badge";
import { Button } from "../../core/button/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../core/card/Card";
import { componentCounts } from "../docs/component-registry";

type LandingPageProps = { onNavigate: (url: string) => void };

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="landing-page">
      <section className="landing-hero" aria-labelledby="landing-title">
        <div className="landing-hero-copy">
          <Badge variant="secondary">Remote component catalog</Badge>
          <h1 id="landing-title">Build from a shared UI contract.</h1>
          <p>
            Edjavu Remote UI menyediakan komponen React yang dikonsumsi melalui Module Federation.
            Pilih komponen, baca kontraknya, lalu hubungkan dengan data dari aplikasi consumer.
          </p>
          <div className="landing-actions">
            <Button size="lg" onClick={() => onNavigate("/components/core/button")}>
              Browse components <ArrowRight size={17} />
            </Button>
            <Button size="lg" variant="outline" onClick={() => onNavigate("/docs/usage")}>
              Read usage guide
            </Button>
          </div>
        </div>
        <div className="landing-hero-panel" aria-label="Remote UI contract summary">
          <div className="landing-panel-topline"><span className="landing-status-dot" /> Published remote</div>
          <code>edjavu_ui/core</code>
          <div className="landing-panel-flow">
            <span>Consumer app</span><ArrowRight size={15} /><span>Remote module</span><ArrowRight size={15} /><span>Rendered UI</span>
          </div>
          <p>Routing, data, auth, dan persistence tetap dimiliki consumer.</p>
        </div>
      </section>

      <section className="landing-stats" aria-label="Catalog summary">
        <div><strong>{componentCounts.total}</strong><span>documented pages</span></div>
        <div><strong>{componentCounts.core}</strong><span>core primitives</span></div>
        <div><strong>{componentCounts.composites}</strong><span>composite surfaces</span></div>
      </section>

      <section className="landing-section" aria-labelledby="landing-paths-title">
        <div className="landing-section-heading"><div><span className="landing-eyebrow">Start here</span><h2 id="landing-paths-title">Choose the path that matches your task.</h2></div><p>Dokumentasi berfokus pada API nyata, variasi yang tersedia, dan batas ownership.</p></div>
        <div className="landing-card-grid">
          <Card><CardHeader><Boxes size={20} /><CardTitle>Browse the catalog</CardTitle><CardDescription>Bandingkan primitive, composite, dan pola yang sudah terdaftar.</CardDescription></CardHeader><CardContent><Button variant="link" onClick={() => onNavigate("/components/core/button")}>Open catalog <ArrowRight size={15} /></Button></CardContent></Card>
          <Card><CardHeader><Code2 size={20} /><CardTitle>Consume a remote</CardTitle><CardDescription>Lihat cara memuat module dan menghubungkan contract dari consumer.</CardDescription></CardHeader><CardContent><Button variant="link" onClick={() => onNavigate("/docs/usage")}>Read usage <ArrowRight size={15} /></Button></CardContent></Card>
          <Card><CardHeader><ShieldCheck size={20} /><CardTitle>Understand ownership</CardTitle><CardDescription>Pahami apa yang dirender Remote UI dan apa yang tetap menjadi tanggung jawab aplikasi.</CardDescription></CardHeader><CardContent><Button variant="link" onClick={() => onNavigate("/docs/contracts")}>Read contracts <ArrowRight size={15} /></Button></CardContent></Card>
        </div>
      </section>

      <section className="landing-boundary" aria-labelledby="landing-boundary-title">
        <div><span className="landing-eyebrow">Boundary</span><h2 id="landing-boundary-title">A remote component is not a backend.</h2><p>Remote UI mengelola rendering, accessibility, local interaction state, dan presentation states. Consumer mengelola route, API, database, authentication, authorization, tenant, dan persistence.</p></div>
        <Button variant="outline" onClick={() => onNavigate("/docs/contracts")}>View contract boundary</Button>
      </section>

      <footer className="landing-footer"><BookOpen size={16} /><span>Edjavu Remote UI · framework-agnostic component surfaces for consumer applications.</span></footer>
    </div>
  );
}
