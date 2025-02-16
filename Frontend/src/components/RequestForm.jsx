import React from 'react';
import axios from 'axios'; // Import axios for making HTTP requests
import { toast } from 'react-toastify'; // Import toast for displaying notifications

const RequestForm = ({ openPatientForm, setOpenPatientForm, fetchRequests }) => {
  // State to manage the form data for the request
  const [data, setData] = React.useState({
    request: '',
    quantity: ''
  });

  // Function to close the form and reset form data
  const handleDialog = () => {
    setOpenPatientForm(false); // Close the form
    setData({
      request: '',
      quantity: ''
    }); // Reset form data
  };

  // Function to handle input changes in the form
  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value // Update the corresponding field in the state
    });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    console.log(data); // Log form data for debugging

    // Validate if all fields are filled
    if (data.request === '' || data.quantity === '') {
      toast.error('Please fill all the fields'); // Show error toast if any field is empty
      return;
    }

    try {
      // Send a POST request to add a new request
      const response = await axios.post('http://localhost:3000/api/requests/addRequest', data, {
        headers: {
          'Content-Type': 'application/json', // Set content type to JSON
          Authorization: `Bearer ${sessionStorage.getItem('token')}` // Include authorization token
        }
      });

      console.log(response); // Log the response for debugging

      if (response.data.success) {
        toast.success(response.data.message); // Show success toast
        setOpenPatientForm(false); // Close the form
        setData({
          request: '',
          quantity: ''
        }); // Reset form data
      } else {
        toast.error(response.data.message); // Show error toast
      }
    } catch (err) {
      console.log(err); // Log the error for debugging
    }

    fetchRequests(); // Refresh the list of requests
  };

  return (
    // Main container for the request form dialog
    <div className={`fixed inset-0 z-50 backdrop-blur-sm flex justify-center items-center bg-black bg-opacity-50 ${openPatientForm ? '' : 'hidden'}`}>
      {/* Form container with white background and border */}
      <div className='bg-white rounded-lg shadow-lg border border-gray-300 px-6 py-8 sm:min-w-[450px]'>
        {/* Form heading */}
        <h5 className='text-2xl font-semibold text-center mb-6'>Add Request</h5>

        {/* Request form */}
        <form className='flex flex-col gap-4'>
          {/* Request Type Dropdown */}
          <div className='flex flex-col gap-2'>
            <label htmlFor="age" className='text-sm font-medium'>Request</label>
            <select
              id="sex"
              className='border border-gray-300 py-2 px-4 rounded-md focus:border-blue-500'
              value={data.request || ''}
              onChange={handleChange}
              name='request'
            >
              <option value="">Select Request</option>
              <option value="Beds">Beds</option>
              <option value="Ventilators">Ventilators</option>
              <option value="Oxygen Cylinder">Oxygen Cylinder</option>
            </select>
          </div>

          {/* Quantity Input */}
          <div className='flex flex-col gap-2'>
            <label htmlFor="aadharNumber" className='text-sm font-medium'>Quantity</label>
            <input
              type="number"
              id="aadharNumber"
              className='outline-none py-2 px-4 rounded-md border border-gray-300 focus:border-blue-500'
              value={data.quantity}
              onChange={handleChange}
              name='quantity'
            />
          </div>

          {/* Form Action Buttons (Cancel and Add) */}
          <div className='flex justify-end items-center gap-4 mt-6'>
            <button
              type="button"
              className='bg-gray-200 rounded-lg py-2 px-4 hover:bg-gray-300'
              onClick={handleDialog} // Handle cancel button click
            >
              Cancel
            </button>
            <button
              type="submit"
              className='bg-green-500 rounded-lg py-2 px-4 text-white hover:bg-green-600'
              onClick={handleSubmit} // Handle form submission
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestForm;