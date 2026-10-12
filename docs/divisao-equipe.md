# Divisão da Equipe — Plataforma Educacional

## Objetivo do projeto

Desenvolver uma plataforma web para professores criarem provas de múltipla escolha, gerarem versões embaralhadas e realizarem a correção automática de folhas de respostas.

O projeto também terá planos de assinatura demonstrativos e anúncios simulados.

O nome definitivo da plataforma ainda será escolhido.

## 1. Rosana — Interface e Frontend

Responsável pela parte visual e pela experiência do usuário.

### Atividades
- Criar a interface usando React.
- Desenvolver a página inicial.
- Criar as telas de login e cadastro.
- Desenvolver o painel do professor.
- Criar os menus e a navegação.
- Desenvolver as telas de criação de provas e visualização dos resultados.
- Criar a página de comparação dos planos.
- Criar os espaços visuais para anúncios.
- Garantir que o site funcione em computadores e celulares.
- Integrar as telas às funcionalidades da equipe.

### Entregas
- Interface navegável e responsiva.
- Páginas de autenticação, painel, provas, correções e planos.
- Componentes visuais para anúncios demonstrativos.

## 2. Kalinne — Criação e Geração de Provas

Responsável pelo módulo de questões e avaliações.

### Atividades
- Desenvolver o cadastro de questões.
- Permitir cadastrar alternativas e indicar a resposta correta.
- Criar a funcionalidade de montar provas.
- Implementar o embaralhamento de questões e alternativas.
- Registrar a ordem correta de cada versão gerada.
- Gerar o gabarito correspondente a cada versão.
- Preparar as provas para impressão ou exportação.
- Integrar o módulo com o backend.

### Entregas
- Cadastro e gerenciamento de questões.
- Gerador de provas com versões diferentes.
- Gabaritos corretos para cada versão.

## 3. Beatriz — Correção Automática

Responsável pelo módulo de leitura e correção das avaliações.

### Atividades
- Desenvolver o modelo padronizado da folha de respostas.
- Implementar a identificação da prova e da versão por QR Code.
- Desenvolver a leitura das alternativas marcadas na folha.
- Comparar as respostas identificadas com o gabarito correto.
- Calcular acertos, erros e notas.
- Identificar marcações duvidosas e permitir revisão manual.
- Enviar os resultados ao backend para armazenamento.
- Testar o funcionamento com folhas de exemplo.

### Entregas
- Folha de respostas padronizada.
- Leitura de QR Code e marcações.
- Correção automática com cálculo de notas.
- Tratamento de leituras duvidosas.

Observação: o QR Code identifica a avaliação, mas a leitura das respostas exige processamento separado das marcações.

## 4. Kauan — Backend e Banco de Dados

Responsável pelo servidor, persistência e regras do sistema.

### Atividades
- Desenvolver a API com Node.js e Express.
- Estruturar o banco de dados.
- Implementar cadastro e autenticação de usuários.
- Criar rotas para questões, provas, versões e gabaritos.
- Armazenar os resultados das correções.
- Implementar os planos demonstrativos e os limites de utilização.
- Controlar quais usuários visualizam anúncios.
- Criar o cadastro e a consulta de anúncios simulados.
- Integrar os módulos desenvolvidos pela equipe.
- Documentar as principais rotas da API.

### Entregas
- API funcional.
- Banco de dados organizado.
- Controle de usuários, provas, resultados, planos e anúncios.
- Integração com o frontend.

## Responsabilidades de toda a equipe

- Utilizar o GitHub para registrar o desenvolvimento.
- Trabalhar em branches separadas.
- Abrir Pull Requests para integrar alterações.
- Testar as funcionalidades desenvolvidas.
- Atualizar a documentação quando necessário.
- Participar da integração e da apresentação final.

## Escopo dos planos e anúncios

- Plano gratuito com limites de uso e anúncios simulados.
- Planos superiores demonstrativos com benefícios e sem anúncios.
- Não haverá cobrança real no protótipo.
- Os valores e limites dos planos serão definidos pela equipe.

## Organização

As atribuições poderão ser ajustadas conforme a complexidade de cada módulo e as necessidades da equipe.
