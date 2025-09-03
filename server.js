// Importa le librerie necessarie
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

// Crea un'applicazione Express
const app = express();
// Serve i file statici dalla cartella 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Crea un server HTTP dall'app Express
const server = http.createServer(app);

// Crea un server WebSocket e lo collega al server HTTP
const wss = new WebSocket.Server({ server });

console.log("Server WebSocket in ascolto...");

// Gestisce le connessioni in entrata
wss.on('connection', (ws) => {
    console.log('Nuovo client connesso');

    // Gestisce i messaggi ricevuti da un client
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            console.log('Messaggio ricevuto:', data);

            // Inoltra il messaggio a tutti i client connessi
            // Questo permette al viewer di ricevere i buzz dai giocatori
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(data));
                }
            });

        } catch (error) {
            console.error('Errore nel parsing del messaggio:', error);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnesso');
    });

    ws.on('error', (error) => {
        console.error('Errore WebSocket:', error);
    });
});

// Avvia il server sulla porta 3000
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server avviato su http://localhost:${PORT}`);
    console.log(`Pagina Viewer: http://localhost:${PORT}/viewer.html`);
    console.log(`Pagine Giocatori: http://localhost:${PORT}/player.html?id=1 (cambiare id da 1 a 8)`);
});

