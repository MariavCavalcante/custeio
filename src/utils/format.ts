export function formatBRL(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  })
}

export function formatBRLCompact(valor: number): string {
  if (Math.abs(valor) >= 1_000_000) {
    return `R$ ${(valor / 1_000_000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} mi`
  }
  if (Math.abs(valor) >= 1_000) {
    return `R$ ${(valor / 1_000).toLocaleString('pt-BR', { maximumFractionDigits: 0 })} mil`
  }
  return formatBRL(valor)
}

export function formatPct(valor: number): string {
  return `${valor.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`
}
