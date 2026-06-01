import type { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import { FeaturedProject } from '@/components/home/FeaturedProject';
import { Stats } from '@/components/home/Stats';
import { QuickAccess } from '@/components/home/QuickAccess';
import { CoreExpertise } from '@/components/home/CoreExpertise';
import { TrustedBy } from '@/components/home/TrustedBy';

export const generateMetadata = (): Metadata => {
  const description =
    'Subhash Mahimaluri — Solution Architect, Cloud Architect, and AI Systems engineer with 15+ years building scalable platforms for Fortune 500 enterprises including National Grid UK, Shell, and Intuit.';

  return {
    title: 'Home',
    description,
    openGraph: {
      title: 'Subhash Mahimaluri — Solution Architect',
      description,
      type: 'website',
      url: 'https://subhashai.cloud/',
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
