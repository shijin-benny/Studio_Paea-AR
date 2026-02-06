export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-white via-neutral-50/30 to-white backdrop-blur-sm relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(0,0,0) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      
      <div className="flex flex-col items-center gap-6 relative z-10">
        {/* Modern triple-ring spinner */}
        <div className="relative">
          <div className="w-20 h-20 border-2 border-neutral-200 rounded-full"></div>
          <div className="absolute inset-0 w-20 h-20 border-2 border-transparent border-t-neutral-900 border-r-neutral-900 rounded-full animate-spin" style={{ animationDuration: '1s' }}></div>
          <div className="absolute inset-2 w-16 h-16 border-2 border-transparent border-b-neutral-700 border-l-neutral-700 rounded-full animate-spin" style={{ animationDuration: '0.8s', animationDirection: 'reverse' }}></div>
          <div className="absolute inset-4 w-12 h-12 border-2 border-transparent border-t-neutral-600 border-r-neutral-600 rounded-full animate-spin" style={{ animationDuration: '0.6s' }}></div>
          <div className="absolute inset-6 w-8 h-8 bg-neutral-900/10 rounded-full animate-pulse-glow"></div>
        </div>
        
        {/* Animated dots with gradient */}
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 bg-neutral-900 rounded-full animate-bounce shadow-sm" style={{ animationDelay: '0ms', animationDuration: '1.2s' }}></div>
          <div className="w-2.5 h-2.5 bg-neutral-900 rounded-full animate-bounce shadow-sm" style={{ animationDelay: '200ms', animationDuration: '1.2s' }}></div>
          <div className="w-2.5 h-2.5 bg-neutral-900 rounded-full animate-bounce shadow-sm" style={{ animationDelay: '400ms', animationDuration: '1.2s' }}></div>
        </div>
        <p className="text-sm text-neutral-600 font-light tracking-wide">Loading gallery...</p>
      </div>
    </div>
  );
}
