# YT-Audio-Capture

## Descrição

O **YT-Audio-Capture** é uma ferramenta utilitária leve projetada para ser executada diretamente no console do navegador. Ele utiliza a API *MediaRecorder* em conjunto com a captura de streams de mídia para registrar o áudio de streams ativos em uma página web (como vídeos ou webinares) e exportá-los de forma prática e imediata.

Esta ferramenta é ideal para pesquisadores e usuários que precisam de uma solução rápida e transparente de gravação, sem a necessidade de instalar extensões de terceiros ou softwares complexos de captura de áudio.

## Arquitetura e APIs Nativas Consumidas

Para garantir máxima segurança, performance e transparência, o script foi desenvolvido em **Vanilla JavaScript** e não depende de nenhuma biblioteca de terceiros, extensão ou comunicação com servidores externos. Todo o processamento ocorre no lado do cliente (*client-side*) utilizando as seguintes interfaces nativas dos navegadores modernos:

* **DOM API:** Responsável por localizar o elemento de mídia alvo (a tag de vídeo) na página e por construir dinamicamente o painel visual flutuante de gravação (UI) sem a necessidade de injetar HTML bruto via `innerHTML`.
* **Media Capture API:** Emprega o método `captureStream()` para interceptar e extrair as faixas de áudio que o próprio navegador já decodificou, redirecionando esse fluxo.
* **MediaRecorder API:** Atua como o motor de codificação. Ele recebe a stream de áudio e a empacota continuamente em pequenos pacotes de dados (*chunks*) dentro de um formato estruturado, como `audio/webm`.
* **Blob e URL API:** Utilizadas no processo de finalização para pegar todos os dados armazenados na memória (RAM), convertê-los em um objeto de arquivo real (*Blob*) e gerar um link temporário (*ObjectURL*) para disparar o download automático.

## O Paradigma de Listeners (Eventos)

O script utiliza o paradigma de *Listeners* (ouvintes de eventos), um conceito fundamental da programação orientada a eventos. Nesse modelo, o programa permanece "observando" determinados eventos e executa uma função específica quando eles acontecem. Neste caso, eventos nativos de mídia, como `play`, `pause` e `ended`, são monitorados por *listeners* para que o script possa reagir automaticamente às mudanças no estado de reprodução.

Por exemplo, quando o vídeo é pausado, o *listener* associado ao evento `pause` é acionado e inicia uma contagem regressiva de 10 segundos. Quando a reprodução é retomada, o *listener* do evento `play` cancela essa contagem. Dessa forma, o script não precisa verificar continuamente o estado do vídeo através de *loops* pesados, podendo reagir diretamente e de forma otimizada aos gatilhos emitidos pelo elemento.

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
- **Injete o Código:** Abra o arquivo `yt-audio-capture.js` presente nos arquivos deste repositório, copie todo o seu conteúdo, volte à aba do vídeo, cole o código no console e pressione `Enter`.
- **Acompanhe o Progresso:** Fique atento aos logs exibidos no console; eles indicarão o status da gravação, erros ou avisos importantes. O script adicionará um indicador visual na tela.
  - *Atenção:* Se você pausar o vídeo, o script iniciará uma contagem regressiva de 10 segundos antes de finalizar a gravação automaticamente. Se a reprodução for retomada dentro desse intervalo, a contagem é cancelada e a gravação segue normalmente.

---

## ⚠️ Avisos / Disclaimer

> **Importante:** Este script foi desenvolvido exclusivamente para fins educacionais e de produtividade pessoal.

- O usuário é o único responsável por garantir que a captura de áudio esteja em conformidade com as leis de direitos autorais e termos de serviço dos sites visitados.
- Não utilize esta ferramenta para distribuir conteúdo protegido sem a devida autorização dos detentores dos direitos.
- O desenvolvedor não se responsabiliza por qualquer uso indevido ou violação de termos de terceiros.
