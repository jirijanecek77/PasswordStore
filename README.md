Before run make sure you have mongo DB running on 127.0.0.1:27017
Initialize DB before first run:

    `npm run migrate`

### How to run
Install dependencies `npm install`

---

Create .env properties:

PORT=3001

LOG_LEVEL=

DB_HOST=mongodb://127.0.0.1:27017

DB_NAME=password-store

JWT_SECRET=

GOOGLE_CLIENT_ID=

GOOGLE_SECRET=

GOOGLE_REDIRECT_URL=http://localhost:3001/google/redirect

SESSION_TIMEOUT_SEC=600

---

Run application `npm run start`

Log in as Google user `http://localhost:3001/google`

Add token to header as Bearer token for all the requests.


### Documentation

`http://localhost:3001/api`