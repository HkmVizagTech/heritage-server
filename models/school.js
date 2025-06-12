// import mongoose from "mongoose"
const mongoose=require('mongoose')
const HeritageRegistrationSchema = new mongoose.Schema(
  {
    school: {
      type: String,
      required: true,
      trim: true,
      unique:true
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    telephone: {
      type: String,
      trim: true,
    },
    mobile: {
      type: String,
     
      trim: true,
    },
    personInCharge: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
)


module.exports=  mongoose.model("HeritageRegistration", HeritageRegistrationSchema)
