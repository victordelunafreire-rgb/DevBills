# 💰 DevBills

Aplicação full stack de controle financeiro pessoal. Você entra com sua conta Google, registra receitas e despesas por categoria e acompanha o mês num dashboard com saldo, gastos por categoria e um histórico dos últimos meses.

## ✨ Funcionalidades

- **Login com Google** via Firebase Authentication
- **Cadastro de transações** (receitas e despesas) com descrição, valor, data e categoria
- **Listagem com filtros** por mês, ano, tipo e categoria
- **Exclusão** de transações
- **Dashboard mensal** com:
  - cards de saldo, total de receitas e total de despesas
  - gráfico de pizza com a distribuição das despesas por categoria
  - gráfico de barras com receitas × despesas dos últimos 6 meses
- **Categorias padrão** (Alimentação, Transporte, Moradia, Salário, Freelance…) criadas automaticamente ao subir a API
- **Rotas protegidas**: só usuários autenticados acessam dashboard e transações, e cada usuário só vê os próprios dados
- **Layout responsivo**, com menu mobile

## 🛠️ Tecnologias

### Front-end (`/interface`)

| Tecnologia | Uso |
| --- | --- |
| React 19 + TypeScript | Interface |
| Vite | Build e servidor de desenvolvimento |
| Tailwind CSS 4 | Estilização |
| React Router | Roteamento e rotas privadas |
| Firebase Auth | Login com Google |
| Axios | Cliente HTTP, com interceptor que envia o token do usuário |
| Recharts | Gráficos do dashboard |
| React Toastify | Notificações |
| Lucide React | Ícones |

### Back-end (`/api`)

| Tecnologia | Uso |
| --- | --- |
| Node.js + TypeScript | Runtime |
| Fastify | Servidor HTTP |
| Prisma | ORM |
| MongoDB | Banco de dados |
| Firebase Admin | Validação do token de autenticação |
| Zod | Validação de entrada e das variáveis de ambiente |
| Day.js | Cálculo de períodos (mês e histórico) |

Ferramentas: **Biome** e **ESLint** para padronizar e analisar o código.

## 🏗️ Arquitetura

```
devbills/
├── interface/            # SPA em React
│   └── src/
│       ├── components/   # Componentes reutilizáveis (Button, Card, Input, Select…)
│       ├── context/      # AuthContext (estado de autenticação)
│       ├── layout/       # Layout das páginas autenticadas (Header + Footer)
│       ├── pages/        # Home, Login, Dashboard, Transações, Nova transação
│       ├── routes/       # Rotas públicas e privadas
│       ├── services/     # Instância do Axios e chamadas à API
│       └── types/        # Tipos TypeScript
│
└── api/                  # API REST em Fastify
    ├── prisma/           # Schema do banco
    └── src/
        ├── config/       # Env, Prisma e Firebase Admin
        ├── controllers/  # Regras de cada endpoint
        ├── middlewares/  # Autenticação
        ├── routes/       # Definição das rotas
        ├── schemas/      # Schemas Zod de validação
        └── services/     # Inicialização das categorias padrão
```

### Fluxo de autenticação

1. O usuário faz login com Google no front-end (Firebase Auth).
2. A cada requisição, um interceptor do Axios pega o ID Token do usuário e envia no header `Authorization: Bearer <token>`.
3. Na API, um middleware valida o token com o Firebase Admin e extrai o `uid` do usuário.
4. Todas as consultas ao banco são filtradas por esse `uid`.

## 📡 Endpoints da API

Prefixo: `/api`. Com exceção do `/health`, todas as rotas exigem o header `Authorization: Bearer <token>`.

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/health` | Verifica se a API está no ar |
| `GET` | `/categories` | Lista as categorias |
| `GET` | `/transactions` | Lista transações (filtros opcionais: `month`, `year`, `type`, `categoryId`) |
| `POST` | `/transactions` | Cria uma transação |
| `DELETE` | `/transactions/:id` | Exclui uma transação |
| `GET` | `/transactions/summary` | Resumo do mês: receitas, despesas, saldo e despesas por categoria (`month`, `year`) |
| `GET` | `/transactions/record` | Receitas × despesas por mês (`month`, `year`, `months` opcional, padrão 6) |

Exemplo de corpo para `POST /transactions`:

```json
{
  "description": "Mercado",
  "amount": 250.9,
  "date": "2026-10-15",
  "categoryId": "<id da categoria>",
  "type": "expense"
}
```

## 🚀 Como rodar localmente

### Pré-requisitos

- Node.js 20+
- Yarn ou npm
- Um banco MongoDB (por exemplo, MongoDB Atlas)
- Um projeto no Firebase com login pelo Google ativado

### 1. Clonar o repositório

```bash
git clone https://github.com/victordelunafreire-rgb/DevBills.git
cd DevBills
```

### 2. Configurar e subir a API

```bash
cd api
yarn install
```

Crie um arquivo `.env` em `api/`:

```env
PORT=3001
NODE_ENV=dev
DATABASE_URL="mongodb+srv://<usuario>:<senha>@<cluster>/<banco>"

# Credenciais da conta de serviço do Firebase (Configurações do projeto > Contas de serviço)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

Gere o cliente do Prisma e inicie o servidor:

```bash
npx prisma generate
yarn dev
```

A API sobe em `http://localhost:3001`, e as categorias padrão são criadas na primeira execução.

### 3. Configurar e subir o front-end

```bash
cd ../interface
yarn install
cp .env.example .env
```

Preencha o `.env` com a URL da API e as credenciais web do Firebase:

```env
VITE_API_URL=http://localhost:3001/api
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Inicie a aplicação:

```bash
yarn dev
```

Acesse `http://localhost:5173`.

## 🗺️ Próximos passos

- [ ] Edição de transações
- [ ] Testes automatizados
- [ ] Deploy

## 👤 Autor

**Victor de Luna Freire**

- GitHub: [@victordelunafreire-rgb](https://github.com/victordelunafreire-rgb)
