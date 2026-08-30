function UserCard({ user, onView, isSelected, children }) {
    return (
        <div className="p-5 border-b">

            {/* User row */}

            <div className="flex items-center justify-between gap-4">

                <div>
                    <p className="font-semibold text-gray-800">
                        {user.name}
                    </p>

                    <p className="text-gray-500">
                        {user.email}
                    </p>
                </div>

                <div className="flex items-center gap-3">

                    <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                        {user.role}
                    </span>

                    <button
                        onClick={() => onView(user)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        {isSelected ? "Hide" : "View"}
                    </button>

                </div>

            </div>

            {/* Expanded content */}

            {isSelected && (
                <div className="mt-5">
                    {children}
                </div>
            )}

        </div>
    );
}

export default UserCard;