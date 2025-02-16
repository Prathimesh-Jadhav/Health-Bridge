const diseaseModel = require('../models/allDiseasesModel');

const addDisease = async (req, res) => {
    const {diseaseName,diseaseID} = req.body;
    console.log(diseaseName,diseaseID);
    const image = `http://localhost:3000/uploads/${req.file.filename}`;

    try {
        const disease = await diseaseModel.create({diseaseName,diseaseID,image});
        if (!disease) return res.status(400).json({ message: "Error adding disease", success: false });
        return res.status(200).json({ message: "Disease added successfully", success: true });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

const getDiseases = async (req, res) => {
    try {
        const diseases = await diseaseModel.find();
        if (!diseases) return res.status(400).json({ message: "Error fetching diseases", success: false });
        return res.status(200).json({ message: "Diseases fetched successfully", success: true, data: diseases });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

module.exports = {addDisease,getDiseases};