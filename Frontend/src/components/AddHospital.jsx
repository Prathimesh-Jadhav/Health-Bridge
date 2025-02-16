import React, { useEffect } from 'react'
import { MdCancel } from "react-icons/md";
import axios from 'axios';
import { toast } from 'react-toastify';

// AddHospital component that takes in props to control the form visibility and fetch hospital data
const AddHospital = ({ openHospitalForm, setOpenHospitalForm, getHospitals }) => {

    // State to manage the form data for the hospital
    const [hospitalData, setHospitalData] = React.useState({
        hospitalName: '',
        doctorName: '',
        hospitalID: '',
        doctorID: '',
        state: '',
        district: '',
        town: '',
        type: '',
        email: '',
        password: ''
    });

    // State to store the list of states fetched from the API
    const [states, setStates] = React.useState([]);


    // Function to handle input changes and update the state
    const handleInputChange = (e) => {
        setHospitalData({
            ...hospitalData,
            [e.target.name]: e.target.value
        });
    };

    // Function to handle dialog close and reset form data
    const handleDialog = () => {
        setHospitalData({
            hospitalName: '',
            hospitalID: '',
            doctorName: '',
            doctorID: '',
            state: '',
            district: '',
            town: '',
            type: '',
            email: '',
            password: ''
        });
        setOpenHospitalForm(false); // Close the form dialog
    }

    // Function to handle form submission
    const submitHospital = async (e) => {
        e.preventDefault();
        console.log(hospitalData);
        // Check if all fields are filled
        if (hospitalData.hospitalName === '' || hospitalData.doctorName === '' || hospitalData.doctorID === '' || hospitalData.state === '' || hospitalData.district === '' || hospitalData.town === '' || hospitalData.type === '' || hospitalData.email === '' || hospitalData.password === '') {
            alert('Please fill all the fields'); // Alert if any field is empty
            return;
        }
        // Send data to the backend
        try {
            const response = await axios.post('http://localhost:3000/api/hospitals/addHospital', hospitalData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${sessionStorage.getItem('token')}` // Add authorization token
                }
            });
            console.log(response.data);
            if (response.data.success) {
                toast.success(response.data.message); // Show success toast if the request is successful
            } else {
                toast.error(response.data.message); // Show error toast if the request fails
            }
        } catch (err) {
            console.log(err);
        }

        // Reset form data and close the form dialog
        setHospitalData({
            hospitalName: '',
            doctorName: '',
            doctorID: '',
            state: '',
            district: '',
            town: '',
            type: '',
            email: '',
            password: ''
        });
        getHospitals(); // Refresh the list of hospitals
        setOpenHospitalForm(false); // Close the form dialog
    }

    // Render the form dialog
    return (
        <div className={`fixed inset-0 z-50 backdrop-blur-sm flex justify-center items-center bg-black bg-opacity-50 ${openHospitalForm ? '' : 'hidden'}`}>
            <div className='bg-white p-6 rounded-lg border-[1px] border-gray-200 md:min-w-[400px] shadow-md max-h-[60vh] overflow-y-auto'>
                <h5 className='text-2xl text-center font-medium'>Add Hospital</h5>
                <h3 className='font-semibold text-lg mt-4 text-center'>Hospital Details</h3>
                <form action="" className='flex flex-col gap-4 mt-2'>
                    {/* Hospital ID Input */}
                    <div className='flex flex-col gap-1'>
                        <label htmlFor="">Hospital ID</label>
                        <input type="text" className='py-1 px-3 border-[1px] border-gray-300 rounded-md outline-none' name='hospitalID' onChange={handleInputChange} value={hospitalData.hospitalID} />
                    </div>
                    {/* Hospital Name Input */}
                    <div className='flex flex-col gap-1'>
                        <label htmlFor="">Hospital Name</label>
                        <input type="text" className='py-1 px-3 border-[1px] border-gray-300 rounded-md outline-none' name='hospitalName' onChange={handleInputChange} value={hospitalData.hospitalName} />
                    </div>
                    {/* Doctor Name Input */}
                    <div className='flex flex-col gap-1'>
                        <label htmlFor="">Doctor Name</label>
                        <input type="text" className='py-1 px-3 border-[1px] border-gray-300 rounded-md outline-none' name='doctorName' onChange={handleInputChange} value={hospitalData.doctorName} />
                    </div>
                    {/* Doctor ID Input */}
                    <div className='flex flex-col gap-1'>
                        <label htmlFor="">Doctor ID</label>
                        <input type="text" className='py-1 px-3 border-[1px] border-gray-300 rounded-md outline-none' name='doctorID' onChange={handleInputChange} value={hospitalData.doctorID} />
                    </div>
                    {/* Address Input (State, District, Town) */}
                    <div className='flex flex-col gap-1'>
                        <label htmlFor="address">Address</label>
                        <div className='flex items-center gap-4'>
                            <select name="state" id="state" className='border-[1px] border-gray-300 rounded-md hover:cursor-pointer py-1' onChange={handleInputChange} value={hospitalData.state}>
                                {
                                    states.map((state, index) => {
                                        return (
                                            <option key={index} value={state.name}>{state.name}</option>
                                        )
                                    })
                                }
                            </select>
                            <select name="district" id="district" className='border-[1px] border-gray-300 rounded-md hover:cursor-pointer py-1' onChange={handleInputChange} value={hospitalData.district}>
                                <option value="" disabled>District</option>
                                <option value="Sangli">Sangli</option>
                                <option value="Kolhapur">Kolhapur</option>
                            </select>
                            <select name="town" id="town" className='border-[1px] border-gray-300 rounded-md hover:cursor-pointer py-1' onChange={handleInputChange} value={hospitalData.town}>
                                <option value="" disabled>Town</option>
                                <option value="Tasgaon">Tasgoan</option>
                                <option value="Sangli">Sangli</option>
                            </select>
                        </div>
                    </div>
                    {/* Hospital Type Input */}
                    <div className='flex flex-col gap-1'>
                        <label htmlFor="">Type</label>
                        <select name="type" id="type" className='border-[1px] border-gray-300 rounded-md hover:cursor-pointer py-1' onChange={handleInputChange} value={hospitalData.type}>
                            <option value="" disabled>Type</option>
                            <option value="Private">Private</option>
                            <option value="Public">Public</option>
                            <option value="Semi-Govt">Semi-Govt</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    {/* Login Credentials Section */}
                    <div className='mt-4'>
                        <h3 className='font-medium text-lg text-center'>Login Credentials</h3>
                        {/* Email Input */}
                        <div className='flex flex-col gap-1 mt-2'>
                            <label htmlFor="email">Email</label>
                            <input type="email" name='email' className='py-1 px-4 border-[1px] border-gray-300 rounded-md outline-none' value={hospitalData.email} onChange={handleInputChange} />
                        </div>
                        {/* Password Input */}
                        <div className='flex flex-col gap-1 mt-2'>
                            <label htmlFor="password">Password</label>
                            <input type="password" name='password' className='py-1 px-3 border-[1px] border-gray-300 rounded-md outline-none' value={hospitalData.password} onChange={handleInputChange} />
                        </div>
                    </div>
                    {/* Form Action Buttons */}
                    <div className='flex justify-end items-center gap-4 mt-6'>
                        <button type="button" className='bg-gray-200 rounded-lg py-2 px-4 hover:bg-gray-300' onClick={handleDialog}>Cancel</button>
                        <button type="submit" className='bg-green-500 rounded-lg py-2 px-4 text-white hover:bg-green-600' onClick={submitHospital}>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddHospital