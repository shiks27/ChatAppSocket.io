const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");

const userSchema=mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    pic:
    {
    type:String,
    required:true,
    default:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.shutterstock.com%2Fsearch%2Fdefault-profile-icon-icon&psig=AOvVaw3v5yioFqYArGfFc68m0Vvl&ust=1700627773770000&source=images&cd=vfe&ved=0CBIQjRxqFwoTCMDcpKai1IIDFQAAAAAdAAAAABAE"}
},
{timestamps:true}
);

userSchema.methods.matchPassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}
userSchema.pre('save',async function(next){
    if(!this.isModified){
        next();
    }
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
})
const User=mongoose.model("User",userSchema);
module.exports=User;