import test from 'node:test';
import assert from 'node:assert/strict';
import { adminEmail, authenticateAdmin, verifyAdmin } from '../src/lib/adminIdentity.ts';
test('ID mapping contains no preselected account and rejects malformed identifiers',()=>{
 assert.equal(adminEmail(' Example.Owner '),'example.owner@admin.hokimetal.vn');
 for(const id of ['', 'owner@example.org','a b','<script>'])assert.throws(()=>adminEmail(id));
});
test('server-confirmed user plus allowlist is required; login fails closed',async()=>{
 let role=false,signedOut=0;
 const client={auth:{signInWithPassword:async()=>({error:null}),getUser:async()=>({data:{user:{id:'test'}},error:null}),signOut:async()=>{signedOut++;}},rpc:async()=>({data:role,error:null})};
 assert.equal(await authenticateAdmin(client,'example','test-only'),false);assert.equal(signedOut,1);
 role=true;assert.equal(await authenticateAdmin(client,'example','test-only'),true);
 client.rpc=async()=>({data:true,error:{message:'offline'}});assert.equal(await verifyAdmin(client),false);
 client.auth.getUser=async()=>({data:{user:null},error:null});assert.equal(await verifyAdmin(client),false);
});
