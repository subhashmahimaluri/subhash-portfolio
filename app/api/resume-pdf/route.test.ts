import { describe, it, expect } from 'vitest';
import { GET } from './route';

describe('GET /api/resume-pdf', () => {
  it('returns a "Not implemented" JSON response (PDF endpoint ships in PBI-016)', async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ message: 'Not implemented' });
  });
});
