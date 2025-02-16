const hospitalModel = require('../models/hospitalModel');
const userModel = require('../models/usersModel');

const addHospital = async (req, res) => {
    const {
        hospitalID,
        hospitalName,
        doctorName,
        doctorID,
        type,
        state,
        district,
        town,
        email,
        password } = req.body;

    console.log(hospitalName,hospitalID, doctorName, doctorID, type, state, district, town,email,password);

    try {
        const hospitalExists = await hospitalModel.findOne({ doctorID: doctorID });
        if (hospitalExists) return res.status(400).json({ message: "Hospital already exists", success: false });
        const hospital = await hospitalModel.create({
            hospitalID,
            hospitalName,
            doctorName,
            doctorID,
            type,
            state,
            district,
            town,
        });
        console.log(hospital);
        if (!hospital) return res.status(400).json({ message: "Error adding hospital", success: false });
        const user = await userModel.create({ email: email, password: password, name: doctorName,doctorID: doctorID, role: 'doctor' });
        if (!user) return res.status(400).json({ message: "Error adding doctor", success: false });
        return res.status(200).json({ message: "Hospital added successfully", success: true });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getHospitals = async (req,res)=>{
    try{
        const hospitals = await hospitalModel.find({})
        if(!hospitals) return res.json({message:'unable to retrieve hospitals',success:false})
        return res.json({data:hospitals,success:true})
    }
    catch(err){
        return res.status(500).json({message:'Internal Server Error',success:false})
    }

}

module.exports = { addHospital,getHospitals };