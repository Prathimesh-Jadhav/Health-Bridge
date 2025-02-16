import React, { useEffect, useMemo } from 'react';
import { AppContext } from '../context/GlobalContext';
import AddDiseaseForm from '../components/AddDiseaseForm';
import axios from 'axios';
import { Calendar } from 'primereact/calendar';
import { useNavigate } from 'react-router-dom';

const Diseases = () => {
  // Access global context for page title and details page data
  const { setPageTitle, detailsPageData, setDetailsPageData } = React.useContext(AppContext);

  // State for managing the disease form visibility
  const [openDiseaseForm, setOpenDiseaseForm] = React.useState(false);

  // State for storing the list of diseases fetched from the API
  const [diseases, setDiseases] = React.useState([]);

  // State for date range filtering
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');

  // State for storing filtered diseases based on date range and region
  const [filteredDiseases, setFilteredDiseases] = React.useState([]);

  // State for managing the type of region (state, district, town)
  const [regionType, setRegionType] = React.useState('state');

  // State for storing available region options based on the region type
  const [regionOptions, setRegionOptions] = React.useState([]);

  // State for managing the selected region for filtering
  const [selectedRegion, setSelectedRegion] = React.useState('');

  // Hook for programmatic navigation
  const navigate = useNavigate();

  // Effect to set the page title and fetch diseases when the component mounts
  useEffect(() => {
    setPageTitle('Diseases'); // Set the page title in the global context
    fetchDiseases(); // Fetch diseases from the API
    regions(); // Initialize region options
  }, []);

  // Effect to navigate to the details page if detailsPageData is set
  useEffect(() => {
    if (detailsPageData && Object.keys(detailsPageData).length > 0) {
      navigate('/layout/details'); // Navigate to the details page
    }
  }, [detailsPageData]);

  // Effect to filter diseases whenever the date range or selected region changes
  useEffect(() => {
    filterByDate();
  }, [startDate, endDate, selectedRegion]);

  // Effect to update region options whenever the region type changes
  useEffect(() => {
    regions();
  }, [regionType]);

  // Function to fetch diseases from the API
  const fetchDiseases = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/patientDiseases/getDiseases');
      setDiseases(response.data.data); // Update the diseases state
      setFilteredDiseases(response.data.data); // Initialize filtered diseases
    } catch (error) {
      console.error('Error fetching diseases:', error);
    }
  };

  // Function to extract unique regions based on the current region type
  const regions = () => {
    const regions = diseases.map((disease) => disease.region[regionType]); // Extract regions
    const uniqueRegions = [...new Set(regions)]; // Remove duplicates
    setRegionOptions(uniqueRegions); // Update region options
  };

  // Function to filter diseases by date range and selected region
  const filterByDate = () => {
    const startDateTimeStamp = new Date(startDate); // Convert start date to timestamp
    const endDateTimeStamp = new Date(endDate); // Convert end date to timestamp

    // Filter diseases by selected region (if any)
    const filteredByRegion = selectedRegion
      ? diseases.filter((disease) => disease.region[regionType] === selectedRegion)
      : diseases;

    // Filter diseases by date range
    const filteredByDate = filteredByRegion.filter((disease) => {
      const diseaseDate = new Date(disease.createdAt);
      return (
        (!startDate || diseaseDate >= startDateTimeStamp) && // Check if disease is after start date
        (!endDate || diseaseDate <= endDateTimeStamp) // Check if disease is before end date
      );
    });

    setFilteredDiseases(filteredByDate); // Update filtered diseases
  };

  // Function to handle row clicks and navigate to the details page
  const handleRowClick = (e) => {
    const row = e.target.closest('tr'); // Find the closest table row
    if (row) {
      const index = row.getAttribute('data-index'); // Get the row index
      if (index !== null) {
        setDetailsPageData({ ...filteredDiseases[Number(index)] }); // Set details page data
      }
    }
  };

  return (
    <div className='w-full px-[20px]'>
      {/* Options menu for filtering and adding diseases */}
      <div className='flex justify-between items-center mt-14'>
        <div>
          <div className='flex justify-center items-center gap-4'>
            {/* Calendar for selecting the start date */}
            <Calendar
              value={startDate}
              onChange={(e) => setStartDate(e.value)}
              placeholder='From'
              className='outline-none border-[1px] border-gray-400 min-w-[150px] rounded-lg px-2 py-2'
            />
            {/* Calendar for selecting the end date */}
            <Calendar
              value={endDate}
              onChange={(e) => setEndDate(e.value)}
              placeholder='To'
              className='outline-none border-[1px] border-gray-400 min-w-[150px] rounded-lg px-2 py-2'
            />
          </div>
        </div>
        <div className='flex gap-4 items-center'>
          {/* Button to open the add disease form */}
          <button
            className='px-4 rounded-lg bg-rose-600 text-white hover:bg-rose-700 py-2'
            onClick={() => setOpenDiseaseForm(true)}
          >
            Add Disease
          </button>
          {/* Dropdown to select a region for filtering */}
          <div className='flex gap-4 items-center border-[1px] border-gray-400 rounded-lg px-2 py-2'>
            <select
              name='region'
              id='region'
              className='outline-none min-w-[110px]'
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              <option value=''>All</option>
              {regionOptions.map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          {/* Dropdown to select the region type (state, district, town) */}
          <div className='flex gap-4 items-center border-[1px] border-gray-400 rounded-lg px-2 py-2'>
            <select
              name='regionType'
              id='regionType'
              value={regionType}
              className='outline-none min-w-[110px]'
              onChange={(e) => setRegionType(e.target.value)}
            >
              <option value='state'>State</option>
              <option value='district'>District</option>
              <option value='town'>Town</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table to display filtered diseases */}
      <div className='mt-12'>
        <table className='w-full mt-12 border-collapse'>
          <thead className='border-b-2 border-gray-200 bg-gray-100'>
            <tr>
              <th className='px-4 text-left py-2'>Disease</th>
              <th className='px-4 text-left'>Hospital</th>
              <th className='px-4 text-left'>Cases</th>
              <th className='px-4 text-left'>Region</th>
              <th className='px-4 text-left'>Date</th>
              <th className='px-4 text-left'>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredDiseases.length > 0 ? (
              filteredDiseases.map((disease, index) => (
                <tr key={disease.id} className='border-b border-gray-300 text-gray-800' data-index={index}>
                  <td className='px-4 py-4'>{disease.diseaseName}</td>
                  <td className='px-4 py-4'>{disease.hospitalID}</td>
                  <td className='px-4'>{disease.cases}</td>
                  <td className='px-4'>{disease.region[regionType]}</td>
                  <td className='px-4'>{disease.createdAt.split('T')[0]}</td>
                  <td className='px-4'>
                    <button
                      className='py-1 px-4 bg-secondary text-white rounded-lg hover:bg-secondaryhover'
                      onClick={handleRowClick}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className='text-center py-4'>
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Disease Form */}
      <div>
        <AddDiseaseForm openDiseaseForm={openDiseaseForm} setOpenDiseaseForm={setOpenDiseaseForm} />
      </div>
    </div>
  );
};

export default Diseases;