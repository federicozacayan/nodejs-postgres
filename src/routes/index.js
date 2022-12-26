const { Router } = require("express")
const router = Router()

const {
    getUser,
    createUser,
    getUserById,
    deleteUser,
    updateUser
} = require('../controllers/index.controller')

router.get('/user', getUser)
router.get('/user/:id', getUserById)
router.post('/user', createUser)
router.delete('/user/:id', deleteUser)
router.put('/user/:id', updateUser)




module.exports = router