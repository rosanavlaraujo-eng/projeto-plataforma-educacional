// Texto gravado no QR Code da folha: identifica a prova e a versão.
// Formato: PROVA-<provaId>-<A|B>

export function gerarTextoQr(provaId, versao) {
  return `PROVA-${provaId}-${versao}`;
}

export function lerTextoQr(texto) {
  const m = /^PROVA-(.+)-([AB])$/.exec(String(texto ?? '').trim());
  if (!m) return null;
  return { provaId: m[1], versao: m[2] };
}
