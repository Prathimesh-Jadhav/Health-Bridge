// Import Google's Generative AI library
const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * Handler function for Gemini API calls
 * Processes requests to generate AI content using Google's Gemini model
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const callGemini = async (req, res) => {
    // Validate request body contains required query parameter
    if (!req.body || !req.body.query) {
        return res.status(400).json({ message: "Missing query in request body", success: false });
    }

    // Extract query and optional data from request body
    let { query, data } = req.body;
    // If additional data is provided, append it to the query as a JSON string
    if(data){
        query = query + " " + JSON.stringify(data);
    }

    // Initialize Gemini AI with API key
    const genAI = new GoogleGenerativeAI("AIzaSyA47qoN76jLKTeCxjo53EXpfMmwobyb4W4");
    // Select the Gemini 1.5 Flash model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
        // Generate content using the model
        const result = await model.generateContent(query);

        // Safely extract response text using optional chaining
        const responseText = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

        if (responseText) {
            // Clean up response by removing markdown JSON formatting
            const cleanText = responseText.replace(/```json|```/g, "").trim();
            
            try {
                let dataToSend = null;
                if(!data){
                    // If no additional data was provided, parse response as JSON
                    dataToSend = JSON.parse(cleanText);
                }
                else {
                    // If additional data was provided, split response into lines
                    // and filter out empty lines
                    const lines = cleanText.split('\n').filter(line => line.trim() !== '');
                    dataToSend = lines;
                }
                // Return successful response with processed data
                return res.json({ 
                    message: "Response generated successfully", 
                    success: true, 
                    data: dataToSend 
                });
            } catch (jsonError) {
                // Handle JSON parsing errors
                console.error("JSON Parsing Error:", jsonError);
                return res.json({ 
                    message: "Response is not valid JSON", 
                    success: false, 
                    rawData: responseText 
                });
            }
        } else {
            // Handle case where no response text was generated
            return res.json({ 
                message: "Unable to generate response", 
                success: false 
            });
        }
    } catch (err) {
        // Handle any errors during API call or processing
        console.error("Error:", err);
        return res.status(500).json({ 
            message: "Internal Server Error", 
            success: false 
        });
    }
};

// Export the handler function
module.exports = { callGemini };