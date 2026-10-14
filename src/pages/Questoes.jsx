import { useState } from 'react';
import MenuLateral from '../components/MenuLateral';
import '../style/Painel.css';
import '../style/Questoes.css';

export default function Questoes() {
  const [enunciado, setEnunciado] = useState('');
  const [alternativas, setAlternativas] = useState([
    { id: 1, texto: '', correta: false },
    { id: 2, texto: '', correta: false },
  ]);
  
  const [listaQuestoes, setListaQuestoes] = useState([]);
  const [versoesProva, setVersoesProva] = useState(null);
  const [modoVisualizacao, setModoVisualizacao] = useState('cadastro');
  
  // Estado para controlar se estamos editando uma questão existente
  const [idQuestaoEmEdicao, setIdQuestaoEmEdicao] = useState(null);

  const [cabecalho, setCabecalho] = useState({
    instituicao: '',
    provaTitulo: ''
  });

  const handleTextoAlternativaChange = (id, texto) => {
    setAlternativas(
      alternativas.map((alt) => (alt.id === id ? { ...alt, texto } : alt))
    );
  };

  const handleMarcarCorreta = (id) => {
    setAlternativas(
      alternativas.map((alt) => ({
        ...alt,
        correta: alt.id === id,
      }))
    );
  };

  const adicionarAlternativa = () => {
    const novoId = Date.now() + Math.random();
    setAlternativas([...alternativas, { id: novoId, texto: '', correta: false }]);
  };

  const removerAlternativa = (id) => {
    if (alternativas.length <= 2) {
      alert('A questão deve ter pelo menos 2 alternativas.');
      return;
    }
    setAlternativas(alternativas.filter((alt) => alt.id !== id));
  };

  // Salvar nova questão ou salvar alterações da questão editada
  const handleSubmit = (e) => {
    e.preventDefault();

    const temCorreta = alternativas.some((alt) => alt.correta);
    if (!temCorreta) {
      alert('Por favor, marque pelo menos uma alternativa como correta!');
      return;
    }

    if (idQuestaoEmEdicao !== null) {
      setListaQuestoes((prev) =>
        prev.map((q) =>
          q.id === idQuestaoEmEdicao
            ? { ...q, enunciado, alternativas: alternativas.map((a) => ({ ...a })) }
            : q
        )
      );
      alert('Questão atualizada com sucesso!');
      setIdQuestaoEmEdicao(null);
    } else {
      const novaQuestao = {
        id: Date.now() + Math.random(),
        enunciado: enunciado,
        alternativas: alternativas.map((alt) => ({ ...alt })),
      };
      setListaQuestoes((prev) => [...prev, novaQuestao]);
      alert('Questão cadastrada com sucesso!');
    }

    // Limpa o formulário
    setEnunciado('');
    setAlternativas([
      { id: 1, texto: '', correta: false },
      { id: 2, texto: '', correta: false },
    ]);
  };

  // Carregar a questão de volta no formulário para edição
  const handleEditarQuestao = (questao) => {
    setIdQuestaoEmEdicao(questao.id);
    setEnunciado(questao.enunciado);
    setAlternativas(questao.alternativas.map((alt) => ({ ...alt })));
    setModoVisualizacao('cadastro');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Excluir uma questão
  const handleExcluirQuestao = (id) => {
    if (window.confirm('Tem certeza de que deseja excluir esta questão?')) {
      setListaQuestoes((prev) => prev.filter((q) => q.id !== id));
      if (idQuestaoEmEdicao === id) {
        setIdQuestaoEmEdicao(null);
        setEnunciado('');
        setAlternativas([
          { id: 1, texto: '', correta: false },
          { id: 2, texto: '', correta: false },
        ]);
      }
    }
  };

  const cancelarEdicao = () => {
    setIdQuestaoEmEdicao(null);
    setEnunciado('');
    setAlternativas([
      { id: 1, texto: '', correta: false },
      { id: 2, texto: '', correta: false },
    ]);
  };

  // FUNÇÃO PARA APAGAR A PROVA ANTIGA E COMEÇAR UMA NOVA
  const handleNovaProva = () => {
    if (window.confirm('Atenção: Isso irá apagar todas as questões e provas geradas para começar uma nova avaliação do zero. Deseja continuar?')) {
      setListaQuestoes([]);
      setVersoesProva(null);
      setCabecalho({ instituicao: '', provaTitulo: '' });
      setEnunciado('');
      setAlternativas([
        { id: 1, texto: '', correta: false },
        { id: 2, texto: '', correta: false },
      ]);
      setIdQuestaoEmEdicao(null);
      setModoVisualizacao('cadastro');
      alert('Prova antiga apagada! Você pode começar a criar uma nova prova.');
    }
  };

  const embaralharArray = (array) => {
    const novoArray = JSON.parse(JSON.stringify(array));
    for (let i = novoArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [novoArray[i], novoArray[j]] = [novoArray[j], novoArray[i]];
    }
    return novoArray;
  };

  const gerarProvas = () => {
    if (listaQuestoes.length === 0) {
      alert('Cadastre pelo menos uma questão antes de gerar as provas!');
      return;
    }

    const questoesVersaoA = embaralharArray(listaQuestoes).map((q) => ({
      ...q,
      alternativas: embaralharArray(q.alternativas),
    }));

    const questoesVersaoB = embaralharArray(listaQuestoes).map((q) => ({
      ...q,
      alternativas: embaralharArray(q.alternativas),
    }));

    setVersoesProva({
      A: questoesVersaoA,
      B: questoesVersaoB,
    });

    setModoVisualizacao('aluno');
  };

  // FUNÇÃO VAZIA PARA A PROVA DO ALUNO (Sua amiga irá dar continuidade)
  const handleImprimir = () => {
    // TODO: Lógica de impressão/exportação da prova a ser implementada
  };

  // FUNÇÃO DE IMPRESSÃO ATIVA PARA O GABARITO DO PROFESSOR
  const handleImprimirGabarito = () => {
    window.print();
  };

  const trocarAba = (aba) => {
    if ((aba === 'aluno' || aba === 'gabarito') && !versoesProva) {
      alert('Gere as versões da prova primeiro clicando no botão "Gerar Versões da Prova".');
      return;
    }
    setModoVisualizacao(aba);
  };

  return (

    <div className="pagina-painel">
      
      {/* Envolvemos o menu lateral com a classe no-print para ele sumir totalmente na impressão */}
      <div className="no-print">
        <MenuLateral />
      </div>

      <main className="painel-conteudo">
        <div className="questoes-container">
          
          <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h2>Módulo de Questões e Provas</h2>
            
            {(listaQuestoes.length > 0 || versoesProva) && (
              <button
                type="button"
                className="btn-remover"
                onClick={handleNovaProva}
                style={{ padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
              >
                🗑️ Apagar Prova e Criar Nova
              </button>
            )}
          </div>

          {/* AS 3 ABAS NAVEGÁVEIS */}
          <div className="no-print" style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <button 
              type="button"
              className={modoVisualizacao === 'cadastro' ? 'btn-principal' : 'btn-secundario'}
              onClick={() => trocarAba('cadastro')}
            >
              ✏️ Cadastrar Questões
            </button>
            <button 
              type="button"
              className={modoVisualizacao === 'aluno' ? 'btn-principal' : 'btn-secundario'}
              onClick={() => trocarAba('aluno')}
            >
              📄 Prova do Aluno
            </button>
            <button 
              type="button"
              className={modoVisualizacao === 'gabarito' ? 'btn-principal' : 'btn-secundario'}
              onClick={() => trocarAba('gabarito')}
            >
              🔑 Gabarito do Professor
            </button>
          </div>

          {/* TELA 1: CADASTRO E EDIÇÃO */}
          {modoVisualizacao === 'cadastro' && (
            <>
              <div className="questoes-form" style={{ marginBottom: '20px' }}>
                <h3>Configurar Identificação da Prova</h3>
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label>Nome da Instituição (Obrigatório):</label>
                  <input 
                    type="text" 
                    placeholder="Digite aqui o nome da instituição..."
                    value={cabecalho.instituicao}
                    onChange={(e) => setCabecalho({...cabecalho, instituicao: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '0' }}>
                  <label>Título da Avaliação:</label>
                  <input 
                    type="text" 
                    placeholder="Digite aqui o título da prova..."
                    value={cabecalho.provaTitulo}
                    onChange={(e) => setCabecalho({...cabecalho, provaTitulo: e.target.value})}
                  />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="questoes-form">
                <h3>{idQuestaoEmEdicao ? '✏️ Editando Questão' : 'Cadastrar Nova Questão'}</h3>
                
                <div className="form-group">
                  <label>Enunciado:</label>
                  <textarea
                    rows="3"
                    placeholder="Digite aqui a pergunta..."
                    value={enunciado}
                    onChange={(e) => setEnunciado(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Alternativas (Selecione a correta):</label>

                  {alternativas.map((alt, index) => (
                    <div key={alt.id} className="alternativa-row">
                      <input
                        type="radio"
                        name="correta"
                        checked={alt.correta}
                        onChange={() => handleMarcarCorreta(alt.id)}
                      />
                      <input
                        type="text"
                        placeholder={`Alternativa ${index + 1}`}
                        value={alt.texto}
                        onChange={(e) => handleTextoAlternativaChange(alt.id, e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="btn-remover"
                        onClick={() => removerAlternativa(alt.id)}
                      >
                        X
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="btn-secundario"
                    onClick={adicionarAlternativa}
                  >
                    + Adicionar Alternativa
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn-principal" style={{ flex: 1 }}>
                    {idQuestaoEmEdicao ? 'Atualizar Questão' : 'Salvar Questão'}
                  </button>
                  {idQuestaoEmEdicao && (
                    <button 
                      type="button" 
                      className="btn-secundario" 
                      onClick={cancelarEdicao}
                    >
                      Cancelar Edição
                    </button>
                  )}
                </div>
              </form>

              {/* LISTA DE QUESTÕES */}
              <div className="lista-section">
                <h3>Questões Cadastradas ({listaQuestoes.length})</h3>
                {listaQuestoes.length === 0 ? (
                  <p className="vazio-texto">Nenhuma questão cadastrada ainda.</p>
                ) : (
                  <>
                    {listaQuestoes.map((q, idx) => (
                      <div key={q.id} className="questao-card" style={{ position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <strong>{idx + 1}. {q.enunciado}</strong>
                          
                          <div style={{ display: 'flex', gap: '8px', marginLeft: '10px' }}>
                            <button
                              type="button"
                              className="btn-secundario"
                              style={{ padding: '4px 10px', fontSize: '12px' }}
                              onClick={() => handleEditarQuestao(q)}
                            >
                              ✏️ Editar
                            </button>
                            <button
                              type="button"
                              className="btn-remover"
                              style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '12px' }}
                              onClick={() => handleExcluirQuestao(q.id)}
                            >
                              🗑️ Excluir
                            </button>
                          </div>
                        </div>

                        <ul>
                          {q.alternativas.map((alt) => (
                            <li key={alt.id} className={alt.correta ? 'correta' : ''}>
                              {alt.texto} {alt.correta && ' (Correta)'}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}

                    <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                      <button
                        type="button"
                        className="btn-gerar"
                        onClick={gerarProvas}
                        style={{ flex: 1 }}
                      >
                        {versoesProva ? '🔄 Regerar Versões (A e B)' : 'Gerar Versões da Prova (A e B)'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {/* TELA 2: PROVA DO ALUNO */}
          {modoVisualizacao === 'aluno' && versoesProva && (
            <div className="versoes-container">
              <h3 className="no-print" style={{ marginBottom: '15px' }}>📄 Caderno de Provas para Impressão</h3>
              
              {['A', 'B'].map((versao) => (
                <div key={versao} className="prova-card" style={{ marginTop: '20px', border: '2px solid #6236ab', padding: '20px', pageBreakAfter: 'always' }}>
                  
                  <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                    {/* Botão de impressão da prova mantido sem função ativa */}
                    <button type="button" className="btn-principal" onClick={handleImprimir} style={{ width: 'auto', padding: '8px 16px', fontSize: '14px' }}>
                      🖨️ Imprimir Versão {versao}
                    </button>
                  </div>

                  <div style={{ borderBottom: '2px solid #6236ab', paddingBottom: '14px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h3 style={{ margin: 0, color: '#6236ab', fontSize: '18px' }}>{cabecalho.instituicao || 'Nome da Instituição'}</h3>
                        <h4 style={{ margin: '4px 0 0 0', color: '#5d3587', fontSize: '15px' }}>{cabecalho.provaTitulo || 'Avaliação de Conhecimentos'}</h4>
                      </div>
                      <div style={{ background: '#f0e6fc', padding: '8px 14px', borderRadius: '8px', fontWeight: 'bold', color: '#5d3587', fontSize: '16px' }}>
                        VERSÃO {versao}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '8px', marginTop: '14px', fontSize: '13px' }}>
                      <div><strong>Professor(a):</strong> ______________</div>
                      <div><strong>Matéria:</strong> ________</div>
                      <div><strong>Turma:</strong> ________</div>
                      <div><strong>Data:</strong> ____/____/____</div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', fontSize: '14px' }}>
                      <div style={{ flex: 1 }}><strong>Aluno(a):</strong> _________________________________________________________________</div>
                      <div style={{ marginLeft: '15px', border: '1px solid #6236ab', padding: '6px 16px', borderRadius: '6px', background: '#faf7ff' }}>
                        <strong>NOTA:</strong> ________
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', fontSize: '11px', color: '#888', marginTop: '8px' }}>
                      [ 📱 ID Leitura QR Code: PROVA-{versao}-2026 ]
                    </div>
                  </div>

                  {versoesProva[versao].map((q, idx) => (
                    <div key={q.id} className="prova-questao">
                      <p><strong>Q{idx + 1}:</strong> {q.enunciado}</p>
                      <ul style={{ listStyleType: 'upper-alpha' }}>
                        {q.alternativas.map((alt) => (
                          <li key={alt.id} style={{ margin: '6px 0' }}>
                            {alt.texto}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* TELA 3: GABARITO DO PROFESSOR */}
          {modoVisualizacao === 'gabarito' && versoesProva && (
            <div className="versoes-container">
              <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3>🔑 Gabarito Oficial para Correção</h3>
                {/* Botão do gabarito conectado à função ativa de impressão */}
                <button type="button" className="btn-principal" onClick={handleImprimirGabarito} style={{ width: 'auto', padding: '10px 20px' }}>
                  🖨️ Imprimir Gabarito Completo
                </button>
              </div>
              
              {['A', 'B'].map((versao) => (
                <div key={versao} className="prova-card" style={{ marginTop: '20px' }}>
                  <h4 className={versao === 'A' ? 'titulo-a' : 'titulo-b'}>Gabarito - Versão {versao}</h4>
                  {versoesProva[versao].map((q, idx) => {
                    const altCorreta = q.alternativas.findIndex(alt => alt.correta);
                    const letraCorreta = String.fromCharCode(65 + altCorreta);
                    return (
                      <div key={q.id} style={{ padding: '6px 0', borderBottom: '1px solid #eee' }}>
                        <span><strong>Questão {idx + 1}:</strong> Resposta Correta ➔ <strong>{letraCorreta}</strong></span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}