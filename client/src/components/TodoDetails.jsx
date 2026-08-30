function TodoDetails({ todo, loading }) {

    if (loading) {
        return (
            <div className="mt-5 p-5 bg-gray-50 border rounded-lg">
                <p>Loading details...</p>
            </div>
        );
    }

    return (
        <div className="mt-5 p-5 bg-gray-50 border rounded-lg">

            <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Todo Details
            </h4>

            <div className="space-y-2 text-gray-600">

                <p>
                    <span className="font-medium text-gray-800">
                        Title:
                    </span>{" "}
                    {todo.title}
                </p>

                <p>
                    <span className="font-medium text-gray-800">
                        Description:
                    </span>{" "}
                    {todo.description}
                </p>

                <p>
                    <span className="font-medium text-gray-800">
                        Owner:
                    </span>{" "}
                    {todo.user?.name}
                </p>

                <p>
                    <span className="font-medium text-gray-800">
                        Email:
                    </span>{" "}
                    {todo.user?.email}
                </p>

                <p>
                    <span className="font-medium text-gray-800">
                        Status:
                    </span>{" "}
                    {todo.completed ? "Completed" : "Pending"}
                </p>

                <p>
                    <span className="font-medium text-gray-800">
                        Created:
                    </span>{" "}
                    {todo.createdAt
                        ? new Date(todo.createdAt).toLocaleString()
                        : "N/A"}
                </p>

                <p>
                    <span className="font-medium text-gray-800">
                        Updated:
                    </span>{" "}
                    {todo.updatedAt
                        ? new Date(todo.updatedAt).toLocaleString()
                        : "N/A"}
                </p>

            </div>
        </div>
    );
}

export default TodoDetails;