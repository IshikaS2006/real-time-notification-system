export const registerUser = async (req, res) => {
// Implement user registration logic here
    //receive username, email and password from request body
    const { username, email, password } = req.body;
    //validate the input
    if (!username || !email || !password) {
        return res.status(400).json({ message: "Please provide all required fields" });
    }
    //check if user already exists
    const existingUser = await User
        .findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
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
    //respond with success message
    res.status(201).json({ message: "User registered successfully" });   
};

export const loginUser = async (req, res) => {
// Implement user login logic here
    //receive email and password from request body
    const { email, password } = req.body;
    //validate the input
    if (!email || !password) {
        return res.status(400).json({ message: "Please provide all required fields" });
    }
    //check if user exists
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
    }
    //compare password    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
    }
    //generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    //respond with token
    res.status(200).json({ token });
};