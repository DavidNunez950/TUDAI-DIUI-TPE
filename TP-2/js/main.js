import { GameBoard } from "./gameBoard.js";
import { Game } from "./game.js";
import { Token } from "./token.js";

document.addEventListener("DOMContentLoaded", ()=> {
    
    const canvas  = document.getElementById("canvas");
    const ctx     = canvas.getContext("2d");

    const screenStart = document.querySelector("#screen-start");
    const screenGame  = document.querySelector("#screen-game");
    
    document.querySelector("#btn-start").addEventListener("click", ()=> {

        screenStart.classList.toggle("d-none");
        screenGame .classList.toggle("d-none");

        let gameInputToken   = document.querySelector("#input-line-token-number");
        let gameInputSize    = document.querySelector("#input-game-board-size");
        let gameInputP1Color = document.querySelector("#player-1 .carousel-inner");
        let gameInputP2Color = document.querySelector("#player-2 .carousel-inner");
        let gameInputP1Image = document.querySelector("#player-1 .active img");
        let gameInputP2Image = document.querySelector("#player-2 .active img");
        let gameInputTime    = document.querySelector("#input-max-time");

        let gameBoardHeight = Number(gameInputSize .selectedOptions[0].getAttribute("data-height"));
        let gameBoardWidth  = Number(gameInputSize .selectedOptions[0].getAttribute("data-width"));
        let lineTokeNumber  = Number(gameInputToken.selectedOptions[0].getAttribute("data-number"));
        let p1Color = gameInputP1Color.getAttribute("data-color");
        let p2Color = gameInputP2Color.getAttribute("data-color");
        let p1Image = "../TP-2/"+gameInputP1Image.getAttribute("src");
        let p2Image = "../TP-2/"+gameInputP2Image.getAttribute("src");
        let time    = gameInputTime.selectedOptions[0].getAttribute("data-time");

        const img1 = new Image();
        const img2 = new Image();
        img1.src = p1Image;
        img2.src = p2Image;

        const game = instantiateGame(gameBoardWidth, gameBoardHeight, lineTokeNumber, p1Color, p2Color, img1, img2, time);
        
        document.getElementById("btn-settings").innerHTML = `
                <div class="row">
                    <div class="col">
                        <button id="btn-restart" class="btn btn-warning rounded-circle text-white">
                            <i class="fas fa-undo"></i>
                        </button>
                    </div>
                    <div class="col">
                        <button id="btn-back-menu" class="btn btn-danger rounded-circle">
                            <i class="fas fa-sign-out-alt"></i>
                        </button>
                    </div>
                </div>`;
        
        canvas.addEventListener("game-changeturn", (e) => {
            let imageTurn = document.querySelector("#img-turn"); 
            imageTurn.style.backgroundColor = e.detail.playerColor;
            imageTurn.setAttribute("src", e.detail.playerImage.src);
        })
        console.log(time)
        // let 
        let curretTime = 60 * time; 
        setInterval(() => {
            document.getElementById("game-timer").innerText = Math.floor((curretTime) /60)+":"+curretTime%60;
            curretTime -= 1;
        }, 1000)

        document.getElementById("btn-restart").addEventListener("click", function(){
            curretTime = 60 * time;
             game.restartGame();
        })
        document.getElementById("btn-back-menu").addEventListener("click", ()=> {
            game.removeEvents.bind(game);
            document.getElementById("btn-settings").innerHTML = "";
            screenStart.classList.toggle("d-none");
            screenGame .classList.toggle("d-none");
        });

        canvas.addEventListener("gameover", (e)=> {
            console.log(e);
            document.querySelector("#gamemessage > p").innerText = e.detail.message;
            console.log(e.detail)
            if(e.detail.playerColor) {
                document.getElementById("img-winner").style.backgroundColor = e.detail.playerColor;
                document.getElementById("img-winner").setAttribute("src",  e.detail.playerImage.getAttribute("src"));
            } 
            document.getElementById("gamemessage").classList.toggle("d-none");
        });
        game.startGame();

    });

    function instantiateGame(xTileNumber, yTileNumber, lineTokenNumber, p1Color, p2Color, p1Img, p2Img, time) {
        xTileNumber = (xTileNumber < lineTokenNumber) ? lineTokenNumber : xTileNumber; 
        yTileNumber = (yTileNumber < lineTokenNumber) ? lineTokenNumber : yTileNumber; 
        let {tileSize, tokenSize, gameBoardSquareCoordinate, player1SquareCoordinate, player2SquareCoordinate} = calculateObjectSize(xTileNumber, yTileNumber);
        console.log(canvas)
        let instantiateToken = (cant, coordinates, color, img) => {
            let tokens = [];
            for (let i = 0; i < cant; i++) {
                tokens.push(new Token(coordinates, color, img, tokenSize, ctx));
            }
            return tokens;
        };

        let numTile  = xTileNumber * yTileNumber;
        let playerTokenNum = numTile/2 + (numTile % 2 == 0 ?  0 : 1);
        let player1 = instantiateToken(playerTokenNum, player1SquareCoordinate, p1Color, p1Img);
        let player2 = instantiateToken(playerTokenNum, player2SquareCoordinate, p2Color, p2Img);
        let gameBoard =  new GameBoard(gameBoardSquareCoordinate, xTileNumber,  yTileNumber, tileSize, lineTokenNumber, null, 0, ctx);
        
        return new Game(canvas, gameBoard, player1, player2); 
    }

    function calculateObjectSize(xTileNumber, yTileNumber) {
        let canvasWidth   = canvas.parentElement.clientWidth ;
        let canvasHeight  = canvas.parentElement.clientHeight;
        canvas.width  = canvasWidth;
        canvas.height = canvasHeight;
        let gameBoardAspectRatio =  xTileNumber / yTileNumber;
        let canvasAspectRatio    =  canvasWidth / canvasHeight;
        let cavasIsHorizontal = canvasAspectRatio >= 1.5
        let tileSize = (cavasIsHorizontal ? canvasHeight : canvasWidth) / ((canvasAspectRatio < gameBoardAspectRatio) ? xTileNumber  + 2: yTileNumber + 2);
        let tokenSize = tileSize / 2;
        let gameBoardWidth  = tileSize * xTileNumber;
        let gameBoardHeight = tileSize * yTileNumber;

        let gameBoardSquareCoordinate = {
            x1: ( ((canvasWidth - gameBoardWidth)/2)), 
            x2: ((((canvasWidth - gameBoardWidth)/2) + gameBoardWidth)), 
            y1: (cavasIsHorizontal ?  ((canvasHeight - gameBoardHeight)/2) : 0), 
            y2: (cavasIsHorizontal ? (((canvasHeight - gameBoardHeight)/2) + gameBoardHeight) : gameBoardHeight),
        };

        let player1SquareCoordinate = {
            x1: 0,
            x2: (cavasIsHorizontal ? gameBoardSquareCoordinate.x1 : canvasWidth/2),
            y1: (cavasIsHorizontal ? 0 : gameBoardHeight),
            y2: canvasHeight 
        };

        let player2SquareCoordinate = {
            x1: (cavasIsHorizontal ? gameBoardSquareCoordinate.x2 : canvasWidth/2),
            x2: canvasWidth,
            y1: (cavasIsHorizontal ? 0 : gameBoardHeight),
            y2: canvasHeight 
        };
        return {tileSize, tokenSize, gameBoardSquareCoordinate, player1SquareCoordinate, player2SquareCoordinate};
    }
    
    function updateColor() {
        document.querySelectorAll("div[data-color], button[data-color]").
        forEach( 
            
            tag => { tag.style.backgroundColor = tag.getAttribute("data-color");
        });
    }

    updateColor();

    (function() {
        document.querySelectorAll("#player-1, #player-2").forEach( player => {
            let img = player.querySelector(".carousel-inner")
            let btns = player.querySelector(".color")
            btns.addEventListener("click", (e) => {
                let oldColor = img.getAttribute("data-color");
                let newColor = e.target.getAttribute("data-color");
                if (document.querySelectorAll('div[data-color="'+newColor+'"]').length == 0) {
                    img.setAttribute("data-color", newColor)
                    document.querySelectorAll('.color > [data-color="'+oldColor+'"], .color > [data-color="'+newColor+'"]')
                    .forEach( btn => btn.classList.toggle("d-none") );
                    updateColor();
                }
            });
        });
    })();



});