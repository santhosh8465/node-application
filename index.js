const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
//const db = require('./queries')
//const res = require('./queries')
//const res = require('./queries')
const https = require("https");
const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'apidb',
    password: 'test123',
    port: 5432,
})
const results="";
let res="";
const data = {
    id : 1301,
    price : 22,
    programid : 102,
    drugprogramid : 103,
    createdat : '1963-06-16',
}
let body = "";
let price = "";
const fetchPrice = (request, response) => {
    pool.query('select * from drugmasterdetails ', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)

        res = results.rows;
        //let obj = jsonParser(results);
        //console.log(res[0]);
        for(let i=0; i < res.length; i++) {
            const request = require("request");
            let url = "https://api.uspharmacycard.com/drug/price/147/none/"+res[i].zipcode+"/"+res[i].ndc+"/"+encodeURIComponent(res[i].name)+"/"+res[i].drugtype+"/"+res[i].quantity+"/8";


            request({
                url: url,
                headers: {
                    'Connection': 'keep-alive'
                }
            }, function (error, response,body) {
                //let data;


                if (!error && response.statusCode === 200) {
                    let res = JSON.parse(body);
                    data.price = res.priceList[0].formattedDiscountPrice;
                    data.price = parseInt(data.price.replace('$', ''));
                    console.log("price " +data.price);
                    const query1 = 'INSERT INTO price (id, price, programid, drugprogramid, createdat)'
                    const query2 = 'INSERT INTO price(id, price, programid, drugprogramid, createdat) VALUES($1,$2,$3,$4,$5) RETURNING *';
                    const values = [data.id, data.price, data.programid, data.drugprogramid, data.createdat];
                    // const pool = new Pool({
                    //     user: 'test1',
                    //     host: 'localhost',
                    //     database: 'apidb',
                    //     password: 'test123',
                    //     port: 5432,
                    // })
                    pool.connect();
                    pool.query(query2, values, (error, result) => {

                        if (error) {
                            result.status(400).json({error});
                        }
                    });
                }
            });
            //
            // https.get(url, res => {
            //     res.setEncoding("utf8");
            //
            //     res.on("data", data => {
            //         body += data;
            //     });
            //     res.on("end", () => {
            //         console.log("test:"+body);
            //         let body = JSON.parse(body);
            //         data.price = body.priceList[0].formattedDiscountPrice;
            //         data.price = parseInt(data.price.replace('$', ''));
            //         console.log("price " +data.price);
            //         const query1 = 'INSERT INTO price (id, price, programid, drugprogramid, createdat)'
            //         const query2 = 'INSERT INTO price(id, price, programid, drugprogramid, createdat) VALUES($1,$2,$3,$4,$5) RETURNING *';
            //         const values = [data.id, data.price, data.programid, data.drugprogramid, data.createdat];
            //         // const pool = new Pool({
            //         //     user: 'test1',
            //         //     host: 'localhost',
            //         //     database: 'apidb',
            //         //     password: 'test123',
            //         //     port: 5432,
            //         // })
            //         pool.connect();
            //         pool.query(query2, values, (error, result) => {
            //
            //             if (error) {
            //                 result.status(400).json({error});
            //             }
            //         });
            //     });
            // });
        }
    })
}
app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)
app.get('/', (request, response) => {
    response.json({ info: 'test API' })
})
app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})
app.get('/fetch', fetchPrice)


