import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { AxiosResponse } from 'axios'
import axios from 'axios'
import CatalogueNumberService from '@/services/CatalogueNumberService'
import type { Stamp } from '@/models/Stamp'

vi.mock('axios', () => {
  const defaultMock = vi.fn()
  const mockObj = {
    default: defaultMock,
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    create: vi.fn()
  }
  Object.assign(defaultMock, mockObj)
  return mockObj
})

describe('CatalogueNumberService', () => {
  type MyAxiosResponse = AxiosResponse<unknown> & {
    data: unknown
    status: number
    statusText: string
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getResourceName returns correct name', () => {
    expect(CatalogueNumberService.getResourceName()).toBe('catalogueNumbers')
  })

  describe('makeActive', () => {
    it('sends correct POST request and returns updated stamp', async () => {
      const mockStamp = { id: 100, rate: '10c', countryRef: 1 } as Stamp
      vi.mocked(axios).mockResolvedValue({
        status: 200,
        data: mockStamp
      } as unknown as MyAxiosResponse)

      const result = await CatalogueNumberService.makeActive(42)
      expect(axios).toHaveBeenCalled()
      expect(result).toStrictEqual(mockStamp)
    })

    it('rejects on failure response code', async () => {
      vi.mocked(axios).mockResolvedValue({
        status: 500,
        data: 'Error'
      } as unknown as MyAxiosResponse)

      await expect(CatalogueNumberService.makeActive(42)).rejects.toBeDefined()
    })
  })
})
