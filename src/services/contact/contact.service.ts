export type ContactPayload = {
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
};

export async function sendContactMessage(data: ContactPayload) {
  const resp = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!resp.ok) {
    const msg = await resp.text().catch(() => "");
    throw new Error(msg || "No se pudo enviar el mensaje.");
  }
  return resp.json();
}
