import React, { useEffect, useState } from 'react';
import { AppContext } from '../context/GlobalContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Calendar } from 'primereact/calendar';
import { useNavigate } from 'react-router-dom';

const AllPatients = () => {
  const { setPageTitle } = React.useContext(AppContext);
  const [startValue, setStartValue] = useState(null); // Default to null
  const [endValue, setEndValue] = useState(null); // Default to null
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const {setDetailsPageData,detailsPageData} = React.useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    setPageTitle('All Patients');
    fetchPatients();
  }, []);

    useEffect(() => {
      if(detailsPageData && Object.keys(detailsPageData).length > 0){
        console.log(detailsPageData);
        navigate('/layout/details');
      }
    }, [detailsPageData]);

  useEffect(() => {
    filterPatients();
  }, [searchQuery, startValue, endValue]);

  const fetchPatients = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/patients/getPatients');
      if(!response.data.success) {
        toast.error(response.data.message);
        return;
      }
      else{
        setPatients(response.data.data.filter((patient) => patient.doctorID === sessionStorage.getItem('doctorID')));
        setFilteredPatients(response.data.data.filter((patient) => patient.doctorID === sessionStorage.getItem('doctorID')));
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast.error('Error fetching patients');
    }
  };

  const filterPatients = () => {
    const filtered = patients.filter((patient) => {
      const patientDate = new Date(patient.createdAt.split('T')[0]).getTime();
      const patientsInDateRange = (!startValue || patientDate >= new Date(startValue).getTime()) && (!endValue || patientDate <= new Date(endValue).getTime());
      const matchesSearch = patient.patientName.toLowerCase().includes(searchQuery.toLowerCase());
      return patientsInDateRange && matchesSearch;
    });
    setFilteredPatients(filtered);
  };

  const handleRowClick = (e) => {
    console.log(e.target);
      const row = e.target.closest('tr');
      if (row) {
        const index = row.getAttribute('data-index');
        if (index !== null) {
          setDetailsPageData({...filteredPatients[Number(index)]});
        }
    }
  };

  return (
    <div className='w-full max-h-[87vh] px-6 mt-6 overflow-y-auto removescroll'>
      <div className='w-full flex items-center justify-between mt-12 flex-wrap gap-4'>
        <div className='flex gap-4 items-center'>
            <div className='rounded-lg border-[1px] border-gray-200 overflow-hidden'>
          <Calendar value={startValue} onChange={(e) => setStartValue(e.value)} placeholder='From' className='border-[1px] border-gray-300 rounded-md px-2 py-2' />
            </div>
            <div className='rounded-lg border-[1px] border-gray-200 overflow-hidden' onChange={(e) => setEndValue(e.target.value)}>
          <Calendar value={endValue} onChange={(e) => setEndValue(e.value)} placeholder='To' className='border-[1px] border-gray-300 rounded-md px-2 py-2' />
            </div>
        </div>
        <div className='flex gap-4 items-center'>
          <div className='border border-gray-300 rounded-md px-2'>
            <input
              type="text"
              className='py-2 px-4 outline-none'
              placeholder='Search'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className='max-md:max-w-full overflow-x-auto removescroll relative'>
        <table className='w-full mt-12 border-collapse'>
          <thead className='border-b-2 border-gray-200 bg-gray-100'>
            <tr>
              <th className='py-2 px-4 text-left'>Patient ID</th>
              <th className='px-4 text-left'>Patient Name</th>
              <th className='px-4 text-left'>Sex</th>
              <th className='px-4 text-left'>Age</th>
              <th className='px-4 text-left'>Disease</th>
              <th className='px-4 text-left'>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient,index) => (
                <tr key={patient.id} className={`text-black border-b border-gray-300 ${index%2 === 0 ? '' : 'bg-gray-50'} button`} data-index={index} >
                  <td className='py-3 px-4'>{patient.aadharNumber}</td>
                  <td className='px-4'>{patient.patientName}</td>
                  <td className='px-4'>{patient.sex}</td>
                  <td className='px-4'>{patient.age}</td>
                  <td className='px-4'>{patient.disease}</td>
                  <td className='px-4' >
                    <button className='py-1 px-4 bg-secondary text-white rounded-lg hover:bg-secondaryhover' onClick={handleRowClick}>
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className='text-center py-4'>
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllPatients;