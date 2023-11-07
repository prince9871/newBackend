const express = require('express');
const mongoose = require('mongoose');
const app = express();
const Router = require('./routers/router');
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://localhost:3000"); // Update with your front-end's URL
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Headers", "https://ai.botcontrolpanel.com")
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});
app.use(express.json());
mongoose.connect('mongodb+srv://verstechprince:verstechprince@cluster0.kttxx2i.mongodb.net/apiDatabase')
  .then(() => console.log('mongoDb connected'))
  .catch((err) => console.log(err));

app.use('/', Router);
const port = 3001;
app.listen(port, () => console.log(`api listening on ${port}`));
