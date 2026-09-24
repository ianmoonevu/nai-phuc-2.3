import test from 'node:test';
import assert from 'node:assert/strict';
import { contentKeys, createBackup, validateBackup, mergeBackup } from '../src/lib/contentBackup.ts';
const product = {id:'p', name:'P', series:'S', subtitle:'', description:'', tensileStrength:'100 MPa', aspectRatio:'80', primaryApplication:'', fiberCountPerKg:'', geometry:'', diameter:'1 mm', length:'60 mm', coating:'', keyMetric1:{label:'A',value:'1'},keyMetric2:{label:'B',value:'2'},standards:[],image:'/images/a.svg'};
const content = Object.fromEntries(Object.keys(contentKeys).map(key => [key, ['branding','epcSectionConfig','aboutInfo'].includes(key) ? {title:'Edited',hotlinePhone:'0123456789'} : key === 'products' ? [product] : [{id:key,name:'Edited',title:'Edited'}]]));
test('full backup round-trips every admin content section and excludes login and connection settings', () => {
 const backup=createBackup({...content,loginAdmin:'secret',supabaseKey:'secret'});
 assert.deepEqual(validateBackup(JSON.parse(JSON.stringify(backup))), content);
 assert.equal(backup.loginAdmin,undefined); assert.equal(backup.supabaseKey,undefined);
 backup.products[0].name='changed'; assert.equal(content.products[0].name,'P');
});
test('legacy v3 backup updates matching IDs without resetting other sections or items', () => {
 const incoming=validateBackup({version:'3.0',projects:[{id:'projects',title:'Restored'}],articles:[]});
 const next=mergeBackup({...content,projects:[...content.projects,{id:'new',title:'Keep'}]},incoming,'merge');
 assert.equal(next.projects.length,2); assert.equal(next.projects[0].title,'Restored');
 assert.equal(next.branding,undefined); assert.equal(next.products,undefined);
 assert.deepEqual(next.articles, content.articles);
});
test('reject malformed sections, unsupported formats and duplicate product IDs before restore', () => {
 for(const input of [{version:'9.0',projects:[]},{branding:[]},{products:[product,product]},{products:[]},{products:[{...product,keyMetric1:null}]},{products:[{...product,image:'javascript:alert(1)'}]}]) assert.throws(()=>validateBackup(input));
});
test('partial backup contains only the requested collection', () => {
 assert.deepEqual(Object.keys(createBackup(content,'projects')).sort(),['backupType','exportedAt','projects','version']);
});
