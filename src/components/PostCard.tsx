import { Link } from 'react-router-dom';
import { Flame, ThumbsUp } from 'lucide-react';
import { Post } from '../types/database.types';

interface PostCardProps {
    post: Post;
}

export default function PostCard({ post }: PostCardProps) {
    return (
        <Link to={`/post/${post.id}`} className="block group">
            <div className="relative overflow-hidden rounded-xl bg-[#242424] border border-white/10 transition-all hover:border-white/30 hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1">
                <div className="aspect-[4/5] overflow-hidden">
                    <img
                        src={post.image_url}
                        alt={post.caption || 'Post'}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-2">
                            {post.type === 'roast' ? (
                                <div className="flex items-center gap-1 text-orange-500 bg-black/50 px-2 py-1 rounded-lg backdrop-blur-sm">
                                    <Flame className="w-4 h-4" />
                                    <span className="text-sm font-bold">Roast</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1 text-blue-500 bg-black/50 px-2 py-1 rounded-lg backdrop-blur-sm">
                                    <ThumbsUp className="w-4 h-4" />
                                    <span className="text-sm font-bold">Vote</span>
                                </div>
                            )}
                        </div>

                        {post.type === 'vote' && post.vote_average !== undefined && (
                            <div className="flex items-center gap-1 font-bold text-lg bg-black/50 px-2 py-1 rounded-lg backdrop-blur-sm">
                                <span className={post.vote_average >= 7 ? 'text-green-400' : post.vote_average >= 4 ? 'text-yellow-400' : 'text-red-400'}>
                                    {post.vote_average.toFixed(1)}
                                </span>
                                <span className="text-xs text-gray-400">/10</span>
                            </div>
                        )}
                    </div>

                    {post.caption && (
                        <p className="mt-2 text-sm text-gray-200 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                            {post.caption}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}
