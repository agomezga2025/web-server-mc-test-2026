import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
export const runtime = "nodejs";


function isReasonableString(v: unknown, max = 500) {
  return typeof v === "string" && v.length <= max;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const payload = {
      nickname: String(body.nickname ?? "").trim(),
      contact: isReasonableString(body.contact, 200) ? body.contact.trim() : null,
      play_style: String(body.playStyle ?? ""),
      grind_tolerance: String(body.grindTolerance ?? ""),
      pvp_preference: String(body.pvpPreference ?? ""),
      abandon_reasons: Array.isArray(body.abandonReasons) ? body.abandonReasons.slice(0, 2) : [],
      server_philosophy: String(body.serverPhilosophy ?? ""),
      weekly_hours: String(body.weeklyHours ?? ""),
      launch_intent: String(body.launchIntent ?? ""),
      free_text: isReasonableString(body.freeText, 1000) ? body.freeText.trim() : null,
      user_agent: req.headers.get("user-agent"),
      ip_hint: req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip")
    };

    if (payload.nickname.length < 2) {
      return NextResponse.json({ error: "Nick inválido." }, { status: 400 });
    }
    const required = [
      payload.play_style,
      payload.grind_tolerance,
      payload.pvp_preference,
      payload.server_philosophy,
      payload.weekly_hours,
      payload.launch_intent
    ];
    if (required.some((x) => !x)) {
      return NextResponse.json({ error: "Faltan respuestas obligatorias." }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from("quiz_responses").insert(payload);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Error inesperado" }, { status: 500 });
  }
}
