# Questio — Plataforma de Avaliações Educacionais

O **Questio** é uma plataforma web desenvolvida para facilitar a criação, organização e correção de avaliações educacionais.

O projeto busca otimizar o trabalho dos professores por meio da geração de provas, identificação por QR Code e acompanhamento dos resultados dos alunos.

## Funcionalidades

- Cadastro e gerenciamento de questões de múltipla escolha.
- Criação de avaliações com identificação da instituição, disciplina, professor e turma.
- Geração de versões A e B com embaralhamento das questões e alternativas.
- Geração de provas com QR Code.
- Geração de folhas de respostas padronizadas.
- Correção de folhas de respostas por imagem, com revisão manual das marcações.
- Cálculo de notas, acertos e erros.
- Visualização de resultados e histórico de correções.
- Interface com navegação lateral.
- Telas demonstrativas de planos e anúncios.

## Tecnologias utilizadas

**Frontend**
- React
- JavaScript
- Vite
- HTML e CSS
- React Router

**Backend**
- Node.js
- Express

**Bibliotecas**
- `qrcode.react` e `qrcode` — geração de QR Codes.
- `jsqr` — leitura de QR Codes em imagens.

## Como executar

### Pré-requisitos

- Node.js e npm instalados.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Abra no navegador o endereço informado pelo Vite.

### Backend

```bash
cd backend
npm install
```

Execute o comando de inicialização definido no `package.json` do backend.

## Fluxo de utilização

1. O professor acessa a plataforma.
2. Cadastra as questões e indica as respostas corretas.
3. Gera as versões A e B da avaliação.
4. Imprime a prova e a folha de respostas.
5. O aluno preenche a folha.
6. O professor envia uma imagem da folha padronizada para correção.
7. O sistema identifica as marcações e calcula o resultado.
8. O professor revisa as respostas e salva a correção.
9. Os resultados ficam disponíveis para consulta.

## Estado do projeto

O Questio é um **protótipo acadêmico funcional**, em desenvolvimento.

A leitura automática foi implementada para a folha de respostas padronizada. O cartão compacto incorporado à primeira página da prova ainda está em fase de desenvolvimento e validação.

O histórico local utiliza armazenamento no navegador, não substituindo a persistência centralizada em banco de dados.

## Equipe

| Integrante | Responsabilidade |
|---|---|
| Rosana Vitória | Interface e frontend |
| Kalinne Vitória | Geração de provas e questões |
| Beatriz Bruna | Correção automática |
| Kauan Williams | Backend e integração |

## Objetivo acadêmico

Demonstrar a integração entre frontend, backend e processamento de imagens em uma solução voltada à educação.

---

**Questio — Tecnologia para simplificar avaliações.**
