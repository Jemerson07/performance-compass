import { describe, expect, it } from 'vitest';
import { mapAuthErrorMessage, normalizeEmail } from '@/lib/authErrors';

describe('auth helpers', () => {
  it('normalizes email', () => {
    expect(normalizeEmail('  USER@Email.Com ')).toBe('user@email.com');
  });

  it('maps invalid credentials', () => {
    expect(mapAuthErrorMessage('Invalid login credentials')).toContain('inválidos');
  });
});
