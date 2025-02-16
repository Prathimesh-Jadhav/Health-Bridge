import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation (not used in this component but included)
import {states} from '../data/index'  // Import states data from data folder

const PatientForm = ({ openPatientForm, setOpenPatientForm }) => {
  // Function to close the patient form dialog
  const handleDialog = () => {
    setOpenPatientForm(false); // Set openPatientForm state to false to close the form
  };

  const [data,setData] = React.useState({  
    name: '',
    age: '',
    aadhar:'',
    sex: '',
    state: '',
    district: '',
    city: '',
    pincode: '',
    address: '',
    disease: '',
    date: '',
  })

  return (
    // Main container for the patient form dialog
    <div className={`fixed top-0 left-0 right-0 bottom-0 z-50 backdrop-blur-[2px] flex justify-center items-center bg-transparent ${openPatientForm ? '' : 'hidden'}`}>
      {/* Form container with white background and border */}
      <div className='bg-white rounded-lg border-[1px] border-gray-500 px-3 py-4 sm:min-w-[450px]'>
        {/* Form heading */}
        <h5 className='text-heading1 leading-8 font-semibold text-center'>Patient Data</h5>

        {/* Patient form */}
        <form action="" className='flex flex-col gap-3 mt-4'>
          {/* Patient Name Input */}
          <div className='flex flex-col gap-1'>
            <label htmlFor="">Patient Name</label>
            <input type="text" className='outline-none py-1 px-3 rounded-md border-[1px] border-gray-400' />
          </div>

          {/* Age Input */}
          <div className='flex flex-col gap-1'>
            <label htmlFor="">Age</label>
            <input type="number" className='outline-none py-1 px-3 rounded-md border-[1px] border-gray-400' />
          </div>

          {/* Aadhar Number Input */}
          <div className='flex flex-col gap-1'>
            <label htmlFor="">Aadhar Number</label>
            <input type="number" className='outline-none py-1 px-3 rounded-md border-[1px] border-gray-400' />
          </div>

          {/* Sex Selection Dropdown */}
          <div className='flex flex-col gap-1'>
            <label htmlFor="sex">Sex</label>
            <select name="sex" id="sex" className='border-[1px] border-gray-300 py-1 px-3 rounded-lg'>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Address Section (State, District, Town) */}
          <div className='flex flex-col gap-1'>
            <label htmlFor="address">Address</label>
            <div className='flex items-center gap-2'>
              {/* State Dropdown */}
              <select name="state" id="state" className='border-[1px] border-gray-300 rounded-md hover:cursor-pointer'>
                <option value="State" disabled>State</option>
                {
                    states.map((state) => (
                        <option value={state.state} key={state}>{state.state}</option>
                    )) // Map through the states data and create an option for each state
                }
              </select>

              {/* District Dropdown */}
              <select name="state" id="state" className='border-[1px] border-gray-300 rounded-md hover:cursor-pointer'>
                <option value="State" disabled>District</option>
                <option value="Maharashtra">Sangli</option>
                <option value="Goa">Kolhapur</option>
              </select>

              {/* Town Dropdown */}
              <select name="state" id="state" className='border-[1px] border-gray-300 rounded-md hover:cursor-pointer'>
                <option value="State" disabled>Town</option>
                <option value="Maharashtra">Tasgoan</option>
                <option value="Goa">Sangli</option>
              </select>
            </div>
          </div>

          {/* Disease Selection Dropdown */}
          <div className='flex flex-col gap-1'>
            <label htmlFor="address">Disease</label>
            <select name="state" id="state" className='border-[1px] border-gray-300 rounded-md hover:cursor-pointer py-1 px-3'>
              <option value="State" disabled>State</option>
              <option value="Maharashtra">Malaria</option>
              <option value="Goa">Dengue</option>
            </select>
          </div>

          {/* Form Action Buttons (Cancel and Add) */}
          <div className='flex justify-end items-center gap-2 mt-6'>
            <button className='bg-gray-200 rounded-lg py-1 px-3' onClick={handleDialog}>Cancel</button>
            <button className='bg-green-500 rounded-lg py-1 px-3 text-white'>Add</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;