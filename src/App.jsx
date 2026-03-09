
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { Bounce, ToastContainer } from "react-toastify";
import Home from "./pages/public/Home";

function App() {
  return (
    <div>
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
        transition:Bounce
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
