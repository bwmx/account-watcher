# Account Watcher

A service created as part of a coding challenge. Tracks algorand accounts and their state (balance) changes periodicly (every 60 seconds) logging a message to the console to notify when their state has changed.

A REST API is provided to allow 2 functions; add a new account to the watch list and get all accounts in the watch list. The routes are documented below.

## Getting Started

### Environment Variables

| Name           | Value                          |
| -------------- | ------------------------------ |
| `PORT`         | Port the server will listen on |
| `ALGOD_TOKEN`  | Algod token                    |
| `ALGOD_SERVER` | Algod host                     |
| `ALGOD_PORT`   | Algod port                     |

### Local/Development/Testing

1. Clone this repo
2. Use `npm install` to install required dependencies.
3. Then use `npm run dev` to run a development version of the server.

### Deployment

This project is well suited for deployment on various cloud platform services due to being a node project without any complex dependencies. All of the environment variables (documented above) must be available. If any additional configuration is required you can see below:

The build command: `npm run build`

Start command: `npm run start`

Docker/containerization could also be used easily to deploy, this project is standalone.

## Routes

### Get all watched accounts and their state

GET `/watcherAccounts`

No parameters required.

Returns an array of all watched accounts (might be an empty array if none are being tracked). See below for raw response:

```
200 OK
[
  {
    "address": "...",
    "balance:": 1000,
    "lastUpdatedRound:" 1002
  },
  {
    "address": "...",
    "balance:": 1000,
    "lastUpdatedRound:" 1002
  }s
]
```

Returns an array of objects (potentially empty) with following properties:

`address` is the string representation of the account address.
`balance` is the accounts balance (in microalgo).
`lastUpdatedRound` is when the users balance was last updated (or created).

### Create/add new account to be watched

POST `/watcher/accounts`

Body must contain JSON with the below properties:

```
{
  "account": string
}
```

Returns the newly created `WatcherAccount` in a serialised format (converting the bigint values to number). Example response below:

```
200 OK

{
  "address": "...",
  "balance": 1000,
  "lastUpdatedRound": 1002
}

```

`address` is the string representation of the account address.
`balance` is the accounts balance (in microalgo).
`lastUpdatedRound` is when the users balance was last updated (or created).
