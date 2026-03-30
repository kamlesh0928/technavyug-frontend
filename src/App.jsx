import { Routes, Route } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";

// Layouts
import PublicLayout from "@/layout/Public.layout";
import AdminLayout from "@/layout/Admin.layout";
import InstructorLayout from "@/layout/Instructor.layout";
import StudentLayout from "@/layout/Student.layout";

// Guards
import AdminGuard from "@/guards/Admin.guard";
import InstructorGuard from "@/guards/Instructor.guard";
import StudentGuard from "@/guards/Student.guard";

// Public Pages
import Home from "@/pages/public/Home";
import Courses from "@/pages/public/Courses";
import CourseDetails from "@/pages/public/CourseDetails";
import About from "@/pages/public/About";
import Contact from "@/pages/public/Contact";
import Blogs from "@/pages/public/Blogs";

// Auth Pages
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import VerifyEmail from "@/pages/auth/VerifyEmail";

// Admin Pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminUsers from "@/pages/admin/Users";
import AdminCourses from "@/pages/admin/Courses";
import AdminOrders from "@/pages/admin/Orders";
import AdminProducts from "@/pages/admin/Products";
import AdminCMS from "@/pages/admin/CMS";
import AdminSettings from "@/pages/admin/Settings";

// Instructor Pages
import InstructorDashboard from "@/pages/instructor/Dashboard";
import InstructorMyCourses from "@/pages/instructor/MyCourses";
import InstructorCreateCourse from "@/pages/instructor/CreateCourses";
import InstructorEditCourse from "@/pages/instructor/EditCourse";
import InstructorEarnings from "@/pages/instructor/Earnings";

// Student Pages
import StudentDashboard from "@/pages/student/Dashboard";
import StudentMyCourses from "@/pages/student/MyCourses";
import StudentLearning from "@/pages/student/Learning";
import StudentOrders from "@/pages/student/Orders";
import StudentProfile from "@/pages/student/Profile";

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />

      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/:slug" element={<CourseDetails />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="blog" element={<Blogs />} />
        </Route>

        {/* Auth Routes (no layout) */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="verify-email" element={<VerifyEmail />} />

        {/* Admin Routes */}
        <Route
          path="admin"
          element={
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="cms" element={<AdminCMS />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Instructor Routes */}
        <Route
          path="instructor"
          element={
            <InstructorGuard>
              <InstructorLayout />
            </InstructorGuard>
          }
        >
          <Route index element={<InstructorDashboard />} />
          <Route path="courses" element={<InstructorMyCourses />} />
          <Route path="courses/new" element={<InstructorCreateCourse />} />
          <Route path="courses/edit/:id" element={<InstructorEditCourse />} />
          <Route path="earnings" element={<InstructorEarnings />} />
        </Route>

        {/* Student Routes */}
        <Route
          path="student"
          element={
            <StudentGuard>
              <StudentLayout />
            </StudentGuard>
          }
        >
          <Route index element={<StudentDashboard />} />
          <Route path="courses" element={<StudentMyCourses />} />
          <Route path="learning" element={<StudentLearning />} />
          <Route path="orders" element={<StudentOrders />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
