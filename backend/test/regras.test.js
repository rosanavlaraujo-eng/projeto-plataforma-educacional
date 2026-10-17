import test from 'node:test';
import assert from 'node:assert/strict';
import { validarQuestao, montarVersao } from '../regras.js';

const exemplo = {
  enunciado: 'Quanto é 2 + 2?',
  alternativas: [{ texto: '3', correta: false }, { texto: '4', correta: true }]
};

test('questão deve ter somente uma alternativa correta', () => {
  assert.equal(validarQuestao(exemplo), null);
  assert.match(validarQuestao({ ...exemplo, alternativas: [{ texto: '3', correta: false }, { texto: '4', correta: false }] }), /exatamente uma/);
  assert.match(validarQuestao(null), /enunciado/);
});

test('versão salva gabarito e mapeamento na ordem informada', () => {
  const originais = [{ id: 5, enunciado: exemplo.enunciado, alternativas_json: JSON.stringify(exemplo.alternativas) }];
  const versao = montarVersao([{ questaoId: 5, alternativas: [1, 0] }], originais);
  assert.equal(versao.questoes[0].alternativas[0].texto, '4');
  assert.deepEqual(versao.gabarito, ['A']);
  assert.equal(versao.mapeamento[0].alternativas[0].alternativaOriginal, 1);
  assert.equal(versao.questoes[0].alternativas[0].correta, undefined);
  assert.throws(() => montarVersao([{ questaoId: 5, alternativas: [0, 0] }], originais), /inválida/);
});
