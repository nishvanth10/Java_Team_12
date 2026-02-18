import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Lock, User, Shield, Mail, ChevronLeft, ChevronRight } from 'lucide-react';

const users = [
    {
        url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop",
        title: "Student Portal",
        caption: "Manage your courses, exams, and resources seamlessly."
    },
    {
        url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop",
        title: "Staff & Faculty",
        caption: "Streamline academic workflow and student approvals."
    },
    {
        url: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop",
        title: "Administrative Control",
        caption: "Efficiently manage campus resources and potential."
    },
];

const Carousel = ({ slides, autoSlide = true, autoSlideInterval = 5000 }) => {
    const [curr, setCurr] = useState(0);

    const prev = () => setCurr((curr) => (curr === 0 ? slides.length - 1 : curr - 1));
    const next = () => setCurr((curr) => (curr === slides.length - 1 ? 0 : curr + 1));

    useEffect(() => {
        if (!autoSlide) return;
        const slideInterval = setInterval(next, autoSlideInterval);
        return () => clearInterval(slideInterval);
    }, [curr, autoSlide, autoSlideInterval]);

    return (
        <div className="overflow-hidden relative group w-full h-full rounded-2xl shadow-xl">
            <div
                className="flex transition-transform ease-out duration-700 h-full"
                style={{ transform: `translateX(-${curr * 100}%)` }}
            >
                {slides.map((slide, index) => (
                    <div key={index} className="min-w-full h-full relative">
                        <img src={slide.url} alt={slide.caption} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 pb-12">
                            <h3 className="text-3xl font-bold text-white mb-2 transform transition-all duration-500 translate-y-0 opacity-100 drop-shadow-lg">{slide.title}</h3>
                            <p className="text-lg text-gray-200 drop-shadow-md">{slide.caption}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={prev} className="p-2 rounded-full bg-white/30 hover:bg-white/50 text-white backdrop-blur-sm transition-all shadow-lg hover:scale-110">
                    <ChevronLeft size={24} />
                </button>
                <button onClick={next} className="p-2 rounded-full bg-white/30 hover:bg-white/50 text-white backdrop-blur-sm transition-all shadow-lg hover:scale-110">
                    <ChevronRight size={24} />
                </button>
            </div>

            <div className="absolute bottom-6 right-0 left-0">
                <div className="flex items-center justify-center gap-2">
                    {slides.map((_, i) => (
                        <div
                            key={i}
                            className={`
              transition-all w-2 h-2 bg-white rounded-full shadow-sm
              ${curr === i ? "p-1.5 w-6 bg-indigo-500" : "bg-opacity-50"}
            `}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            if (isRegistering) {
                await api.post('/auth/register', data);
                toast.success("Registration successful! Please login.");
                setIsRegistering(false);
            } else if (isForgotPassword) {
                await api.post('/auth/forgot-password', { email: data.email });
                toast.success("Password reset requested. Contact admin for approval.");
                setIsForgotPassword(false);
            } else {
                const response = await api.post('/auth/login-response', {
                    email: data.email,
                    password: data.password
                });
                const { accessToken, role } = response.data;

                if (!accessToken || !role) throw new Error("Invalid response from server");

                login(accessToken, role);
                toast.success(`Welcome back!`);

                if (role === 'STUDENT') navigate('/student');
                else if (role === 'STAFF') navigate('/staff');
                else if (role === 'ADMIN') navigate('/admin');
                else navigate('/');
            }
        } catch (error) {
            console.error("Auth error:", error);
            if (!isRegistering && (error.response?.status === 401 || error.response?.status === 403)) {
                toast.error("Invalid credentials or account locked.");
            } else {
                toast.error(error.response?.data?.message || "Operation failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl overflow-hidden min-h-[600px] flex flex-col md:flex-row animate-fade-in-up">

                {/* Right Side - Carousel (on big screens) */}
                <div className="w-full md:w-1/2 bg-gray-900 h-64 md:h-auto relative">
                    <Carousel slides={users} />
                </div>

                {/* Left Side - Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full">
                        <div className="mb-8 text-center md:text-left">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                {isRegistering ? 'Create Account' : isForgotPassword ? 'Reset Password' : 'Welcome Back'}
                            </h2>
                            <p className="text-gray-500">
                                {isRegistering ? 'Join our academic community today.' : isForgotPassword ? 'Enter your email to request a reset.' : 'Please sign in to access your portal.'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                            {isRegistering && (
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700 ml-1">Username</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            {...register('username', { required: isRegistering ? 'Username is required' : false })}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                            placeholder="Choose a username"
                                        />
                                    </div>
                                    {errors.username && <span className="text-red-500 text-xs ml-1">{errors.username.message}</span>}
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-700 ml-1">{isRegistering ? 'Email' : 'Email or Username'}</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        {...register('email', { required: 'Email/Username is required' })}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        placeholder={isRegistering ? "john@university.edu" : "Enter your credentials"}
                                    />
                                </div>
                                {errors.email && <span className="text-red-500 text-xs ml-1">{errors.email.message}</span>}
                            </div>

                            {!isForgotPassword && (
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="password"
                                            {...register('password', { required: !isForgotPassword ? 'Password is required' : false })}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    {errors.password && <span className="text-red-500 text-xs ml-1">{errors.password.message}</span>}
                                </div>
                            )}

                            {isRegistering && (
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700 ml-1">Role</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Shield className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <select
                                            {...register('role', { required: 'Role is required' })}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none"
                                        >
                                            <option value="">Select Role</option>
                                            <option value="STUDENT">Student</option>
                                        </select>
                                    </div>
                                    {errors.role && <span className="text-red-500 text-xs ml-1">{errors.role.message}</span>}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Processing...
                                    </span>
                                ) : (isRegistering ? 'Create Account' : isForgotPassword ? 'Request Reset' : 'Sign In')}
                            </button>
                        </form>

                        <div className="mt-8 text-center pt-6 border-t border-gray-100">
                            <p className="text-gray-500 text-sm">
                                {isRegistering ? 'Already have an account?' : isForgotPassword ? 'Remember your password?' : "Don't have an account?"}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsRegistering(!isRegistering && !isForgotPassword);
                                        setIsForgotPassword(false);
                                    }}
                                    className="ml-2 text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
                                >
                                    {isRegistering || isForgotPassword ? 'Login here' : 'Register now'}
                                </button>
                            </p>
                            {!isRegistering && !isForgotPassword && (
                                <p className="mt-2 text-center">
                                    <button
                                        type="button"
                                        onClick={() => setIsForgotPassword(true)}
                                        className="text-sm text-indigo-600 hover:text-indigo-800"
                                    >
                                        Forgot Password?
                                    </button>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
