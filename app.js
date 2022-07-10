const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');


require('dotenv/config');
const api = process.env.API_URL;



app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
const itemsRouter = require('./routers/products');
const categoriesRoutes = require('./routers/categories');

//middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));

//Routers
app.use(`${api}/products`, itemsRouter);
app.use(`${api}/categories`, categoriesRoutes);

//database
mongoose.connect(process.env.CONNECTION_STRING)
.then(()=>{
    console.log('Database Connection is ready...')
})
.catch((err)=> {
    console.log(err);
})



//developpement 
// app.listen(3000, ()=>{
//     console.log(api);
//     console.log('server is running on http://localhost:3000');
// })

//production

var server = app.listen(process.env.PORT || 3000, function (){
    var port = server.address().port;
    console.log("express working on port" +port)
})