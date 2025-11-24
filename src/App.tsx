import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import Layout from './components/Layout';
import Home from './pages/Home';
import Auth from './pages/Auth';
import CreatePost from './pages/CreatePost';
import PostDetail from './pages/PostDetail';

import Profile from './pages/Profile';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/auth" element={<Auth />} />
                        <Route path="/create" element={<CreatePost />} />
                        <Route path="/post/:id" element={<PostDetail />} />
                        <Route path="/profile" element={<Profile />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
