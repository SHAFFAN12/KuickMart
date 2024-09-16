const AdminHeader = ({ onToggleSidebar }) => {
    return (
      <header className="admin-header bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <button
          className="lg:hidden p-2 rounded bg-blue-700"
          onClick={onToggleSidebar}
        >
          Menu
        </button>
      </header>
    );
  };