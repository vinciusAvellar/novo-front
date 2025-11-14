# 📦 Carlinho Express - Sistema de Logística e Pedidos

Este projeto adota uma arquitetura de microsserviços madura, aplicando padrões avançados como Clean Architecture e Vertical Slice, garantindo escalabilidade, resiliência e alta manutenibilidade.

---

## 👥 Alunos Participantes

Este projeto foi desenvolvido por:

* **Vincius Avellar**
* **Gustavo Noleto**
* **João Barletta**
* **Breno Souza**

---

## 🗺️ Arquitetura do Código-Fonte: Padrões e Componentes

### 1. Padrões Arquiteturais Centrais

O projeto utiliza os seguintes padrões para garantir a qualidade do código e a estrutura do sistema:

| Padrão | Descrição |
| :--- | :--- |
| **Microsserviços** | Divisão do sistema em componentes independentes para escalabilidade e implantação autônoma. |
| **Clean Architecture** | Aplicado no microsserviço **`carlinho-service`**. Garante que a lógica de negócio seja isolada e independente de frameworks ou bancos de dados. |
| **Vertical Slice** | Aplicado em **todos** os microsserviços. O desenvolvimento é organizado em "fatias" verticais que cobrem uma funcionalidade completa (do Controller ao Banco de Dados). |
| **Backend For Frontend (BFF)** | Camada intermediária que serve APIs customizadas para interfaces específicas. |

---

### 2. Frontend e Comunicação

| Componente | Tecnologia | Finalidade |
| :--- | :--- | :--- |
| **Frontend** | **React** | Interface de Usuário principal (Web/Mobile Híbrido), responsável pela apresentação e interação do usuário. |
| **API Gateway** | N/A | Ponto de entrada unificado para **todas** as requisições dos clientes (React). |
| **bff-caronas** | NestJS | **API customizada para o Frontend Caronas.** Otimiza a comunicação entre o React e o `carlinho-service`. |

### 3. Microsserviços e Persistência Poliglota

O backend usa o **NestJS** como framework principal, mas a arquitetura e as tecnologias de persistência variam por serviço:

| Microsserviço | Padrões Internos | Persistência (Banco de Dados) |
| :--- | :--- | :--- |
| **carlinho-service** | **Clean Architecture** e Vertical Slice | **Azure SQL Database** (Relacional) |
| **usuario-microservice** | Vertical Slice (Padrão mais simples) | **MongoDB** (NoSQL / Documentos) |

**Fluxo de Comunicação:** O Frontend em **React** faz requisições ao **API Gateway**, que roteia para os microsserviços apropriados ou para o **bff-caronas** (que, por sua vez, se comunica com o `carlinho-service`).
