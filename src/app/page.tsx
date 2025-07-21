"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import {
  MessageCircle,
  Video,
  Users,
  Shield,
  Smartphone,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If user is signed in, redirect to dashboard
    if (isLoaded && isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, isLoaded, router]);

  // Show loading or redirect if user is signed in
  if (!isLoaded || isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
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

      <div className="bg-slate-800/30 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-12 max-w-4xl mx-4 text-center relative z-10 animate-fade-in shadow-2xl">
        {/* Logo/Brand */}
        <div className="mb-8">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Echo Verse
            </h1>
          </div>
          <p className="text-xl text-gray-300 font-medium">
            Connect Beyond Words
          </p>
        </div>

        {/* Main Content */}
        <div className="mb-12">
          <h2 className="text-5xl font-extrabold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              Where Conversations{" "}
            </span>
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Come Alive
            </span>
          </h2>

          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Experience seamless real-time messaging and crystal-clear video
            calls. Connect with friends, create communities, and share moments
            that matter.
          </p>

          {/* Feature highlights */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-slate-800/40 backdrop-blur-lg border border-slate-600/50 rounded-2xl p-6 hover:bg-slate-700/40 transition-all duration-300 hover:border-cyan-500/30 group">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">
                Instant Messaging
              </h3>
              <p className="text-gray-400 text-sm">
                Lightning-fast real-time chat with friends and communities
              </p>
            </div>

            <div className="bg-slate-800/40 backdrop-blur-lg border border-slate-600/50 rounded-2xl p-6 hover:bg-slate-700/40 transition-all duration-300 hover:border-green-500/30 group">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Video className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">HD Video Calls</h3>
              <p className="text-gray-400 text-sm">
                Crystal clear video and audio communication
              </p>
            </div>

            <div className="bg-slate-800/40 backdrop-blur-lg border border-slate-600/50 rounded-2xl p-6 hover:bg-slate-700/40 transition-all duration-300 hover:border-purple-500/30 group">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Communities</h3>
              <p className="text-gray-400 text-sm">
                Create and join vibrant communities
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="space-y-4">
          <Link
            href="/sign-in"
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 px-12 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <MessageCircle className="w-6 h-6 relative z-10" />
            <span className="relative z-10">Start Chatting Now</span>
          </Link>

          <p className="text-gray-400 text-sm">
            Join thousands of users already connecting on Echo Verse
          </p>
        </div>

        {/* Additional Info */}
        <div className="mt-12 pt-8 border-t border-slate-600/50">
          <div className="flex flex-wrap justify-center items-center space-x-8 text-gray-400">
            <div className="flex items-center space-x-2 mb-4 hover:text-cyan-400 transition-colors">
              <Shield className="w-5 h-5" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center space-x-2 mb-4 hover:text-green-400 transition-colors">
              <Smartphone className="w-5 h-5" />
              <span>Responsive Design</span>
            </div>
            <div className="flex items-center space-x-2 mb-4 hover:text-purple-400 transition-colors">
              <Zap className="w-5 h-5" />
              <span>Lightning Fast</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
