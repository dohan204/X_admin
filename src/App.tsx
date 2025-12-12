import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Register from "./pages/auth/Register";
import ProtectedRoute from "./router/ProTectedRoute";
import Login from "./pages/auth/Login";
import MainSubject from './pages/subject/main'
import './App.css'
import AuthLayout from "./layout/AuthLayout";
import MainLayout from "./layout/mainlayout";
import AccountMain from "./pages/account/mainAccount";
import AuthUser from "./pages/account/authenticationUser";
import NotFound from "./pages/auth/NotFound";
import QuestionMain from "./pages/question";
import ManagerQuestion from "./pages/question/manager";
import RoleMain from "./pages/role/main";
import Manager from "./pages/role/manager";
import ExamMain from "./pages/exam";
import Topic from "./pages/exam/topic";
import Dashboard from "./pages/main/Dashboard";

function App() {
  return (
    <Router>
      <Toaster />
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* PROTECTED ROUTES */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route index path="dashboard" element={<Dashboard />} />
            {/* <Route path="role" element={<RoleMain />} /> /main */}
            <Route path="subject" element={<MainSubject />} /> {/* /main/subject */}
            <Route path="account" element={<AccountMain />}>
              <Route path="authUser" element={<AuthUser />} /> {/* /main/account/authUser */}
            </Route>
            <Route path="question" element={<QuestionMain />}>
              <Route path="manager" element={<ManagerQuestion />} /> {/* /main/question/manager */}
            </Route>
            <Route path="role" element={<RoleMain />}>
              <Route path="manager" element={<Manager />} /> {/* /main/role/manager */}
            </Route>
            <Route path="mainExam" element={<ExamMain />}>
              <Route path="topic" element={<Topic />} /> {/* /main/mainExam/topic */}
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
