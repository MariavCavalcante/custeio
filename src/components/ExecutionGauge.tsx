interface ExecutionGaugeProps {
  /** Percentual pago em relação ao valor de referência (pode passar de 100). */
  percentual: number
  label: string
}

// Medidor semicircular inspirado nos monitores de sinais vitais usados em
// urgência/emergência — a "faixa de risco" (vermelho/âmbar/verde) encodifica
// o quão perto do valor de referência mensal o custeio pago está.
export function ExecutionGauge({ percentual, label }: ExecutionGaugeProps) {
  const clamped = Math.max(0, Math.min(percentual, 130))
  const angulo = (clamped / 130) * 180 // 0..180 graus
  const raio = 80
  const cx = 100
  const cy = 100

  const ponto = (anguloGraus: number, r: number) => {
    const rad = ((180 - anguloGraus) * Math.PI) / 180
    return { x: cx - r * Math.cos(rad), y: cy - r * Math.sin(rad) }
  }

  const agulha = ponto(angulo, raio - 14)

  const zonas = [
    { de: 0, ate: 70 / 130 * 180, cor: 'var(--color-vermelho-600)' },
    { de: 70 / 130 * 180, ate: 95 / 130 * 180, cor: 'var(--color-dourado-500)' },
    { de: 95 / 130 * 180, ate: 130 / 130 * 180, cor: 'var(--color-verde-600)' },
  ]

  const arco = (de: number, ate: number, r: number) => {
    const p1 = ponto(de, r)
    const p2 = ponto(ate, r)
    const largeArc = ate - de > 180 ? 1 : 0
    return `M ${p1.x} ${p1.y} A ${r} ${r} 0 ${largeArc} 1 ${p2.x} ${p2.y}`
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox="0 0 200 118" className="w-full max-w-[260px]">
        {zonas.map((z, i) => (
          <path
            key={i}
            d={arco(z.de, z.ate, raio)}
            fill="none"
            stroke={z.cor}
            strokeWidth={14}
            strokeLinecap="butt"
            opacity={0.85}
          />
        ))}
        {/* agulha */}
        <line
          x1={cx}
          y1={cy}
          x2={agulha.x}
          y2={agulha.y}
          stroke="var(--color-ink)"
          strokeWidth={3}
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r={6} fill="var(--color-ink)" />
        <text x={cx} y={cy - 22} textAnchor="middle" className="font-data" fontSize="22" fontWeight={600} fill="var(--color-ink)">
          {clamped.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%
        </text>
      </svg>
      <span className="text-xs font-medium uppercase tracking-wide text-ink-soft text-center">{label}</span>
    </div>
  )
}
