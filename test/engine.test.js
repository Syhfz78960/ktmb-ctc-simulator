import test from 'node:test';
import assert from 'node:assert/strict';
import {SimulationEngine} from '../src/engine.js';

test('incompatible routes cannot both be established',()=>{
 const e=new SimulationEngine('traffic');e.routeRequest('N1','P1');e.trainIndex=1;
 const result=e.routeRequest('S1','P1');assert.equal(result.ok,false);assert.match(result.reason,/conflicting|occupied|authority/i);
});
test('occupied, failed, or indeterminate sections cannot grant a route',()=>{
 for(const state of ['OCCUPIED','FAILED','INDETERMINATE']){const e=new SimulationEngine();e.setDetection('JUNCTION',state);const r=e.routeRequest('N1','P1');assert.equal(r.ok,false);assert.equal(r.checks.vacant,false);}
});
test('signal remains red when mandatory route conditions fail',()=>{
 const e=new SimulationEngine();assert.equal(e.getAspect('N1'),'RED');e.setPoints('REVERSE');assert.equal(e.routeRequest('N1','P1').ok,false);assert.equal(e.getAspect('N1'),'RED');
});
test('points cannot change while protected by a locked route',()=>{const e=new SimulationEngine();assert.equal(e.routeRequest('N1','P1').ok,true);const r=e.setPoints('REVERSE');assert.equal(r.ok,false);assert.equal(e.points,'NORMAL');});
test('train remains inside movement authority and route releases on arrival',()=>{
 const e=new SimulationEngine();assert.equal(e.routeRequest('N1','P1').ok,true);e.tick();assert.equal(e.selectedTrain.position,1);assert.equal(e.sections.JUNCTION,'OCCUPIED');assert.equal(e.getAspect('N1'),'RED');e.tick();assert.equal(e.selectedTrain.position,2);assert.equal(e.selectedTrain.state,'Arrived · platform');assert.equal(e.sections.PLATFORM1,'OCCUPIED');assert.equal(Object.keys(e.routes).length,0);assert.equal(e.getAspect('N1'),'RED');
});
test('opposing trains cannot establish overlapping single-line authorities',()=>{
 const e=new SimulationEngine('traffic');assert.equal(e.routeRequest('N1','P1').ok,true);e.trainIndex=1;assert.equal(e.routeRequest('S1','P2').ok,false);
});
test('failed detection is not considered clear',()=>{const e=new SimulationEngine();e.setDetection('NORTH','FAILED');assert.equal(e.routeRequest('N1','P1').ok,false);assert.equal(e.getAspect('N1'),'RED');});
test('scenario reset restores consistent state',()=>{const e=new SimulationEngine('traffic');e.routeRequest('N1','P1');e.reset('training');assert.equal(e.trains.length,1);assert.equal(e.sections.NORTH,'CLEAR');assert.equal(e.points,'NORMAL');assert.deepEqual(e.routes,{});assert.equal(e.getAspect('N1'),'RED');});
test('route cancellation releases unentered approach and returns signal to red',()=>{const e=new SimulationEngine();e.routeRequest('N1','P1');const r=e.cancelRoute();assert.equal(r.ok,true);assert.equal(e.sections.NORTH,'CLEAR');assert.equal(e.getAspect('N1'),'RED');});
