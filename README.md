# Kolekt  

Um aplicativo web full-stack de coleta inteligente de links. Salve, organize e acesse seus recursos da web com títulos, descrições e imagens gerados automaticamente.

## 💡 Sobre o Projeto

Este projeto foi construído como um aplicativo web full-stack completo para resolver um problema comum de desenvolvedores: a organização de dezenas de links, artigos e tutoriais salvos.

O **Kolekt** permite que um usuário se registre, crie "Coleções" (como pastas) e salve links nelas. A funcionalidade principal é o **web scraper** do back-end, que, ao receber uma URL, "lê" a página de destino e extrai automaticamente seu `título`, `descrição` e `imagem de preview`, criando um "card" de conteúdo rico, similar ao Pinterest ou ao Pocket.

## ✨ Funcionalidades Principais

* **Autenticação de Usuário:** Sistema completo de registro e login com senhas criptografadas (`bcrypt`).
* **Sessões Seguras:** Uso de **JSON Web Tokens (JWT)** para gerenciar sessões e proteger rotas da API.
* **Web Scraper Automático:** Back-end que analisa qualquer URL (via `axios` e `cheerio`) para extrair metadados automaticamente.
* **Gestão CRUD Completa:**
    * **C**reate (Criar): Criar novas coleções e novos links.
    * **R**ead (Ler): Listar todas as coleções e seus links aninhados.
    * **U**pdate (Atualizar): Renomear a coleção.
    * **D**elete (Excluir): Excluir coleções ou links individuais, com modais de confirmação.
* **Interface Reativa:** Front-end em React que atualiza a UI instantaneamente (sem recarregar a página) após a criação ou exclusão de conteúdo.
* **Design e Tema:** Interface moderna construída com **MUI (Material-UI)** e um **Tema Global** personalizado (modo escuro, fontes e cores customizadas).

## 🛠️ Stack de Tecnologias

Este projeto é desacoplado, com um back-end (API) e um front-end (Cliente) independentes.

### Front-End (Pasta: `kolekt-client`)
* **React (v18+)**
* **Vite:** Ferramenta de build e servidor de desenvolvimento.
* **MUI (Material-UI):** Biblioteca de componentes para o design.
* **React Router (v6):** Para navegação e proteção de rotas (`ProtectedRoute`).
* **Axios:** Para fazer requisições HTTP para a API.

### Back-End (Pasta: `kolekt-api`)
* **Node.js**
* **Express.js:** Para a criação do servidor e das rotas da API RESTful.
* **Prisma:** ORM para comunicação segura e moderna com o banco de dados.
* **JSON Web Token (JWT):** Para autenticação.
* **bcrypt.js:** Para criptografia de senhas.
* **Axios & Cheerio:** Para o web scraping.

### Banco de Dados & Infra
* **PostgreSQL:** Banco de dados relacional.
* **Supabase:** Plataforma em nuvem para hospedagem do banco de dados PostgreSQL.

---

## 🚀 Rodando o Projeto Localmente

Para rodar este projeto, você precisará de dois terminais abertos simultaneamente (um para a API e um para o Cliente).

### Pré-requisitos
* [Node.js](https://nodejs.org/) (versão **v22.x** ou superior recomendada)
* [npm](https://www.npmjs.com/)
* Um banco de dados **PostgreSQL** (você pode criar um gratuito no [Supabase](https://supabase.com/)).

### 1. Configuração do Back-End (API)

```bash
# 1. Clone este repositório
git clone [https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git](https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git)
cd SEU-REPOSITORIO

# 2. Navegue até a pasta da API e instale as dependências
cd kolekt-api
npm install

# 3. Crie o arquivo .env para as variáveis de ambiente
# (Na raiz de /kolekt-api)
touch .env

# 4. Adicione suas variáveis de ambiente ao arquivo .env:
# Use o .env.example abaixo como molde
.env.example

# Cole a "Connection URL" do seu banco de dados (ex: do Supabase)
DATABASE_URL="postgresql://USUARIO:SENHA@HOST:PORTA/NOMEDOBANCO"

# Crie qualquer frase secreta longa para assinar os tokens
JWT_SECRET="MINHA_FRASE_SECRETA_PARA_O_KOLEKT_123456"

# 5. Rode a "migration" do Prisma para criar as tabelas no seu banco
npx prisma migrate dev

# 6. Inicie o servidor da API
npm run dev
# (O servidor estará rodando em http://localhost:3001)

# 1. Abra um NOVO terminal
# 2. Navegue até a pasta do cliente
cd kolekt-client
npm install

# 3. Inicie o servidor de desenvolvimento do Vite
npm run dev
# (O servidor estará rodando em http://localhost:5173)
# Abra seu navegador e acesse http://localhost:5173 para usar o aplicativo.


# Criador: Joel Medeiros 