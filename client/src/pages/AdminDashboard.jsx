import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import TodoCard from "../components/TodoCard";
import TodoDetails from "../components/TodoDetails";
import UserCard from "../components/UserCard";
import UserDetails from "../components/UserDetails";

function AdminDashboard() {
    const navigate = useNavigate();

    // ==============================
    // STATE
    // ==============================

    const [users, setUsers] = useState([]);
    const [todos, setTodos] = useState([]);

    const [loadingUsers, setLoadingUsers] = useState(true);
    const [loadingTodos, setLoadingTodos] = useState(true);
    const [loadingTodo, setLoadingTodo] = useState(false);
    const [loadingUserTodos, setLoadingUserTodos] = useState(false);

    const [selectedTodo, setSelectedTodo] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    const [userTodos, setUserTodos] = useState([]);

    // Search / filter
    const [search, setSearch] = useState("");
    const [completed, setCompleted] = useState("");

    // Pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const limit = 10;

    // ==============================
    // GET USERS
    // ==============================

    const getUsers = async () => {
        try {
            const response = await api.get("/admin/users");

            setUsers(response.data.users);
        } catch (error) {
            console.log(
                error.response?.data || error.message
            );
        } finally {
            setLoadingUsers(false);
        }
    };

    // ==============================
    // GET ALL TODOS
    // ==============================

    const getTodos = async () => {
        try {
            setLoadingTodos(true);

            const response = await api.get("/admin/todos", {
                params: {
                    page,
                    limit,
                    search,
                    completed,
                },
            });

            setTodos(response.data.todos);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.log(
                error.response?.data || error.message
            );
        } finally {
            setLoadingTodos(false);
        }
    };

    // ==============================
    // VIEW TODO
    // ==============================

    const viewTodo = async (id) => {
        // Hide if already selected
        if (selectedTodo?._id === id) {
            setSelectedTodo(null);
            return;
        }

        try {
            setLoadingTodo(true);

            const response = await api.get(
                `/admin/todos/${id}`
            );

            setSelectedTodo(response.data.todo);
        } catch (error) {
            console.log(
                error.response?.data || error.message
            );
        } finally {
            setLoadingTodo(false);
        }
    };

    // ==============================
    // DELETE TODO
    // ==============================

    const deleteTodo = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this todo?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await api.delete(`/admin/todos/${id}`);

            // Close details if deleted todo is selected
            if (selectedTodo?._id === id) {
                setSelectedTodo(null);
            }

            getTodos();
        } catch (error) {
            console.log(
                error.response?.data || error.message
            );
        }
    };

    // ==============================
    // VIEW USER
    // ==============================

    const viewUser = async (user) => {
      if (selectedUser?._id === user._id) {
          setSelectedUser(null);
          setUserTodos([]);
          return;
      }

      setSelectedUser(user);

      try {
          setLoadingUserTodos(true);

          const response = await api.get(
              `/admin/todos/user/${user._id}`
          );

          setUserTodos(response.data.todos);
      } catch (error) {
          console.log(error.response?.data || error.message);
          setUserTodos([]);
      } finally {
          setLoadingUserTodos(false);
      }
  };

    // ==============================
    // SEARCH
    // ==============================

    const handleSearch = () => {
        if (page !== 1) {
            setPage(1);
        } else {
            getTodos();
        }
    };

    // ==============================
    // LOGOUT
    // ==============================

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    // ==============================
    // INITIAL DATA
    // ==============================

    useEffect(() => {
        getUsers();
    }, []);

    useEffect(() => {
        getTodos();
    }, [page]);

    // ==============================
    // JSX
    // ==============================

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <div className="max-w-6xl mx-auto">

                {/* ==============================
                    HEADER
                ============================== */}

                <div className="flex items-center justify-between mb-6">

                    <h1 className="text-3xl font-bold text-gray-800">
                        Admin Dashboard
                    </h1>

                    <button
                        onClick={handleLogout}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                        Logout
                    </button>

                </div>

                {/* ==============================
                    STATISTICS
                ============================== */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

                    {/* USERS */}

                    <div className="bg-white p-5 rounded-xl shadow">

                        <p className="text-gray-500">
                            Total Users
                        </p>

                        <p className="text-3xl font-bold text-blue-600">
                            {users.length}
                        </p>

                    </div>

                    {/* TODOS */}

                    <div className="bg-white p-5 rounded-xl shadow">

                        <p className="text-gray-500">
                            Todos
                        </p>

                        <p className="text-3xl font-bold text-green-600">
                            {todos.length}
                        </p>

                    </div>

                </div>

                {/* ==============================
                    USERS
                ============================== */}

                <div className="bg-white rounded-xl shadow mb-6">

                    <div className="p-5 border-b">

                        <h2 className="text-xl font-semibold">
                            Users
                        </h2>

                    </div>

                    {loadingUsers ? (

                        <p className="p-5">
                            Loading users...
                        </p>

                    ) : (

                        <div className="divide-y">

                            {users.map((user) => (

                                <UserCard
                                    key={user._id}
                                    user={user}
                                    onView={viewUser}
                                    isSelected={
                                        selectedUser?._id === user._id
                                    }
                                >

                                    {/* Expanded User Details */}

                                    {selectedUser?._id === user._id && (

                                        <UserDetails
                                            user={selectedUser}
                                            todos={userTodos}
                                            loading={loadingUserTodos}
                                        />

                                    )}

                                </UserCard>

                            ))}

                        </div>

                    )}

                </div>

                {/* ==============================
                    ALL TODOS
                ============================== */}

                <div className="bg-white rounded-xl shadow">

                    <div className="p-5 border-b">

                        <h2 className="text-xl font-semibold">
                            All Todos
                        </h2>

                        {/* SEARCH */}

                        <div className="mt-4 flex flex-col md:flex-row gap-3">

                            <input
                                type="text"
                                placeholder="Search todos..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <select
                                value={completed}
                                onChange={(e) =>
                                    setCompleted(e.target.value)
                                }
                                className="border border-gray-300 rounded-lg px-4 py-2 outline-none"
                            >

                                <option value="">
                                    All
                                </option>

                                <option value="true">
                                    Completed
                                </option>

                                <option value="false">
                                    Pending
                                </option>

                            </select>

                            <button
                                onClick={handleSearch}
                                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                            >
                                Search
                            </button>

                        </div>

                    </div>

                    {/* TODOS */}

                    {loadingTodos ? (

                        <p className="p-5">
                            Loading todos...
                        </p>

                    ) : todos.length === 0 ? (

                        <p className="p-5 text-gray-500">
                            No todos found.
                        </p>

                    ) : (

                        <div className="divide-y">

                            {todos.map((todo) => (

                                <div key={todo._id}>

                                    <TodoCard
                                        todo={todo}
                                        onView={viewTodo}
                                        onDelete={deleteTodo}
                                        isSelected={
                                            selectedTodo?._id === todo._id
                                        }
                                    />

                                    {/* Expanded Todo Details */}

                                    {selectedTodo?._id === todo._id && (

                                        <TodoDetails
                                            todo={selectedTodo}
                                            loading={loadingTodo}
                                        />

                                    )}

                                </div>

                            ))}

                            {/* ==============================
                                PAGINATION
                            ============================== */}

                            <div className="flex justify-center items-center gap-4 p-5">

                                <button
                                    onClick={() =>
                                        setPage(page - 1)
                                    }
                                    disabled={page === 1}
                                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>

                                <span className="font-medium text-gray-700">
                                    Page {page} of {totalPages}
                                </span>

                                <button
                                    onClick={() =>
                                        setPage(page + 1)
                                    }
                                    disabled={
                                        page === totalPages
                                    }
                                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>

                            </div>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}

export default AdminDashboard;