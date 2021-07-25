// ==UserScript==
// @name         auc stalker 2
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       sparroff
// @match        https://forums.e-hentai.org/index.php?showtopic*
// @grant        GM.addStyle
// ==/UserScript==

const nicks=["call-lector","Ajkbyjd","KingArtson","Ikki Pop","sparroff","20Ilya","Mikle3000","mr_baka","SleepDealer"];

(function() {
    var post=document.getElementsByClassName('borderwrap');
    if(post[1].innerHTML.toLowerCase().indexOf('auction')!=-1){
        var buttonfind=document.createElement("div");
        buttonfind.id='findNicks';
        buttonfind.innerHTML='friends';
        post[2].prepend(buttonfind);
        replall(post[2].children[1].children[0].children[1].children[1], nicks) ? buttonfind.classList.add("yesfind") : buttonfind.classList.add("nofind");
    }
})();

function replall(body, nicklist){
    let check=regcr(nicklist).test(body.innerHTML);
    if(check){
        body.innerHTML=body.innerHTML.replace(regcr(nicklist), '<span class="heey">$&</span>');
        body.innerHTML=body.innerHTML.replace(/seller: <span class="heey">/g, '<span class="slb">seller: </span><span class="heey heey2">');
        //body.innerHTML=body.innerHTML.replace(/<span class="heey">(.*)<\/span>\s(.+?)\s/g, '<span class="heey">$1</span><span class="heeycost"> $2</span> ');
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

GM.addStyle(
  ".heey{background-color: #c39000;color: #fff;padding-left: 4px;padding-right: 4px;border-radius: 3px;} \
.heey2{background-color: #cc00ff !important} \
.slb{background-color: #f2bcff;padding-left: 3px;padding-right: 3px;border-radius: 3px 0px 0px 3px;margin-right: -5px;}\
#findNicks{position: absolute;right: 104px;color: #fff;margin-top: 5px;padding: 1px 5px;border-radius: 4px;} \
.yesfind {background-color: #ff5310;} \
.nofind {background-color: #aaa;} \
");