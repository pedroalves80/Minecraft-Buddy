# 🧱 Minecraft Buddy

![CI](https://github.com/pedroalves80/Minecraft-Buddy/actions/workflows/ci.yml/badge.svg)
![Docker](https://github.com/pedroalves80/Minecraft-Buddy/actions/workflows/docker.yml/badge.svg)
![CodeQL](https://github.com/pedroalves80/Minecraft-Buddy/actions/workflows/codeql.yml/badge.svg)
[![License](https://img.shields.io/github/license/pedroalves80/Minecraft-Buddy)](LICENSE)

> Your friendly Discord companion for Minecraft servers — status tracking, player lists, server alerts, and more!

---

## ✨ Overview

**Minecraft Buddy** is a TypeScript-powered Discord bot built to make Minecraft server management easier for small communities.  
It lets you track server status, manage player notes, subscribe to online notifications, and share coordinates or map pins — all from Discord.

Built on top of:

- 🧩 **discord.js** for Discord API interaction
- 🧠 **MongoDB** for persistence
- 🧪 **Vitest** for testing
- ⚙️ **ESLint + Prettier + Commitlint** for clean code
- 🐳 **Docker + GitHub Actions** for CI/CD automation

---

## 🏗️ Features

| Category           | Description                                                       |
| ------------------ | ----------------------------------------------------------------- |
| 🖥️ Server Status   | `/mc-status` — Check if your Minecraft server is online           |
| 👥 Player List     | `/mc-players` — View currently connected players                  |
| 📝 Notes           | `/mc-note` — Add, list, or delete player notes                    |
| 🧭 Map Pins        | `/mc-pin` — Store base/landmark coordinates                       |
| 🔔 Subscriptions   | `/mc-subscribe` — Notify users when the server starts             |
| 🧰 Admin           | `/rcon`, `/mc-set`, `/admin-sync` — Optional management utilities |
| ⏰ Watcher         | Periodic cron job to monitor server status                        |
| 💾 MongoDB Indexes | TTL + guild-based indexes for optimized storage                   |

---

## 🚀 Getting Started

### 1. Clone and Install

    git clone https://github.com/pedroalves80/Minecraft-Buddy.git
    cd Minecraft-Buddy
    npm ci

### 2. Configure Environment

Create a `.env` file in the project root:

    DISCORD_TOKEN=your_discord_bot_token
    CLIENT_ID=your_client_id
    MONGODB_URI=mongodb://localhost:27017/minecraft-buddy

Also change all the `.example.json` in the `config/` folder to `.json` and adjust settings as needed.

### 3. Run Locally

    npm start

---

## 🧪 Testing & Linting

| Command                | Purpose                                |
| ---------------------- | -------------------------------------- |
| `npm run test`         | Run unit/integration tests with Vitest |
| `npm run lint`         | Lint code with ESLint                  |
| `npm run typecheck`    | Verify TypeScript types                |
| `npm run format:check` | Check Prettier formatting              |

---

## 🐳 Docker Support

Build and run the bot in Docker:

    docker build -t minecraft-buddy .
    docker run -d --name mc-buddy \
      -e DISCORD_TOKEN=your_token \
      -e CLIENT_ID=your_id \
      -e MONGODB_URI=mongodb://mongo:27017/minecraft-buddy \
      minecraft-buddy

or use **Docker Compose** (recommended):

    version: '3.8'
    services:
      mongo:
        image: mongo:latest
        volumes:
          - mongo-data:/data/db
      bot:
        build: .
        depends_on:
          - mongo
        env_file: .env
    volumes:
      mongo-data:

---

## ⚙️ Continuous Integration

GitHub Actions automatically handle:

- ✅ **CI:** Lint, typecheck, test, and build on every PR
- 🐳 **Docker:** Build and push image to GHCR
- 🛡️ **CodeQL:** Scan for security issues

See:

- `.github/workflows/ci.yml`
- `.github/workflows/docker.yml`
- `.github/workflows/codeql.yml`

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-idea`)
3. Commit changes using [Conventional Commits](https://www.conventionalcommits.org/)
4. Push and open a PR 🚀

Pre-commit hooks run **ESLint**, **Prettier**, and **Commitlint** to keep code consistent.

---

## 🧠 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

> Built with ❤️ by [Pedro Alves](https://github.com/pedroalves80)
