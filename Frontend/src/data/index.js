import Dashboard from '../assets/dashboard.svg'
import Request from '../assets/request.svg'
import Patient from '../assets/patient.svg'
import AllPatients from '../assets/allPatients.svg'
import Submission from '../assets/submission.svg'
import submission from '../assets/submission.jpg'
import pending from '../assets/pending.png'
import calendar from '../assets/calendar.svg'
import hospital from '../assets/hospital.svg'
import patient1 from '../assets/patient1.svg'
import affectedRegion from '../assets/affectedRegion.svg'


export const sidebarOptions = {
    doctor: [
        {
            title: "Dashboard",
            path: "/layout/dashboard",
            icon: Dashboard,
        },
        {
            title: "Requests",
            path: "/layout/requests",
            icon: Request,
        },
        {
            title: "Add Patient",
            path: "/layout/patientdata",
            icon: Patient,
        },
        {
            title: "All Patients",
            path: "/layout/allpatients",
            icon: Patient,
        }
    ],
    admin: [
        {
            title: "Dashboard",
            path: "/layout/dashboard",
            icon: Dashboard,
        },
        {
            title: "Diseases",
            path: "/layout/diseases",
            icon: Request,
        },
        {
            title: "Hospitals",
            path: "/layout/hospitals",
            icon: Patient,
        },
        {
            title: "Pending Approvals",
            path: "/layout/pendingApprovals",
            icon: AllPatients,
        },
        {
            title: "Policy Suggestions",
            path: "/layout/policySuggestions",
            icon: Submission,
        }
    ]
};

export const keyStats = {
    doctor: [
        {
            title: "Total Submissions",
            value: "40,522",
            icon: submission
        },
        {
            title: "Pending Approvals",
            value: "5,000",
            icon: pending
        },
        {
            title: "Last Submit Date",
            value: "5,000",
            icon: calendar
        }
    ],
    admin: [
        {
            title: "Total Hospitals",
            value: "40,522",
            icon: hospital
        },
        {
            title: "Total Cases",
            value: "5,000",
            icon: patient1
        },
        {
            title: "Most Affected Region",
            value: "Bengaluru",
            icon: affectedRegion
        }
    ]
};

export const states = [
    {
        state: "Karnataka",
        districts: ["Bangalore", "Mysore", "Mangalore"],
        cities: {
            Bangalore: ["Jayanagar", "Koramangala", "Yelahanka"],
            Mysore: ["Nanjangud", "Hunsur", "Piriyapatna"],
            Mangalore: ["Ullal", "Puttur", "Mulki"],
        }
    },
    {
        state: "Maharashtra",
        districts: ["Mumbai", "Pune", "Nagpur"],
        cities: {
            Mumbai: ["Andheri", "Borivali", "Dadar"],
            Pune: ["Shivajinagar", "Kothrud", "Hinjewadi"],
            Nagpur: ["Dharampeth", "Sitabuldi", "Manewada"]
        }
    },
    {
        state: "Tamil Nadu",
        districts: ["Chennai", "Coimbatore", "Madurai"],
        cities: {
            Chennai: ["T. Nagar", "Adyar", "Velachery"],
            Coimbatore: ["Gandhipuram", "Saibaba Colony", "RS Puram"],
            Madurai: ["Anna Nagar", "Tallakulam", "Simmakkal"]
        }
    },
    {
        state: "Gujarat",
        districts: ["Ahmedabad", "Surat", "Vadodara"],
        cities: {
            Ahmedabad: ["Navrangpura", "Maninagar", "Bopal"],
            Surat: ["Adajan", "Varachha", "Vesu"],
            Vadodara: ["Alkapuri", "Gotri", "Fatehgunj"]
        }
    },
    {
        state: "West Bengal",
        districts: ["Kolkata", "Darjeeling", "Howrah"],
        cities: {
            Kolkata: ["Salt Lake", "Garia", "Behala"],
            Darjeeling: ["Kurseong", "Mirik", "Siliguri"],
            Howrah: ["Shibpur", "Bally", "Domjur"]
        }
    }
    

]
