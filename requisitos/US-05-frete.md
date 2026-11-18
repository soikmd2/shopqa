---
id: US-05
titulo: Cálculo de frete por CEP
epico: EP-02 Compra
prioridade: Must have
estimativa: 3 pontos
status: Done (Sprint 13)
regras: [RN-17, RN-18, RN-19, RN-20]
---

# US-05 — Cálculo de frete por CEP

## Narrativa
**Como** cliente
**Quero** saber o valor e o prazo de entrega informando meu CEP
**Para** conhecer o custo total antes de finalizar a compra

## Critérios de aceite

**AC-05.1 — Cálculo por região**
```gherkin
Dado que tenho itens no carrinho com subtotal abaixo de R$ 299,00
Quando informo o CEP "01310-100"
Então vejo "SP: R$ 14,90 · entrega em até 2 dias úteis"
```

**AC-05.2 — Formato do CEP**
```gherkin
Quando informo um CEP com 8 dígitos, com ou sem hífen
Então o frete é calculado
Quando informo um CEP com menos ou mais de 8 dígitos, ou com letras
Então vejo "CEP inválido. Use o formato 00000-000." e o frete não é calculado
```

**AC-05.3 — Frete grátis por valor**
```gherkin
Dado que o subtotal após o cupom é de exatamente R$ 299,00
Quando calculo o frete
Então o frete é "Grátis"
```

**AC-05.4 — Frete grátis por cupom**
```gherkin
Dado que apliquei o cupom FRETEGRATIS
Então o frete é "Grátis" independentemente da região
```

**AC-05.5 — Recalcular**
```gherkin
Dado que o frete já foi calculado
Quando altero itens ou cupom
Então o frete é recalculado automaticamente para o mesmo CEP
```

## Restrições
- Sem integração com Correios nesta versão: tabela fixa (RN-18).
- O prazo é exibido em dias úteis.

## Fora de escopo
- Frete expresso, retirada em loja (previsto para a v1.5 — ver PR-102).
