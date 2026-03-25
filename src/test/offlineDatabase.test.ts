import { describe, expect, it } from 'vitest';
import { hashPassword } from '@/lib/offlineDatabase';

describe('offline database helpers', () => {
  it('hashes password deterministically', async () => {
    const first = await hashPassword('senha-segura');
    const second = await hashPassword('senha-segura');

    expect(first).toHaveLength(64);
    expect(first).toBe(second);
  });
});
