'use client'

/**
 * AgentInterceptorProvider — stub component.
 * Originally a legacy vendor platform hook that intercepted and proxied
 * all /api/agent calls through legacy provider's middleware for telemetry/billing.
 * Replaced with a transparent pass-through so the app runs without
 * any legacy provider vendor dependency.
 */
export function AgentInterceptorProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

