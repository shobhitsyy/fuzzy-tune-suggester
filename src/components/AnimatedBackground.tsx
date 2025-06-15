
import React from "react";

const AnimatedBackground = () => (
  <div className="absolute inset-0 pointer-events-none">
    {/* Large floating music notes */}
    <div className="absolute top-20 left-10 text-6xl opacity-10 animate-pulse text-purple-400">♪</div>
    <div className="absolute top-40 right-16 text-4xl opacity-15 animate-bounce text-pink-400">♫</div>
    <div className="absolute bottom-32 left-20 text-5xl opacity-12 animate-pulse text-blue-400">♬</div>

    {/* Gradient orbs */}
    <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-purple-300/30 to-blue-300/30 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-br from-pink-300/30 to-purple-300/30 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full blur-2xl"></div>
  </div>
);

export default AnimatedBackground;
