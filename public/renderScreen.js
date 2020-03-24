export default function renderScreen(screen, game, requestAnimationFrame, currentPlayerId) {
    
    requestAnimationFrame(() => {
        renderScreen(screen, game, requestAnimationFrame, currentPlayerId);
    });
}
