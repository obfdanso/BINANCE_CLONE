# Bitby

A cryptocurrency exchange built for the Ghanaian market — an Expo/React Native
app backed by a Spring Boot service. Balances are held in cedis alongside
crypto, deposits run through Paystack, and the market feed comes from CoinGecko.

```
frontend/   Expo (SDK 53) app — the phone client
backend/    Spring Boot 3.4 service + PostgreSQL — the API
```

---

## ⚠️ There is no hosted backend

**The API is not deployed anywhere.** Cloning this repository gives you the app
and the service, not a running server, so the app on its own has nothing to talk
to: sign-in fails, prices do not load, and balances stay empty.

To use Bitby you have to run the backend yourself, either locally (below) or on
a host you control. `backend/render.yaml` is set up for Render if you want the
second option — the secrets in it are marked `sync: false`, so Render asks you
for each value rather than reading it from the file.

A hosted backend also has to be reachable from wherever the phone is. A backend
running on your laptop is only reachable from the same Wi-Fi network.

---

## Running it locally

### You will need

| | |
|---|---|
| **JDK 21** | The build targets 21. Newer JDKs fail: the Lombok version this project pins does not support them. |
| **PostgreSQL 14+** | Any recent version. |
| **Node.js 18+** | For the Expo app. |
| **Expo Go, SDK 53 build** | Get it from `https://expo.dev/go?sdkVersion=53&platform=android&device=true`. The Play Store version supports only the newest SDK and will refuse to open this project. |

### 1. Database

Create a database and a role for the app:

```sql
CREATE ROLE bitby_user WITH LOGIN PASSWORD 'choose-a-password';
CREATE DATABASE bitby_db OWNER bitby_user ENCODING 'UTF8';
GRANT ALL PRIVILEGES ON DATABASE bitby_db TO bitby_user;
\connect bitby_db
GRANT ALL ON SCHEMA public TO bitby_user;
ALTER SCHEMA public OWNER TO bitby_user;
```

There is no migration step. Hibernate builds the schema from the entity classes
on first start, and two `CommandLineRunner`s seed the trading pairs and the
revenue pool. An empty database is the expected starting point.

### 2. Backend configuration

```bash
cd backend
cp env.example .env        # .env is gitignored
```

Fill in `.env`. Secrets have **no fallback values** — a missing one stops the
application at startup rather than letting it run on something committed to the
repository.

- `DB_URL`, `DB_USER`, `DB_PASSWORD` — what you created above
- `JWT_SECRET` — generate one with `openssl rand -base64 64`
- `MAIL_*` — a Gmail **App Password**, not the account password. Without it the
  app still runs, but signup cannot send its verification code.
- `PAYSTACK_*` — from your Paystack dashboard, Settings → API Keys
- `TELEGRAM_BOT_TOKEN` — from @BotFather. The service registers the bot at
  startup, so an invalid token stops it booting.

### 3. Start the backend

```bash
cd backend
./mvnw spring-boot:run        # listens on :8080
```

API documentation is at `http://localhost:8080/swagger-ui/index.html`.

### 4. Start the app

```bash
cd frontend
npm install
npx expo start
```

Scan the QR code with Expo Go. **Phone and laptop must share a Wi-Fi network** —
the app finds the backend at the LAN address Expo Go used to download the
bundle, so it keeps working when your IP changes, but it cannot reach a laptop
on a different network.

Pointing at a deployed backend instead: add to `frontend/app.json`

```json
"extra": { "apiBaseUrl": "https://your-backend.example.com" }
```

An explicit value always wins over LAN discovery.

---

## What works

Sign-in and email signup, the market feed (100 coins), portfolio balances and
valuation, convert, P2P listings and escrow, spot order placement and matching
with settlement, and the wallet.

## What does not

- **Futures, margin and options** have no backend endpoints. Those screens show
  static placeholder data.
- **Earn**, the **Square** feed and **Bitby Learn** are static content.
- **Send** collects a wallet address, but the only withdrawal endpoint is a
  Paystack mobile-money payout keyed on a phone number. They are different
  operations, so the transfer is not wired.
- **Signup email** needs `MAIL_*` configured; without it the verification code
  cannot be delivered.
- Cancelling a spot order does not refund anything, because placing one does not
  deduct anything — commitment is tracked by querying open orders instead.

## Known limitations

Balances are stored as `double`, so values like `749.6610000000001` appear.
Moving them to `BigDecimal` needs a schema migration.

Order placement takes a row lock per account and `User` carries a version
column, which keeps one account from overcommitting across concurrent requests.
Settlement writes the counterparty without a lock and relies on that version to
detect a conflict.
