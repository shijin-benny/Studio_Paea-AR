/** Light skeleton shown instantly when navigating to Architecture / Interiors / Landscape */
export default function Loading() {
  return (
    <div className="h-screen overflow-hidden bg-white flex flex-col" style={{ position: 'relative', zIndex: 1 }}>
      <div className="flex-1 min-h-0 flex items-center justify-center mt-[10vh]" style={{ height: '70vh' }}>
        <div className="w-full max-w-5xl h-full bg-neutral-100 animate-pulse rounded-none mx-2" />
      </div>
      <div className="flex-shrink-0 h-[14vh] bg-neutral-50 border-t border-neutral-100 flex items-center justify-center">
        <div className="flex gap-1">
          <div className="w-12 h-12 bg-neutral-200 rounded-none animate-pulse" />
          <div className="w-12 h-12 bg-neutral-200 rounded-none animate-pulse" />
          <div className="w-12 h-12 bg-neutral-200 rounded-none animate-pulse" />
        </div>
      </div>
    </div>
  );
}
