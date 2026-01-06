import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { data, error } = await supabaseAdmin
    .from("quiz_responses")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    return (
      <div className="card">
        <h1>Admin</h1>
        <p className="error">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h1>Respuestas ({data?.length ?? 0})</h1>
      <p className="small">
        Mostrando últimas 500 respuestas. Exporta desde Supabase si necesitas CSV.
      </p>

      <div style={{ overflowX: "auto" }}>
        <table className="table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Nick</th>
              <th>Contacto</th>
              <th>Estilo</th>
              <th>Grind</th>
              <th>PvP</th>
              <th>Abandona por</th>
              <th>Filosofía</th>
              <th>Horas</th>
              <th>Intención</th>
              <th>Extra</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((r: any) => (
              <tr key={r.id}>
                <td>{new Date(r.created_at).toLocaleString("es-ES")}</td>
                <td>{r.nickname}</td>
                <td>{r.contact ?? ""}</td>
                <td>{r.play_style}</td>
                <td>{r.grind_tolerance}</td>
                <td>{r.pvp_preference}</td>
                <td>{(r.abandon_reasons ?? []).join(", ")}</td>
                <td>{r.server_philosophy}</td>
                <td>{r.weekly_hours}</td>
                <td>{r.launch_intent}</td>
                <td style={{ maxWidth: 320, whiteSpace: "pre-wrap" }}>{r.free_text ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
