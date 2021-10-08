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
    
    const img = new Image()
    img.src = "../TP-2/img/token_1.png"
    img.addEventListener("load", ()=> {     
        const game = instantiateGame(12, 7, 4, "red", "blue", img);
        
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

});