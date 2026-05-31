import type { Metadata } from 'next';
import Link from 'next/link';
import React from 'react'; // Explicitly import React for JSX transformation

export const metadata: Metadata = {
  title: 'Home',
};

export default function HomePage() {
  return (
    <main role="main" className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold mb-4">Subhash Mahimaluri</h1>
        <p className="text-lg text-gray-700 mb-8">
          Principal Software Engineer specializing in cutting-edge web development and AI solutions.
        </p>
        <nav aria-label="Site navigation" className="flex gap-4">
          <Link href="/resume" className="text-blue-600 hover:underline">Resume</Link>
          <Link href="/portfolio" className="text-blue-600 hover:underline">Portfolio</Link>
          <Link href="/education" className="text-blue-600 hover:underline">Education</Link>
          <Link href="/react-interview-questions" className="text-blue-600 hover:underline">React Interview Q&A</Link>
          <Link href="/contact" className="text-blue-600 hover:underline">Contact</Link>
        </nav>
      </div>
    </main>
  );
}
