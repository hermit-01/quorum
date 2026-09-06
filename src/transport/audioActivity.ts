/** Hold through short gaps between words, without mistaking publication for speech. */
export class AudioActivity {
  private lastHeard = new Map<number, number>()
  private active = new Set<number>()

  sample(uid: number, level: number, now: number): boolean | undefined {
    if (level > 0.02) this.lastHeard.set(uid, now)
    const last = this.lastHeard.get(uid)
    const speaking = last !== undefined && now - last < 550
    if (speaking === this.active.has(uid)) return undefined
    if (speaking) this.active.add(uid)
    else this.active.delete(uid)
    return speaking
  }

  remove(uid: number) {
    this.lastHeard.delete(uid)
    return this.active.delete(uid)
  }

  clear() {
    this.lastHeard.clear()
    this.active.clear()
  }
}
