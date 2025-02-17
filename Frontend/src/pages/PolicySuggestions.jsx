import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../context/GlobalContext';
import AI from '../assets/ai.svg';
import send from '../assets/send.svg';
import axios from 'axios';
import { toast } from 'react-toastify';

const PolicySuggestions = () => {
  // Accessing global context for setting the page title
  const { setPageTitle } = useContext(AppContext);

  // State variables for query, input, messages, diseases, and loading status
  const [query, setQuery] = useState('');
  const [input, setInput] = useState('Analyze the small data and provide policy suggestions point wise without much explanation');
  const [messages, setMessages] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(false);

  // Effect to set the page title and fetch diseases on component mount
  useEffect(() => {
    setPageTitle('Policy Suggestions');
    fetchDiseases();
  }, []);

  // Effect to call the Gemini API whenever the query changes
  useEffect(() => {
    if (query) {
      callGemini();
    }
  }, [query]);

  // Function to fetch diseases from the API
  const fetchDiseases = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/patientDiseases/getDiseases`);
      setDiseases(response.data.data);
    } catch (error) {
      console.error('Error fetching diseases:', error);
      toast.error('Failed to fetch diseases');
    }
  };

  // Function to call the Gemini API for policy suggestions
  const callGemini = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/callGemini`,
        { query: query, data: diseases },
        { headers: { 'Content-Type': 'application/json' } }
      );
  
      if (!response.data.success) {
        toast.error(response.data.message);
        setLoading(false);
        return;
      }
  
      console.log('Response Data:', response.data); // Debugging log
      let responseText = response.data.data;
  
      // Ensure responseText is a string before splitting
      if (typeof responseText !== 'string') {
        responseText = JSON.stringify(responseText); // Convert object to string if necessary
      }
  
      const points = responseText.split('\n').filter(line => line.trim() !== '');
  
      setMessages(prevMessages => [
        ...prevMessages.slice(0, -1),
        { content: query, response: points }
      ]);
  
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch policy suggestions');
      setLoading(false);
    }
  };
  

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) {
      toast.error('Please enter a query');
      return;
    }
    setMessages([...messages, { content: input }]); // Add the input to messages
    setQuery(input); // Set the query to trigger the Gemini API call
    setInput(''); // Clear the input field
  };

  return (
    <div className="w-full max-h-[87vh] px-5 mt-6 overflow-y-auto removescroll">
      <div className="min-h-[80vh] pb-2 rounded-lg overflow-y-auto removescroll">
        <div className="mt-6 min-h-[75vh] shadow-lg bg-gray-100 rounded-lg relative px-4">
          {/* Header section with AI icon */}
          <div className="border-b-2 border-gray-200 p-4 text-xl font-medium flex items-center gap-1">
            <img src={AI} alt="AI" width={28} />
            Policy Assistant
          </div>

          {/* Main content section */}
          <div className="flex flex-col justify-between min-h-[65vh]">
            {/* Messages display area */}
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {messages.map((message, index) => (
                <div key={index} className="p-4 border-b border-gray-200 rounded-lg flex flex-col gap-4">
                  {/* User input message */}
                  <div className="flex justify-end">
                    <span className="text-gray-700 text-end p-4 bg-white rounded-lg max-w-[70%] shadow-md">
                      {message?.content}
                    </span>
                  </div>

                  {/* AI response or loading indicator */}
                  {loading && index === messages.length - 1 ? (
                    <div className="flex justify-start">
                      <span className="text-gray-700 text-start p-4 bg-white rounded-lg max-w-[70%] shadow-md">
                        Generating...
                      </span>
                    </div>
                  ) : (
                    <div className='flex flex-col bg-white max-w-[70%] shadow-md rounded-lg text-gray-700 text-start p-4'>
                      {/* Display response points */}
                      {message?.response?.map((point, idx) => (
                        <div key={idx} className="flex justify-start">
                          <span
                            dangerouslySetInnerHTML={{ __html: point.replace(/\*(.*?)\*/g, '<strong>$1</strong>') }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input section */}
            <div className="overflow-hidden flex gap-2 items-center p-4">
              <input
                type="text"
                value={input}
                className="p-2 overflow-y-auto removescroll w-full outline-none border border-gray-200 rounded-lg"
                placeholder="Ask AI"
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)} // Allow Enter key to submit
              />
              {/* Send button */}
              <div
                className="min-w-[40px] min-h-[40px] rounded-full bg-gray-200 flex justify-center items-center cursor-pointer hover:bg-gray-300"
                onClick={handleSubmit}
              >
                <img src={send} alt="Send" width={28} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicySuggestions;