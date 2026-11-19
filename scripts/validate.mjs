import fs from "node:fs";
import assert from "node:assert/strict";
const root=new URL("../",import.meta.url);
const read=path=>fs.readFileSync(new URL(path,root),"utf8");
const feed=JSON.parse(read("ad-rules.json"));
assert.equal(feed.schemaVersion,1,"schemaVersion must be 1");
assert.ok(Array.isArray(feed.rules),"rules must be array");
for(const rule of feed.rules){
  assert.ok(typeof rule.id==="string"&&rule.id.length,"rule must have id");
  assert.ok(Array.isArray(rule.domains)&&rule.domains.length,"rule must have domains");
  assert.ok(rule.domains.every(d=>/^(?:\*\.)?[a-z0-9.-]+$/i.test(d)),"invalid domain");
  assert.ok(Array.isArray(rule.actions),"rule must have actions");
  for(const action of rule.actions){
    assert.ok(["hide","click"].includes(action.type),"unsupported action type");
    assert.ok(typeof action.selector==="string"&&action.selector.length>0,"missing selector");
    if(action.text!==undefined) assert.equal(typeof action.text,"string");
    if(action.kind!==undefined) assert.ok(["skip","close"].includes(action.kind),"invalid action kind");
  }
}
const manifest=JSON.parse(read("extension/manifest.json"));
assert.equal(manifest.manifest_version,3);
for(const path of ["extension/background.js","extension/content.js","extension/popup.js","extension/options.js"]) {
  new (await import("node:vm")).Script(read(path),{filename:path});
}
for(const path of ["extension/popup.html","extension/options.html"]){
  assert.ok(read(path).includes("<script src="),"missing local script in "+path);
}
console.log("PASS: JSON schema, manifest and JavaScript syntax; "+feed.rules.length+" site rules");
