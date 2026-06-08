import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import AboutView from '@/views/AboutView.vue'
import axios from 'axios'
import { flushPromises } from '@vue/test-utils'

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

describe('AboutView', () => {
  beforeEach(() => {
    const pinia = createTestingPinia({
      fakeApp: true,
      createSpy: vi.fn
    })
    setActivePinia(pinia)
  })

  it('renders correctly and displays build numbers on success', async () => {
    // Mock successful fetch of build-number.json
    vi.mocked(axios.get).mockResolvedValueOnce({
      data: {
        'stamp-webservices': 6,
        'stamp-web-aurelia': 122,
        'stamp-web-vuejs': 43
      }
    })

    const wrapper = mount(AboutView)
    
    // Wait for the mounted hooks and promises (axios.get) to resolve
    await flushPromises()

    // Check header and general info
    expect(wrapper.find('h1').text()).toBe('About Stamp Web')
    expect(wrapper.text()).toContain('7.0.0')
    expect(wrapper.text()).toContain('Jason A. Drake')
    expect(wrapper.text()).toContain('Apache-2.0')

    // Check component build versions rendered
    expect(wrapper.text()).toContain('stamp-webservices')
    expect(wrapper.text()).toContain('Build #6')
    expect(wrapper.text()).toContain('stamp-web-aurelia')
    expect(wrapper.text()).toContain('Build #122')
    expect(wrapper.text()).toContain('stamp-web-vuejs')
    expect(wrapper.text()).toContain('Build #43')

    // Check GitHub font icons
    const githubIcons = wrapper.findAll('.sw-icon-github')
    expect(githubIcons.length).toBe(3)
  })

  it('handles error state when build-number.json fails to load', async () => {
    // Mock failed fetch
    vi.mocked(axios.get).mockRejectedValueOnce(new Error('Network error'))

    const wrapper = mount(AboutView)
    
    await flushPromises()

    // Verify it still renders general info but displays fallback message for versions
    expect(wrapper.find('h1').text()).toBe('About Stamp Web')
    expect(wrapper.text()).toContain('Build information is currently unavailable.')
  })
})
