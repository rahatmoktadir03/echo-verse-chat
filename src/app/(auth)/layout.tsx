"use client";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern"></div>

        {/* Floating Tech Elements */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-green-500/5 to-teal-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Geometric shapes */}
        <div className="absolute top-32 right-32 w-24 h-24 border border-cyan-400/20 rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-40 left-40 w-16 h-16 border border-purple-400/20 rotate-12 animate-bounce delay-700"></div>

        {/* Particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400/40 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-purple-400/40 rounded-full animate-ping delay-300"></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-green-400/40 rounded-full animate-ping delay-700"></div>
      </div>

      {/* Auth Content Container */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-slate-800/30 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
          {/* Brand Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Echo Verse
              </h1>
            </div>
            <p className="text-gray-400 text-sm">
              Welcome back! Please sign in to continue
            </p>
          </div>

          {/* Auth Component */}
          <div className="[&_.cl-rootBox]:bg-transparent [&_.cl-card]:bg-transparent [&_.cl-card]:shadow-none [&_.cl-card]:border-0 [&_.cl-headerTitle]:text-white [&_.cl-headerSubtitle]:text-gray-400 [&_.cl-socialButtonsBlockButton]:bg-slate-700/50 [&_.cl-socialButtonsBlockButton]:border-slate-600 [&_.cl-socialButtonsBlockButton]:hover:bg-slate-600/50 [&_.cl-formFieldInput]:bg-slate-700/50 [&_.cl-formFieldInput]:border-slate-600 [&_.cl-formFieldInput]:text-white [&_.cl-formFieldLabel]:text-gray-300 [&_.cl-footerActionLink]:text-cyan-400 [&_.cl-footerActionLink]:hover:text-cyan-300 [&_.cl-formButtonPrimary]:bg-gradient-to-r [&_.cl-formButtonPrimary]:from-cyan-500 [&_.cl-formButtonPrimary]:to-blue-600 [&_.cl-formButtonPrimary]:hover:from-cyan-400 [&_.cl-formButtonPrimary]:hover:to-blue-500 [&_.cl-formButtonPrimary]:border-0 [&_.cl-formButtonPrimary]:shadow-lg [&_.cl-formButtonPrimary]:shadow-cyan-500/25">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
