// Mock for @workos-inc/authkit-nextjs
import { vi } from 'vitest'

export const getWorkOS = vi.fn(() => ({
  userManagement: {
    getUser: vi.fn().mockResolvedValue({
      id: 'user_01234567890abcdef',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      profilePictureUrl: null,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z'
    })
  }
}))

// Re-export for compatibility
export default {
  getWorkOS
}