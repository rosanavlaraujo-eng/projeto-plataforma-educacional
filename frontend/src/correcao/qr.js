// Decodificação do QR Code a partir da imagem (usa a biblioteca jsqr).
import jsQR from 'jsqr';

export function lerQrCode(imagem) {
  const r = jsQR(imagem.data, imagem.width, imagem.height, {
    inversionAttempts: 'attemptBoth',
  });
  return r ? r.data : null;
}
