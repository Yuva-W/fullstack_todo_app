import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminDashboard() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [todos, setTodos] = useState([]);

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingTodos, setLoadingTodos] = useState(true);

  const [selectedTodo, setSelectedTodo] = useState(null);
  const [loadingTodo, setLoadingTodo] = useState(false);

  const [search, setSearch] = useState("");
  const [completed, setCompleted] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [selectedUser, setSelectedUser] = useState(null);
  const [userTodos, setUserTodos] = useState([]);
  const [loadingUserTodos, setLoadingUserTodos] = useState(false);

  // ==============================
  // GET ALL USERS
  // ==============================

  const getUsers = async () => {
    try {
      const response = await api.get("/admin/users");

      console.log("Users:", response.data);

      setUsers(response.data.users);
    } catch (error) {
      console.log(error.response?.data || error.message);
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
      console.log(error.response?.data || error.message);
    } finally {
      setLoadingTodos(false);
    }
  };

  // ==============================
  // VIEW TODO
  // ==============================

  const viewTodo = async (id) => {
    // If already selected, hide it
    if (selectedTodo?._id === id) {
      setSelectedTodo(null);
      return;
    }

    try {
      setLoadingTodo(true);

      const response = await api.get(`/admin/todos/${id}`);

      console.log("Selected Todo:", response.data);

      setSelectedTodo(response.data.todo);
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoadingTodo(false);
    }
  };

  // ==============================
  // DELETE TODO
  // ==============================

  const deleteTodo = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this todo?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/admin/todos/${id}`);

      if (selectedTodo?._id === id) {
        setSelectedTodo(null);
      }

      getTodos();
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  const viewUser = async (user) => {
    if (selectedUser?._id === user._id) {
      setSelectedUser(null);
      setUserTodos([]);
      return;
    }

    try {
      setLoadingUserTodos(true);

      const response = await api.get(`/admin/todos/user/${user._id}`);

      setSelectedUser(user);
      setUserTodos(response.data.todos);
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoadingUserTodos(false);
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
  // LOAD DATA
  // ==============================

  useEffect(() => {
    getUsers();
    getTodos();
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* ==============================
                    HEADER
                ============================== */}

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>

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
          {/* Users */}
          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500">Total Users</p>

            <p className="text-3xl font-bold text-blue-600">{users.length}</p>
          </div>

          {/* Todos */}
          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500">Todos</p>

            <p className="text-3xl font-bold text-green-600">{todos.length}</p>
          </div>
        </div>

        {/* ==============================
                    USERS
                ============================== */}

        <div className="bg-white rounded-xl shadow mb-6">
          <div className="p-5 border-b">
            <h2 className="text-xl font-semibold">Users</h2>
          </div>

          {loadingUsers ? (
            <p className="p-5">Loading users...</p>
          ) : (
            <div className="divide-y">
              {users.map((user) => (
                <div key={user._id} className="p-5 border-b">
                  {/* User row */}
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-gray-800">{user.name}</p>

                      <p className="text-gray-500">{user.email}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                        {user.role}
                      </span>

                      <button
                        onClick={() => viewUser(user)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                      >
                        {selectedUser?._id === user._id ? "Hide" : "View"}
                      </button>
                    </div>
                  </div>

                  {/* Expanded user details */}
                  {selectedUser?._id === user._id && (
                    <div className="mt-5 p-5 bg-gray-50 border rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        User Details
                      </h3>

                      <div className="space-y-2">
                        <p>
                          <span className="font-medium">Name:</span>{" "}
                          {selectedUser.name}
                        </p>

                        <p>
                          <span className="font-medium">Email:</span>{" "}
                          {selectedUser.email}
                        </p>

                        <p>
                          <span className="font-medium">Role:</span>{" "}
                          {selectedUser.role}
                        </p>
                      </div>

                      {/* User Todos */}
                      <h4 className="text-lg font-semibold mt-6 mb-3">
                        User Todos
                      </h4>

                      {loadingUserTodos ? (
                        <p className="text-gray-500">Loading todos...</p>
                      ) : userTodos.length === 0 ? (
                        <p className="text-gray-500">This user has no todos.</p>
                      ) : (
                        <div className="space-y-3">
                          {userTodos.map((todo) => (
                            <div
                              key={todo._id}
                              className="bg-white p-4 rounded-lg border"
                            >
                              <div className="flex justify-between gap-3">
                                <div>
                                  <p className="font-semibold">{todo.title}</p>

                                  <p className="text-gray-500">
                                    {todo.description}
                                  </p>
                                </div>

                                <span
                                  className={
                                    todo.completed
                                      ? "text-green-600 font-medium"
                                      : "text-yellow-600 font-medium"
                                  }
                                >
                                  {todo.completed ? "Completed" : "Pending"}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ==============================
                    ALL TODOS
                ============================== */}

        <div className="bg-white rounded-xl shadow">
          <div className="p-5 border-b">
            <h2 className="text-xl font-semibold">All Todos</h2>

            <div className="mt-4 flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="Search todos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <select
                value={completed}
                onChange={(e) => setCompleted(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 outline-none"
              >
                <option value="">All</option>
                <option value="true">Completed</option>
                <option value="false">Pending</option>
              </select>

              <button
                onClick={getTodos}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
              >
                Search
              </button>
            </div>
          </div>

          {loadingTodos ? (
            <p className="p-5">Loading todos...</p>
          ) : (
            <div className="divide-y">
              {todos.map((todo) => (
                <div key={todo._id} className="p-5">
                  {/* ==============================
                                        TODO SUMMARY
                                    ============================== */}

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {todo.title}
                      </h3>

                      <p className="text-gray-500">{todo.description}</p>

                      <p className="text-sm text-gray-400 mt-1">
                        Owner: {todo.user?.name}
                      </p>

                      <p className="text-sm text-gray-400">
                        {todo.user?.email}
                      </p>
                    </div>

                    {/* ACTIONS */}

                    <div className="flex items-center gap-3">
                      {/* STATUS */}

                      <span
                        className={
                          todo.completed
                            ? "text-green-600 font-medium"
                            : "text-yellow-600 font-medium"
                        }
                      >
                        {todo.completed ? "Completed" : "Pending"}
                      </span>

                      {/* VIEW */}

                      <button
                        onClick={() => viewTodo(todo._id)}
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                      >
                        {selectedTodo?._id === todo._id ? "Hide" : "View"}
                      </button>

                      {/* DELETE */}

                      <button
                        onClick={() => deleteTodo(todo._id)}
                        className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* ==============================
                                        EXPANDED DETAILS
                                    ============================== */}

                  {selectedTodo?._id === todo._id && (
                    <div className="mt-5 p-5 bg-gray-50 border rounded-lg">
                      {loadingTodo ? (
                        <p>Loading details...</p>
                      ) : (
                        <>
                          <h4 className="text-lg font-semibold text-gray-800 mb-4">
                            Todo Details
                          </h4>

                          <div className="space-y-2 text-gray-600">
                            <p>
                              <span className="font-medium text-gray-800">
                                Title:
                              </span>{" "}
                              {selectedTodo.title}
                            </p>

                            <p>
                              <span className="font-medium text-gray-800">
                                Description:
                              </span>{" "}
                              {selectedTodo.description}
                            </p>

                            <p>
                              <span className="font-medium text-gray-800">
                                Owner:
                              </span>{" "}
                              {selectedTodo.user?.name}
                            </p>

                            <p>
                              <span className="font-medium text-gray-800">
                                Email:
                              </span>{" "}
                              {selectedTodo.user?.email}
                            </p>

                            <p>
                              <span className="font-medium text-gray-800">
                                Status:
                              </span>{" "}
                              {selectedTodo.completed ? "Completed" : "Pending"}
                            </p>

                            <p>
                              <span className="font-medium text-gray-800">
                                Created:
                              </span>{" "}
                              {selectedTodo.createdAt
                                ? new Date(
                                    selectedTodo.createdAt,
                                  ).toLocaleString()
                                : "N/A"}
                            </p>

                            <p>
                              <span className="font-medium text-gray-800">
                                Updated:
                              </span>{" "}
                              {selectedTodo.updatedAt
                                ? new Date(
                                    selectedTodo.updatedAt,
                                  ).toLocaleString()
                                : "N/A"}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}

              <div className="flex justify-center items-center gap-4 p-5 border-t">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <span className="font-medium text-gray-700">
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
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
