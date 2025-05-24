import React from 'react';

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <main className="w-full bg-white rounded-lg shadow-lg">
        {children}
      </main>
    </div>
  );
}

export default AuthLayout;
