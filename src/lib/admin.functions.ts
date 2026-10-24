import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createHash, timingSafeEqual } from "node:crypto";

const same = (a: string, b: string) => timingSafeEqual(createHash("sha256").update(a).digest(), createHash("sha256").update(b).digest());

export const getAdminData = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ password: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    const expected = process.env["ADMIN_PASSWORD"];
    if (!expected || !same(data.password, expected)) {
      await new Promise((r) => setTimeout(r, 1500)); // slow down guessing
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
