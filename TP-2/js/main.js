import { GameBoard } from "./gameBoard.js";
import { Game } from "./game.js";
import { Token } from "./token.js";

document.addEventListener("DOMContentLoaded", ()=> {
    
    const canvas  = document.getElementById("canvas");
    const ctx     = canvas.getContext("2d");
    const width   = canvas.parentElement.clientWidth ;
    const height  = canvas.parentElement.clientHeight;
    canvas.width  = width;
    canvas.height = height;
    
    document.querySelector("#btn-start").addEventListener("click", ()=> {
        let gameInputToken   = document.querySelector("#input-line-token-number");
        let gameInputSize    = document.querySelector("#input-game-board-size");
        let gameInputP1Color = document.querySelector("#player-1 .carousel-inner");
        let gameInputP2Color = document.querySelector("#player-2 .carousel-inner");
        let gameInputP1Image = document.querySelector("#player-1 .active img");
        let gameInputP2Image = document.querySelector("#player-2 .active img");
        let gameInputTime    = document.querySelector("#input-max-time");

        let gameBoardHeight  = Number(gameInputSize .selectedOptions[0].getAttribute("data-height"));
        let gameBoardWidth = Number(gameInputSize .selectedOptions[0].getAttribute("data-width"));
        let lineTokeNumber  = Number(gameInputToken.selectedOptions[0].getAttribute("data-number"));
        let p1Color = gameInputP1Color.getAttribute("data-color");
        let p2Color = gameInputP2Color.getAttribute("data-color");
        let p1Image = "../TP-2/"+gameInputP1Image.getAttribute("src");
        let p2Image = "../TP-2/"+gameInputP2Image.getAttribute("src");
        let time    = gameInputTime.selectedOptions[0].getAttribute("data-time");

        const img1 = new Image();
        img1.src = p1Image;
        const img2 = new Image();
        img2.src = p2Image;
        console.log(
            gameBoardHeight,
            gameBoardWidth,
            lineTokeNumber,
            p1Color,
            p2Color,
            p1Image,
            p2Image,
            time,
        )
        const game = instantiateGame(gameBoardWidth, gameBoardHeight, lineTokeNumber, p1Color, p2Color, img1, img2, time);
        
        game.startGame();
        
    });

    function instantiateGame(xTileNumber, yTileNumber, lineTokenNumber, p1Color, p2Color, p1Img, p2Img, time) {
        xTileNumber = (xTileNumber < lineTokenNumber) ? lineTokenNumber : xTileNumber; 
        yTileNumber = (yTileNumber < lineTokenNumber) ? lineTokenNumber : yTileNumber; 
        let {tileSize, tokenSize, gameBoardSquareCoordinate, player1SquareCoordinate, player2SquareCoordinate} = calculateObjectSize(xTileNumber, yTileNumber);

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
        let gameBoardAspectRatio =  xTileNumber / yTileNumber;
        let canvasAspectRatio    =  width / height;
        let cavasIsHorizontal = canvasAspectRatio >= 1.5
        let tileSize = (cavasIsHorizontal ? height : width) / ((canvasAspectRatio < gameBoardAspectRatio) ? xTileNumber  + 2: yTileNumber + 2);
        let tokenSize = tileSize / 2;
        let gameBoardWidth  = tileSize * xTileNumber;
        let gameBoardHeight = tileSize * yTileNumber;

        let gameBoardSquareCoordinate = {
            x1: ( ((width - gameBoardWidth)/2)), 
            x2: ((((width - gameBoardWidth)/2) + gameBoardWidth)), 
            y1: (cavasIsHorizontal ?  ((height - gameBoardHeight)/2) : 0), 
            y2: (cavasIsHorizontal ? (((height - gameBoardHeight)/2) + gameBoardHeight) : gameBoardHeight),
        };

        let player1SquareCoordinate = {
            x1: 0,
            x2: (cavasIsHorizontal ? gameBoardSquareCoordinate.x1 : width/2),
            y1: (cavasIsHorizontal ? 0 : gameBoardHeight),
            y2: height 
        };

        let player2SquareCoordinate = {
            x1: (cavasIsHorizontal ? gameBoardSquareCoordinate.x2 : width/2),
            x2: width,
            y1: (cavasIsHorizontal ? 0 : gameBoardHeight),
            y2: height 
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