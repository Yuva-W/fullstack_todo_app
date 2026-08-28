import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from 'react-router-dom';


function Dashboard() {
    const navigate = useNavigate();

    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(true);

    const getTodos = async () => {
        try {
            const response = await api.get("/todos");

            console.log(response.data);

            setTodos(response.data.todos);
        } catch (error) {
            console.log(error.response?.data || error.message);
        } finally{
            setLoading(false);
        }
    };

    useEffect(() => {
        getTodos();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post("/todos",{
                title,
                description
            });

            console.log(response.data);

            setTitle("");
            setDescription("");
            
            getTodos();
        } catch (error) {
            console.log(error.response?.data || error.message);
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    }

    const editTodo = async (todo) => {
            const title = prompt("Enter new  title", todo.title);
            const description = prompt("Enter new  description", todo.description);

            if(!title) return;

        try {
            await api.patch(`/todos/${todo._id}`,{
                title,
                description
            });

            getTodos();
        } catch (error) {
            console.log(error.response?.data || error.message);
        }
    }

    const toggleTodo = async (todo) => {
        try {
            await api.patch(`/todos/${todo._id}`, {
                completed: !todo.completed
            });

            getTodos();
        } catch (error) {
            console.log(error.response?.data || error.message);
        }
    };

    const deleteTodo = async (id) => {
        try {
            await api.delete(`/todos/${id}`);

            getTodos();
        } catch (error) {
            console.log(error.response?.data || error.message);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return(
        <div className="min-h-screen bg-gray-100 p-6">

            <div className="max-w-5xl mx-auto">

                <div className="flex items-center justify-between mb-6 px-5">

                    <h1 className="text-3xl font-bold text-gray-800">
                        My Todos
                    </h1>

                    <button 
                        onClick={handleLogout}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                        Logout
                    </button>

                </div>

                {/* add todo form  */}
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow mb-8 ">
                    <h2 className="text-xl font-semibold mb-4">Add Todo</h2>

                    <input 
                        type="text" 
                        placeholder="Todo title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 outline-none focus:ring-2 focus:ring-blue-500" 
                    />

                    <textarea 
                        placeholder="todo description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                    />

                    <button 
                        type="submit"
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Add Todo
                    </button>

                </form>

                {/* display all todos */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                    {todos.map((todo) => (
                        <div 
                            key={todo._id}
                            className="bg-white p-5 rounded-xl shadow"
                        >
                            <h2 className="text-xl font-semibold text-gray-800">
                                {todo.title}
                            </h2>

                            <p className="text-gray-500 mt-2">
                                {todo.description}
                            </p>

                            <p className={`mt-4 text-sm font-medium ${
                                todo.completed ? 'text-green-600' : 'text-yellow-600'
                            }`}
                            >
                                {todo.completed ? "Completed" : "Pending"}
                            </p>

                        <div className="flex gap-2 mt-4">

                            <button 
                                onClick={() => editTodo(todo)}
                                className="px-3 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-700"
                            >
                                Edit
                            </button>

                            <button 
                                onClick={() => toggleTodo(todo)}
                                className="px-3 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-700"
                            >
                                {todo.completed ? "Undo" : "Complete"}
                            </button>

                            <button 
                                onClick={() => deleteTodo(todo._id)}
                                className="px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-700"
                            >
                                Delete
                            </button>

                        </div>

                        </div>
                    ))}

                </div>

            </div>

        </div>
    )
}

export default Dashboard;
