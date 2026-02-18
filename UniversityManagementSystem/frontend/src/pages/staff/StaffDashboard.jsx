import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ApprovalList from '../../components/ApprovalList';
import BookingForm from '../../components/BookingForm';
import Carousel from '../../components/Carousel';
import { LogOut, ClipboardCheck, Briefcase, User, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';

const staffSlides = [
    { url: "https://images.unsplash.com/photo-1577896335477-fe3c5e4c0aa0?w=800&auto=format&fit=crop", title: "Faculty Meeting", caption: "Quarterly staff meeting this Friday at 3 PM." },
    { url: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=800&auto=format&fit=crop", title: "Research Grants", caption: "New funding opportunities available for STEM projects." },
    { url: "https://images.unsplash.com/photo-1574958269340-fa927503f3dd?w=800&auto=format&fit=crop", title: "Holiday Schedule", caption: "Campus closed for winter break starting Dec 20th." }
];

const StaffDashboard = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('approvals');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-2xl hidden md:flex flex-col z-10">
                <div className="p-8 border-b border-gray-100 flex items-center gap-3">
                    <div className="h-10 w-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                        <User className="text-white h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Staff</h1>
                        <p className="text-xs text-emerald-500 font-medium tracking-wide">PORTAL</p>
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-2 mt-4">
                    <button
                        onClick={() => setActiveTab('approvals')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === 'approvals' ? 'bg-emerald-50 text-emerald-600 shadow-sm translate-x-1' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                    >
                        <ClipboardCheck className={`w-5 h-5 transition-colors ${activeTab === 'approvals' ? 'text-emerald-600' : 'group-hover:text-gray-900'}`} />
                        <span className="font-medium">Approvals</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('exam-duty')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === 'exam-duty' ? 'bg-emerald-50 text-emerald-600 shadow-sm translate-x-1' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                    >
                        <Briefcase className={`w-5 h-5 transition-colors ${activeTab === 'exam-duty' ? 'text-emerald-600' : 'group-hover:text-gray-900'}`} />
                        <span className="font-medium">Exam Duty</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('event-halls')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === 'event-halls' ? 'bg-emerald-50 text-emerald-600 shadow-sm translate-x-1' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                    >
                        <Calendar className={`w-5 h-5 transition-colors ${activeTab === 'event-halls' ? 'text-emerald-600' : 'group-hover:text-gray-900'}`} />
                        <span className="font-medium">Book Event Hall</span>
                    </button>
                </nav>
                <div className="p-4 border-t border-gray-100">
                    <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group">
                        <LogOut className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-end mb-6 pb-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 tracking-tight animate-fade-in-up">Hello, Staff Member!</h2>
                        <p className="text-gray-500 mt-2 animate-fade-in-up delay-75">Manage requests and view your duties.</p>
                    </div>
                </header>

                <div className="mb-8 h-64 w-full animate-fade-in-up delay-100">
                    <Carousel slides={staffSlides} autoSlideInterval={6000} />
                </div>

                <div className="animate-fade-in-up delay-150">
                    {activeTab === 'approvals' && (
                        <div className="space-y-6">
                            <ApprovalList role="STAFF" />
                        </div>
                    )}

                    {activeTab === 'exam-duty' && (
                        <div className="bg-white rounded-2xl p-8 shadow-sm">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Exam Duty Roster</h3>
                            <p className="text-gray-500">You currently have no assigned exam duties for this week.</p>
                        </div>
                    )}

                    {activeTab === 'event-halls' && (
                        <div className="max-w-3xl mx-auto">
                            <h3 className="text-xl font-bold text-gray-800 mb-6 px-2">Book Event Hall</h3>
                            <BookingForm onSuccess={() => {
                                toast.success("Hall booked successfully!");
                                // Optionally switch tabs or refresh list
                            }} />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default StaffDashboard;
