const asyncHandler= require("express-async-handler");
const User=require("../Models/userModel");
const generateToken=require("../Config/generateToken");

const registerUser = asyncHandler(async(req,res)=>{
    const{name,email,password,pic}=req.body;

    if(!name || !email || !password){
        res.status(400);
        throw new Error(" Please Enter all the fields");
    }

    const userExists=await User.findOne({email});

    if(userExists){
        res.status(400);
        throw new Error("User already exists");
    }

    const user=await User.create({
        name,
        email,
        password,
        pic,
    })
    if(user){
        res.status(201).json({
            _id : user.id,
            name: user.name,
            email:user.email,
            pic:user.pic,
            token: generateToken(user._id),
        })
    }
    else{
        res.status(400);
        throw new error("User not Created");
    }
});

const authUser= asyncHandler(async(req,res)=>{
    const {email, password}=req.body;
    const user=await User.findOne({email});

    if(user && (await user.matchPassword(password))){
        res.json({
            _id : user.id,
            name: user.name,
            email:user.email,
            pic:user.pic,
            token: generateToken(user._id),
        });
    }
    else{
        res.status(401);
        throw new Error("Invalid emailid and password!!");
    }
});

// /api/user?search=shikhar

const allUsers= asyncHandler(async(req,res)=>{
    // const keyword=req.query
    // console.log(keyword);
    
    //here we have use options =i to show the letters that searched is case sensitive.
    //name and email we can search with the help of name or email
    const keyword=req.query.search 
    ?{
        $or:[
            {name:{$regex:req.query.search, $options:"i"}},
            {email:{$regex:req.query.search, $options:"i"}},
        ],
    }:{};
  // here is not equals to req.body
    const users=await User.find(keyword).find({_id: { $ne: req.user._id}});
    res.send(users);
});
module.exports={registerUser,authUser,allUsers};