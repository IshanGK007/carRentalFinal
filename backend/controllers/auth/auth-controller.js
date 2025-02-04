// const validate = require('validator');
// const User = require('../../models/user');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const SALT_FACTOR = 10;

// //register user controller
// const registerUser = async (req, res) => {
//     try {
//         //get all required fields
//         const {name,email,password,confirmPassword,role} = req.body;

//         //check whether the required fields are empty
//         console.log(name,email,password,confirmPassword,role);

//         if(!name || !email || !password || !role || !confirmPassword) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Please enter the required fields',
//             });
//         }

//         const fields = [name, email, password,confirmPassword, role];

//         if (fields.some(field => !field || (typeof field === "string" && field.trim() === ""))) {
//            return res.status(400).json({
//                 success: false,
//                 message: 'Please enter the required fields',
//             });
//         }

//         //normalizing email
//         console.log('Original Email:', email);
//         const normalizedEmail = validate.normalizeEmail(email);
//         console.log('Normalized Email:', normalizedEmail);

//         //check if the user already exists or not
//         const user = await User.findOne({email: normalizedEmail});

//         //user exists
//         if (user) {
//             return res.status(400).json({
//                 success: false,
//                 message: "User already exists"
//             });
//         }

//         //user doesn't exist

//         //check if the password is valid or not
//         if (!validate.isStrongPassword(password)) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Password must have at least 8 characters and include at least one uppercase letter, one number, and one special character"
//             });
//         }

//         //check if the password and confirm password match or not
//         if (password !== confirmPassword) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Passwords do not match"
//             });
//         }

//         //password hashing for security

//         //generate salt
//         const salt = await bcrypt.genSalt(SALT_FACTOR);

//         //generate hashed Password
//         const hashedPassword = await bcrypt.hash(password, salt);

//         //register the user now

//         //create a local instance of the user
//         const newUser = new User({
//             name: name,
//             role:role,
//             password: hashedPassword,
//             email: normalizedEmail,
//         });

//         //saving the user to database
//         await newUser.save();

//         return res.status(201).json({
//             success: true,
//             message: 'User successfully registered!',
//             newUser
//         });

//     } catch (err) {
//         console.error(err);
//         // Handle Mongoose validation errors
//         if (err.name === 'ValidationError') {
//             const errorMessages = Object.values(err.errors).map(error => error.message);
//             return res.status(400).json({
//                 success: false,
//                 message: errorMessages.toString()
//             });
//         }
//         // Handle unexpected errors
//         return res.status(500).json({
//             success: false,
//             message: "Something went wrong"
//         });
//     }
// }

// //login user controller
// const loginUser = async (req, res) => {
//     try {
//         ///get all required fields
//         const {email, password} = req.body;

//         //check whether the required fields are empty

//         if(!email || !password) {
//               return res.status(400).json({
//                 success: false,
//                 message: 'Please enter the required fields',
//             });
//         }

//         const fields = [email, password];

//         if (fields.some(field => !field || (typeof field === "string" && field.trim() === ""))) {
//             res.status(400).json({
//                 success: false,
//                 message: 'Please enter the required fields',
//             })
//         }

//         //check if the user exists or not
//         const user = await User.findOne({email: email});

//         //user doesn't exist implies user is not registered
//         if (!user) {
//             return res.status(400).json({
//                 success: false,
//                 message: "User is not registered"
//             });
//         }

//         //user exists, time for authentication

//         //check if the entered password matches the correct password
//         const isPasswordMatch = await bcrypt.compare(password, user['password']);

//         //password doesn't match
//         if (!isPasswordMatch) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Wrong password, Please try again"
//             });
//         }

//         //password matches

//         //create token
//         //jwt.sign(payload, secretOrPrivateKey, [options], [callback])
//         //payload will later be used to get user info
//         const token = await jwt.sign({
//                 id: user["_id"],
//                 role: user['role'],
//                 email: user['email'],
//             },
//             process.env.JWT_SECRET_KEY,
//             {
//                 expiresIn: '30d',
//             });

//         //final response
//         res.cookie('token', token,
//             {httpOnly: true, secure: false})
//             .status(200)
//             .json({
//                 success: true,
//                 message: "User successfully logged in",
//                 user: {
//                     id: user["_id"],
//                     role: user['role'],
//                     email: user['email'],
//                 },
//                 token
//             });

//     } catch (error) {
//         console.log(error);
//         //handle Mongoose Validation Error
//         if (error.name === 'ValidationError') {
//             const errorMessages = Object.values(error.errors).map(error => error.message);
//             return res.status(400).json({
//                 success: false,
//                 message: errorMessages.toString()
//             });
//         }
//         //handle Unexpected Error
//         res.status(500).json({
//             success: false,
//             message: "Something went wrong"
//         });
//     }
// }

// //logout user controller
// const logoutUser = async (req, res) => {
//     res.clearCookie('token').status(200).json({
//         success: true,
//         message: 'Logged out successfully!'
//     });
// }

// //auth middleware
// const authMiddleware = async (req, res, next) => {
//     //acquire token
//     const token = req.cookies.token;
//     //if token is expired or not present
//     if (!token) {
//         return res.status(401).json({
//             success: false,
//             message: "Unauthorized"
//         });
//     }
//     try {
//         //decode token
//         req.user = jwt.verify(token, process.env.JWT_SECRET_KEY);
//         next();
//     } catch (error) {
//         res.status(401).json({
//             success: false,
//             message: "Unauthorized"
//         });
//     }
// }

// //check-auth
// const checkAuth = async (req, res) => {
//     const user = req.user;
//     res.status(200).json({
//         success: true,
//         message: 'Authenticated user',
//         user: {
//             id: user['_id'],
//             role: user['role'],
//             email: user['email'],
//         }
//     })}
    
// const checkUser = async (req, res) => {
//     const email = req.email;
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ success: false, message: "No account found with this email." });
//     }
// }    

// module.exports = {registerUser, loginUser, logoutUser, authMiddleware,checkAuth,checkUser};

const validate = require('validator');
const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const SALT_FACTOR = 10;
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
dotenv.config();
const moment = require('moment'); // Add this at the top of the file

// Helper function to generate OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
};

// Register user controller
const registerUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, role } = req.body;

        // Validation check for required fields
        if (!name || !email || !password || !role || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please enter the required fields',
            });
        }

        const fields = [name, email, password, confirmPassword, role];
        if (fields.some(field => !field || (typeof field === "string" && field.trim() === ""))) {
            return res.status(400).json({
                success: false,
                message: 'Please enter the required fields',
            });
        }

        // Normalize email
        const normalizedEmail = validate.normalizeEmail(email);

        // Check if user already exists
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        // Validate password strength
        if (!validate.isStrongPassword(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must be strong",
            });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match",
            });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(SALT_FACTOR);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email: normalizedEmail,
            password: hashedPassword,
            role,
        });

        await newUser.save();

        return res.status(201).json({
            success: true,
            message: 'User successfully registered!',
            newUser,
        });
    } catch (err) {
        console.error(err);
        if (err.name === 'ValidationError') {
            const errorMessages = Object.values(err.errors).map(error => error.message);
            return res.status(400).json({
                success: false,
                message: errorMessages.toString(),
            });
        }
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

// Check if user exists by email
const checkUser = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "No account found with this email.",
        });
    }

    return res.status(200).json({
        success: true,
        message: "User exists.",
    });
};

const sendOTP = async (req, res) => {
    const { email } = req.body;
    console.log(email);
    

    try {
        // Check if user exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No account found with this email.",
            });
        }

        // Generate OTP (ensure this function exists and returns a number)
        const otp = generateOTP();  // OTP generation logic (ensure it's a number)
        console.log("Generated OTP:", otp);

        // Set OTP expiration time (e.g., 10 minutes from now)
        const otpExpiration = new Date();
        otpExpiration.setMinutes(otpExpiration.getMinutes() + 5); // OTP expires in 10 minutes
        console.log("OTP Expiration Time:", otpExpiration);

        // Update the user's forgotOtp and otpExpiration fields
        const updatedUser = await User.findOneAndUpdate(
            { email },
            { 
                forgotOtp: otp,
                otpExpiration: otpExpiration
            },
            { new: true } // Return the updated user document
        );

        if (!updatedUser) {
            return res.status(500).json({
                success: false,
                message: "Failed to update OTP and expiration.",
            });
        }

        // Setup Nodemailer transport (make sure this is properly configured)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}`,
        };

        // Send OTP via email
        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully.",
        });

    } catch (error) {
        console.error("Error sending OTP:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to send OTP.",
        });
    }
};

// Logout user controller
const logoutUser = async (req, res) => {
    res.clearCookie('token').status(200).json({
        success: true,
        message: 'Logged out successfully!',
    });
};

// Login user controller
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please enter the required fields',
            });
        }

        const fields = [email, password];
        if (fields.some(field => !field || (typeof field === "string" && field.trim() === ""))) {
            return res.status(400).json({
                success: false,
                message: 'Please enter the required fields',
            });
        }

        // Check if user exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User is not registered",
            });
        }

        // Check if password matches
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Wrong password, Please try again",
            });
        }

        // Create token
        const token = jwt.sign({
                id: user._id,
                role: user.role,
                email: user.email,
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '30d' }
        );

        // Respond with token and user info
        res.cookie('token', token, { httpOnly: true, secure: false })
            .status(200)
            .json({
                success: true,
                message: "User successfully logged in",
                user: {
                    id: user._id,
                    role: user.role,
                    email: user.email,
                },
                token,
            });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

// Check Authentication middleware
const checkAuth = async (req, res) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        message: 'Authenticated user',
        user: {
            id: user._id,
            role: user.role,
            email: user.email,
        }
    });
};

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    // Get token from the Authorization header
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; // Get token after 'Bearer'
    
    if (!token) {
        return res.status(403).json({ message: 'Access denied, token required' });
    }

    try {
        // Decode and verify the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY); // Use your JWT secret key here

        // Attach the decoded user info to the request object for use in subsequent middleware or routes
        req.user = decodedToken;
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// Function to get user details using the token data
const getUserDetails = async (req, res) => {
    try {
        // Extract user ID from the decoded token (which was attached to req.user in verifyToken middleware)
        const userId = req.user.id;

        // Fetch user details from the database using the userId
        const user = await User.findById(userId).select('-password'); // Don't return the password

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the user details (excluding sensitive data like password)
        res.json({
            id: user._id,
            email: user.email,
            role: user.role,
            name: user.name,  // Assuming you have a 'name' field in your model
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Auth middleware to verify JWT token
const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;

    // Check if token is missing or expired
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }

    try {
        // Decode the token
        req.user = jwt.verify(token, process.env.JWT_SECRET_KEY);
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
};

// Function to verify OTP
const verifyOTPSent = async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        console.log("User found : ", user, " Otp: ", otp);

        if (!user) {
            return res.status(404).json({ success: false, message: "No account found with this email." });
        }

        // Ensure OTP is compared as a string (or number, based on your storage format)
        if (!user.forgotOtp || String(user.forgotOtp) !== String(otp)) {
            return res.status(400).json({ success: false, message: "Invalid OTP." });
        }

        // Check OTP expiry (ensure the date is in correct format)
        const otpExpiryTime = moment(user.otpExpiration);
        if (moment().isAfter(otpExpiryTime)) {
            return res.status(400).json({ success: false, message: "OTP has expired." });
        }

        // OTP is valid and not expired, proceed to next step (e.g., reset password)
        res.status(200).json({ success: true, message: "OTP verified successfully." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};


// Reset password after OTP verification
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "No account found with this email." });
        }

        // Validate OTP
        if (user.forgotOtp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP." });
        }

        const otpExpiryTime = moment(user.forgotOtpExpiration);
        if (moment().isAfter(otpExpiryTime)) {
            return res.status(400).json({ success: false, message: "OTP has expired." });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(SALT_FACTOR);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the user's password
        await User.findOneAndUpdate(
            { email },
            { password: hashedPassword, forgotOtp: null, forgotOtpExpiration: null },
            { new: true }
        );

        return res.status(200).json({ success: true, message: "Password successfully reset." });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error." });
    }
};

module.exports = {
    registerUser,
    checkUser,
    sendOTP,
    loginUser,
    logoutUser,
    checkAuth,
    authMiddleware,
    verifyOTPSent,
    resetPassword,
    verifyToken,
    getUserDetails
};
