import './App.css';
import logo from './img/img_ucdb.jpg';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [dados, setDados] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [filtroEscola, setFiltroEscola] = useState('');
  const [codigoInep, setFiltroCodigoInep] = useState('');
  const [filtroMunicipio, setFiltroMunicipio] = useState('');
  const [filtroUF, setFiltroUF] = useState('');

  // Função para carregar dados da API com paginação
  const fetchData = async (pageNumber) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://dac-4-semestre.onrender.com/escolas?page=${pageNumber}`);
      const resultado = response.data;
      
      if (Array.isArray(resultado.escolas)) {
        setDados(resultado.escolas);
        setTotalPages(resultado.pages);
      } else {
        console.error('Formato inesperado da API:', resultado);
        setDados([]);
      }
    } catch (error) {
      console.error('Erro ao buscar dados da API:', error);
      setDados([]);
    } finally {
      setLoading(false);
    }
  };

  // Carrega dados ao montar e sempre que a página mudar
  useEffect(() => {
    fetchData(page);
  }, [page]);

  // Filtrar dados da página atual
  const dadosFiltrados = dados.filter(row =>
    row.nome_escola.toLowerCase().includes(filtroEscola.toLowerCase()) &&
    row.cidade.toLowerCase().includes(filtroMunicipio.toLowerCase()) &&
    (filtroUF === '' || (row.estado && row.estado.toLowerCase() === filtroUF.toLowerCase())) &&
    (codigoInep === '' || row.codigo_inep.toString().startsWith(codigoInep))

  );


  return (
    <div className="App">
      <section className='filtro_section'>
        <div className='superior'>
          <img className="logo" src={logo} alt="Logo" />

          <div className='input'>
            <label>Escola: </label>
            <input
              className='input_escola'
              value={filtroEscola}
              onChange={e => setFiltroEscola(e.target.value)}
            />
          </div>

          <div className='input'>
            <label>Cod Inep: </label> 
            <input 
              className='input_cod_inep'
              value={codigoInep}
              onChange={e => setFiltroCodigoInep(e.target.value)}
            />
          </div>

          <div className='input'>
            <label>Município: </label>
            <input
              className='input_municipio'
              value={filtroMunicipio}
              onChange={e => setFiltroMunicipio(e.target.value)}
            />  
          </div>

          <div className='input'>
            <label>UF: </label>
            <select
              className='input_estado'
              value={filtroUF}
              onChange={e => setFiltroUF(e.target.value)}
            >
              <option value="">Todos</option>
              {[
                'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS',
                'MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR',
                'SC','SP','SE','TO'
              ].map(uf => (
                <option key={uf} value={uf}>{uf}</option>
              ))}
            </select>          
          </div>

          <div className='input'>
            <label>Prestadora:</label> 
            <select className='input_prestadora' disabled>
              <option value ="oi">OI</option>
              <option value ="vivo">VIVO</option>
              <option value ="tim">TIM</option>
            </select>  
          </div>
        </div>

        <div className='inferior'>
          <div className='input_inf'>
            <label>Internet:</label>
            <input type='checkbox' className='input_internet' disabled />     
          </div>
          <div className='input_inf'>
            <label>Banda Larga:</label>
            <input type='checkbox' className='input_banda_larga' disabled />
          </div>
          <div className='input_inf'>
            <label>4G:</label>
            <input type='checkbox' className='input_4g' disabled />
          </div>
        </div>
      </section>

      <section className='listagem_section'>
        {loading ? (
          <p>Carregando dados...</p>
        ) : (
          <>
                      <div style={{ marginTop: 10, marginBottom: 10, textAlign: 'center' }}>
              <button
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={page === 1 || loading}
              >
                Anterior
              </button>
              <span style={{ margin: '0 15px' }}>
                Página {page} de {totalPages}
              </span>
              <button
                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages || loading}
              >
                Próximo
              </button>
            </div>
            <Table sx={{ minWidth: 650 }} aria-label="tabela de escolas">
  <TableHead>
    <TableRow>
      <TableCell>Nome</TableCell>
      <TableCell>Código INEP</TableCell>
      <TableCell>Cidade</TableCell>
      <TableCell>Estado</TableCell>
      <TableCell>Internet</TableCell>
      <TableCell>Prestadora</TableCell>
      <TableCell>Matrículas</TableCell>
      <TableCell>Ano do Censo</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {dadosFiltrados.length === 0 ? (
      <TableRow>
        <TableCell colSpan={8} align="center">Nenhum registro encontrado.</TableCell>
      </TableRow>
    ) : (
      dadosFiltrados.map((row, index) => (
        <TableRow key={index}>
          <TableCell>{row.nome_escola}</TableCell>
          <TableCell>{row.codigo_inep}</TableCell>
          <TableCell>{row.cidade}</TableCell>
          <TableCell>{row.estado}</TableCell>
          <TableCell>{row.internet ? 'Sim' : 'Não'}</TableCell>
          <TableCell>{row.prestadora}</TableCell>
          <TableCell>{row.matriculas}</TableCell>
          <TableCell>{row.ano_censo}</TableCell>
        </TableRow>
      ))
    )}
  </TableBody>
</Table>


            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <button
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={page === 1 || loading}
              >
                Anterior
              </button>
              <span style={{ margin: '0 15px' }}>
                Página {page} de {totalPages}
              </span>
              <button
                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages || loading}
              >
                Próximo
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default App;
