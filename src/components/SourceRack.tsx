/**
 * The three interviewers, as sources in a gallery.
 *
 * The tally lamp is the whole argument in one control: red means on air. With a
 * coordinator exactly one lamp is ever red. Without one, all three light at
 * once — which in a real gallery is a fault, and here it is the bug the project
 * exists to fix.
 */

import { AGENTS, AGENT_IDS, type AgentId, type Bid } from '@/core/contracts'
import { AgentSignal, Icon, MotionSurface } from '@/components/InterviewVisuals'
import type { ReactNode } from 'react'

export type SourceState = 'air' | 'bid' | 'idle'

export interface SourceView {
  state: SourceState
  /** What this agent is saying, or last said. */
  line: string
  bid?: Bid
  /** True on the agent that just took the floor from somebody else. */
  cutIn: boolean
}

/** Bids are unbounded in principle; this is only the width of the meter. */
const BID_FULL_SCALE = 10

export function SourceRack({ sources, children, active = true }: { sources: Record<AgentId, SourceView>; children?: ReactNode; active?: boolean }) {
  return (
    <MotionSurface className="rack">
      {AGENT_IDS.map((id) => {
        const profile = AGENTS[id]
        const view = sources[id]
        const label = view.state === 'air' ? 'Speaking' : view.state === 'bid' ? 'Preparing' : active ? 'Listening' : 'Standby'

        return (
          <article key={id} className="source" data-agent={id} data-state={view.state}>
            {view.cutIn && <span className="cut-in">Cut in</span>}

            <header className="source-head">
              <span className="source-icon"><Icon name={id} /></span>
              <div className="source-identity">
                <h2 className="source-name">{profile.displayName}</h2>
              <span className="tally" role="status" aria-label={`${profile.displayName}: ${label}`}>
                <i className="lamp" aria-hidden />
                {label}
              </span>
              </div>
            </header>

            <AgentSignal agent={id} />

            <p className="source-role">{profile.role}</p>

            <p className="source-line" data-empty={view.line === ''}>
              {view.line || (view.state === 'air' ? 'Speaking to you…' : 'Waiting for the floor.')}
            </p>

            {view.bid && (
              <div className="bid-row">
                <span className="bid-score">{view.bid.score.toFixed(2)}</span>
                <span className="bid-bar">
                  <span style={{ width: `${Math.min(100, (view.bid.score / BID_FULL_SCALE) * 100)}%` }} />
                </span>
              </div>
            )}
          </article>
        )
      })}
      {children}
    </MotionSurface>
  )
}
