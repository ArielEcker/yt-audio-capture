# YT-Audio-Capture

## Descrição
O **YT-Audio-Capture** é uma ferramenta utilitária leve projetada para ser executada diretamente no console do navegador. Ele utiliza a API *MediaRecorder* em conjunto com a captura de streams de mídia para registrar o áudio de streams ativos em uma página web (como vídeos ou webinares) e exportá-los de forma prática e imediata.

O script também utiliza o paradigma de *Listeners* (ouvintes de eventos), um conceito fundamental da programação orientada a eventos. Nesse modelo, o programa permanece "observando" determinados eventos e executa uma função específica quando eles acontecem. Neste caso, eventos como `play`, `pause` e `ended` são monitorados por listeners para que o script possa reagir automaticamente às mudanças no estado de reprodução do vídeo.

Por exemplo, quando o vídeo é pausado, o listener associado ao evento `pause` é acionado e inicia a contagem regressiva de 10 segundos. Quando a reprodução é retomada, o listener do evento `play` cancela essa contagem. Dessa forma, o script não precisa verificar continuamente o estado do vídeo, podendo reagir diretamente aos eventos emitidos pelo elemento.

Esta ferramenta é ideal para usuários que precisam de uma solução rápida de gravação sem a necessidade de instalar extensões de terceiros ou softwares complexos de captura de áudio.

---

## Funcionalidades

- **Captura via Stream:** Grava diretamente o fluxo de áudio processado pelo navegador, garantindo fidelidade sonora.
- **Detecção Automática de Formato:** Identifica os tipos MIME suportados pelo navegador (como `audio/webm` ou `audio/ogg`) para máxima compatibilidade.
- **Interface Visual Integrada:** Cria um painel flutuante de controle na página para iniciar e interromper a gravação de forma intuitiva.
- **Download Automático:** Gera e dispara o download do arquivo de áudio instantaneamente após a finalização da captura.

---

## Como Usar

Siga os passos abaixo para utilizar o script em qualquer página compatível:

- **Acesse a página:** Abra o vídeo no YouTube pelo navegador Chrome. *Importante:* O script funciona como um listener (ouvinte), portanto, o vídeo precisa estar sendo executado para que a captura do áudio ocorra.
- **Abra o Console:** Você pode abrir o console clicando com o botão direito em qualquer parte da página e selecionando "Inspecionar" (Inspect) > aba "Console", ou utilizando o atalho do teclado (`Ctrl+Shift+I` ou `F12` no Windows/Linux, `Cmd+Option+I` no macOS).
- **Limpe o Console:** Antes de colar o código, clique no ícone de "Limpar console" (geralmente um círculo com um traço ou vassoura) para garantir uma visualização limpa dos logs.
- **Injete o Código:** Copie o script, cole-o no console e pressione `Enter`.
- **Acompanhe o Progresso:** Fique atento aos logs exibidos no console; eles indicarão o status da gravação, erros ou avisos importantes. O script adicionará um indicador visual na tela.
  - *Atenção:* Se você pausar o vídeo, o script iniciará uma contagem regressiva de 10 segundos antes de finalizar a gravação automaticamente. Se a reprodução for retomada dentro desse intervalo, a contagem é cancelada e a gravação segue normalmente.

---

## ⚠️ Avisos / Disclaimer

> **Importante:** Este script foi desenvolvido exclusivamente para fins educacionais e de produtividade pessoal.

- O usuário é o único responsável por garantir que a captura de áudio esteja em conformidade com as leis de direitos autorais e termos de serviço dos sites visitados.
- Não utilize esta ferramenta para distribuir conteúdo protegido sem a devida autorização dos detentores dos direitos.
- O desenvolvedor não se responsabiliza por qualquer uso indevido ou violação de termos de terceiros.
