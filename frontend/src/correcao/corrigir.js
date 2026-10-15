// Comparação das respostas lidas com o gabarito da versão da prova.

import { LETRAS } from './layoutFolha.js';

// Gabarito no formato da tela de Questões: versoesProva.A = [{ alternativas: [{ correta }] }]
// Já considera o embaralhamento, pois a letra sai da posição real de cada alternativa.
export function gabaritoDaVersao(versoesProva, versao) {
  const questoes = versoesProva?.[versao];
  if (!questoes) throw new Error(`Versão ${versao} não encontrada na prova.`);

  return questoes.map((q, i) => {
    const idx = q.alternativas.findIndex((alt) => alt.correta);
    if (idx < 0) throw new Error(`A questão ${i + 1} não tem alternativa correta.`);
    return LETRAS[idx];
  });
}

// leitura: [{ numero, resposta }] — resposta pode ser letra ou um dos estados especiais.
// Regras:
//  - BRANCO e MULTIPLA valem zero (MULTIPLA é anulada)
//  - DUVIDOSA não conta até ser revisada manualmente; a nota fica provisória
export function corrigirFolha({ leitura, gabarito, pontuacaoMaxima = 10 }) {
  if (leitura.length !== gabarito.length) {
    throw new Error('Número de respostas lidas diferente do gabarito.');
  }

  let acertos = 0;
  let erros = 0;
  let brancos = 0;
  let multiplas = 0;
  let duvidosas = 0;

  const detalhes = leitura.map((q, i) => {
    const correta = gabarito[i];
    let situacao;

    if (q.resposta === 'BRANCO') {
      brancos++;
      situacao = 'branco';
    } else if (q.resposta === 'MULTIPLA') {
      multiplas++;
      situacao = 'multipla';
    } else if (q.resposta === 'DUVIDOSA') {
      duvidosas++;
      situacao = 'revisar';
    } else if (q.resposta === correta) {
      acertos++;
      situacao = 'acerto';
    } else {
      erros++;
      situacao = 'erro';
    }

    return { numero: q.numero, marcada: q.resposta, correta, situacao };
  });

  const total = gabarito.length;
  const nota = total ? Math.round((acertos / total) * pontuacaoMaxima * 10) / 10 : 0;

  return {
    total,
    acertos,
    erros,
    brancos,
    multiplas,
    duvidosas,
    nota,
    provisoria: duvidosas > 0,
    detalhes,
  };
}
