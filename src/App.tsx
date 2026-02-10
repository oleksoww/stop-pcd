import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { getCurrentUser } from './store';
import type { User } from './types';

export function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setTimeout(() => setLoading(false), 600);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-purple-950/50 to-gray-950">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500 to-white blur-xl opacity-30 animate-pulse" />
            <img
              src="https://i.ibb.co/DPsxDJGZ/stoppcd.png"
              alt="Stop PCD"
              className="relative w-24 h-24 rounded-full object-cover mx-auto mb-5 shadow-2xl shadow-red-500/30 border-2 border-white/20 animate-[float_3s_ease-in-out_infinite]"
            />
          </div>
          <h2 className="text-2xl font-black">
            <span className="text-white">Stop </span>
            <span className="pcd-text">PCD</span>
          </h2>
          <p className="text-gray-500 text-sm mt-2">Ładowanie portalu...</p>
          <div className="mt-6 flex justify-center gap-1">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full bg-red-500 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={(u) => setUser(u)} />;
  }

  return <Dashboard user={user} onLogout={() => setUser(null)} />;
}
