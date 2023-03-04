const { Router } = require("express");
const {
    createOrder,
    getAllOrdersUser,
    updateOrder,
    deleteOrder
} = require("../controllers/order.controller");

const {
    protect
} = require("../middlewares/auth/auth.middleware");

const { validOrder, validUserAndOrderID } = require("../middlewares/restaurant.middleware");

const router = Router()

router.use(protect)

router.get('/me', getAllOrdersUser)

router.post('/', createOrder)

router.patch('/:id', validOrder, validUserAndOrderID, updateOrder)

router.delete('/:id', validOrder, validUserAndOrderID, deleteOrder)

module.exports = {
    orderRouter: router
}