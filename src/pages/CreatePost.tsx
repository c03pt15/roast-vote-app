import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthProvider';
import { Upload, X, Loader2, Flame, ThumbsUp } from 'lucide-react';

export default function CreatePost() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [caption, setCaption] = useState('');
    const [type, setType] = useState<'roast' | 'vote'>('roast');
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !user) return;

        setLoading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${user.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('posts')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('posts')
                .getPublicUrl(filePath);

            const { error: dbError } = await supabase
                .from('posts')
                .insert({
                    user_id: user.id,
                    image_url: publicUrl,
                    caption,
                    type,
                });

            if (dbError) throw dbError;

            navigate('/');
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Error creating post. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Create New Post</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Type Selection */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => setType('roast')}
                        className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${type === 'roast'
                                ? 'border-orange-500 bg-orange-500/10 text-orange-500'
                                : 'border-white/10 hover:border-white/30 text-gray-400'
                            }`}
                    >
                        <Flame className="w-8 h-8" />
                        <span className="font-bold text-lg">Roast Me</span>
                        <span className="text-sm opacity-70">Ask for brutal honesty</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setType('vote')}
                        className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${type === 'vote'
                                ? 'border-blue-500 bg-blue-500/10 text-blue-500'
                                : 'border-white/10 hover:border-white/30 text-gray-400'
                            }`}
                    >
                        <ThumbsUp className="w-8 h-8" />
                        <span className="font-bold text-lg">Rate Me</span>
                        <span className="text-sm opacity-70">Get a 1-10 score</span>
                    </button>
                </div>

                {/* Image Upload */}
                <div
                    className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${preview ? 'border-white/20' : 'border-white/20 hover:border-white/40 cursor-pointer'
                        }`}
                    onClick={() => !preview && fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="image/*"
                        className="hidden"
                    />

                    {preview ? (
                        <div className="relative">
                            <img
                                src={preview}
                                alt="Preview"
                                className="max-h-[400px] mx-auto rounded-lg shadow-lg"
                            />
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setFile(null);
                                    setPreview(null);
                                }}
                                className="absolute -top-2 -right-2 p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors shadow-lg"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="py-12">
                            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                            <p className="text-lg font-medium">Click to upload an image</p>
                            <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 10MB</p>
                        </div>
                    )}
                </div>

                {/* Caption */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Caption (Optional)
                    </label>
                    <textarea
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-white/10 focus:border-white/30 outline-none transition-all resize-none h-32"
                        placeholder="What's on your mind?"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || !file}
                    className="w-full py-4 rounded-lg bg-white text-black font-bold text-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                    Post to {type === 'roast' ? 'Roast' : 'Vote'}
                </button>
            </form>
        </div>
    );
}
