"use strict";
(() => {
  const DEFAULTS = {enabled:true,autoSkip:true,autoClose:true,hideBanners:true,muteWhileSkip:true};
  const MAX_CLICKS = 3;
  const RETRY_MS = 2500;
  const clickState = new WeakMap();
  const mutedMedia = new Map();
  let settings = {...DEFAULTS};
  let rulesFeed = {rules:[]};
  let customRules = [];
  let scheduled = false;

  function matchesDomain(pattern) {
    const host = location.hostname.toLowerCase();
    const domain = pattern.toLowerCase();
    return domain.startsWith("*.") ?
      host.endsWith(domain.slice(1)) && host !== domain.slice(2) :
      host === domain;
  }
  function matchesSite(rule) {
    return rule?.enabled !== false &&
      Array.isArray(rule?.domains) &&
      rule.domains.some(matchesDomain);
  }
  function actionKind(action) {
    if (action.kind === "skip" || action.kind === "close") return action.kind;
    return /skip|ข้าม/i.test(action.text || "") ? "skip" : "close";
  }
  function permitted(action) {
    if (action.type === "hide") return settings.hideBanners;
    if (action.type !== "click") return false;
    return actionKind(action) === "skip" ? settings.autoSkip : settings.autoClose;
  }
  function labelMatches(el, action) {
    const expected = (action.text || "").trim();
    if (!expected) return true;
    const labels = [
      el.getAttribute("aria-label"),
      el.getAttribute("title"),
      el.getAttribute("value"),
      el.innerText,
      el.textContent
    ].filter(Boolean).map(s => s.trim());
    return labels.some(label => action.exact
      ? label.toLocaleLowerCase() === expected.toLocaleLowerCase()
      : label.toLocaleLowerCase().includes(expected.toLocaleLowerCase()));
  }
  function isVisible(el) {
    if (!(el instanceof HTMLElement) || !el.isConnected || !el.getClientRects().length) return false;
    const style = getComputedStyle(el);
    return style.visibility !== "hidden" && style.display !== "none";
  }
  function canClick(el) {
    return isVisible(el) && !el.matches(":disabled,[aria-disabled='true']");
  }
  function skipIndicatorPresent(rules) {
    for (const rule of rules) for (const action of rule.actions || []) {
      if (action.type !== "click" || actionKind(action) !== "skip") continue;
      let elements;
      try { elements = document.querySelectorAll(action.selector); } catch { continue; }
      for (const el of elements) {
        if (isVisible(el) && labelMatches(el, action)) return true;
      }
    }
    return false;
  }
  function updateMediaMute(shouldMute) {
    if (shouldMute) {
      for (const media of document.querySelectorAll("video, audio")) {
        if (mutedMedia.has(media)) continue;
        if (!media.muted) {
          mutedMedia.set(media, false);
          media.muted = true;
        }
      }
    } else {
      for (const [media, originalMuted] of mutedMedia) {
        if (media.isConnected && media.muted) media.muted = originalMuted;
        mutedMedia.delete(media);
      }
    }
  }
  function apply() {
    const rules = settings.enabled ?
      [...(rulesFeed.rules || []),...customRules].filter(matchesSite) : [];
    updateMediaMute(Boolean(settings.enabled && settings.autoSkip && settings.muteWhileSkip && skipIndicatorPresent(rules)));
    if (!settings.enabled) return;
    const now = Date.now();
    for (const rule of rules) for (const action of rule.actions || []) {
      if (!permitted(action)) continue;
      let elements;
      try { elements = document.querySelectorAll(action.selector); }
      catch { continue; }
      for (const el of elements) {
        if (action.type === "hide") {
          if (el instanceof HTMLElement && (el.style.getPropertyValue("display") !== "none" || el.style.getPropertyPriority("display") !== "important")) el.style.setProperty("display","none","important");
          continue;
        }
        if (!canClick(el) || !labelMatches(el,action)) continue;
        let byAction = clickState.get(el);
        if (!byAction) { byAction = new Map(); clickState.set(el,byAction); }
        const key = rule.id + ":" + action.selector + ":" + (action.text || "");
        const state = byAction.get(key) || {count:0,time:0};
        if (state.count >= MAX_CLICKS || now - state.time < RETRY_MS) continue;
        byAction.set(key,{count:state.count+1,time:now});
        try { el.click(); } catch {}
      }
    }
  }
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    setTimeout(() => { scheduled = false; apply(); }, 150);
  }
  async function reload() {
    const data = await chrome.storage.local.get(["settings","rulesFeed","customRules"]);
    settings = {...DEFAULTS,...(data.settings || {})};
    rulesFeed = data.rulesFeed || {rules:[]};
    customRules = Array.isArray(data.customRules) ? data.customRules : [];
    schedule();
  }
  chrome.storage.onChanged.addListener((changes,area) => {
    if (area === "local" && ["settings","rulesFeed","customRules"].some(key => changes[key])) {
      reload().catch(console.error);
    }
  });
  if (document.documentElement) {
    const observer = new MutationObserver(schedule);
    observer.observe(document.documentElement,{
      childList:true,subtree:true,attributes:true,
      attributeFilter:["class","style","disabled","aria-disabled","aria-label","title"]
    });
  }
  reload().catch(console.error);
  setInterval(schedule,1000);
})();
