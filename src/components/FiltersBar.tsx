import { MESES, TIPOS_SAMU } from '../data/types'
import type { TipoSamu } from '../data/types'
import type { FonteFiltro } from '../utils/aggregate'

interface FiltersBarProps {
  aba: 'UPA 24h' | 'SAMU 192'
  mesIndex: number
  onMesChange: (i: number) => void
  situacao: string
  onSituacaoChange: (v: string) => void
  municipios: string[]
  municipio: string
  onMunicipioChange: (v: string) => void
  cnesList: string[]
  cnes: string
  onCnesChange: (v: string) => void
  fonte: FonteFiltro
  onFonteChange: (v: FonteFiltro) => void
  tipo?: TipoSamu | 'Todos'
  onTipoChange?: (v: TipoSamu | 'Todos') => void
}

const campo = 'flex flex-col gap-1'
const rotulo = 'text-[11px] uppercase tracking-wide text-ink-soft'
const select =
  'bg-paper border border-line rounded-md px-3 py-2 text-sm text-ink font-medium focus:outline-none focus:ring-2 focus:ring-verde-500 min-w-[9rem]'

export function FiltersBar({
  aba,
  mesIndex,
  onMesChange,
  situacao,
  onSituacaoChange,
  municipios,
  municipio,
  onMunicipioChange,
  cnesList,
  cnes,
  onCnesChange,
  fonte,
  onFonteChange,
  tipo,
  onTipoChange,
}: FiltersBarProps) {
  return (
    <div className="bg-paper border border-line rounded-lg p-4 flex flex-wrap items-end gap-3">
      <div className={campo}>
        <label className={rotulo}>Mês de referência</label>
        <select className={select} value={mesIndex} onChange={(e) => onMesChange(Number(e.target.value))}>
          {MESES.map((m, i) => (
            <option key={m} value={i}>{m}</option>
          ))}
        </select>
      </div>

      <div className={campo}>
        <label className={rotulo}>Situação</label>
        <select className={select} value={situacao} onChange={(e) => onSituacaoChange(e.target.value)}>
          <option value="Todas">Todas</option>
          <option value="HABILITADA">Habilitada</option>
          <option value="QUALIFICADA">Qualificada</option>
        </select>
      </div>

      {aba === 'SAMU 192' && onTipoChange && (
        <div className={campo}>
          <label className={rotulo}>Tipo (SAMU)</label>
          <select className={select} value={tipo} onChange={(e) => onTipoChange(e.target.value as TipoSamu | 'Todos')}>
            <option value="Todos">Todos</option>
            {TIPOS_SAMU.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      )}

      <div className={campo}>
        <label className={rotulo}>Município</label>
        <select className={select} value={municipio} onChange={(e) => onMunicipioChange(e.target.value)}>
          <option value="Todos">Todos</option>
          {municipios.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div className={campo}>
        <label className={rotulo}>CNES</label>
        <select className={select} value={cnes} onChange={(e) => onCnesChange(e.target.value)}>
          <option value="Todos">Todos</option>
          {cnesList.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className={campo}>
        <label className={rotulo}>Valores pagos por</label>
        <select className={select} value={fonte} onChange={(e) => onFonteChange(e.target.value as FonteFiltro)}>
          <option value="Todos">Todos (Estado + Ministério)</option>
          <option value="Estado">Estado</option>
          <option value="Ministério">Ministério da Saúde</option>
        </select>
      </div>
    </div>
  )
}
