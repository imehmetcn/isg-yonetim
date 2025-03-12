"use client";

export const dynamic = 'force-dynamic'

import dynamic from 'next/dynamic'

const AnalyticsClient = dynamic(() => import('@/components/analytics/analytics-client'), {
  ssr: false
})

export default function AnalyticsPage() {
  return <AnalyticsClient />
}
