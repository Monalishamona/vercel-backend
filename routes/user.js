const router = require("express").Router();
const User = require('../models/user');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {authenticateToken} = require("./userAuth");
//Sign-Up
router.post("/sign-up", async(req,res)=>{
    try{
        const{username,email,password,address} = req.body;
        //check username length is more than four 
        if(username.length <= 3){
            return res.status(400).json({message:"Username length should be greater than 3"});
        }
        //check usernme already exists
        const existingUsername =  await User.findOne({username: username});
        if(existingUsername){
            return res.status(400).json({message:"Username already exists!"});
 
        }
        //check email alreay exists
        const existingEmail = await User.findOne({email:email});
        if(existingEmail){
            return res.status(400).json({message:"Email already exists!"});

        }
        if(password.length <= 5){
            return res.status(400).json({message:"Password length should be greater than 3"});

        }
        const hashPassword =await bcrypt.hash(password,10);

        const newUser = new User({
            username:username,
            email:email,
            password:hashPassword,
            address:address,
        });
        await newUser.save();
        return res.status(200).json({message:"Signup successfully"});


    }catch(error){
        res.status(500).json({message:"Internal server error "});
    }
});

//Sign-in
router.post("/sign-in", async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username });

        // Check if user exists
        if (!existingUser) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check if password is correct
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { name: existingUser.username, role: existingUser.role },
            "bookstore123",
            { expiresIn: "30d" }
        );

        // Send response
        return res.status(200).json({ id: existingUser._id, role: existingUser.role, token: token });

    } catch (error) {
        console.error(error); // Log errors for debugging
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/get-user-information',authenticateToken ,async (req,res)=>{
   try{
    const {id}= req.headers;
    const data = await User.findById(id).select("-password");
    return res.status(200).json(data);


   }catch(error){
    res.send(500).json({ message:"Internal server error" });
   }
});

router.put('/update-address',authenticateToken,async (req,res)=>{
    try{
        const {id}=req.headers;
        const {address}= req.body;
        await User.findByIdAndUpdate(id, {address:address});
        return res.status(200).json({message: "Address updated successfully"});
 }catch(error){
        res.send(500).json({ message: "Internal server error"});

    }
})
module.exports = router;
