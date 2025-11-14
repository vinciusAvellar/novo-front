import React, { useState } from 'react';
// Importação dos componentes de Carona
import { CreateCaronaPage } from './components/CreateCaronaPage';
import { ListCaronasPage } from './components/ListCaronasPage';
// Importação dos componentes de Usuário
import { CreateUserPage } from './components/CreateUserPage';
import { ListUsersPage } from './components/ListUsersPage'; 

// Tipos de Contexto e Ação
type Context = 'caronas' | 'users';
type Action = 'list' | 'create';

function App() {
  const [activeContext, setActiveContext] = useState<Context>('caronas');
  const [activeAction, setActiveAction] = useState<Action>('list');
  const [refreshKey, setRefreshKey] = useState(0); 

  // Função para forçar a atualização da lista após a criação bem-sucedida
  const handleCreateSuccess = () => {
    setRefreshKey(prev => prev + 1); 
    setActiveAction('list');
  };
  
  // Lógica para carregar o componente correto baseado no estado
  const getPageContent = () => {
      if (activeContext === 'caronas') {
          return activeAction === 'list' ? (
              // Listagem de Caronas (SQL)
              <ListCaronasPage key={refreshKey} refreshKey={refreshKey} />
          ) : (
              // Criação de Caronas (SQL)
              <CreateCaronaPage onSuccess={handleCreateSuccess} />
          );
      } else { 
          // Contexto Usuários (MongoDB)
          return activeAction === 'list' ? (
              // Listagem de Usuários (Mongo)
              <ListUsersPage key={refreshKey} refreshKey={refreshKey} />
          ) : (
              // Criação de Usuários (Mongo)
              <CreateUserPage onSuccess={handleCreateSuccess} />
          );
      }
  };

  return (
    // Layout Global (Garantindo a tela cheia)
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f4f4', padding: '0' }}> 
      
      {/* HEADER E NAVEGAÇÃO PRINCIPAL */}
      <header style={{ backgroundColor: '#333', padding: '15px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{color: 'white', marginBottom: '10px'}}>Gerenciador de Microservices</h1>
        
        {/* Navegação entre Contextos (Caronas / Usuários) */}
        <nav style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
            <button 
              onClick={() => { setActiveContext('caronas'); setActiveAction('list'); }}
              style={{ padding: '8px 15px', backgroundColor: activeContext === 'caronas' ? '#006400' : '#555', color: 'white', border: 'none', cursor: 'pointer' }}
            >
              Gerenciar Caronas (SQL)
            </button>
            <button 
              onClick={() => { setActiveContext('users'); setActiveAction('list'); }}
              style={{ padding: '8px 15px', backgroundColor: activeContext === 'users' ? '#800080' : '#555', color: 'white', border: 'none', cursor: 'pointer' }}
            >
              Gerenciar Usuários (Mongo)
            </button>
        </nav>

        {/* Navegação entre Ações (Listar / Criar) */}
        <nav style={{display: 'flex', gap: '10px'}}>
            <button 
              onClick={() => setActiveAction('list')}
              style={{ padding: '8px 15px', backgroundColor: activeAction === 'list' ? '#1e90ff' : '#aaa', color: 'white', border: 'none', cursor: 'pointer' }}
            >
              Listar/Deletar
            </button>
            <button 
              onClick={() => setActiveAction('create')}
              style={{ padding: '8px 15px', backgroundColor: activeAction === 'create' ? '#1e90ff' : '#aaa', color: 'white', border: 'none', cursor: 'pointer' }}
            >
              Criar Novo
            </button>
        </nav>
      </header>

      {/* CONTEÚDO DA PÁGINA (MAIN) */}
      <main style={{ 
        padding: '20px', 
        backgroundColor: 'white', 
        minHeight: '60vh',
        maxWidth: '1200px',
        margin: '20px auto', 
        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
      }}>
        {getPageContent()}
      </main>
    </div>
  );
}

// Exportação que o main.tsx espera
export default App;