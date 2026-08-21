# Painel de Custeio da RUE — SES-GO

Painel para acompanhamento do custeio das unidades de **SAMU 192** e
**UPA 24h** da Rede de Urgência e Emergência (RUE) de Goiás: valor de
referência (SES), valores pagos pelo **Estado** e pelo **Ministério da
Saúde**, e glosas — organizados em duas abas.

Não tem backend nem banco de dados: os dados vivem no navegador (estado do
React) e são atualizados manualmente, direto na tabela. Qualquer edição
recalcula na hora os cartões, o medidor de execução e os gráficos.

## Como rodar

```bash
npm install
npm run dev       # ambiente de desenvolvimento, http://localhost:5173
npm run build     # gera a versão de produção em dist/
npm run preview   # serve a versão de produção localmente
```

## Estrutura das duas abas

- **SAMU 192** — um registro por município, com os tipos de recurso
  presentes (USA, USB, Moto, Central), situação (Habilitada/Qualificada),
  CNES, valor de referência e valores pagos.
- **UPA 24h** — um registro por unidade, com nome da unidade, município,
  CNES, situação, valor de referência e valores pagos.

## Filtros disponíveis

Mês de referência, Situação (Habilitada/Qualificada), Tipo — só na aba
SAMU (USA/USB/Moto/Central), Município, CNES, e "Valores pagos por"
(Estado, Ministério da Saúde ou os dois somados) — esse último controla o
que os gráficos e o medidor de execução mostram.

## Como atualizar os dados

Edite os valores diretamente na tabela de cada aba: clique em qualquer
campo (situação, CNES, valor de referência, pago pelo Estado, pago pelo
Ministério, glosa) e digite o novo número — o painel recalcula tudo na
hora. Na aba SAMU 192, marque/desmarque as caixas USA/USB/Moto/Central
para ajustar os tipos de recurso do município.

Para deixar um novo conjunto de dados como ponto de partida padrão do
painel, edite os arquivos-fonte:
- `src/data/upa.ts` — dados da aba UPA 24h
- `src/data/samu.ts` — dados da aba SAMU 192

## ⚠️ Sobre a divisão Estado / Ministério da Saúde

A planilha original ("Base de Dados - Custeio") só traz um valor mensal
total pago pela SES, sem separar quanto veio do Tesouro Estadual e quanto
veio do Ministério da Saúde (bloco de custeio federal). Por isso, os
dados de partida têm o valor integral em "Pago Estado" e "Pago Ministério"
zerado — edite esses dois campos, mês a mês, na tabela do painel assim
que tiver a divisão real por fonte.

## ⚠️ Sobre os dados de partida

- **UPA 24h**: 31 unidades, com valores lançados de Janeiro a Agosto/2026
  (Setembro a Dezembro ainda em branco, como na planilha original).
- **SAMU 192**: 106 municípios (regiões Centro Norte, Centro Oeste, Centro
  Sudeste, Nordeste e o início da região Sudoeste, até Acreúna) — os
  municípios restantes da região Sudoeste ainda não foram trazidos.
  A aba SAMU 192 da planilha original também não tem coluna de CNES —
  o campo começa em branco, editável na tabela.

## Estrutura do projeto

```
src/
  data/
    types.ts       # modelo de dados (UnidadeUPA, UnidadeSAMU) e utilitários
    upa.ts          # dados de partida — UPA 24h
    samu.ts         # dados de partida — SAMU 192
  utils/
    aggregate.ts    # cálculos: totais por fonte, evolução mensal, ranking, resumo por situação
    format.ts       # formatação de moeda (BRL) e percentuais
  components/
    FiltersBar.tsx        # filtros: mês, situação, tipo (SAMU), município, CNES, fonte
    KpiCard.tsx             # cartões de indicador
    ExecutionGauge.tsx      # medidor de execução orçamentária (SVG)
    TrendChart.tsx           # evolução mensal (Estado x Ministério)
    RankingChart.tsx          # top municípios por valor pago no mês
    SituacaoResumoCard.tsx     # resumo por situação (Habilitada/Qualificada)
    DataTable.tsx                # tabela editável (uma versão para cada aba)
  assets/
    brasao-goias.svg   # Brasão do Estado de Goiás (Wikimedia Commons, domínio público)
```

## Stack

React 19 + TypeScript + Vite + Tailwind CSS v4 + Recharts. Sem
dependências de backend, API, login ou importação/exportação de arquivos.
