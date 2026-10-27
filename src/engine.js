// Deterministic game model. UI code may request changes but cannot set aspects or authority.
export const ROUTES = {
  'N1-P1': { id:'N1-P1', origin:'N1', destination:'P1', sections:['NORTH','JUNCTION','PLATFORM1'], points:'NORMAL', conflict:'S1-P2', direction:'Northbound' },
  'N1-P2': { id:'N1-P2', origin:'N1', destination:'P2', sections:['NORTH','JUNCTION','PLATFORM2'], points:'REVERSE', conflict:'S1-P1', direction:'Northbound' },
  'S1-P1': { id:'S1-P1', origin:'S1', destination:'P1', sections:['SOUTH','JUNCTION','PLATFORM1'], points:'NORMAL', conflict:'N1-P2', direction:'Southbound' },
  'S1-P2': { id:'S1-P2', origin:'S1', destination:'P2', sections:['SOUTH','JUNCTION','PLATFORM2'], points:'REVERSE', conflict:'N1-P1', direction:'Southbound' }
};
const makeTrain=(id,origin,section,category='Intercity')=>({id,origin,section,position:0,speed:0,maxSpeed:80,category,state:'Waiting for route',delay:0,route:null,authority:null});
export class SimulationEngine {
  constructor(mode='training') { this.reset(mode); }
  reset(mode=this.mode||'training') {
    this.mode=mode; this.time=0; this.points='NORMAL'; this.pointDetected=true; this.sections={NORTH:'CLEAR',SOUTH:'CLEAR',JUNCTION:'CLEAR',PLATFORM1:'CLEAR',PLATFORM2:'CLEAR'};
    this.routes={}; this.trainIndex=0; this.events=[]; this.routeCount=0; this.alarms=[]; this.failed=false;
    this.trains=[makeTrain('KTMB 24','N1','NORTH')];
    if(mode==='traffic') this.trains.push(makeTrain('KTM 81','S1','SOUTH','Commuter'));
    this.log('Scenario started · '+(mode==='traffic'?'Timetable · two arrivals':'Training · route setting'));
  }
  get selectedTrain(){ return this.trains[this.trainIndex] || this.trains[0]; }
  log(message,type='info'){ this.events.unshift({time:this.time,message,type}); this.events=this.events.slice(0,80); }
  routeRequest(origin,destination,train=this.selectedTrain){
    const key=`${origin}-${destination}`, route=ROUTES[key];
    const checks={vacant:false,points:false,conflict:false,block:false};
    if(!route) return {ok:false,reason:'That origin and destination are not connected in this layout.',checks};
    const occupied=route.sections.find(s=>this.sections[s]!=='CLEAR'); checks.vacant=!occupied;
    checks.points=this.points===route.points&&this.pointDetected;
    checks.conflict=!this.routes[route.conflict]&&!Object.values(this.routes).some(r=>r.trainId!==train.id&&r.sections.some(s=>route.sections.includes(s)));
    checks.block=this.sections[route.sections[0]]==='CLEAR'&&!Object.values(this.routes).some(r=>r.origin!==origin);
    const reason=!checks.vacant?`Route unavailable: ${occupied} is ${this.sections[occupied].toLowerCase()}.`:!checks.points?`Route unavailable: points must be ${route.points.toLowerCase()} and detected.`:!checks.conflict?'Route unavailable: a conflicting or overlapping route is locked.':!checks.block?'Route unavailable: block authority is already allocated.':null;
    if(reason){this.log(reason,'warning');return {ok:false,reason,checks};}
    this.routes[key]={...route,trainId:train.id,locked:true}; train.route=key;train.authority=[...route.sections];train.state='Route set · awaiting departure';
    this.sections[route.sections[0]]='OCCUPIED'; this.routeCount++; this.log(`${train.id}: route ${origin} → ${destination} set, locked and signal cleared.`,'success');
    return {ok:true,reason:`Route ${origin} → ${destination} established. ${train.id} has movement authority to ${destination}.`,checks};
  }
  setPoints(position){
    if(!['NORMAL','REVERSE'].includes(position))return {ok:false,reason:'Invalid point position.'};
    if(Object.keys(this.routes).length)return {ok:false,reason:'Points are locked by an established route.'};
    if(!this.pointDetected)return {ok:false,reason:'Point detection unavailable; movement is prohibited.'};
    this.points=position;this.log(`Points P1 set ${position.toLowerCase()} and detected.`);return {ok:true,reason:`Points set ${position.toLowerCase()}.`};
  }
  cancelRoute(train=this.selectedTrain){
    const key=Object.keys(this.routes).find(k=>this.routes[k].trainId===train.id);if(!key)return {ok:false,reason:'No cancellable route for selected train.'};
    const route=this.routes[key];if(route.sections.some(s=>this.sections[s]==='OCCUPIED'&&s!=='NORTH'&&s!=='SOUTH'))return {ok:false,reason:'Train has entered the protected route; cancellation is unavailable until it arrives.'};
    delete this.routes[key];this.sections[route.sections[0]]='CLEAR';train.route=null;train.authority=null;train.state='Waiting for route';this.log(`${train.id}: route cancelled and approach authority released.`);return {ok:true,reason:'Route cancelled; signal returned to red.'};
  }
  tick(){
    if(this.failed)return; this.time++;
    for(const t of this.trains){if(!t.route||t.state==='Arrived')continue;const route=this.routes[t.route];if(!route)continue;
      if(t.position===0){t.position=1;t.speed=40;t.state='Proceeding under authority';this.sections[route.sections[0]]='CLEAR';this.sections[route.sections[1]]='OCCUPIED';this.log(`${t.id} departed on cleared route.`);}
      else if(t.position===1){t.position=2;t.speed=0;t.state='Arrived · platform';this.sections[route.sections[1]]='CLEAR';this.sections[route.sections[2]]='OCCUPIED';this.log(`${t.id} arrived at ${route.destination}.`,'success');delete this.routes[t.route];t.route=null;t.authority=null;this.log(`Route released after arrival; ${route.destination} remains occupied.`);}
      else if(t.position===2&&this.time>4){this.sections[route.sections[2]]='CLEAR';t.state='Departed';t.speed=0;this.log(`${t.id} departed platform; section clear.`);}
    }
  }
  setDetection(section,state){if(!(section in this.sections))throw Error('Unknown section');if(!['CLEAR','OCCUPIED','FAILED','INDETERMINATE'].includes(state))throw Error('Invalid detection state');this.sections[section]=state;this.log(`${section} detection state: ${state.toLowerCase()}.`,state==='CLEAR'?'info':'warning');}
  getAspect(origin){const route=Object.values(this.routes).find(r=>r.origin===origin);if(!route)return 'RED';const train=this.trains.find(t=>t.id===route.trainId);return train&&train.position===0?'GREEN':'RED';}
}
