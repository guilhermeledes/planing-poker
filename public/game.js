export default function createGame() {
    const state = {
        players: {},
        round: {}
    }

    const cards = {
        1: {display: '0', value: 0},
        2: {display: '½', value: .5},
        3: {display: '1', value: 1},
        4: {display: '2', value: 2},
        5: {display: '3', value: 3},
        6: {display: '5', value: 5},
        7: {display: '8', value: 8},
        8: {display: '13', value: 13},
        9: {display: '20', value: 20},
        10: {display: '40', value: 40},
        11: {display: '90', value: 90},
        12: {display: '100', value: 100},
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

        state.players[playerId] = { playerId, playerName };

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

    return {
        addPlayer,
        removePlayer,
        state,
        subscribe,
        setState,
        cards
    }
}