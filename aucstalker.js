// ==UserScript==
// @name         auc stalker 2
// @version      0.2.3
// @description  try to take over the world!
// @author       sparroff
// @match        https://forums.e-hentai.org/index.php?showtopic*
// @namespace    https://github.com/hvNewbieTools
// @updateURL    https://raw.githubusercontent.com/hvNewbieTools/auction-stalker-2/main/aucstalker.js
// @downloadURL  https://raw.githubusercontent.com/hvNewbieTools/auction-stalker-2/main/aucstalker.js
// @grant        GM.addStyle
// ==/UserScript==

const nicks=["call-lector","Ajkbyjd","KingArtson","Ikki Pop","sparroff","20Ilya","Mikle3000","mr_baka","SleepDealer","Darber1337"];

const sellrange=[180,360];
const buyrange=[30,60];
const sellcolors=colorRand(nicks, sellrange, 4.5);
const buycolors=colorRand(nicks, buyrange, 3);

(function() {
    var post=document.getElementsByClassName('borderwrap');
    if(post[1].innerHTML.toLowerCase().indexOf('auction')!=-1){
        let params=new URLSearchParams(document.location.search);
        if(params.get("st")==null||params.get("st")==0){
            var buttonfind=document.createElement("div");
            buttonfind.id='findNicks';
            buttonfind.innerHTML='friends';
            post[2].prepend(buttonfind);
            replall(post[2].children[1].children[0].children[1].children[1], nicks) ? buttonfind.classList.add("yesfind") : buttonfind.classList.add("nofind");
        }
    }
})();

function replall(body, nicklist){
    let check=regcr(nicklist).test(body.innerHTML);
    if(check){
        body.innerHTML=body.innerHTML.replace(regcr(nicklist), str => `<span class="heey" style="background-color: ${buycolors[nicks.indexOf(str)]}">${str}</span>`);
        body.innerHTML=body.innerHTML.replace(/seller: <span class="heey" style="background-color: (.*?)">(.*?)<\/span>/g, (match, color, name) => `<span class="slb" style="background-color: ${sellcolors[nicks.indexOf(name)].replace('1.0','0.2')}">seller: </span><span class="heey" style="background-color: ${sellcolors[nicks.indexOf(name)]}">${name}</span>`);
    }
    return check;
}

function regcr(nicklist){
    let reg='';
    for(let i=0;i<nicklist.length;i++){
        i!=nicklist.length-1 ? reg+=nicklist[i]+'|' : reg+=nicklist[i];
    }
    return new RegExp(`${reg}`, 'g');
}

function colorRand(nicks, range, rat){
  let s=80,l=50,arr=[], offs=Math.floor((range[1]-range[0])/(nicks.length-1));
  for(let i=0;i<nicks.length;i++){
    let th=offs*i+range[0];
    arr.push(rC(th,s,l,rat))
  }
  return mixarr(arr)
}

function rC(t,s,l,rat){
  let th=t,ts=gR(s, s+10),tl=gR(l, l+10);
    let ratio=contrast(hslToRGB(th, ts, tl), [255, 255, 255]);
    if(ratio<rat){
      tl=tl*(ratio/rat);
    }
    return "hsla("+th+", "+ts+"%, "+tl+"%,1.0)"
}

function gR(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function mixarr(arr){
   return arr.map(i=>[Math.random(), i]).sort().map(i=>i[1])
}

function luminance(r, g, b) {
    var a = [r, g, b].map(function (v) {
        v /= 255;
        return v <= 0.03928
            ? v / 12.92
            : Math.pow( (v + 0.055) / 1.055, 2.4 );
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}
function contrast(rgb1, rgb2) {
    var lum1 = luminance(rgb1[0], rgb1[1], rgb1[2]);
    var lum2 = luminance(rgb2[0], rgb2[1], rgb2[2]);
    var brightest = Math.max(lum1, lum2);
    var darkest = Math.min(lum1, lum2);
    return (brightest + 0.05)
         / (darkest + 0.05);
}

function hslToRGB(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [Math.floor(r*255),Math.floor(g*255),Math.floor(b*255)];
}

GM.addStyle(
  ".heey{color: #fff;padding: 1px 4px 1px 4px;border-radius: 3px;} \
.slb{padding: 1px 3px 1px 3px;border-radius: 3px 0px 0px 3px;margin-right: -5px;}\
#findNicks{position: absolute;right: 104px;color: #fff;margin-top: 5px;padding: 1px 5px;border-radius: 4px;} \
.yesfind {background-color: #ff5310;} \
.nofind {background-color: #aaa;} \
");