import React, { useEffect, useState } from 'react';
import { AppContext } from '../context/GlobalContext';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import PatientForm from '../components/PatientForm';
import RequestForm from '../components/RequestForm';
import axios from 'axios';
import { Calendar } from 'primereact/calendar';
import { useNavigate } from 'react-router-dom';

const Requests = () => {
  const { setPageTitle, setDetailsPageData, detailsPageData } = React.useContext(AppContext);
  const [startValue, setStartValue] = useState(null); // Default to null
  const [endValue, setEndValue] = useState(null); // Default to null
  const [openPatientForm, setOpenPatientForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);

  const navigate = useNavigate();


  useEffect(() => {
    setPageTitle('Requests');
    fetchRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [searchQuery, startValue, endValue]);

  useEffect(() => {
    if (detailsPageData && Object.keys(detailsPageData).length > 0) {
      console.log(detailsPageData);
      navigate('/layout/details');
    }
  }, [detailsPageData]);


  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/requests/getRequests`);
      if (!response.data.success) {
        toast.error(response.data.message);
        return;
      }
      else {
        console.log(response.data.data);
        setRequests(response.data.data.filter((request) => request.createdBy == sessionStorage.getItem('doctorID')));
        setFilteredRequests(response.data.data.filter((request) => request.createdBy == sessionStorage.getItem('doctorID')));
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const handleOpenPatientForm = () => {
    setOpenPatientForm(true);
  };

  const filterRequests = () => {
    console.log(requests);
    const filtered = requests.filter((request) => {
      console.log(request.createdAt);
      const requestDate = new Date(request.createdAt.split('T')[0]).getTime();
      const requestsInDateRange = (!startValue || requestDate >= new Date(startValue).getTime()) && (!endValue || requestDate <= new Date(endValue).getTime());
      const matchesSearch = request.request.toLowerCase().includes(searchQuery.toLowerCase());
      return requestsInDateRange && matchesSearch;
    });
    setFilteredRequests(filtered);
  };

  const handleRowClick = (e) => {
    console.log(e.target);
    const row = e.target.closest('tr');
    if (row) {
      const index = row.getAttribute('data-index');
      if (index !== null) {
        setDetailsPageData({ ...filteredRequests[Number(index)] });
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
          <div className='rounded-lg border-[1px] border-gray-200 overflow-hidden'>
            <Calendar value={endValue} onChange={(e) => setEndValue(e.value)} placeholder='To' className='border-[1px] border-gray-300 rounded-md px-2 py-2' />
          </div>
        </div>
        <div className='flex gap-4 items-center'>
          <button
            className='px-4 rounded-lg bg-rose-600 text-white hover:bg-rose-700 py-2'
            onClick={handleOpenPatientForm}
          >
            Post Request
          </button>
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
              <th className='py-2 px-4 text-left'>Request ID</th>
              <th className='px-4 text-left'>Request</th>
              <th className='py-2 px-4 text-left'>Hospital ID</th>
              {/* <th className='px-4 text-left'>Type</th> */}
              <th className='px-4 text-left'>Quantity</th>
              <th className='px-4 text-left'>Date</th>
              <th className='px-4 text-left'>Status</th>
              <th className='px-4 text-left'>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request, index) => (
                <tr key={request.id} className='text-black border-b border-gray-300' data-index={index}>
                  <td className='py-3 px-4'>{request.requestID}</td>
                  <td className='px-4'>{request.request}</td>
                  <td className='px-4 py-4'>{request.hospitalID}</td>
                  <td className='px-4'>{request.quantity}</td>
                  <td className='px-4'>{request.createdAt.split('T')[0]}</td>
                  <td className={`px-4 rounded-lg`}><span className={`px-4 py-2 rounded-lg ${request.status === 'Pending' ? 'bg-rose-200 text-rose-400' : 'bg-green-100 text-green-400'}`}>{request.status}</span></td>
                  <td className='px-4'>
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
        <RequestForm openPatientForm={openPatientForm} setOpenPatientForm={setOpenPatientForm} fetchRequests={fetchRequests} />
      </div>
    </div>
  );
};

export default Requests;