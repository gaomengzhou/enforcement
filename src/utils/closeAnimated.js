 export default function closeAnimated() {
   let timerLeft = null;
   let complainAnimate = document.getElementById("complainAnimate");
   let complainAnimateLeft = document.getElementById("complainAnimateLeft");
   let timerRight = null;
   let complainAnimateRight = document.getElementById("complainAnimateRight");
   let complainAnimateRightWrapper = document.getElementById("complainAnimateRightWrapper");
   complainAnimateRightWrapper.style.zIndex = 0;
   complainAnimateRightWrapper.style.background = 'transparent';
   complainAnimateRightWrapper.style.width =0+'px';
   clearInterval(timerLeft);
   clearInterval(timerRight);
   timerLeft = setInterval(function(){
     let speedLeft  = 10;
     if(complainAnimateLeft.offsetLeft <= -680){
       clearInterval(timerLeft);
       complainAnimate.style.background = 'transparent';
       complainAnimate.style.zIndex = 0;
     }else{
       complainAnimateLeft.style.left = complainAnimateLeft.offsetLeft - speedLeft + "px";
     }
   },1);
   timerRight = setInterval(function(){
     let speedRight  = 30;
     if(complainAnimateRight.offsetLeft >= 900 ){
       clearInterval(timerRight);
       complainAnimate.style.background = 'transparent';
       complainAnimate.style.zIndex = 0;
     }else{
       complainAnimateRight.style.left = complainAnimateRight.offsetLeft + speedRight + "px";
     }
   },1);


}
