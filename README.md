# HeroManager Web (Vue 3 + Vite + Tailwind)

Frontend do desafio de **Gerenciamento de Heróis**.  
Integra com a **HeroManager API** (.NET 8), oferece CRUD de heróis e seleção de **superpoderes**.

## ✨ Funcionalidades
- Listagem de heróis com tabela responsiva
- **Criar / Editar / Excluir** herói
- Modal com **cabeçalho/rodapé fixos** e corpo rolável
- Seleção de **múltiplos superpoderes** + chips dos selecionados
- Tratamento de erros amigável no topo da modal
- Estilização com **Tailwind CSS**

---

## 🧰 Stack
- **Vue 3** (Composition API + `<script setup>`)
- **Vite** (dev server e build)
- **TypeScript**
- **Tailwind CSS**
- **Vue Router**
- **Axios** (HTTP)
- (Opcional) **Pinia** se usar store

---

## 📦 Requisitos
- **Node.js 18+** (recomendado 20+)
- API rodando (Swagger em `https://localhost:{porta}/swagger`)

---

## 🚀 Como rodar

```bash
# instalar dependências
npm i

# desenvolvimento
npm run dev
# abre em http://localhost:5173
