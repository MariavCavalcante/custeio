# Painel de Acompanhamento do Custeio da RUE - Goiás

Painel gerencial interativo para o acompanhamento do custeio da Rede de Urgência e Emergência (RUE) do Estado de Goiás, conforme as especificações do PROMPT MESTRE.

## Como Executar Localmente
1. Clone ou baixe este repositório.
2. Abra um terminal na raiz do projeto e inicie um servidor web local (ex: `python -m http.server 8000`).
3. Acesse `http://localhost:8000`.

## Configuração
Para ler dados diretamente do Google Sheets:
- No arquivo `data/data-source-config.js`, altere `USE_SIMULATED_DATA` para `false`.

