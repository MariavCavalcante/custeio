export type Situacao = 'HABILITADA' | 'QUALIFICADA'
export type TipoSamu = 'USA' | 'USB' | 'Moto' | 'Central'

export const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
] as const

export const MESES_ABREV = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
]

export const TIPOS_SAMU: TipoSamu[] = ['USA', 'USB', 'Moto', 'Central']

/**
 * Uma unidade de UPA 24h (uma linha da planilha "Base de Dados - Custeio",
 * aba UPA 24h): valor de referência mensal (SES) e os valores efetivamente
 * pagos pelo Estado e pelo Ministério da Saúde, mês a mês.
 */
export interface UnidadeUPA {
  id: string
  unidade: string
  municipio: string
  cnes: string
  situacao: Situacao
  valorMensalSES: number
  /** Índice 0 = Janeiro ... índice 11 = Dezembro. */
  pagoEstadoPorMes: (number | null)[]
  pagoMinisterioPorMes: (number | null)[]
  glosaPorMes: (number | null)[]
}

/**
 * Um município com serviço de SAMU 192 (uma linha da aba SAMU 192): quais
 * tipos de recurso o município possui (USA, USB, Moto, Central), valor de
 * referência mensal e os valores pagos pelo Estado e pelo Ministério.
 */
export interface UnidadeSAMU {
  id: string
  municipio: string
  macrorregiao: string
  regiao: string
  cnes: string
  situacao: Situacao
  tipos: TipoSamu[]
  valorMensalSES: number
  pagoEstadoPorMes: (number | null)[]
  pagoMinisterioPorMes: (number | null)[]
  glosaPorMes: (number | null)[]
}
