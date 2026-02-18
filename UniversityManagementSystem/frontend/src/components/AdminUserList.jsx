import { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Unlock } from 'lucide-react';

const AdminUserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data);
        } catch (error) {
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const unlockUser = async (userId) => {
        try {
            await api.put(`/admin/users/${userId}/unlock`);
            toast.success("User unlocked successfully");
            fetchUsers();
        } catch (error) {
            toast.error("Failed to unlock user");
        }
    };

    const approveReset = async (userId) => {
        try {
            await api.put(`/admin/users/${userId}/approve-reset`);
            toast.success("Password reset approved. New password: Default@123");
            fetchUsers();
        } catch (error) {
            toast.error("Failed to approve reset");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">User Management</h3>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {users.map(user => (
                        <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {user.locked ? (
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Locked</span>
                                ) : user.passwordResetRequested ? (
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Reset Requested</span>
                                ) : (
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                {user.locked && (
                                    <button
                                        onClick={() => unlockUser(user.id)}
                                        className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                                    >
                                        <Unlock className="w-4 h-4 mr-1" /> Unlock
                                    </button>
                                )}
                                {user.passwordResetRequested && (
                                    <button
                                        onClick={() => approveReset(user.id)}
                                        className="text-green-600 hover:text-green-900 inline-flex items-center ml-2"
                                    >
                                        Approve Reset
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUserList;
