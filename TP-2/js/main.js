import { GameBoard } from "./gameBoard.js";
import { Game } from "./game.js";
import { Token } from "./token.js";

document.addEventListener("DOMContentLoaded", ()=> {
    
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const width  = canvas.parentElement.clientWidth;
    const height = canvas.parentElement.clientHeight;
    canvas.width  = width;
    canvas.height = height;
    
document.querySelector("#btn-start").addEventListener("click", ()=> {
        let colors = {
            success: "#198754",
            danger: "#DC3545",
            primary: "#0D6EFD",
            warning: "#FFC107",
            light: "#F8F9FA",
            secondary: "#6C757D",
        }
        let gameBoardSize = document.querySelector("#input-game-board-size").value;
        let lineTokeNumber = document.querySelector("#input-line-token-number").value;
        let p1Color = document.querySelector("#player-1").getAttribute("data-color");
        let p2Color = document.querySelector("#player-2").getAttribute("data-color");
        let p1Img = "../TP-2/"+ document.querySelector("#player-1 .active img").getAttribute("src");
        let p2Img = "../TP-2/"+ document.querySelector("#player-2 .active img").getAttribute("src");
        const img1 = new Image();
        img1.src = p1Img;
        const img2 = new Image();
        img2.src = p2Img;
        console.log(gameBoardSize)
        const game = instantiateGame(20,4, lineTokeNumber, colors[p1Color], colors[p2Color], img1, img2);

        game.startGame();

    });

    function instantiateGame(xTileNumber, yTileNumber, lineTokenNumber, player1Color, player2Color, img) {
        xTileNumber = (xTileNumber < lineTokenNumber) ? lineTokenNumber : xTileNumber; 
        yTileNumber = (yTileNumber < lineTokenNumber) ? lineTokenNumber : yTileNumber; 
        let {tileSize, tokenSize, gameBoardSquareCoordinate, player1SquareCoordinate, player2SquareCoordinate} = calculateObjectSize(xTileNumber, yTileNumber);

        let instantiateToken = (cant, coordinates, color, img) => {
            let tokens = [];
            for (let i = 0; i < cant; i++) {
                tokens.push(new Token(coordinates, color, img, tokenSize, canvas.getContext('2d')));
            }
            return tokens
        };

        let numTile  = xTileNumber * yTileNumber;
        let playerTokenNum = numTile/2 + (numTile % 2 == 0 ?  0 : 1);

        let player1 = instantiateToken(playerTokenNum, player1SquareCoordinate, player1Color, img);
        let player2 = instantiateToken(playerTokenNum, player2SquareCoordinate, player2Color, img);
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
    
    (function() {
        let colors = ["#198754", "#DC3545", "#0D6EFD", "#FFC107", "#F8F9FA", "#6C757D"];
        const p1Img = document.querySelector("#player-1");
        const p2img = document.querySelector("#player-2");
        document.querySelectorAll(".color").forEach( btn => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                let newColor = e.target.getAttribute("data-color");
               if(p1Img.getAttribute("data-color")!=newColor && p2img.getAttribute("data-color")!=newColor) {
                   let playerId = e.currentTarget.getAttribute("data-color-target");
                   let playerSelected = document.querySelector(playerId);
                   let oldColor = playerSelected.getAttribute("data-color");
                   playerSelected.setAttribute("data-color", newColor);
                   document.querySelectorAll('.color > [data-color="'+oldColor+'"]').forEach(btn=>btn.classList.toggle("d-none"));
                   document.querySelectorAll('.color > [data-color="'+newColor+'"]').forEach(btn=>btn.classList.toggle("d-none"));
               }
            });
        });
    })();

});