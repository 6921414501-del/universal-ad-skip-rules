"use strict";
(() => {
  const DEFAULTS={enabled:true,autoSkip:true,autoClose:true,hideBanners:true};
  let settings={...DEFAULTS},rulesFeed={rules:[]},customRules=[],observer=null,scheduled=false;
  const clicked=new WeakSet();
  const currentHost=location.hostname.toLowerCase();
  function matchesDomain(pattern) {
    const domain=pattern.toLowerCase();
    return domain.startsWith("*.") ? currentHost.endsWith(domain.slice(1)) && currentHost!==domain.slice(2) : currentHost===domain;
  }
  function belongs(rule) {
    return rule && rule.enabled!==false && Array.isArray(rule.domains) && rule.domains.some(matchesDomain);
  }
  function permitted(action) {
    if (action.type==="hide") return settings.hideBanners;
    if (action.type==="click") {
      const label=(action.text||"").toLowerCase();
      return /skip|ข้าม/.test(label) ? settings.autoSkip : settings.autoClose;
    }
    return false;
  }
  function apply() {
    if (!settings.enabled) return;
    const siteRules=[...(rulesFeed.rules||[]),...customRules].filter(belongs);
    for (const rule of siteRules) for (const action of rule.actions||[]) {
      if (!permitted(action)) continue;
      let elements;
      try { elements=document.querySelectorAll(action.selector); } catch { continue; }
      for(const el of elements) {
        if (action.type==="hide") {
          el.style.setProperty("display","none","important");
        } else if (action.type==="click" && !clicked.has(el) && !el.disabled) {
          const label=(el.innerText||el.textContent||el.getAttribute("aria-label")||"").trim();
          const target=(action.text||"").trim();
          if(target && !(action.exact ? label===target : label.toLowerCase().includes(target.toLowerCase()))) continue;
          if(!el.getClientRects().length) continue;
          clicked.add(el);
          el.click();
        }
      }
    }
  }
  function schedule() {
    if(scheduled) return;
    scheduled=true;
    setTimeout(()=>{scheduled=false;apply();},200);
  }
  async function load() {
    const data=await chrome.storage.local.get(["settings","rulesFeed","customRules"]);
    settings={...DEFAULTS,...(data.settings||{})};
    rulesFeed=data.rulesFeed||{rules:[]};
    customRules=Array.isArray(data.customRules)?data.customRules:[];
    schedule();
  }
  chrome.storage.onChanged.addListener((changes,area) => {
    if(area==="local" && ["settings","rulesFeed","customRules"].some(k=>changes[k])) load().catch(console.error);
  });
  load().catch(console.error);
  observer=new MutationObserver(schedule);
  observer.observe(document.documentElement,{childList:true,subtree:true});
  setInterval(schedule,3000);
})();
