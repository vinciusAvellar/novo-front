import React, { useState } from 'react';
import axios from 'axios';

const CARONAS_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3002'}/caronas`;

interface CreateCaronaPageProps { onSuccess: () => void; }

export const CreateCaronaPage: React.FC<CreateCaronaPageProps> = ({ onSuccess }) => {
    const [newCarona, setNewCarona] = useState({ origem: '', destino: '', valor: 10.0, dataHora: '' });
    const [status, setStatus] = useState<string>('');

    const handleCreateCarona = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('Criando...');
        try {
            const dataToSend = {
                ...newCarona,
                dataHora: new Date(newCarona.dataHora).toISOString(),
                valor: Number(newCarona.valor),
            };
            
            await axios.post(CARONAS_URL, dataToSend);
            
            setStatus(`SUCESSO na criação!`);
            setNewCarona({ origem: '', destino: '', valor: 10.0, dataHora: '' });
            
            setTimeout(onSuccess, 1000); 
        } catch (err) {
            setStatus(`ERRO: Falha na criação. Consulte o console.`);
            console.error(err);
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Criar Nova Carona</h2>
            <form onSubmit={handleCreateCarona} style={{ display: 'flex', gap: '15px', flexDirection: 'column' }}>
                <input type="text" placeholder="Origem" required onChange={e => setNewCarona({ ...newCarona, origem: e.target.value })} style={{ padding: '10px', border: '1px solid #ccc' }} />
                <input type="text" placeholder="Destino" required onChange={e => setNewCarona({ ...newCarona, destino: e.target.value })} style={{ padding: '10px', border: '1px solid #ccc' }} />
                <input type="number" step="0.01" placeholder="Valor" required value={newCarona.valor} onChange={e => setNewCarona({ ...newCarona, valor: Number(e.target.value) })} style={{ padding: '10px', border: '1px solid #ccc' }} />
                <input type="datetime-local" required onChange={e => setNewCarona({ ...newCarona, dataHora: e.target.value })} style={{ padding: '10px', border: '1px solid #ccc' }} />
                <button type="submit" style={{ padding: '10px', backgroundColor: 'darkgreen', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Criar Carona (POST)
                </button>
                <p style={{ color: status.startsWith('SUCESSO') ? 'green' : 'red' }}>Status: {status}</p>
            </form>
        </div>
    );
};