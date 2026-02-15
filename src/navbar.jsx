function NavBar() {
    return (
        <nav className="bg-white shadow-md px-0 py-4">
            <div className="flex items-center justify-between max-w-7xl mx-auto ml-1">
                <div className="flex m-auto ml-0">
                    <img src="" alt="codenest logo" className="m-1" />
                    <span className="text-2xl font-bold text-gray-950 bg-clip-text">CodeNest</span>
                </div>
                <div className="flex gap-8 ml-auto">
                    <a className="text-sm font-medium text-gray-950 hover:text-gray-800 hover:underline underline-offset-4  transition-colors duration-200" href="#">
                        Explore
                    </a>
                    <a className="text-sm font-medium text-gray-950 hover:text-gray-800 transition-colors duration-200" href="#">
                        About
                    </a>
                    <a className="text-sm font-medium text-gray-950 hover:text-gray-800 transition-colors duration-200" href="#">
                        Community
                    </a>
                </div>
            </div>
        </nav>
    )
}

export default NavBar 