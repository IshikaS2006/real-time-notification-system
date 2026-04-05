//improvement1 add try chatch block to handle errors
import User from "../models/user.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { logSecurityEvent } from "../middlewares/auth.middlewares.js";
export const registerUser = async (req, res) => {
    try {
        // Implement user registration logic here
        //receive username, email and password from request body
        const { username, email, password } = req.body;
        //validate the input
    if (!username || !email || !password) {
        return res.status(400).json({ message: "Please provide all required fields" });
    }
    //validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }
    //validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: "Password must be at least 8 characters with uppercase, lowercase, number, and special character" });
    }
    //check if user already exists
    const existingUser = await User
        .findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
        logSecurityEvent('DUPLICATE_REGISTRATION', null, `Duplicate registration attempt for email: ${email}`, req.ip);
        return res.status(400).json({ message: "User already exists" });
    }
    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    //create new user
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
    });
    //save user to database
    await newUser.save();
    logSecurityEvent('USER_REGISTERED', newUser._id, `New user registered: ${email}`, req.ip);
    //respond with success message and meanigful data userid
    res.status(201).json({ message: "User registered successfully", userId: newUser._id });   
    } catch (error) {
        logSecurityEvent('AUTH_ERROR', null, `Error during registration: ${error.message}`, req.ip);
        console.error("Error in registerUser:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const loginUser = async (req, res) => {
    try {
        // Implement user login logic here
        //receive email and password from request body
    const { email, password } = req.body;
    //validate the input
    if (!email || !password) {
        return res.status(400).json({ message: "Please provide all required fields" });
    }
    //validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }
    //check if user exists
    const user = await User.findOne({ email });
    if (!user) {
        logSecurityEvent('FAILED_LOGIN', null, `Login attempt with non-existent email: ${email}`, req.ip);
        return res.status(400).json({ message: "Invalid credentials" });
    }
    //compare password    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        logSecurityEvent('FAILED_LOGIN', user._id, `Failed password attempt for email: ${email}`, req.ip);
        return res.status(400).json({ message: "Invalid credentials" });
    }
    //generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    logSecurityEvent('LOGIN_SUCCESS', user._id, `User logged in: ${email}`, req.ip);
    //respond with token in http-only cookie
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 3600000 });
    res.status(200).json({ message: "Login successful" });
    } catch (error) {
        logSecurityEvent('AUTH_ERROR', null, `Error during login: ${error.message}`, req.ip);
        console.error("Error in loginUser:", error);
        res.status(500).json({ message: "Server error" });
    }
};