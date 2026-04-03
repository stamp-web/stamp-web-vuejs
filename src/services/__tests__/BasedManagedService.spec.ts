import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import BaseManagedService from '@/services/BasedManagedService'
import type { PersistedNamedModel } from '@/models/entityModels'

vi.mock('axios', () => ({
  default: {
    get: vi.fn()
  }
}))

class TestManagedService<T extends PersistedNamedModel> extends BaseManagedService<T> {
  getResourceName(): string {
    return 'test-resource'
  }
}

interface MockModel extends PersistedNamedModel {
  id: number
  name: string
}

describe('BaseManagedService', () => {
  let service: TestManagedService<MockModel>

  beforeEach(() => {
    vi.clearAllMocks()

    service = new TestManagedService<MockModel>()
    service.overrideBasePath = '/test-app/'
  })

  describe('getStampCount', () => {
    it('should fetch and return the correct count models', async () => {
      const mockResponseData = [
        { id: 1, count: 12 },
        { id: 2, count: 43 }
      ]

      vi.mocked(axios.get).mockResolvedValue({
        data: mockResponseData,
        status: 200
      } as unknown)

      const result = await service.getStampCount()

      const expectedUrl = '/test-app/stamp-webservices/rest/test-resource/!countStamps'

      expect(axios.get).toHaveBeenCalledWith(expectedUrl)
      expect(result).toHaveLength(2)
      expect(result[0]).toEqual(mockResponseData[0])
      expect(result[1]).toEqual(mockResponseData[1])
    })

    it('should return an empty array when no stamps are found', async () => {
      vi.mocked(axios.get).mockResolvedValue({
        data: [],
        status: 200
      } as unknown)

      const result = await service.getStampCount()

      expect(result).toBeInstanceOf(Array)
      expect(result).toHaveLength(0)
    })

    it('should propagate errors if the API call fails', async () => {
      vi.mocked(axios.get).mockRejectedValue(new Error('Network Error'))
      await expect(service.getStampCount()).rejects.toThrow('Network Error')
    })
  })
})
