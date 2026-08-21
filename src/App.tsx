import { useMemo, useState } from 'react'
import brasaoGoias from './assets/brasao-goias.svg'
import { dadosUpa } from './data/upa'
import { dadosSamu } from './data/samu'
import { MESES, MESES_ABREV } from './data/types'
import type { TipoSamu, UnidadeUPA, UnidadeSAMU } from './data/types'
import { FiltersBar } from './components/FiltersBar'
import { KpiCard } from './components/KpiCard'
import { ExecutionGauge } from './components/ExecutionGauge'
import { TrendChart } from './components/TrendChart'
import { RankingChart } from './components/RankingChart'
import { SituacaoResumoCard } from './components/SituacaoResumoCard'
import { DataTable } from './components/DataTable'
import {
  evolucaoMensal,
  rankingPorMunicipio,
  resumoPorSituacao,
  totalEstadoMes,
  totalGlosaMes,
  totalMinisterioMes,
  totalReferencia,
  unidadeTemTipo,
} from './utils/aggregate'
import type { FonteFiltro } from './utils/aggregate'
import { formatBRL } from './utils/format'

type Aba = 'SAMU 192' | 'UPA 24h'

function App() {
  const [aba, setAba] = useState<Aba>('SAMU 192')
  const [upaUnidades, setUpaUnidades] = useState<UnidadeUPA[]>(dadosUpa)
  const [samuUnidades, setSamuUnidades] = useState<UnidadeSAMU[]>(dadosSamu)

  const [mesIndex, setMesIndex] = useState<number>(7) // Agosto/2026 — último mês com dados
  const [situacao, setSituacao] = useState('Todas')
  const [municipio, setMunicipio] = useState('Todos')
  const [cnes, setCnes] = useState('Todos')
  const [tipo, setTipo] = useState<TipoSamu | 'Todos'>('Todos')
  const [fonte, setFonte] = useState<FonteFiltro>('Todos')

  function trocarAba(nova: Aba) {
    setAba(nova)
    setMunicipio('Todos')
    setCnes('Todos')
    setTipo('Todos')
  }

  const registrosBase = aba === 'UPA 24h' ? upaUnidades : samuUnidades

  const municipios = useMemo(
    () => [...new Set(registrosBase.map((u) => u.municipio).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR')),
    [registrosBase],
  )
  const cnesList = useMemo(
    () => [...new Set(registrosBase.map((u) => u.cnes).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR')),
    [registrosBase],
  )

  const filtradas = useMemo(() => {
    return registrosBase.filter((u) => {
      if (situacao !== 'Todas' && u.situacao !== situacao) return false
      if (municipio !== 'Todos' && u.municipio !== municipio) return false
      if (cnes !== 'Todos' && u.cnes !== cnes) return false
      if (aba === 'SAMU 192' && !unidadeTemTipo((u as UnidadeSAMU).tipos, tipo)) return false
      return true
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registrosBase, situacao, municipio, cnes, tipo, aba])

  const referencia = totalReferencia(filtradas)
  const pagoEstado = totalEstadoMes(filtradas, mesIndex)
  const pagoMinisterio = totalMinisterioMes(filtradas, mesIndex)
  const glosa = totalGlosaMes(filtradas, mesIndex)
  const pagoTotal = fonte === 'Estado' ? pagoEstado : fonte === 'Ministério' ? pagoMinisterio : pagoEstado + pagoMinisterio
  const pctExecucao = referencia > 0 ? (pagoTotal / referencia) * 100 : 0

  const dadosEvolucao = useMemo(() => evolucaoMensal(filtradas, MESES_ABREV), [filtradas])
  const dadosRanking = useMemo(() => rankingPorMunicipio(filtradas, mesIndex, fonte), [filtradas, mesIndex, fonte])
  const dadosSituacao = useMemo(() => resumoPorSituacao(filtradas, mesIndex, fonte), [filtradas, mesIndex, fonte])

  function editarUpa(id: string, campo: string, valor: string) {
    setUpaUnidades((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u
        return aplicarEdicao(u, campo, valor, mesIndex)
      }),
    )
  }

  function editarSamu(id: string, campo: string, valor: string) {
    setSamuUnidades((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u
        return aplicarEdicao(u, campo, valor, mesIndex)
      }),
    )
  }

  function editarTipoSamu(id: string, tipoAlvo: TipoSamu, ativo: boolean) {
    setSamuUnidades((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u
        const tipos = ativo ? [...new Set([...u.tipos, tipoAlvo])] : u.tipos.filter((t) => t !== tipoAlvo)
        return { ...u, tipos }
      }),
    )
  }

  return (
    <div className="min-h-screen bg-bg">
      <header className="bg-verde-800 text-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-5 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <img src={brasaoGoias} alt="Brasão do Estado de Goiás" className="h-14 w-auto shrink-0 drop-shadow" />
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-xs uppercase tracking-widest text-verde-100/80 font-medium">
                SES-GO · Gerência de Regulação e Ações de Urgência
              </span>
              <h1 className="font-display text-2xl sm:text-3xl font-semibold">Painel de Custeio da RUE</h1>
              <p className="text-sm text-verde-100/90 max-w-2xl">
                Acompanhamento do custeio das unidades de SAMU 192 e UPA 24h — valores de referência,
                pagos pelo Estado e pelo Ministério da Saúde, e glosas, atualizados manualmente.
              </p>
            </div>
          </div>

          <nav className="flex gap-1">
            {(['SAMU 192', 'UPA 24h'] as Aba[]).map((a) => (
              <button
                key={a}
                onClick={() => trocarAba(a)}
                className={`px-4 py-2 rounded-t-md text-sm font-medium transition-colors ${
                  aba === a ? 'bg-bg text-verde-800' : 'bg-verde-700/60 text-white hover:bg-verde-700'
                }`}
              >
                {a}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 flex flex-col gap-5">
        <FiltersBar
          aba={aba}
          mesIndex={mesIndex}
          onMesChange={setMesIndex}
          situacao={situacao}
          onSituacaoChange={setSituacao}
          municipios={municipios}
          municipio={municipio}
          onMunicipioChange={setMunicipio}
          cnesList={cnesList}
          cnes={cnes}
          onCnesChange={setCnes}
          fonte={fonte}
          onFonteChange={setFonte}
          tipo={aba === 'SAMU 192' ? tipo : undefined}
          onTipoChange={aba === 'SAMU 192' ? setTipo : undefined}
        />

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard label="Valor de referência (SES)" valor={formatBRL(referencia)} sublinha={`${filtradas.length} registro(s)`} destaque="dourado" />
          <KpiCard label={`Pago pelo Estado — ${MESES[mesIndex]}`} valor={formatBRL(pagoEstado)} destaque="verde" />
          <KpiCard label={`Pago pelo Ministério da Saúde — ${MESES[mesIndex]}`} valor={formatBRL(pagoMinisterio)} destaque="azul" />
          <KpiCard label={`Glosas em ${MESES[mesIndex]}`} valor={formatBRL(glosa)} destaque="vermelho" />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
          <div className="bg-paper border border-line rounded-lg p-4 flex items-center justify-center">
            <ExecutionGauge percentual={pctExecucao} label={`Execução sobre a referência — ${MESES[mesIndex]} (${fonte})`} />
          </div>
          <TrendChart dados={dadosEvolucao} />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
          <RankingChart dados={dadosRanking} mesLabel={MESES[mesIndex]} />
          <SituacaoResumoCard dados={dadosSituacao} />
        </section>

        {aba === 'UPA 24h' ? (
          <DataTable aba="UPA 24h" unidades={filtradas as UnidadeUPA[]} mesIndex={mesIndex} mesLabel={MESES[mesIndex]} onEditar={editarUpa} />
        ) : (
          <DataTable
            aba="SAMU 192"
            unidades={filtradas as UnidadeSAMU[]}
            mesIndex={mesIndex}
            mesLabel={MESES[mesIndex]}
            onEditar={editarSamu}
            onEditarTipo={editarTipoSamu}
          />
        )}
      </main>

      <footer className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 text-xs text-ink-soft">
        Painel estático, sem backend — todos os dados ficam no seu navegador. Edite os valores diretamente
        na tabela, ou edite <code className="font-data">src/data/upa.ts</code> /{' '}
        <code className="font-data">src/data/samu.ts</code> para atualizar os dados de partida.
      </footer>
    </div>
  )
}

function aplicarEdicao<T extends { valorMensalSES: number; pagoEstadoPorMes: (number | null)[]; pagoMinisterioPorMes: (number | null)[]; glosaPorMes: (number | null)[]; situacao: 'HABILITADA' | 'QUALIFICADA'; cnes: string }>(
  u: T,
  campo: string,
  valor: string,
  mesIndex: number,
): T {
  switch (campo) {
    case 'situacao':
      return { ...u, situacao: valor === 'QUALIFICADA' ? 'QUALIFICADA' : 'HABILITADA' }
    case 'cnes':
      return { ...u, cnes: valor }
    case 'valorMensalSES':
      return { ...u, valorMensalSES: Number(valor) || 0 }
    case 'pagoEstadoMes': {
      const arr = [...u.pagoEstadoPorMes]
      arr[mesIndex] = valor === '' ? null : Number(valor)
      return { ...u, pagoEstadoPorMes: arr }
    }
    case 'pagoMinisterioMes': {
      const arr = [...u.pagoMinisterioPorMes]
      arr[mesIndex] = valor === '' ? null : Number(valor)
      return { ...u, pagoMinisterioPorMes: arr }
    }
    case 'glosaMes': {
      const arr = [...u.glosaPorMes]
      arr[mesIndex] = valor === '' ? null : Number(valor)
      return { ...u, glosaPorMes: arr }
    }
    default:
      return u
  }
}

export default App
