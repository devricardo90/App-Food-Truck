# Onboarding de Foodtrucks de Desenvolvimento

## Objetivo

Definir o contrato canonico para cadastrar foodtrucks de desenvolvimento no projeto sem misturar dado improvisado, imagem solta e catalogo inconsistente.

Este fluxo existe para:

- alimentar a API com dados criveis para desenvolvimento
- validar renderizacao real no mobile
- validar comportamento visual no admin
- permitir importacao incremental de uma empresa por vez

## Regra de escopo

Esses dados sao quase reais e servem apenas para desenvolvimento.

Nao tratar esse onboarding como:

- dado oficial de producao
- base juridica de uso de marca
- cadastro definitivo de parceiro

Toda empresa entra como `foodtruck de desenvolvimento`.

## Regra operacional

Importar sempre uma empresa por vez.

Nao subir varias no mesmo ciclo.

Sequencia obrigatoria:

1. receber payload bruto da empresa
2. validar o checklist minimo
3. normalizar texto, imagem e catalogo
4. importar a empresa
5. validar renderizacao no mobile
6. validar renderizacao no admin quando aplicavel
7. revisar estados vazios e erro
8. registrar resultado antes de partir para a proxima

## Checklist minimo por foodtruck

Cada foodtruck deve chegar com:

- nome publico
- slug desejado ou nome suficiente para gerar slug
- descricao curta
- descricao media opcional
- imagem principal
- categoria principal
- status operacional desejado no ambiente de desenvolvimento
- evento alvo ou indicacao de usar o evento ativo de desenvolvimento
- lista de categorias do catalogo
- lista de itens por categoria

## Contrato minimo de identidade

Campos obrigatorios:

- `name`
- `slug`
- `description`
- `primary_category`
- `hero_image`

Campos recomendados:

- `tagline`
- `accent_color`
- `secondary_color`
- `instagram`
- `website`
- `notes_for_render`

## Regra do slug

O slug deve:

- ser unico
- usar lowercase
- usar `-` como separador
- evitar acento
- evitar caractere especial

Exemplo:

- `Funky Chicken` -> `funky-chicken`

## Regra de imagem

Formato minimo aceito:

- `png`
- `jpg`
- `jpeg`
- `webp`

Requisitos minimos:

- imagem horizontal ou quadrada com leitura boa no mobile
- resolucao suficiente para card e detalhe
- sem marca d'agua estranha ao contexto
- arquivo local identificado ou URL estavel para desenvolvimento

Campos da imagem:

- `file_name`
- `source_type`: `local` ou `url`
- `source_value`
- `alt`
- `copyright_note` opcional

## Contrato minimo do catalogo

Cada categoria deve ter:

- `name`
- `slug`
- `sort_order`

Cada item deve ter:

- `name`
- `description`
- `price`
- `is_available`
- `sort_order`

Campos recomendados por item:

- `daily_stock_remaining`
- `image`
- `badge`
- `spicy_level`
- `allergen_note`

## Regra de preco

O preco deve entrar normalizado como string decimal com ponto.

Exemplo correto:

- `11.00`
- `8.90`

Evitar:

- `11,00`
- `€11`
- `11 EUR`

## Regra de disponibilidade

Cada item deve declarar:

- `is_available`

Opcional:

- `daily_stock_remaining`

Se nao houver estoque controlado:

- usar `daily_stock_remaining = null`

## Estrutura canonica de payload

```json
{
  "foodtruck": {
    "name": "Funky Chicken",
    "slug": "funky-chicken",
    "description": "Frango crocante e sanduiches com operacao rapida para evento.",
    "primary_category": "Chicken",
    "hero_image": {
      "file_name": "funky-chicken-hero.jpg",
      "source_type": "local",
      "source_value": "assets/dev-foodtrucks/funky-chicken/hero.jpg",
      "alt": "Fachada do Funky Chicken"
    }
  },
  "catalog": [
    {
      "name": "Sanduiches",
      "slug": "sanduiches",
      "sort_order": 0,
      "items": [
        {
          "name": "Chicken Burger",
          "description": "Frango crocante, molho da casa e coleslaw.",
          "price": "11.00",
          "is_available": true,
          "daily_stock_remaining": null,
          "sort_order": 0
        }
      ]
    }
  ]
}
```

## Validacao antes de importar

Antes de iniciar uma task de empresa:

- nome esta claro?
- slug esta definido?
- imagem principal existe?
- descricao minima existe?
- existe ao menos uma categoria?
- existe ao menos um item?
- todo item tem preco valido?
- todo item tem disponibilidade?

Se qualquer resposta for `nao`, a task nao deve sair de bloqueada.

## Criterio de aceite por empresa

Cada empresa so pode ser aprovada quando:

- aparece na lista de foodtrucks da API
- detalhe carrega sem fallback indevido
- catalogo carrega no mobile
- imagem renderiza corretamente
- textos nao quebram layout
- preco aparece formatado corretamente
- estados de erro continuam coerentes

## Ordem oficial das empresas atuais

1. Funky Chicken
2. Soulistic Food Truck
3. Ceylon Food Truck
4. Hugfish Cafe Foodtruck
5. GordoTruck

## Entrega esperada do usuario ao iniciar uma empresa

Quando o usuario enviar a proxima empresa, o pacote ideal deve conter:

- nome da empresa
- descricao curta
- imagem principal
- categorias
- itens
- precos
- observacoes de identidade visual

Se vier incompleto, a primeira etapa da task e normalizar o payload antes de importar.
