import { describe, expect, it } from 'vitest'
import { OwnershipHelper } from '../Ownership'

describe('OwnershipHelper tests', () => {
  describe('toTagElementView', () => {
    it('both defects and deception', () => {
      const owner = OwnershipHelper.newInstance()
      owner.defects = 6
      owner.deception = 12
      OwnershipHelper.toTagElementView(owner)
      // @ts-ignore
      expect(owner['_defects']).toStrictEqual([4, 2])
      // @ts-ignore
      expect(owner['_deception']).toStrictEqual([8, 4])
    })

    it('only defects', () => {
      const owner = OwnershipHelper.newInstance()
      owner.defects = 8
      OwnershipHelper.toTagElementView(owner)
      // @ts-ignore
      expect(owner['_defects']).toStrictEqual([8])
      // @ts-ignore
      expect(owner['_deception']).toStrictEqual([])
    })

    it('only deception', () => {
      const owner = OwnershipHelper.newInstance()
      owner.deception = 72
      OwnershipHelper.toTagElementView(owner)
      // @ts-ignore
      expect(owner['_defects']).toStrictEqual([])
      // @ts-ignore
      expect(owner['_deception']).toStrictEqual([64, 8])
    })
  })

  describe('fromTagElementView', () => {
    it('properly converts both', () => {
      const owner = OwnershipHelper.newInstance()
      owner.defects = 0
      owner.deception = 0
      // @ts-ignore
      owner._defects = [64, 8]
      // @ts-ignore
      owner._deception = [16, 4]
      OwnershipHelper.fromTagElementView(owner)
      expect(owner.defects).toBe(72)
      expect(owner.deception).toBe(20)
      // @ts-ignore
      expect(owner._deception).toBeUndefined()
      // @ts-ignore
      expect(owner._defects).toBeUndefined()
    })
  })
})
