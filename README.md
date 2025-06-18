# Cf Chat
CF Chat is a chat app for llms designed to be fast and reliable.

## Self Host
First step is to clone to repo

Second step is to set the environment variables;
```bash
DATABASE_URL="postgres://root:mysecretpassword@localhost:5432/local"

# Models
GOOGLE_TOKEN=""
OPENAI_TOKEN=""

# Auth
ZERO_TOKEN="cH9xnpOU6enOHzjBmlBLfxMe1p-Gez5gkMWaO-PtkjI" # This is fine btw
ZERO_APP="t3clonelocal"

GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
```

Next, run the migrations:
```bash
cd ./packages/database
npx drizzle-kit migrate
```

Now, build the web app (technically you can do this first if you want but it dosent really matter)
```bash
pnpm run -r build
```

Finally, you can start the build sveltekit app
```bash
cd ./apps/web && node build
```

## Getting Started with Development
1. Clone the repo
2. Start the database: (You will need docker)
  ```bash
  docker-compose up
  ```
3. Make a `.env` file in the root and set all environment variables in `.env.example`
4. `pnpm run dev` to start the development web server.
