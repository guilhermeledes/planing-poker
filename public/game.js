export default function createGame() {
    const state = {
        players: {},
        round: {}
    }

    const cards = [0, .5, 1 , 2 , 3 , 5 , 8 , 13 , 20 , 40 , 90 , 100]

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

        state.players[playerId] = {playerName};

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
        setState
    }
}