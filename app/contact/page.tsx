import type { Metadata } from 'next';
import Link from 'next/link';

const EMAIL = 'subhashmahimaluri@gmail.com';
const CAL_URL = 'https://cal.com/subhashmt';

export const generateMetadata = (): Metadata => {
  const description =
    'Get in touch with Subhash Mahimaluri for collaboration, consulting, or full-time opportunities — email, phone, LinkedIn, GitHub, or schedule a call.';
  return {
    title: 'Contact',
    description,
    openGraph: {
      title: 'Contact — Subhash Mahimaluri',
      description,
      type: 'website',
    },
  };
};

interface Channel {
  label: string;
  value: string;
  href: string;
  external?: boolean;
  accessibleName: string;
}

const CHANNELS: ReadonlyArray<Channel> = [
  {
    label: 'Email',
    value: EMAIL,
    href: `mailto:${EMAIL}`,
    accessibleName: 'Send an email to Subhash Mahimaluri',
  },
  {
    label: 'Phone',
    value: '+91 9980551764',
    href: 'tel:+919980551764',
    accessibleName: 'Call Subhash Mahimaluri',
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/subhash-mahimaluri',
    href: 'https://www.linkedin.com/in/subhash-mahimaluri',
    external: true,
    accessibleName: 'LinkedIn profile',
  },
  {
    label: 'GitHub',
    value: 'github.com/subhashmahimaluri',
    href: 'https://github.com/subhashmahimaluri',
    external: true,
    accessibleName: 'GitHub profile',
  },
];

export default function ContactPage() {
  return (
    <section className="page" aria-labelledby="contact-title">
      <div className="container">
        <header className="page-head">
          <span className="eyebrow">Get in Touch</span>
          <h1 id="contact-title">Contact</h1>
          <p className="lead">
            Let&apos;s connect and discuss opportunities for collaboration, consulting, or
            full-time roles.
          </p>
        </header>

        <div className="data-grid">
          {CHANNELS.map((channel) => (
            <a
              key={channel.label}
              className="data-card"
              href={channel.href}
              aria-label={channel.accessibleName}
              {...(channel.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <p className="section-title">{channel.label}</p>
              <p style={{ color: 'var(--link-strong)', fontWeight: 600, wordBreak: 'break-word' }}>
                {channel.value}
              </p>
            </a>
          ))}
        </div>

        <div className="panel" style={{ marginTop: 'var(--s-8)' }}>
          <h2>Location</h2>
          <div className="prose" style={{ marginTop: 'var(--s-4)' }}>
            <p>
              <strong>Current location:</strong> Bengaluru, India
            </p>
            <p>
              <strong>Work authorization:</strong> Indian citizen — open to relocation and visa
              sponsorship (UAE, UK, EU).
            </p>
            <p>
              <strong>Markets:</strong> Open to opportunities in UAE, Germany, UK, EU, and
              remote positions globally — typically responding within 24 hours.
            </p>
          </div>
        </div>

        <div className="hero-ctas" style={{ marginTop: 'var(--s-10)', justifyContent: 'center' }}>
          <a
            className="btn btn-primary"
            href={CAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Schedule a call"
          >
            Schedule a Call
          </a>
          <a className="btn btn-outline" href={`mailto:${EMAIL}`} aria-label="Send Subhash an email">
            Send Email
          </a>
        </div>

        <p style={{ marginTop: 'var(--s-10)', textAlign: 'center' }}>
          <Link href="/" style={{ color: 'var(--link-strong)', fontWeight: 600 }}>
            ← Back to Home
          </Link>
        </p>
      </div>
    </section>
  );
}
