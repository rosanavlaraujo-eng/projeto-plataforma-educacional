
const CHAVE = "questio_historico_correcoes_v1";

export function listarHistorico() {
  try {
    const dados = JSON.parse(localStorage.getItem(CHAVE) || "[]");
    return Array.isArray(dados) ? dados : [];
  } catch {
    return [];
  }
}

export function adicionarHistorico(dados) {
  const registro = {
    ...dados,
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`,
    dataCorrecao: new Date().toISOString(),
  };

  const atual = listarHistorico();
  localStorage.setItem(CHAVE, JSON.stringify([registro, ...atual]));

  return registro;
}

export function excluirHistorico(id) {
  const atual = listarHistorico();
  localStorage.setItem(
    CHAVE,
    JSON.stringify(atual.filter((item) => item.id !== id))
  );
}
