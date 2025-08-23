const bodyParser = require('body-parser');
const express = require('express');
const connectDb = require('./config/db');
const app = express();
const port = 3000;
const cors = require('cors')

app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


connectDb();

app.get('/', (req, res) => {
    res.send('This is PouchPro backend running ');
});
app.use("/form/",require("./routes/index"))
app.use("/invoice/",require("./routes/InvoiceRoutes"))


app.listen(port, () => {
    console.log(`PouchPro backend is running on port ${port}`);

});
