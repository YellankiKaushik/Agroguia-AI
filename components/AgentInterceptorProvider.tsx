'use client'

/**
 * AgentInterceptorProvider — stub component.
 * Originally a Lyzr Architect platform hook that intercepted and proxied
 * all /api/agent calls through Lyzr's middleware for telemetry/billing.
 * Replaced with a transparent pass-through so the app runs without
 * any Lyzr vendor dependency.
 */
export function AgentInterceptorProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
