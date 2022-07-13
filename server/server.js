const express = require('express');
const app = express();
const cors = require('cors');
const router = require('./routes/router');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(router);

app.listen(3000 , () => {
    console.log('Start server ...');
});