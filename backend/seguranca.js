// Senhas nunca são gravadas em texto puro. Tokens de login têm validade de 7 dias.
import { randomBytes, scryptSync, timingSafeEqual, createHash } from 'node:crypto';
import { pegar, executar } from './banco.js';

export function criarSenhaHash(senha) {
  const sal = randomBytes(16).toString('hex');
  return `${sal}:${scryptSync(senha, sal, 64).toString('hex')}`;
}
export function conferirSenha(senha, senhaHash) {
  const [sal, hash] = senhaHash.split(':');
  if (!sal || !hash) return false;
  const esperado = Buffer.from(hash, 'hex');
  const recebido = scryptSync(senha, sal, esperado.length);
  return esperado.length === recebido.length && timingSafeEqual(esperado, recebido);
}
export const hashToken = (token) => createHash('sha256').update(token).digest('hex');

export function criarSessao(usuarioId) {
  const token = randomBytes(32).toString('hex');
  const expira = Date.now() + 7 * 24 * 60 * 60 * 1000;
  executar('INSERT INTO sessoes (token_hash, usuario_id, expira_em) VALUES (?, ?, ?)', hashToken(token), usuarioId, expira);
  return token;
}

export function exigirLogin(req, res, proximo) {
  const autorizacao = req.headers.authorization || '';
  const token = autorizacao.startsWith('Bearer ') ? autorizacao.slice(7) : '';
  if (!/^[0-9a-f]{64}$/.test(token)) return res.status(401).json({ erro: 'Faça login para continuar.' });
  const usuario = pegar(`SELECT usuarios.id, usuarios.nome, usuarios.email, usuarios.plano
    FROM sessoes JOIN usuarios ON usuarios.id = sessoes.usuario_id
    WHERE token_hash = ? AND expira_em > ?`, hashToken(token), Date.now());
  if (!usuario) return res.status(401).json({ erro: 'Sessão inválida ou expirada.' });
  req.usuario = usuario;
  req.token = token;
  proximo();
}
