// Testa as rotas sem tocar no banco real (usa SQLite somente em memória).
import test from 'node:test';
import assert from 'node:assert/strict';

process.env.NODE_ENV = 'test';
process.env.DB_PATH = ':memory:';
const { default: app } = await import('../server.js');

test('API: cadastro, login, questões, prova, gabarito, resultado, planos e anúncios', async () => {
  const servidor = app.listen(0);
  await new Promise(resolve => servidor.once('listening', resolve));
  const url = `http://127.0.0.1:${servidor.address().port}`;
  let token = '';
  const requisitar = async (metodo, rota, dados, autenticado = true) => {
    const resposta = await fetch(url + rota, {
      method: metodo,
      headers: {
        'Content-Type': 'application/json',
        ...(autenticado && token ? { Authorization: `Bearer ${token}` } : {})
      },
      ...(dados !== undefined ? { body: JSON.stringify(dados) } : {})
    });
    return { status: resposta.status, dados: await resposta.json() };
  };
  try {
    assert.equal((await requisitar('GET', '/api/status')).status, 200);
    assert.equal((await requisitar('GET', '/api/questoes')).status, 401);

    const cadastro = await requisitar('POST', '/api/usuarios/cadastro',
      { nome: 'Professora Teste', email: 'PROF@exemplo.com', senha: 'senhaTeste123' }, false);
    assert.equal(cadastro.status, 201);
    assert.equal(cadastro.dados.plano, 'gratuito');
    assert.equal((await requisitar('POST', '/api/usuarios/cadastro',
      { nome: 'Duplicada', email: 'prof@exemplo.com', senha: 'senhaTeste123' }, false)).status, 409);
    assert.equal((await requisitar('POST', '/api/usuarios/login',
      { email: 'prof@exemplo.com', senha: 'errada' }, false)).status, 401);
    const login = await requisitar('POST', '/api/usuarios/login',
      { email: 'prof@exemplo.com', senha: 'senhaTeste123' }, false);
    assert.equal(login.status, 200);
    token = login.dados.token;
    assert.ok(token);

    assert.equal((await requisitar('POST', '/api/questoes', { enunciado: 'Inválida', alternativas: [] })).status, 400);
    const q = await requisitar('POST', '/api/questoes', {
      enunciado: 'Quanto é 2+2?', alternativas: [{ texto: '3', correta: false }, { texto: '4', correta: true }]
    });
    assert.equal(q.status, 201);
    const qid = q.dados.id;
    assert.equal((await requisitar('GET', `/api/questoes/${qid}`)).dados.enunciado, 'Quanto é 2+2?');
    assert.equal((await requisitar('PUT', `/api/questoes/${qid}`, {
      enunciado: 'Quanto é 2 + 2?', alternativas: [{ texto: '3', correta: false }, { texto: '4', correta: true }]
    })).status, 200);

    const p = await requisitar('POST', '/api/provas', {
      titulo: 'Matemática', instituicao: 'Escola Exemplo', questoesIds: [qid]
    });
    assert.equal(p.status, 201);
    const pid = p.dados.id;
    assert.equal((await requisitar('GET', `/api/provas/${pid}`)).dados.questoes.length, 1);
    assert.equal((await requisitar('POST', `/api/provas/${pid}/versoes`, {
      nome: 'A', ordem: [{ questaoId: qid, alternativas: [0, 0] }]
    })).status, 400);
    const v = await requisitar('POST', `/api/provas/${pid}/versoes`, {
      nome: 'A', ordem: [{ questaoId: qid, alternativas: [1, 0] }]
    });
    assert.equal(v.status, 201);
    assert.deepEqual(v.dados.gabarito, ['A']);
    assert.deepEqual((await requisitar('GET', `/api/provas/${pid}/gabaritos/A`)).dados.gabarito, ['A']);
    const versaoAluno = (await requisitar('GET', `/api/provas/${pid}/versoes/A`)).dados;
    assert.equal(versaoAluno.questoes[0].alternativas[0].correta, undefined);

    const r = await requisitar('POST', '/api/resultados', {
      provaId: pid, versao: 'A', aluno: 'Aluno Exemplo', respostas: ['A'], acertos: 1, nota: 10
    });
    assert.equal(r.status, 201);
    assert.equal(r.dados.erros, 0);
    assert.equal((await requisitar('GET', '/api/resultados')).dados.length, 1);

    assert.equal((await requisitar('GET', '/api/anuncios')).dados.mostrar, true);
    assert.equal((await requisitar('POST', '/api/anuncios', { titulo: 'Anúncio fictício', texto: 'Texto de demonstração' })).status, 201);
    assert.equal((await requisitar('GET', '/api/anuncios')).dados.anuncios.length, 1);
    assert.equal((await requisitar('PATCH', '/api/plano', { plano: 'premium' })).status, 200);
    assert.equal((await requisitar('GET', '/api/anuncios')).dados.anuncios.length, 0);
    assert.equal((await requisitar('POST', '/api/usuarios/sair')).status, 200);
    assert.equal((await requisitar('GET', '/api/resultados')).status, 401);
  } finally {
    await new Promise((resolve, reject) => servidor.close(err => err ? reject(err) : resolve()));
  }
});
