import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getAdminData = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ password: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    const expected = process.env["ADMIN_PASSWORD"];
    if (!expected || data.password !== expected) {
      return { ok: false as const, leads: [], orders: [], subscribers: [] };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [leads, orders, subs] = await Promise.all([
      supabaseAdmin.from("leads").select("*").order("created_at", { ascending: false }).limit(500),
      supabaseAdmin.from("orders").select("*").order("created_at", { ascending: false }).limit(500),
      supabaseAdmin.from("newsletter_subscribers").select("*").order("created_at", { ascending: false }).limit(1000),
    ]);
    return { ok: true as const, leads: leads.data ?? [], orders: orders.data ?? [], subscribers: subs.data ?? [] };
  });
