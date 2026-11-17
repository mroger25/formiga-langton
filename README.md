# 🐜 Formiga de Langton

Implementação da **Formiga de Langton** — um autômato celular de duas regras — em HTML, CSS e JavaScript puro.

## Regras

- **Regra 1:** em um quadrado apagado, a formiga vira à direita, acende o quadrado e anda para frente.
- **Regra 2:** em um quadrado aceso, a formiga vira à esquerda, apaga o quadrado e anda para frente.

Apesar da simplicidade, o comportamento emerge em três fases: simetria inicial, caos e, após ~10.000 passos, uma "autoestrada" periódica.

## Como executar

Basta abrir `index.html` no navegador, ou visitar a versão online em **[mroger25.github.io/formiga-langton](https://mroger25.github.io/formiga-langton)**.

## Controles

- **Iniciar / Pausar** (ou barra de espaço)
- **Reiniciar** (ou tecla R)
- Slider de velocidade (1–5000 passos por frame)

## Licença

MIT