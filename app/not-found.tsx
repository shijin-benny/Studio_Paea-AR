import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="pt-20 min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="font-serif text-6xl md:text-8xl font-light mb-4 text-neutral-900">404</h1>
        <p className="text-xl text-neutral-600 font-light mb-8">Page not found</p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-neutral-900 text-white font-light tracking-wider uppercase text-sm hover:bg-neutral-700 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
