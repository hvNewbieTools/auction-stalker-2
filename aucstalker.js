// ==UserScript==
// @name         forumStalker
// @version      0.3.1
// @description  Подсветка друзяшек (и врагов) в на форуме и аукционах
// @author       sparroff
// @match        https://forums.e-hentai.org/index.php?showtopic*
// @match        https://forums.e-hentai.org/index.php?showforum*
// @namespace    https://github.com/hvNewbieTools
// @updateURL    https://raw.githubusercontent.com/hvNewbieTools/auction-stalker-2/main/aucstalker.js
// @downloadURL  https://raw.githubusercontent.com/hvNewbieTools/auction-stalker-2/main/aucstalker.js
// @grant        GM.addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

const nicks=["call-lector","Ajkbyjd","KingArtson","Ikki Pop","sparroff","20Ilya","Mikle3000","mr_baka","SleepDealer","Darber1337"];

const sellrange=[180,360];
const buyrange=[20,50];
const sellcolors=colorRand(nicks, sellrange, 4);
const buycolors=colorRand(nicks, buyrange, 2.5);

(function() {
    if(document.getElementById("userlinks")){
        let settingButton=document.createElement("span");
        settingButton.innerHTML=`forumStalker`;
        settingButton.id="StalkerSetting";
        settingButton.onclick = function () {
            showSetting();
        }
        document.getElementById("userlinks").children[1].prepend(" ·");
        document.getElementById("userlinks").children[1].prepend(settingButton);
    }
    if(/showtopic/.test(document.location.href)){
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
    } else if(/showforum/.test(document.location.href)){
        if(document.getElementById("userlinks")){
            let myname=getMyNickname();
            let topics=document.getElementsByClassName("ipbtable")[1];
            for(let i=1;i<topics.rows.length;i++){
                if(topics.rows[i].cells[4]){
                    if(topics.rows[i].cells[4].innerText==myname){
                        topics.rows[i].classList.add('myTopic');
                        topics.rows[i].cells[4].children[0].innerHTML=`<span class="heey" style="background-color: #b37c16">`+topics.rows[i].cells[4].innerText+`</span>`;
                        //console.log(topics.rows[i]);
                    } else if(regcr(nicks).test(topics.rows[i].cells[4].innerText)){
                        topics.rows[i].classList.add('friendsTopic');
                        topics.rows[i].cells[4].children[0].innerHTML=`<span class="heey" style="background-color: `+sellcolors[nicks.indexOf(topics.rows[i].cells[4].innerText)]+`">`+topics.rows[i].cells[4].children[0].innerHTML+`</span>`;
                    }
                }
            }
        }
    }
})();

function showSetting(){
    let stalkerSetting=document.createElement("div");
    stalkerSetting.id="stalkerSetting";

    let stalkerSettingInner=document.createElement("div");
    stalkerSettingInner.className="borderwrap";
    stalkerSetting.append(stalkerSettingInner);

    let stalkerSettingHeader=document.createElement("div");
    stalkerSettingHeader.className="maintitle";
    stalkerSettingHeader.innerHTML=`<div style="float:right"><a href="#" onclick="document.getElementById(&quot;get-myassistant&quot;).style.display=&quot;none&quot;">[X]</a></div><div>Настройки forumStalker</div>`
    stalkerSettingInner.append(stalkerSettingHeader);

    let stalkerSettingMain=document.createElement("div");
    stalkerSettingMain.id="stalkerSettingMain";
    stalkerSettingMain.className="row1";
    stalkerSettingInner.append(stalkerSettingMain);

    //настройки ника
    let stlSet1=document.createElement("div");
    stlSet1.className="stlSet";
    stalkerSettingMain.append(stlSet1);

    let nickLabel=document.createElement("label");
    nickLabel.className="stlLabel";
    nickLabel.innerText="Мой никнейм:"
    stlSet1.append(nickLabel);

    let mynick=document.createElement("input");
    mynick.type="text";
    mynick.style.width="250px";
    mynick.style.paddingLeft="5px";
    mynick.value=getMyNickname();
    stlSet1.append(mynick);

    //сохранить
    let stalkerSettingSave = document.createElement('button');
    stalkerSettingSave.innerText="Save";
    stalkerSettingSave.className="stlButton"
    stalkerSettingMain.append(stalkerSettingSave);

    stalkerSettingSave.onclick = function () {
        GM_setValue("myNick", mynick.value);
        stalkerSetting.parentNode.removeChild(stalkerSetting);
        location.reload();
    }

    document.body.append(stalkerSetting);
    stalkerSettingHeader.children[0].onclick = function () {
        stalkerSetting.parentNode.removeChild(stalkerSetting);
    }

}
function getMyNickname(){
    let nick=GM_getValue("myNick");
    if(!nick){
        let myname=document.getElementById("userlinks").children[0].children[0].children[0].innerText;
        GM_setValue("myNick", myname)
        nick=myname;
    }
    return nick;
}


function topicfind(body, nicklist){
    let check=regcr(nicklist).test(body.innerHTML);
    if(check){
        body.innerHTML=body.innerHTML.replace(regcr(nicklist), str => `<span class="heey" style="background: ${buycolors[nicks.indexOf(str)]}">${str}</span><span class="blb" style="background: ${`linear-gradient(to right, `+buycolors[nicks.indexOf(str)].replace('1.0','0.3')+`, `+buycolors[nicks.indexOf(str)].replace('1.0','0')+`)`}"></span>`);
        body.innerHTML=body.innerHTML.replace(/seller: <span class="heey" style="background: (.*?)">(.*?)<\/span><span class="blb"(.*?)<\/span>/g, (match, color, name, nvm) => `<span class="slb" style="background: ${`linear-gradient(to left, `+sellcolors[nicks.indexOf(name)].replace('1.0','0.2') +`60%, `+sellcolors[nicks.indexOf(name)].replace('1.0','0')+ `100%)`}">seller: </span><span class="heey" style="background-color: ${sellcolors[nicks.indexOf(name)]}">${name}</span>`);
    }
    return check;
}

function replall(body, nicklist){
    let check=regcr(nicklist).test(body.innerHTML);
    if(check){
        body.innerHTML=body.innerHTML.replace(regcr(nicklist), str => `<span class="heey" style="background: ${buycolors[nicks.indexOf(str)]}">${str}</span><span class="blb" style="background: ${`linear-gradient(to right, `+buycolors[nicks.indexOf(str)].replace('1.0','0.3')+`, `+buycolors[nicks.indexOf(str)].replace('1.0','0')+`)`}"></span>`);
        body.innerHTML=body.innerHTML.replace(/seller: <span class="heey" style="background: (.*?)">(.*?)<\/span><span class="blb"(.*?)<\/span>/g, (match, color, name, nvm) => `<span class="slb" style="background: ${`linear-gradient(to left, `+sellcolors[nicks.indexOf(name)].replace('1.0','0.2') +`60%, `+sellcolors[nicks.indexOf(name)].replace('1.0','0')+ `100%)`}">seller: </span><span class="heey" style="background-color: ${sellcolors[nicks.indexOf(name)]}">${name}</span>`);
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
      tl=Math.round(tl*(ratio/rat));
      if(tl<30) tl=30;
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
.slb{border-radius: 3px 0px 0px 3px;padding: 1px 3px 1px 30px;margin: 0px -5px 0px -30px;}\
.blb{padding: 1px 155px 1px 0px;margin: 0px -150px 0px -2px;}\
#findNicks{position: absolute;right: 104px;color: #fff;margin-top: 5px;padding: 1px 5px;border-radius: 4px;} \
.yesfind {background-color: #ff5310;} \
.nofind {background-color: #aaa;} \
tr.myTopic {box-shadow: 0px 0px 7px 1px #ffa500;position: relative;} \
tr.myTopic:after {content: '';position: absolute;background: #ffe00022;width: 100%;height: 100%;left: 0px;pointer-events: none;} \
tr.friendsTopic {position: relative;} \
tr.friendsTopic:after {content: '';position: absolute;background: #f894ff1f;width: 100%;height: 100%;left: 0px;pointer-events: none;} \
#StalkerSetting{opacity: 0.8;cursor: pointer;text-decoration: underline;} \
#stalkerSetting{width: 400px;position: fixed;left: 50%;top: 30%;margin-left: -200px;border: 1px solid #000;} \
#stalkerSettingMain{} \
.stlSet {padding-bottom: 10px;border: #0005 solid;border-width: 0px 0px 1px 0px;} \
.stlLabel{cursor: default;} \
.stlButton{margin: 10px 0px; cursor: pointer;} \
");