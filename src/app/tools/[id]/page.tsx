import { notFound } from 'next/navigation'
import { TOOLS } from '@/lib/tools'
import ToolPageClient from './ToolPageClient'

export function generateStaticParams() {
  return TOOLS.map(t => ({ id: t.id }))
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const tool = TOOLS.find(t => t.id === params.id)
  if (!tool) return {}
  return {
    title: `${tool.name} — DevKit`,
    description: tool.description,
  }
}

export default function ToolPage({ params }: { params: { id: string } }) {
  const tool = TOOLS.find(t => t.id === params.id)
  if (!tool) notFound()

  return <ToolPageClient tool={tool} />
}
