function Header({ adminName }) {
    const handleLogout = () => {
        // simple logout logic
        console.log("Logging out...");
        // later you can redirect to login page
      };
 
    return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center space-x-8">
        <span className="text-xl font-bold text-indigo-600">Admin Dashboard</span>
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="text-gray-600 hover:text-indigo-600">Dashboard</a>
          <a href="/vendor-requests" className="text-gray-600 hover:text-indigo-600">Vendor Requests</a>
          <a href="/customer-info" className="text-gray-600 hover:text-indigo-600">Customers </a>
          <a href="vendor-info" className="text-gray-600 hover:text-indigo-600">Vendors</a>
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-gray-700 font-semibold">{adminName}</span>
        <button 
          onClick={handleLogout} 
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
export default Header;