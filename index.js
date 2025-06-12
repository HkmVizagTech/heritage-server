const express =require('express');
const app=express();
require('dotenv').config()
const db=require('./config/db');
const mongoose= require('mongoose');
const cors=require('cors');
const gupshup=require('@api/gupshup')
const HeritageRegistration=require('./models/school');
const reg=require('./contest')
app.use(express.json())
app.use(cors({
    origin:["http://localhost:3000"],
    methods:["post","get"]
}
))
db();
app.listen("3001",async (req,res)=>{
    console.log("sever is running");
})
app.use('/contest',reg);
app.post("/school", async (req, res) => {
  try {
    const { school, address, telephone, mobile, personInCharge, phone } = req.body


    // Basic validation
    if (!school || !address || !phone) {
      return res.status(400).json({ message: "School,Phone and address are required." })
    }
    let phonea="";
    if(phone.length===10){
        phonea="91"+phone;
    }

    // Create new document
    const newEntry = new HeritageRegistration({
      school,
      address,
      telephone,
      mobile,
      personInCharge,
      phone:phonea,
    })

    // Save to database
    await newEntry.save()
            const messageResponse = await gupshup.sendingTextTemplate({
                template: {
                    id: '6cc5bf4e-8914-4d40-bb5f-e3d46d2d66c8',
                    params: [school, "Heritage Fest Registration Form"]
                },
                'src.name': 'Production',
                destination: phonea,
                source: '917075176108',
            }, {
                apikey: 'zbut4tsg1ouor2jks4umy1d92salxm38'
            }).then((data)=>{
              console.log(data)
            })
            .catch((err)=>{
              console.error(err)
            });
    
            console.log("WhatsApp message sent successfully:", messageResponse);

    res.status(201).json({ message: "Registration successful", data: newEntry })
  } catch (error) {
    console.error("Error saving registration:", error)
    res.status(500).json({ message: "Internal server error" })
  }
})
app.get('/events', async (req, res) => {
  try {
    const schools = await HeritageRegistration.find({})
    if (!schools || schools.length === 0) {
      return res.status(404).json({ message: "No data found" })
    }
    return res.status(200).json(schools) // ✅ send array directly
  } catch (e) {
    console.error("Error fetching schools:", e)
    res.status(500).json({ message: "Server error" })
  }
})
