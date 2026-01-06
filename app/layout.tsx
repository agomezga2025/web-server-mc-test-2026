import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Minecraft Server Validator",
  description: "Quiz + Waitlist para validar el servidor multijugador"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div className="container">{children}</div>
      </body>
    </html>
  );
}
