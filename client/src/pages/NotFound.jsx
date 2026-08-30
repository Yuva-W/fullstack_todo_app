import { useNavigate } from "react-router-dom";

function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-start mt-5">
            <h1 className="text-4xl font-bold text-gray-800 mt-5">
                404
            </h1>

            <p className="text-xl text-gray-600 mt-2">
                Page Not Found
            </p>

            <button
                onClick={() => navigate("/dashboard")}
                className="mt-5 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
            >
                Back to Dashboard
            </button>
        </div>
    );
}

export default NotFound;