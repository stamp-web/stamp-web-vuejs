import { describe, it, expect } from 'vitest'
import { Defects, DefectsHelper } from '@/models/Defects'

describe('DefectHelper tests', () => {
  describe('toString tests', () => {
    it('validate each value', () => {
      expect(DefectsHelper.toString(Defects.CLIPPED)).toBe('Paper Clipped')
      expect(DefectsHelper.toString(Defects.CREASED)).toBe('Creased')
      expect(DefectsHelper.toString(Defects.SOILED)).toBe('Soiled Paper')
      expect(DefectsHelper.toString(Defects.PAPER_ADHESION)).toBe('Paper Adhesion')
      expect(DefectsHelper.toString(Defects.FADING)).toBe('Color Fading')
      expect(DefectsHelper.toString(Defects.HEAVILY_HINGED)).toBe('Heavily Hinged')
      expect(DefectsHelper.toString(Defects.ALBUM_TRANSFER)).toBe('Album Transfer')
      expect(DefectsHelper.toString(Defects.PINHOLE)).toBe('Pinhole')
      expect(DefectsHelper.toString(Defects.BLEEDING)).toBe('Color Bleeding')
      expect(DefectsHelper.toString(Defects.TONED_GUM)).toBe('Toned Gum')
      expect(DefectsHelper.toString(Defects.CHANGELING)).toBe('Color Changeling')
      expect(DefectsHelper.toString(Defects.THIN)).toBe('Thinned')
      expect(DefectsHelper.toString(Defects.TORN)).toBe('Torn')
      expect(DefectsHelper.toString(Defects.TONED_PAPER)).toBe('Paper Toned')
      expect(DefectsHelper.toString(Defects.SCUFFED)).toBe('Scuff Marks')
      expect(DefectsHelper.toString(Defects.SHORT_PERF)).toBe('Short Perforations')
      expect(DefectsHelper.toString(Defects.STUNTED_PERF)).toBe('Stunted Perforations')
      expect(DefectsHelper.toString(Defects.INK_STAIN)).toBe('Ink Stains')
      expect(DefectsHelper.toString(Defects.CRACKED_GUM)).toBe('Cracked Gum')
    })
  })
})
