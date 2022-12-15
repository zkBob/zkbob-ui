### E2E UI TESTS

Install dependencies:
```
npm install --global yarn
yarn
```

Create `.env.local` file :
```
BASE_URL=""
ZKACCOUNT_PASSWORD=""
ZKACCOUNT_SEED_PHRASE=""
ZKBOB_RECEIVER_ADDRESS = ""


METAMASK_PASSWORD = ""
METAMASK_SEED_PHRASE = ""
ADDRESS_METAMASK_ACCOUNT = ""
```
Run:
```
yarn test
```