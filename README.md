# openblockchain: Frontend

Frontend is one of the microservices which comprise the openblockchain application.

### Architecture

The project is managed through the [openblockchain](https://github.com/open-blockchain/openblockchain)

The project is split into several services:

- **Cassandra** persists the data: blocks, transactions, and visualisations (analysed data).
- **Bitcoin** is used to connect to the Bitcoin blockchain. It's a simple Bitcoin Core node whose role is to index all the blocks and transactions and make them consumable through a HTTP JSON RPC interface.
- [Scanner](https://github.com/open-blockchain/scanner) connects to the bitcoin service through its APIs and stores all the blocks and transactions in the Cassandra database.
- [Spark](https://github.com/open-blockchain/spark) analyses the Bitcoin blockchain data stored in Cassandra.
- [API](https://github.com/open-blockchain/node-api) is a REST interface that allows clients to consume the data stored in Cassandra.
- [Frontend](https://github.com/open-blockchain/frontend) is the web app used to explore the blockchain and visualise analysed data.

Each service contains 1 or more containers and can be scaled independently from each other.

### Installation

```bash
npm install
```

## Running Dev Server

```bash
npm run dev
```

The first time it may take a little while to generate the first `webpack-assets.json` and complain with a few dozen `[webpack-isomorphic-tools] (waiting for the first Webpack build to finish)` printouts, but be patient. Give it 30 seconds.

### Using Redux DevTools

[Redux Devtools](https://github.com/gaearon/redux-devtools) are enabled by default in development.

- <kbd>CTRL</kbd>+<kbd>H</kbd> Toggle DevTools Dock
- <kbd>CTRL</kbd>+<kbd>Q</kbd> Move DevTools Dock Position
- see [redux-devtools-dock-monitor](https://github.com/gaearon/redux-devtools-dock-monitor) for more detailed information.

If you have the
[Redux DevTools chrome extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd) installed it will automatically be used on the client-side instead.

If you want to disable the dev tools during development, set `__DEVTOOLS__` to `false` in `/webpack/dev.config.js`.
DevTools are not enabled during production.

## Building and Running Production Server

```bash
npm run build
npm run start
```
