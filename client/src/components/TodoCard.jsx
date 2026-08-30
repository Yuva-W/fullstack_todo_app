function TodoCard({
    todo,
    onView,
    onDelete,
    selectedTodo,
    loadingTodo
}) {
    const isSelected = selectedTodo?._id === todo._id;

    return (
        <div className="p-5 border-b">

            {/* Todo row */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>
                    <h3 className="font-semibold text-gray-800">
                        {todo.title}
                    </h3>

                    <p className="text-gray-500">
                        {todo.description}
                    </p>

                    <p className="text-sm text-gray-400 mt-1">
                        Owner: {todo.user?.name}
                    </p>

                    <p className="text-sm text-gray-400">
                        {todo.user?.email}
                    </p>
                </div>

                <div className="flex items-center gap-3">

                    <span
                        className={
                            todo.completed
                                ? "text-green-600 font-medium"
                                : "text-yellow-600 font-medium"
                        }
                    >
                        {todo.completed ? "Completed" : "Pending"}
                    </span>

                    <button
                        onClick={() => onView(todo._id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        {isSelected ? "Hide" : "View"}
                    </button>

                    <button
                        onClick={() => onDelete(todo._id)}
                        className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
                    >
                        Delete
                    </button>

                </div>
            </div>

            {/* Expanded details */}
            {isSelected && (
                <div className="mt-5 p-5 bg-gray-50 border rounded-lg">

                    {loadingTodo ? (
                        <p className="text-gray-500">
                            Loading details...
                        </p>
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
                                    {selectedTodo.completed
                                        ? "Completed"
                                        : "Pending"}
                                </p>

                                <p>
                                    <span className="font-medium text-gray-800">
                                        Created:
                                    </span>{" "}
                                    {selectedTodo.createdAt
                                        ? new Date(
                                              selectedTodo.createdAt
                                          ).toLocaleString()
                                        : "N/A"}
                                </p>

                                <p>
                                    <span className="font-medium text-gray-800">
                                        Updated:
                                    </span>{" "}
                                    {selectedTodo.updatedAt
                                        ? new Date(
                                              selectedTodo.updatedAt
                                          ).toLocaleString()
                                        : "N/A"}
                                </p>

                            </div>
                        </>
                    )}

                </div>
            )}
        </div>
    );
}

export default TodoCard;