import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Post } from '../types/database.types';
import PostCard from '../components/PostCard';
import { Loader2, Flame } from 'lucide-react';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'roast' | 'vote'>('all');

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('posts')
        .select(`
          *,
          votes (rating)
        `)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('type', filter);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Calculate averages for vote posts
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
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-6 py-2 rounded-full font-medium transition-all ${filter === 'all'
            ? 'bg-white text-black'
            : 'bg-[#242424] text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
            }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('roast')}
          className={`px-6 py-2 rounded-full font-medium transition-all ${filter === 'roast'
            ? 'bg-orange-500 text-white'
            : 'bg-[#242424] text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
            }`}
        >
          Roasts
        </button>
        <button
          onClick={() => setFilter('vote')}
          className={`px-6 py-2 rounded-full font-medium transition-all ${filter === 'vote'
            ? 'bg-blue-500 text-white'
            : 'bg-[#242424] text-gray-400 hover:bg-[#2a2a2a] hover:text-white'
            }`}
        >
          Votes
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Flame className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p className="text-xl font-semibold mb-2">No posts yet</p>
          <p className="mb-8">Be the first to roast or vote!</p>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => window.location.href = '/create'}
              className="px-6 py-2 rounded-lg bg-white text-black font-bold hover:bg-gray-200 transition-colors"
            >
              Create Post
            </button>
          </div>
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
