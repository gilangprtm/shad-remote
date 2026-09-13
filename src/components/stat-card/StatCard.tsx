import type { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../core/card/Card";

export function StatCard({ label, value, description, icon }: { label: string; value: ReactNode; description?: ReactNode; icon?: ReactNode }) {
  return <Card><CardHeader className="flex flex-row items-center justify-between space-y-0"><CardDescription>{label}</CardDescription>{icon}</CardHeader><CardContent><CardTitle>{value}</CardTitle>{description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}</CardContent></Card>;
}
