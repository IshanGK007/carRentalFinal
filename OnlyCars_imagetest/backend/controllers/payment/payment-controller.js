const dotenv = require("dotenv");
const crypto = require("crypto");
//add dotenv config
dotenv.config();

const {rentCar} = require("../../services/rental/rental-services");
const {createRazorInstance} = require("../../config/razorpay-config");

//Create a razorpay instance
const razorPayInstance = createRazorInstance();

//Create a RazorPay Order
const createOrder = async(req, res) => {
    //getting the fields
    const {carId,amount,userId, rentedFrom, rentedTo } = req.body;
    if(!carId || !amount || !userId || !rentedFrom || !rentedTo) {
        return res.status(400).json({
            success: false,
            message: 'Please enter required fields!',
        });
    }
    //create an order
    const options = {
        amount: amount*100, //amount is the smallest currency unit
        currency: 'INR',
        receipt:`receipt_order_${amount}`,
    }

    try {
        razorPayInstance.orders.create(options, async (err, order) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: 'Something went wrong while creating RazorPay order',
                });
            }

            // Call the rentCar function after order creation
            req.body.carId = carId;
            req.body.userId = userId;
            req.body.rentedFrom = rentedFrom;
            req.body.rentedTo = rentedTo;

            try {
                const rentCarResponse = await rentCar({carId,userId,rentedFrom,rentedTo}); // Call rentCar with req and res
                if (rentCarResponse.success) {
                    return res.status(200).json({
                        success: true,
                        message: 'Successfully created order and rented car',
                        order,
                        rentCar: rentCarResponse.car,
                    });
                }else{
                    res.status(400).json({
                        success: false,
                        message: rentCarResponse.message,
                    })
                }
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to rent car',
                    error,
                });
            }
        });
    } catch (e) {
      return res.status(500).json({
            success: false,
            message: 'Something went wrong while creating RazorPay order',
            error: e,
        });
    }
}

//Verify the payment
const verifyPayment = async(req, res) => {
    //get the required fields
    const {order_id,payment_id,signature} = req.body;
    //get the secret key
    const secretKey = process.env.RAZORPAY_KEY_SECRET;
    //create hmac object
    const hmac = crypto.createHmac('sha256', secretKey);
    //update the hmac object
    hmac.update(order_id+'|'+payment_id);
    //generate signature key
    const generatedSignature = hmac.digest("hex");
    console.log(generatedSignature);
    //compare the generated and original signatures
    if(generatedSignature === signature){
        return res.status(200).json({
            success:true,
            message:"Payment verified successfully",
        });
    }else{
        return res.status(400).json({
            success:false,
            message:"Payment not verified",
        });
    }
}

module.exports = {createOrder, verifyPayment};