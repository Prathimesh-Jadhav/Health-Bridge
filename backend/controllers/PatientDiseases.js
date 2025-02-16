const diseases = require('../models/diseasesModel');

const getDiseases = async (req, res) => {
    try {
        const diseasesResponse = await diseases.find();
        if (!diseasesResponse) return res.status(400).json({ message: "Error fetching diseases", success: false });
        return res.status(200).json({ message: "Diseases fetched successfully", success: true, data: diseasesResponse });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

module.exports = {getDiseases};