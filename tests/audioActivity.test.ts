import { describe, expect, it } from 'vitest'
import { AudioActivity } from '@/transport/audioActivity'

describe('interviewer voice activity', () => {
  it('ignores silent published tracks and background noise', () => {
    const activity = new AudioActivity()
    expect(activity.sample(1001, 0, 0)).toBeUndefined()
    expect(activity.sample(1001, 0.01, 100)).toBeUndefined()
  })

  it('highlights the audible agent, holds between words, then clears after silence', () => {
    const activity = new AudioActivity()
    expect(activity.sample(1002, 0.4, 100)).toBe(true)
    expect(activity.sample(1001, 0, 100)).toBeUndefined()
    expect(activity.sample(1002, 0, 400)).toBeUndefined()
    expect(activity.sample(1002, 0.3, 500)).toBeUndefined()
    expect(activity.sample(1002, 0, 1050)).toBe(false)
    expect(activity.sample(1002, 0, 1150)).toBeUndefined()
  })

  it('supports overlapping voices and clears activity on leave or reset', () => {
    const activity = new AudioActivity()
    expect(activity.sample(1001, 0.2, 0)).toBe(true)
    expect(activity.sample(1003, 0.5, 0)).toBe(true)
    expect(activity.remove(1001)).toBe(true)
    expect(activity.sample(1001, 0, 100)).toBeUndefined()
    activity.clear()
    expect(activity.sample(1003, 0, 100)).toBeUndefined()
    expect(activity.sample(1003, 0.5, 200)).toBe(true)
  })
})
