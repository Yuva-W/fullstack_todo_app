function UserDetails({ user, todos, loading }) {

    return (
        <div className="mt-5 p-5 bg-gray-50 border rounded-lg">

            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                User Details
            </h3>

            <div className="space-y-2">

                <p>
                    <span className="font-medium">Name:</span>{" "}
                    {user.name}
                </p>

                <p>
                    <span className="font-medium">Email:</span>{" "}
                    {user.email}
                </p>

                <p>
                    <span className="font-medium">Role:</span>{" "}
                    {user.role}
                </p>

            </div>

            <h4 className="text-lg font-semibold mt-6 mb-3">
                User Todos
            </h4>

            {loading ? (
                <p className="text-gray-500">
                    Loading todos...
                </p>
            ) : todos.length === 0 ? (
                <p className="text-gray-500">
                    This user has no todos.
                </p>
            ) : (
                <div className="space-y-3">

                    {todos.map((todo) => (
                        <div
                            key={todo._id}
                            className="bg-white p-4 rounded-lg border"
                        >
                            <div className="flex justify-between gap-3">

                                <div>
                                    <p className="font-semibold">
                                        {todo.title}
                                    </p>

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
                                    {todo.completed
                                        ? "Completed"
                                        : "Pending"}
                                </span>

                            </div>
                        </div>
                    ))}

                </div>
            )}
        </div>
    );
}

export default UserDetails;