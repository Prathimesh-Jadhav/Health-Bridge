import React, { useEffect, useState } from 'react';
import { AppContext } from '../context/GlobalContext';
import AddHospital from '../components/AddHospital';
import axios from 'axios';
import { toast } from 'react-toastify';
import { RiExpandUpDownFill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

const Hospitals = () => {
  // Access global context for page title and details page data
  const { setPageTitle, detailsPageData, setDetailsPageData } = React.useContext(AppContext);

  // State for managing the hospital form visibility
  const [openHospitalForm, setOpenHospitalForm] = useState(false);

  // State for storing the list of hospitals fetched from the API
  const [hospitals, setHospitals] = useState([]);

  // State for storing filtered hospitals based on search and region
  const [filteredHospitals, setFilteredHospitals] = useState([]);

  // State for storing unique regions for filtering
  const [uniqueRegions, setUniqueRegions] = useState([]);

  // State for managing the search query
  const [searchQuery, setSearchQuery] = useState('');

  // State for managing the selected region for filtering
  const [region, setRegion] = useState('');

  // State for managing the filter type (state, district, town)
  const [filterBy, setFilterBy] = useState('state');

  // State for storing search options (hospitalName, doctorName, type, etc.)
  const [searchByOptions, setSearchByOptions] = useState([]);

  // State for managing the search criteria (e.g., hospitalName, doctorName)
  const [searchBy, setSearchBy] = useState('hospitalName');

  // State for managing the visibility of the search options dropdown
  const [openSearchBy, setOpenSearchBy] = useState(false);

  // Hook for programmatic navigation
  const navigate = useNavigate();

  // Effect to navigate to the details page if detailsPageData is set
  useEffect(() => {
    if (detailsPageData && Object.keys(detailsPageData).length > 0) {
      navigate('/layout/details');
    }
  }, [detailsPageData]);

  // Function to fetch hospitals from the API
  const getHospitals = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/hospitals/getHospitals');
      if (response.data.success) {
        setHospitals(response.data.data); // Update the hospitals state
        setFilteredHospitals(response.data.data); // Initialize filtered hospitals
      } else {
        toast.error('Error in fetching Hospitals');
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Effect to set the page title and fetch hospitals when the component mounts
  useEffect(() => {
    setPageTitle('Hospitals'); // Set the page title in the global context
    getHospitals(); // Fetch hospitals from the API
  }, []);

  // Effect to handle clicks outside the search options dropdown
  useEffect(() => {
    const handleEvent = (e) => {
      if (e.target.closest('.searchby') === null) {
        setOpenSearchBy(false); // Close the dropdown if clicked outside
      }
    };
    window.addEventListener('click', handleEvent);

    return () => {
      window.removeEventListener('click', handleEvent); // Cleanup event listener
    };
  }, []);

  // Effect to update unique regions and search options when hospitals or filterBy changes
  useEffect(() => {
    let regions = [];
    hospitals.forEach((hospital) => {
      regions.push(hospital[filterBy]); // Extract regions based on filterBy
    });
    setUniqueRegions([...new Set(regions)]); // Remove duplicates and update unique regions
    setSearchByOptions(['hospitalName', 'doctorName', 'type', filterBy]); // Update search options
  }, [hospitals, filterBy]);

  // Function to filter hospitals based on search query and selected region
  const filterHospitals = () => {
    const searched = hospitals.filter((hospital) => {
      const searched = hospital[searchBy]?.toLowerCase().includes(searchQuery.toLowerCase()); // Filter by search query
      return searched;
    });
    const filter = searched.filter((hospital) => {
      return hospital[filterBy].includes(region); // Filter by selected region
    });
    setFilteredHospitals(filter); // Update filtered hospitals
  };

  // Effect to apply filters whenever searchQuery, hospitals, or region changes
  useEffect(() => {
    filterHospitals();
  }, [searchQuery, hospitals, region]);

  // Function to handle row clicks and navigate to the details page
  const handleRowClick = (e) => {
    const row = e.target.closest('tr'); // Find the closest table row
    if (row) {
      const index = row.getAttribute('data-index'); // Get the row index
      if (index !== null) {
        setDetailsPageData({ ...filteredHospitals[Number(index)] }); // Set details page data
      }
    }
  };

  return (
    <div className='w-full px-[20px]'>
      {/* Options menu for filtering and adding hospitals */}
      <div className='w-full flex items-center justify-between mt-12 flex-wrap gap-4'>
        <div className='flex gap-4 items-center'>
          {/* Dropdown to select a region for filtering */}
          <select
            name='region'
            id='region'
            value={region}
            className='border-[1px] border-gray-300 py-2 px-2 rounded-lg outline-none min-w-[150px]'
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value=''>All</option>
            {uniqueRegions.map((region, index) => (
              <option value={region} key={index} className='py-4 px-4 outline-none'>
                {region}
              </option>
            ))}
          </select>
          {/* Dropdown to select the filter type (state, district, town) */}
          <select
            name='filterBy'
            id='filterBy'
            value={filterBy}
            className='border-[1px] border-gray-300 py-2 px-2 rounded-lg outline-none min-w-[150px]'
            onChange={(e) => setFilterBy(e.target.value)}
          >
            <option value='state' className='py-4 px-4 outline-none'>
              State
            </option>
            <option value='district' className='py-4 px-4 outline-none'>
              District
            </option>
            <option value='town' className='py-4 px-4 outline-none'>
              Town
            </option>
          </select>
        </div>
        <div className='flex gap-4 items-center'>
          {/* Button to open the add hospital form */}
          <button
            className='px-4 rounded-lg bg-rose-600 text-white hover:bg-rose-700 py-2'
            onClick={() => setOpenHospitalForm(true)}
          >
            Add Hospital
          </button>
          {/* Search input with dropdown for search criteria */}
          <div className='border border-gray-300 rounded-md px-2 flex items-center justify-between'>
            <input
              type='text'
              className='py-2 px-4 outline-none'
              placeholder='Search'
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className='hover:cursor-pointer relative searchby' onClick={() => setOpenSearchBy(!openSearchBy)}>
              <RiExpandUpDownFill size={20} style={{ hover: { color: 'blue' } }} />
              {/* Dropdown for search criteria */}
              <div className={`${openSearchBy ? 'block' : 'hidden'}`}>
                <ul className='absolute top-10 right-2 bg-white border border-gray-300 rounded-md py-2 px-4 z-50 shadow-sm'>
                  {searchByOptions.map((option, index) => (
                    <li
                      className='py-2 px-4 hover:bg-gray-100 hover:cursor-pointer'
                      value={searchBy}
                      key={index}
                      onClick={(e) => {
                        setSearchBy(e.target.textContent); // Update search criteria
                        setOpenSearchBy(false); // Close the dropdown
                      }}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table to display filtered hospitals */}
      <div className='max-md:max-w-full max-h-[60vh] overflow-y-auto removescroll overflow-x-auto removescroll relative'>
        <table className='w-full mt-12 border-collapse'>
          <thead className='border-b-2 border-gray-200 bg-gray-100'>
            <tr>
              <th className='px-4 text-left py-2'>Hospital ID</th>
              <th className='px-4 text-left py-2'>Hospital Name</th>
              <th className='px-4 text-left'>Doctor Name</th>
              <th className='px-4 text-left'>Type</th>
              <th className='px-4 text-left'>Region</th>
              <th className='px-4 text-left'>Date</th>
              <th className='px-4 text-left'>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredHospitals.length > 0 ? (
              filteredHospitals.map((hospital, index) => (
                <tr key={hospital.id} className='border-b border-gray-300 text-gray-800' data-index={index}>
                  <td className='px-4 py-4'>{hospital.hospitalID}</td>
                  <td className='px-4 py-4'>{hospital.hospitalName}</td>
                  <td className='px-4 py-4'>{hospital.doctorName}</td>
                  <td className='px-4'>{hospital.type}</td>
                  <td className='px-4'>{hospital[filterBy]}</td>
                  <td className='px-4'>{hospital.createdAt.split('T')[0]}</td>
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
                <td colSpan={7} className='text-center py-4'>
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Add Hospital Form */}
        <AddHospital
          openHospitalForm={openHospitalForm}
          setOpenHospitalForm={setOpenHospitalForm}
          getHospitals={getHospitals}
        />
      </div>
    </div>
  );
};

export default Hospitals;