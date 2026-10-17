# Minha parte do trabalho — backend e banco de dados

**Importante:** os arquivos que já existiam no ZIP não foram alterados. O backend antigo tinha somente um README; colocamos os arquivos novos nesta pasta. Também foi criado **um arquivo novo**, `frontend/src/services/apiQuestio.js`, para facilitar a futura integração. Nenhuma página ou componente React existente foi editado.

## 1. Como executar (Windows / VS Code)

1. Instale **Node.js 22.13 ou mais recente**. Verifique no terminal com `node -v`.
2. Abra a pasta `backend` no terminal (no VS Code, clique com o botão direito na pasta e use **Abrir no Terminal Integrado**).
3. Execute:

```powershell
npm.cmd install
npm.cmd start
```

4. Entre em `http://localhost:3001/api/status`. A resposta deve ser:

```json
{"mensagem":"API Questio funcionando!"}
```

5. O banco de dados é criado sozinho na primeira execução em `backend/dados/questio.sqlite`. Não precisa criar conta em serviço externo e **não exclua esse arquivo** se quiser manter seus cadastros.
6. Para parar o servidor, pressione `Ctrl+C`.

**Por que `npm.cmd`?** No Windows, isso também contorna o bloqueio do arquivo `npm.ps1` quando o PowerShell não permite executar scripts.

**Aviso do Node:** a biblioteca `node:sqlite` pode mostrar um aviso de recurso experimental no Node 22. É esperado nessa versão; o projeto usa essa biblioteca para não precisar instalar um banco externo.

### Para rodar as telas das meninas (separado do backend)

Em **outro terminal**:

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

O frontend continua com suas telas demonstrativas. Ele **ainda não chama a API automaticamente**, porque isso exigiria editar os arquivos de login, cadastro e outros componentes da equipe — algo que combinamos não fazer. O arquivo novo `frontend/src/services/apiQuestio.js` está pronto para essas telas importarem depois, quando a equipe autorizar essa integração.

## 2. O que cada arquivo novo faz

| Arquivo | Explicação simples |
|---|---|
| `server.js` | Cria o servidor Express e recebe os pedidos nas rotas. |
| `banco.js` | Cria e acessa as tabelas SQLite. |
| `seguranca.js` | Protege senhas, cria o token de login e confere quem está acessando. |
| `regras.js` | Valida questões, guarda a ordem das versões e configura limites demonstrativos. |
| `package.json` | Lista o Express e os comandos para executar. |
| `test/` | Contém os testes automáticos. |
| `frontend/src/services/apiQuestio.js` | **Arquivo novo** com uma função para as telas chamarem o backend no futuro. |

**O caminho de cada informação:** Tela do professor → chamada à API → `server.js` → `banco.js` → arquivo SQLite. Na volta, a API devolve JSON para a tela.

## 3. Rotas que fizemos

Rota base: `http://localhost:3001/api`

| Método | Rota | O que faz |
|---|---|---|
| GET | `/status` | Verifica se o servidor está ligado. |
| POST | `/usuarios/cadastro` | Cadastra professor. |
| POST | `/usuarios/login` | Confere e-mail/senha e devolve token. |
| GET | `/usuarios/me` | Retorna usuário autenticado. |
| POST | `/usuarios/sair` | Encerra sessão. |
| GET | `/plano` | Consulta plano e limites. |
| PATCH | `/plano` | Muda plano **só na demonstração**. |
| GET / POST | `/questoes` | Lista e cria questões. |
| GET / PUT / DELETE | `/questoes/:id` | Consulta, edita e exclui questão. |
| GET / POST | `/provas` | Lista e cria provas. |
| GET / DELETE | `/provas/:id` | Consulta ou exclui prova. |
| POST / GET | `/provas/:id/versoes` | Salva ou lista versões. |
| GET | `/provas/:id/versoes/:nome` | Consulta uma versão para impressão (sem gabarito). |
| GET | `/provas/:id/gabaritos/:nome` | Consulta o gabarito e o mapeamento. |
| POST / GET | `/resultados` | Salva ou lista resultados de correções. |
| GET | `/resultados/:id` | Consulta um resultado. |
| POST / GET | `/anuncios` | Cadastra e consulta anúncios fictícios. |

**Atenção:** exceto `/status`, `/usuarios/cadastro` e `/usuarios/login`, todas as rotas exigem token no cabeçalho: `Authorization: Bearer SEU_TOKEN`.

## 4. Formato dos dados (exemplos)

### Cadastro

`POST /api/usuarios/cadastro`

```json
{"nome":"Professora Maria","email":"maria@escola.com","senha":"senha12345"}
```

### Login

`POST /api/usuarios/login`

```json
{"email":"maria@escola.com","senha":"senha12345"}
```

A API devolve um `token`. Use-o nas próximas requisições. A senha é gravada como hash, não como texto puro.

### Questão

`POST /api/questoes`

```json
{
  "enunciado": "Quanto é 2 + 2?",
  "alternativas": [
    {"texto":"3", "correta":false},
    {"texto":"4", "correta":true},
    {"texto":"5", "correta":false}
  ]
}
```

A API devolve um `id` numérico. Guarde esse ID para montar a prova.

### Prova

`POST /api/provas`

```json
{"titulo":"Avaliação de Matemática","instituicao":"Escola Exemplo","questoesIds":[1]}
```

O `1` é apenas exemplo: troque pelo **id da questão retornado no cadastro**. Uma prova pode ter várias questões, por exemplo `[1,2,3]`.

### Versão embaralhada

`POST /api/provas/1/versoes`

```json
{
  "nome": "A",
  "ordem": [
    {"questaoId": 1, "alternativas": [2, 0, 1]}
  ]
}
```

Aqui `questaoId: 1` é o exemplo anterior. A lista `[2,0,1]` significa que a terceira alternativa original será a primeira da versão A; a primeira será a segunda; a segunda será a terceira. **Os índices das alternativas começam em zero.** O backend registra a ordem e calcula o gabarito correto a partir da questão original. Para criar a versão B, envie outra ordem com `"nome":"B"`. Se houver mais questões, coloque **todas**, cada uma uma única vez.

O embaralhamento em si fica a cargo do módulo de geração da equipe. O backend **não recria a lógica das meninas**.

### Resultado de correção

`POST /api/resultados`

```json
{
  "provaId": 1,
  "versao": "A",
  "aluno": "João Silva",
  "respostas": ["C"],
  "acertos": 1,
  "nota": 10
}
```

As respostas podem conter `null` para questão sem resposta legível. O número de respostas deve coincidir com a quantidade de questões da versão. O valor de `acertos` e `nota` vem do módulo de correção da Beatriz; **não implementamos leitura de QR Code ou correção de imagens no backend**.

### Planos e anúncios

`PATCH /api/plano` com `{"plano":"premium"}` ou `{"plano":"gratuito"}`.

`POST /api/anuncios` com `{"titulo":"Curso demonstrativo","texto":"Anúncio fictício da plataforma"}`.

`GET /api/anuncios` retorna `mostrar: true` no gratuito e `mostrar: false` (lista vazia) no premium.

**Limites de exemplo** no plano gratuito: 10 questões, 3 provas e 20 resultados. Estes números **NÃO foram definidos pela equipe**; foram colocados apenas para demonstrar o bloqueio e podem ser alterados em `regras.js` depois. O premium não tem esses limites neste protótipo. Sem pagamento real, sem cobrança e sem verificação de assinatura. O cadastro de anúncios é aberto a qualquer usuário logado **somente por ser um protótipo acadêmico**.

## 5. Como testar

Rode dentro de `backend`:

```powershell
npm.cmd test
```

Isso verifica as regras e faz uma sequência de requisições reais para um servidor de teste: cadastro → login → questão → prova → versão/gabarito → resultado → anúncio → premium → sair. Os testes usam banco **em memória** e não mexem nos seus cadastros reais.

Se quiser executar requisições uma por uma no VS Code, deixei também `EXEMPLOS-API.http` (pode abrir com uma extensão de cliente HTTP), ou use Postman.

## 6. O que explicar na apresentação

- **Express** organiza as rotas HTTP (GET consulta, POST cria, PUT edita, DELETE exclui).
- **SQLite** salva as informações em um arquivo no computador. O banco tem tabelas de usuários, sessões, questões, provas, vínculo de questões, versões, resultados e anúncios.
- **Login:** a senha é transformada em hash e a API retorna um token temporário; só o dono consulta seus dados.
- **Provas:** relacionam questões. As versões recebem a ordem embaralhada e salvam uma cópia da ordem, das alternativas e do gabarito.
- **Correções:** a API recebe a nota pronta do módulo de correção e armazena o histórico.
- **Planos:** a API limita quantos registros um usuário gratuito pode criar, usando números provisórios para demonstração.
- **Anúncios:** são fictícios e só aparecem na resposta da API para quem está no gratuito.

**Limitação deliberada:** as telas existentes seguem intactas; terminar a integração visual exige que a equipe autorize pequenas edições nos componentes que hoje exibem alertas demonstrativos. O SQLite é ótimo para rodar localmente na faculdade, mas não é uma configuração de banco recomendada para hospedagem sem armazenamento persistente.
