import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatBRLCompact } from '../utils/format'
import type { PontoEvolucao } from '../utils/aggregate'

export function TrendChart({ dados }: { dados: PontoEvolucao[] }) {
  return (
    <div className="bg-paper border border-line rounded-lg p-4">
      <h3 className="font-display text-sm font-semibold text-ink mb-3">
        Evolução mensal — pago pelo Estado x Ministério da Saúde
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={dados} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" />
          <XAxis dataKey="mes" tick={{ fontSize: 12, fill: 'var(--color-ink-soft)' }} axisLine={{ stroke: 'var(--color-line)' }} tickLine={false} />
          <YAxis
            tickFormatter={(v) => formatBRLCompact(v)}
            tick={{ fontSize: 11, fill: 'var(--color-ink-soft)' }}
            axisLine={false}
            tickLine={false}
            width={70}
          />
          <Tooltip
            formatter={(value) => formatBRLCompact(Number(value))}
            contentStyle={{ borderRadius: 8, borderColor: 'var(--color-line)', fontSize: 13 }}
          />
          <Line type="monotone" dataKey="Estado" stroke="var(--color-verde-600)" strokeWidth={2.5} dot={{ r: 3 }} connectNulls={false} />
          <Line type="monotone" dataKey="Ministério" stroke="var(--color-azul-600)" strokeWidth={2.5} dot={{ r: 3 }} connectNulls={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
