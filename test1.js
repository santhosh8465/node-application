
const pg = require('pg');
const pool = new pg.Pool({
    user: 'postgres',
    host: '10.80.1.121',
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

    pool.query('select * from drugmasterdetails ', (error, results) => {
        if (error) {
            throw error
        }
        //response.status(200).json(results.rows)
        res = results.rows;
        //let obj = jsonParser(results);
        //console.log(res[0]);
                    const query2 = 'INSERT INTO price(id, price, programid, drugprogramid, createdat) VALUES($1,$2,$3,$4,$5) RETURNING *';
                    const values = [data.id, data.price, data.programid, data.drugprogramid, data.createdat];
                    pool.connect();
                    pool.query(query2, values, (error, result) => {

                        if (error) {
                            result.status(400).json({error});
                        }
                    });

            });





