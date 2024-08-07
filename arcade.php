<!DOCTYPE HTML>
<html>
<head>
    <meta charset="UTF-8" /> 
    <title>Darts arcade 301/501 calculator</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="arcade.css" />
    <script src="jquery-3.1.1.min.js"type="text/javascript"></script>
    <script src="arcade.js" type="text/javascript"></script>
</head>

<body>
    <?php include '../includes/header.php'; ?>
    <div class="content">
        <div class="keyboard">
            <div class="btn dbl">x2</div>
            <div class="btn trpl">x3</div>
            <div class="btn number">1</div>
            <div class="btn number">2</div>
            <div class="btn number">3</div>
            <div class="btn number">4</div>
            <div class="btn number">5</div>
            <div class="btn number">6</div>
            <div class="btn number">7</div>
            <div class="btn number">8</div>
            <div class="btn number">9</div>
            <div class="btn number">10</div>
            <div class="btn number">11</div>
            <div class="btn number">12</div>
            <div class="btn number">13</div>
            <div class="btn number">14</div>
            <div class="btn number">15</div>
            <div class="btn number">16</div>
            <div class="btn number">17</div>
            <div class="btn number">18</div>
            <div class="btn number">19</div>
            <div class="btn number">20</div>
            <div class="btn number">0</div>
            <div class="btn be25">25</div>
            <div class="btn be50">50</div>
            <div class="btn del">&lt;&lt;</div>
        </div>


        <div class="viewport">
            <div class="header">
                <div class="rounds"></div>
                <div class="gamemenu-toggle" title="show/hide game management controls">&#9776;</div>
            </div>
            <div class="players"></div>
        </div>

        <div class="settings">
            <label>
                <span class="lbl-column">Players:</span>
                <select id="players-total">
                    <option selected="selected" value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                </select>
            </label>
            <label>
                <span class="lbl-column">Rounds:</span>
                <input type="text" id="totalRounds" value="10" />
            </label>
            <label>
                <span class="lbl-column">Total scores: </span>
                <select id="totalscores">
                    <option selected="selected" value="301">301</option>
                    <option value="501">501</option>
                </select>
            </label>
            <label>
                <span class="lbl-column">Doubles to finish: </span>
                <input type="checkbox" id="doublesEnd" />
            </label>
            <label>
                <span class="lbl-column">Nullify other players: </span>
                <input type="checkbox" id="nullify" checked="checked" />
            </label>
            <label>
                <span class="lbl-column">Synchrnoyze id: </span>
                <input type="text" id="scoresId" checked="checked" readonly />
            </label>
            <label>
                <span class="lbl-column">Send scores online: </span>
                <input type="checkbox" id="sendOnline" />
            </label>
            <div>
                <span class="lbl-column"></span>
                <button id="cta-start" type="button">Start</button>
            </div>
        </div>
    </div>

    <div id="defaults">
        <div class="player">
            <div class="container">
                <div class="throws">
                    <div class="throw throw1"></div>
                    <div class="throw throw2"></div>
                    <div class="throw throw3"></div>
                </div>
                <div class="name">
                    <input type="text" />
                    <span></span>
                </div>
                <div class="scores-container">
                    <div class="scores">301</div>
                    <div class="remaining">301</div>
                    <div class="nullify"></div>
                </div>  
            </div>
        </div>
    </div>

</body>
</html>