function NavBar() {
    return (
        <nav className="bg-white shadow-md px-6 py-4">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    CodeNest
                </div>
                <div className="flex gap-8">
                    <a className="text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors duration-200" href="#">
                        Explore
                    </a>
                    <a className="text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors duration-200" href="#">
                        About
                    </a>
                    <a className="text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors duration-200" href="#">
                        Community
                    </a>
                </div>
            </div>
        </nav>
    )
}

export default NavBar 