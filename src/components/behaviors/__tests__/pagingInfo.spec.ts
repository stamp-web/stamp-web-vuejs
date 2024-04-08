import { describe, expect, it } from 'vitest'
import pageInfo from '@/components/behaviors/pageInfo'

describe('pageInfo', () => {
  describe('ActivePage', () => {
    it('Within Range', () => {
      const info = pageInfo([])
      info.setPageCount(5)
      info.setActivePage(4)
      expect(info.getActivePage()).toBe(4)
    })

    it('Below Range', () => {
      const info = pageInfo([])
      info.setPageCount(5)
      info.setActivePage(0)
      expect(info.getActivePage()).toBe(1)
    })

    it('Over Range', () => {
      const info = pageInfo([])
      info.setPageCount(5)
      info.setActivePage(6)
      expect(info.getActivePage()).toBe(5)
    })
  })

  describe('PageSize', () => {
    it('Below Minimum', () => {
      const info = pageInfo([])
      info.setPageSize(5)
      expect(info.getPageSize()).toBe(10)
    })

    it('Valid Value', () => {
      const info = pageInfo([])
      info.setPageSize(1500)
      expect(info.getPageSize()).toBe(1500)
    })
  })

  describe('Calculate Paging Stats', () => {
    it('Valid calculation', () => {
      const info = pageInfo([])
      info.setPageSize(100)
      info.calculatePagingStats(150)
      expect(info.getPageCount()).toBe(2)
    })
  })
})
