import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Post, Comment } from '../types/database.types';
import { useAuth } from '../context/AuthProvider';
import { Loader2, Send, Flame, ThumbsUp, ArrowLeft } from 'lucide-react';

export default function PostDetail() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [userVote, setUserVote] = useState<number | null>(null);
    const [voteAverage, setVoteAverage] = useState<number>(0);

    useEffect(() => {
        if (id) fetchPostData();
    }, [id]);

    const fetchPostData = async () => {
        try {
            // Fetch post
            const { data: postData, error: postError } = await supabase
                .from('posts')
                .select('*')
                .eq('id', id)
                .single();

            if (postError) throw postError;
            setPost(postData);

            // Fetch comments
            const { data: commentsData } = await supabase
                .from('comments')
                .select('*')
                .eq('post_id', id)
                .order('created_at', { ascending: true });

            setComments(commentsData || []);

            // Fetch votes if it's a vote type
            if (postData.type === 'vote') {
                const { data: votesData } = await supabase
                    .from('votes')
                    .select('rating, user_id')
                    .eq('post_id', id);

                if (votesData) {
                    const ratings = votesData.map(v => v.rating);
                    const sum = ratings.reduce((a, b) => a + b, 0);
                    setVoteAverage(ratings.length ? sum / ratings.length : 0);

                    if (user) {
                        const myVote = votesData.find(v => v.user_id === user.id);
                        if (myVote) setUserVote(myVote.rating);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching post:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newComment.trim() || !post) return;

        try {
            const { error } = await supabase
                .from('comments')
                .insert({
                    post_id: post.id,
                    user_id: user.id,
                    content: newComment.trim(),
                });

            if (error) throw error;
            setNewComment('');
            fetchPostData();
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };

    const handleVote = async (rating: number) => {
        if (!user || !post) return;

        try {
            const { error } = await supabase
                .from('votes')
                .upsert({
                    post_id: post.id,
                    user_id: user.id,
                    rating,
                }, { onConflict: 'user_id,post_id' });

            if (error) throw error;
            setUserVote(rating);
            fetchPostData();
        } catch (error) {
            console.error('Error voting:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        );
    }

    if (!post) {
        return <div className="text-center py-20">Post not found</div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
                Back
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image Section */}
                <div className="space-y-4">
                    <div className="rounded-xl overflow-hidden border border-white/10 bg-[#242424]">
                        <img
                            src={post.image_url}
                            alt={post.caption || 'Post'}
                            className="w-full h-auto"
                        />
                    </div>

                    {post.type === 'vote' && (
                        <div className="bg-[#242424] p-6 rounded-xl border border-white/10 text-center">
                            <div className="text-4xl font-bold mb-2 text-blue-500">
                                {voteAverage.toFixed(1)}
                                <span className="text-lg text-gray-400 ml-1">/10</span>
                            </div>
                            <p className="text-gray-400 mb-6">Average Rating</p>

                            {user ? (
                                <div className="flex justify-center gap-2 flex-wrap">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                        <button
                                            key={num}
                                            onClick={() => handleVote(num)}
                                            className={`w-8 h-8 rounded-full font-bold transition-all ${userVote === num
                                                ? 'bg-blue-500 text-white scale-110'
                                                : 'bg-white/5 text-gray-400 hover:bg-white/20'
                                                }`}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">Log in to vote</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Comments/Roasts Section */}
                <div className="flex flex-col h-[600px] bg-[#242424] rounded-xl border border-white/10">
                    <div className="p-4 border-b border-white/10">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            {post.type === 'roast' ? (
                                <>
                                    <Flame className="w-6 h-6 text-orange-500" />
                                    Roasts
                                </>
                            ) : (
                                <>
                                    <ThumbsUp className="w-6 h-6 text-blue-500" />
                                    Comments
                                </>
                            )}
                        </h2>
                        {post.caption && (
                            <p className="mt-2 text-gray-300 text-sm">{post.caption}</p>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {comments.length === 0 ? (
                            <div className="text-center text-gray-500 py-10">
                                No comments yet. Be the first!
                            </div>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment.id} className="bg-black/20 p-3 rounded-lg">
                                    <p className="text-gray-200">{comment.content}</p>
                                    <span className="text-xs text-gray-500 mt-1 block">
                                        {new Date(comment.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>

                    {user ? (
                        <form onSubmit={handleComment} className="p-4 border-t border-white/10">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder={post.type === 'roast' ? "Roast 'em hard..." : "Add a comment..."}
                                    className="flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-white/30 transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={!newComment.trim()}
                                    className="p-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="p-4 text-center border-t border-white/10 text-gray-500 text-sm">
                            Log in to participate
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
