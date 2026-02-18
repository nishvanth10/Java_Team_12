import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';
import Carousel from '../../components/Carousel';
import { Users, BookOpen, Calendar, Edit, Save, X, Plus } from 'lucide-react';

const adminSlides = [
    { url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop", title: "System Status", caption: "All systems operational. Server maintenance scheduled for Sunday." },
    { url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop", title: "New Enrollment", caption: "Record number of applications received this semester." },
    { url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop", title: "Governance Board", caption: "Next board meeting agenda is now available." }
];

const AdminDashboard = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('exams'); // exams, allotments, users, bookings

    // Data States
    const [exams, setExams] = useState([]);
    const [allotments, setAllotments] = useState([]);
    const [users, setUsers] = useState([]);
    const [halls, setHalls] = useState([]);
    const [bookings, setBookings] = useState([]);

    // Edit States
    const [editingExam, setEditingExam] = useState(null);
    const [editingAllotment, setEditingAllotment] = useState(null);

    // New States
    const [newExam, setNewExam] = useState({ name: '', date: '', hallId: '' });
    const [newHall, setNewHall] = useState({ name: '', capacity: '', type: 'CLASSROOM' });
    const [newAllotment, setNewAllotment] = useState({ examId: '', studentId: '', seatNumber: '' });

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        try {
            if (activeTab === 'exams') {
                const [examsRes, hallsRes] = await Promise.all([
                    api.get('/exams'),
                    api.get('/halls')
                ]);
                setExams(examsRes.data);
                setHalls(hallsRes.data);
            } else if (activeTab === 'allotments') {
                const [allotmentsRes, studentsRes, examsRes] = await Promise.all([
                    api.get('/admin/allotments'),
                    api.get('/admin/users'), // Filtering for students usually, but getAllUsers is fine
                    api.get('/exams')
                ]);
                setAllotments(allotmentsRes.data);
                setUsers(studentsRes.data.filter(u => u.role === 'STUDENT'));
                setExams(examsRes.data);
            } else if (activeTab === 'users') {
                const res = await api.get('/admin/users');
                setUsers(res.data);
            } else if (activeTab === 'bookings') {
                const res = await api.get('/bookings');
                setBookings(res.data);
            } else if (activeTab === 'halls') {
                const res = await api.get('/halls');
                setHalls(res.data);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load data");
        }
    };

    // Hall Actions
    const handleCreateHall = async (e) => {
        e.preventDefault();
        try {
            await api.post('/halls', newHall);
            toast.success("Hall created!");
            setNewHall({ name: '', capacity: '', type: 'CLASSROOM' });
            fetchData();
        } catch (err) {
            toast.error("Failed to create hall");
        }
    };

    // Exam Actions
    const handleCreateExam = async (e) => {
        e.preventDefault();
        try {
            await api.post('/exams', newExam);
            toast.success("Exam created!");
            setNewExam({ name: '', date: '', hallId: '' });
            fetchData();
        } catch (err) {
            toast.error("Failed to create exam");
        }
    };

    const handleCreateAllotment = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/exams/allot', newAllotment);
            toast.success("Seat allotted successfully!");
            setNewAllotment({ examId: '', studentId: '', seatNumber: '' });
            fetchData();
        } catch (err) {
            toast.error("Failed to allot seat");
        }
    };

    const handleUpdateExam = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/exams/${editingExam.id}`, {
                name: editingExam.name,
                date: editingExam.date,
                hallId: editingExam.hall.id
            });
            toast.success("Exam updated!");
            setEditingExam(null);
            fetchData();
        } catch (err) {
            toast.error("Failed to update exam");
        }
    };

    // Allotment Actions
    const handleUpdateAllotment = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/admin/allotments/${editingAllotment.id}`, {
                examId: editingAllotment.exam.id,
                studentId: editingAllotment.student.id,
                seatNumber: editingAllotment.seatNumber
            });
            toast.success("Allotment updated!");
            setEditingAllotment(null);
            fetchData();
        } catch (err) {
            toast.error("Failed to update allotment");
        }
    };

    const handleBookingStatus = async (id, status) => {
        try {
            await api.put(`/bookings/${id}/status`, null, { params: { status } });
            toast.success(`Booking ${status}`);
            fetchData();
        } catch (err) {
            toast.error(`Failed to update booking`);
        }
    };

    const handleUnlockUser = async (userId) => {
        try {
            await api.put(`/admin/users/${userId}/unlock`);
            toast.success("User unlocked");
            fetchData();
        } catch (err) {
            toast.error("Failed to unlock user");
        }
    };

    const handleApproveReset = async (userId) => {
        try {
            await api.put(`/admin/users/${userId}/approve-reset`);
            toast.success("Password reset approved");
            fetchData();
        } catch (err) {
            toast.error("Failed to approve reset");
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-indigo-600">Admin Dashboard</h1>
                <button onClick={handleLogout} className="text-gray-600 hover:text-red-500 font-medium">Logout</button>
            </nav>

            <div className="flex-1 p-8 max-w-7xl mx-auto w-full">

                <div className="mb-8 h-64 w-full rounded-2xl overflow-hidden shadow-lg">
                    <Carousel slides={adminSlides} autoSlideInterval={5000} />
                </div>

                {/* Tabs */}
                <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
                    <button
                        onClick={() => setActiveTab('exams')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === 'exams' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                    >
                        Exams
                    </button>
                    <button
                        onClick={() => setActiveTab('allotments')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === 'allotments' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                    >
                        Seating Arrangements
                    </button>
                    <button
                        onClick={() => setActiveTab('bookings')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === 'bookings' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                    >
                        Bookings
                    </button>
                    <button
                        onClick={() => setActiveTab('halls')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === 'halls' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                    >
                        Halls
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${activeTab === 'users' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                    >
                        Users
                    </button>
                </div>

                {/* Content */}
                <div className="bg-white rounded-xl shadow-sm p-6">

                    {/* EXAMS TAB */}
                    {activeTab === 'exams' && (
                        <div>
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><BookOpen className="h-5 w-5" /> Manage Exams</h2>

                            {/* Create Form */}
                            <form onSubmit={handleCreateExam} className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Exam Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border rounded-md"
                                        value={newExam.name}
                                        onChange={e => setNewExam({ ...newExam, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <input
                                        type="datetime-local"
                                        className="w-full px-3 py-2 border rounded-md"
                                        value={newExam.date}
                                        onChange={e => setNewExam({ ...newExam, date: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hall</label>
                                    <select
                                        className="w-full px-3 py-2 border rounded-md"
                                        value={newExam.hallId}
                                        onChange={e => setNewExam({ ...newExam, hallId: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Hall</option>
                                        {halls.map(h => <option key={h.id} value={h.id}>{h.name} ({h.type})</option>)}
                                    </select>
                                </div>
                                <button type="submit" className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                                    <Plus className="h-4 w-4" /> Create
                                </button>
                            </form>

                            {/* List */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="pb-3 text-sm font-semibold text-gray-600">Name</th>
                                            <th className="pb-3 text-sm font-semibold text-gray-600">Date</th>
                                            <th className="pb-3 text-sm font-semibold text-gray-600">Hall</th>
                                            <th className="pb-3 text-sm font-semibold text-gray-600">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {exams.map(exam => (
                                            <tr key={exam.id} className="hover:bg-gray-50">
                                                {editingExam?.id === exam.id ? (
                                                    // Editing Row
                                                    <>
                                                        <td className="py-3 px-2">
                                                            <input className="w-full border p-1 rounded" value={editingExam.name} onChange={e => setEditingExam({ ...editingExam, name: e.target.value })} />
                                                        </td>
                                                        <td className="py-3 px-2">
                                                            <input type="datetime-local" className="w-full border p-1 rounded" value={editingExam.date} onChange={e => setEditingExam({ ...editingExam, date: e.target.value })} />
                                                        </td>
                                                        <td className="py-3 px-2">
                                                            <select
                                                                className="w-full border p-1 rounded"
                                                                value={editingExam.hall.id}
                                                                onChange={e => setEditingExam({ ...editingExam, hall: { id: e.target.value } })}
                                                            >
                                                                {halls.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                                                            </select>
                                                        </td>
                                                        <td className="py-3 px-2 flex gap-2">
                                                            <button onClick={handleUpdateExam} className="text-green-600 hover:text-green-800"><Save className="h-5 w-5" /></button>
                                                            <button onClick={() => setEditingExam(null)} className="text-gray-500 hover:text-gray-700"><X className="h-5 w-5" /></button>
                                                        </td>
                                                    </>
                                                ) : (
                                                    // Display Row
                                                    <>
                                                        <td className="py-3">{exam.name}</td>
                                                        <td className="py-3">{new Date(exam.date).toLocaleString()}</td>
                                                        <td className="py-3">{exam.hall?.name}</td>
                                                        <td className="py-3">
                                                            <button onClick={() => setEditingExam(JSON.parse(JSON.stringify(exam)))} className="text-indigo-600 hover:text-indigo-800">
                                                                <Edit className="h-5 w-5" />
                                                            </button>
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ALLOTMENTS TAB */}
                    {activeTab === 'allotments' && (
                        <div>
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Users className="h-5 w-5" /> Seating Arrangements</h2>

                            {/* Create Allotment Form */}
                            <form onSubmit={handleCreateAllotment} className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Exam</label>
                                    <select
                                        className="w-full px-3 py-2 border rounded-md"
                                        value={newAllotment.examId}
                                        onChange={e => setNewAllotment({ ...newAllotment, examId: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Exam</option>
                                        {exams.map(ex => (
                                            <option key={ex.id} value={ex.id}>
                                                {ex.name} ({ex.hall?.name || 'No Hall'}) - {new Date(ex.date).toLocaleDateString()}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                                    <select
                                        className="w-full px-3 py-2 border rounded-md"
                                        value={newAllotment.studentId}
                                        onChange={e => setNewAllotment({ ...newAllotment, studentId: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Student</option>
                                        {users.filter(u => u.role === 'STUDENT').map(u => (
                                            <option key={u.id} value={u.id}>{u.username}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Seat Number</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border rounded-md"
                                        value={newAllotment.seatNumber}
                                        onChange={e => setNewAllotment({ ...newAllotment, seatNumber: e.target.value })}
                                        required
                                        placeholder="e.g. A-101"
                                    />
                                </div>
                                <button type="submit" className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                                    <Plus className="h-4 w-4" /> Allot Seat
                                </button>
                            </form>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="pb-3 text-sm font-semibold text-gray-600">Exam</th>
                                            <th className="pb-3 text-sm font-semibold text-gray-600">Hall / Class Room</th>
                                            <th className="pb-3 text-sm font-semibold text-gray-600">Student</th>
                                            <th className="pb-3 text-sm font-semibold text-gray-600">Seat Number</th>
                                            <th className="pb-3 text-sm font-semibold text-gray-600">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {allotments.map(allot => (
                                            <tr key={allot.id} className="hover:bg-gray-50">
                                                {editingAllotment?.id === allot.id ? (
                                                    <>
                                                        <td className="py-3 px-2">
                                                            <select
                                                                className="w-full border p-1 rounded"
                                                                value={editingAllotment.exam.id}
                                                                onChange={e => setEditingAllotment({ ...editingAllotment, exam: { id: e.target.value } })}
                                                            >
                                                                {exams.map(ex => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
                                                            </select>
                                                        </td>
                                                        <td className="py-3 px-2 text-gray-400 italic">
                                                            (Linked to Exam)
                                                        </td>
                                                        <td className="py-3 px-2">
                                                            <select
                                                                className="w-full border p-1 rounded"
                                                                value={editingAllotment.student.id}
                                                                onChange={e => setEditingAllotment({ ...editingAllotment, student: { id: e.target.value } })}
                                                            >
                                                                {users.filter(u => u.role === 'STUDENT').map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
                                                            </select>
                                                        </td>
                                                        <td className="py-3 px-2">
                                                            <input
                                                                className="w-full border p-1 rounded"
                                                                value={editingAllotment.seatNumber}
                                                                onChange={e => setEditingAllotment({ ...editingAllotment, seatNumber: e.target.value })}
                                                            />
                                                        </td>
                                                        <td className="py-3 px-2 flex gap-2">
                                                            <button onClick={handleUpdateAllotment} className="text-green-600 hover:text-green-800"><Save className="h-5 w-5" /></button>
                                                            <button onClick={() => setEditingAllotment(null)} className="text-gray-500 hover:text-gray-700"><X className="h-5 w-5" /></button>
                                                        </td>
                                                    </>
                                                ) : (
                                                    <>
                                                        <td className="py-3">{allot.exam?.name}</td>
                                                        <td className="py-3 px-2">
                                                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                                                                {allot.exam?.hall?.name || 'N/A'}
                                                            </span>
                                                        </td>
                                                        <td className="py-3">{allot.student?.username}</td>
                                                        <td className="py-3 font-mono text-gray-700">{allot.seatNumber}</td>
                                                        <td className="py-3">
                                                            <button onClick={() => setEditingAllotment(JSON.parse(JSON.stringify(allot)))} className="text-indigo-600 hover:text-indigo-800">
                                                                <Edit className="h-5 w-5" />
                                                            </button>
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'bookings' && (
                        <div>
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Calendar className="h-5 w-5" /> Resource Bookings</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead><tr className="border-b"><th className="pb-3 text-sm font-semibold text-gray-600">Resource</th><th className="pb-3 text-sm font-semibold text-gray-600">User</th><th className="pb-3 text-sm font-semibold text-gray-600">Time</th><th className="pb-3 text-sm font-semibold text-gray-600">Status</th><th className="pb-3 text-sm font-semibold text-gray-600">Actions</th></tr></thead>
                                    <tbody className="divide-y">
                                        {bookings.map(book => (
                                            <tr key={book.id} className="hover:bg-gray-50">
                                                <td className="py-3">{book.resourceName}</td>
                                                <td className="py-3">{book.user?.username}</td>
                                                <td className="py-3">{new Date(book.startTime).toLocaleString()} - {new Date(book.endTime).toLocaleString()}</td>
                                                <td className="py-3">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${book.status === 'APPROVED_ADMIN' ? 'bg-green-100 text-green-700' : book.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                        {book.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 flex gap-2">
                                                    {book.status !== 'APPROVED_ADMIN' && book.status !== 'REJECTED' && (
                                                        <>
                                                            <button onClick={() => handleBookingStatus(book.id, 'APPROVED_ADMIN')} className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded hover:bg-green-100 border border-green-200">Approve</button>
                                                            <button onClick={() => handleBookingStatus(book.id, 'REJECTED')} className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded hover:bg-red-100 border border-red-200">Reject</button>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* HALLS TAB */}
                    {activeTab === 'halls' && (
                        <div>
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Calendar className="h-5 w-5" /> Manage Halls</h2>

                            {/* Create Hall Form */}
                            <form onSubmit={handleCreateHall} className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hall Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border rounded-md"
                                        value={newHall.name}
                                        onChange={e => setNewHall({ ...newHall, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                                    <input
                                        type="number"
                                        className="w-full px-3 py-2 border rounded-md"
                                        value={newHall.capacity}
                                        onChange={e => setNewHall({ ...newHall, capacity: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select
                                        className="w-full px-3 py-2 border rounded-md"
                                        value={newHall.type}
                                        onChange={e => setNewHall({ ...newHall, type: e.target.value })}
                                        required
                                    >
                                        <option value="CLASSROOM">Classroom</option>
                                        <option value="LAB">Lab</option>
                                        <option value="EVENT_HALL">Event Hall</option>
                                    </select>
                                </div>
                                <button type="submit" className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                                    <Plus className="h-4 w-4" /> Add Hall
                                </button>
                            </form>

                            {/* Halls List */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="pb-3 text-sm font-semibold text-gray-600">Name</th>
                                            <th className="pb-3 text-sm font-semibold text-gray-600">Type</th>
                                            <th className="pb-3 text-sm font-semibold text-gray-600">Capacity</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {halls.map(hall => (
                                            <tr key={hall.id} className="hover:bg-gray-50">
                                                <td className="py-3">{hall.name}</td>
                                                <td className="py-3">{hall.type}</td>
                                                <td className="py-3">{hall.capacity}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* USERS TAB */}
                    {activeTab === 'users' && (
                        <div>
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Users className="h-5 w-5" /> Manage Users</h2>
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b">
                                        <th className="pb-3 text-sm font-semibold text-gray-600">Username</th>
                                        <th className="pb-3 text-sm font-semibold text-gray-600">Role</th>
                                        <th className="pb-3 text-sm font-semibold text-gray-600">Status</th>
                                        <th className="pb-3 text-sm font-semibold text-gray-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {users.map(user => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="py-3">{user.username}</td>
                                            <td className="py-3"><span className="px-2 py-1 bg-gray-100 rounded text-xs">{user.role}</span></td>
                                            <td className="py-3">
                                                {user.locked ? (
                                                    <span className="text-red-600 font-medium flex items-center gap-1"><X className="h-3 w-3" /> Locked</span>
                                                ) : user.passwordResetRequested ? (
                                                    <span className="text-yellow-600 font-medium flex items-center gap-1">Reset Requested</span>
                                                ) : (
                                                    <span className="text-green-600 font-medium">Active</span>
                                                )}
                                            </td>
                                            <td className="py-3 flex gap-2">
                                                {user.locked && (
                                                    <button onClick={() => handleUnlockUser(user.id)} className="text-sm bg-indigo-50 text-indigo-600 px-3 py-1 rounded hover:bg-indigo-100">
                                                        Unlock
                                                    </button>
                                                )}
                                                {user.passwordResetRequested && (
                                                    <button onClick={() => handleApproveReset(user.id)} className="text-sm bg-green-50 text-green-600 px-3 py-1 rounded hover:bg-green-100">
                                                        Approve Reset
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
