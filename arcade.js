$(document).ready(function() {
    var $player = $('#defaults .player');
    var $currentPlayer = null;
    var $activePlayer = null;
    var gameInProgress = false;
    var currentPlayerNum = 0;
    var currentRound = 0;
    var scoring = [];
    var scoresId = '';
    var token = '';
    var multiplier = 1;
    var settings = {
        playersTotal: 2,
        totalscores: 301,
        nullify: false,
        totalRounds: 10,
        doublesEnd: true
    };

    // Funktion för att spara spelets tillstånd
    function saveGameState() {
        const gameState = {
            players: [],
            rounds: $('.rounds').html(),
            settings: {
                playersTotal: $('#players-total').val(),
                totalRounds: $('#totalRounds').val(),
                totalScores: $('#totalscores').val(),
                doublesEnd: $('#doublesEnd').prop('checked'),
                nullify: $('#nullify').prop('checked'),
                sendOnline: $('#sendOnline').prop('checked'),
                scoresId: $('#scoresId').val()
            },
            gameInProgress: gameInProgress,
            scoring: scoring,
            currentPlayerNum: currentPlayerNum,
            currentRound: currentRound
        };

        $('.player').each(function() {
            const $player = $(this);
            const playerData = {
                name: $player.find('.name input').val(),
                scores: $player.find('.scores').text(),
                remaining: $player.find('.remaining').text(),
                throws: [
                    $player.find('.throw1').text(),
                    $player.find('.throw2').text(),
                    $player.find('.throw3').text()
                ]
            };
            gameState.players.push(playerData);
        });

        localStorage.setItem('gameState', JSON.stringify(gameState));
        console.log('Game state saved:', gameState);
    }

    // Funktion för att ladda spelets tillstånd
    function loadGameState() {
        const gameState = JSON.parse(localStorage.getItem('gameState'));
        if (!gameState) {
            console.log('No game state found in localStorage.');
            return;
        }

        console.log('Game state loaded:', gameState);

        $('.rounds').html(gameState.rounds);

        $('#players-total').val(gameState.settings.playersTotal);
        $('#totalRounds').val(gameState.settings.totalRounds);
        $('#totalscores').val(gameState.settings.totalScores);
        $('#doublesEnd').prop('checked', gameState.settings.doublesEnd);
        $('#nullify').prop('checked', gameState.settings.nullify);
        $('#sendOnline').prop('checked', gameState.settings.sendOnline);
        $('#scoresId').val(gameState.settings.scoresId);

        gameInProgress = gameState.gameInProgress;
        scoring = gameState.scoring || [];
        currentPlayerNum = gameState.currentPlayerNum || 0;
        currentRound = gameState.currentRound || 0;

        const $playersContainer = $('.players');
        $playersContainer.html('');
        gameState.players.forEach(function(playerData) {
            const $player = $('<div class="player">').html(`
                <div class="container">
                    <div class="throws">
                        <div class="throw throw1">${playerData.throws[0]}</div>
                        <div class="throw throw2">${playerData.throws[1]}</div>
                        <div class="throw throw3">${playerData.throws[2]}</div>
                    </div>
                    <div class="name">
                        <input type="text" value="${playerData.name}" />
                        <span>${playerData.name}</span>
                    </div>
                    <div class="scores-container">
                        <div class="scores">${playerData.scores}</div>
                        <div class="remaining">${playerData.remaining}</div>
                        <div class="nullify"></div>
                    </div>  
                </div>
            `);
            $playersContainer.append($player);
        });

        if (scoring.length > 0) {
            render_scoring(); // Uppdatera poäng och UI efter att spelets tillstånd har laddats
        }
    }

    // Ladda spelets tillstånd när sidan laddas
    loadGameState();

    // Spara spelets tillstånd varje gång något ändras
    $('.btn').on('click', saveGameState);
    $('#cta-start').on('click', function() {
        game_start();
        saveGameState();
    });
    $(document).on('input', '.name input', saveGameState);

    // Ställ in checkboxen baserat på settings.nullify
    $('#nullify').prop('checked', settings.nullify);

    var valid_null_results = [];
    for (var i = 1; i <= 20; i++) {
        valid_null_results.push(i);
        valid_null_results.push(i * 2);
        valid_null_results.push(i * 3);
    }
    valid_null_results.push(25);
    valid_null_results.push(50);

    if ($('#sendOnline').prop('checked')) {
        get_scores_id();
    }

    $('#sendOnline').change(function() {
        if ($(this).prop('checked')) {
            if (scoresId === '') {
                get_scores_id();
            }
            set_indicator('loading', 'Loading data...')
        } else {
            set_indicator('disabled', '')
        }
    });

    $('#cta-start').click(function() {
        clear_multipliers();
        if ('Reset' === $(this).html()) {
            game_reset();
            saveGameState();
        } else {
            game_start();
            saveGameState();
        }
    });

    function render_scoring() {
        $('.players .name').each(function() {
            $(this).find('span').text(
                $(this).find('input').val()
            );
        });

        var players = $('.player');

        players.each(function(index) {
            var $player = $(this);
            $player.find('.scores').text('0');
            $player.find('.remaining').text(settings.totalscores);
            $player.removeClass('winner');
            $player.find('.throw1').text('');
            $player.find('.throw2').text('');
            $player.find('.throw3').text('');
        });

        for (var i = 0; i < scoring.length; i++) {
            set_player(i);

            if ($currentPlayer.hasClass('winner')) {
                continue;
            }

            var $scores = $currentPlayer.find('.scores');
            var scores = parseInt($scores.text());
            var $remaining = $currentPlayer.find('.remaining');
            var remaining = parseInt($remaining.text());

            if (i % 3 === 0) {
                $currentPlayer.find('.throw1').text('');
                $currentPlayer.find('.throw2').text('');
                $currentPlayer.find('.throw3').text('');
            }

            var scoresObj = score_add_revert(scores, scoring[i]);
            scores = scoresObj.value;

            $scores.text(scores);
            remaining = settings.totalscores - scores;
            $remaining.text(remaining);

            var currentThrow = i % 3 + 1;
            var $currentThrow = $currentPlayer.find('.throw' + currentThrow);
            $currentThrow.text(score_get_text_value(scoring[i]));

            if (remaining === 0) {
                $currentPlayer.addClass('winner');
                $currentPlayer.find('.throw1').text('');
                $currentPlayer.find('.throw2').text('');
                $currentPlayer.find('.throw3').text('');
                i = Math.floor((i + 3) / 3) * 3 - 1;
            }
        }

        players.removeClass('current');
        currentRound = Math.floor(scoring.length / (3 * settings.playersTotal)) + 1;

        if (currentRound > settings.totalRounds) {
            gameInProgress = false;
            var maxScores = 0;
            var winnerIndex = 0;
            for (i = 0; i < settings.playersTotal; i++) {
                var $nextPlayer = $('#player' + i);
                var currentScores = parseInt($nextPlayer.find('.scores').text());
                if (currentScores > maxScores) {
                    maxScores = currentScores;
                    winnerIndex = i;
                }
            }
            var $nextPlayer = $('#player' + winnerIndex);
            $nextPlayer.addClass('winner');
            send_scores();
            return;
        }

        set_player();
        nullify_show_others();
        $currentPlayer.addClass('current');
        $('.rounds').html('Round ' + currentRound + '/' + settings.totalRounds);
        send_scores();
    }

    function nullify_show_others(nullifyScores) {
        if (!settings.nullify) return;
        var scores = parseInt($currentPlayer.find('.scores').text());
        for (var j = 0; j < settings.playersTotal; j++) {
            var $nullingPlayer = $('#player' + j);
            if ($nullingPlayer.attr('id') === $currentPlayer.attr('id')) {
                $nullingPlayer.find('.nullify').text('');
                continue;
            }
            var nScores = parseInt($nullingPlayer.find('.scores').text());
            $nullingPlayer.find('.nullify').text(score_validate_positive(nScores - scores));
            if (nullifyScores && nScores - scores === 0) {
                $nullingPlayer.find('.scores').text(0);
                $nullingPlayer.find('.remaining').text(settings.totalscores);
            }
        }
    }

    function game_start() {
        $('#cta-start').html('Reset');
        $('.settings').slideUp(200);
        gameInProgress = true;
        settings.playersTotal = $('#players-total').val();
        settings.totalscores = parseInt($('#totalscores').val());
        settings.totalRounds = parseInt($('#totalRounds').val());
        settings.doublesEnd = $('#doublesEnd').prop('checked');
        settings.nullify = $('#nullify').prop('checked');

        $('.players').html('');
        $player.find('.scores').html('0');
        $player.find('.remaining').html(settings.totalscores);
        for (var i = 0; i < settings.playersTotal; i++) {
            var $anotherPlayer = $player.clone();
            $anotherPlayer.attr('id', 'player' + i);
            $('.players').append($anotherPlayer);
            $anotherPlayer.find('.name input').val('Player ' + (i + 1));
            $anotherPlayer.find('.name input').on('focus', function() { $(this).select(); });
        }
        $('#player0').addClass('current');
        $('.rounds').html('Round '+ 1 + '/' + settings.totalRounds);

        saveGameState(); // Spara spelets tillstånd när spelet startar
    }

    function game_reset() {
        if (!confirm('Are you sure?')) return;
        $('#cta-start').html('Start');
        gameInProgress = false;
        $('.players').html('');
        $('.rounds').text('');
        currentRound = 0;
        scoring = [];
        saveGameState(); // Spara spelets tillstånd när spelet återställs
    }

    function set_player(i) {
        if (typeof i === 'undefined' || i === null) {
            currentPlayerNum = Math.floor(scoring.length / 3) % settings.playersTotal;
        } else {
            currentPlayerNum = Math.floor(i / 3) % settings.playersTotal;
        }
        $currentPlayer = $('#player' + currentPlayerNum);

        while ($currentPlayer.hasClass('winner')) {
            currentPlayerNum = (currentPlayerNum + 1) % settings.playersTotal;
            $currentPlayer = $('#player' + currentPlayerNum);
        }
    }

    function clear_multipliers() {
        $('.dbl, .trpl').removeClass('active');
        multiplier = 1;
    }

    function score_add_revert(scores, throww) {
        if (throww === 'X') {
            return {'value': scores, 'overridden': false};
        }
        var scores_throwed = parseInt(throww.mult * throww.val);
        var s = scores + scores_throwed;

        if (s === settings.totalscores) {
            if (throw_can_end_turn(throww)) return {'value': s, 'overridden': false};
            return {'value': s - scores_throwed, 'overridden': true};
        }

        if (settings.doublesEnd && s === settings.totalscores - 1) {
            return {'value': s - scores_throwed, 'overridden': true};
        }

        if (s > settings.totalscores) {
            s = 2 * settings.totalscores - s;
            return {'value': s, 'overridden': true};
        }
        return {'value': s, 'overridden': false};
    }

    function throw_can_end_turn(throww) {
        if (!settings.doublesEnd) return true;
        if ([25, 50].includes(throww.val)) return true;
        if ([2, 3].includes(throww.mult)) return true;
        return false;
    }

    function score_get_text_value(element) {
        var result = parseInt(element.val);
        if (isNaN(result)) return element.val;
        return element.mult * element.val;
    }

    function score_validate_positive(score) {
        if (!valid_null_results.includes(score)) return '';
        return score;
    }

    function parseIntt(number) {
        var result = parseInt(number);
        if (isNaN(number)) return 0;
        return result;
    }

    $('#totalRounds').on('focus', function() {
        $(this).select();
    });

    $('.gamemenu-toggle').on('click', function(event) {
        event.stopImmediatePropagation();

        var $toggleButton = $(this);
        var $settingsPanel = $('.settings');
        
        var offset = $toggleButton.offset();
        var top = offset.top + $toggleButton.outerHeight();
        var left = offset.left + $toggleButton.outerWidth() - $settingsPanel.outerWidth();
        
        $settingsPanel.css({
            top: top,
            left: left
        });

        $settingsPanel.slideToggle(200);
    });

    $('.settings').on('click', function(event) {
        event.stopImmediatePropagation();
    });

    $('body').on('click', function() {
        if ($('.settings').is(':visible')) {
            $('.settings').slideUp(200);
        }
    });

    // New script for the hamburger menu
    document.addEventListener('DOMContentLoaded', function() {
        var menuToggle = document.querySelector('.menu-toggle');
        var nav = document.querySelector('nav ul');

        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('showing');
        });
    });

    function get_scores_id() {
        set_indicator('loading', 'Loading data...');
        $.get("scores.php?action=get&data=id", function(response) {
            var data = JSON.parse(response);
            if (data.status === 'OK') {
                scoresId = data.body.id;
                token = data.body.token;
                $('#scoresId').val(scoresId);
                set_indicator('ok', data.msg);
            } else {
                set_indicator('error', data.msg);
            }
        }).fail(function() {
            set_indicator('error', 'Connection error');
        });
    }

    function send_scores() {
        if (scoresId === '') return;
        if (!$('#sendOnline').prop('checked')) return;

        var post = {
            id: scoresId,
            token: token,
            game: 'arcade',
            data: $('.viewport').html()
        };
        set_indicator('loading', 'Loading response...');
        $.post("scores.php?action=put", post, function(response) {
            var data = JSON.parse(response);
            if (data.status === 'OK') {
                set_indicator('ok', 'Scores sent');
            } else {
                set_indicator('error', data.msg);
                console.log(response);
            }
        }).fail(function() {
            set_indicator('error', 'Connection error');
        }, 'json');
    }

    function set_indicator(state, message) {
        $('.header').attr('title', message);
        switch (state) {
            case 'ok':
                $('.header').css('background-image', "url('images/state_ok.png')");
                break;
            case 'loading':
                $('.header').css('background-image', "url('images/state_loading.png')");
                break;
            case 'disabled':
                $('.header').css('background-image', "none");
                break;
            default:
                $('.header').css('background-image', "url('images/state_error.png')");
                break;
        }
    }
});
