export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-24 py-5 bg-primary text-white rounded-b-2xl">
      
      <h1 className="text-xl font-semibold">Technavyug</h1>

      <ul className="flex gap-8">
        <li className="cursor-pointer hover:text-secondary">Home</li>
        <li className="cursor-pointer hover:text-secondary">Courses</li>
        <li className="cursor-pointer hover:text-secondary">Blog</li>
        <li className="cursor-pointer hover:text-secondary">About</li>
      </ul>

      <div className="flex gap-3">
        <button className="bg-white text-primary px-4 py-2 rounded-full">
          Login
        </button>

        <button className="bg-secondary px-4 py-2 rounded-full text-white">
          Sign Up
        </button>
      </div>

    </nav>
  );
}