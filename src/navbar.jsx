import { Search } from "lucide-react";

function NavBar() {
  return (
    <nav className="bg-white shadow-md px-4 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 ">
          <img src="" alt="codenest logo" className="m-1" />
          <span className="text-2xl font-bold text-gray-950 bg-clip-text">
            CodeNest
          </span>
          <div className="flex items-center gap-8 m-3 ml-5 ">
            <a
              className="text-sm font-medium text-gray-950 hover:text-gray-800 hover:underline underline-offset-4 transition-colors duration-200"
              href="#"
            >
              Explore
            </a>
            <a
              className="text-sm font-medium text-gray-950 hover:text-gray-800 hover:underline underline-offset-4 transition-colors duration-200"
              href="#"
            >
              About
            </a>
            <a
              className="text-sm font-medium text-gray-950 hover:text-gray-800 hover:underline underline-offset-4 transition-colors duration-200"
              href="#"
            >
              Community
            </a>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="border-2 border-gray-300 rounded-md p-1 h-9 w-48 flex items-center gap-3">
            <div className="m-1">
              <Search size={16} />
            </div>
            <input
              className="text-sm font-medium text-gray-950 border-none outline-none"
              type="text"
              placeholder="search"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="border-2 rounded-md p-1 h-9 w-18 bg-gray-950  text-white hover:cursor-pointer hover:text-gray-200 hover:bg-gray-900">
              Login
            </button>
            <button className="border-2 rounded-md p-1 h-9 w-18 bg-gray-950  text-white hover:cursor-pointer hover:text-gray-200 hover:bg-gray-900">
              Signup
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
