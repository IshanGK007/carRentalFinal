import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const PaymentPage = () => {
  const [carDetails, setCarDetails] = useState(null);
  const [amount, setAmount] = useState(0);
  const [userId, setUserId] = useState(null);
  const [rentedFrom, setRentedFrom] = useState('');
  const [rentedTo, setRentedTo] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { carId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch car details from the API
    const fetchCarDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/car/get-car-by-id/${carId}`);
        setCarDetails(response.data.car);
        setAmount(response.data.car.price);
      } catch (error) {
        console.error('Error fetching car details:', error);
      }
    };

    // Fetch user details to get userId
    const fetchUserDetails = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("No token found");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get('http://localhost:8080/api/auth/user/details', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserId(response.data.id);
      } catch (error) {
        console.error(error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          navigate("/login");
        }
      }
    };

    fetchCarDetails();
    fetchUserDetails();
  }, [carId, navigate]);

  const handlePayment = async () => {
    if (!userId || !carDetails || !rentedFrom || !rentedTo) {
      alert('Please complete all fields');
      return;
    }

    try {
      const rentedFromISO = new Date(rentedFrom).toISOString().split('T')[0];
      const rentedToISO = new Date(rentedTo).toISOString().split('T')[0];

      const orderData = {
        carId: carId,
        amount: amount,
        userId: userId,
        rentedFrom: rentedFromISO, 
        rentedTo: rentedToISO,
      };

      console.log("Order data:", orderData);


      const response = axios.post('http://localhost:8080/api/payment/create-order', orderData, {
      headers: {
        'Content-Type': 'application/json',
      },
});
      console.log(response.data);

      if (response.data.success) {
        alert('Order created successfully!');
        const orderDetails = response.data.order;

        // Razorpay payment integration
        const options = {
          key: 'YOUR_RAZORPAY_KEY', // Add your Razorpay key here
          amount: orderDetails.amount * 100, // Amount is in paise (1 INR = 100 paise)
          currency: orderDetails.currency,
          name: 'Car Rental Payment',
          description: `Payment for renting ${carDetails.make} ${carDetails.model}`,
          image: 'URL_TO_YOUR_LOGO', // Optional, you can set your own logo
          order_id: orderDetails.id, // Your order ID
          handler: function (response) {
            // Payment handler to verify payment after successful transaction
            const paymentDetails = {
              order_id: orderDetails.id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            };

            axios.post('http://localhost:8080/api/payment/verifyPayment', paymentDetails)
              .then((verificationResponse) => {
                if (verificationResponse.data.success) {
                  console.log('Payment verified successfully');
                  setPaymentSuccess(true);
                  alert('Payment verified successfully!');
                } else {
                  console.log('Payment verification failed');
                  alert('Payment verification failed');
                }
              })
              .catch((error) => {
                console.error('Error verifying payment:', error);
              });
          },
          prefill: {
            name: 'Customer Name', // Use your customer's name
            email: 'customer@example.com', // Use your customer's email
            contact: '9999999999', // Use your customer's contact number
          },
          theme: {
            color: '#3399cc', // Change the button color if necessary
          },
        };

        // Initialize Razorpay Checkout
        const razorpay = new window.Razorpay(options); // Use window.Razorpay as it's globally available
        razorpay.open();
      } else {
        console.error('Error creating payment order:', response.data.message);
      }
    } catch (error) {
      console.error('Error creating payment:', error);
    }
  };

  if (!carDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 md:px-12">
      <div className="bg-white shadow-xl rounded-lg p-8">
        {paymentSuccess ? (
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-gray-800 mb-4">Payment Successful!</h1>
            <p className="text-xl text-gray-500 mb-4">
              Your payment has been processed successfully. We will proceed with the car rental.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Home
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-semibold text-gray-800 mb-4">Payment Details</h1>
            <p className="text-xl text-gray-500 mb-8">Complete your payment to proceed with renting the car.</p>

            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-700">Car Details</h2>
              <p className="text-md">Make: {carDetails.make}</p>
              <p className="text-md">Model: {carDetails.model}</p>
              <p className="text-md">Price: ₹{carDetails.price}</p>
            </div>

            <div className="mb-4">
              <label htmlFor="rentedFrom" className="block text-lg font-semibold text-gray-700 mb-2">Rented From</label>
              <input
                type="date"
                id="rentedFrom"
                value={rentedFrom}
                onChange={(e) => setRentedFrom(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="rentedTo" className="block text-lg font-semibold text-gray-700 mb-2">Rented To</label>
              <input
                type="date"
                id="rentedTo"
                value={rentedTo}
                onChange={(e) => setRentedTo(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="amount" className="block text-lg font-semibold text-gray-700 mb-2">Total Amount</label>
              <p className="text-lg font-semibold">₹{amount}</p>
            </div>

            <button
              onClick={handlePayment}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Proceed to Payment
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;



//v2 working 
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate, useParams } from 'react-router-dom';

// const PaymentPage = () => {
//   const [carDetails, setCarDetails] = useState(null);
//   const [amount, setAmount] = useState(0);
//   const [userId, setUserId] = useState(null);
//   const [rentedFrom, setRentedFrom] = useState('');
//   const [rentedTo, setRentedTo] = useState('');
//   const [paymentSuccess, setPaymentSuccess] = useState(false);
//   const { carId } = useParams();
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Fetch car details from the API
//     const fetchCarDetails = async () => {
//       try {
//         const response = await axios.get(`http://localhost:8080/api/car/get-car-by-id/${carId}`);
//         console.log(response.data); // Logs the full response
//         setCarDetails(response.data.car); // Corrected to access 'car' from response.data
//         setAmount(response.data.car.price); // Updated to access price from the correct location
//       } catch (error) {
//         console.error('Error fetching car details:', error);
//       }
//     };

//     // Fetch user details to get userId
//     const fetchUserDetails = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         console.error("No token found");
//         navigate("/login"); // Redirect to login if no token is found
//         return;
//       }

//       try {
//         const response = await axios.get('http://localhost:8080/api/auth/user/details', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setUserId(response.data.id);
//       } catch (error) {
//         console.error(error);
//         if (error.response?.status === 401 || error.response?.status === 403) {
//           navigate("/login");
//         }
//       }
//     };

//     fetchCarDetails();
//     fetchUserDetails();
//   }, [carId, navigate]);

//   const handlePayment = async () => {
//     // Check if all necessary details are available
//     if (!userId || !carDetails || !rentedFrom || !rentedTo) {
//       alert('Please complete all fields');
//       return;
//     }
//     console.log('Payment button clicked');
//     console.log(userId, carDetails, rentedFrom, rentedTo, amount, carId);

//     try {
//       // Ensure the rentedFrom and rentedTo are in ISO 8601 format
//       const rentedFromISO = new Date(rentedFrom).toISOString().split('T')[0];
//       const rentedToISO = new Date(rentedTo).toISOString().split('T')[0];

//       // Prepare data for payment creation
//       const orderData = {
//         carId: carId,
//         amount: amount,
//         userId: userId,
//         rentedFrom: rentedFromISO, // Make sure this is ISO 8601 format
//         rentedTo: rentedToISO, // Make sure this is ISO 8601 format
//       };

//       // Make API call to create the payment order
//       const response = await axios.post('http://localhost:8080/api/payment/create-order', orderData);

//       if (response.data.success) {
//         alert('order created successfully!');
//         console.log(response);

//         const validatePayment = async () => {
//           try {
//             const paymentDetails = {
//               order_id: response.data.id,
//               payment_id: response.data.paymentId,
//               signature: response.data.signature,
//             };

//             const verificationResponse = await axios.post('http://localhost:8080/api/payment/verifyPayment', paymentDetails);
//             if (verificationResponse.data.success) {
//               console.log('Payment verified successfully');
//               setPaymentSuccess(true);
//               alert('Payment verified successfully!');
//               } else {
//                 console.log('Payment verification failed');
//                 alert('Payment verification failed');
//               }
//           } catch (error) {
//             console.error('Error verifying payment:', error);
//           }
//         }
//         // Here you would initiate RazorPay or any other payment process.
//       } else {
//         console.error('Error creating payment order:', response.data.message);
//       }
//     } catch (error) {
//       console.error('Error creating payment:', error);
//     }
//   };

//   if (!carDetails) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="max-w-7xl mx-auto py-12 px-6 md:px-12">
//       <div className="bg-white shadow-xl rounded-lg p-8">
//         {paymentSuccess ? (
//           <div className="text-center">
//             <h1 className="text-3xl font-semibold text-gray-800 mb-4">Payment Successful!</h1>
//             <p className="text-xl text-gray-500 mb-4">
//               Your payment has been processed successfully. We will proceed with the car rental.
//             </p>
//             <button
//               onClick={() => navigate('/')}
//               className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               Go to Home
//             </button>
//           </div>
//         ) : (
//           <>
//             <h1 className="text-3xl font-semibold text-gray-800 mb-4">Payment Details</h1>
//             <p className="text-xl text-gray-500 mb-8">Complete your payment to proceed with renting the car.</p>

//             <div className="mb-4">
//               <h2 className="text-lg font-semibold text-gray-700">Car Details</h2>
//               <p className="text-md">Make: {carDetails.make}</p>
//               <p className="text-md">Model: {carDetails.model}</p>
//               <p className="text-md">Price: ₹{carDetails.price}</p>
//             </div>

//             <div className="mb-4">
//               <label htmlFor="rentedFrom" className="block text-lg font-semibold text-gray-700 mb-2">Rented From</label>
//               <input
//                 type="date"
//                 id="rentedFrom"
//                 value={rentedFrom}
//                 onChange={(e) => setRentedFrom(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//               />
//             </div>

//             <div className="mb-4">
//               <label htmlFor="rentedTo" className="block text-lg font-semibold text-gray-700 mb-2">Rented To</label>
//               <input
//                 type="date"
//                 id="rentedTo"
//                 value={rentedTo}
//                 onChange={(e) => setRentedTo(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//               />
//             </div>

//             <div className="mb-4">
//               <label htmlFor="amount" className="block text-lg font-semibold text-gray-700 mb-2">Total Amount</label>
//               <p className="text-lg font-semibold">₹{amount}</p>
//             </div>

//             <button
//               onClick={handlePayment}
//               className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               Proceed to Payment
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PaymentPage;

//v1 working
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate, useParams } from 'react-router-dom';

// const PaymentPage = () => {
//   const [carDetails, setCarDetails] = useState(null);
//   const [amount, setAmount] = useState(0);
//   const [userId, setUserId] = useState(null);
//   const [rentedFrom, setRentedFrom] = useState('');
//   const [rentedTo, setRentedTo] = useState('');
//   const [paymentSuccess, setPaymentSuccess] = useState(false);
//   const { carId } = useParams();
//   const navigate = useNavigate();

//   // Load Razorpay script
//   useEffect(() => {
//     const loadScript = (src) => {
//       return new Promise((resolve) => {
//         const script = document.createElement("script");
//         script.src = src;
//         script.onload = () => resolve(true);
//         script.onerror = () => resolve(false);
//         document.body.appendChild(script);
//       });
//     };

//     loadScript("https://checkout.razorpay.com/v1/checkout.js").then((success) => {
//       if (!success) {
//         alert("Failed to load Razorpay script");
//       }
//     });
//   }, []);

//   useEffect(() => {
//     // Fetch car details from the API
//     const fetchCarDetails = async () => {
//       try {
//         const response = await axios.get(`http://localhost:8080/api/car/get-car-by-id/${carId}`);


//         setCarDetails(response.data.car); // Corrected to access 'car' from response.data
//         setAmount(response.data.car.price); // Updated to access price from the correct location
//       } catch (error) {
//         console.error('Error fetching car details:', error);
//       }
//     };

//     // Fetch user details to get userId
//     const fetchUserDetails = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         console.error("No token found");
//         navigate("/login"); // Redirect to login if no token is found
//         return;
//       }

//       try {
//         const response = await axios.get('http://localhost:8080/api/auth/user/details', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setUserId(response.data.id);
//       } catch (error) {
//         console.error(error);
//         if (error.response?.status === 401 || error.response?.status === 403) {
//           navigate("/login");
//         }
//       }
//     };

//     fetchCarDetails();
//     fetchUserDetails();
//   }, [carId, navigate]);

//   const handlePayment = async () => {
//   // Check if all necessary details are available
//   if (!userId || !carDetails || !rentedFrom || !rentedTo) {
//     alert('Please complete all fields');
//     return;
//   }

//   try {
//     // Ensure rentedFrom and rentedTo are in ISO 8601 format
//     const rentedFromISO = new Date(rentedFrom).toISOString().split('T')[0];
//     const rentedToISO = new Date(rentedTo).toISOString().split('T')[0];

//     // Prepare data for payment creation
//     const orderData = {
//       carId: carId,
//       amount: amount,
//       userId: userId,
//       rentedFrom: rentedFromISO, // Make sure this is ISO 8601 format
//       rentedTo: rentedToISO, // Make sure this is ISO 8601 format
//     };

//     // Make API call to create the payment order
//     const response = await axios.post('http://localhost:8080/api/payment/create-order', orderData);

//     // If payment order creation is successful
//     if (response.data.success) {
//       const options = {
//         key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Razorpay Key ID
//         amount: response.data.amount,
//         currency: "INR",
//         name: "Car Rental Payment",
//         description: `Payment for renting ${carDetails.make} ${carDetails.model}`,
//         image: "your_logo_url", // Optional
//         order_id: response.data.id, // Order ID from backend
//         handler: async (paymentResponse) => {
//           try {
//             // Handle successful payment and send payment details to backend for verification
//             const paymentDetails = {
//               order_id: paymentResponse.razorpay_order_id,
//               payment_id: paymentResponse.razorpay_payment_id,
//               signature: paymentResponse.razorpay_signature,
//             };

//             const verificationResponse = await axios.post('http://localhost:8080/api/payment/verifyPayment', paymentDetails);
//             console.log("Payment Verification:", verificationResponse.data);

//             if (verificationResponse.data.success) {
//               setPaymentSuccess(true);
//               alert('Payment successful!');
//               // You can navigate to a success page or update UI accordingly
//             } else {
//               alert('Payment verification failed');
//             }
//           } catch (verificationError) {
//             console.error("Error verifying payment:", verificationError);
//             alert('Error verifying payment');
//           }
//         },
//         theme: {
//           color: "#3399cc", // Customize payment form color
//         },
//       };

//       const paymentObject = new window.Razorpay(options);
//       paymentObject.open(); // Open Razorpay payment form
//     } else {
//       console.error('Error creating payment order:', response.data.message);
//       alert('Failed to create payment order');
//     }
//   } catch (error) {
//     console.error('Error creating payment:', error);
//     alert('Error initiating payment');
//   }
// };


//   if (!carDetails) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="max-w-7xl mx-auto py-12 px-6 md:px-12">
//       <div className="bg-white shadow-xl rounded-lg p-8">
//         {paymentSuccess ? (
//           <div className="text-center">
//             <h1 className="text-3xl font-semibold text-gray-800 mb-4">Payment Successful!</h1>
//             <p className="text-xl text-gray-500 mb-4">
//               Your payment has been processed successfully. We will proceed with the car rental.
//             </p>
//             <button
//               onClick={() => navigate('/')}
//               className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               Go to Home
//             </button>
//           </div>
//         ) : (
//           <>
//             <h1 className="text-3xl font-semibold text-gray-800 mb-4">Payment Details</h1>
//             <p className="text-xl text-gray-500 mb-8">Complete your payment to proceed with renting the car.</p>

//             <div className="mb-4">
//               <h2 className="text-lg font-semibold text-gray-700">Car Details</h2>
//               <p className="text-md">Make: {carDetails.make}</p>
//               <p className="text-md">Model: {carDetails.model}</p>
//               <p className="text-md">Price: ₹{carDetails.price}</p>
//             </div>

//             <div className="mb-4">
//               <label htmlFor="rentedFrom" className="block text-lg font-semibold text-gray-700 mb-2">Rented From</label>
//               <input
//                 type="date"
//                 id="rentedFrom"
//                 value={rentedFrom}
//                 onChange={(e) => setRentedFrom(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//               />
//             </div>

//             <div className="mb-4">
//               <label htmlFor="rentedTo" className="block text-lg font-semibold text-gray-700 mb-2">Rented To</label>
//               <input
//                 type="date"
//                 id="rentedTo"
//                 value={rentedTo}
//                 onChange={(e) => setRentedTo(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//               />
//             </div>

//             <div className="mb-4">
//               <label htmlFor="amount" className="block text-lg font-semibold text-gray-700 mb-2">Total Amount</label>
//               <p className="text-lg font-semibold">₹{amount}</p>
//             </div>

//             <button
//               onClick={handlePayment}
//               className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               Proceed to Payment
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PaymentPage;
