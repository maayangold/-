document.addEventListener('DOMContentLoaded', function () {
    const setupForm = document.getElementById('setupForm');
    const computer = document.getElementById('computer');
    const player1 = document.getElementById('player1');
    const player2 = document.getElementById('player2');

    setupForm.addEventListener('submit', function (event) {
        event.preventDefault();

        if (computer.checked) {
            player2.value = "המחשב";
        }

        let url = `game.html?player1=${encodeURIComponent(player1.value)}&player2=${encodeURIComponent(player2.value)}`;

        window.location.href = url;
    });

    computer.addEventListener('change', function () {
        if (computer.checked) {
            player2.disabled = true;
            player2.value = 'מחשב';
        } else {
            player2.disabled = false;
            player2.value=null
        }
    });
});
