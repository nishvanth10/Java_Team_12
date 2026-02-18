import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Calendar, Clock } from 'lucide-react';

const BookingForm = ({ onSuccess }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [halls, setHalls] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchHalls();
    }, []);

    const fetchHalls = async () => {
        setLoading(true);
        try {
            const response = await api.get('/halls');
            console.log("Fetched halls:", response.data);
            setHalls(response.data);
            if (response.data.length === 0) {
                toast.info("No halls found. Please ask an admin to add halls.");
            }
        } catch (error) {
            console.error("Error fetching halls:", error);
            toast.error("Failed to load halls. check console.");
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await api.post('/bookings', data);
            toast.success("Booking requested successfully!");
            reset();
            if (onSuccess) onSuccess();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                // Check if it's the specific conflict message
                if (error.response.data.message.includes("unavailable")) {
                    toast.error(error.response.data.message); // Show: Hall currently unavailable...
                } else {
                    toast.error("Failed: " + error.response.data.message);
                }
            } else {
                toast.error("Failed to submit booking request. Please check your connection.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold text-gray-800 tracking-tight">New Booking Request</h3>
                <div className="bg-indigo-50 p-2 rounded-full">
                    <Calendar className="h-6 w-6 text-indigo-600" />
                </div>
            </div>

            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold text-gray-700">Select Resource / Hall</label>
                    <button type="button" onClick={fetchHalls} className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                        Refresh List
                    </button>
                </div>
                <div className="relative">
                    <select
                        {...register('hallId', { required: 'Please select a hall' })}
                        className="appearance-none block w-full pl-4 pr-10 py-3 text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                        disabled={halls.length === 0}
                    >
                        <option value="">{halls.length === 0 ? "No halls available" : "-- Choose a Hall --"}</option>
                        {halls.map(hall => (
                            <option key={hall.id} value={hall.id}>{hall.name} ({hall.type}) - Cap: {hall.capacity}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                    </div>
                </div>
                {halls.length === 0 && (
                    <div className="mt-2 p-3 bg-amber-50 rounded-lg text-xs text-amber-700 border border-amber-100 flex items-start gap-2">
                        <span>⚠️</span>
                        <div>
                            <strong>No halls found in the system.</strong>
                            <p>If you are an admin, please go to the Admin Dashboard to add halls. If you are a student, please contact support.</p>
                        </div>
                    </div>
                )}
                {errors.hallId && <span className="text-red-500 text-xs mt-1 font-medium">{errors.hallId.message}</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date & Time</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="datetime-local"
                            {...register('startTime', { required: 'Start time is required' })}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white sm:text-sm"
                        />
                    </div>
                    {errors.startTime && <span className="text-red-500 text-xs mt-1 font-medium">{errors.startTime.message}</span>}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">End Date & Time</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Clock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="datetime-local"
                            {...register('endTime', { required: 'End time is required' })}
                            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white sm:text-sm"
                        />
                    </div>
                    {errors.endTime && <span className="text-red-500 text-xs mt-1 font-medium">{errors.endTime.message}</span>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Purpose of Booking</label>
                <textarea
                    rows="3"
                    {...register('purpose', { required: 'Please specify a purpose' })}
                    className="block w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white sm:text-sm resize-none"
                    placeholder="E.g., Computer Science Club Meeting, Study Group..."
                ></textarea>
                {errors.purpose && <span className="text-red-500 text-xs mt-1 font-medium">{errors.purpose.message}</span>}
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
                {loading ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Processing Request...
                    </span>
                ) : 'Submit Booking Request'}
            </button>
        </form>
    );
};

export default BookingForm;
