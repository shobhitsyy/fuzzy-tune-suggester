
import { Link } from "react-router-dom";

const Index = () => {
  const isAdmin = typeof window !== "undefined" && localStorage.getItem("isAdmin") === "true";

  return (
    <>
      <nav className="flex items-center justify-between p-4 bg-blue-100">
        <div className="font-bold text-lg text-blue-800">Your Music App</div>
        <div className="flex gap-3 items-center">
          {/* Only show admin link if not already in admin */}
          {!isAdmin && (
            <Link to="/admin" className="text-blue-700 hover:underline font-medium">
              Admin
            </Link>
          )}
        </div>
      </nav>
      <div className="flex flex-col items-center mt-10">
        <h1 className="text-3xl font-bold mb-4">Welcome to Your Music App</h1>
        <p className="mb-6 text-gray-700">Discover song recommendations or manage songs as admin.</p>
        <Link
          to="/recommendations"
          className="px-6 py-3 rounded bg-blue-600 text-white hover:bg-blue-700 font-semibold text-lg"
        >
          See Song Recommendations
        </Link>
      </div>
    </>
  );
};

export default Index;

