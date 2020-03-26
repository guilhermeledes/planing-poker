export default function createGame() {
    const state = {
        players: {},
        result: undefined
    }

    const cards = {
        1: {display: '1', value: 1},
        2: {display: '2', value: 2},
        3: {display: '3', value: 3},
        4: {display: '5', value: 5},
        5: {display: '8', value: 8},
        6: {display: '13', value: 13},
        7: {display: '20', value: 20},
        8: {display: '40', value: 40},
        9: {display: '80', value: 80},
    }

    function setState(newState) {
        Object.assign(state, newState);
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

    function addPlayer(command) {
        const playerId = command.playerId;
        const playerName = command.playerName;

        state.players[playerId] = { playerId, playerName, ready: false };

        notifyAll({
            type: 'add-player',
            playerId,
            playerName
        });
    }

    function removePlayer(command) {
        const playerId = command.playerId;

        delete state.players[playerId];

        notifyAll({
            type: 'remove-player',
            playerId
        });
    }

    function estimate(command) {
        const playerId = command.playerId;
        const cardId = command.cardId;

        state.players[playerId].estimateCard = cardId;

        playerReady(playerId);
        if (isGameFinished()) calculateGameResult();
    }

    function playerReady(playerId) {
        state.players[playerId].ready = true;

        notifyAll({
            type: 'player-ready',
            playerId
        });
    }

    function isGameFinished() {
        let gameFinished = true;
        for (const playerId in state.players) {
            const player = state.players[playerId];
            if (!player.estimateCard) {
                gameFinished = false;
                break;
            }
        }
        return gameFinished;
    }

    function calculateGameResult() {
        let totalEstimate = 0;
        for (const playerId in state.players) {
            if (state.players.hasOwnProperty(playerId)) {
                const player = state.players[playerId];
                const card = cards[player.estimateCard];
                totalEstimate += card.value;
            }
        }
        const playerQuantity = Object.keys(state.players).length;

        state.result = Math.ceil(totalEstimate / playerQuantity);

        showGameResult({ state });
    }

    function showGameResult(command) {
        notifyAll({
            type: 'show-game-result',
            state: command.state
        });
    }

    function restart() {
        state.result = undefined;
        for (const playerId in state.players) {
            if (state.players.hasOwnProperty(playerId)) {
                resetPlayer(playerId);
            }
        }
        notifyAll({
            type: 'restart-game',
            state
        });
    }

    function resetPlayer(playerId) {
        const player = state.players[playerId];
        player.ready = false;
        delete player.estimateCard;
    }

    return {
        addPlayer,
        removePlayer,
        estimate,
        restart,
        playerReady,
        showGameResult,
        state,
        subscribe,
        setState,
        cards
    }
}