import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Login from './components/Login'
import Layout from './Layout'
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import Dashboard from './pages/Dashboard';
import GlobalContext from './context/GlobalContext';
import Requests from './pages/Requests';
import PatientData from './pages/PatientData';
import PendingApprovals from './pages/PendingApprovals';
import PolicySuggestions from './pages/PolicySuggestions';
import AllPatients from './pages/AllPatients';
import { ToastContainer } from 'react-toastify';
import Hospitals from './pages/Hospitals';
import Dieseases from './pages/Dieseases';
import Details from './pages/Details';
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { useEffect, useLayoutEffect, useState } from 'react';
import mainPageLoader from './assets/mainPageLoader.json';
import Lottie from 'react-lottie';
import animationData from './assets/mainPageLoader.json';


function App() {
 
  const [loading,setLoading] = useState(true);
  const [isAnimationLoaded, setIsAnimationLoaded] = useState(false);

  //set the loader until the page is fully loaded
  useLayoutEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => {
      setLoading(true);
    }
  },[]);

  if(loading){
    return (
      <div className='flex flex-col justify-center items-center h-screen'>
        <Lottie
          options={{
            loop: true,
            autoplay: true,
            animationData: animationData,
            rendererSettings: {
              preserveAspectRatio: "xMidYMid slice"
            }
          }}
          height={200}
          width={200}
        />
        <div className='text-2xl animate-pulse'>Loading... Please Wait</div>
      </div>
    )
  }

  return (
    <>
      <Theme >
        <GlobalContext>
        <PrimeReactProvider >
              <div className='flex justify-center'><ToastContainer /></div>
              <Router>
                <Routes>
                  <Route path='/' element={<LandingPage />}>
                    <Route path='login' element={<Login />} />
                  </Route>
                  <Route path='layout' element={<Layout />} >
                    <Route path='dashboard' element={<Dashboard />} />
                    <Route path='requests' element={<Requests />} />
                    <Route path='patientdata' element={<PatientData />} />
                    <Route path='pendingApprovals' element={<PendingApprovals />} />
                    <Route path='policySuggestions' element={<PolicySuggestions />} />
                    <Route path='allpatients' element={<AllPatients />} />
                    <Route path='hospitals' element={<Hospitals />} />
                    <Route path='diseases' element={<Dieseases />} />
                    <Route path='details' element={<Details />} />
                  </Route>
                </Routes>
              </Router>
            </PrimeReactProvider>
        </GlobalContext>
      </Theme>
    </>
  )
}

export default App
