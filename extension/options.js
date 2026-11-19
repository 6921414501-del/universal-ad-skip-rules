"use strict";
const $=id=>document.getElementById(id);
const DEFAULT_FEED="https://raw.githubusercontent.com/6921414501-del/universal-ad-skip-rules/main/ad-rules.json";
function validateCustom(rules){
  if(!Array.isArray(rules)||rules.length>1000) throw Error("Expected JSON array (max 1000)");
  for(const rule of rules){
    if(!rule||typeof rule.id!=="string"||!Array.isArray(rule.domains)||!Array.isArray(rule.actions)) throw Error("Invalid rule");
    if(!rule.domains.every(d=>typeof d==="string"&&/^(?:\*\.)?[a-z0-9.-]+$/i.test(d))) throw Error("Invalid domain");
    if(!rule.actions.every(a=>a&&["click","hide"].includes(a.type)&&typeof a.selector==="string"&&a.selector.length<=500&&(!a.text||typeof a.text==="string"))) throw Error("Invalid action");
  }
  return rules;
}
async function init(){
  const data=await chrome.storage.local.get(["settings","customRules","lastUpdated","lastError"]);
  $("feedUrl").value=data.settings?.feedUrl||DEFAULT_FEED;
  $("customRules").value=JSON.stringify(data.customRules||[],null,2);
  $("status").textContent="Last update: "+(data.lastUpdated||"not yet")+(data.lastError?" | "+data.lastError:"");
}
$("saveFeed").addEventListener("click",async()=>{
  try{
    const url=new URL($("feedUrl").value);
    if(url.protocol!=="https:") throw Error("HTTPS is required");
    const {settings={}}=await chrome.storage.local.get("settings");
    await chrome.storage.local.set({settings:{...settings,feedUrl:url.href}});
    $("status").textContent="Saved. Click Update now to fetch rules.";
  }catch(error){$("status").textContent="Error: "+error.message;}
});
$("refresh").addEventListener("click",async()=>{
  $("status").textContent="Updating…";
  const result=await chrome.runtime.sendMessage({type:"REFRESH_RULES"});
  $("status").textContent=result.ok?"Updated "+result.count+" site rules; version "+result.version:"Error: "+result.error;
});
$("saveCustom").addEventListener("click",async()=>{
  try{
    const rules=validateCustom(JSON.parse($("customRules").value));
    await chrome.storage.local.set({customRules:rules});
    $("status").textContent="Saved "+rules.length+" custom rules.";
  }catch(error){$("status").textContent="Error: "+error.message;}
});
$("exportCustom").addEventListener("click",async()=>{
  try{
    const rules=validateCustom(JSON.parse($("customRules").value));
    const blob=new Blob([JSON.stringify(rules,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob);
    const link=document.createElement("a");link.href=url;link.download="custom-rules.json";link.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }catch(error){$("status").textContent="Error: "+error.message;}
});
init().catch(error=>$("status").textContent=String(error));
