import { getCurrentLocation } from "./locationService";
import { enviarSms } from "./smsService";

type HandleAssaultParams = {
  usuario_id: number;
};

export async function handleAssault({ usuario_id }: HandleAssaultParams) {
  // 1. Obter localização GPS
  const location = await getCurrentLocation();

  // 2. Criar link do Google Maps
  const mapLink = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;

  // 3. Preparar mensagem
  const mensagem =
    `SOCORRO! Estou em perigo. Preciso de ajuda urgente. ` + `A minha localização é: ${mapLink}`;

  // 4. Enviar SMS
  return await enviarSms({
    usuario_id,
    mensagem,
  });
}
