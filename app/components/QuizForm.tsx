"use client";

import { useMemo, useState } from "react";

type FormState = {
  nickname: string;
  contact: string; // email o discord
  playStyle: string;
  grindTolerance: string;
  pvpPreference: string;
  abandonReasons: string[];
  serverPhilosophy: string;
  weeklyHours: string;
  launchIntent: string;
  freeText: string;
};

const ABANDON_OPTIONS = [
  "Pay to win",
  "Staff abusivo o ausente",
  "Bugs / lag",
  "Economía rota",
  "Falta de contenido",
  "Comunidad tóxica"
];

export default function QuizForm() {
  const [loading, setLoading] = useState(false);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    nickname: "",
    contact: "",
    playStyle: "",
    grindTolerance: "",
    pvpPreference: "",
    abandonReasons: [],
    serverPhilosophy: "",
    weeklyHours: "",
    launchIntent: "",
    freeText: ""
  });

  const canSubmit = useMemo(() => {
    // mínimos: nick + estilo + intención + (contact opcional pero recomendable)
    return (
      form.nickname.trim().length >= 2 &&
      form.playStyle &&
      form.launchIntent &&
      form.grindTolerance &&
      form.pvpPreference &&
      form.serverPhilosophy &&
      form.weeklyHours
    );
  }, [form]);

  function toggleAbandonReason(reason: string) {
    setForm((prev) => {
      const exists = prev.abandonReasons.includes(reason);
      let next = prev.abandonReasons;
      if (exists) next = prev.abandonReasons.filter((r) => r !== reason);
      else {
        // máximo 2
        if (prev.abandonReasons.length >= 2) return prev;
        next = [...prev.abandonReasons, reason];
      }
      return { ...prev, abandonReasons: next };
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOkMsg(null);
    setErrMsg(null);

    if (!canSubmit) {
      setErrMsg("Completa los campos obligatorios.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? "Error guardando la respuesta.");

      setOkMsg("Listo. Estás dentro como Founder. Te contactaremos para el acceso.");
      setForm({
        nickname: "",
        contact: "",
        playStyle: "",
        grindTolerance: "",
        pvpPreference: "",
        abandonReasons: [],
        serverPhilosophy: "",
        weeklyHours: "",
        launchIntent: "",
        freeText: ""
      });
    } catch (err: any) {
      setErrMsg(err?.message ?? "Error inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="grid" onSubmit={onSubmit}>
      <div className="grid" style={{ gap: 8 }}>
        <label>Nick de Minecraft (obligatorio)</label>
        <input
          className="input"
          value={form.nickname}
          onChange={(e) => setForm({ ...form, nickname: e.target.value })}
          placeholder="Ej: JoseCraft"
        />
      </div>

      <div className="grid" style={{ gap: 8 }}>
        <label>Contacto (email o Discord) (opcional pero recomendado)</label>
        <input
          className="input"
          value={form.contact}
          onChange={(e) => setForm({ ...form, contact: e.target.value })}
          placeholder="Ej: jose#1234 o jose@email.com"
        />
      </div>

      <hr />

      <div className="grid" style={{ gap: 8 }}>
        <label>1) ¿Qué te hace quedarte en un servidor? (elige 1)</label>
        <select
          className="input"
          value={form.playStyle}
          onChange={(e) => setForm({ ...form, playStyle: e.target.value })}
        >
          <option value="">Selecciona…</option>
          <option value="Progresión constante">Progresar y mejorar constantemente</option>
          <option value="Competición">Competir contra otros jugadores</option>
          <option value="Construcción">Construir y crear sin presión</option>
          <option value="Social">Jugar con amigos y socializar</option>
          <option value="Economía">Economía / comercio / mercado</option>
        </select>
      </div>

      <div className="grid" style={{ gap: 8 }}>
        <label>2) ¿Cuánto grind aceptas?</label>
        <select
          className="input"
          value={form.grindTolerance}
          onChange={(e) => setForm({ ...form, grindTolerance: e.target.value })}
        >
          <option value="">Selecciona…</option>
          <option value="Bajo">Casi nada (diversión directa)</option>
          <option value="Medio">Algo de grind si tiene sentido</option>
          <option value="Alto">Mucho grind si la progresión es profunda</option>
          <option value="Extremo">Grind extremo si la recompensa lo vale</option>
        </select>
      </div>

      <div className="grid" style={{ gap: 8 }}>
        <label>3) El PvP para ti es…</label>
        <select
          className="input"
          value={form.pvpPreference}
          onChange={(e) => setForm({ ...form, pvpPreference: e.target.value })}
        >
          <option value="">Selecciona…</option>
          <option value="Imprescindible">Imprescindible</option>
          <option value="Opcional">Opcional</option>
          <option value="Eventos">Solo en eventos</option>
          <option value="Evitar">Prefiero evitarlo</option>
        </select>
      </div>

      <div className="grid" style={{ gap: 8 }}>
        <label>4) ¿Qué te hace abandonar un servidor? (elige hasta 2)</label>
        <div className="grid" style={{ gap: 8 }}>
          {ABANDON_OPTIONS.map((opt) => {
            const checked = form.abandonReasons.includes(opt);
            const disabled = !checked && form.abandonReasons.length >= 2;
            return (
              <label key={opt} style={{ display: "flex", gap: 10, alignItems: "center", opacity: disabled ? 0.6 : 1 }}>
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  onChange={() => toggleAbandonReason(opt)}
                />
                <span>{opt}</span>
              </label>
            );
          })}
        </div>
        <div className="small">
          Seleccionadas: {form.abandonReasons.length}/2
        </div>
      </div>

      <div className="grid" style={{ gap: 8 }}>
        <label>5) Prefieres un servidor que… (elige 1)</label>
        <select
          className="input"
          value={form.serverPhilosophy}
          onChange={(e) => setForm({ ...form, serverPhilosophy: e.target.value })}
        >
          <option value="">Selecciona…</option>
          <option value="Justo con normas">Muchas normas pero justo</option>
          <option value="Libre con caos">Más libre aunque haya caos</option>
          <option value="Técnico profundo">Muy técnico aunque cueste aprender</option>
          <option value="Simple accesible">Simple aunque menos profundo</option>
        </select>
      </div>

      <div className="grid" style={{ gap: 8 }}>
        <label>6) ¿Cuánto juegas a la semana?</label>
        <select
          className="input"
          value={form.weeklyHours}
          onChange={(e) => setForm({ ...form, weeklyHours: e.target.value })}
        >
          <option value="">Selecciona…</option>
          <option value="<5">&lt; 5 horas</option>
          <option value="5-10">5–10 horas</option>
          <option value="10-20">10–20 horas</option>
          <option value="20+">+20 horas</option>
        </select>
      </div>

      <div className="grid" style={{ gap: 8 }}>
        <label>7) Cuando el servidor esté listo, ¿qué harías?</label>
        <select
          className="input"
          value={form.launchIntent}
          onChange={(e) => setForm({ ...form, launchIntent: e.target.value })}
        >
          <option value="">Selecciona…</option>
          <option value="D1">Entrar el primer día</option>
          <option value="Pronto">Probarlo pronto</option>
          <option value="Sin prisa">Seguirlo sin prisa</option>
          <option value="Curiosidad">Solo curiosidad</option>
        </select>
      </div>

      <div className="grid" style={{ gap: 8 }}>
        <label>Extra (opcional): ¿qué te gustaría que tuviera sí o sí?</label>
        <textarea
          className="input"
          rows={3}
          value={form.freeText}
          onChange={(e) => setForm({ ...form, freeText: e.target.value })}
          placeholder="Ej: economía con subastas, claims, eventos semanales, anticheat fuerte…"
        />
      </div>

      <button className="btn" type="submit" disabled={!canSubmit || loading}>
        {loading ? "Guardando…" : "Unirme como Founder"}
      </button>

      {okMsg && <div className="small success">{okMsg}</div>}
      {errMsg && <div className="small error">{errMsg}</div>}
    </form>
  );
}
