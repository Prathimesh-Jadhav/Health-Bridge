import React, { useEffect } from 'react'
import KeyStats from '../components/KeyStats'
import { keyStats } from '../data'
import { PieChart } from '@mui/x-charts/PieChart';
import { AppContext } from '../context/GlobalContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import submission from '../assets/submission.jpg';
import pending from '../assets/pending.png'
import calendar from '../assets/calendar.svg'
import hospital from '../assets/hospital.svg'
import patient1 from '../assets/patient1.svg'
import affectedRegion from '../assets/affectedRegion.svg'
import { useNavigate } from 'react-router-dom';

// Main Dashboard component that displays various statistics and data visualizations
const Dashboard = () => {
    // State variables for managing dashboard data
    const [doctorTotalSubmissions, setDoctorTotalSubmissions] = React.useState(0); // Total submissions by doctor
    const [doctorPendingSubmissions, setDoctorPendingSubmissions] = React.useState(0); // Pending submissions by doctor
    const [lastSubmit, setLastSubmit] = React.useState(''); // Date of last submission
    const [TotalHospitals, setTotalHospitals] = React.useState(0); // Total number of hospitals
    const [totalPatients, setTotalPatients] = React.useState(0); // Total number of patients
    const [chartData, setChartData] = React.useState([]); // Data for pie chart visualization
    const [doctorChartData, setDoctorChartData] = React.useState([]); // Doctor-specific chart data
    const [patientsData, setPatientsData] = React.useState([]); // List of patients
    const [requests, setRequests] = React.useState([]); // List of requests
    const [mostAffectedRegion, setMostAffectedRegion] = React.useState([]) // Region with most cases
    const [adminTotalPatients, setAdminTotalPatients] = React.useState([]) // Total patients for admin view
    const [ImpactedDisease, setImpactedDisease] = React.useState([]) // Most impacted disease
    const [adminTotalDisease, setAdminTotalDisease] = React.useState([]) // Total diseases for admin
    const [allDiseases, setAllDiseases] = React.useState([]) // List of all diseases
    const [allRequests, setAllRequests] = React.useState([]) // List of all requests
    const [sortDiseasesByCases, setSortDiseasesByCases] = React.useState([]) // Diseases sorted by case count
    const [criticalDiseases, setCriticalDiseases] = React.useState([]) // List of critical diseases
    const {user, setPageTitle } = React.useContext(AppContext); // Global context for user info
    const [trendingDiseases,setTrendingDiseases] = React.useState([]) // Currently trending diseases
    const [doctorCriticalDiseases, setDoctorCriticalDiseases] = React.useState([]) // Critical diseases for doctor
    const [loading,setLoading] = React.useState([]) // Loading state
    const {setDetailsPageData, detailsPageData} = React.useContext(AppContext); // Context for details page
    
    const navigate = useNavigate();

    // Initialize dashboard data on component mount
    useEffect(() => {
        setPageTitle('Dashboard');
        fetchPatients()
        fetchAllDiseases()
        pieChartData();
        fetchSubmissions();
        fetchHospitals();
    }, []);

    // Update disease impact data when admin disease data changes
    useEffect(() => {
        if (adminTotalDisease.length > 0) {
            mostImpactedDisease();
        }
    }, [adminTotalDisease]);

    // Update affected region data when patient data changes
    useEffect(() => {
        if (adminTotalPatients && adminTotalPatients.length > 0) {
            mostAffectRegion();
        }
    }, [adminTotalPatients]);

    // Fetch trending diseases on mount
    useEffect(() => {
        trendingDisease();
    }, []);

    // Navigate to details page when details data is available
    useEffect(() => {
        if (detailsPageData && Object.keys(detailsPageData).length > 0) {
          console.log(detailsPageData);
          navigate('/layout/details');
        }
    }, [detailsPageData]);

    // Fetch submission data from API
    const fetchSubmissions = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/requests/getRequests`);
            if (!response.data.success) {
                toast.error(response.data.message);
                return;
            }
            else {
                console.log(response.data.data);    
                // Filter and set submission data for doctor view
                setDoctorTotalSubmissions(response.data.data.filter((request) => request.createdBy == sessionStorage.getItem('doctorID')).length);
                sessionStorage.getItem('doctorID') && setRequests(response.data.data.filter((request) => request.createdBy == sessionStorage.getItem('doctorID')).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).splice(0, 5));
                setDoctorPendingSubmissions(response.data.data.filter((request) => request.createdBy == sessionStorage.getItem('doctorID') && request.status.toLowerCase() === 'pending').length);
                const sortedSubmissions = response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                sessionStorage.getItem('doctorID') && setLastSubmit(sortedSubmissions.filter((request) => request.createdBy == sessionStorage.getItem('doctorID'))[0]?.createdAt.split('T')[0]);
                setAllRequests(response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).splice(0, 5));
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Fetch hospital data from API
    const fetchHospitals = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/hospitals/getHospitals`);
            if (!response.data.success) {
                toast.error(response.data.message);
                return;
            }
            else {
                setTotalHospitals(response.data.data.length);
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Fetch patient data from API
    const fetchPatients = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/patients/getPatients`);
            if (!response.data.success) {
                toast.error(response.data.message);
                return;
            }
            else {
                setTotalPatients(response.data.data.length);
                const patients = response.data.data.filter((patient) => patient.doctorID === sessionStorage.getItem('doctorID'));
                const sortedPatients = patients.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setPatientsData(sortedPatients.splice(0, 5));
                setAdminTotalPatients(response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).splice(0, 5));
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Prepare data for pie chart visualization
    const pieChartData = async () => {
        try {
            const diseases = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/patientDiseases/getDiseases`);
            if (!diseases.data.success) {
                toast.error(diseases.data.message);
                return;
            }
            else {
                // Transform disease data for chart visualization
                const data = diseases.data.data.map((disease) => ({ label: disease.diseaseName, value: disease.cases }));
                setChartData(data);
                const doctorData = diseases.data.data.filter((disease) => disease.addedBy === sessionStorage.getItem('doctorID'));
                const doctorChartData = doctorData.map((disease) => ({ label: disease.diseaseName, value: disease.cases }));
                console.log(doctorChartData);
                setDoctorChartData(doctorChartData);
                setAdminTotalDisease(diseases.data.data.slice(0, 5));
                setCriticalDiseases(diseases.data.data.sort((a, b) => b.cases - a.cases).slice(0, 5));
                setDoctorCriticalDiseases(diseases.data.data.filter((disease)=>disease.addedBy === sessionStorage.getItem('doctorID')).sort((a, b) => b.cases - a.cases).slice(0, 5));
                //sort diseases
                const sortedDiseases = diseases.data.data.sort((a, b) => new Date(b.cases) - new Date(a.cases));
                const topsortedDiseases = sortedDiseases.slice(0, 5);
                setSortDiseasesByCases(topsortedDiseases);
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    // Fetch all diseases from API
    const fetchAllDiseases = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/diseases/getDiseases`);
            if (!response.data.success) {
                toast.error(response.data.message);
                return;
            }
            else {
                setAllDiseases(response.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Calculate most affected region based on patient data
    const mostAffectRegion = () => {
        const regions = adminTotalPatients?.map((patient) => patient.address.town);
        const uniqueRegions = [...new Set(regions)];
        const regionData = uniqueRegions.map((region) => ({ label: region, value: adminTotalPatients.filter((patient) => patient.address.town === region).length }));
        if (regionData.length > 0) {
            const maxCasesRegion = regionData.reduce((max, current) => (max.value > current.value ? max : current), { value: 0 });
            console.log(maxCasesRegion);
            setMostAffectedRegion(maxCasesRegion);
        } else {
            setMostAffectedRegion(null);
        }
    }

    // Calculate most impacted disease
    const mostImpactedDisease = () => {
        const disease = adminTotalDisease.reduce((acc, current) => acc.cases > current.cases ? acc : current);
        const filteredDiseases = allDiseases.filter((disease) => disease.diseaseName === disease.diseaseName);
        setImpactedDisease({ ...disease, image: filteredDiseases[0]?.image });
    }

    // Fetch trending diseases using AI API
    const trendingDisease = async () => {
        const query = 'Give me the top 5 trending diseases in India in only in JSON format and object should include no.of cases in numbers and disease name . Provide ONLY a valid JSON response without markdown or extra text.'
        try {
            setLoading(true)
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/callGemini`, { query: query });
            if (!response.data.success) {
                toast.error(response.data.message);
                return;
            }
            else {
                console.log(response.data.data);
                setTrendingDiseases(response.data.data.trending_diseases);
            }
            setLoading(false)
        } catch (error) {
            console.log(error);
            toast.error(error.message);
            setLoading(false)
        }
    }

    // Event handlers for table row clicks
    const handleRecentRequestsRowClick = (e) => {
        console.log(e.target);
        const row = e.target.closest('tr');
        if (row) {
          const index = row.getAttribute('data-index');
          console.log(index);
          if (index !== null) {
            setDetailsPageData({...requests[Number(index)] });
          }
        }
    };

    const handleAllRequestsRowClick = (e) => {
        console.log(e.target);
        const row = e.target.closest('tr');
        if (row) {
          const index = row.getAttribute('data-index');
          if (index !== null) {
            setDetailsPageData({ ...allRequests[Number(index)] });
          }
        }
    };

    const handlePatientsRowClick = (e) => {
        console.log(e.target);
        const row = e.target.closest('tr');
        if (row) {
          const index = row.getAttribute('data-index');
          if (index !== null) {
            setDetailsPageData({ ...patientsData[Number(index)] });
          }
        }
    };

    const handleCriticalDiseasesRowClick = (e) => {
        console.log(e.target);
        const row = e.target.closest('tr');
        if (row) {
          const index = row.getAttribute('data-index');
          if (index !== null) {
            setDetailsPageData({ ...criticalDiseases[Number(index)] });
          }
        }
    };

    const handlesortDiseasesRowClick = (e) => {
        console.log(e.target);
        const row = e.target.closest('tr');
        if (row) {
          const index = row.getAttribute('data-index');
          if (index !== null) {
            setDetailsPageData({ ...sortDiseasesByCases[Number(index)] });
          }
        }
    };

    // Render dashboard UI with conditional rendering based on user role
    return (
        <div className='w-full max-h-[87vh] px-[20px] mt-6 overflow-y-auto removescroll'>
            <div className='flex gap-4 items-center flex-wrap'>
                {
                    user == 'doctor' ? (
                        <>
                            <KeyStats icon={submission} title={'TotalSubmissions'} value={doctorTotalSubmissions} id={0} />
                            <KeyStats icon={pending} title={'TotalPendings'} value={doctorPendingSubmissions} id={1} />
                            <KeyStats icon={calendar} title={'LastSubmit'} value={lastSubmit} id={2} />
                        </>
                    ) : (
                        <>
                            <KeyStats icon={hospital} title={'TotalHospitals'} value={TotalHospitals} id={0} />
                            <KeyStats icon={patient1} title={'TotalCases'} value={totalPatients} id={1} />
                            <KeyStats icon={affectedRegion} title={'AffectedRegion'} value={mostAffectedRegion.label} id={2} />
                        </>
                    )
                }
            </div>
            {/* Main dashboard content with charts and tables */}
            <div className='flex mt-10 flex-wrap'>
                <div className='2xl:max-w-[1000px] max-2xl:w-full'>
                    {/* Pie Chart */}
                    <div className='flex items-center gap-6 max-2xl:flex-wrap'>
                        <div style={{ width: 450, height: 320 }} className='rounded-lg border-[1px] border-gray-200 px-4 py-2 md:min-w-[380px]'>
                            <h5 className='text-heading1 font-semibold'>Disease Analysis</h5>
                            <PieChart
                                series={[
                                    {
                                        data: user === 'doctor' ? doctorChartData : chartData,
                                        innerRadius: 30,
                                        outerRadius: 100,
                                        paddingAngle: 5,
                                        cornerRadius: 5,
                                        startAngle: 0,
                                        endAngle: 360,
                                        cx: 150,
                                        cy: 150,
                                    }
                                ]}
                            />
                        </div>
                        {/* //Treding Diseases */}
                        <div className='rounded-lg border-[1px] border-gray-200 p-4 md:min-w-[350px] md:min-h-[320px] xl:max-w-[360px] px-4 py-2 overflow-y-auto removescroll'>
                            {
                                loading ? <div className='flex items-center justify-center min-h-[300px] w-full'>Loading...</div> :
                                user === 'doctor' ? (
                                    <>
                                        <h5 className='text-heading1 font-semibold'>Trending Diseases</h5>
                                        <div className='grid grid-cols-[2px,300px] max-sm:grid-cols-[1px,210px] mt-4 px-4 relative ml-2 max-h-[300px] overflow-hidden'>
                                            <div className='h-full bg-gray-400'></div>
                                            <div className='min-h-[30px]'></div>
                                            <div className='relative'>
                                                <div className='min-w-[20px] min-h-[20px] rounded-full bg-gray-400 absolute -left-2 flex items-center justify-center text-sm font-bold'></div>
                                                <div className='h-full bg-gray-400'></div>
                                            </div>
                                            {
                                                trendingDiseases?.map((disease, index) => {
                                                    return (
                                                        <>
                                                            <div className='min-h-[40px] ml-5 mb-1'>
                                                                <span className='font-semibold'>{disease.disease_name}</span> -- 240 patients till date.
                                                            </div>
                                                            <div className={`relative ${index === 4 && 'hidden'}`}>
                                                                <div className='min-w-[20px] min-h-[20px] rounded-full bg-gray-400 absolute -left-2 flex items-center justify-center text-sm font-bold'></div>
                                                                <div className='h-full bg-gray-400'></div>
                                                            </div>
                                                        </>
                                                    )
                                                })
                                            }
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h5 className='text-heading1 font-semibold'>Most Impacted Disease</h5>
                                        <div className='w-full min-h-[130px] max-h-[130px] flex items-center justify-center font-semibold text-gray-400 overflow-hidden mt-3 rounded-sm'>
                                            <img src={ImpactedDisease.image} alt="" className='object-contain w-full' />
                                        </div>
                                        <div className='font-medium text-center w-full text-gray-800 text-xl mt-3'>{ImpactedDisease.diseaseName}</div>
                                        <div className='w-full h-full flex items-center justify-between px-6 mt-4'>
                                            <div className='flex flex-col gap-1'>
                                                <div className='text-center text-2xl text-primary'>{ImpactedDisease.cases}</div>
                                                <div className='font-semibold'>Cases</div>
                                            </div>
                                            <div className='flex flex-col gap-1'>
                                                <div className={`text-center text-2xl ${(ImpactedDisease.cases / adminTotalPatients.length).toFixed(1) < 0.5 ? 'text-green-500' : 'text-red-500'}`}>{Math.round((ImpactedDisease.cases / adminTotalPatients.length) * 100)}%</div>
                                                <div className='font-semibold'>Severity</div>
                                            </div>
                                        </div>
                                    </>
                                )
                            }
                        </div>

                    </div>
                    {/* Recent Requests table */}
                    <div className='mt-8 w-full px-4 py-2 border-[1px] border-gray-200 rounded-lg min-h-[320px] overflow-y-auto removescroll'>
                        {
                            user === 'doctor' ? (
                                <>
                                    <h5 className='text-heading1 font-semibold'>Recent Requests</h5>
                                    <div className='overflow-auto'>
                                    <table className=' w-full mt-4'>
                                        <thead className='border-b-[1px] border-gray-300 bg-gray-100'>
                                            <th className='max-md:hidden mr-1'>Hospital ID</th>
                                            <th className=' mr-1 py-2'>Request</th>
                                            <th className='max-md:hidden mr-1'>Quantity</th>
                                            <th className=' mr-1'>Status</th>
                                            <th className=' mr-1'>Action</th>
                                        </thead>
                                        <tbody>
                                            {
                                                requests?.length === 0 ? (
                                                    <tr className='text-center text-gray-700 border-b-[1px] border-gray-300'>
                                                        <td className='py-3' colSpan={5}>No requests found</td>
                                                    </tr>
                                                ) :
                                                requests?.map((request, index) => {
                                                    return (
                                                        <tr className='text-center text-gray-700 border-b-[1px] border-gray-300' data-index={index} key={index}>
                                                            <td className="max-md:hidden">{request.hospitalID}</td>
                                                            <td className='py-3'>{request.request}</td>
                                                            <td className='max-md:hidden'>{request.quantity}</td>
                                                            <td className={`px-4 rounded-lg`}><span className={`px-4 py-2 rounded-lg ${request.status === 'Pending' || request.status === 'Rejected' ? 'bg-rose-200 text-rose-400' : 'bg-green-100 text-green-400'}`}>{request.status}</span></td>
                                                            <td><button className='py-1 px-4 bg-secondary text-white rounded-lg hover:bg-secondaryhover' onClick={handleRecentRequestsRowClick}>View</button></td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h5 className='text-heading1 font-semibold'>Recent Requests</h5>
                                    <div className='overflow-auto'>
                                    <table className=' w-full mt-4 '>
                                        <thead className='border-b-[1px] border-gray-300 bg-gray-100'>
                                            <th className=' mr-1 px-2'>Hospital ID</th>
                                            <th className=' mr-1 py-2 px-2'>Request</th>
                                            <th className=' mr-1 px-2'>Quantity</th>
                                            <th className=' mr-1 px-2'>Status</th>
                                            <th className=' mr-1 px-2'>Action</th>
                                        </thead>
                                        <tbody>
                                            {
                                                allRequests?.length === 0 ? (
                                                    <tr className='text-center text-gray-700'>
                                                        <td className='py-3' colSpan={5}>No requests found</td>
                                                    </tr>
                                                ) :
                                                allRequests?.map((request, index) => {
                                                    return (
                                                        <tr className='text-center text-gray-700 border-b-[1px] border-gray-300' key={index} data-index={index}>
                                                            <td className="px-2">{request.hospitalID}</td>
                                                            <td className='py-3 px-2'>{request.request}</td>
                                                            <td className='px-2'>{request.quantity}</td>
                                                            <td className={`px-4 rounded-lg`}><span className={`px-4 py-2 rounded-lg ${request.status === 'Pending' || request.status === 'Rejected' ? 'bg-rose-200 text-rose-400' : 'bg-green-100 text-green-400'}`}>{request.status}</span></td>
                                                            <td><button className='py-1 px-4 bg-secondary text-white rounded-lg hover:bg-secondaryhover' onClick={handleAllRequestsRowClick}>View</button></td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                    </div>
                                </>
                            )
                        }

                    </div>
                </div>
                <div className='w-full flex flex-col gap-4 2xl:px-4 2xl:max-w-[450px] max-2xl:mt-6'>
                    {/* Patients Table */}
                    <div className='min-h-[320px] max-h-[320px] rounded-lg border-[1px] border-gray-200 w-full overflow-y-auto px-4 py-2'>
                        {
                            user === 'doctor' ? (
                                <>
                                    <h5 className='text-heading1 font-semibold'>Patients Data</h5>
                                    <div className='overflow-auto'>
                                    <table className=' w-full mt-2'>
                                        <thead className='border-b-[1px] border-gray-300 bg-gray-100'>
                                            <th className='py-2'>Patient ID</th>
                                            <th className=''>Age</th>
                                            <th>Disease</th>
                                            <th>Action</th>
                                        </thead>
                                        <tbody>
                                            {
                                                patientsData.length == 0 ? <tr>
                                                    <td colSpan={7} className='text-center text-gray-700 py-3'>No Patients Found</td>
                                                </tr>:
                                                patientsData.map((patient, index) => (
                                                    <tr key={index} className='text-center text-gray-700 border-b-[1px] border-gray-300' data-index={index}>
                                                        <td className='py-3'>{patient.aadharNumber}</td>
                                                        <td>{patient.age}</td>
                                                        <td>{patient.disease}</td>
                                                        <td><button className='py-1 px-4 bg-secondary text-white rounded-lg hover:bg-secondaryhover' onClick={handlePatientsRowClick}>View</button></td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h5 className='text-heading1 font-semibold'>Affected Regions</h5>
                                    <div className='overflow-auto'>
                                    <table className=' w-full mt-2'>
                                        <thead className='border-b-[1px] border-gray-300 bg-gray-100'>
                                            <th className='py-2'>Region</th>
                                            <th className=''>Disease</th>
                                            <th>Cases</th>
                                            <th>Action</th>
                                        </thead>
                                        <tbody>
                                            {
                                                sortDiseasesByCases.map((disease, index) => (
                                                    <tr key={index} className='text-center text-gray-700 border-b-[1px] border-gray-300' data-index={index}>
                                                        <td className='py-3'>{disease.region.town}</td>
                                                        <td>{disease.diseaseName}</td>
                                                        <td>{disease.cases}</td>
                                                        <td><button className='py-1 px-4 bg-secondary text-white rounded-lg hover:bg-secondaryhover' onClick={handlesortDiseasesRowClick}>View</button></td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                    </div>
                                </>
                            )
                        }

                    </div>

                    <div className=' mt-4 min-h-[320px] max-h-[320px] rounded-lg border-[1px] border-gray-200 w-full overflow-y-auto px-4 py-2'>
                        {
                            user === 'doctor' ? (
                                <>
                                <h5 className='text-heading1 font-semibold'>Critical Diseases</h5>
                                <div className='overflow-x-auto'>
                                <table className=' w-full mt-3'>
                                    <thead className='border-b-[1px] border-gray-300 bg-gray-100'>
                                        <th className='py-2'>Disease ID</th>
                                        <th className=''>Disease Name</th>
                                        <th>Cases</th>
                                        <th>Action</th>
                                    </thead>
                                    <tbody>
                                        {
                                            doctorCriticalDiseases.map((disease, index) => (
                                                <tr key={index} className='text-center text-gray-700 border-b-[1px] border-gray-300' data-index={index}>
                                                    <td className='py-3'>{disease.diseaseID}</td>
                                                    <td>{disease.diseaseName}</td>
                                                    <td>{disease.cases}</td>
                                                    <td><button className='py-1 px-4 bg-secondary text-white rounded-lg hover:bg-secondaryhover' onClick={handleCriticalDiseasesRowClick}>View</button></td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                                </div>
                            </>

                            ) : (
                                <>
                                    <h5 className='text-heading1 font-semibold'>Critical Diseases</h5>
                                    <div className='overflow-x-auto'>
                                    <table className=' w-full mt-3'>
                                        <thead className='border-b-[1px] border-gray-300 bg-gray-100'>
                                            <th className='py-2'>Disease ID</th>
                                            <th className=''>Disease Name</th>
                                            <th>Cases</th>
                                            <th>Action</th>
                                        </thead>
                                        <tbody>
                                            {
                                                criticalDiseases.map((disease, index) => (
                                                    <tr key={index} className='text-center text-gray-700 border-b-[1px] border-gray-300'>
                                                        <td className='py-3'>{disease.diseaseID}</td>
                                                        <td>{disease.diseaseName}</td>
                                                        <td>{disease.cases}</td>
                                                        <td><button className='py-1 px-4 bg-secondary text-white rounded-lg hover:bg-secondaryhover'>View</button></td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                    </div>
                                </>
                            )
                        }

                    </div>
                </div>
            </div>
        </div >
    )
}

export default Dashboard
