"use strict";
const keys=["enabled","autoSkip","autoClose","hideBanners"];
const status=document.getElementById("status");
async function showStatus(){
  const data=await chrome.storage.local.get(["rulesFeed","lastUpdated","lastError"]);
  const count=data.rulesFeed?.rules?.length||0;
  status.textContent="Rules: "+count+" | Updated: "+(data.lastUpdated||"not yet")+(data.lastError?"\nError: "+data.lastError:"");
}
async function init(){
  const {settings={}}=await chrome.storage.local.get("settings");
  for(const key of keys){
    const el=document.getElementById(key);
    el.checked=settings[key]!==false;
    el.addEventListener("change",async()=>{
      const data=await chrome.storage.local.get("settings");
      await chrome.storage.local.set({settings:{...data.settings,[key]:el.checked}});
    });
  }
  await showStatus();
}
document.getElementById("options").addEventListener("click",()=>chrome.runtime.openOptionsPage());
document.getElementById("refresh").addEventListener("click",async()=>{
  status.textContent="Checking remote feed…";
  const result=await chrome.runtime.sendMessage({type:"REFRESH_RULES"});
  status.textContent=result.ok?"Updated "+result.count+" site rules.":"Update failed: "+result.error;
});
init().catch(error=>status.textContent=String(error));
