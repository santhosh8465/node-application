const {Pool, Client} = require('pg');
const connectionString = 'postgresql://postgres:test123@localhost:5432/apidb'

const client=new Client({
    connectionString:connectionString
})

client.connect()
client.query('SELECT * FROM price',(err,res)=>{
    console.log(err,res)
    client.end()
})
