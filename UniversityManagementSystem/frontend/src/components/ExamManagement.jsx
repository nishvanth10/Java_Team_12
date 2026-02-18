import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { toast } from 'react-toastify';

const ExamManagement = () => {
    const { register, handleSubmit, reset } = useForm();
    const [halls, setHalls] = useState([]);
    const [exams, setExams] = useState([]);

    useEffect(() => {
        fetchHalls();
        fetchExams();
    }, []);

    const fetchHalls = async () => {
        try {
            // Mocking halls if endpoint missing
            setHalls([
                { id: '1', name: 'Lecture Hall 101', type: 'CLASSROOM' },
                { id: '2', name: 'Computer Lab A', type: 'LAB' },
                { id: '3', name: 'Main Auditorium', type: 'EVENT_HALL' },
            ]);
        } catch (e) { }
    };

    const fetchExams = async () => {
        try {
            const res = await api.get('/exams');
            setExams(res.data);
        } catch (e) { }
    };

    const onSubmit = async (data) => {
        try {
            await api.post('/exams', data);
            toast.success("Exam created successfully");
            reset();
            fetchExams();
        } catch (error) {
            toast.error("Failed to create exam");
        }
    };

    return (
        <div className="space-y-8">
            {/* Create Exam Form */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Create New Exam</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Exam Name</label>
                        <input {...register('name', { required: true })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date</label>
                        <input type="datetime-local" {...register('date', { required: true })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Hall</label>
                        <select {...register('hallId', { required: true })} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                            <option value="">Select Hall</option>
                            {halls.map(hall => <option key={hall.id} value={hall.id}>{hall.name}</option>)}
                        </select>
                    </div>
                    <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Create Exam</button>
                </form>
            </div>

            {/* Exam List */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Existing Exams</h3>
                <ul className="divide-y divide-gray-200">
                    {exams.map(exam => (
                        <li key={exam.id} className="py-4 flex justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-900">{exam.name}</p>
                                <p className="text-sm text-gray-500">{new Date(exam.date).toLocaleString()}</p>
                            </div>
                            <div className="text-sm text-gray-500">{exam.hall?.name}</div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ExamManagement;
