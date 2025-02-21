import axios from 'axios';
import React from 'react';
import { AppContext } from '../context/GlobalContext'; // Import global context
import { toast } from 'react-toastify'; // Import toast for notifications
import { states } from '../data/index'; // Import states data

const PatientData = () => {
  // Access global context for setting the page title
  const { setPageTitle } = React.useContext(AppContext);

  // State for storing the list of diseases
  const [diseases, setDiseases] = React.useState([]);

  const [loading, setLoading] = React.useState(false); // State to manage loading state of the form

  // State for managing patient data form inputs
  const [patientData, setPatientData] = React.useState({
    patientName: '',
    age: '',
    disease: '',
    region: {
      state: '',
      district: '',
      town: '',
      pincode: '',
    },
    sex: '',
    aadhar: '',
  });

  // State for storing the list of states, districts, and towns
  const [places, setPlaces] = React.useState(states);
  const [document, setDocument] = React.useState({});
  const [district, setDistrict] = React.useState([]);
  const [selectedDistrict, setSelectedDistrict] = React.useState('');
  const [towns, setTowns] = React.useState([]);

  // Effect to update districts and towns when the selected state or district changes
  React.useEffect(() => {
    setDistrict(document.districts || []); // Update districts based on the selected state
    setTowns(document.cities?.[selectedDistrict] || []); // Update towns based on the selected district
  }, [document, selectedDistrict]);

  // Function to handle state selection
  const handleSelectState = (e) => {
    const selectedState = e.target.value;
    setPatientData({ ...patientData, region: { ...patientData.region, state: selectedState }}); // Update state in patient data

    // Find the selected state's data from the places array
    const foundDocument = places.find((place) => place.state === selectedState);
    if (foundDocument) {
      setDocument(foundDocument); // Update the document with the selected state's data
      setDistrict(foundDocument.districts || []); // Update districts
      setTowns([]); // Reset towns
    }
  };

  // Function to handle district selection
  const handleSelectDistrict = (e) => {
    const newDistrict = e.target.value;
    setPatientData({ ...patientData, region: { ...patientData.region, district: newDistrict }}); // Update district in patient data
    setSelectedDistrict(newDistrict); // Update selected district
  };

  // Effect to set the page title and fetch diseases when the component mounts
  React.useEffect(() => {
    setPageTitle('Patient Data'); // Set the page title
    fetchDiseases(); // Fetch diseases from the API
  }, []);

  // Function to fetch diseases from the API
  const fetchDiseases = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/diseases/getDiseases`);
      setDiseases(response.data.data); // Update the diseases state
    } catch (error) {
      console.error('Error fetching diseases:', error);
    }
  };

  // Function to handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'town') {
      // Update town in the region object
      setPatientData({ ...patientData, region: { ...patientData.region, [name]: value } });
    } else {
      // Update other fields directly
      setPatientData({ ...patientData, [name]: value });
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true
    // Validate required fields
    if (!patientData.patientName || !patientData.age || !patientData.aadhar || !patientData.disease || !patientData.sex) {
      setLoading(false); // Set loading state to false
      return toast.error('Please fill all the fields');
    }
    // Validate Aadhar number length
    if (patientData.aadhar.length !== 12) {
      return toast.error('Aadhar number should be 12 digits');
    }
    try {
      // Submit patient data to the API
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/patients/addPatient`, patientData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`, // Include authorization token
        },
      });
      if (response.data.success) {
        toast.success(response.data.message); // Show success message
        handleReset(); // Reset the form
      } else {
        toast.error(response.data.message); // Show error message
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false); // Set loading state to false
  };

  // Function to reset the form
  const handleReset = () => {
    setPatientData({
      patientName: '',
      age: '',
      disease: '',
      region: {
        state: '',
        district: '',
        town: '',
        pincode: '',
      },
      sex: '',
      aadhar: '',
    });
    setLoading(false);
  };

  return (
    <div className='w-full max-h-[87vh] px-[20px] mt-6 overflow-y-auto removescroll'>
      <div className='rounded-md px-1 py-1'>
        {/* Form heading */}
        <h5 className='border-b-[3px] border-gray-200 py-2 text-heading1 font-semibold text-gray-400'>Add Patient</h5>
        {/* Patient data form */}
        <form action="" className='mt-6 flex flex-col gap-6'>
          {/* Patient Name input */}
          <div className='w-full'>
            <label htmlFor="" className='font-semibold px-1'>Patient Name</label>
            <input
              type="text"
              placeholder='Enter Patient Name'
              name='patientName'
              value={patientData.patientName}
              className='w-full mt-1 py-2 px-4 border-[1px] border-gray-300 rounded-md outline-none'
              onChange={handleInputChange}
            />
          </div>
          {/* Age, Aadhar, and Sex inputs */}
          <div className='flex gap-4 w-full'>
            <div className='w-full'>
              <label htmlFor="" className='font-semibold px-1'>Age</label>
              <input
                type="number"
                placeholder='Enter Age'
                name='age'
                value={patientData.age}
                className='w-full mt-1 py-2 px-4 border-[1px] border-gray-200 rounded-md outline-none'
                onChange={handleInputChange}
              />
            </div>
            <div className='w-full'>
              <label htmlFor="" className='font-semibold px-1'>Aadhar Number</label>
              <input
                type="text"
                placeholder='Enter Aadhar Number'
                name='aadhar'
                value={patientData.aadhar}
                className='w-full mt-1 py-2 px-4 border-[1px] border-gray-300 rounded-md outline-none'
                onChange={handleInputChange}
              />
            </div>
            <div className='w-full'>
              <label htmlFor="" className='font-semibold px-1'>Sex</label>
              <select
                name='sex'
                value={patientData.sex}
                className='w-full mt-1 py-2 px-4 border-[1px] border-gray-300 rounded-md outline-none'
                onChange={handleInputChange}
              >
                <option value="">Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          {/* Address inputs (State, District, Town) */}
          <div className='w-full'>
            <label htmlFor="" className='font-semibold px-1'>Address</label>
            <div className='flex gap-4 items-center'>
              <select
                name="state"
                value={patientData.region.state}
                className='border-[1px] border-gray-300 py-2 px-4 rounded-md mt-1 w-full'
                onChange={handleSelectState}
              >
                <option value="" disabled className='text-gray-400'>Select State</option>
                {places?.map((place, index) => (
                  <option value={place.state} key={index}>{place.state}</option>
                ))}
              </select>
              <select
                name="district"
                value={patientData.region.district}
                className='border-[1px] border-gray-300 py-2 px-4 rounded-md mt-1 w-full'
                onChange={handleSelectDistrict}
              >
                <option value="" disabled>Select District</option>
                {district?.map((district, index) => (
                  <option value={district} key={index}>{district}</option>
                ))}
              </select>
              <select
                name="town"
                value={patientData.region.town}
                className='border-[1px] border-gray-300 py-2 px-4 rounded-md mt-1 w-full'
                onChange={handleInputChange}
              >
                <option value="" disabled>Select Town</option>
                {towns?.map((town, index) => (
                  <option value={town} key={index}>{town}</option>
                ))}
              </select>
            </div>
          </div>
          {/* Disease selection */}
          <div>
            <label htmlFor="" className='font-semibold px-1'>Disease</label>
            <select
              name="disease"
              value={patientData.disease}
              className='border-[1px] border-gray-300 py-2 px-4 rounded-md mt-1 w-full'
              onChange={handleInputChange}
            >
              <option value="" disabled>Select Disease</option>
              {diseases.map((disease, index) => (
                <option value={`${disease.diseaseID}-${disease.diseaseName}`} key={index}>
                  {disease.diseaseID}-{disease.diseaseName}
                </option>
              ))}
            </select>
          </div>
          {/* Form buttons (Reset and Submit) */}
          <div className='mt-2 flex justify-end gap-4 mr-4'>
            <span
              className='button border-[1px] hover:bg-gray-300 border-gray-300 bg-gray-100 text-gray-700 hover:cursor-pointer'
              onClick={handleReset}
            >
              Reset
            </span>
            <button
              className='button border-[1px] border-gray-500 bg-secondary text-white hover:bg-secondaryhover'
              type='submit'
              onClick={handleSubmit}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientData;