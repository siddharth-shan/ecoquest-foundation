import { describe, expect, it } from 'vitest'
import { seminarAnchor } from './UpcomingEvents'

describe('seminarAnchor', () => {
  it('sends Winter sessions to the Winter Field Lab section', () => {
    expect(seminarAnchor({ series: 'winter-2026' })).toBe('/events/#winter-field-lab')
  })
  it('sends Fall sessions to the seminars section', () => {
    expect(seminarAnchor({ series: 'fall-2026' })).toBe('/events/#seminars')
  })
})
