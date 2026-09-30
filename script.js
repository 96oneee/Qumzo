const $=id=>document.getElementById(id);
function render(){
  $("brandMark").textContent=PROJECT.mark;$("footerMark").textContent=PROJECT.mark;
  $("brandName").textContent=PROJECT.name;$("footerName").textContent=PROJECT.footerName;
  $("badge").textContent=PROJECT.badge;$("heroTitle").innerHTML=PROJECT.heroTitle;$("heroText").textContent=PROJECT.heroText;
  $("aboutTitle").textContent=PROJECT.aboutTitle;$("aboutText").textContent=PROJECT.aboutText;
  $("contract").textContent=PROJECT.contract;$("communityTitle").textContent=PROJECT.communityTitle;$("communityText").textContent=PROJECT.communityText;
  ["buyTop","buyHero"].forEach(id=>$(id).href=PROJECT.links.buy);
  ["xHero","xCommunity"].forEach(id=>$(id).href=PROJECT.links.x);
  $("tgCommunity").href=PROJECT.links.telegram;
  $("roadmapGrid").innerHTML=PROJECT.roadmap.map(x=>`<article><span>${x.phase}</span><h3>${x.title}</h3><p>${x.text}</p></article>`).join("");
  $("tokenGrid").innerHTML=PROJECT.tokenomics.map(x=>`<div><strong>${x.value}</strong><span>${x.label}</span></div>`).join("");
}
render();
$("copyContract").onclick=async()=>{try{await navigator.clipboard.writeText(PROJECT.contract);$("copyContract").textContent="COPIED";setTimeout(()=>$("copyContract").textContent="COPY",1200)}catch(e){}};
