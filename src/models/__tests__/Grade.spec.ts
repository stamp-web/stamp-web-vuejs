import { describe, it, expect } from 'vitest'
import { Grade, GradeHelper } from '@/models/Grade'

describe('GradeHelper tests', () => {
  describe('toString tests', () => {
    it('validate each value', () => {
      expect(GradeHelper.toString(Grade.XF)).toBe('Extra-Fine (XF)')
      expect(GradeHelper.toString(Grade.VF)).toBe('Very-Fine (VF)')
      expect(GradeHelper.toString(Grade.F)).toBe('Fine (F)')
      expect(GradeHelper.toString(Grade.FVF)).toBe('Fine-Very-Fine (FVF)')
      expect(GradeHelper.toString(Grade.VG)).toBe('Very-Good (VG)')
      expect(GradeHelper.toString(Grade.D)).toBe('Damaged (D)')
      expect(GradeHelper.toString(Grade.CTS)).toBe('Cut-To-Shape (CTS)')
    })
  })
})
