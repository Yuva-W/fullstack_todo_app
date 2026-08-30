import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Navbar() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    const getMe = async () => {
        try {
            const response = await api.get("/users/me");

            setUser(response.data.user);
        } catch (error) {
            console.log(error.response?.data || error.message);
        }
    };

    useEffect(() => {
        getMe();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const deleteAccount = async () => {
        const confirmDelete = window.confirm(
            "Are you sure? This will permanently delete your account and all your todos."
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await api.delete("/users/me");

            localStorage.removeItem("token");

            navigate("/login");

        } catch (error) {
            console.log(error.response?.data || error.message);
        }
    };

    return (
        <nav className="bg-white shadow px-6 py-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between">

                <h1 className="text-xl font-bold text-blue-600">
                    TaskFlow
                </h1>

                <div className="flex items-center gap-4">

                    {user && (
                        <div className="text-right">
                            <p className="font-medium text-gray-800">
                                {user.name}
                            </p>

                            <p className="text-sm text-gray-500">
                                {user.email}
                            </p>
                        </div>
                    )}

                    <div className="flex gap-3">

                        <button
                            onClick={deleteAccount}
                            className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800"
                        >
                            Delete Account
                        </button>

                        <button
                            onClick={handleLogout}
                            className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                        >
                            Logout
                        </button>

                    </div>

                </div>

            </div>
        </nav>
    );
}

export default Navbar;