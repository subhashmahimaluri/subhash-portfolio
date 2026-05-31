import React from 'react';

const ORGANISATIONS: ReadonlyArray<string> = [
  'Telstra',
  'NTT Data',
  'Emirates NBD',
  'Deloitte',
  'HSBC',
  'DXC Technology',
];

export function TrustedBy() {
  return (
    <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 max-w-5xl mx-auto w-full py-8">
      {ORGANISATIONS.map((org) => (
        <span key={org} className="text-2xl font-bold text-gray-700 dark:text-gray-300 whitespace-nowrap">
          {org}
        </span>
      ))}
    </div>
  );
}
