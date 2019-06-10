import chalk from 'chalk';
import express from 'express';
import http from 'http';
import os from 'os';
import path from 'path';
import { setupApis } from './apis';

const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

setupApis(app);

const port = (() => {
    const val = process.env.PORT || '5000';
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }

    return false;
})();

server.listen(port, () => {
    console.log(chalk.bold.green(`API listening on http://localhost:${port}`))
    console.log(chalk.bold.green(`API listening on http://${os.hostname()}:${port}`))
});