var step = 1,
    nLit = 0,
    interval = "",
    mil = 450,
    paused = true,
    hashMil = window.location.hash.substr(-3),
    hashCode = "",
    steps = 20,
    btns;


if (hashMil!=""){ // Handle code + tempo from hash
  mil = hashMil;
  window['tempo'].value = (550-mil)/50;
  hashCode = decompress( window.location.hash.substr(1).slice(0,-3) );
  steps = hashCode.length/8;
  TweenMax.to('#controls', 0.2, {autoAlpha:1, pointerEvents:'auto'});
  interval = setInterval(nextStep, mil);
  paused=true;
}


for (var i=1; i<=steps; i++) { // Make steps + chime buttons
  var step = '<div id="step'+i+'" class="step">'+
                '<div id="chime'+i+'_1" class="btn btn1"></div>'+
                '<div id="chime'+i+'_2" class="btn btn2"></div>'+
                '<div id="chime'+i+'_3" class="btn btn3"></div>'+
                '<div id="chime'+i+'_4" class="btn btn4"></div>'+
                '<div id="chime'+i+'_5" class="btn btn5"></div>'+
                '<div id="chime'+i+'_6" class="btn btn6"></div>'+
                '<div id="chime'+i+'_7" class="btn btn7"></div>'+
                '<div id="chime'+i+'_8" class="btn btn8"></div>'+      
              '</div>';
  document.getElementById('steps').innerHTML += step;
}


// Setup chime buttons
btns = document.getElementsByClassName("btn");
TweenMax.set('.btn', {alpha:0.25});
TweenMax.set('#toy', {width:steps*30});

for (var i=0; i<btns.length; i++){
  
  if (hashCode.substr(i,1)=="1") {
    nLit++;
    TweenMax.fromTo(btns.item(i), 0.15, {scale:0.8}, {scale:1, alpha:1, ease:Back.easeOut});
  }
  
  btns.item(i).onclick = function(e){ 
    if ( /^((?!chrome|android).)*safari/i.test(navigator.userAgent)){//user-initiated sfx required in Safari
      if (nLit==0){
        var snd = new Audio();
        snd.src = "./img/chime"+e.currentTarget.id.substr(-1)+".mp3";
        snd.play();
      }
    }

    if (e.currentTarget.style.opacity==0.25) {
      TweenMax.fromTo(e.currentTarget, 0.15, {scale:0.8}, {scale:1, alpha:1, ease:Back.easeOut});
      nLit++;
    }
    else {
      nLit--;
      TweenMax.fromTo(e.currentTarget, 0.15, {scale:0.8}, {scale:1, alpha:0.25, ease:Back.easeOut});
    }    
    // only play if something is lit
    if (nLit==0) reset();
    else if ( interval=="") {
      interval = setInterval(nextStep, mil);
      paused = false;
      TweenMax.set('#pauseTxt', {display:'inline'});
      TweenMax.set('#playTxt', {display:'none'});
      TweenMax.to('#controls', 0.2, {autoAlpha:1, pointerEvents:'auto'});
    }
  }

}

// Called on each interval...
function nextStep(){
  
  if ( !document.hasFocus() || paused ) return;

  // move playhead
  if (step < steps) {  
    TweenMax.to('#playhead', 0.1, {x:step*30, ease:Power1.easeIn});
    step++;
  }
  else {
    step = 1;
    new TimelineMax()
      .to('#playhead', 0.05, {x:"+=15", alpha:0, ease:Power1.easeIn})
      .to('#playhead', 0.0001, {x:-15})
      .to('#playhead', 0.05, {x:0, alpha:1, ease:Power1.easeIn})    
  }
  
  // play sound(s)
  for (var i=0; i<window['step'+step].children.length; i++) {
    var b = window['step'+step].children[i];
    if (b.style.opacity==1) {
      var snd = new Audio();
      snd.src = "./img/chime"+b.id.substr(-1)+".mp3";
      snd.play();
      TweenMax.to(b, 0.2, {scale:0.5, yoyo:true, repeat:1, ease:Power3.easeIn});
    }
  }
}


function reset(){
  for (var i=0; i<btns.length; i++) TweenMax.set(btns.item(i), {alpha:0.25});
  nLit = 0;
  paused = true;
  clearInterval(interval);
  interval = "";
  step = 1;
  TweenMax.to('#playhead', 0.1, {x:0});
  TweenMax.to('#controls', 0.2, {autoAlpha:0.25, pointerEvents:'none'});  
}


// Controls
window['play'].onclick = function(){
  if (paused){
    paused = false;
    TweenMax.set('#pauseTxt', {display:'inline'});
    TweenMax.set('#playTxt', {display:'none'});
    if (interval=="") interval = setInterval(nextStep, mil);
  } else {
    TweenMax.set('#playTxt', {display:'inline'});
    TweenMax.set('#pauseTxt', {display:'none'});
    paused = true;
  }
}

window['tempo'].oninput = window['tempo'].onchange = function(e){
  mil = 550 - e.currentTarget.value*50;
  clearInterval(interval);
  interval = setInterval(nextStep, mil);
}

window['share'].onclick = function(){
  var code = "";
  for (var i=0; i<btns.length; i++){
    (btns.item(i).style.opacity==0.25) ? code+="0" : code+="1";
  }    
  window.open('https://codepen.io/creativeocean/pen/jdKeWY#'+compress(code)+mil, '_blank');
}

window['clear'].onclick = function(){ reset(); }


// code compression from https://github.com/GoLjs/GoL/blob/gh-pages/js/codes.js
function compress(bin){var returnValue='';var padding=((Math.ceil(bin.length/8))*8)-bin.length;for(var i=0;i<padding;i++){bin='0'+bin};for(var i=0;i<parseInt(bin.length/8);i++){var substring=bin.substr(i*8,8);var hexValue=parseInt(substring,2).toString(16);if(hexValue.length==1)hexValue='0'+hexValue;returnValue+=hexValue};var returnValue=returnValue.replace(/00/g,'g').replace(/gg/g,'G').replace(/GG/g,'w').replace(/ww/g,'W').replace(/WW/g,'x').replace(/xx/g,'X').replace(/XX/g,'y').replace(/yy/g,'Y').replace(/YY/g,'z').replace(/zz/g,'Z').replace(/11/g,'h').replace(/hh/g,'H').replace(/22/g,'i').replace(/ii/g,'I').replace(/33/g,'j').replace(/jj/g,'J').replace(/44/g,'k').replace(/kk/g,'K').replace(/55/g,'l').replace(/ll/g,'L').replace(/66/g,'m').replace(/mm/g,'M').replace(/77/g,'n').replace(/nn/g,'N').replace(/88/g,'o').replace(/oo/g,'O').replace(/99/g,'p').replace(/pp/g,'P').replace(/aa/g,'q').replace(/qq/g,'Q').replace(/bb/g,'r').replace(/rr/g,'R').replace(/cc/g,'s').replace(/ss/g,'S').replace(/dd/g,'t').replace(/tt/g,'T').replace(/ee/g,'u').replace(/uu/g,'U').replace(/ff/g,'v').replace(/vv/g,'V');returnValue=padding+'-'+returnValue;return returnValue}
function decompress(compressed){var returnValue='';var compressedArr=compressed.split('-');var paddingAmount=compressedArr[0];compressed=compressedArr[1];compressed=compressed.replace(/Z/g,'zz').replace(/z/g,'YY').replace(/Y/g,'yy').replace(/y/g,'XX').replace(/X/g,'xx').replace(/x/g,'WW').replace(/W/g,'ww').replace(/w/g,'GG').replace(/G/g,'gg').replace(/g/g,'00').replace(/H/g,'hh').replace(/h/g,'11').replace(/I/g,'ii').replace(/i/g,'22').replace(/J/g,'jj').replace(/j/g,'33').replace(/K/g,'kk').replace(/k/g,'44').replace(/L/g,'ll').replace(/l/g,'55').replace(/M/g,'mm').replace(/m/g,'66').replace(/N/g,'nn').replace(/n/g,'77').replace(/O/g,'oo').replace(/o/g,'88').replace(/P/g,'pp').replace(/p/g,'99').replace(/Q/g,'qq').replace(/q/g,'aa').replace(/R/g,'rr').replace(/r/g,'bb').replace(/S/g,'ss').replace(/s/g,'cc').replace(/T/g,'tt').replace(/t/g,'dd').replace(/U/g,'uu').replace(/u/g,'ee').replace(/V/g,'vv').replace(/v/g,'ff');for(var i=0;i<parseInt(compressed.length/2);i++){var substring=compressed.substr(i*2,2);var binValue=parseInt(substring,16).toString(2);if(binValue.length!=8){var diffrence=8-binValue.length;for(var j=0;j<diffrence;j++){binValue='0'+binValue}};returnValue+=binValue};var decompressedArr=returnValue.split('');returnValue='';for(var i=paddingAmount;i<decompressedArr.length;i++){returnValue+=decompressedArr[i]};return returnValue}