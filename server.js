const express = require('express');
const routers = require('./routes/routes.js');
const app = express();
const port = 3001;
const fs = require('fs');
const path = require('path'); 



app.use('/list' , express.static(path.join(__dirname,'./html')));
app.use('/newuserform' , express.static(path.join(__dirname , './html')))


//restfull
app.use(express.json());
app.use(express.urlencoded({extended:true})); // middleware
app.use('/' , routers)


app.listen( port , ()=> {
    console.log("listening")
})
