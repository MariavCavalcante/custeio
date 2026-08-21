import type { Situacao, TipoSamu } from '../data/types'

/** Interface comum entre UnidadeUPA e UnidadeSAMU para as funções de cálculo. */
export interface RegistroComPagamento {
  id: string
  municipio: string
  cnes: string
  situacao: Situacao
  valorMensalSES: number
  pagoEstadoPorMes: (number | null)[]
  pagoMinisterioPorMes: (number | null)[]
  glosaPorMes: (number | null)[]
}

export type FonteFiltro = 'Todos' | 'Estado' | 'Ministério'

/** Valor pago no mês por uma unidade, de acordo com a fonte selecionada. */
export function pagoMes(u: RegistroComPagamento, mesIndex: number, fonte: FonteFiltro): number {
  const estado = u.pagoEstadoPorMes[mesIndex] ?? 0
  const ministerio = u.pagoMinisterioPorMes[mesIndex] ?? 0
  if (fonte === 'Estado') return estado
  if (fonte === 'Ministério') return ministerio
  return estado + ministerio
}

export function totalReferencia(unidades: RegistroComPagamento[]): number {
  return unidades.reduce((soma, u) => soma + (u.valorMensalSES || 0), 0)
}

export function totalEstadoMes(unidades: RegistroComPagamento[], mesIndex: number): number {
  return unidades.reduce((soma, u) => soma + (u.pagoEstadoPorMes[mesIndex] ?? 0), 0)
}

export function totalMinisterioMes(unidades: RegistroComPagamento[], mesIndex: number): number {
  return unidades.reduce((soma, u) => soma + (u.pagoMinisterioPorMes[mesIndex] ?? 0), 0)
}

export function totalGlosaMes(unidades: RegistroComPagamento[], mesIndex: number): number {
  return unidades.reduce((soma, u) => soma + (u.glosaPorMes[mesIndex] ?? 0), 0)
}

export interface PontoEvolucao {
  mes: string
  Estado: number | null
  Ministério: number | null
}

/**
 * Soma os valores pagos no mês por fonte, mas retorna `null` (em vez de 0)
 * quando NENHUMA unidade tem lançamento nesse mês — evita que meses ainda
 * não lançados na planilha apareçam como uma queda para zero no gráfico.
 */
function totalOuNulo(
  unidades: RegistroComPagamento[],
  mesIndex: number,
  campo: 'pagoEstadoPorMes' | 'pagoMinisterioPorMes',
): number | null {
  const algumLancado = unidades.some((u) => u[campo][mesIndex] !== null && u[campo][mesIndex] !== undefined)
  if (!algumLancado) return null
  return unidades.reduce((soma, u) => soma + (u[campo][mesIndex] ?? 0), 0)
}

export function evolucaoMensal(unidades: RegistroComPagamento[], mesesAbrev: string[]): PontoEvolucao[] {
  return mesesAbrev.map((mes, i) => ({
    mes,
    Estado: totalOuNulo(unidades, i, 'pagoEstadoPorMes'),
    Ministério: totalOuNulo(unidades, i, 'pagoMinisterioPorMes'),
  }))
}

export interface RankingItem {
  nome: string
  valor: number
}

export function rankingPorMunicipio(
  unidades: RegistroComPagamento[],
  mesIndex: number,
  fonte: FonteFiltro,
  topN = 10,
): RankingItem[] {
  const porMunicipio = new Map<string, number>()
  for (const u of unidades) {
    const valor = pagoMes(u, mesIndex, fonte)
    porMunicipio.set(u.municipio, (porMunicipio.get(u.municipio) ?? 0) + valor)
  }
  return [...porMunicipio.entries()]
    .map(([nome, valor]) => ({ nome, valor }))
    .sort((a, b) => b.valor - a.valor)
    .slice(0, topN)
}

export interface SituacaoResumo {
  situacao: string
  quantidade: number
  valor: number
}

export function resumoPorSituacao(unidades: RegistroComPagamento[], mesIndex: number, fonte: FonteFiltro): SituacaoResumo[] {
  const mapa = new Map<string, { quantidade: number; valor: number }>()
  for (const u of unidades) {
    const atual = mapa.get(u.situacao) ?? { quantidade: 0, valor: 0 }
    atual.quantidade += 1
    atual.valor += pagoMes(u, mesIndex, fonte)
    mapa.set(u.situacao, atual)
  }
  return [...mapa.entries()].map(([situacao, v]) => ({ situacao, ...v }))
}

export function unidadeTemTipo(tipos: TipoSamu[] | undefined, filtro: TipoSamu | 'Todos'): boolean {
  if (filtro === 'Todos') return true
  return !!tipos?.includes(filtro)
}
