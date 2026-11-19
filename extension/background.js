"use strict";
const DEFAULT_FEED = "https://raw.githubusercontent.com/6921414501-del/universal-ad-skip-rules/main/ad-rules.json";
const ALARM_NAME = "refresh-remote-rules";
const DEFAULT_SETTINGS = {enabled:true, autoSkip:true, autoClose:true, hideBanners:true, feedUrl:DEFAULT_FEED};
const ACTIONS = new Set(["click", "hide"]);
function validateFeed(feed) {
  if (!feed || feed.schemaVersion !== 1 || !Array.isArray(feed.rules) || feed.rules.length > 1000) throw Error("Unsupported rules schema");
  return {schemaVersion:1,version:String(feed.version || "unknown").slice(0,80),rules:feed.rules.map(rule => {
    if (!rule || typeof rule.id !== "string" || !Array.isArray(rule.domains) || !Array.isArray(rule.actions)) throw Error("Invalid site rule");
    const domains = rule.domains.filter(x => typeof x === "string" && /^(?:\*\.)?[a-z0-9.-]+$/i.test(x)).slice(0,50);
    if (!domains.length) throw Error("Missing valid domain");
    const actions = rule.actions.map(a => {
      if (!a || !ACTIONS.has(a.type) || typeof a.selector !== "string" || !a.selector.trim() || a.selector.length > 500) throw Error("Invalid action");
      return {type:a.type,selector:a.selector,text:typeof a.text === "string" ? a.text.slice(0,160) : "",exact:a.exact === true};
    }).slice(0,100);
    return {id:rule.id.slice(0,100),domains,enabled:rule.enabled !== false,actions};
  })};
}
async function refreshRules() {
  const {settings = DEFAULT_SETTINGS} = await chrome.storage.local.get("settings");
  try {
    const url = new URL(settings.feedUrl || DEFAULT_FEED);
    if (url.protocol !== "https:") throw Error("Feed must use HTTPS");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    let response;
    try { response = await fetch(url.href, {cache:"no-store",signal:controller.signal}); }
    finally { clearTimeout(timer); }
    if (!response.ok) throw Error("HTTP " + response.status);
    const raw = await response.text();
    if (raw.length > 1024 * 1024) throw Error("Feed exceeds 1 MB");
    const rulesFeed = validateFeed(JSON.parse(raw));
    await chrome.storage.local.set({rulesFeed,lastUpdated:new Date().toISOString(),lastError:""});
    return {ok:true,version:rulesFeed.version,count:rulesFeed.rules.length};
  } catch (error) {
    const message = String(error.message || error).slice(0,240);
    await chrome.storage.local.set({lastError:message});
    return {ok:false,error:message};
  }
}
async function initialize() {
  const data = await chrome.storage.local.get(["settings","customRules"]);
  if (!data.settings) await chrome.storage.local.set({settings:DEFAULT_SETTINGS});
  if (!data.customRules) await chrome.storage.local.set({customRules:[]});
  await chrome.alarms.create(ALARM_NAME,{periodInMinutes:30});
  await refreshRules();
}
chrome.runtime.onInstalled.addListener(() => { initialize().catch(console.error); });
chrome.runtime.onStartup.addListener(() => { initialize().catch(console.error); });
chrome.alarms.onAlarm.addListener(alarm => { if (alarm.name === ALARM_NAME) refreshRules().catch(console.error); });
chrome.runtime.onMessage.addListener((message,sender,sendResponse) => {
  if (message?.type !== "REFRESH_RULES") return;
  refreshRules().then(sendResponse).catch(error => sendResponse({ok:false,error:String(error)}));
  return true;
});
