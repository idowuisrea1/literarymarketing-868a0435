import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getAdminData } from "@/lib/admin.functions";
import { GlowButton } from "@/components/site/primitives";
import { fieldCls } from "@/components/site/Pricing";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — literarymarketing" },
      { name: "description", content: "Private dashboard for leads and orders." },
      { property: "og:title", content: "Admin — literarymarketing" },
      { property: "og:description", content: "Private dashboard for leads and orders." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

type Data = Awaited<ReturnType<typeof getAdminData>>;

function Table({ rows, cols }: { rows: Record<string, unknown>[]; cols: string[] }) {
  if (!rows.length) return <p className="text-sm text-muted-foreground">Nothing yet.</p>;
  return (
    <div className="overflow-x-auto rounded-2xl border">
      <table className="w-full text-left text-sm">
        <thead className="bg-card"><tr>{cols.map((c) => <th key={c} className="px-3 py-2 font-mono text-xs uppercase text-gold">{c.replace("_", " ")}</th>)}</tr></thead>
        <tbody>{rows.map((r) => (
          <tr key={String(r["id"])} className="border-t align-top">{cols.map((c) => (
            <td key={c} className="max-w-xs whitespace-pre-wrap px-3 py-2">{c === "created_at" ? new Date(String(r[c])).toLocaleString() : String(r[c] ?? "")}</td>
          ))}</tr>
        ))}</tbody>
      </table>
    </div>
  );
}

function Admin() {
  const fetchData = useServerFn(getAdminData);
  const [data, setData] = useState<Data | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setErr("");
    const password = String(new FormData(e.currentTarget).get("password") ?? "");
    const res = await fetchData({ data: { password } });
    setBusy(false);
    if (!res.ok) setErr("Wrong password."); else setData(res);
  }

  if (!data?.ok) {
    return (
      <main className="grid min-h-dvh place-items-center px-5">
        <form onSubmit={login} className="glass w-full max-w-sm space-y-4 rounded-3xl p-8">
          <h1 className="text-3xl font-semibold">Admin</h1>
          <input name="password" type="password" placeholder="Password" aria-label="Password" className={fieldCls} />
          {err && <p className="text-sm text-destructive">{err}</p>}
          <GlowButton type="submit" disabled={busy} className="w-full">{busy ? "Checking…" : "Enter"}</GlowButton>
        </form>
      </main>
    );
  }
  return (
    <main className="mx-auto max-w-7xl space-y-10 px-5 py-12">
      <h1 className="text-4xl font-semibold">Dashboard</h1>
      <section><h2 className="mb-3 text-2xl">Orders ({data.orders.length})</h2><Table rows={data.orders} cols={["created_at", "name", "email", "package", "book_title", "genre", "message"]} /></section>
      <section><h2 className="mb-3 text-2xl">Leads ({data.leads.length})</h2><Table rows={data.leads} cols={["created_at", "name", "email", "genre", "service", "details"]} /></section>
      <section><h2 className="mb-3 text-2xl">Newsletter ({data.subscribers.length})</h2><Table rows={data.subscribers} cols={["created_at", "email"]} /></section>
    </main>
  );
}
