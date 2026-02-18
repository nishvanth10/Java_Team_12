import { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Check, X } from 'lucide-react';

const ApprovalList = ({ role }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPendingBookings();
    }, []);

    const fetchPendingBookings = async () => {
        try {
            const response = await api.get('/bookings'); // Fetch all bookings
            // Filter based on role logic if backend returns all
            // For Staff: View PENDING
            // For Admin: View APPROVED_STAFF (or PENDING if they can skip staff)

            let pending = response.data;
            if (role === 'STAFF') {
                pending = pending.filter(b => b.status === 'PENDING');
            } else if (role === 'ADMIN') {
                pending = pending.filter(b => b.status === 'APPROVED_STAFF' || b.status === 'PENDING');
            }
            setBookings(pending);
        } catch (error) {
            toast.error("Failed to load bookings");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        try {
            let status = action;
            if (action === 'approve') {
                status = role === 'ADMIN' ? 'APPROVED_ADMIN' : 'APPROVED_STAFF';
            }

            await api.put(`/bookings/${id}/status`, null, { params: { status } });
            toast.success(`Booking ${action}d successfully`);
            fetchPendingBookings();
        } catch (error) {
            console.error(error);
            toast.error(`Failed to ${action} booking`);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 animate-fade-in-up">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    Pending Approvals
                    <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full">{bookings.length}</span>
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 bg-gray-50/30">
                            <th className="px-6 py-4 font-semibold">User</th>
                            <th className="px-6 py-4 font-semibold">Resource / Hall</th>
                            <th className="px-6 py-4 font-semibold">Schedule</th>
                            <th className="px-6 py-4 font-semibold">Purpose</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {bookings.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="bg-gray-50 p-3 rounded-full">
                                            <Check className="h-6 w-6 text-gray-300" />
                                        </div>
                                        <p>No pending requests at this time.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            bookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{booking.user?.username}</div>
                                        <div className="text-xs text-gray-400">{booking.user?.email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <span className="font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded text-xs">{booking.hall?.type}</span>
                                        <div className="mt-1">{booking.hall?.name}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <div className="flex flex-col gap-1">
                                            <span className="whitespace-nowrap">From: {new Date(booking.startTime).toLocaleString()}</span>
                                            <span className="whitespace-nowrap">To: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{new Date(booking.endTime).toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={booking.purpose}>
                                        {booking.purpose}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <div className="flex justify-end gap-2 opacity-100 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleAction(booking.id, 'approve')}
                                                className="flex items-center gap-1 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border border-green-200 shadow-sm hover:shadow active:scale-95"
                                            >
                                                <Check className="h-3 w-3" /> Approve
                                            </button>
                                            <button
                                                onClick={() => handleAction(booking.id, 'REJECTED')}
                                                className="flex items-center gap-1 bg-white text-red-600 hover:bg-red-50 hover:text-red-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border border-red-200 shadow-sm hover:shadow active:scale-95"
                                            >
                                                <X className="h-3 w-3" /> Reject
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ApprovalList;
