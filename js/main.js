/**
 * Created by Administrator on 2017/3/17.
 */
//获取设备宽度
var canvasWidth = Math.min(450, window.screen.width - 30);
var canvasHeight = canvasWidth;


var chess = document.getElementById('chess');
var context = chess.getContext('2d');
chess.width = canvasWidth;
chess.height = canvasHeight;


var rows = 15;
var rowWidth = Math.round(canvasWidth / rows);
var borderWidth = 15;
var count = 0;


var newGame = function(){
    over = false;
    me = true;
    chessBoard = [];
    //赢法数组,初始化三维数组
    wins = [];
    for(var i = 0; i < 15; i++){
        wins[i] = [];
        for(var j = 0; j < 15; j++){
            wins[i][j] = [];
        }
    }

    //记录所有赢的方法，count赢的总数

    //所有横线的赢法
    for(var i = 0; i < 15; i++){
        for(var j = 0; j < 11; j++){
            //对于最后一个循环，找出五个连在一起的棋子的位置
            //count=0时，第一种可能
            //wins[0][0][0] = true；
            //wins[0][1][0] = true；
            //wins[0][2][0] = true；
            //wins[0][3][0] = true；
            //wins[0][4][0] = true；
            // count=1时，第二种可能
            //wins[0][1][1] = true；
            //wins[0][2][1] = true；
            //wins[0][3][1] = true；
            //wins[0][4][1] = true；
            //wins[0][5][1] = true；
            for(var k = 0; k < 5; k++){
                wins[i][j + k][count] = true;
            }
            count++;
        }
    }
    //所有竖线的赢法
    for(var i = 0; i < 15; i++){
        for(var j = 0; j < 11; j++){
            for(var k = 0; k < 5; k++){
                wins[j + k][i][count] = true;
            }
            count++;
        }
    }
    //所有斜线的赢法
    for(var i = 0; i < 11; i++){
        for(var j = 0; j < 11; j++){
            for(var k = 0; k < 5; k++){
                wins[i + k][j + k][count] = true;
            }
            count++;
        }
    }
    //所有反斜线的赢法
    for(var i = 0; i < 11; i++){
        for(var j = 14; j > 3; j--){
            for(var k = 0; k < 5; k++){
                wins[i + k][j - k][count] = true;
            }
            count++;
        }
    }

    //赢法的统计数组，并初始化一维数组
    myWin = [];
    computerWin = [];
    for(var i = 0; i < count; i++){
        myWin[i] = 0;
        computerWin[i] = 0;
    }
    //初始化chessBoard二维数组
    for(var i = 0; i < 15; i++){
        chessBoard[i] = [];
        for(var j = 0; j < 15; j++){
            chessBoard[i][j] = 0;
        }
    }

};

window.onload = function(){
    newGame();
    drawChessBoard();
};
context.strokeStyle = "#BFBFBF";
var logo = new Image();
logo.src = "img/logo3.png";
logo.onload = function(){
    context.drawImage(logo, 0, 0, canvasWidth, canvasWidth);
    drawChessBoard();
};

var drawChessBoard = function(){
    context.save();
    for(var i = 0; i < 15; i++){
        //列
        context.moveTo(borderWidth + i * rowWidth, borderWidth);
        context.lineTo(borderWidth + i * rowWidth, canvasWidth - borderWidth);
        context.stroke();
        //行
        context.moveTo(borderWidth, borderWidth + i * rowWidth);
        context.lineTo(canvasWidth - borderWidth, borderWidth + i * rowWidth);
        context.stroke();
    }
    context.restore();
};

var oneStep = function(i, j, me){
    context.save();
    context.beginPath();
    context.arc(borderWidth + i * rowWidth, borderWidth + j * rowWidth, rowWidth / 2, 0, 2 * Math.PI);
    context.closePath();
    //渐变效果，圆心+半径
    var gradient = context.createRadialGradient(borderWidth + i * rowWidth + 2, borderWidth + j * rowWidth - 2, rowWidth / 2, borderWidth + i * rowWidth + 2, borderWidth + j * rowWidth - 2, 0);
    if(me){
        gradient.addColorStop(0, "#0a0a0a");
        gradient.addColorStop(1, "#636766");
    } else {
        gradient.addColorStop(0, "#D1D1D1");
        gradient.addColorStop(1, "#F9F9F9");
    }
    context.fillStyle = gradient;
    context.fill();
    context.restore();
};

chess.onclick = function(e){
    if(over){
        return
    }
    if(!me){
        return;
    }
    var x = e.offsetX;
    var y = e.offsetY;
    var i = Math.floor(x / rowWidth);
    var j = Math.floor(y / rowWidth);
    if(chessBoard[i][j] == 0){
        oneStep(i, j, me);
        chessBoard[i][j] = 1;
        //如果坐标ij在赢法数组上则加1
        for(var k = 0; k < count; k++){
            if((wins[i][j][k])){
                myWin[k]++;
                computerWin[k] = 6;
                if(myWin[k] == 5){
                    window.alert("你们人类真厉害，我还要不断的学习！");
                    over = true;
                }
            }
        }
        if(!over){
            me = !me;
            computerAi();
        }
    }
};
var computerAi = function(){
    var max = 0;
    var u = 0, v = 0;
    var myScore = [];
    var computerScore = [];
    for(var i = 0; i < 15; i++){
        myScore[i] = [];
        computerScore[i] = [];
        for(var j = 0; j < 15; j++){
            myScore[i][j] = 0;
            computerScore[i][j] = 0;
        }
    }
    for(var i = 0; i < 15; i++){
        for(var j = 0; j < 15; j++){
            if(chessBoard[i][j] == 0){
                for(var k = 0; k < count; k++){
                    if(wins[i][j][k]){
                        if(myWin[k] == 1){
                            myScore[i][j] += 200;
                        } else if(myWin[k] == 2){
                            myScore[i][j] += 500;
                        } else if(myWin[k] == 3){
                            myScore[i][j] += 2000;
                        } else if(myWin[k] == 4){
                            myScore[i][j] += 10000;
                        }
                        if(computerWin[k] == 1){
                            computerScore[i][j] += 220;
                        } else if(computerWin[k] == 2){
                            computerScore[i][j] += 520;
                        } else if(computerWin[k] == 3){
                            computerScore[i][j] += 2200;
                        } else if(computerWin[k] == 4){
                            computerScore[i][j] += 20000;
                        }
                    }
                }
                if(myScore[i][j] > max){
                    max = myScore[i][j];
                    u = i;
                    v = j;
                } else if(myScore[i][j] == max){
                    if(computerScore[i][j] > computerScore[u][v]){
                        u = i;
                        v = j;
                    }
                }
                if(computerScore[i][j] > max){
                    max = computerScore[i][j];
                    u = i;
                    v = j;
                } else if(computerScore[i][j] == max){
                    if(myScore[i][j] > myScore[u][v]){
                        u = i;
                        v = j;
                    }
                }
            }

        }
    }
    oneStep(u, v, false);
    chessBoard[u][v] = 2;
    for(var k = 0; k < count; k++){
        if(wins[u][v][k]){
            computerWin[k]++;
            myWin[k] = 6;
            if(computerWin[k] == 5){
                alert("你们人类真差劲！");
                over = true;
            }
        }
    }
    if(!over){
        me = !me;
    }
};

var btn = document.getElementById('btn');
btn.onclick = function(){
    me=true;
    context.clearRect(0,0,canvasWidth,canvasHeight);

    newGame();
    drawChessBoard();
};