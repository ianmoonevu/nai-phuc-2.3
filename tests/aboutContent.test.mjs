import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeAbout, migrateAboutInfo, aboutPayload } from '../src/lib/aboutContent.ts';
import { createBackup, validateBackup } from '../src/lib/contentBackup.ts';
const fallback={aboutInfo:{timeline:[{year:'2026',title:'Original',description:'Keep'}]},leadershipHeads:[{id:'l1',name:'Local edit',avatar:'/images/a.svg'}],advisoryMembers:[]};
test('old editor aliases and locally edited people migrate without losing unknown content',()=>{
 const doc=normalizeAbout({aboutInfo:{title:'Old',heroTitle:'Saved title',brandStoryP1:'One',brandStoryP2:'Two',factoryTitle:'Saved factory',custom:'Keep'}},fallback);
 assert.equal(doc.aboutInfo.title,'Saved title'); assert.equal(doc.aboutInfo.description,'One\n\nTwo');
 assert.equal(doc.aboutInfo.factoryTitle,'Saved factory'); assert.equal(doc.aboutInfo.custom,'Keep'); assert.equal(doc.leadershipHeads[0].name,'Local edit');
 assert.equal(aboutPayload(doc).leadershipHeads[0].avatar,'/images/a.svg');
});
test('canonical edits, intentionally empty text and deleted people remain authoritative',()=>{
 const doc=normalizeAbout({aboutInfo:{aboutContentVersion:1,title:'',heroTitle:'Stale',timeline:[],pageText:{section3Text1:''}},leadershipHeads:[],advisoryMembers:[]},fallback);
 assert.equal(doc.aboutInfo.title,''); assert.equal(doc.aboutInfo.pageText.section3Text1,'');assert.deepEqual(doc.leadershipHeads,[]);assert.deepEqual(doc.aboutInfo.timeline,[]);
 const restored=validateBackup(createBackup(doc));assert.deepEqual(restored,doc);
});
test('reject invalid personnel, image addresses and structured page data before writes',()=>{
 const base=normalizeAbout({},fallback);
 for(const edit of [d=>d.leadershipHeads.push({...d.leadershipHeads[0]}),d=>d.leadershipHeads[0].avatar='javascript:alert(1)',d=>d.aboutInfo.timeline={},d=>d.aboutInfo.partnerNetwork.apac.hubs=42,d=>d.aboutInfo.pageText.section3Text1={}]) {
  const d=structuredClone(base);edit(d);assert.throws(()=>aboutPayload(d));
 }
 assert.equal(migrateAboutInfo({heroTitle:'Legacy restore'}).title,'Legacy restore');
});
