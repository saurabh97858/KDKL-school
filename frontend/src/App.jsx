import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admission from './pages/Admission';
import Login from './pages/Login';
import PrincipalDashboard from './pages/dashboards/PrincipalDashboard';
import PrincipalTeachers from './pages/dashboards/PrincipalTeachers';
import PrincipalAddStudent from './pages/dashboards/PrincipalAddStudent';
import PrincipalGallery from './pages/dashboards/PrincipalGallery';
import PrincipalFounder from './pages/dashboards/PrincipalFounder';
import PrincipalNotifications from './pages/dashboards/PrincipalNotifications';
import PrincipalApplications from './pages/dashboards/PrincipalApplications';
import PrincipalSettings from './pages/dashboards/PrincipalSettings';
import PrincipalFees from './pages/dashboards/PrincipalFees';
import PrincipalToppers from './pages/dashboards/PrincipalToppers';
import PrincipalMoments from './pages/dashboards/PrincipalMoments';
import PrincipalFeeStructure from './pages/dashboards/PrincipalFeeStructure';
import FeeStructureViewer from './pages/FeeStructureViewer';
import TeacherDashboard from './pages/dashboards/TeacherDashboard';
import TeacherAttendance from './pages/dashboards/TeacherAttendance';
import TeacherResults from './pages/dashboards/TeacherResults';
import TeacherLeaves from './pages/dashboards/TeacherLeaves';
import StudentDashboard from './pages/dashboards/StudentDashboard';
import StudentResults from './pages/dashboards/StudentResults';
import StudentLeaves from './pages/dashboards/StudentLeaves';
import About from './pages/About';
import Gallery from './pages/Gallery';
import ChangePassword from './pages/dashboards/ChangePassword';
import StudentFees from './pages/dashboards/StudentFees';
import { AuthProvider } from './context/AuthContext';
import ScrollToTopTrigger from './components/ScrollToTopTrigger';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTopTrigger />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/admission" element={<Admission />} />
          <Route path="/login" element={<Login />} />
          <Route path="/settings/password" element={<ChangePassword />} />
          
          <Route path="/principal-dashboard" element={<PrincipalDashboard />} />
          <Route path="/principal/teachers" element={<PrincipalTeachers />} />
          <Route path="/principal/add-student" element={<PrincipalAddStudent />} />
          <Route path="/principal/gallery" element={<PrincipalGallery />} />
          <Route path="/principal/founder" element={<PrincipalFounder />} />
          <Route path="/principal/notifications" element={<PrincipalNotifications />} />
          <Route path="/principal/applications" element={<PrincipalApplications />} />
          <Route path="/principal/settings" element={<PrincipalSettings />} />
          <Route path="/principal/fees" element={<PrincipalFees />} />
          <Route path="/principal/toppers" element={<PrincipalToppers />} />
          <Route path="/principal/moments" element={<PrincipalMoments />} />
          <Route path="/principal/fee-structure" element={<PrincipalFeeStructure />} />
          <Route path="/fee-structure" element={<FeeStructureViewer />} />

          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/attendance" element={<TeacherAttendance />} />
          <Route path="/teacher/results" element={<TeacherResults />} />
          <Route path="/teacher/leaves" element={<TeacherLeaves />} />

          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/student/results" element={<StudentResults />} />
          <Route path="/student/leaves" element={<StudentLeaves />} />
          <Route path="/student/fees" element={<StudentFees />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
