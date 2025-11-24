import { supabase } from '../lib/supabase';

const DEMO_POSTS = [
    {
        image_url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&q=80',
        caption: 'Rate my new haircut! 🐶',
        type: 'vote' as const,
    },
    {
        image_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&q=80',
        caption: 'Roast my setup... be gentle (or not)',
        type: 'roast' as const,
    },
    {
        image_url: 'https://images.unsplash.com/photo-1527082395-ef52744cd62e?w=800&q=80',
        caption: 'Is this outfit cringe? 1-10',
        type: 'vote' as const,
    },
    {
        image_url: 'https://images.unsplash.com/photo-1496345875659-11f7dd282d1d?w=800&q=80',
        caption: 'Trying to be aesthetic. Roast me.',
        type: 'roast' as const,
    },
    {
        image_url: 'https://images.unsplash.com/photo-1513721032312-6a18a47c8c3e?w=800&q=80',
        caption: 'Homemade pizza. Thoughts?',
        type: 'vote' as const,
    },
    {
        image_url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
        caption: 'Fashion expert or fashion disaster?',
        type: 'roast' as const,
    }
];

export const generateDemoData = async (userId: string) => {
    try {
        const posts = DEMO_POSTS.map(post => ({
            ...post,
            user_id: userId,
        }));

        const { error } = await supabase
            .from('posts')
            .insert(posts);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error generating demo data:', error);
        return false;
    }
};
