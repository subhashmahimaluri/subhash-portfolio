import type { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import { FeaturedProject } from '@/components/home/FeaturedProject';
import { Stats } from '@/components/home/Stats';
import { QuickAccess } from '@/components/home/QuickAccess';
import { CoreExpertise } from '@/components/home/CoreExpertise';
import { TrustedBy } from '@/components/home/TrustedBy';
import { SITE_TITLE, SITE_URL } from '@/lib/config/site';

export const generateMetadata = (): Metadata => {
  const description =
    'Subhash Mahimaluri — Solution Architect, Cloud Architect, and AI Systems engineer with 15+ years building scalable platforms for Fortune 500 enterprises including National Grid UK, Shell, and Intuit.';

  return {
    // The root segment's title is NOT run through the layout's title.template,
    // so set the full descriptive title explicitly (absolute) for SEO.
    title: { absolute: SITE_TITLE },
    description,
    alternates: { canonical: SITE_URL },
    openGraph: {
      title: SITE_TITLE,
      description,
      type: 'website',
      url: `${SITE_URL}/`,
    },
  };
};

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProject />
      <Stats />
      <QuickAccess />
      <CoreExpertise />
      <TrustedBy />
    </>
  );
}
