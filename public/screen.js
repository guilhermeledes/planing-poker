export default function createScreen(document, game, currentPlayerId) {
    const $ = document.querySelectorAll.bind(document);
    const pokerTable = $('#poker-table', document)[0];
    const state = {
        pokerTable,
        playerCards: {},
        players: {}
    }

    const observers= [];

    function subscribe(observerFunction) {
        observers.push(observerFunction);
    }

    function notifyAll(command) {

        for (const observerFunction of observers) {
            observerFunction(command);
        }
    }

    for (const playerId in game.state.players) {
        const player = game.state.players[playerId];
        addPlayer(player);
    }

    const renderingCommands = {
        'add-player': (command) => {
            const playerId = command.playerId;
            const player = game.state.players[playerId];
            if (!player.playerHtml) {
                addPlayer(player);
                if (playerId === currentPlayerId) {
                    $('#player-identification', document)[0].remove();
                    addPlayerHand();
                }
            }
        },
        'remove-player': (command) => {
            const playerId = command.playerId;
            const player = state.players[playerId];
            if (player) player.html.remove();
        },
        'player-ready': (command) => {
            const playerId = command.playerId;
            playerReady(playerId);
        },
        'show-game-result': (command) => {
            showGameResult(command.state);
        }
    }

    game.subscribe((command) => {
        const renderFuncion = renderingCommands[command.type];
        if (renderFuncion) {
            console.log(`Rendering ${command.type}`);
            renderFuncion(command);
        }
    });

    function playerReady(playerId) {
        state.players[playerId].html.classList.add('ready');
    }

    function showGameResult(command) {
        setPlayedCardsValue(command.players);
        showHands();

        let gameResultCard = document.createElement('div');
        gameResultCard.id = 'game-result';
        gameResultCard.innerHTML = `
            <span class="result">Resultado</span>
            ${getSimpleCardHtml(command.result)}`;

        state.pokerTable.append(gameResultCard);
    }

    function setPlayedCardsValue(players) {
        for (const playerId in players) {
            const player = Object.assign(state.players[playerId], players[playerId]);
            let card = game.cards[player.estimateCard];
            player.html.querySelector('.card-game-back .card-game-label').innerHTML = card.display;
        }
    }

    async function showHands() {
        state.pokerTable.classList.add('show-all');
        for (const playerId in state.players) {
            await sleep(100);
            if (state.players.hasOwnProperty(playerId)) {
                const player = state.players[playerId];
                player.html.classList.add('show');
            }
        }
    }

    function addPlayer(player) {
        const playerId = player.playerId;
        let playerHtml = document.createElement('div');
        playerHtml.classList.add('player')
        playerHtml.title = player.playerName;
        playerHtml.innerHTML = `
            <div class="card-game">
                <div class="card-game-inner">
                    <div class="card-game-front">
                        <div class="card-game-fill">
                            <span class="card-game-label waiting">?</span>
                            <span class="card-game-label ready"><i class="fa fa-thumbs-o-up" aria-hidden="true"></i></span>
                        </div>
                    </div>
                    <div class="card-game-back">
                        <div class="card-game-fill">
                            <span class="card-game-label"></span>
                        </div>
                    </div>
                </div>
            </div>
            <span class="player-name">${player.playerName}</span>
        `;
        state.pokerTable.append(playerHtml);
        state.players[playerId] = Object.assign({ html: playerHtml }, player);
        if (player.ready) playerReady(playerId)
    }

    async function addPlayerHand() {
        let playerHand = document.createElement('div');
        playerHand.id = 'player-hand';
        $('body')[0].append(playerHand);

        for (const cardId in game.cards) {
            await sleep(100);
            let card = game.cards[cardId];
            let cardHtml = document.createElement('div');
            cardHtml.classList.add('hand');
            cardHtml.innerHTML = getSimpleCardHtml(card.display);

            playerHand.append(cardHtml);
            state.playerCards[cardId] = Object.assign({ html:cardHtml }, card);
            state.playerHand = playerHand;

            cardHtml.addEventListener('click', () => {
                notifyAll({
                    type: 'card-click',
                    playerId: currentPlayerId,
                    cardId
                });
            });
        }
    }

    function sleep(ms) {
        return new Promise(resolve => {
            setTimeout(function(){resolve(() => {});},ms);
        });
    }

    function getSimpleCardHtml(cardLabel) {
        return `
            <div class="card-game">
                <div class="card-game-inner">
                    <div class="card-game-front">
                        <div class="card-game-fill">
                            <span class="card-game-label waiting">${cardLabel}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    return {
        subscribe
    }
}
