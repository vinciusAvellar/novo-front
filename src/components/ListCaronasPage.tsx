import React, { useState, useEffect } from 'react';
import axios from 'axios';

// URL CRÍTICA: Aponta para o API Gateway na porta 3002
const CARONAS_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3002'}/caronas`;

interface Carona {
  id: number;
  origem: string;
  destino: string;
  valor: number;
  dataHora: string;
}

interface ListCaronasPageProps { refreshKey: number; }

export const ListCaronasPage: React.FC<ListCaronasPageProps> = ({ refreshKey }) => {
    const [caronas, setCaronas] = useState<Carona[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<string>('');

    // Função auxiliar para formatar datas
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
    };

    // --- LÓGICA DE FETCH (GET) ---
    const fetchCaronas = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(CARONAS_URL);
            // Assume que o MS Caronas retorna { lista: Carona[] } ou um array direto
            setCaronas(response.data.lista || response.data || []); 
        } catch (err) {
            setError(`Falha ao listar. Verifique o MS Caronas e o Gateway.`);
            console.error("API Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };
    
    // --- LÓGICA DE DELETE ---
    const handleDeleteCarona = async (id: number) => {
        if (!window.confirm(`Tem certeza que deseja deletar a Carona ID ${id}?`)) return;

        setStatus('Deletando...');
        try {
            await axios.delete(`${CARONAS_URL}/${id}`);
            setStatus(`SUCESSO! Carona ID ${id} deletada.`);
            fetchCaronas(); // Atualiza a lista
        } catch (err) {
            setStatus(`ERRO: Falha ao deletar carona ID ${id}.`);
            console.error(err);
        }
    };

    // Dispara a busca quando o componente é montado ou a chave de refresh muda
    useEffect(() => { 
        fetchCaronas(); 
    }, [refreshKey]); 

    return (
        <div style={{ padding: '0px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Lista de Caronas ({caronas.length})</h2>
            
            {status && <p style={{ color: status.startsWith('SUCESSO') ? 'green' : 'red', marginBottom: '10px' }}>{status}</p>}
            {error && <p style={{ color: 'red', marginBottom: '10px' }}>Erro: {error}</p>}
            
            {loading && <p style={{ color: 'gray' }}>Carregando dados...</p>}
            
            {/* Cabeçalho da Tabela (Grid) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 120px 80px', gap: '15px', padding: '10px 0', borderBottom: '2px solid #333', fontWeight: 'bold' }}>
                <span>Origem / Destino</span>
                <span>Horário / Data</span>
                <span>Valor (R$)</span>
                <span>Ação</span>
            </div>

            <ul style={{ listStyle: 'none', padding: 0 }}>
              {!loading && caronas.length === 0 && <p style={{ color: 'gray', padding: '10px 0' }}>Nenhuma carona encontrada.</p>}
              
              {caronas.map(carona => (
                <li key={carona.id} style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 120px 80px', alignItems: 'center', gap: '15px', padding: '15px 0', borderBottom: '1px solid #eee' }}>
                    
                    <div>
                        <p style={{ fontWeight: 'bold', color: '#333' }}>{carona.origem} → {carona.destino}</p>
                        <p style={{ fontSize: '12px', color: 'gray' }}>ID: {carona.id}</p>
                    </div>
                    <span style={{ fontSize: '14px', color: '#555' }}>{formatDate(carona.dataHora)}</span>
                    <span style={{ fontWeight: 'bold', color: '#006400' }}>R$ {carona.valor.toFixed(2)}</span>
                    
                    <button 
                        onClick={() => handleDeleteCarona(carona.id)}
                        style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 8px', cursor: 'pointer', borderRadius: '4px', fontSize: '12px', width: '75px' }}
                    >
                        Deletar
                    </button>
                </li>
              ))}
            </ul>
        </div>
    );
};