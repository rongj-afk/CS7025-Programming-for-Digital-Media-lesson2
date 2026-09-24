let PlayerName="jiafei"
let PlayerAge=22;
let GameSchool="TCD";
let PlayerScore=0;
let GameStart=true;

console.log("PlayerName",PlayerName);
console.log("PlayerAge",PlayerAge);
console.log("GameSchool",GameSchool);
console.log("PlayerScore",PlayerScore);   


PlayerAge=23;
console.log("New Player Age", PlayerAge);
console.log("GameSchool",GameSchool);
console.log("Game Start", GameStart);

let GameItems=[
    "sword",
    "hammer",
    "knife",
    "potion",
    "shield"
];

console.log("second item",GameItems[1]);
console.log("third item",GameItems[2]);

function addscore(){
    PlayerScore=PlayerScore+1;
}

function displayscore(){
    console.log("PlayerScore",PlayerScore);
}

addscore();
displayscore();

addscore();
displayscore();

addscore();
displayscore();

function checkOddorEven(){

    if(PlayerScore%2===0){
        console.log("the player score is even");
    }else{
        console.log("the player score is odd");
    }

}

checkOddorEven()