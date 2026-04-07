const express = require('express');
const app = express();
const port = 1000;

app.get('/',(req,res)=>{
    res.send('hello world');
});
app.listen(port,()=>{
    console.log(`started http://localhost:${port}`)}
);
