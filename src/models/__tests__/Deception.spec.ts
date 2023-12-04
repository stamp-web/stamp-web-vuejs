import { describe, it, expect } from 'vitest'
import { Deception, DeceptionHelper } from '@/models/Deception'

describe('DeceptionHelper tests', () => {
  describe('toString tests', () => {
    it('validate each value', () => {
      expect(DeceptionHelper.toString(Deception.REGUM)).toBe('Regummed')
      expect(DeceptionHelper.toString(Deception.REPRINT)).toBe('Reprint')
      expect(DeceptionHelper.toString(Deception.REPAIRED)).toBe('Repaired')
      expect(DeceptionHelper.toString(Deception.FORGERY)).toBe('Forgery')
      expect(DeceptionHelper.toString(Deception.FORGERY_POSSIBLE)).toBe(
        'Possible Forgery'
      )
      expect(DeceptionHelper.toString(Deception.FAKE_OVERPRINT)).toBe('Fake Overprint')
      expect(DeceptionHelper.toString(Deception.FAKE_CANCEL)).toBe('Fake Cancel')
      expect(DeceptionHelper.toString(Deception.FISCAL_REMOVED)).toBe(
        'Fiscal Cancel Removed'
      )
    })
  })
})
