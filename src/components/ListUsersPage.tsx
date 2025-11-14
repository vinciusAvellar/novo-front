import React, { useState, useEffect } from 'react';
import axios from 'axios';

// URL CRÍTICA: Aponta para o API Gateway na porta 3002
const USUARIOS_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3002'}/usuarios`;

interface AppUser {
    id: string; // MongoDB ObjectId
    name: string;
    email: string;
    idade: number; 
}

interface ListUsersPageProps { refreshKey: number; }

export const ListUsersPage: React.FC<ListUsersPageProps> = ({ refreshKey }) => {
    const [users, setUsers] = useState<AppUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<string>('');

    // --- LÓGICA DE FETCH (GET) ---
    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            // Chamada API Gateway: GET /usuarios
            const response = await axios.get(USUARIOS_URL);
            setUsers(response.data || []); 
        } catch (err) {
            setError(`Falha ao listar usuários. Verifique o MS Usuários.`);
            console.error("API Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    // --- LÓGICA DE DELETE ---
    const handleDeleteUser = async (id: string) => {
        // Exibe apenas uma parte do ID para confirmação
        if (!window.confirm(`Tem certeza que deseja deletar o Usuário ID ${id.substring(0, 8)}...?`)) return;

        setStatus('Deletando...');
        try {
            await axios.delete(`${USUARIOS_URL}/${id}`);
            setStatus(`SUCESSO! Usuário deletado.`);
            fetchUsers(); // Atualiza a lista
        } catch (err) {
            setStatus(`ERRO: Falha ao deletar usuário.`);
            console.error(err);
        }
    };

    // Dispara a busca quando o componente é montado ou a chave de refresh muda
    useEffect(() => { 
        fetchUsers(); 
    }, [refreshKey]); 

    return (
        <div style={{ padding: '0px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                Lista de Usuários ({users.length})
            </h2>
            
            {status && <p style={{ color: status.startsWith('SUCESSO') ? 'green' : 'red', marginBottom: '10px' }}>{status}</p>}
            {error && <p style={{ color: 'red', marginBottom: '10px' }}>Erro: {error}</p>}
            
            {loading && <p style={{ color: 'gray' }}>Carregando dados...</p>}
            
            {/* CABEÇALHO DA LISTA (Grid) */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 100px', gap: '15px', padding: '10px 0', borderBottom: '2px solid purple', fontWeight: 'bold' }}>
                <span>Nome Completo</span>
                <span>E-mail</span>
                <span>Idade</span>
                <span>Ação</span>
            </div>

            <ul style={{ listStyle: 'none', padding: 0 }}>
              {!loading && users.length === 0 && <p style={{ color: 'gray', padding: '10px 0' }}>Nenhum usuário encontrado.</p>}
              
              {users.map(user => (
                <li key={user.id} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 100px', alignItems: 'center', gap: '15px', padding: '15px 0', borderBottom: '1px solid #eee' }}>
                    
                    <p style={{ fontWeight: 'bold', color: 'black' }}>{user.name}</p>
                    <span style={{ fontSize: '14px', color: '#555' }}>{user.email}</span>
                    <span style={{ fontWeight: 'bold', color: 'purple' }}>{user.idade}</span>
                    
                    <button 
                        onClick={() => handleDeleteUser(user.id)}
                        style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 8px', cursor: 'pointer', borderRadius: '4px', fontSize: '12px' }}
                    >
                        Deletar
                    </button>
                </li>
              ))}
            </ul>
        </div>
    );
};