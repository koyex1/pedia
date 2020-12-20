const express = require('express');
const connectDB = require('./config/db');
var bodyParser = require('body-parser');  
const cors = require("cors"); 

const app = express();

var corsOptions = {
  origin: "http://localhost:4200"
};

app.use(cors(corsOptions));


app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json({ extended: false }));

//Define Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/subtopics', require('./routes/subtopics'));
app.use('/api/references', require('./routes/references'));
app.use('/api/gallerys', require('./routes/gallerys'));




connectDB();

//Serve static assets in production

 app.get('/', (req, res) => {
   res.json({ msg: 'Welcome to the Product Manager API' })
 });
 

//Bug: used port 6000 page wasnt loading yet no error
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
