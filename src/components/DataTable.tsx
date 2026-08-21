import type { UnidadeUPA, UnidadeSAMU, TipoSamu } from '../data/types'
import { TIPOS_SAMU } from '../data/types'
import { formatBRL } from '../utils/format'

type Campo = 'situacao' | 'cnes' | 'valorMensalSES' | 'pagoEstadoMes' | 'pagoMinisterioMes' | 'glosaMes'

interface DataTableUPAProps {
  aba: 'UPA 24h'
  unidades: UnidadeUPA[]
  mesIndex: number
  mesLabel: string
  onEditar: (id: string, campo: Campo, valor: string) => void
}

interface DataTableSAMUProps {
  aba: 'SAMU 192'
  unidades: UnidadeSAMU[]
  mesIndex: number
  mesLabel: string
  onEditar: (id: string, campo: Campo, valor: string) => void
  onEditarTipo: (id: string, tipo: TipoSamu, ativo: boolean) => void
}

type DataTableProps = DataTableUPAProps | DataTableSAMUProps

const inputBase = 'w-full bg-transparent focus:outline-none focus:ring-1 focus:ring-verde-500 rounded px-1 py-0.5'
const numBase = 'w-24 bg-transparent text-right focus:outline-none focus:ring-1 focus:ring-verde-500 rounded px-1 py-0.5 font-data'

export function DataTable(props: DataTableProps) {
  const { unidades, mesIndex, mesLabel, onEditar } = props
  const isSamu = props.aba === 'SAMU 192'

  return (
    <div className="bg-paper border border-line rounded-lg p-4">
      <h3 className="font-display text-sm font-semibold text-ink mb-3">
        {isSamu ? 'Municípios — SAMU 192' : 'Unidades — UPA 24h'}{' '}
        <span className="text-ink-soft font-normal">
          ({unidades.length}) — valores de {mesLabel}
        </span>
      </h3>

      <div className="overflow-x-auto trilho">
        <table className="w-full text-sm min-w-[1100px]">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wide text-ink-soft border-b border-line">
              {!isSamu && <th className="py-2 pr-3 font-medium">Unidade</th>}
              <th className="py-2 pr-3 font-medium">Município</th>
              {isSamu && <th className="py-2 pr-3 font-medium">Tipos</th>}
              <th className="py-2 pr-3 font-medium">CNES</th>
              <th className="py-2 pr-3 font-medium">Situação</th>
              <th className="py-2 pr-3 font-medium text-right">Valor ref. (SES)</th>
              <th className="py-2 pr-3 font-medium text-right">Pago Estado</th>
              <th className="py-2 pr-3 font-medium text-right">Pago Ministério</th>
              <th className="py-2 pr-3 font-medium text-right">Glosa</th>
            </tr>
          </thead>
          <tbody>
            {unidades.map((u) => (
              <tr key={u.id} className="border-b border-line/70 last:border-0 hover:bg-verde-50/60 align-top">
                {!isSamu && (
                  <td className="py-1.5 pr-3 max-w-[220px]">
                    <span className="block truncate" title={(u as UnidadeUPA).unidade}>
                      {(u as UnidadeUPA).unidade}
                    </span>
                  </td>
                )}
                <td className="py-1.5 pr-3 whitespace-nowrap">{u.municipio}</td>
                {isSamu && (
                  <td className="py-1.5 pr-3">
                    <div className="flex flex-wrap gap-x-2 gap-y-1">
                      {TIPOS_SAMU.map((t) => {
                        const ativo = (u as UnidadeSAMU).tipos.includes(t)
                        return (
                          <label key={t} className="flex items-center gap-1 text-xs text-ink-soft cursor-pointer">
                            <input
                              type="checkbox"
                              className="accent-verde-600"
                              checked={ativo}
                              onChange={(e) => (props as DataTableSAMUProps).onEditarTipo(u.id, t, e.target.checked)}
                            />
                            {t}
                          </label>
                        )
                      })}
                    </div>
                  </td>
                )}
                <td className="py-1.5 pr-3">
                  <input
                    className={`${inputBase} w-24 font-data`}
                    value={u.cnes}
                    placeholder="—"
                    onChange={(e) => onEditar(u.id, 'cnes', e.target.value)}
                  />
                </td>
                <td className="py-1.5 pr-3">
                  <select
                    className="bg-transparent focus:outline-none focus:ring-1 focus:ring-verde-500 rounded px-1 py-0.5"
                    value={u.situacao}
                    onChange={(e) => onEditar(u.id, 'situacao', e.target.value)}
                  >
                    <option value="HABILITADA">Habilitada</option>
                    <option value="QUALIFICADA">Qualificada</option>
                  </select>
                </td>
                <td className="py-1.5 pr-3 text-right font-data">
                  <input
                    className={numBase}
                    type="number"
                    value={u.valorMensalSES}
                    onChange={(e) => onEditar(u.id, 'valorMensalSES', e.target.value)}
                  />
                </td>
                <td className="py-1.5 pr-3 text-right font-data">
                  <input
                    className={numBase}
                    type="number"
                    value={u.pagoEstadoPorMes[mesIndex] ?? ''}
                    placeholder="—"
                    onChange={(e) => onEditar(u.id, 'pagoEstadoMes', e.target.value)}
                  />
                </td>
                <td className="py-1.5 pr-3 text-right font-data">
                  <input
                    className={numBase}
                    type="number"
                    value={u.pagoMinisterioPorMes[mesIndex] ?? ''}
                    placeholder="—"
                    onChange={(e) => onEditar(u.id, 'pagoMinisterioMes', e.target.value)}
                  />
                </td>
                <td className="py-1.5 pr-3 text-right font-data text-vermelho-600">
                  <input
                    className={`${numBase} focus:ring-vermelho-600`}
                    type="number"
                    value={u.glosaPorMes[mesIndex] ?? ''}
                    placeholder="—"
                    onChange={(e) => onEditar(u.id, 'glosaMes', e.target.value)}
                  />
                </td>
              </tr>
            ))}
            {unidades.length === 0 && (
              <tr>
                <td colSpan={isSamu ? 8 : 7} className="py-6 text-center text-ink-soft text-sm">
                  Nenhum registro encontrado com os filtros atuais.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-ink-soft mt-3">
        Total de referência exibido: {formatBRL(unidades.reduce((s, u) => s + u.valorMensalSES, 0))}
      </p>
    </div>
  )
}
