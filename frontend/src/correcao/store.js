// Provas geradas na tela de Questões, guardadas para a correção.
// Por enquanto fica em memória (válido enquanto o app estiver aberto).
// Quando o backend existir, esta lista passa a vir da API.

const provas = new Map();

export function registrarProva({ provaId, titulo, versoesProva }) {
  provas.set(provaId, {
    provaId,
    titulo,
    versoesProva,
    criadaEm: new Date().toISOString(),
  });
}

export function listarProvas() {
  return [...provas.values()];
}

export function buscarProva(provaId) {
  return provas.get(provaId) ?? null;
}
