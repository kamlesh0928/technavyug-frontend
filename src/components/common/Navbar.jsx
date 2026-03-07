import "../../styles/index.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">LMS & Co.</div>

      <ul className="nav-links">
        <li>Home</li>
        <li>Courses</li>
        <li>Products</li>
        <li>Blog</li>
        <li>About</li>
        <li>Contact</li>
      </ul>

      <div className="nav-buttons">
        <button className="login-btn">Log In</button>
        <button className="signup-btn">Sign Up</button>
      </div>
    </nav>
  );
}

export default Navbar;

