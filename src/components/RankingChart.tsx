import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatBRLCompact } from '../utils/format'
import type { RankingItem } from '../utils/aggregate'

export function RankingChart({ dados, mesLabel }: { dados: RankingItem[]; mesLabel: string }) {
  return (
    <div className="bg-paper border border-line rounded-lg p-4">
      <h3 className="font-display text-sm font-semibold text-ink mb-3">
        Top municípios — valor pago em {mesLabel}
      </h3>
      {dados.length === 0 ? (
        <p className="text-sm text-ink-soft py-8 text-center">Nenhum dado para os filtros atuais.</p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={dados} layout="vertical" margin={{ top: 4, right: 20, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" horizontal={false} />
            <XAxis type="number" tickFormatter={(v) => formatBRLCompact(v)} tick={{ fontSize: 11, fill: 'var(--color-ink-soft)' }} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="nome"
              width={130}
              tick={{ fontSize: 11, fill: 'var(--color-ink)' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value) => formatBRLCompact(Number(value))}
              contentStyle={{ borderRadius: 8, borderColor: 'var(--color-line)', fontSize: 13 }}
            />
            <Bar dataKey="valor" fill="var(--color-verde-600)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
