// Backend Questio - somente as rotas de API. Nenhuma tela React é alterada.
import express from 'express';
import { banco, pegar, listar, executar } from './banco.js';
import { criarSenhaHash, conferirSenha, criarSessao, exigirLogin, hashToken } from './seguranca.js';
import { ehTexto, ehId, validarQuestao, montarVersao, LIMITES_GRATUITOS, LETRAS } from './regras.js';

const app = express();
const PORTA = Number(process.env.PORT || 3001);
app.use(express.json({ limit: '200kb' }));

// Autoriza somente o frontend local durante o desenvolvimento.
app.use((req, res, next) => {
  const origem = req.headers.origin;
  const permitidas = (process.env.FRONTEND_URL || 'http://localhost:5173,http://127.0.0.1:5173').split(',');
  if (origem && permitidas.includes(origem)) {
    res.setHeader('Access-Control-Allow-Origin', origem);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  }
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

const erro = (res, mensagem, status = 400) => res.status(status).json({ erro: mensagem });
const minhaProva = (id, usuarioId) => pegar('SELECT * FROM provas WHERE id = ? AND usuario_id = ?', id, usuarioId);
const minhaQuestao = (id, usuarioId) => pegar('SELECT * FROM questoes WHERE id = ? AND usuario_id = ?', id, usuarioId);
const verificarLimite = (req, res, tipo, total) => {
  if (req.usuario.plano === 'gratuito' && total >= LIMITES_GRATUITOS[tipo]) {
    erro(res, `Limite do plano gratuito para ${tipo} atingido (${LIMITES_GRATUITOS[tipo]}).`, 403);
    return false;
  }
  return true;
};
const formatarQuestao = q => ({ ...q, alternativas: JSON.parse(q.alternativas_json), alternativas_json: undefined });
const formatarResultado = r => ({ ...r, respostas: JSON.parse(r.respostas_json), respostas_json: undefined });

app.get('/api/status', (req, res) => res.json({ mensagem: 'API Questio funcionando!' }));

// 1) Cadastro e login
app.post('/api/usuarios/cadastro', (req, res) => {
  const { nome, email, senha } = req.body || {};
  if (!ehTexto(nome, 100) || !ehTexto(email, 254) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      typeof senha !== 'string' || senha.length < 8 || senha.length > 128) {
    return erro(res, 'Informe nome, e-mail válido e senha de 8 a 128 caracteres.');
  }
  const emailLimpo = email.trim().toLowerCase();
  if (pegar('SELECT id FROM usuarios WHERE email = ?', emailLimpo)) return erro(res, 'E-mail já cadastrado.', 409);
  const id = executar('INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)',
    nome.trim(), emailLimpo, criarSenhaHash(senha)).lastInsertRowid;
  res.status(201).json({ id, nome: nome.trim(), email: emailLimpo, plano: 'gratuito' });
});

app.post('/api/usuarios/login', (req, res) => {
  const { email, senha } = req.body || {};
  if (typeof email !== 'string' || typeof senha !== 'string') return erro(res, 'Informe e-mail e senha.');
  const usuario = pegar('SELECT * FROM usuarios WHERE email = ?', email.trim().toLowerCase());
  if (!usuario || !conferirSenha(senha, usuario.senha_hash)) return erro(res, 'E-mail ou senha incorretos.', 401);
  const token = criarSessao(usuario.id);
  res.json({ token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, plano: usuario.plano } });
});

app.use('/api', exigirLogin);
app.get('/api/usuarios/me', (req, res) => res.json(req.usuario));
app.post('/api/usuarios/sair', (req, res) => {
  executar('DELETE FROM sessoes WHERE token_hash = ?', hashToken(req.token));
  res.json({ mensagem: 'Sessão encerrada.' });
});

// 2) Planos de demonstração. Os limites são PROVISÓRIOS e estão em regras.js.
app.get('/api/plano', (req, res) => res.json({
  plano: req.usuario.plano,
  limitesGratuitos: LIMITES_GRATUITOS,
  anuncios: req.usuario.plano === 'gratuito',
  demonstrativo: true
}));
app.patch('/api/plano', (req, res) => {
  const { plano } = req.body || {};
  if (!['gratuito', 'premium'].includes(plano)) return erro(res, 'Use gratuito ou premium.');
  executar('UPDATE usuarios SET plano = ? WHERE id = ?', plano, req.usuario.id);
  res.json({ plano, demonstrativo: true, mensagem: 'Alterado apenas para demonstração, sem pagamento.' });
});

// 3) Questões: criar, listar, consultar, editar e excluir.
app.get('/api/questoes', (req, res) => {
  res.json(listar('SELECT * FROM questoes WHERE usuario_id = ? ORDER BY id DESC', req.usuario.id).map(formatarQuestao));
});
app.get('/api/questoes/:id', (req, res) => {
  const q = minhaQuestao(req.params.id, req.usuario.id);
  return q ? res.json(formatarQuestao(q)) : erro(res, 'Questão não encontrada.', 404);
});
app.post('/api/questoes', (req, res) => {
  const aviso = validarQuestao(req.body);
  if (aviso) return erro(res, aviso);
  const total = pegar('SELECT COUNT(*) AS total FROM questoes WHERE usuario_id = ?', req.usuario.id).total;
  if (!verificarLimite(req, res, 'questoes', total)) return;
  const { enunciado, alternativas } = req.body;
  const id = executar('INSERT INTO questoes (usuario_id, enunciado, alternativas_json) VALUES (?, ?, ?)',
    req.usuario.id, enunciado.trim(), JSON.stringify(alternativas.map(a => ({ texto: a.texto.trim(), correta: a.correta })))).lastInsertRowid;
  res.status(201).json(formatarQuestao(minhaQuestao(id, req.usuario.id)));
});
app.put('/api/questoes/:id', (req, res) => {
  if (!minhaQuestao(req.params.id, req.usuario.id)) return erro(res, 'Questão não encontrada.', 404);
  const aviso = validarQuestao(req.body);
  if (aviso) return erro(res, aviso);
  const { enunciado, alternativas } = req.body;
  executar('UPDATE questoes SET enunciado = ?, alternativas_json = ? WHERE id = ?', enunciado.trim(),
    JSON.stringify(alternativas.map(a => ({ texto: a.texto.trim(), correta: a.correta }))), req.params.id);
  res.json(formatarQuestao(minhaQuestao(req.params.id, req.usuario.id)));
});
app.delete('/api/questoes/:id', (req, res) => {
  if (!minhaQuestao(req.params.id, req.usuario.id)) return erro(res, 'Questão não encontrada.', 404);
  executar('DELETE FROM questoes WHERE id = ?', req.params.id);
  res.json({ mensagem: 'Questão excluída.' });
});

// 4) Provas: associam questões previamente cadastradas pelo mesmo usuário.
app.get('/api/provas', (req, res) => {
  res.json(listar('SELECT * FROM provas WHERE usuario_id = ? ORDER BY id DESC', req.usuario.id));
});
app.get('/api/provas/:id', (req, res) => {
  const prova = minhaProva(req.params.id, req.usuario.id);
  if (!prova) return erro(res, 'Prova não encontrada.', 404);
  const questoes = listar(`SELECT questoes.* FROM questoes JOIN prova_questoes ON questoes.id = prova_questoes.questao_id
    WHERE prova_questoes.prova_id = ? ORDER BY questoes.id`, prova.id).map(formatarQuestao);
  const versoes = listar('SELECT nome FROM versoes WHERE prova_id = ? ORDER BY nome', prova.id).map(v => v.nome);
  res.json({ ...prova, questoes, versoes });
});
app.post('/api/provas', (req, res) => {
  const { titulo, instituicao, questoesIds } = req.body || {};
  if (!ehTexto(titulo, 150) || !ehTexto(instituicao, 150) || !Array.isArray(questoesIds) || !questoesIds.length ||
      !questoesIds.every(ehId) || new Set(questoesIds.map(Number)).size !== questoesIds.length) {
    return erro(res, 'Informe título, instituição e lista de IDs de questões sem repetir.');
  }
  if (!questoesIds.every(id => minhaQuestao(id, req.usuario.id))) return erro(res, 'Questão inválida ou de outro usuário.');
  const total = pegar('SELECT COUNT(*) AS total FROM provas WHERE usuario_id = ?', req.usuario.id).total;
  if (!verificarLimite(req, res, 'provas', total)) return;
  banco.exec('BEGIN');
  let id;
  try {
    id = executar('INSERT INTO provas (usuario_id, titulo, instituicao) VALUES (?, ?, ?)',
      req.usuario.id, titulo.trim(), instituicao.trim()).lastInsertRowid;
    for (const questaoId of questoesIds) executar('INSERT INTO prova_questoes (prova_id, questao_id) VALUES (?, ?)', id, questaoId);
    banco.exec('COMMIT');
  } catch (e) { banco.exec('ROLLBACK'); throw e; }
  res.status(201).json({ id, titulo: titulo.trim(), instituicao: instituicao.trim(), questoesIds });
});
app.delete('/api/provas/:id', (req, res) => {
  if (!minhaProva(req.params.id, req.usuario.id)) return erro(res, 'Prova não encontrada.', 404);
  executar('DELETE FROM provas WHERE id = ?', req.params.id);
  res.json({ mensagem: 'Prova excluída.' });
});

// 5) Versões, ordem embaralhada e gabarito. O embaralhamento é feito pelo módulo da equipe.
app.post('/api/provas/:id/versoes', (req, res) => {
  const prova = minhaProva(req.params.id, req.usuario.id);
  if (!prova) return erro(res, 'Prova não encontrada.', 404);
  const { nome, ordem } = req.body || {};
  if (typeof nome !== 'string' || !/^[A-Z]$/.test(nome)) return erro(res, 'Nome da versão deve ser uma letra maiúscula (ex.: A ou B).');
  if (pegar('SELECT id FROM versoes WHERE prova_id = ? AND nome = ?', prova.id, nome)) return erro(res, 'Esta versão já foi cadastrada.', 409);
  const originais = listar(`SELECT questoes.* FROM questoes JOIN prova_questoes ON questoes.id = prova_questoes.questao_id
    WHERE prova_questoes.prova_id = ? ORDER BY questoes.id`, prova.id);
  let versao;
  try { versao = montarVersao(ordem, originais); }
  catch (e) { return erro(res, e.message); }
  const id = executar(`INSERT INTO versoes (prova_id, nome, questoes_json, gabarito_json, mapeamento_json)
    VALUES (?, ?, ?, ?, ?)`, prova.id, nome, JSON.stringify(versao.questoes), JSON.stringify(versao.gabarito),
  JSON.stringify(versao.mapeamento)).lastInsertRowid;
  res.status(201).json({ id, provaId: prova.id, nome, ...versao });
});
app.get('/api/provas/:id/versoes', (req, res) => {
  if (!minhaProva(req.params.id, req.usuario.id)) return erro(res, 'Prova não encontrada.', 404);
  res.json(listar('SELECT id, nome FROM versoes WHERE prova_id = ? ORDER BY nome', req.params.id));
});
app.get('/api/provas/:id/versoes/:nome', (req, res) => {
  if (!minhaProva(req.params.id, req.usuario.id)) return erro(res, 'Prova não encontrada.', 404);
  const versao = pegar('SELECT id, nome, questoes_json FROM versoes WHERE prova_id = ? AND nome = ?', req.params.id, req.params.nome);
  if (!versao) return erro(res, 'Versão não encontrada.', 404);
  res.json({ id: versao.id, nome: versao.nome, questoes: JSON.parse(versao.questoes_json) });
});
app.get('/api/provas/:id/gabaritos/:nome', (req, res) => {
  if (!minhaProva(req.params.id, req.usuario.id)) return erro(res, 'Prova não encontrada.', 404);
  const versao = pegar('SELECT gabarito_json, mapeamento_json FROM versoes WHERE prova_id = ? AND nome = ?', req.params.id, req.params.nome);
  if (!versao) return erro(res, 'Gabarito não encontrado.', 404);
  res.json({ nome: req.params.nome, gabarito: JSON.parse(versao.gabarito_json), mapeamento: JSON.parse(versao.mapeamento_json) });
});

// 6) Resultados: o módulo de correção lê a folha e manda o resultado pronto para esta rota.
app.post('/api/resultados', (req, res) => {
  const { provaId, versao, aluno, respostas, acertos, nota } = req.body || {};
  if (!ehId(provaId) || !minhaProva(provaId, req.usuario.id)) return erro(res, 'Prova não encontrada.', 404);
  const v = pegar('SELECT * FROM versoes WHERE prova_id = ? AND nome = ?', provaId, versao);
  if (!v) return erro(res, 'Versão não encontrada.', 404);
  const questoesDaVersao = JSON.parse(v.questoes_json);
  const totalQuestoes = questoesDaVersao.length;
  if (!ehTexto(aluno, 150) || !Array.isArray(respostas) || respostas.length !== totalQuestoes ||
      !respostas.every((r, i) => r === null || (typeof r === 'string' && LETRAS.slice(0, questoesDaVersao[i].alternativas.length).includes(r))) ||
      !Number.isInteger(acertos) || acertos < 0 || acertos > totalQuestoes ||
      typeof nota !== 'number' || !Number.isFinite(nota) || nota < 0 || nota > 10) {
    return erro(res, 'Informe aluno, respostas (letras ou null), acertos e nota de 0 a 10.');
  }
  const total = pegar(`SELECT COUNT(*) AS total FROM resultados JOIN provas ON provas.id = resultados.prova_id
    WHERE provas.usuario_id = ?`, req.usuario.id).total;
  if (!verificarLimite(req, res, 'resultados', total)) return;
  const id = executar(`INSERT INTO resultados (prova_id, versao_id, aluno, respostas_json, acertos, erros, nota)
    VALUES (?, ?, ?, ?, ?, ?, ?)`, provaId, v.id, aluno.trim(), JSON.stringify(respostas), acertos,
  totalQuestoes - acertos, nota).lastInsertRowid;
  res.status(201).json(formatarResultado(pegar('SELECT * FROM resultados WHERE id = ?', id)));
});
app.get('/api/resultados', (req, res) => {
  res.json(listar(`SELECT resultados.* FROM resultados JOIN provas ON provas.id = resultados.prova_id
    WHERE provas.usuario_id = ? ORDER BY resultados.id DESC`, req.usuario.id).map(formatarResultado));
});
app.get('/api/resultados/:id', (req, res) => {
  const r = pegar(`SELECT resultados.* FROM resultados JOIN provas ON provas.id = resultados.prova_id
    WHERE resultados.id = ? AND provas.usuario_id = ?`, req.params.id, req.usuario.id);
  return r ? res.json(formatarResultado(r)) : erro(res, 'Resultado não encontrado.', 404);
});

// 7) Anúncios fictícios: usuários gratuitos os veem; premium recebe lista vazia.
app.get('/api/anuncios', (req, res) => {
  const mostrar = req.usuario.plano === 'gratuito';
  res.json({ mostrar, anuncios: mostrar ? listar('SELECT id, titulo, texto FROM anuncios ORDER BY id DESC') : [] });
});
app.post('/api/anuncios', (req, res) => {
  const { titulo, texto } = req.body || {};
  if (!ehTexto(titulo, 100) || !ehTexto(texto, 500)) return erro(res, 'Informe título e texto do anúncio fictício.');
  // Protótipo acadêmico: qualquer usuário autenticado pode inserir anúncio de teste.
  const id = executar('INSERT INTO anuncios (titulo, texto) VALUES (?, ?)', titulo.trim(), texto.trim()).lastInsertRowid;
  res.status(201).json({ id, titulo: titulo.trim(), texto: texto.trim(), demonstrativo: true });
});

app.use((req, res) => erro(res, 'Rota não encontrada.', 404));
app.use((falha, req, res, next) => {
  if (falha.type === 'entity.parse.failed') return erro(res, 'JSON inválido.');
  console.error('Erro da API:', falha);
  erro(res, 'Erro interno da API.', 500);
});

// Testes podem importar o aplicativo sem ligar a porta.
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORTA, () => console.log(`API Questio funcionando em http://localhost:${PORTA}/api/status`));
}
export default app;
