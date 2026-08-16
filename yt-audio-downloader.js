
(function() { 
    const video = document.querySelector('video'); 
    
    if (!video) { 
        return console.error("Nenhum vídeo encontrado."); 
    } 
    
    // ============================================================ 
    // EVITA MÚLTIPLAS GRAVAÇÕES 
    // ============================================================ 
    if (window.__audioRecorderActive) { 
        return console.warn("Já existe uma gravação em andamento."); 
    } 
    window.__audioRecorderActive = true; 
    
    // ============================================================ 
    // CAPTURA O STREAM 
    // ============================================================ 
    let stream; 
    try { 
        stream = video.captureStream(); 
    } catch (e) { 
        console.error("Erro ao capturar o stream.", e); 
        window.__audioRecorderActive = false; 
        return; 
    } 
    
    // ============================================================ 
    // CAPTURA SOMENTE O ÁUDIO 
    // ============================================================ 
    const audioTracks = stream.getAudioTracks(); 
    if (audioTracks.length === 0) { 
        console.error("Nenhuma trilha de áudio encontrada."); 
        window.__audioRecorderActive = false; 
        return; 
    } 
    const audioStream = new MediaStream(audioTracks); 
    
    // ============================================================ 
    // ESCOLHE FORMATO COMPATÍVEL 
    // ============================================================ 
    const formatos = [ 'audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus' ]; 
    const mimeType = formatos.find(tipo => MediaRecorder.isTypeSupported(tipo)); 
    
    if (!mimeType) { 
        console.error("Nenhum formato de áudio compatível."); 
        window.__audioRecorderActive = false; 
        return; 
    } 
    
    // ============================================================ 
    // MEDIA RECORDER 
    // ============================================================ 
    let recorder; 
    try { 
        recorder = new MediaRecorder(audioStream, { mimeType: mimeType, audioBitsPerSecond: 192000 }); 
    } catch (e) { 
        console.error("Erro ao criar MediaRecorder:", e); 
        window.__audioRecorderActive = false; 
        return; 
    } 
    
    const chunks = []; 
    
    // ============================================================ 
    // CRIA INDICADOR SEM innerHTML 
    // ============================================================ 
    const recIndicator = document.createElement('div'); 
    const mainStatus = document.createElement('span'); 
    const pauseStatus = document.createElement('span'); 
    const pauseCounter = document.createElement('b'); 
    
    // Texto inicial 
    mainStatus.textContent = '🔴 GRAVANDO ÁUDIO'; 
    pauseStatus.textContent = '⏸ PAUSADO — '; 
    pauseCounter.textContent = '10s'; 
    pauseStatus.appendChild(pauseCounter); 
    
    // Inicialmente escondido 
    pauseStatus.style.display = 'none'; 
    
    // ============================================================ 
    // MONTA A INTERFACE 
    // ============================================================ 
    recIndicator.appendChild(mainStatus); 
    recIndicator.appendChild(pauseStatus); 
    
    // ============================================================ 
    // ESTILO DO INDICADOR 
    // ============================================================ 
    recIndicator.style.position = 'fixed'; 
    recIndicator.style.top = '20px'; 
    recIndicator.style.right = '20px'; 
    recIndicator.style.zIndex = '999999'; 
    recIndicator.style.display = 'flex'; 
    recIndicator.style.alignItems = 'center'; 
    recIndicator.style.gap = '12px'; 
    recIndicator.style.background = 'rgba(0,0,0,0.88)'; 
    recIndicator.style.color = '#ff3030'; 
    recIndicator.style.padding = '12px 18px'; 
    recIndicator.style.fontFamily = 'Arial, Helvetica, sans-serif'; 
    recIndicator.style.fontSize = '15px'; 
    recIndicator.style.fontWeight = 'bold'; 
    recIndicator.style.borderRadius = '8px'; 
    recIndicator.style.border = '1px solid #ff3030'; 
    recIndicator.style.boxShadow = '0 4px 20px rgba(0,0,0,.45)'; 
    recIndicator.style.userSelect = 'none'; 
    
    pauseStatus.style.color = '#ffcc00'; 
    pauseCounter.style.color = '#ffffff'; 
    pauseCounter.style.fontSize = '16px'; 
    
    document.body.appendChild(recIndicator); 
    
    // ============================================================ 
    // VARIÁVEIS DO CONTADOR 
    // ============================================================ 
    let pauseTimeout = null; 
    let pauseInterval = null; 
    let pauseRemaining = 10; 
    let stopped = false; 
    
    // ============================================================ 
    // LIMPA CONTADOR 
    // ============================================================ 
    function cancelPauseCountdown() { 
        if (pauseTimeout !== null) { 
            clearTimeout(pauseTimeout); 
            pauseTimeout = null; 
        } 
        if (pauseInterval !== null) { 
            clearInterval(pauseInterval); 
            pauseInterval = null; 
        } 
        pauseRemaining = 10; 
        pauseStatus.style.display = 'none'; 
        mainStatus.textContent = '🔴 GRAVANDO ÁUDIO'; 
    } 
    
    // ============================================================ 
    // FINALIZA RECORDER 
    // ============================================================ 
    function stopRecorder(reason) { 
        if (stopped) { return; } 
        stopped = true; 
        cancelPauseCountdown(); 
        console.log("⏹ Encerrando gravação:", reason); 
        
        if (recorder.state === 'recording') { 
            recorder.stop(); 
        } 
    } 
    
    // ============================================================ 
    // INICIA CONTADOR DE 10 SEGUNDOS 
    // ============================================================ 
    function startPauseCountdown() { 
        if (stopped) { return; } 
        
        // Cancela qualquer contador anterior 
        cancelPauseCountdown(); 
        pauseRemaining = 10; 
        pauseStatus.style.display = 'inline'; 
        pauseCounter.textContent = '10s'; 
        console.log("⏸ Vídeo pausado. Você tem 10 segundos para continuar."); 
        
        pauseInterval = setInterval(function() { 
            // Se voltou a tocar 
            if (!video.paused) { 
                cancelPauseCountdown(); 
                console.log("▶️ Reprodução retomada. Contador cancelado."); 
                return; 
            } 
            
            pauseRemaining--; 
            pauseCounter.textContent = pauseRemaining + 's'; 
            console.log("⏳ Encerrando em", pauseRemaining, "segundos"); 
            
            if (pauseRemaining <= 0) { 
                clearInterval(pauseInterval); 
                pauseInterval = null; 
                pauseStatus.style.color = '#ff3030'; 
                pauseStatus.textContent = '⏹ ENCERRANDO...'; 
                stopRecorder('pausa superior a 10 segundos'); 
            } 
        }, 1000); 
    } 
    
    // ============================================================ 
    // EVENTO PAUSE 
    // ============================================================ 
    video.addEventListener('pause', startPauseCountdown); 
    
    // ============================================================ 
    // EVENTO PLAY 
    // ============================================================ 
    function handlePlay() { 
        if (stopped) { return; } 
        cancelPauseCountdown(); 
        console.log("▶️ Vídeo voltou a tocar."); 
    } 
    video.addEventListener('play', handlePlay); 
    
    // ============================================================ 
    // RECEBE CHUNKS 
    // ============================================================ 
    recorder.ondataavailable = function(event) { 
        if (event.data && event.data.size > 0) { 
            chunks.push(event.data); 
            console.log("📦 Chunk:", (event.data.size / 1024).toFixed(1), "KB"); 
        } 
    }; 
    
    // ============================================================ 
    // VÍDEO TERMINOU 
    // ============================================================ 
    function stopOnEnd() { 
        console.log("🏁 Vídeo terminou."); 
        stopRecorder('vídeo terminou'); 
        video.removeEventListener('ended', stopOnEnd); 
    } 
    video.addEventListener('ended', stopOnEnd); 
    
    // ============================================================ 
    // ERRO 
    // ============================================================ 
    recorder.onerror = function(event) { 
        console.error("❌ Erro na gravação:", event.error); 
        stopRecorder('erro no MediaRecorder'); 
    }; 
    
    // ============================================================ 
    // FINALIZAÇÃO 
    // ============================================================ 
    recorder.onstop = function() { 
        cancelPauseCountdown(); 
        window.__audioRecorderActive = false; 
        
        // Remove listeners 
        video.removeEventListener('pause', startPauseCountdown); 
        video.removeEventListener('play', handlePlay); 
        video.removeEventListener('ended', stopOnEnd); 
        
        // Remove indicador 
        if (recIndicator.parentNode) { 
            recIndicator.remove(); 
        } 
        
        if (chunks.length === 0) { 
            console.warn("Nenhum áudio capturado."); 
            return; 
        } 
        
        // ==================================================== 
        // CRIA BLOB 
        // ==================================================== 
        const blob = new Blob(chunks, { type: mimeType }); 
        const url = URL.createObjectURL(blob); 
        
        // ==================================================== 
        // NOME 
        // ==================================================== 
        const tituloLimpo = document.title
            .replace(/[^a-z0-9áéíóúâêîôûãõç\s-]/gi, '')
            .trim()
            .substring(0, 80); 
            
        // ==================================================== 
        // DOWNLOAD 
        // ==================================================== 
        const a = document.createElement('a'); 
        a.href = url; 
        a.download = `${tituloLimpo || 'YT-Audio-Capture'}.webm`; 
        document.body.appendChild(a); 
        a.click(); 
        a.remove(); 
        
        setTimeout(function() { 
            URL.revokeObjectURL(url); 
        }, 10000); 
        
        console.log("================================"); 
        console.log("✅ GRAVAÇÃO CONCLUÍDA"); 
        console.log("🎵 Formato:", mimeType); 
        console.log("📦 Tamanho:", (blob.size / 1024 / 1024).toFixed(2), "MB"); 
        console.log("📥 Download iniciado."); 
        console.log("================================"); 
    }; 
    
    // ============================================================ 
    // INICIA 
    // ============================================================ 
    recorder.start(1000); 
    console.log("🔴 Gravação iniciada."); 
    console.log("⏸ Ao pausar, começa a contagem de 10 segundos."); 
})();
