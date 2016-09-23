/**
 * Created by Ilya on 23.09.2016.
 */
function isValidCell(x,y){
    if (x<0||y<0||x>=maxX||y>=maxY) {
        return false;
    }
    else {
        return true;
    }
}
function getNeighbours(a){
    var pairExample={x:0,y:0};
    if (a.x%2==0){
        if (isValidCell(a.x,a.y+1)){
            pairExample.x=a.x;
            pairExample.y=a.y+1;
            a.neigh.push(pairExample);
        }
        if (isValidCell(a.x,a.y-1)){
            pairExample.x=a.x;
            pairExample.y=a.y-1;
            a.neigh.push(pairExample);
        }
        if (isValidCell(a.x+1,a.y-1)){
            pairExample.x=a.x+1;
            pairExample.y=a.y-1;
            a.neigh.push(pairExample);
        }
        if (isValidCell(a.x-1,a.y-1)){
            pairExample.x=a.x-1;
            pairExample.y=a.y-1;
            a.neigh.push(pairExample);
        }
        if (isValidCell(a.x+1,a.y)){
            pairExample.x=a.x+1;
            pairExample.y=a.y;
            a.neigh.push(pairExample);
        }
        if (isValidCell(a.x-1,a.y)){
            pairExample.x=a.x-1;
            pairExample.y=a.y;
            a.neigh.push(pairExample);
        }
    }
    else {
        if (isValidCell(a.x,a.y+1)){
            pairExample.x=a.x;
            pairExample.y=a.y+1;
            a.neigh.push(pairExample);
        }
        if (isValidCell(a.x,a.y-1)){
            pairExample.x=a.x;
            pairExample.y=a.y-1;
            a.neigh.push(pairExample);
        }
        if (isValidCell(a.x+1,a.y+1)){
            pairExample.x=a.x+1;
            pairExample.y=a.y+1;
            a.neigh.push(pairExample);
        }
        if (isValidCell(a.x-1,a.y+1)){
            pairExample.x=a.x-1;
            pairExample.y=a.y+1;
            a.neigh.push(pairExample);
        }
        if (isValidCell(a.x+1,a.y)){
            pairExample.x=a.x+1;
            pairExample.y=a.y;
            a.neigh.push(pairExample);
        }
        if (isValidCell(a.x-1,a.y)){
            pairExample.x=a.x-1;
            pairExample.y=a.y;
            a.neigh.push(pairExample);
        }


    }
    return 0;
}
function boardReading(){
    //gets current situation
    return 0;
}
function stackPusher(a){
    if (!a.isInStack) {
        pushStack.push(a);
        a.isInStack = true;
        return 1;
    }
    return 0;
}
function isOkToPush(a){
    if (a.built!=0){
        return false;
    }
    var availablePush=false;
    if (a.owner==1){
        availablePush=true;
    }
    var g=0;
    for (g=0;g<a.neigh.length;g++){
        if (board[a.neigh[g].x][a.neigh[g].y].owner==1){
            availablePush=true;
        }
    }

    if (availablePush==false){
        return false;
    }
    var availablePushP=false;
    if (a.owner==1){
        availablePushP=true;
    }
    var g=0;
    for (g=0;g<a.neigh.length;g++){
        if (board[a.neigh[g].x][a.neigh[g].y].owner!=1){
            availablePushP=true;
        }
    }
    if (availablePushP==false){
        return false;
    }
    return true;
}
function changeScore(a) {
    var k;
    var scoreResult=0;
    for (k=0;k<a.neigh.length;k++){
        scoreResult+=1-board[a.neigh[k].x][a.neigh[k].y].owner;
    }
    scoreResult+=1-a.owner;
    return scoreResult;
}
function playSituation(a,depth,score,index){
    if (depth>maxDepth){
        return (changeScore(a)+score);
    }
    else {
        var afterScore=score+changeScore(a);
        var b=a;
        var saveNeighbours=[];
        for (var k=0;k<a.neigh.length;k++){
            saveNeighbours.push(board[a.neigh[k].x][a.neigh[k].y]);
        }
        a.built=1;
        pushStack.splice(index,1);
        a.isInStack=false;
        var pushedElements=0;
        for (var k=0;k<a.neigh.length;k++){
            board[a.neigh[k].x][a.neigh[k].y].owner=1;
            if (board[a.neigh[k].x][a.neigh[k].y].built==0) {
                pushedElements += stackPusher(board[a.neigh[k].x][a.neigh[k].y]);
            }
        }
        for (var k=0;k<a.neigh.length;k++){
            var aa=board[a.neigh[k].x][a.neigh[k].y];
            for (var kk=0;kk<aa.neigh.length;kk++){
                if (board[aa.neigh[kk].x][aa.neigh[kk].y].built==0) {
                    pushedElements += stackPusher(board[aa.neigh[kk].x][aa.neigh[kk].y]);
                }
            }
        }
        var maxThisScore=-10000000;
        var thisScore=-10000000;
        for (var k=0;k<pushStack.size;k++){
            thisScore=playSituation(pushStack[k],depth+1,afterScore,k);
            if (thisScore>maxThisScore){
                maxThisScore=thisScore;
            }
        }
        for (var k=0;k<pushedElements;k++){
            pushStack.pop();
        }
        pushStack.splice(i,0,b);
        a=b;
        for (var k=0;k<a.neigh.length;k++){
            board[a.neigh[k].x][a.neigh[k].y]=saveNeighbours[k];
        }
    }
    return 0;
}
function turnWriting(a){
    return;
}
var boardCreator = {owner:0,built:0,x:0,y:0,neigh:[],isInStack:false};
var maxY = 100;
var maxX = 100;
var pushStack=[];
var i;
var j;
var maxDepth=4;
//owner: 0 - neutral, 1 - 1st player, -1 - 2nd player
//built: 0 - field, 1 - castle, 2 - palace, 3 - mountain, 4 - river
var board=new Array(100);
for (i=0;i<100;i++){
    board[i] = new Array(100);
    for (j=0;j<100;j++){
        board[i][j]=boardCreator;
    }
}
boardReading();
for (i=0;i<maxX;i++){
    for (j=0;j<maxY;j++){
        getNeighbours(board[i][j]);
        if (isOkToPush(board[i][j])){
            stackPusher(board[i][j]);
        }
    }
}
var maxGraderIndex;
var maxGrader=-100000;
var grader=0;
for (i=0;i<pushStack.length;i++){
    grader=playSituation(pushStack[i],1,0,i);
    if (grader>=maxGrader){
        maxGrader=grader;
        maxGraderIndex=i;
    }
}
turnWriting(pushStack[maxGraderIndex]);