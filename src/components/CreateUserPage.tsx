import React, { useState } from 'react';
import axios from 'axios';

const USUARIOS_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3002'}/usuarios`;

interface CreateUserDto { email: string; name: string; idade: number | ''; senha: string; }
interface CreateUserPageProps { onSuccess: () => void; }

export const CreateUserPage: React.FC<CreateUserPageProps> = ({ onSuccess }) => {
    const [newUser, setNewUser] = useState<CreateUserDto>({ email: '', name: '', idade: '', senha: '' });
    const [status, setStatus] = useState<string>('');

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('Criando Usuário...');
        try {
            const dataToSend = { ...newUser, idade: Number(newUser.idade) };
            
            await axios.post(USUARIOS_URL, dataToSend);
            
            setStatus("SUCESSO! Usuário criado.");
            setNewUser({ email: '', name: '', idade: '', senha: '' });
            
            setTimeout(onSuccess, 1000); 
        } catch (err) {
            setStatus(`ERRO: Falha na criação. Verifique os logs.`);
            console.error(err);
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Criar Novo Usuário</h2>
            <form onSubmit={handleCreateUser} style={{ display: 'flex', gap: '15px', flexDirection: 'column' }}>
                <input type="email" placeholder="Email" required onChange={e => setNewUser({ ...newUser, email: e.target.value })} style={{ padding: '10px', border: '1px solid #ccc' }} />
                <input type="text" placeholder="Nome" required onChange={e => setNewUser({ ...newUser, name: e.target.value })} style={{ padding: '10px', border: '1px solid #ccc' }} />
                <input type="number" placeholder="Idade" required onChange={e => setNewUser({ ...newUser, idade: Number(e.target.value) })} style={{ padding: '10px', border: '1px solid #ccc' }} />
                <input type="password" placeholder="Senha" required onChange={e => setNewUser({ ...newUser, senha: e.target.value })} style={{ padding: '10px', border: '1px solid #ccc' }} />
                <button type="submit" style={{ padding: '10px', backgroundColor: 'purple', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Criar Usuário (POST)
                </button>
                <p style={{ color: status.startsWith('SUCESSO') ? 'green' : 'red' }}>Status: {status}</p>
            </form>
        </div>
    );
};