import type { UnidadeUPA } from './types'

/**
 * DADOS DO PAINEL — UPA 24h. Edite esta lista para atualizar o painel, ou
 * ajuste os valores diretamente na tela (aba UPA 24h → tabela).
 *
 * IMPORTANTE — divisão Estado / Ministério da Saúde: a planilha original
 * ("Base de Dados - Custeio") só traz um valor mensal total pago pela SES,
 * sem separar quanto veio do Tesouro Estadual e quanto veio do Ministério
 * da Saúde (bloco de custeio federal). Por isso, os valores abaixo foram
 * carregados integralmente em `pagoEstadoPorMes`, com `pagoMinisterioPorMes`
 * zerado — edite esses dois campos na tabela do painel para refletir a
 * divisão real assim que ela estiver disponível.
 */

const upa = (
  unidade: string,
  municipio: string,
  cnes: string,
  situacao: 'HABILITADA' | 'QUALIFICADA',
  valorMensalSES: number,
  pagoEstadoPorMes: (number | null)[],
): UnidadeUPA => ({
  id: crypto.randomUUID(),
  unidade,
  municipio,
  cnes,
  situacao,
  valorMensalSES,
  pagoEstadoPorMes,
  pagoMinisterioPorMes: Array(12).fill(null),
  glosaPorMes: Array(12).fill(null),
})

const M8 = (v: number): (number | null)[] => [v, v, v, v, v, v, v, v, null, null, null, null]

export const dadosUpa: UnidadeUPA[] = [
  upa('UPA III 24H MANSÕES ODISSÉIA', 'ÁGUAS LINDAS', '431451', 'HABILITADA', 125000, M8(125000)),
  upa('DR. ALAIR MAFRA', 'ANÁPOLIS', '7529368', 'QUALIFICADA', 250000, M8(250000)),
  upa('BRASICON', 'AP. GOIÂNIA', '5201405', 'QUALIFICADA', 250000, M8(250000)),
  upa('AMBROSINA COIMBRA BUENO', 'AP. GOIÂNIA', '7777825', 'QUALIFICADA', 250000, M8(250000)),
  upa('(FLAMBOYANT) GERALDO MAGELA', 'AP. GOIÂNIA', '9135944', 'QUALIFICADA', 250000,
    [250000, 250000, 250000, 250000, 250000, 0, 0, 0, null, null, null, null]),
  upa('UPA UNIDADE DE PRONTO ATENDIMENTO CALDAS NOVAS', 'CALDAS NOVAS', '7064578', 'QUALIFICADA', 150000, M8(150000)),
  upa('UPA CATALÃO', 'CATALÃO', '7977123', 'QUALIFICADA', 250000, M8(250000)),
  upa('UPA UNIDADE DE PRONTO ATENDIMENTO', 'CAMPOS BELOS', '9426981', 'HABILITADA', 50000, M8(50000)),
  upa('DR. JAIR DINOAH DE ARAÚJO', 'CERES', '7065299', 'QUALIFICADA', 150000, M8(150000)),
  upa('WASFI JOSÉ DAHER', 'CRISTALINA', '7924801', 'HABILITADA', 50000, M8(50000)),
  upa('UPA UNIDADE DE PRONTO ATENDIMENTO', 'FORMOSA', '6722253', 'QUALIFICADA', 85000, M8(85000)),
  upa('UPA UNIDADE DE PRONTO ATENDIMENTO', 'GOIANÉSIA', '7779461', 'QUALIFICADA', 85000, M8(85000)),
  upa('DR. JOÃO BATISTA DE SOUZA JÚNIOR (ITAIPÚ)', 'GOIÂNIA', '7304188', 'HABILITADA', 125000, M8(125000)),
  upa('MARIA PIRES PERILLO (NOROESTE)', 'GOIÂNIA', '7821379', 'QUALIFICADA', 250000, M8(250000)),
  upa('DR DOMINGOS VIGGIANO (JARDIM AMÉRICA)', 'GOIÂNIA', '2339528', 'QUALIFICADA', 50000, M8(50000)),
  upa('LÁZARO ALBERTO DE MORAES', 'INHUMAS', '7989458', 'QUALIFICADA', 150000, M8(150000)),
  upa('MÁRCIO JOSÉ GAGO', 'IPORÁ', '9541004', 'HABILITADA', 50000, M8(50000)),
  upa('DR. CIRO GARCIA', 'ITUMBIARA', '9211349', 'HABILITADA', 50000, M8(50000)),
  upa('DR. JOSÉ BENEDICTO BARBOSA', 'JATAÍ', '9107614', 'QUALIFICADA', 85000, M8(85000)),
  upa('UNIDADE DE PRONTO ATENDIMENTO DO JARDIM INGA UPA', 'LUZIÂNIA', '9093508', 'HABILITADA', 50000, M8(50000)),
  upa('UPA DE LUZIANIA UPA JOSÉ PAULO BONI', 'LUZIÂNIA', '7883668', 'HABILITADA', 87500, M8(87500)),
  upa('UNIDADE DE PRONTO ATENDIMENTO UPA 24 HORAS', 'MINEIROS', '7813767', 'QUALIFICADA', 150000, M8(150000)),
  upa('UNIDADE DE PRONTO ATENDIMENTO', 'PLANALTINA', '112666', 'HABILITADA', 50000, M8(50000)),
  upa('DR OSIRES DE URZEDA NATAL', 'PONTALINA', '247774', 'HABILITADA', 25000, M8(25000)),
  upa('DR. JOSÉ POVOA MENDES', 'RIO VERDE', '6834477', 'QUALIFICADA', 183500, M8(183500)),
  upa('DR. PAULO CÉSAR DE CARVALHO TELLES', 'RIO VERDE', '2997045', 'QUALIFICADA', 85000, M8(85000)),
  upa('DOM MIGUEL PEDRO MUNDO, NOVA', 'SANTA HELENA', '9362185', 'QUALIFICADA', 117500, M8(117500)),
  upa('UNIDADE DE PRONTO ATENDIMENTO SENADOR CANEDO', 'SENADOR CANEDO', '7157681', 'QUALIFICADA', 150000, M8(150000)),
  upa('UNIDADE DE PRONTO ATENDIMENTO DE TRINDADE', 'TRINDADE', '9058079', 'QUALIFICADA', 150000, M8(150000)),
  upa('UNIDADE DE PRONTO ATENDIMENTO', 'URUAÇU', '9138153', 'HABILITADA', 50000, M8(50000)),
  upa('DRA ZILDA ARNS', 'VALPARAÍSO', '7267096', 'QUALIFICADA', 150000, M8(150000)),
]
