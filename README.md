# Lazy Greeting Cards

![Lazy Greeting Cards](./screenshot.png)

Generate greeting cards from a simple description using the latest in AI technology. It uses Llama 3 to generate a catchy greeting card text and SDXL to generate the greeting card artwork!

This project is:

1. fully open-source
2. completely free to use and distribute
3. comes with a ton of features out of the box!
4. focused on free, open-source services, where possible

## What's inside?

The project itself is built on top of some very powerful tools and frameworks, including:

- 🐝 [Wasp](https://wasp-lang.dev) - a full-stack React, NodeJS, Prisma framework with superpowers
- 🚀 [Supabase](https://supabase.com/) - great PaaS product with DB, Storage etc.
- 💅 [TailwindCSS](https://tailwindcss.com) and [ShadCN](https://ui.shadcn.com/) - for styling and components
- 🤖 [Replicate](https://replicate.com/) - simplest way to run AI models at a low cost

Because we're using Wasp as the full-stack framework, we can leverage a lot of its features to build the app:

- 🔐 [Full-stack Authentication](https://wasp-lang.dev/docs/auth/overview) - Email verified + social Auth in a few lines of code.
- ⛑ [End-to-end Type Safety](https://wasp-lang.dev/docs/data-model/operations/overview) - Type your backend functions and get inferred types on the front-end automatically, without the need to install or configure any third-party libraries. Oh, and type-safe Links, too!
- 🤖 [Jobs](https://wasp-lang.dev/docs/advanced/jobs) - Run cron jobs in the background or set up queues simply by defining a function in the config file.
- 🚀 [One-command Deploy](https://wasp-lang.dev/docs/advanced/deployment/overview) - Easily deploy via the CLI to [Fly.io](https://fly.io), or to other providers like [Railway](https://railway.app) and [Netlify](https://netlify.com).

You also get access to Wasp's diverse, helpful community if you get stuck or need help.
- 🤝 [Wasp Discord](https://discord.gg/aCamt5wCpS)

## Getting Started

### Simple Instructions

1. First, to install the latest version of [Wasp](https://wasp.sh/) on macOS, Linux, or Windows with WSL, run the following command:
    ```bash
    curl -sSL https://get.wasp-lang.dev/installer.sh | sh
    ```

2. Then, copy the `env.server.example` to `.env.server` and fill in the necessary environment variables. You'll need to set up a Google OAuth app, a Supabase account, and a Replicate account to get started.

3. After you set up the `env` variables in the `.env.server` file, run the following to apply the migrations:
    ```bash
    wasp db migrate-dev
    ```

4. Finally, run the following command to start the Wasp app:
    ```bash
    wasp start
    ```
