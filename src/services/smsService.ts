type SmsData = {
  usuario_id: number;
  mensagem: string;
};

const API_URL = import.meta.env["VITE_API_URL"] || "http://localhost:3000";

export async function enviarSms(data: SmsData) {
  const response = await fetch(`${API_URL}/api/sms/enviar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const resultado = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(resultado?.message || "Falha ao enviar SMS.");
  }

  return resultado;
}
