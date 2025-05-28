import React from 'react';
import { GraduationCap } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-black">
      <header className="bg-black/90 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-cyan-400" />
              <span className="ml-2 text-xl font-bold text-cyan-400">new_attendance</span>
            </div>
            <nav className="flex items-center space-x-4">
              <a href="#" className="text-gray-300 hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </a>
              <a href="#" className="text-gray-300 hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium">
                About
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-cyan-400 mb-4">
            Smart Attendance System
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Simplified attendance tracking for educational institutions
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-cyan-500 hover:bg-cyan-600 text-black font-medium py-2 px-6 rounded-lg transition-colors">
              Student Login
            </button>
            <button className="border border-cyan-500 text-cyan-500 hover:bg-cyan-500/10 font-medium py-2 px-6 rounded-lg transition-colors">
              Lecturer Login
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;