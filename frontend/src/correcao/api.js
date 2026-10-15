// Envio dos resultados ao backend (rota a ser confirmada com o módulo de backend).
const API_URL = import.meta.env?.VITE_API_URL ?? 'http://localhost:3000/api';

export async function enviarResultado(payload) {
  const resp = await fetch(`${API_URL}/correcoes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!resp.ok) throw new Error('Não foi possível salvar o resultado.');
  return resp.json();
}
