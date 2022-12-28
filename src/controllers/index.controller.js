const { Pool } = require('pg')

const bcryptjs = require("bcryptjs")

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'user',
    database: 'postgres',
    password: 'pass',
})

const tmp = {}
const resetPasword  = async (req, res) =>{
    const { newPass, code, email } = req.body;
    if(tmp[email]?.code===code){
        if(tmp[email].expiration > new Date().getTime()){

            const response1 = await pool.query("SELECT * FROM authentication.users where email = $1", [email])
            const bool = !!response1?.rows[0]?.pass
            const passHash = await bcryptjs.hash(newPass,8)
            if (bool){
                await pool.query(
                    `UPDATE authentication.users SET email=$1, pass=$2 WHERE id= $3`,
                    [email, passHash, response1.rows[0].id]
                )
            }
            res.statusCode = 200;
            res.json({
                msg:"Password updated succesfully",
                code: passHash
            })
        }else{
            res.json({
                msg:"token expired",
                code: newPass
            })
        }
        return
    }
    res.json({
        msg:"bad request",
        code: newPass
    })
}

const forgotPasword = async (req, res) =>{
    const { email } = req.body;
    const response = await pool.query("SELECT pass FROM authentication.users where email = $1", [email])
    const bool = !!response?.rows[0]?.pass
    let fake = 'fake'
    if(bool){
        tmp[email] = {
            code:new Date().getTime(),
            expiration: new Date().getTime()+1000*10
        }
        fake = tmp[email].code
        console.log("send time to email", fake);
    }
    res.json({
        msg:"send time to email",
        code: fake
    })
}


const login = async (req, res) => {
    const { pass, email } = req.body;

    const response = await pool.query("SELECT pass FROM authentication.users where email = $1", [email])
    const dbPass = response?.rows[0]?.pass ?? ''
    
    const bool = bcryptjs.compareSync(pass, dbPass)
    res.json(bool)
}


const getUser = async (req, res) => {
    const response = await pool.query("SELECT * FROM authentication.users")
    res.status(200)
    res.json(response.rows)
}

const getUserById = async (req, res) => {
    const response = await pool.query("SELECT * FROM authentication.users where id = $1", [req.params.id])
    res.statusCode = 200;
    res.json(response.rows)
}

const createUser = async (req, res) => {
    const { pass, email } = req.body;
    const passHash = await bcryptjs.hash(pass,8)
    
    pool.query('INSERT INTO authentication.users (pass, email) VALUES ($1, $2)', [passHash, email])
    res.json({
        message: "user added succesfully",
        body: {
            passHash,
            email
        }
    })
}

const deleteUser = async (req, res) => {
    const response = await pool.query("DELETE FROM authentication.users WHERE id= $1", [req.params.id])
    res.statusCode = 200;
    res.send("Deleted")
}

const updateUser = async (req, res) => {
    const { pass, email } = req.body;
    const response = await pool.query(
        `UPDATE authentication.users SET email=$1, pass=$2 WHERE id= $3`,
        [email, pass, req.params.id]
    )
    res.statusCode = 200;
    res.send("User updated successfully")
}
module.exports = {
    getUser,
    createUser,
    getUserById,
    deleteUser,
    updateUser,
    login,
    forgotPasword,
    resetPasword
}