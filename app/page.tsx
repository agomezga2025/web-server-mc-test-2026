import QuizForm from "./components/QuizForm";

export default function HomePage() {
  return (
    <main className="grid grid-2">
      <section className="card">
        <span className="badge">Validación real (no opiniones)</span>
        <h1>Diseñamos un servidor de Minecraft basado en cómo juegas tú</h1>
        <p>
          Haz el quiz (60–90s). Con tus respuestas decidimos modo, filosofía y features.
          Los primeros tendrán acceso anticipado y badge Founder.
        </p>
        <hr />
        <QuizForm />
        <p className="small" style={{ marginTop: 12 }}>
          Datos mínimos: nick + contacto. Puedes dejar solo Discord si prefieres.
        </p>
      </section>

      <aside className="card">
        <h2>¿Qué vas a decidir con esto?</h2>
        <div className="grid">
          <div>
            <span className="badge">Modo de juego que más se vote</span>
            <p className="small">
              Survival economy / PvP competitivo / builders / social, según intención real.
            </p>
          </div>
          <div>
            <span className="badge">Centrarnos en lo que más molesta a nuestros jugadores</span>
            <p className="small">
              Pay to win, toxicidad, lag, economía rota, staff, falta de contenido.
            </p>
          </div>
          <div>
            <span className="badge">Trade-offs</span>
            <p className="small">
              Normas vs libertad, simple vs profundo, técnico vs accesible.
            </p>
          </div>
        </div>

        <hr />

        <h1>Haz la encuesta y entra en el sorteo de premios para el servidor. ¡GRATIS! </h1>
      </aside>
    </main>
  );
}
