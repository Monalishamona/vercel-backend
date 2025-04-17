const mongoose = require("mongoose");
const conn = async()=>{
    try{
        await mongoose.connect(`${process.env.URI}`);
        console.log("cONNECTED DB");

    }catch(error){
        console.log(error);
    }
};
conn();