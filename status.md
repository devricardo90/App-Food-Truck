# Status

Este arquivo nao e fonte de verdade.

O estado oficial das tasks vive exclusivamente em `backlog.md`.

Use `status.md` apenas se quiser manter um resumo executivo manual.
Nao use este arquivo para:

- escolher proxima task
- validar dependencias
- decidir se algo esta `READY`, `REVIEW` ou `DONE`

Regra operacional:

- `backlog.md` decide
- `status.md` apenas resume

## Resumo executivo atual

- a prova operacional remota do MVP foi concluida em staging
- o elo `cliente -> barraca -> cliente` ficou validado com evidencias objetivas em ambiente remoto
- o contexto autenticado do admin foi alinhado para `funky-chicken`
- o mobile criou pedido real, o pagamento mock promoveu para `new`, o admin operou `in_progress -> ready -> completed` e o cliente refletiu cada transicao
- existe agora um canal controlado minimo para uso externo do mobile contra staging via `Expo Go` em `LAN`
- a principal friccao desta fase e que o `tunnel` falhou por dependencia externa; validadores desta rodada precisam estar na mesma rede local
- o roadmap permanece pausado neste checkpoint
- nenhuma nova task `READY` foi aberta apos a FT-088
- a frente de distribuicao fora da `LAN` so deve ser reaberta com demanda concreta: testador externo real, janela definida de validacao externa ou necessidade operacional/comercial objetiva
