// SQLite: banco local salvo automaticamente em backend/dados/questio.sqlite.
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const pastaAtual = dirname(fileURLToPath(import.meta.url));
const caminho = process.env.DB_PATH || join(pastaAtual, 'dados', 'questio.sqlite');
if (caminho !== ':memory:') mkdirSync(dirname(caminho), { recursive: true });

export const banco = new DatabaseSync(caminho);
banco.exec('PRAGMA foreign_keys = ON');
banco.exec('PRAGMA journal_mode = WAL');

banco.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha_hash TEXT NOT NULL,
    plano TEXT NOT NULL DEFAULT 'gratuito',
    criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS sessoes (
    token_hash TEXT PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    expira_em INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS questoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    enunciado TEXT NOT NULL,
    alternativas_json TEXT NOT NULL,
    criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS provas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    instituicao TEXT NOT NULL,
    criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS prova_questoes (
    prova_id INTEGER NOT NULL REFERENCES provas(id) ON DELETE CASCADE,
    questao_id INTEGER NOT NULL REFERENCES questoes(id) ON DELETE CASCADE,
    PRIMARY KEY (prova_id, questao_id)
  );
  CREATE TABLE IF NOT EXISTS versoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prova_id INTEGER NOT NULL REFERENCES provas(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    questoes_json TEXT NOT NULL,
    gabarito_json TEXT NOT NULL,
    mapeamento_json TEXT NOT NULL,
    UNIQUE (prova_id, nome)
  );
  CREATE TABLE IF NOT EXISTS resultados (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prova_id INTEGER NOT NULL REFERENCES provas(id) ON DELETE CASCADE,
    versao_id INTEGER NOT NULL REFERENCES versoes(id) ON DELETE CASCADE,
    aluno TEXT NOT NULL,
    respostas_json TEXT NOT NULL,
    acertos INTEGER NOT NULL,
    erros INTEGER NOT NULL,
    nota REAL NOT NULL,
    criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS anuncios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    texto TEXT NOT NULL,
    criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

export const pegar = (sql, ...parametros) => banco.prepare(sql).get(...parametros);
export const listar = (sql, ...parametros) => banco.prepare(sql).all(...parametros);
export const executar = (sql, ...parametros) => banco.prepare(sql).run(...parametros);
