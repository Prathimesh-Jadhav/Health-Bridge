import React from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const AddDiseaseForm = ({ openDiseaseForm, setOpenDiseaseForm }) => {

    // State to hold the disease data (ID, Name)
    const [diseaseData, setDiseaseData] = React.useState({
        diseaseID: '',
        diseaseName: '',
    })

    // State to hold the uploaded file (image)
    const [file, setFile] = React.useState('')

    // Handle change in input fields
    const handleInputChange = async (e) => {
        setDiseaseData({
            ...diseaseData,
            [e.target.name]: e.target.value // Dynamically updates based on the input field name
        })
    }

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault() // Prevent default form submission
        const formData = new FormData()
        formData.append('diseaseID', diseaseData.diseaseID) // Append disease ID to form data
        formData.append('diseaseName', diseaseData.diseaseName) // Append disease name to form data
        formData.append('file', file) // Append the uploaded file to form data

        try {
            // Make an axios POST request to send the form data
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/diseases/addDisease`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Indicating that the request contains form data
                    Authorization: `Bearer ${sessionStorage.getItem('token')}` // Add JWT token to the headers for authentication
                }
            })

            console.log(response);
            
            // If the response is successful, show a success toast and close the form
            if (response.data.success) {
                toast.success(response.data.message)
                setOpenDiseaseForm(false)
            }
            else {
                // If the response indicates failure, show an error toast
                toast.error(response.data.message)
            }
        }
        catch (err) {
            // Handle any errors that occur during the request
            console.log(err)
        }

        // Reset the form data and close the form after submission
        setDiseaseData({
            diseaseID: '',
            diseaseName: ''
        })
        setOpenDiseaseForm(false)
    }

    return (
        // Modal window to add disease, conditionally rendered based on 'openDiseaseForm' state
        <div className={`fixed inset-0 z-50 backdrop-blur-sm flex justify-center items-center bg-black bg-opacity-50 ${openDiseaseForm ? '' : 'hidden'}`}>
            <div className='px-4 py-2 bg-white rounded-lg'>
                {/* Disease add form */}
                <form action="" className='flex flex-col gap-4 p-4 rounded-lg md:min-w-[400px]'>
                    <h5 className='text-2xl font-semibold text-center mb-2'>Add Disease</h5>
                    {/* Disease ID input */}
                    <div className='flex flex-col gap-1'>
                        <label htmlFor="">Disease ID</label>
                        <input 
                            type="text" 
                            value={diseaseData.diseaseID} 
                            className='py-1 px-3 border-[1px] border-gray-300 rounded-md outline-none' 
                            onChange={handleInputChange} 
                            name='diseaseID'
                        />
                    </div>
                    {/* File input for disease image */}
                    <div className='flex flex-col gap-1'>
                        <label htmlFor="">Image</label>
                        <input 
                            type="file" 
                            className='py-1 px-3 border-[1px] border-gray-300 rounded-md outline-none' 
                            onChange={(e) => { setFile(e.target.files[0]) }} // Set file state when a file is selected
                            name='image'
                        />
                    </div>
                    {/* Disease Name input */}
                    <div className='flex flex-col gap-1'>
                        <label htmlFor="">Disease Name</label>
                        <input 
                            type="text" 
                            value={diseaseData.diseaseName} 
                            className='py-1 px-3 border-[1px] border-gray-300 rounded-md outline-none' 
                            onChange={handleInputChange} 
                            name='diseaseName'
                        />
                    </div>
                    {/* Action buttons: Cancel and Add */}
                    <div className='flex justify-end items-center gap-4'>
                        <button 
                            className='px-4 rounded-lg bg-gray-200 hover:bg-gray-300 py-2' 
                            onClick={() => setOpenDiseaseForm(false)} // Close the form without submitting
                        >
                            Cancel
                        </button>
                        <button 
                            className='px-4 rounded-lg bg-secondary text-white hover:bg-secondaryhover py-2' 
                            onClick={handleSubmit} // Submit the form data
                        >
                            Add
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddDiseaseForm
