const express = require('express');
const config = require('./config');
const cors = require('cors');
const helmet = require('helmet');
const kue = require('kue');
const mongoose = require('mongoose');
const routes = require('./routes');
const { NotFoundError } = require('./errors');

process.on('uncaughtException', (e) => {
    console.error(e);
    process.exit(0);
});

////////// DATABASE //////////
mongoose.connect(config.mongo.database_url, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('connected to database'));

kue.createQueue({ redis: config.redis });
////////// DATABASE //////////

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/kue-ui', kue.app);
app.use(cors());
app.use(helmet());
app.use('/api/', routes);
app.use((req, res, next) => next(new NotFoundError()));

app.use((err, req, res, next) => {
    if (err instanceof Error) {
        console.log(err.message);
        const httpCode = err.getHttpCode();
        const error = err.getError();
        console.log('httpCode', httpCode);
    
        res.status(httpCode).json(error);
    }
    
});

module.exports = app;