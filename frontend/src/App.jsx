import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css'
import SignUpPage from './pages/auth/signup/SignUpPage';
import LoginPage from './pages/auth/login/LoginPage';
import HomePage from './pages/home/HomePage';
import Sidebar from './components/common/Sidebar';
import RightPanel from './components/common/RightPanel';
import NotificationPage from './pages/notification/NotificationPage';
import ProfilePage from './pages/profile/ProfilePage';
import { Toaster } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from './components/common/LoadingSpinner';

function App() {
  const {data:authUser, isLoading } = useQuery({
    queryKey: ['authUser'],
    // we use queryKey to give a unique name to our query function and refer to it later 
    queryFn: async () => {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      if(data.error) return null;
      if (!response.ok) throw new Error(data.error || " Failed to fetch user data");
      console.log('Auth user: ', data);
      return data
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size='lg' />
      </div>
    )
  }
  return (
    <div className="flex max-w-6xl mx-auto">
      <Toaster />
     { authUser && <Sidebar />}
      <Routes>
        <Route path="/" element={ authUser ? <HomePage /> : <Navigate to={'/login'}/> } />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to={'/'} /> } />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={'/'} /> } />
        <Route path="/notifications" element={authUser ? <NotificationPage /> : <Navigate to={'/login'} />  } />
        <Route path="/profile/:username" element={authUser ? <ProfilePage /> : <Navigate to={'/login'} />} />
      </Routes>
      {authUser && <RightPanel />}
    </div>
  );
}

export default App
