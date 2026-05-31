import { Metadata } from 'next';

export const generateMetadata = (): Metadata => {
  const description = 'Connect with Subhash Mahimaluri through various channels: email, social media, or schedule a call.';
  return {
    title: 'Contact',
    description,
    openGraph: {
      title: 'Contact',
      description,
      type: 'website',
    },
  };
};

export default function ContactPage() {
  const calUrl = process.env.NEXT_PUBLIC_CAL_URL ?? 'https://cal.com/subhash-mahimaluri';

  return (
    <main className="container mx-auto px-4 py-16 max-w-3xl">
      <section>
        <h1 className="text-4xl font-bold mb-6 text-navy-600 dark:text-navy-100">Get in Touch</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
          I'm always open to discussing new projects, collaborations, or opportunities. 
          Feel free to reach out via any of the channels below, and I'll get back to you as soon as possible.
        </p>

        <ul className="space-y-4">
          <li>
            <a
              href="mailto:subhash.yexaa@gmail.com"
              aria-label="Send an email to Subhash Mahimaluri"
              className="text-navy-600 dark:text-navy-300 hover:text-orange-500 dark:hover:text-orange-400 font-medium transition-colors motion-safe:duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded"
            >
              Email Subhash Mahimaluri
            </a>
          </li>
          <li>
            <a
              href="https://linkedin.com/in/subhashmahimaluri"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View Subhash Mahimaluri on LinkedIn"
              className="text-navy-600 dark:text-navy-300 hover:text-orange-500 dark:hover:text-orange-400 font-medium transition-colors motion-safe:duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded"
            >
              LinkedIn Profile
            </a>
          </li>
          <li>
            <a
              href="https://github.com/subhashmahimaluri"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View Subhash Mahimaluri on GitHub"
              className="text-navy-600 dark:text-navy-300 hover:text-orange-500 dark:hover:text-orange-400 font-medium transition-colors motion-safe:duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded"
            >
              GitHub Profile
            </a>
          </li>
          <li>
            <a
              href={calUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Schedule a Call with Subhash Mahimaluri"
              className="text-navy-600 dark:text-navy-300 hover:text-orange-500 dark:hover:text-orange-400 font-medium transition-colors motion-safe:duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded"
            >
              Schedule a Call
            </a>
          </li>
          <li className="text-gray-700 dark:text-gray-300">
            <span className="font-semibold">Location:</span> Melbourne, Australia
          </li>
          <li className="text-gray-700 dark:text-gray-300">
            <span className="font-semibold">Availability:</span> I usually respond within 24 hours.
          </li>
        </ul>
      </section>
    </main>
  );
}
