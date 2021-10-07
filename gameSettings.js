//mode: single or multiplayer
let mode=document.getElementById("mode");
let modeVal=0;
mode.onclick=function(){
    let mval=document.getElementById("mval");
    if(modeVal==0)
    {
        mval.innerHTML="Multi-Player";
        modeVal=1;
    }
    else
    {
        mval.innerHTML="Single-Player";
        modeVal=0;
    }
};


let random=document.getElementById("reflection");
let randomVal=0;
random.onclick=function(){
    let rval=document.getElementById("rval");
    if(randomVal==0)
    {
        rval.innerHTML="Normal";
        randomVal=1;
    }
    else
    {
        rval.innerHTML="Random";
        randomVal=0;
    }
};
let difficulty=document.getElementById("difficulty");
let dv=0;
difficulty.onclick=function(){
    let dval=document.getElementById("dval");
    if(dv==0)
    {
        dval.innerHTML="Medium";
        dv=1;
    }
    else if(dv==1)
    {
        dval.innerHTML="Impossible";
        dv=2;
    }
    else
    {
        dval.innerHTML="Easy";
        dv=0;
    }
}