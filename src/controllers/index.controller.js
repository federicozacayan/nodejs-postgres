const { Pool } = require('pg')

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'user',
    database: 'db',
    password: 'pass',
})

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
    pool.query('INSERT INTO authentication.users (pass, email) VALUES ($1, $2)', [pass, email])
    res.json({
        message: "user added succesfully",
        body: {
            pass,
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
    updateUser
}