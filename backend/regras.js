// Regras simples e isoladas para facilitar a apresentação na faculdade.
export const LIMITES_GRATUITOS = { questoes: 10, provas: 3, resultados: 20 };
export const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function ehTexto(texto, limite = 255) {
  return typeof texto === 'string' && texto.trim().length > 0 && texto.trim().length <= limite;
}
export function ehId(valor) {
  return Number.isSafeInteger(Number(valor)) && Number(valor) > 0 && String(valor).trim() !== '';
}
export function validarQuestao(dados) {
  const { enunciado, alternativas } = dados && typeof dados === 'object' ? dados : {};
  if (!ehTexto(enunciado, 2000)) return 'Informe o enunciado (até 2000 caracteres).';
  if (!Array.isArray(alternativas) || alternativas.length < 2 || alternativas.length > 26) {
    return 'Informe de 2 a 26 alternativas.';
  }
  if (!alternativas.every(a => a && ehTexto(a.texto, 500) && typeof a.correta === 'boolean')) {
    return 'Cada alternativa deve ter texto e correta (true/false).';
  }
  if (alternativas.filter(a => a.correta).length !== 1) {
    return 'Marque exatamente uma alternativa correta.';
  }
  return null;
}

// Recebe a ordem definida pelo módulo de provas da equipe, SEM gerar/embaralhar por conta própria.
// Exemplo: [{questaoId: 7, alternativas: [2, 0, 1]}] (índices começam em ZERO).
export function montarVersao(ordem, questoesOriginais) {
  if (!Array.isArray(ordem) || ordem.length !== questoesOriginais.length || !ordem.length) {
    throw new Error('A versão deve conter todas as questões da prova uma vez cada.');
  }
  const porId = new Map(questoesOriginais.map(q => [q.id, q]));
  const vistos = new Set();
  const questoes = [];
  const gabarito = [];
  const mapeamento = [];
  ordem.forEach((item, indiceQuestao) => {
    const id = item?.questaoId;
    const original = porId.get(id);
    if (!original || vistos.has(id)) throw new Error('Questão duplicada ou não pertence a esta prova.');
    vistos.add(id);
    const alternativas = JSON.parse(original.alternativas_json);
    const indices = item.alternativas;
    if (!Array.isArray(indices) || indices.length !== alternativas.length ||
        new Set(indices).size !== alternativas.length ||
        indices.some(i => !Number.isInteger(i) || i < 0 || i >= alternativas.length)) {
      throw new Error('Ordem de alternativas inválida. Use índices de 0 até N-1 sem repetir.');
    }
    const exibidas = indices.map((originalIdx, pos) => ({
      letra: LETRAS[pos], texto: alternativas[originalIdx].texto
    }));
    const correta = indices.findIndex(i => alternativas[i].correta);
    questoes.push({ id, enunciado: original.enunciado, alternativas: exibidas });
    gabarito.push(LETRAS[correta]);
    mapeamento.push({
      posicao: indiceQuestao + 1, questaoOriginalId: id,
      alternativas: indices.map((originalIdx, pos) => ({
        letra: LETRAS[pos], alternativaOriginal: originalIdx
      }))
    });
  });
  return { questoes, gabarito, mapeamento };
}
