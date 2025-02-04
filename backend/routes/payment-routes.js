const express = require('express');
const paymentRouter = express.Router();
const {createOrder,verifyPayment} = require('../controllers/payment/payment-controller');

paymentRouter.post('/create-order', createOrder);
paymentRouter.post('/verify-payment', verifyPayment);

module.exports = paymentRouter;