interface KpiCardProps {
  label: string
  valor: string
  sublinha?: string
  destaque?: 'verde' | 'azul' | 'dourado' | 'vermelho'
}

const cores: Record<NonNullable<KpiCardProps['destaque']>, string> = {
  verde: 'border-l-verde-600',
  azul: 'border-l-azul-600',
  dourado: 'border-l-dourado-600',
  vermelho: 'border-l-vermelho-600',
}

export function KpiCard({ label, valor, sublinha, destaque = 'verde' }: KpiCardProps) {
  return (
    <div
      className={`bg-paper rounded-lg border border-line ${cores[destaque]} border-l-4 p-4 flex flex-col gap-1 min-w-0`}
    >
      <span className="text-xs font-medium uppercase tracking-wide text-ink-soft">{label}</span>
      <span className="font-data text-2xl font-semibold text-ink truncate">{valor}</span>
      {sublinha && <span className="text-xs text-ink-soft">{sublinha}</span>}
    </div>
  )
}
