# 🐺 Chat FURIA

Este projeto é um sistema de **chat em tempo real** para a FURIA.
Ele simula partidas e conversas, podendo ser usado para interações entre torcedores, simulações de scrims, estatísticas
e discussões em tempo real durante os jogos.

## Tecnologias

- [Vue 3](https://vuejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Express](https://expressjs.com/)
- [Prisma ORM](https://www.prisma.io/) + MySQL
- [Socket.io](https://socket.io/)

## Instalação

```bash
# Clonar o projeto
git clone

# Entrar na pasta do frontend
cd frontend
npm install
npm run dev

# Em outro terminal, iniciar o backend
cd backend
npm install
npm run dev
```

## Funcionalidades

Listagem de chats (partidas)
Troca de mensagens em tempo real entre usuários (modo espectador e ativo)

## Testando com Postman

A criação de partidas, seria feita de forma automatica usando alguma integração, mas não consegui fazer funcionar.
No entanto, você pode criar partidas manualmente usando o Postman com a coleção anexada ao projeto.

## Funcionalidades Planejadas

- Reações nas mensagens
- Sistema de banimento de usuários por abuso ou spam (bans)
- Notificações em tempo real para novas mensagens ou menções
- Sistema de menções com @username para destacar mensagens entre usuários
- Ranking de atividade com troféus por participação (XP, tempo online, envios, etc.)
- Modo "somente leitura" para visitantes (sem login)
- Integração com estatísticas das partidas (rounds, KDA, mapas, etc.)