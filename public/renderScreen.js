export default function renderScreen(screen, game, requestAnimationFrame, currentPlayerId) {
    const $ = screen.querySelectorAll.bind(screen);

    let pokerTable = $('#poker-table', screen)[0];

    $('.player', pokerTable).forEach(playerHtml => {
        let exists = false;
        for (const playerId in game.state.players) {
            const player = game.state.players[playerId];
            if (player.playerHtml == playerHtml) exists = true;
        }
        if (!exists) playerHtml.remove();
    });

    for (const playerId in game.state.players) {
        const player = game.state.players[playerId];
        if (!player.playerHtml) {
            addPlayer(player);
            if (playerId === currentPlayerId) {
                $('#player-identification', screen)[0].remove();
                addPlayerHand();
            }
        }
    }

    function addPlayer(player) {
        let playerHtml = document.createElement('div');
        playerHtml.classList.add('player')
        playerHtml.innerHTML = `
            <div class="card-game">
                <div class="card-game-inner">
                    <div class="card-game-front">
                        <div class="card-game-fill">
                            <span class="card-game-label waiting">?</span>
                            <span class="card-game-label confirmed"><i class="fa fa-thumbs-o-up" aria-hidden="true"></i></span>
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
        pokerTable.append(playerHtml);
        game.state.players[player.playerId].playerHtml = playerHtml;
    }

    function addPlayerHand() {
        let playerHand = document.createElement('div');
        playerHand.id = 'player-hand';
        $('body', screen)[0].append(playerHand);

        for (const cardId in game.cards) {
            const card = game.cards[cardId];
            let cardHtml = document.createElement('div');
            cardHtml.classList.add('hand')
            cardHtml.innerHTML = `
                <div class="card-game">
                    <div class="card-game-inner">
                        <div class="card-game-front">
                            <div class="card-game-fill">
                                <span class="card-game-label waiting">${card.display}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            playerHand.append(cardHtml);
        }
    }

    requestAnimationFrame(() => {
        renderScreen(screen, game, requestAnimationFrame, currentPlayerId);
    });
}
