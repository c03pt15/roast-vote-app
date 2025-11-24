import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { LogOut, PlusCircle, User as UserIcon, Flame } from 'lucide-react';

export default function Navbar() {
    const { user, signOut } = useAuth();

    return (
        <nav className="border-b border-white/10 bg-[#242424] sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                        <Flame className="w-8 h-8 text-orange-500" />
                        Roast & Vote
                    </Link>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <Link
                                    to="/create"
                                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-colors"
                                >
                                    <PlusCircle className="w-5 h-5" />
                                    <span className="hidden sm:inline">New Post</span>
                                </Link>

                                <div className="flex items-center gap-4 ml-4">
                                    <Link to="/profile" className="p-2 rounded-full hover:bg-white/10 transition-colors">
                                        <UserIcon className="w-6 h-6" />
                                    </Link>
                                    <button
                                        onClick={signOut}
                                        className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                                        title="Sign Out"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <Link
                                to="/auth"
                                className="px-6 py-2 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/20"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
