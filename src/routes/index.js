const { Router } = require("express")
const router = Router()

const {
    getUser,
    createUser,
    getUserById,
    deleteUser,
    updateUser,
    login,
    forgotPasword,
    resetPasword
} = require('../controllers/index.controller')

router.get('/user', getUser)
router.get('/user/:id', getUserById)
router.post('/user', createUser)
router.delete('/user/:id', deleteUser)
router.put('/user/:id', updateUser)
router.post('/login', login)
router.post('/forgot-password', forgotPasword)
router.post('/reset-password', resetPasword)




module.exports = router