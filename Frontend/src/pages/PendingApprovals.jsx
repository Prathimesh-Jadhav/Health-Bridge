import React, { useEffect, useState } from 'react'
import { AppContext } from '../context/GlobalContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';

const PendingApprovals = () => {
  // Accessing global context for page title and details page data
  const { setPageTitle, setDetailsPageData, detailsPageData } = React.useContext(AppContext);

  // State variables for date range filtering
  const [startValue, setStartValue] = useState('');
  const [endValue, setEndValue] = useState('');

  // State variables for filtered requests and showing options dropdown
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [showOptions, setShowOptions] = useState({});

  // State variables for search functionality and requests data
  const [search, setSearch] = useState('');
  const [requests, setRequests] = useState([]);

  // Hook for programmatic navigation
  const navigate = useNavigate();

  // Effect to set the page title and fetch requests on component mount
  useEffect(() => {
    setPageTitle('Pending Approvals');
    fetchRequests();
  }, []);

  // Effect to navigate to details page if detailsPageData is set
  useEffect(() => {
    if (detailsPageData && Object.keys(detailsPageData).length > 0) {
      console.log(detailsPageData);
      navigate('/layout/details');
    }
  }, [detailsPageData]);

  // Effect to filter requests whenever startValue, endValue, or search changes
  useEffect(() => {
    handleFilter();
  }, [startValue, endValue, search]);

  // Function to filter requests based on date range and search term
  const handleFilter = () => {
    const filtered = requests.filter((request) => {
      const requestDate = new Date(request.createdAt.split('T')[0]).getTime();
      const requestsInDateRange = (!startValue || requestDate >= new Date(startValue).getTime()) && (!endValue || requestDate <= new Date(endValue).getTime());
      const matchesSearch = request.request.toLowerCase().includes(search.toLowerCase());
      return requestsInDateRange && matchesSearch;
    });
    setFilteredRequests(filtered);
  }

  // Effect to handle clicks outside the options dropdown to close it
  useEffect(() => {
    const handleShowOptions = (e) => {
      if (e.target.closest('.optionsButton') === null) {
        setShowOptions({});
      }
    };
    window.addEventListener('click', handleShowOptions);
    return () => {
      window.removeEventListener('click', handleShowOptions);
    };
  }, []);

  // Function to fetch requests from the API
  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/requests/getRequests`);
      if (!response.data.success) {
        toast.error(response.data.message);
        return;
      }
      // Sort requests by date and update state
      setFilteredRequests(response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setRequests(response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.log(error);
    }
  }

  // Function to approve a request
  const handleRequestApprove = async (id) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/requests/updateRequest`, { id, action: 'Approved' });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchRequests(); // Refresh the requests list
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Function to reject a request
  const handleRequestReject = async (id) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/requests/updateRequest`, { id, action: 'Rejected' });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchRequests(); // Refresh the requests list
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Function to handle row clicks and navigate to details page
  const handleRowClick = (e) => {
    if (e.target.closest('.button') === null) {
      const row = e.target.closest('tr');
      if (row) {
        const index = row.getAttribute("data-index");
        console.log(index);
        if (index !== null) {
          setDetailsPageData({ ...filteredRequests[Number(index)] });
        }
      }
    }
  };

  return (
    <div className='w-full max-h-[87vh] px-[20px] mt-6 overflow-y-auto removescroll'>
      {/* Date range and search filters */}
      <div className='w-full flex items-center justify-between mt-12 gap-2 flex-wrap'>
        <div className='flex gap-4 items-center'>
          <Calendar value={startValue} onChange={(e) => setStartValue(e.value)} placeholder='From' className='border-[1px] border-gray-300 rounded-md px-2 py-2' />
          <Calendar value={endValue} onChange={(e) => setEndValue(e.value)} placeholder='To' className='border-[1px] border-gray-300 rounded-md px-2 py-2' />
        </div>
        <div className='border-[1px] border-gray-300 rounded-md px-1 py-1'>
          <input type="text" className='py-1 px-2 outline-none ' placeholder='Search' value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Table to display filtered requests */}
      <div className='mt-10 overflow-x-auto removescroll max-h-[50vh] overflow-y-auto removescroll relative pb-16'>
        <table className=' w-full mt-4'>
          <thead className='border-b-[1px] border-gray-300 bg-gray-100 sticky top-0'>
            <th className='px-4 py-2'>Hospital ID</th>
            <th className='px-4'>Request</th>
            <th className='px-4'>Quantity</th>
            <th className='px-4'>Date</th>
            <th className='px-4'>Status</th>
            <th className='px-4'>Action</th>
          </thead>
          <tbody>
            {filteredRequests.length === 0 ? (
              <tr className='text-center text-gray-700'>
                <td className='py-3' colSpan={7}>No Requests Found</td>
              </tr>
            ) : (
              filteredRequests.map((request, index) => (
                <tr className='text-center text-gray-700 border-b-[1px] border-gray-300 hover:bg-gray-50 cursor-pointer request' id={request._id} data-index={index} onClick={handleRowClick}>
                  <td className='py-3'>{request.hospitalID}</td>
                  <td>{request.request}</td>
                  <td>{request.quantity}</td>
                  <td>{request.createdAt.split('T')[0]}</td>
                  <td>
                    <span className={`py-1 px-4 rounded-lg ${request.status.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-700' : request.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className='flex items-center justify-center gap-4 py-3 button'>
                    <div className='relative'>
                      {/* Button to show approve/reject options */}
                      <button className='py-1 px-4 rounded-lg  hover:bg-secondaryhover bg-secondary border-[1px] border-gray-300 text-white optionsButton' onClick={() => setShowOptions(prev => ({ ...prev, [request._id]: !prev[request._id] }))}>Edit</button>
                      {showOptions[request._id] && (
                        <div className='absolute top-8 right-0 bg-white border-[1px] border-gray-300 rounded-md p-2 flex justify-center items-center gap-2 z-30 shadow-lg'>
                          <button className='py-1 px-4 rounded-lg bg-green-500 hover:bg-green-600 text-white' onClick={() => handleRequestApprove(request._id)}>Approve</button>
                          <button className='py-1 px-4 rounded-lg bg-rose-500 hover:bg-rose-600 text-white' onClick={() => handleRequestReject(request._id)}>Reject</button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PendingApprovals