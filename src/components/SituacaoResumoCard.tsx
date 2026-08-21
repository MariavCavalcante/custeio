import type { SituacaoResumo } from '../utils/aggregate'
import { formatBRLCompact } from '../utils/format'

const cor: Record<string, string> = {
  HABILITADA: 'var(--color-azul-600)',
  QUALIFICADA: 'var(--color-verde-600)',
}

export function SituacaoResumoCard({ dados }: { dados: SituacaoResumo[] }) {
  const total = dados.reduce((s, d) => s + d.valor, 0) || 1
  return (
    <div className="bg-paper border border-line rounded-lg p-4 flex flex-col gap-3">
      <h3 className="font-display text-sm font-semibold text-ink">Unidades por situação</h3>
      <div className="w-full h-3 rounded-full overflow-hidden flex bg-line">
        {dados.map((d) => (
          <div
            key={d.situacao}
            style={{ width: `${(d.valor / total) * 100}%`, background: cor[d.situacao] ?? 'var(--color-ink-soft)' }}
          />
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {dados.map((d) => (
          <div key={d.situacao} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: cor[d.situacao] ?? 'var(--color-ink-soft)' }} />
              {d.situacao === 'HABILITADA' ? 'Habilitada' : 'Qualificada'}
              <span className="text-ink-soft font-data text-xs">({d.quantidade})</span>
            </span>
            <span className="font-data text-ink">{formatBRLCompact(d.valor)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
