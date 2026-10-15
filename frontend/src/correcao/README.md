# Módulo de Correção Automática (Beatriz)

Lê folhas de respostas fotografadas, identifica a prova pelo QR Code e corrige
contra o gabarito da versão.

## Arquivos
- `layoutFolha.js`: geometria da folha (A4, mm). Fonte única para desenhar e ler.
- `../components/FolhaResposta.jsx`: folha em SVG com QR Code, pronta para imprimir (estilo em `style components/FolhaResposta.css`).
- `leitura.js`: localiza as 4 marcas de canto e mede o preenchimento das bolhas.
- `corrigir.js`: gabarito da versão, acertos, erros, nota e revisão.
- `codigoQr.js` / `qr.js`: formato do QR (`PROVA-<provaId>-<A|B>`) e decodificação (jsqr).
- `store.js`: provas registradas pela tela de Questões.
- `api.js`: envio dos resultados ao backend.

## Testes
`node --test src/correcao/correcao.test.js` (dentro de `frontend/`)

## Para integrar com a tela de Questões
Em `gerarProvas()` (src/pages/Questoes.jsx), após `setVersoesProva`:

    import { registrarProva } from '../correcao/store.js';
    import { gerarTextoQr } from '../correcao/codigoQr.js';
    // ...
    const provaId = Date.now().toString(36);
    registrarProva({
      provaId,
      titulo: cabecalho.provaTitulo || 'Avaliação',
      versoesProva: { A: questoesVersaoA, B: questoesVersaoB },
    });

E o QR impresso na prova deve usar o mesmo formato:
`gerarTextoQr(provaId, 'A')` (substitui `PROVA-{versao}-2026`, que não identifica a prova).

## Limites conhecidos
- A foto precisa mostrar a folha inteira, com as 4 marcas pretas visíveis e fundo claro.
- Até 40 questões e 5 alternativas (A–E) por folha.
- Dependências novas: `npm install` (jsqr e qrcode).
- Resultados e provas ainda ficam em memória até o backend existir.
