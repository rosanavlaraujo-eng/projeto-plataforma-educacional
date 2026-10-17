// Arquivo NOVO, preparado para as meninas ligarem suas telas à API depois.
// Não altera nenhum componente existente.
const API_URL = 'http://localhost:3001/api';

export async function chamarAPI(rota, { metodo = 'GET', dados, token } = {}) {
  const resposta = await fetch(`${API_URL}${rota}`, {
    method: metodo,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(dados !== undefined ? { body: JSON.stringify(dados) } : {}),
  });
  const resultado = await resposta.json();
  if (!resposta.ok) throw new Error(resultado.erro || 'Erro na API');
  return resultado;
}
