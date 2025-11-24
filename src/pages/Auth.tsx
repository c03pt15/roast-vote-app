import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Flame, Loader2 } from 'lucide-react';

export default function Auth() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                // Auto login after signup if configured, or show message
                if (!error) {
                    // Check if session is established (auto confirm disabled) or not
                    const { data: { session } } = await supabase.auth.getSession();
                    if (session) navigate('/');
                    else setError('Check your email for the confirmation link!');
                }
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                navigate('/');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center">
            <div className="w-full max-w-md p-8 space-y-8 bg-[#242424] rounded-2xl border border-white/10 shadow-2xl">
                <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-orange-500 to-red-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-orange-500/30">
                        <Flame className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        {isSignUp ? 'Create an account' : 'Welcome back'}
                    </h2>
                    <p className="mt-2 text-gray-400">
                        {isSignUp ? 'Join the roast community' : 'Sign in to start roasting'}
                    </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-6">
                    {error && (
                        <div className="p-3 text-sm text-red-200 bg-red-900/50 border border-red-800 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Email address
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-white/10 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-white/10 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                                placeholder="••••••••"
                                minLength={6}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold hover:opacity-90 transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            isSignUp ? 'Sign Up' : 'Sign In'
                        )}
                    </button>
                </form>

                <div className="text-center">
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        {isSignUp
                            ? 'Already have an account? Sign in'
                            : "Don't have an account? Sign up"}
                    </button>
                </div>
            </div>
        </div>
    );
}
