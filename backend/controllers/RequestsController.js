const requestModel = require('../models/RequestsModel');
const hospitalModel = require('../models/hospitalModel');

const addRequest = async (req, res) => {
    const {request,quantity} = req.body;
    const createdBy = req.user.doctorID;
    let requestID = `R${Math.floor(Math.random() * 1000)}`
    let requestFound = false;
    try{
        while(!requestFound){
            const existingRequest = await requestModel.findOne({requestID:requestID});
            if(existingRequest) requestID = `R${Math.floor(Math.random() * 1000)}`;
            else requestFound = true;
        }
        const hospital = await hospitalModel.findOne({doctorID:createdBy});
        if(!hospital) return res.status(400).json({ message: "Hospital not found", success: false });
        const response = await requestModel.create({hospitalID:hospital.hospitalID,request,quantity,status:'Pending',createdBy,requestID});
        if (!response) return res.status(400).json({ message: "Error adding request", success: false });
        return res.status(200).json({ message: "Request added successfully", success: true });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

const getRequests = async (req, res) => {
    try{
        const requests = await requestModel.find({});
        if (!requests) return res.status(400).json({ message: "Error fetching requests", success: false });
        return res.status(200).json({ message: "Requests fetched successfully", success: true, data: requests });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

const updateRequest = async (req, res) => {
    const {id,action} = req.body;
    try{
        const request = await requestModel.findById(id);
        if (!request) return res.status(400).json({ message: "Request not found", success: false });
        request.status = action;
        await request.save();
        return res.status(200).json({ message: "Request updated successfully", success: true });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

module.exports = {addRequest,getRequests,updateRequest};