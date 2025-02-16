const patientModel = require('../models/PatientsModel');
const { verifyToken } = require('../services/handleToken');
const dieseasesModel = require('../models/diseasesModel');
const hospitalModel = require('../models/hospitalModel');
const mongoose = require('mongoose');

const addPatient = async (req, res) => {
    const { patientName, age, disease, region ,sex, aadhar } = req.body;
    const [diseaseID,diseaseName] = disease.split('-');
    const user = req.user;
  try{
    const patient = await patientModel.create({ patientName, age, disease:diseaseName , address:region, sex:sex.toLowerCase(), aadharNumber:aadhar,doctorID:user.doctorID});
    if (!patient) return res.status(400).json({ message: "Error adding patient", success: false });
    const diseaseExists = await dieseasesModel.findOne({diseaseID:diseaseID,addedBy:user.doctorID});
    if(diseaseExists){
        diseaseExists.cases += 1;
        await diseaseExists.save();
    }
    else{
      try{
        const hospital = await hospitalModel.findOne({doctorID:user.doctorID});
        await dieseasesModel.create({diseaseID:diseaseID,diseaseName:diseaseName,cases:1,region:region,addedBy:user.doctorID,hospitalID:hospital.hospitalID});
      }
      catch(err){
        console.log(err);
        return res.status(500).json({ message: "Internal server error", success: false });
      }
    }
    return res.status(200).json({ message: "Patient added successfully", success: true });
  }
  catch(err){
    console.log(err);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
}

const getPatients = async (req, res) => {
  try{
    const patients = await patientModel.find();
    if (!patients) return res.status(400).json({ message: "Error fetching patients", success: false });
    return res.status(200).json({ message: "Patients fetched successfully", success: true, data: patients });
  }
  catch(err){
    console.log(err);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
}

module.exports = {addPatient,getPatients};