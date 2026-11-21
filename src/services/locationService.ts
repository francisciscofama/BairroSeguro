export type UserLocation = {
  latitude: number;
  longitude: number;
};

export function getCurrentLocation(): Promise<UserLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Este dispositivo não suporta localização GPS."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          reject(new Error("Autorize o acesso à localização para continuar."));
        } else if (error.code === error.TIMEOUT) {
          reject(new Error("O tempo para obter a localização terminou."));
        } else {
          reject(new Error("Não foi possível obter a localização."));
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  });
}
