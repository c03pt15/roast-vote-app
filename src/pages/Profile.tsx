import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import { supabase } from '../lib/supabase';
import { Post } from '../types/database.types';
import PostCard from '../components/PostCard';
import { Loader2, User, LogOut } from 'lucide-react';

export default function Profile() {
    const { user, signOut } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        if (user) {
            fetchProfile();
            fetchUserPosts();
        }
    }, [user]);

    const fetchProfile = async () => {
        if (!user) return;
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
        setProfile(data);
    };

    const fetchUserPosts = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('posts')
                .select(`
          *,
          votes (rating)
        `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const postsWithStats = data?.map((post: any) => {
                if (post.type === 'vote' && post.votes) {
                    const ratings = post.votes.map((v: any) => v.rating);
                    const sum = ratings.reduce((a: number, b: number) => a + b, 0);
                    const avg = ratings.length ? sum / ratings.length : 0;
                    return { ...post, vote_average: avg, vote_count: ratings.length };
                }
                return post;
            });

            setPosts(postsWithStats || []);
        } catch (error) {
            console.error('Error fetching user posts:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-[#242424] rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 border border-white/10">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
                    {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
                    ) : (
                        <User className="w-16 h-16" />
                    )}
                </div>

                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold mb-2">{profile?.username || 'User'}</h1>
                    <p className="text-gray-400 mb-6">Joined {new Date(user.created_at).toLocaleDateString()}</p>

                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                        <div className="px-6 py-3 rounded-xl bg-black/20 border border-white/5">
                            <span className="block text-2xl font-bold text-white">{posts.length}</span>
                            <span className="text-sm text-gray-400">Posts</span>
                        </div>
                        <button
                            onClick={signOut}
                            className="px-6 py-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-colors flex items-center gap-2"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>

            <h2 className="text-2xl font-bold">My Posts</h2>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-20 text-gray-400 bg-[#242424] rounded-2xl border border-white/10">
                    <p>You haven't posted anything yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            )}
        </div>
    );
}
