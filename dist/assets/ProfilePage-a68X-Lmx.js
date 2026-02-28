import{e as Dn,u as Pn,r as $,j as l,a as Te,f as ve,z as N}from"./index-Cv_EM5B3.js";import{D as On}from"./DashboardLayout-Dgk-_yJ3.js";import{s as Un}from"./setting.service-HHQ1G6XQ.js";import{C as Bn}from"./credit-card-DXrYcg-6.js";import{D as Mn}from"./download-C72kMWMo.js";import{S as Ln}from"./save-BnGpkhwG.js";import{L as he}from"./lock-C4emi0Rs.js";import"./graduation-cap-DFyTfTku.js";import"./video-D6oD5f21.js";/**
 * @license lucide-react v0.294.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jn=Dn("Camera",[["path",{d:"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",key:"1tc9qg"}],["circle",{cx:"12",cy:"13",r:"3",key:"1vg3eu"}]]),Fn=()=>{};var rt={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kt=function(e){const t=[];let n=0;for(let s=0;s<e.length;s++){let r=e.charCodeAt(s);r<128?t[n++]=r:r<2048?(t[n++]=r>>6|192,t[n++]=r&63|128):(r&64512)===55296&&s+1<e.length&&(e.charCodeAt(s+1)&64512)===56320?(r=65536+((r&1023)<<10)+(e.charCodeAt(++s)&1023),t[n++]=r>>18|240,t[n++]=r>>12&63|128,t[n++]=r>>6&63|128,t[n++]=r&63|128):(t[n++]=r>>12|224,t[n++]=r>>6&63|128,t[n++]=r&63|128)}return t},$n=function(e){const t=[];let n=0,s=0;for(;n<e.length;){const r=e[n++];if(r<128)t[s++]=String.fromCharCode(r);else if(r>191&&r<224){const i=e[n++];t[s++]=String.fromCharCode((r&31)<<6|i&63)}else if(r>239&&r<365){const i=e[n++],a=e[n++],c=e[n++],o=((r&7)<<18|(i&63)<<12|(a&63)<<6|c&63)-65536;t[s++]=String.fromCharCode(55296+(o>>10)),t[s++]=String.fromCharCode(56320+(o&1023))}else{const i=e[n++],a=e[n++];t[s++]=String.fromCharCode((r&15)<<12|(i&63)<<6|a&63)}}return t.join("")},Dt={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(e,t){if(!Array.isArray(e))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let r=0;r<e.length;r+=3){const i=e[r],a=r+1<e.length,c=a?e[r+1]:0,o=r+2<e.length,u=o?e[r+2]:0,h=i>>2,f=(i&3)<<4|c>>4;let d=(c&15)<<2|u>>6,m=u&63;o||(m=64,a||(d=64)),s.push(n[h],n[f],n[d],n[m])}return s.join("")},encodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(e):this.encodeByteArray(kt(e),t)},decodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(e):$n(this.decodeStringToByteArray(e,t))},decodeStringToByteArray(e,t){this.init_();const n=t?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let r=0;r<e.length;){const i=n[e.charAt(r++)],c=r<e.length?n[e.charAt(r)]:0;++r;const u=r<e.length?n[e.charAt(r)]:64;++r;const f=r<e.length?n[e.charAt(r)]:64;if(++r,i==null||c==null||u==null||f==null)throw new Hn;const d=i<<2|c>>4;if(s.push(d),u!==64){const m=c<<4&240|u>>2;if(s.push(m),f!==64){const p=u<<6&192|f;s.push(p)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let e=0;e<this.ENCODED_VALS.length;e++)this.byteToCharMap_[e]=this.ENCODED_VALS.charAt(e),this.charToByteMap_[this.byteToCharMap_[e]]=e,this.byteToCharMapWebSafe_[e]=this.ENCODED_VALS_WEBSAFE.charAt(e),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]]=e,e>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)]=e,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)]=e)}}};class Hn extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const qn=function(e){const t=kt(e);return Dt.encodeByteArray(t,!0)},me=function(e){return qn(e).replace(/\./g,"")},zn=function(e){try{return Dt.decodeString(e,!0)}catch(t){console.error("base64Decode failed: ",t)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vn(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof globalThis<"u")return globalThis;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wn=()=>Vn().__FIREBASE_DEFAULTS__,Gn=()=>{if(typeof process>"u"||typeof rt>"u")return;const e=rt.__FIREBASE_DEFAULTS__;if(e)return JSON.parse(e)},Kn=()=>{if(typeof document>"u")return;let e;try{e=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const t=e&&zn(e[1]);return t&&JSON.parse(t)},Pt=()=>{try{return Fn()||Wn()||Gn()||Kn()}catch(e){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);return}},Xn=e=>{var t,n;return(n=(t=Pt())==null?void 0:t.emulatorHosts)==null?void 0:n[e]},Yn=e=>{const t=Xn(e);if(!t)return;const n=t.lastIndexOf(":");if(n<=0||n+1===t.length)throw new Error(`Invalid host ${t} with no separate hostname and port!`);const s=parseInt(t.substring(n+1),10);return t[0]==="["?[t.substring(1,n-1),s]:[t.substring(0,n),s]},Ot=()=>{var e;return(e=Pt())==null?void 0:e.config};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jn{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((t,n)=>{this.resolve=t,this.reject=n})}wrapCallback(t){return(n,s)=>{n?this.reject(n):this.resolve(s),typeof t=="function"&&(this.promise.catch(()=>{}),t.length===1?t(n):t(n,s))}}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qe(e){try{return(e.startsWith("http://")||e.startsWith("https://")?new URL(e).hostname:e).endsWith(".cloudworkstations.dev")}catch{return!1}}async function Zn(e){return(await fetch(e,{credentials:"include"})).ok}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qn(e,t){if(e.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n={alg:"none",type:"JWT"},s=t||"demo-project",r=e.iat||0,i=e.sub||e.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const a={iss:`https://securetoken.google.com/${s}`,aud:s,iat:r,exp:r+3600,auth_time:r,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}},...e};return[me(JSON.stringify(n)),me(JSON.stringify(a)),""].join(".")}const oe={};function es(){const e={prod:[],emulator:[]};for(const t of Object.keys(oe))oe[t]?e.emulator.push(t):e.prod.push(t);return e}function ts(e){let t=document.getElementById(e),n=!1;return t||(t=document.createElement("div"),t.setAttribute("id",e),n=!0),{created:n,element:t}}let it=!1;function ns(e,t){if(typeof window>"u"||typeof document>"u"||!qe(window.location.host)||oe[e]===t||oe[e]||it)return;oe[e]=t;function n(d){return`__firebase__banner__${d}`}const s="__firebase__banner",i=es().prod.length>0;function a(){const d=document.getElementById(s);d&&d.remove()}function c(d){d.style.display="flex",d.style.background="#7faaf0",d.style.position="fixed",d.style.bottom="5px",d.style.left="5px",d.style.padding=".5em",d.style.borderRadius="5px",d.style.alignItems="center"}function o(d,m){d.setAttribute("width","24"),d.setAttribute("id",m),d.setAttribute("height","24"),d.setAttribute("viewBox","0 0 24 24"),d.setAttribute("fill","none"),d.style.marginLeft="-6px"}function u(){const d=document.createElement("span");return d.style.cursor="pointer",d.style.marginLeft="16px",d.style.fontSize="24px",d.innerHTML=" &times;",d.onclick=()=>{it=!0,a()},d}function h(d,m){d.setAttribute("id",m),d.innerText="Learn more",d.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",d.setAttribute("target","__blank"),d.style.paddingLeft="5px",d.style.textDecoration="underline"}function f(){const d=ts(s),m=n("text"),p=document.getElementById(m)||document.createElement("span"),T=n("learnmore"),_=document.getElementById(T)||document.createElement("a"),A=n("preprendIcon"),x=document.getElementById(A)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(d.created){const g=d.element;c(g),h(_,T);const I=u();o(x,A),g.append(x,p,_,I),document.body.appendChild(g)}i?(p.innerText="Preview backend disconnected.",x.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(x.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,p.innerText="Preview backend running in this workspace."),p.setAttribute("id",m)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",f):f()}function ss(){const e=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof e=="object"&&e.id!==void 0}function Ut(){try{return typeof indexedDB=="object"}catch{return!1}}function Bt(){return new Promise((e,t)=>{try{let n=!0;const s="validate-browser-context-for-indexeddb-analytics-module",r=self.indexedDB.open(s);r.onsuccess=()=>{r.result.close(),n||self.indexedDB.deleteDatabase(s),e(!0)},r.onupgradeneeded=()=>{n=!1},r.onerror=()=>{var i;t(((i=r.error)==null?void 0:i.message)||"")}}catch(n){t(n)}})}function rs(){return!(typeof navigator>"u"||!navigator.cookieEnabled)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const is="FirebaseError";class W extends Error{constructor(t,n,s){super(n),this.code=t,this.customData=s,this.name=is,Object.setPrototypeOf(this,W.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,ye.prototype.create)}}class ye{constructor(t,n,s){this.service=t,this.serviceName=n,this.errors=s}create(t,...n){const s=n[0]||{},r=`${this.service}/${t}`,i=this.errors[t],a=i?as(i,s):"Error",c=`${this.serviceName}: ${a} (${r}).`;return new W(r,c,s)}}function as(e,t){return e.replace(os,(n,s)=>{const r=t[s];return r!=null?String(r):`<${s}?>`})}const os=/\{\$([^}]+)}/g;function Ue(e,t){if(e===t)return!0;const n=Object.keys(e),s=Object.keys(t);for(const r of n){if(!s.includes(r))return!1;const i=e[r],a=t[r];if(at(i)&&at(a)){if(!Ue(i,a))return!1}else if(i!==a)return!1}for(const r of s)if(!n.includes(r))return!1;return!0}function at(e){return e!==null&&typeof e=="object"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cs=1e3,ls=2,us=14400*1e3,ds=.5;function ot(e,t=cs,n=ls){const s=t*Math.pow(n,e),r=Math.round(ds*s*(Math.random()-.5)*2);return Math.min(us,s+r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ne(e){return e&&e._delegate?e._delegate:e}class B{constructor(t,n,s){this.name=t,this.instanceFactory=n,this.type=s,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(t){return this.instantiationMode=t,this}setMultipleInstances(t){return this.multipleInstances=t,this}setServiceProps(t){return this.serviceProps=t,this}setInstanceCreatedCallback(t){return this.onInstanceCreated=t,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const G="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hs{constructor(t,n){this.name=t,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(t){const n=this.normalizeInstanceIdentifier(t);if(!this.instancesDeferred.has(n)){const s=new Jn;if(this.instancesDeferred.set(n,s),this.isInitialized(n)||this.shouldAutoInitialize())try{const r=this.getOrInitializeService({instanceIdentifier:n});r&&s.resolve(r)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(t){const n=this.normalizeInstanceIdentifier(t==null?void 0:t.identifier),s=(t==null?void 0:t.optional)??!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(r){if(s)return null;throw r}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(t){if(t.name!==this.name)throw Error(`Mismatching Component ${t.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=t,!!this.shouldAutoInitialize()){if(ps(t))try{this.getOrInitializeService({instanceIdentifier:G})}catch{}for(const[n,s]of this.instancesDeferred.entries()){const r=this.normalizeInstanceIdentifier(n);try{const i=this.getOrInitializeService({instanceIdentifier:r});s.resolve(i)}catch{}}}}clearInstance(t=G){this.instancesDeferred.delete(t),this.instancesOptions.delete(t),this.instances.delete(t)}async delete(){const t=Array.from(this.instances.values());await Promise.all([...t.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...t.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(t=G){return this.instances.has(t)}getOptions(t=G){return this.instancesOptions.get(t)||{}}initialize(t={}){const{options:n={}}=t,s=this.normalizeInstanceIdentifier(t.instanceIdentifier);if(this.isInitialized(s))throw Error(`${this.name}(${s}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const r=this.getOrInitializeService({instanceIdentifier:s,options:n});for(const[i,a]of this.instancesDeferred.entries()){const c=this.normalizeInstanceIdentifier(i);s===c&&a.resolve(r)}return r}onInit(t,n){const s=this.normalizeInstanceIdentifier(n),r=this.onInitCallbacks.get(s)??new Set;r.add(t),this.onInitCallbacks.set(s,r);const i=this.instances.get(s);return i&&t(i,s),()=>{r.delete(t)}}invokeOnInitCallbacks(t,n){const s=this.onInitCallbacks.get(n);if(s)for(const r of s)try{r(t,n)}catch{}}getOrInitializeService({instanceIdentifier:t,options:n={}}){let s=this.instances.get(t);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:fs(t),options:n}),this.instances.set(t,s),this.instancesOptions.set(t,n),this.invokeOnInitCallbacks(s,t),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,t,s)}catch{}return s||null}normalizeInstanceIdentifier(t=G){return this.component?this.component.multipleInstances?t:G:t}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function fs(e){return e===G?void 0:e}function ps(e){return e.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ms{constructor(t){this.name=t,this.providers=new Map}addComponent(t){const n=this.getProvider(t.name);if(n.isComponentSet())throw new Error(`Component ${t.name} has already been registered with ${this.name}`);n.setComponent(t)}addOrOverwriteComponent(t){this.getProvider(t.name).isComponentSet()&&this.providers.delete(t.name),this.addComponent(t)}getProvider(t){if(this.providers.has(t))return this.providers.get(t);const n=new hs(t,this);return this.providers.set(t,n),n}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var b;(function(e){e[e.DEBUG=0]="DEBUG",e[e.VERBOSE=1]="VERBOSE",e[e.INFO=2]="INFO",e[e.WARN=3]="WARN",e[e.ERROR=4]="ERROR",e[e.SILENT=5]="SILENT"})(b||(b={}));const gs={debug:b.DEBUG,verbose:b.VERBOSE,info:b.INFO,warn:b.WARN,error:b.ERROR,silent:b.SILENT},_s=b.INFO,bs={[b.DEBUG]:"log",[b.VERBOSE]:"log",[b.INFO]:"info",[b.WARN]:"warn",[b.ERROR]:"error"},ys=(e,t,...n)=>{if(t<e.logLevel)return;const s=new Date().toISOString(),r=bs[t];if(r)console[r](`[${s}]  ${e.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`)};class Mt{constructor(t){this.name=t,this._logLevel=_s,this._logHandler=ys,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(t){if(!(t in b))throw new TypeError(`Invalid value "${t}" assigned to \`logLevel\``);this._logLevel=t}setLogLevel(t){this._logLevel=typeof t=="string"?gs[t]:t}get logHandler(){return this._logHandler}set logHandler(t){if(typeof t!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=t}get userLogHandler(){return this._userLogHandler}set userLogHandler(t){this._userLogHandler=t}debug(...t){this._userLogHandler&&this._userLogHandler(this,b.DEBUG,...t),this._logHandler(this,b.DEBUG,...t)}log(...t){this._userLogHandler&&this._userLogHandler(this,b.VERBOSE,...t),this._logHandler(this,b.VERBOSE,...t)}info(...t){this._userLogHandler&&this._userLogHandler(this,b.INFO,...t),this._logHandler(this,b.INFO,...t)}warn(...t){this._userLogHandler&&this._userLogHandler(this,b.WARN,...t),this._logHandler(this,b.WARN,...t)}error(...t){this._userLogHandler&&this._userLogHandler(this,b.ERROR,...t),this._logHandler(this,b.ERROR,...t)}}const ws=(e,t)=>t.some(n=>e instanceof n);let ct,lt;function Is(){return ct||(ct=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Es(){return lt||(lt=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Lt=new WeakMap,Be=new WeakMap,jt=new WeakMap,xe=new WeakMap,ze=new WeakMap;function Ts(e){const t=new Promise((n,s)=>{const r=()=>{e.removeEventListener("success",i),e.removeEventListener("error",a)},i=()=>{n(q(e.result)),r()},a=()=>{s(e.error),r()};e.addEventListener("success",i),e.addEventListener("error",a)});return t.then(n=>{n instanceof IDBCursor&&Lt.set(n,e)}).catch(()=>{}),ze.set(t,e),t}function vs(e){if(Be.has(e))return;const t=new Promise((n,s)=>{const r=()=>{e.removeEventListener("complete",i),e.removeEventListener("error",a),e.removeEventListener("abort",a)},i=()=>{n(),r()},a=()=>{s(e.error||new DOMException("AbortError","AbortError")),r()};e.addEventListener("complete",i),e.addEventListener("error",a),e.addEventListener("abort",a)});Be.set(e,t)}let Me={get(e,t,n){if(e instanceof IDBTransaction){if(t==="done")return Be.get(e);if(t==="objectStoreNames")return e.objectStoreNames||jt.get(e);if(t==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return q(e[t])},set(e,t,n){return e[t]=n,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function xs(e){Me=e(Me)}function Cs(e){return e===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(t,...n){const s=e.call(Ce(this),t,...n);return jt.set(s,t.sort?t.sort():[t]),q(s)}:Es().includes(e)?function(...t){return e.apply(Ce(this),t),q(Lt.get(this))}:function(...t){return q(e.apply(Ce(this),t))}}function Ss(e){return typeof e=="function"?Cs(e):(e instanceof IDBTransaction&&vs(e),ws(e,Is())?new Proxy(e,Me):e)}function q(e){if(e instanceof IDBRequest)return Ts(e);if(xe.has(e))return xe.get(e);const t=Ss(e);return t!==e&&(xe.set(e,t),ze.set(t,e)),t}const Ce=e=>ze.get(e);function Ft(e,t,{blocked:n,upgrade:s,blocking:r,terminated:i}={}){const a=indexedDB.open(e,t),c=q(a);return s&&a.addEventListener("upgradeneeded",o=>{s(q(a.result),o.oldVersion,o.newVersion,q(a.transaction),o)}),n&&a.addEventListener("blocked",o=>n(o.oldVersion,o.newVersion,o)),c.then(o=>{i&&o.addEventListener("close",()=>i()),r&&o.addEventListener("versionchange",u=>r(u.oldVersion,u.newVersion,u))}).catch(()=>{}),c}const As=["get","getKey","getAll","getAllKeys","count"],Rs=["put","add","delete","clear"],Se=new Map;function ut(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(Se.get(t))return Se.get(t);const n=t.replace(/FromIndex$/,""),s=t!==n,r=Rs.includes(n);if(!(n in(s?IDBIndex:IDBObjectStore).prototype)||!(r||As.includes(n)))return;const i=async function(a,...c){const o=this.transaction(a,r?"readwrite":"readonly");let u=o.store;return s&&(u=u.index(c.shift())),(await Promise.all([u[n](...c),r&&o.done]))[0]};return Se.set(t,i),i}xs(e=>({...e,get:(t,n,s)=>ut(t,n)||e.get(t,n,s),has:(t,n)=>!!ut(t,n)||e.has(t,n)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ns{constructor(t){this.container=t}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(ks(n)){const s=n.getImmediate();return`${s.library}/${s.version}`}else return null}).filter(n=>n).join(" ")}}function ks(e){const t=e.getComponent();return(t==null?void 0:t.type)==="VERSION"}const Le="@firebase/app",dt="0.14.6";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const M=new Mt("@firebase/app"),Ds="@firebase/app-compat",Ps="@firebase/analytics-compat",Os="@firebase/analytics",Us="@firebase/app-check-compat",Bs="@firebase/app-check",Ms="@firebase/auth",Ls="@firebase/auth-compat",js="@firebase/database",Fs="@firebase/data-connect",$s="@firebase/database-compat",Hs="@firebase/functions",qs="@firebase/functions-compat",zs="@firebase/installations",Vs="@firebase/installations-compat",Ws="@firebase/messaging",Gs="@firebase/messaging-compat",Ks="@firebase/performance",Xs="@firebase/performance-compat",Ys="@firebase/remote-config",Js="@firebase/remote-config-compat",Zs="@firebase/storage",Qs="@firebase/storage-compat",er="@firebase/firestore",tr="@firebase/ai",nr="@firebase/firestore-compat",sr="firebase",rr="12.6.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const je="[DEFAULT]",ir={[Le]:"fire-core",[Ds]:"fire-core-compat",[Os]:"fire-analytics",[Ps]:"fire-analytics-compat",[Bs]:"fire-app-check",[Us]:"fire-app-check-compat",[Ms]:"fire-auth",[Ls]:"fire-auth-compat",[js]:"fire-rtdb",[Fs]:"fire-data-connect",[$s]:"fire-rtdb-compat",[Hs]:"fire-fn",[qs]:"fire-fn-compat",[zs]:"fire-iid",[Vs]:"fire-iid-compat",[Ws]:"fire-fcm",[Gs]:"fire-fcm-compat",[Ks]:"fire-perf",[Xs]:"fire-perf-compat",[Ys]:"fire-rc",[Js]:"fire-rc-compat",[Zs]:"fire-gcs",[Qs]:"fire-gcs-compat",[er]:"fire-fst",[nr]:"fire-fst-compat",[tr]:"fire-vertex","fire-js":"fire-js",[sr]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ge=new Map,ar=new Map,Fe=new Map;function ht(e,t){try{e.container.addComponent(t)}catch(n){M.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`,n)}}function V(e){const t=e.name;if(Fe.has(t))return M.debug(`There were multiple attempts to register component ${t}.`),!1;Fe.set(t,e);for(const n of ge.values())ht(n,e);for(const n of ar.values())ht(n,e);return!0}function Ve(e,t){const n=e.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),e.container.getProvider(t)}function or(e){return e==null?!1:e.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cr={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},z=new ye("app","Firebase",cr);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lr{constructor(t,n,s){this._isDeleted=!1,this._options={...t},this._config={...n},this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new B("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(t){this.checkDestroyed(),this._automaticDataCollectionEnabled=t}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(t){this._isDeleted=t}checkDestroyed(){if(this.isDeleted)throw z.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ur=rr;function $t(e,t={}){let n=e;typeof t!="object"&&(t={name:t});const s={name:je,automaticDataCollectionEnabled:!0,...t},r=s.name;if(typeof r!="string"||!r)throw z.create("bad-app-name",{appName:String(r)});if(n||(n=Ot()),!n)throw z.create("no-options");const i=ge.get(r);if(i){if(Ue(n,i.options)&&Ue(s,i.config))return i;throw z.create("duplicate-app",{appName:r})}const a=new ms(r);for(const o of Fe.values())a.addComponent(o);const c=new lr(n,s,a);return ge.set(r,c),c}function dr(e=je){const t=ge.get(e);if(!t&&e===je&&Ot())return $t();if(!t)throw z.create("no-app",{appName:e});return t}function O(e,t,n){let s=ir[e]??e;n&&(s+=`-${n}`);const r=s.match(/\s|\//),i=t.match(/\s|\//);if(r||i){const a=[`Unable to register library "${s}" with version "${t}":`];r&&a.push(`library name "${s}" contains illegal characters (whitespace or "/")`),r&&i&&a.push("and"),i&&a.push(`version name "${t}" contains illegal characters (whitespace or "/")`),M.warn(a.join(" "));return}V(new B(`${s}-version`,()=>({library:s,version:t}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hr="firebase-heartbeat-database",fr=1,le="firebase-heartbeat-store";let Ae=null;function Ht(){return Ae||(Ae=Ft(hr,fr,{upgrade:(e,t)=>{switch(t){case 0:try{e.createObjectStore(le)}catch(n){console.warn(n)}}}}).catch(e=>{throw z.create("idb-open",{originalErrorMessage:e.message})})),Ae}async function pr(e){try{const n=(await Ht()).transaction(le),s=await n.objectStore(le).get(qt(e));return await n.done,s}catch(t){if(t instanceof W)M.warn(t.message);else{const n=z.create("idb-get",{originalErrorMessage:t==null?void 0:t.message});M.warn(n.message)}}}async function ft(e,t){try{const s=(await Ht()).transaction(le,"readwrite");await s.objectStore(le).put(t,qt(e)),await s.done}catch(n){if(n instanceof W)M.warn(n.message);else{const s=z.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});M.warn(s.message)}}}function qt(e){return`${e.name}!${e.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mr=1024,gr=30;class _r{constructor(t){this.container=t,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new yr(n),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){var t,n;try{const r=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=pt();if(((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)==null?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(a=>a.date===i))return;if(this._heartbeatsCache.heartbeats.push({date:i,agent:r}),this._heartbeatsCache.heartbeats.length>gr){const a=wr(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(a,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(s){M.warn(s)}}async getHeartbeatsHeader(){var t;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=pt(),{heartbeatsToSend:s,unsentEntries:r}=br(this._heartbeatsCache.heartbeats),i=me(JSON.stringify({version:2,heartbeats:s}));return this._heartbeatsCache.lastSentHeartbeatDate=n,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(n){return M.warn(n),""}}}function pt(){return new Date().toISOString().substring(0,10)}function br(e,t=mr){const n=[];let s=e.slice();for(const r of e){const i=n.find(a=>a.agent===r.agent);if(i){if(i.dates.push(r.date),mt(n)>t){i.dates.pop();break}}else if(n.push({agent:r.agent,dates:[r.date]}),mt(n)>t){n.pop();break}s=s.slice(1)}return{heartbeatsToSend:n,unsentEntries:s}}class yr{constructor(t){this.app=t,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Ut()?Bt().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await pr(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(t){if(await this._canUseIndexedDBPromise){const s=await this.read();return ft(this.app,{lastSentHeartbeatDate:t.lastSentHeartbeatDate??s.lastSentHeartbeatDate,heartbeats:t.heartbeats})}else return}async add(t){if(await this._canUseIndexedDBPromise){const s=await this.read();return ft(this.app,{lastSentHeartbeatDate:t.lastSentHeartbeatDate??s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...t.heartbeats]})}else return}}function mt(e){return me(JSON.stringify({version:2,heartbeats:e})).length}function wr(e){if(e.length===0)return-1;let t=0,n=e[0].date;for(let s=1;s<e.length;s++)e[s].date<n&&(n=e[s].date,t=s);return t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ir(e){V(new B("platform-logger",t=>new Ns(t),"PRIVATE")),V(new B("heartbeat",t=>new _r(t),"PRIVATE")),O(Le,dt,e),O(Le,dt,"esm2020"),O("fire-js","")}Ir("");var Er="firebase",Tr="12.7.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */O(Er,Tr,"app");const zt="@firebase/installations",We="0.6.19";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vt=1e4,Wt=`w:${We}`,Gt="FIS_v2",vr="https://firebaseinstallations.googleapis.com/v1",xr=3600*1e3,Cr="installations",Sr="Installations";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ar={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},Y=new ye(Cr,Sr,Ar);function Kt(e){return e instanceof W&&e.code.includes("request-failed")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xt({projectId:e}){return`${vr}/projects/${e}/installations`}function Yt(e){return{token:e.token,requestStatus:2,expiresIn:Nr(e.expiresIn),creationTime:Date.now()}}async function Jt(e,t){const s=(await t.json()).error;return Y.create("request-failed",{requestName:e,serverCode:s.code,serverMessage:s.message,serverStatus:s.status})}function Zt({apiKey:e}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":e})}function Rr(e,{refreshToken:t}){const n=Zt(e);return n.append("Authorization",kr(t)),n}async function Qt(e){const t=await e();return t.status>=500&&t.status<600?e():t}function Nr(e){return Number(e.replace("s","000"))}function kr(e){return`${Gt} ${e}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Dr({appConfig:e,heartbeatServiceProvider:t},{fid:n}){const s=Xt(e),r=Zt(e),i=t.getImmediate({optional:!0});if(i){const u=await i.getHeartbeatsHeader();u&&r.append("x-firebase-client",u)}const a={fid:n,authVersion:Gt,appId:e.appId,sdkVersion:Wt},c={method:"POST",headers:r,body:JSON.stringify(a)},o=await Qt(()=>fetch(s,c));if(o.ok){const u=await o.json();return{fid:u.fid||n,registrationStatus:2,refreshToken:u.refreshToken,authToken:Yt(u.authToken)}}else throw await Jt("Create Installation",o)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function en(e){return new Promise(t=>{setTimeout(t,e)})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pr(e){return btoa(String.fromCharCode(...e)).replace(/\+/g,"-").replace(/\//g,"_")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Or=/^[cdef][\w-]{21}$/,$e="";function Ur(){try{const e=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(e),e[0]=112+e[0]%16;const n=Br(e);return Or.test(n)?n:$e}catch{return $e}}function Br(e){return Pr(e).substr(0,22)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function we(e){return`${e.appName}!${e.appId}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tn=new Map;function nn(e,t){const n=we(e);sn(n,t),Mr(n,t)}function sn(e,t){const n=tn.get(e);if(n)for(const s of n)s(t)}function Mr(e,t){const n=Lr();n&&n.postMessage({key:e,fid:t}),jr()}let K=null;function Lr(){return!K&&"BroadcastChannel"in self&&(K=new BroadcastChannel("[Firebase] FID Change"),K.onmessage=e=>{sn(e.data.key,e.data.fid)}),K}function jr(){tn.size===0&&K&&(K.close(),K=null)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fr="firebase-installations-database",$r=1,J="firebase-installations-store";let Re=null;function Ge(){return Re||(Re=Ft(Fr,$r,{upgrade:(e,t)=>{switch(t){case 0:e.createObjectStore(J)}}})),Re}async function _e(e,t){const n=we(e),r=(await Ge()).transaction(J,"readwrite"),i=r.objectStore(J),a=await i.get(n);return await i.put(t,n),await r.done,(!a||a.fid!==t.fid)&&nn(e,t.fid),t}async function rn(e){const t=we(e),s=(await Ge()).transaction(J,"readwrite");await s.objectStore(J).delete(t),await s.done}async function Ie(e,t){const n=we(e),r=(await Ge()).transaction(J,"readwrite"),i=r.objectStore(J),a=await i.get(n),c=t(a);return c===void 0?await i.delete(n):await i.put(c,n),await r.done,c&&(!a||a.fid!==c.fid)&&nn(e,c.fid),c}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ke(e){let t;const n=await Ie(e.appConfig,s=>{const r=Hr(s),i=qr(e,r);return t=i.registrationPromise,i.installationEntry});return n.fid===$e?{installationEntry:await t}:{installationEntry:n,registrationPromise:t}}function Hr(e){const t=e||{fid:Ur(),registrationStatus:0};return an(t)}function qr(e,t){if(t.registrationStatus===0){if(!navigator.onLine){const r=Promise.reject(Y.create("app-offline"));return{installationEntry:t,registrationPromise:r}}const n={fid:t.fid,registrationStatus:1,registrationTime:Date.now()},s=zr(e,n);return{installationEntry:n,registrationPromise:s}}else return t.registrationStatus===1?{installationEntry:t,registrationPromise:Vr(e)}:{installationEntry:t}}async function zr(e,t){try{const n=await Dr(e,t);return _e(e.appConfig,n)}catch(n){throw Kt(n)&&n.customData.serverCode===409?await rn(e.appConfig):await _e(e.appConfig,{fid:t.fid,registrationStatus:0}),n}}async function Vr(e){let t=await gt(e.appConfig);for(;t.registrationStatus===1;)await en(100),t=await gt(e.appConfig);if(t.registrationStatus===0){const{installationEntry:n,registrationPromise:s}=await Ke(e);return s||n}return t}function gt(e){return Ie(e,t=>{if(!t)throw Y.create("installation-not-found");return an(t)})}function an(e){return Wr(e)?{fid:e.fid,registrationStatus:0}:e}function Wr(e){return e.registrationStatus===1&&e.registrationTime+Vt<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Gr({appConfig:e,heartbeatServiceProvider:t},n){const s=Kr(e,n),r=Rr(e,n),i=t.getImmediate({optional:!0});if(i){const u=await i.getHeartbeatsHeader();u&&r.append("x-firebase-client",u)}const a={installation:{sdkVersion:Wt,appId:e.appId}},c={method:"POST",headers:r,body:JSON.stringify(a)},o=await Qt(()=>fetch(s,c));if(o.ok){const u=await o.json();return Yt(u)}else throw await Jt("Generate Auth Token",o)}function Kr(e,{fid:t}){return`${Xt(e)}/${t}/authTokens:generate`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Xe(e,t=!1){let n;const s=await Ie(e.appConfig,i=>{if(!on(i))throw Y.create("not-registered");const a=i.authToken;if(!t&&Jr(a))return i;if(a.requestStatus===1)return n=Xr(e,t),i;{if(!navigator.onLine)throw Y.create("app-offline");const c=Qr(i);return n=Yr(e,c),c}});return n?await n:s.authToken}async function Xr(e,t){let n=await _t(e.appConfig);for(;n.authToken.requestStatus===1;)await en(100),n=await _t(e.appConfig);const s=n.authToken;return s.requestStatus===0?Xe(e,t):s}function _t(e){return Ie(e,t=>{if(!on(t))throw Y.create("not-registered");const n=t.authToken;return ei(n)?{...t,authToken:{requestStatus:0}}:t})}async function Yr(e,t){try{const n=await Gr(e,t),s={...t,authToken:n};return await _e(e.appConfig,s),n}catch(n){if(Kt(n)&&(n.customData.serverCode===401||n.customData.serverCode===404))await rn(e.appConfig);else{const s={...t,authToken:{requestStatus:0}};await _e(e.appConfig,s)}throw n}}function on(e){return e!==void 0&&e.registrationStatus===2}function Jr(e){return e.requestStatus===2&&!Zr(e)}function Zr(e){const t=Date.now();return t<e.creationTime||e.creationTime+e.expiresIn<t+xr}function Qr(e){const t={requestStatus:1,requestTime:Date.now()};return{...e,authToken:t}}function ei(e){return e.requestStatus===1&&e.requestTime+Vt<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ti(e){const t=e,{installationEntry:n,registrationPromise:s}=await Ke(t);return s?s.catch(console.error):Xe(t).catch(console.error),n.fid}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ni(e,t=!1){const n=e;return await si(n),(await Xe(n,t)).token}async function si(e){const{registrationPromise:t}=await Ke(e);t&&await t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ri(e){if(!e||!e.options)throw Ne("App Configuration");if(!e.name)throw Ne("App Name");const t=["projectId","apiKey","appId"];for(const n of t)if(!e.options[n])throw Ne(n);return{appName:e.name,projectId:e.options.projectId,apiKey:e.options.apiKey,appId:e.options.appId}}function Ne(e){return Y.create("missing-app-config-values",{valueName:e})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cn="installations",ii="installations-internal",ai=e=>{const t=e.getProvider("app").getImmediate(),n=ri(t),s=Ve(t,"heartbeat");return{app:t,appConfig:n,heartbeatServiceProvider:s,_delete:()=>Promise.resolve()}},oi=e=>{const t=e.getProvider("app").getImmediate(),n=Ve(t,cn).getImmediate();return{getId:()=>ti(n),getToken:r=>ni(n,r)}};function ci(){V(new B(cn,ai,"PUBLIC")),V(new B(ii,oi,"PRIVATE"))}ci();O(zt,We);O(zt,We,"esm2020");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bt="analytics",li="firebase_id",ui="origin",di=60*1e3,hi="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig",Ye="https://www.googletagmanager.com/gtag/js";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const S=new Mt("@firebase/analytics");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fi={"already-exists":"A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.","already-initialized":"initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-initialized instance.","already-initialized-settings":"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.","interop-component-reg-failed":"Firebase Analytics Interop Component failed to instantiate: {$reason}","invalid-analytics-context":"Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","indexeddb-unavailable":"IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","fetch-throttle":"The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.","config-fetch-failed":"Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}","no-api-key":'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',"no-app-id":'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',"no-client-id":'The "client_id" field is empty.',"invalid-gtag-resource":"Trusted Types detected an invalid gtag resource: {$gtagURL}."},D=new ye("analytics","Analytics",fi);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pi(e){if(!e.startsWith(Ye)){const t=D.create("invalid-gtag-resource",{gtagURL:e});return S.warn(t.message),""}return e}function ln(e){return Promise.all(e.map(t=>t.catch(n=>n)))}function mi(e,t){let n;return window.trustedTypes&&(n=window.trustedTypes.createPolicy(e,t)),n}function gi(e,t){const n=mi("firebase-js-sdk-policy",{createScriptURL:pi}),s=document.createElement("script"),r=`${Ye}?l=${e}&id=${t}`;s.src=n?n==null?void 0:n.createScriptURL(r):r,s.async=!0,document.head.appendChild(s)}function _i(e){let t=[];return Array.isArray(window[e])?t=window[e]:window[e]=t,t}async function bi(e,t,n,s,r,i){const a=s[r];try{if(a)await t[a];else{const o=(await ln(n)).find(u=>u.measurementId===r);o&&await t[o.appId]}}catch(c){S.error(c)}e("config",r,i)}async function yi(e,t,n,s,r){try{let i=[];if(r&&r.send_to){let a=r.send_to;Array.isArray(a)||(a=[a]);const c=await ln(n);for(const o of a){const u=c.find(f=>f.measurementId===o),h=u&&t[u.appId];if(h)i.push(h);else{i=[];break}}}i.length===0&&(i=Object.values(t)),await Promise.all(i),e("event",s,r||{})}catch(i){S.error(i)}}function wi(e,t,n,s){async function r(i,...a){try{if(i==="event"){const[c,o]=a;await yi(e,t,n,c,o)}else if(i==="config"){const[c,o]=a;await bi(e,t,n,s,c,o)}else if(i==="consent"){const[c,o]=a;e("consent",c,o)}else if(i==="get"){const[c,o,u]=a;e("get",c,o,u)}else if(i==="set"){const[c]=a;e("set",c)}else e(i,...a)}catch(c){S.error(c)}}return r}function Ii(e,t,n,s,r){let i=function(...a){window[s].push(arguments)};return window[r]&&typeof window[r]=="function"&&(i=window[r]),window[r]=wi(i,e,t,n),{gtagCore:i,wrappedGtag:window[r]}}function Ei(e){const t=window.document.getElementsByTagName("script");for(const n of Object.values(t))if(n.src&&n.src.includes(Ye)&&n.src.includes(e))return n;return null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ti=30,vi=1e3;class xi{constructor(t={},n=vi){this.throttleMetadata=t,this.intervalMillis=n}getThrottleMetadata(t){return this.throttleMetadata[t]}setThrottleMetadata(t,n){this.throttleMetadata[t]=n}deleteThrottleMetadata(t){delete this.throttleMetadata[t]}}const un=new xi;function Ci(e){return new Headers({Accept:"application/json","x-goog-api-key":e})}async function Si(e){var a;const{appId:t,apiKey:n}=e,s={method:"GET",headers:Ci(n)},r=hi.replace("{app-id}",t),i=await fetch(r,s);if(i.status!==200&&i.status!==304){let c="";try{const o=await i.json();(a=o.error)!=null&&a.message&&(c=o.error.message)}catch{}throw D.create("config-fetch-failed",{httpStatus:i.status,responseMessage:c})}return i.json()}async function Ai(e,t=un,n){const{appId:s,apiKey:r,measurementId:i}=e.options;if(!s)throw D.create("no-app-id");if(!r){if(i)return{measurementId:i,appId:s};throw D.create("no-api-key")}const a=t.getThrottleMetadata(s)||{backoffCount:0,throttleEndTimeMillis:Date.now()},c=new ki;return setTimeout(async()=>{c.abort()},di),dn({appId:s,apiKey:r,measurementId:i},a,c,t)}async function dn(e,{throttleEndTimeMillis:t,backoffCount:n},s,r=un){var c;const{appId:i,measurementId:a}=e;try{await Ri(s,t)}catch(o){if(a)return S.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${a} provided in the "measurementId" field in the local Firebase config. [${o==null?void 0:o.message}]`),{appId:i,measurementId:a};throw o}try{const o=await Si(e);return r.deleteThrottleMetadata(i),o}catch(o){const u=o;if(!Ni(u)){if(r.deleteThrottleMetadata(i),a)return S.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${a} provided in the "measurementId" field in the local Firebase config. [${u==null?void 0:u.message}]`),{appId:i,measurementId:a};throw o}const h=Number((c=u==null?void 0:u.customData)==null?void 0:c.httpStatus)===503?ot(n,r.intervalMillis,Ti):ot(n,r.intervalMillis),f={throttleEndTimeMillis:Date.now()+h,backoffCount:n+1};return r.setThrottleMetadata(i,f),S.debug(`Calling attemptFetch again in ${h} millis`),dn(e,f,s,r)}}function Ri(e,t){return new Promise((n,s)=>{const r=Math.max(t-Date.now(),0),i=setTimeout(n,r);e.addEventListener(()=>{clearTimeout(i),s(D.create("fetch-throttle",{throttleEndTimeMillis:t}))})})}function Ni(e){if(!(e instanceof W)||!e.customData)return!1;const t=Number(e.customData.httpStatus);return t===429||t===500||t===503||t===504}class ki{constructor(){this.listeners=[]}addEventListener(t){this.listeners.push(t)}abort(){this.listeners.forEach(t=>t())}}async function Di(e,t,n,s,r){if(r&&r.global){e("event",n,s);return}else{const i=await t,a={...s,send_to:i};e("event",n,a)}}async function Pi(e,t,n,s){if(s&&s.global){const r={};for(const i of Object.keys(n))r[`user_properties.${i}`]=n[i];return e("set",r),Promise.resolve()}else{const r=await t;e("config",r,{update:!0,user_properties:n})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Oi(){if(Ut())try{await Bt()}catch(e){return S.warn(D.create("indexeddb-unavailable",{errorInfo:e==null?void 0:e.toString()}).message),!1}else return S.warn(D.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;return!0}async function Ui(e,t,n,s,r,i,a){const c=Ai(e);c.then(d=>{n[d.measurementId]=d.appId,e.options.measurementId&&d.measurementId!==e.options.measurementId&&S.warn(`The measurement ID in the local Firebase config (${e.options.measurementId}) does not match the measurement ID fetched from the server (${d.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)}).catch(d=>S.error(d)),t.push(c);const o=Oi().then(d=>{if(d)return s.getId()}),[u,h]=await Promise.all([c,o]);Ei(i)||gi(i,u.measurementId),r("js",new Date);const f=(a==null?void 0:a.config)??{};return f[ui]="firebase",f.update=!0,h!=null&&(f[li]=h),r("config",u.measurementId,f),u.measurementId}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bi{constructor(t){this.app=t}_delete(){return delete te[this.app.options.appId],Promise.resolve()}}let te={},yt=[];const wt={};let ke="dataLayer",Mi="gtag",It,Je,Et=!1;function Li(){const e=[];if(ss()&&e.push("This is a browser extension environment."),rs()||e.push("Cookies are not available."),e.length>0){const t=e.map((s,r)=>`(${r+1}) ${s}`).join(" "),n=D.create("invalid-analytics-context",{errorInfo:t});S.warn(n.message)}}function ji(e,t,n){Li();const s=e.options.appId;if(!s)throw D.create("no-app-id");if(!e.options.apiKey)if(e.options.measurementId)S.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${e.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);else throw D.create("no-api-key");if(te[s]!=null)throw D.create("already-exists",{id:s});if(!Et){_i(ke);const{wrappedGtag:i,gtagCore:a}=Ii(te,yt,wt,ke,Mi);Je=i,It=a,Et=!0}return te[s]=Ui(e,yt,wt,t,It,ke,n),new Bi(e)}function Fi(e,t,n){e=ne(e),Pi(Je,te[e.app.options.appId],t,n).catch(s=>S.error(s))}function $i(e,t,n,s){e=ne(e),Di(Je,te[e.app.options.appId],t,n,s).catch(r=>S.error(r))}const Tt="@firebase/analytics",vt="0.10.19";function Hi(){V(new B(bt,(t,{options:n})=>{const s=t.getProvider("app").getImmediate(),r=t.getProvider("installations-internal").getImmediate();return ji(s,r,n)},"PUBLIC")),V(new B("analytics-internal",e,"PRIVATE")),O(Tt,vt),O(Tt,vt,"esm2020");function e(t){try{const n=t.getProvider(bt).getImmediate();return{logEvent:(s,r,i)=>$i(n,s,r,i),setUserProperties:(s,r)=>Fi(n,s,r)}}catch(n){throw D.create("interop-component-reg-failed",{reason:n})}}}Hi();/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hn="firebasestorage.googleapis.com",fn="storageBucket",qi=120*1e3,zi=600*1e3,Vi=1e3;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class E extends W{constructor(t,n,s=0){super(De(t),`Firebase Storage: ${n} (${De(t)})`),this.status_=s,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,E.prototype)}get status(){return this.status_}set status(t){this.status_=t}_codeEquals(t){return De(t)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(t){this.customData.serverResponse=t,this.customData.serverResponse?this.message=`${this._baseMessage}
${this.customData.serverResponse}`:this.message=this._baseMessage}}var y;(function(e){e.UNKNOWN="unknown",e.OBJECT_NOT_FOUND="object-not-found",e.BUCKET_NOT_FOUND="bucket-not-found",e.PROJECT_NOT_FOUND="project-not-found",e.QUOTA_EXCEEDED="quota-exceeded",e.UNAUTHENTICATED="unauthenticated",e.UNAUTHORIZED="unauthorized",e.UNAUTHORIZED_APP="unauthorized-app",e.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",e.INVALID_CHECKSUM="invalid-checksum",e.CANCELED="canceled",e.INVALID_EVENT_NAME="invalid-event-name",e.INVALID_URL="invalid-url",e.INVALID_DEFAULT_BUCKET="invalid-default-bucket",e.NO_DEFAULT_BUCKET="no-default-bucket",e.CANNOT_SLICE_BLOB="cannot-slice-blob",e.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",e.NO_DOWNLOAD_URL="no-download-url",e.INVALID_ARGUMENT="invalid-argument",e.INVALID_ARGUMENT_COUNT="invalid-argument-count",e.APP_DELETED="app-deleted",e.INVALID_ROOT_OPERATION="invalid-root-operation",e.INVALID_FORMAT="invalid-format",e.INTERNAL_ERROR="internal-error",e.UNSUPPORTED_ENVIRONMENT="unsupported-environment"})(y||(y={}));function De(e){return"storage/"+e}function Ze(){const e="An unknown error occurred, please check the error payload for server response.";return new E(y.UNKNOWN,e)}function Wi(e){return new E(y.OBJECT_NOT_FOUND,"Object '"+e+"' does not exist.")}function Gi(e){return new E(y.QUOTA_EXCEEDED,"Quota for bucket '"+e+"' exceeded, please view quota on https://firebase.google.com/pricing/.")}function Ki(){const e="User is not authenticated, please authenticate using Firebase Authentication and try again.";return new E(y.UNAUTHENTICATED,e)}function Xi(){return new E(y.UNAUTHORIZED_APP,"This app does not have permission to access Firebase Storage on this project.")}function Yi(e){return new E(y.UNAUTHORIZED,"User does not have permission to access '"+e+"'.")}function pn(){return new E(y.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function mn(){return new E(y.CANCELED,"User canceled the upload/download.")}function Ji(e){return new E(y.INVALID_URL,"Invalid URL '"+e+"'.")}function Zi(e){return new E(y.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+e+"'.")}function Qi(){return new E(y.NO_DEFAULT_BUCKET,"No default bucket found. Did you set the '"+fn+"' property when initializing the app?")}function gn(){return new E(y.CANNOT_SLICE_BLOB,"Cannot slice blob for upload. Please retry the upload.")}function ea(){return new E(y.SERVER_FILE_WRONG_SIZE,"Server recorded incorrect upload file size, please retry the upload.")}function ta(){return new E(y.NO_DOWNLOAD_URL,"The given file does not have any download URLs.")}function na(e){return new E(y.UNSUPPORTED_ENVIRONMENT,`${e} is missing. Make sure to install the required polyfills. See https://firebase.google.com/docs/web/environments-js-sdk#polyfills for more information.`)}function He(e){return new E(y.INVALID_ARGUMENT,e)}function _n(){return new E(y.APP_DELETED,"The Firebase app was deleted.")}function sa(e){return new E(y.INVALID_ROOT_OPERATION,"The operation '"+e+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}function ce(e,t){return new E(y.INVALID_FORMAT,"String does not match format '"+e+"': "+t)}function ae(e){throw new E(y.INTERNAL_ERROR,"Internal error: "+e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class k{constructor(t,n){this.bucket=t,this.path_=n}get path(){return this.path_}get isRoot(){return this.path.length===0}fullServerUrl(){const t=encodeURIComponent;return"/b/"+t(this.bucket)+"/o/"+t(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(t,n){let s;try{s=k.makeFromUrl(t,n)}catch{return new k(t,"")}if(s.path==="")return s;throw Zi(t)}static makeFromUrl(t,n){let s=null;const r="([A-Za-z0-9.\\-_]+)";function i(I){I.path.charAt(I.path.length-1)==="/"&&(I.path_=I.path_.slice(0,-1))}const a="(/(.*))?$",c=new RegExp("^gs://"+r+a,"i"),o={bucket:1,path:3};function u(I){I.path_=decodeURIComponent(I.path)}const h="v[A-Za-z0-9_]+",f=n.replace(/[.]/g,"\\."),d="(/([^?#]*).*)?$",m=new RegExp(`^https?://${f}/${h}/b/${r}/o${d}`,"i"),p={bucket:1,path:3},T=n===hn?"(?:storage.googleapis.com|storage.cloud.google.com)":n,_="([^?#]*)",A=new RegExp(`^https?://${T}/${r}/${_}`,"i"),g=[{regex:c,indices:o,postModify:i},{regex:m,indices:p,postModify:u},{regex:A,indices:{bucket:1,path:2},postModify:u}];for(let I=0;I<g.length;I++){const L=g[I],j=L.regex.exec(t);if(j){const w=j[L.indices.bucket];let v=j[L.indices.path];v||(v=""),s=new k(w,v),L.postModify(s);break}}if(s==null)throw Ji(t);return s}}class ra{constructor(t){this.promise_=Promise.reject(t)}getPromise(){return this.promise_}cancel(t=!1){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ia(e,t,n){let s=1,r=null,i=null,a=!1,c=0;function o(){return c===2}let u=!1;function h(..._){u||(u=!0,t.apply(null,_))}function f(_){r=setTimeout(()=>{r=null,e(m,o())},_)}function d(){i&&clearTimeout(i)}function m(_,...A){if(u){d();return}if(_){d(),h.call(null,_,...A);return}if(o()||a){d(),h.call(null,_,...A);return}s<64&&(s*=2);let g;c===1?(c=2,g=0):g=(s+Math.random())*1e3,f(g)}let p=!1;function T(_){p||(p=!0,d(),!u&&(r!==null?(_||(c=2),clearTimeout(r),f(0)):_||(c=1)))}return f(0),i=setTimeout(()=>{a=!0,T(!0)},n),T}function aa(e){e(!1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function oa(e){return e!==void 0}function ca(e){return typeof e=="function"}function la(e){return typeof e=="object"&&!Array.isArray(e)}function Ee(e){return typeof e=="string"||e instanceof String}function xt(e){return Qe()&&e instanceof Blob}function Qe(){return typeof Blob<"u"}function Ct(e,t,n,s){if(s<t)throw He(`Invalid value for '${e}'. Expected ${t} or greater.`);if(s>n)throw He(`Invalid value for '${e}'. Expected ${n} or less.`)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ue(e,t,n){let s=t;return n==null&&(s=`https://${t}`),`${n}://${s}/v0${e}`}function bn(e){const t=encodeURIComponent;let n="?";for(const s in e)if(e.hasOwnProperty(s)){const r=t(s)+"="+t(e[s]);n=n+r+"&"}return n=n.slice(0,-1),n}var X;(function(e){e[e.NO_ERROR=0]="NO_ERROR",e[e.NETWORK_ERROR=1]="NETWORK_ERROR",e[e.ABORT=2]="ABORT"})(X||(X={}));/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yn(e,t){const n=e>=500&&e<600,r=[408,429].indexOf(e)!==-1,i=t.indexOf(e)!==-1;return n||r||i}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ua{constructor(t,n,s,r,i,a,c,o,u,h,f,d=!0,m=!1){this.url_=t,this.method_=n,this.headers_=s,this.body_=r,this.successCodes_=i,this.additionalRetryCodes_=a,this.callback_=c,this.errorCallback_=o,this.timeout_=u,this.progressCallback_=h,this.connectionFactory_=f,this.retry=d,this.isUsingEmulator=m,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((p,T)=>{this.resolve_=p,this.reject_=T,this.start_()})}start_(){const t=(s,r)=>{if(r){s(!1,new fe(!1,null,!0));return}const i=this.connectionFactory_();this.pendingConnection_=i;const a=c=>{const o=c.loaded,u=c.lengthComputable?c.total:-1;this.progressCallback_!==null&&this.progressCallback_(o,u)};this.progressCallback_!==null&&i.addUploadProgressListener(a),i.send(this.url_,this.method_,this.isUsingEmulator,this.body_,this.headers_).then(()=>{this.progressCallback_!==null&&i.removeUploadProgressListener(a),this.pendingConnection_=null;const c=i.getErrorCode()===X.NO_ERROR,o=i.getStatus();if(!c||yn(o,this.additionalRetryCodes_)&&this.retry){const h=i.getErrorCode()===X.ABORT;s(!1,new fe(!1,null,h));return}const u=this.successCodes_.indexOf(o)!==-1;s(!0,new fe(u,i))})},n=(s,r)=>{const i=this.resolve_,a=this.reject_,c=r.connection;if(r.wasSuccessCode)try{const o=this.callback_(c,c.getResponse());oa(o)?i(o):i()}catch(o){a(o)}else if(c!==null){const o=Ze();o.serverResponse=c.getErrorText(),this.errorCallback_?a(this.errorCallback_(c,o)):a(o)}else if(r.canceled){const o=this.appDelete_?_n():mn();a(o)}else{const o=pn();a(o)}};this.canceled_?n(!1,new fe(!1,null,!0)):this.backoffId_=ia(t,n,this.timeout_)}getPromise(){return this.promise_}cancel(t){this.canceled_=!0,this.appDelete_=t||!1,this.backoffId_!==null&&aa(this.backoffId_),this.pendingConnection_!==null&&this.pendingConnection_.abort()}}class fe{constructor(t,n,s){this.wasSuccessCode=t,this.connection=n,this.canceled=!!s}}function da(e,t){t!==null&&t.length>0&&(e.Authorization="Firebase "+t)}function ha(e,t){e["X-Firebase-Storage-Version"]="webjs/"+(t??"AppManager")}function fa(e,t){t&&(e["X-Firebase-GMPID"]=t)}function pa(e,t){t!==null&&(e["X-Firebase-AppCheck"]=t)}function ma(e,t,n,s,r,i,a=!0,c=!1){const o=bn(e.urlParams),u=e.url+o,h=Object.assign({},e.headers);return fa(h,t),da(h,n),ha(h,i),pa(h,s),new ua(u,e.method,h,e.body,e.successCodes,e.additionalRetryCodes,e.handler,e.errorHandler,e.timeout,e.progressCallback,r,a,c)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ga(){return typeof BlobBuilder<"u"?BlobBuilder:typeof WebKitBlobBuilder<"u"?WebKitBlobBuilder:void 0}function _a(...e){const t=ga();if(t!==void 0){const n=new t;for(let s=0;s<e.length;s++)n.append(e[s]);return n.getBlob()}else{if(Qe())return new Blob(e);throw new E(y.UNSUPPORTED_ENVIRONMENT,"This browser doesn't seem to support creating Blobs")}}function ba(e,t,n){return e.webkitSlice?e.webkitSlice(t,n):e.mozSlice?e.mozSlice(t,n):e.slice?e.slice(t,n):null}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ya(e){if(typeof atob>"u")throw na("base-64");return atob(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const P={RAW:"raw",BASE64:"base64",BASE64URL:"base64url",DATA_URL:"data_url"};class Pe{constructor(t,n){this.data=t,this.contentType=n||null}}function wa(e,t){switch(e){case P.RAW:return new Pe(wn(t));case P.BASE64:case P.BASE64URL:return new Pe(In(e,t));case P.DATA_URL:return new Pe(Ea(t),Ta(t))}throw Ze()}function wn(e){const t=[];for(let n=0;n<e.length;n++){let s=e.charCodeAt(n);if(s<=127)t.push(s);else if(s<=2047)t.push(192|s>>6,128|s&63);else if((s&64512)===55296)if(!(n<e.length-1&&(e.charCodeAt(n+1)&64512)===56320))t.push(239,191,189);else{const i=s,a=e.charCodeAt(++n);s=65536|(i&1023)<<10|a&1023,t.push(240|s>>18,128|s>>12&63,128|s>>6&63,128|s&63)}else(s&64512)===56320?t.push(239,191,189):t.push(224|s>>12,128|s>>6&63,128|s&63)}return new Uint8Array(t)}function Ia(e){let t;try{t=decodeURIComponent(e)}catch{throw ce(P.DATA_URL,"Malformed data URL.")}return wn(t)}function In(e,t){switch(e){case P.BASE64:{const r=t.indexOf("-")!==-1,i=t.indexOf("_")!==-1;if(r||i)throw ce(e,"Invalid character '"+(r?"-":"_")+"' found: is it base64url encoded?");break}case P.BASE64URL:{const r=t.indexOf("+")!==-1,i=t.indexOf("/")!==-1;if(r||i)throw ce(e,"Invalid character '"+(r?"+":"/")+"' found: is it base64 encoded?");t=t.replace(/-/g,"+").replace(/_/g,"/");break}}let n;try{n=ya(t)}catch(r){throw r.message.includes("polyfill")?r:ce(e,"Invalid character found")}const s=new Uint8Array(n.length);for(let r=0;r<n.length;r++)s[r]=n.charCodeAt(r);return s}class En{constructor(t){this.base64=!1,this.contentType=null;const n=t.match(/^data:([^,]+)?,/);if(n===null)throw ce(P.DATA_URL,"Must be formatted 'data:[<mediatype>][;base64],<data>");const s=n[1]||null;s!=null&&(this.base64=va(s,";base64"),this.contentType=this.base64?s.substring(0,s.length-7):s),this.rest=t.substring(t.indexOf(",")+1)}}function Ea(e){const t=new En(e);return t.base64?In(P.BASE64,t.rest):Ia(t.rest)}function Ta(e){return new En(e).contentType}function va(e,t){return e.length>=t.length?e.substring(e.length-t.length)===t:!1}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class H{constructor(t,n){let s=0,r="";xt(t)?(this.data_=t,s=t.size,r=t.type):t instanceof ArrayBuffer?(n?this.data_=new Uint8Array(t):(this.data_=new Uint8Array(t.byteLength),this.data_.set(new Uint8Array(t))),s=this.data_.length):t instanceof Uint8Array&&(n?this.data_=t:(this.data_=new Uint8Array(t.length),this.data_.set(t)),s=t.length),this.size_=s,this.type_=r}size(){return this.size_}type(){return this.type_}slice(t,n){if(xt(this.data_)){const s=this.data_,r=ba(s,t,n);return r===null?null:new H(r)}else{const s=new Uint8Array(this.data_.buffer,t,n-t);return new H(s,!0)}}static getBlob(...t){if(Qe()){const n=t.map(s=>s instanceof H?s.data_:s);return new H(_a.apply(null,n))}else{const n=t.map(a=>Ee(a)?wa(P.RAW,a).data:a.data_);let s=0;n.forEach(a=>{s+=a.byteLength});const r=new Uint8Array(s);let i=0;return n.forEach(a=>{for(let c=0;c<a.length;c++)r[i++]=a[c]}),new H(r,!0)}}uploadData(){return this.data_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Tn(e){let t;try{t=JSON.parse(e)}catch{return null}return la(t)?t:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xa(e){if(e.length===0)return null;const t=e.lastIndexOf("/");return t===-1?"":e.slice(0,t)}function Ca(e,t){const n=t.split("/").filter(s=>s.length>0).join("/");return e.length===0?n:e+"/"+n}function vn(e){const t=e.lastIndexOf("/",e.length-2);return t===-1?e:e.slice(t+1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sa(e,t){return t}class C{constructor(t,n,s,r){this.server=t,this.local=n||t,this.writable=!!s,this.xform=r||Sa}}let pe=null;function Aa(e){return!Ee(e)||e.length<2?e:vn(e)}function xn(){if(pe)return pe;const e=[];e.push(new C("bucket")),e.push(new C("generation")),e.push(new C("metageneration")),e.push(new C("name","fullPath",!0));function t(i,a){return Aa(a)}const n=new C("name");n.xform=t,e.push(n);function s(i,a){return a!==void 0?Number(a):a}const r=new C("size");return r.xform=s,e.push(r),e.push(new C("timeCreated")),e.push(new C("updated")),e.push(new C("md5Hash",null,!0)),e.push(new C("cacheControl",null,!0)),e.push(new C("contentDisposition",null,!0)),e.push(new C("contentEncoding",null,!0)),e.push(new C("contentLanguage",null,!0)),e.push(new C("contentType",null,!0)),e.push(new C("metadata","customMetadata",!0)),pe=e,pe}function Ra(e,t){function n(){const s=e.bucket,r=e.fullPath,i=new k(s,r);return t._makeStorageReference(i)}Object.defineProperty(e,"ref",{get:n})}function Na(e,t,n){const s={};s.type="file";const r=n.length;for(let i=0;i<r;i++){const a=n[i];s[a.local]=a.xform(s,t[a.server])}return Ra(s,e),s}function Cn(e,t,n){const s=Tn(t);return s===null?null:Na(e,s,n)}function ka(e,t,n,s){const r=Tn(t);if(r===null||!Ee(r.downloadTokens))return null;const i=r.downloadTokens;if(i.length===0)return null;const a=encodeURIComponent;return i.split(",").map(u=>{const h=e.bucket,f=e.fullPath,d="/b/"+a(h)+"/o/"+a(f),m=ue(d,n,s),p=bn({alt:"media",token:u});return m+p})[0]}function Sn(e,t){const n={},s=t.length;for(let r=0;r<s;r++){const i=t[r];i.writable&&(n[i.server]=e[i.local])}return JSON.stringify(n)}class se{constructor(t,n,s,r){this.url=t,this.method=n,this.handler=s,this.timeout=r,this.urlParams={},this.headers={},this.body=null,this.errorHandler=null,this.progressCallback=null,this.successCodes=[200],this.additionalRetryCodes=[]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function U(e){if(!e)throw Ze()}function et(e,t){function n(s,r){const i=Cn(e,r,t);return U(i!==null),i}return n}function Da(e,t){function n(s,r){const i=Cn(e,r,t);return U(i!==null),ka(i,r,e.host,e._protocol)}return n}function de(e){function t(n,s){let r;return n.getStatus()===401?n.getErrorText().includes("Firebase App Check token is invalid")?r=Xi():r=Ki():n.getStatus()===402?r=Gi(e.bucket):n.getStatus()===403?r=Yi(e.path):r=s,r.status=n.getStatus(),r.serverResponse=s.serverResponse,r}return t}function An(e){const t=de(e);function n(s,r){let i=t(s,r);return s.getStatus()===404&&(i=Wi(e.path)),i.serverResponse=r.serverResponse,i}return n}function Pa(e,t,n){const s=t.fullServerUrl(),r=ue(s,e.host,e._protocol),i="GET",a=e.maxOperationRetryTime,c=new se(r,i,et(e,n),a);return c.errorHandler=An(t),c}function Oa(e,t,n){const s=t.fullServerUrl(),r=ue(s,e.host,e._protocol),i="GET",a=e.maxOperationRetryTime,c=new se(r,i,Da(e,n),a);return c.errorHandler=An(t),c}function Ua(e,t){return e&&e.contentType||t&&t.type()||"application/octet-stream"}function Rn(e,t,n){const s=Object.assign({},n);return s.fullPath=e.path,s.size=t.size(),s.contentType||(s.contentType=Ua(null,t)),s}function Ba(e,t,n,s,r){const i=t.bucketOnlyServerUrl(),a={"X-Goog-Upload-Protocol":"multipart"};function c(){let g="";for(let I=0;I<2;I++)g=g+Math.random().toString().slice(2);return g}const o=c();a["Content-Type"]="multipart/related; boundary="+o;const u=Rn(t,s,r),h=Sn(u,n),f="--"+o+`\r
Content-Type: application/json; charset=utf-8\r
\r
`+h+`\r
--`+o+`\r
Content-Type: `+u.contentType+`\r
\r
`,d=`\r
--`+o+"--",m=H.getBlob(f,s,d);if(m===null)throw gn();const p={name:u.fullPath},T=ue(i,e.host,e._protocol),_="POST",A=e.maxUploadRetryTime,x=new se(T,_,et(e,n),A);return x.urlParams=p,x.headers=a,x.body=m.uploadData(),x.errorHandler=de(t),x}class be{constructor(t,n,s,r){this.current=t,this.total=n,this.finalized=!!s,this.metadata=r||null}}function tt(e,t){let n=null;try{n=e.getResponseHeader("X-Goog-Upload-Status")}catch{U(!1)}return U(!!n&&(t||["active"]).indexOf(n)!==-1),n}function Ma(e,t,n,s,r){const i=t.bucketOnlyServerUrl(),a=Rn(t,s,r),c={name:a.fullPath},o=ue(i,e.host,e._protocol),u="POST",h={"X-Goog-Upload-Protocol":"resumable","X-Goog-Upload-Command":"start","X-Goog-Upload-Header-Content-Length":`${s.size()}`,"X-Goog-Upload-Header-Content-Type":a.contentType,"Content-Type":"application/json; charset=utf-8"},f=Sn(a,n),d=e.maxUploadRetryTime;function m(T){tt(T);let _;try{_=T.getResponseHeader("X-Goog-Upload-URL")}catch{U(!1)}return U(Ee(_)),_}const p=new se(o,u,m,d);return p.urlParams=c,p.headers=h,p.body=f,p.errorHandler=de(t),p}function La(e,t,n,s){const r={"X-Goog-Upload-Command":"query"};function i(u){const h=tt(u,["active","final"]);let f=null;try{f=u.getResponseHeader("X-Goog-Upload-Size-Received")}catch{U(!1)}f||U(!1);const d=Number(f);return U(!isNaN(d)),new be(d,s.size(),h==="final")}const a="POST",c=e.maxUploadRetryTime,o=new se(n,a,i,c);return o.headers=r,o.errorHandler=de(t),o}const St=256*1024;function ja(e,t,n,s,r,i,a,c){const o=new be(0,0);if(a?(o.current=a.current,o.total=a.total):(o.current=0,o.total=s.size()),s.size()!==o.total)throw ea();const u=o.total-o.current;let h=u;r>0&&(h=Math.min(h,r));const f=o.current,d=f+h;let m="";h===0?m="finalize":u===h?m="upload, finalize":m="upload";const p={"X-Goog-Upload-Command":m,"X-Goog-Upload-Offset":`${o.current}`},T=s.slice(f,d);if(T===null)throw gn();function _(I,L){const j=tt(I,["active","final"]),w=o.current+h,v=s.size();let F;return j==="final"?F=et(t,i)(I,L):F=null,new be(w,v,j==="final",F)}const A="POST",x=t.maxUploadRetryTime,g=new se(n,A,_,x);return g.headers=p,g.body=T.uploadData(),g.progressCallback=c||null,g.errorHandler=de(e),g}const R={RUNNING:"running",PAUSED:"paused",SUCCESS:"success",CANCELED:"canceled",ERROR:"error"};function Oe(e){switch(e){case"running":case"pausing":case"canceling":return R.RUNNING;case"paused":return R.PAUSED;case"success":return R.SUCCESS;case"canceled":return R.CANCELED;case"error":return R.ERROR;default:return R.ERROR}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fa{constructor(t,n,s){if(ca(t)||n!=null||s!=null)this.next=t,this.error=n??void 0,this.complete=s??void 0;else{const i=t;this.next=i.next,this.error=i.error,this.complete=i.complete}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Q(e){return(...t)=>{Promise.resolve().then(()=>e(...t))}}class $a{constructor(){this.sent_=!1,this.xhr_=new XMLHttpRequest,this.initXhr(),this.errorCode_=X.NO_ERROR,this.sendPromise_=new Promise(t=>{this.xhr_.addEventListener("abort",()=>{this.errorCode_=X.ABORT,t()}),this.xhr_.addEventListener("error",()=>{this.errorCode_=X.NETWORK_ERROR,t()}),this.xhr_.addEventListener("load",()=>{t()})})}send(t,n,s,r,i){if(this.sent_)throw ae("cannot .send() more than once");if(qe(t)&&s&&(this.xhr_.withCredentials=!0),this.sent_=!0,this.xhr_.open(n,t,!0),i!==void 0)for(const a in i)i.hasOwnProperty(a)&&this.xhr_.setRequestHeader(a,i[a].toString());return r!==void 0?this.xhr_.send(r):this.xhr_.send(),this.sendPromise_}getErrorCode(){if(!this.sent_)throw ae("cannot .getErrorCode() before sending");return this.errorCode_}getStatus(){if(!this.sent_)throw ae("cannot .getStatus() before sending");try{return this.xhr_.status}catch{return-1}}getResponse(){if(!this.sent_)throw ae("cannot .getResponse() before sending");return this.xhr_.response}getErrorText(){if(!this.sent_)throw ae("cannot .getErrorText() before sending");return this.xhr_.statusText}abort(){this.xhr_.abort()}getResponseHeader(t){return this.xhr_.getResponseHeader(t)}addUploadProgressListener(t){this.xhr_.upload!=null&&this.xhr_.upload.addEventListener("progress",t)}removeUploadProgressListener(t){this.xhr_.upload!=null&&this.xhr_.upload.removeEventListener("progress",t)}}class Ha extends $a{initXhr(){this.xhr_.responseType="text"}}function ee(){return new Ha}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qa{isExponentialBackoffExpired(){return this.sleepTime>this.maxSleepTime}constructor(t,n,s=null){this._transferred=0,this._needToFetchStatus=!1,this._needToFetchMetadata=!1,this._observers=[],this._error=void 0,this._uploadUrl=void 0,this._request=void 0,this._chunkMultiplier=1,this._resolve=void 0,this._reject=void 0,this._ref=t,this._blob=n,this._metadata=s,this._mappings=xn(),this._resumable=this._shouldDoResumable(this._blob),this._state="running",this._errorHandler=r=>{if(this._request=void 0,this._chunkMultiplier=1,r._codeEquals(y.CANCELED))this._needToFetchStatus=!0,this.completeTransitions_();else{const i=this.isExponentialBackoffExpired();if(yn(r.status,[]))if(i)r=pn();else{this.sleepTime=Math.max(this.sleepTime*2,Vi),this._needToFetchStatus=!0,this.completeTransitions_();return}this._error=r,this._transition("error")}},this._metadataErrorHandler=r=>{this._request=void 0,r._codeEquals(y.CANCELED)?this.completeTransitions_():(this._error=r,this._transition("error"))},this.sleepTime=0,this.maxSleepTime=this._ref.storage.maxUploadRetryTime,this._promise=new Promise((r,i)=>{this._resolve=r,this._reject=i,this._start()}),this._promise.then(null,()=>{})}_makeProgressCallback(){const t=this._transferred;return n=>this._updateProgress(t+n)}_shouldDoResumable(t){return t.size()>256*1024}_start(){this._state==="running"&&this._request===void 0&&(this._resumable?this._uploadUrl===void 0?this._createResumable():this._needToFetchStatus?this._fetchStatus():this._needToFetchMetadata?this._fetchMetadata():this.pendingTimeout=setTimeout(()=>{this.pendingTimeout=void 0,this._continueUpload()},this.sleepTime):this._oneShotUpload())}_resolveToken(t){Promise.all([this._ref.storage._getAuthToken(),this._ref.storage._getAppCheckToken()]).then(([n,s])=>{switch(this._state){case"running":t(n,s);break;case"canceling":this._transition("canceled");break;case"pausing":this._transition("paused");break}})}_createResumable(){this._resolveToken((t,n)=>{const s=Ma(this._ref.storage,this._ref._location,this._mappings,this._blob,this._metadata),r=this._ref.storage._makeRequest(s,ee,t,n);this._request=r,r.getPromise().then(i=>{this._request=void 0,this._uploadUrl=i,this._needToFetchStatus=!1,this.completeTransitions_()},this._errorHandler)})}_fetchStatus(){const t=this._uploadUrl;this._resolveToken((n,s)=>{const r=La(this._ref.storage,this._ref._location,t,this._blob),i=this._ref.storage._makeRequest(r,ee,n,s);this._request=i,i.getPromise().then(a=>{a=a,this._request=void 0,this._updateProgress(a.current),this._needToFetchStatus=!1,a.finalized&&(this._needToFetchMetadata=!0),this.completeTransitions_()},this._errorHandler)})}_continueUpload(){const t=St*this._chunkMultiplier,n=new be(this._transferred,this._blob.size()),s=this._uploadUrl;this._resolveToken((r,i)=>{let a;try{a=ja(this._ref._location,this._ref.storage,s,this._blob,t,this._mappings,n,this._makeProgressCallback())}catch(o){this._error=o,this._transition("error");return}const c=this._ref.storage._makeRequest(a,ee,r,i,!1);this._request=c,c.getPromise().then(o=>{this._increaseMultiplier(),this._request=void 0,this._updateProgress(o.current),o.finalized?(this._metadata=o.metadata,this._transition("success")):this.completeTransitions_()},this._errorHandler)})}_increaseMultiplier(){St*this._chunkMultiplier*2<32*1024*1024&&(this._chunkMultiplier*=2)}_fetchMetadata(){this._resolveToken((t,n)=>{const s=Pa(this._ref.storage,this._ref._location,this._mappings),r=this._ref.storage._makeRequest(s,ee,t,n);this._request=r,r.getPromise().then(i=>{this._request=void 0,this._metadata=i,this._transition("success")},this._metadataErrorHandler)})}_oneShotUpload(){this._resolveToken((t,n)=>{const s=Ba(this._ref.storage,this._ref._location,this._mappings,this._blob,this._metadata),r=this._ref.storage._makeRequest(s,ee,t,n);this._request=r,r.getPromise().then(i=>{this._request=void 0,this._metadata=i,this._updateProgress(this._blob.size()),this._transition("success")},this._errorHandler)})}_updateProgress(t){const n=this._transferred;this._transferred=t,this._transferred!==n&&this._notifyObservers()}_transition(t){if(this._state!==t)switch(t){case"canceling":case"pausing":this._state=t,this._request!==void 0?this._request.cancel():this.pendingTimeout&&(clearTimeout(this.pendingTimeout),this.pendingTimeout=void 0,this.completeTransitions_());break;case"running":const n=this._state==="paused";this._state=t,n&&(this._notifyObservers(),this._start());break;case"paused":this._state=t,this._notifyObservers();break;case"canceled":this._error=mn(),this._state=t,this._notifyObservers();break;case"error":this._state=t,this._notifyObservers();break;case"success":this._state=t,this._notifyObservers();break}}completeTransitions_(){switch(this._state){case"pausing":this._transition("paused");break;case"canceling":this._transition("canceled");break;case"running":this._start();break}}get snapshot(){const t=Oe(this._state);return{bytesTransferred:this._transferred,totalBytes:this._blob.size(),state:t,metadata:this._metadata,task:this,ref:this._ref}}on(t,n,s,r){const i=new Fa(n||void 0,s||void 0,r||void 0);return this._addObserver(i),()=>{this._removeObserver(i)}}then(t,n){return this._promise.then(t,n)}catch(t){return this.then(null,t)}_addObserver(t){this._observers.push(t),this._notifyObserver(t)}_removeObserver(t){const n=this._observers.indexOf(t);n!==-1&&this._observers.splice(n,1)}_notifyObservers(){this._finishPromise(),this._observers.slice().forEach(n=>{this._notifyObserver(n)})}_finishPromise(){if(this._resolve!==void 0){let t=!0;switch(Oe(this._state)){case R.SUCCESS:Q(this._resolve.bind(null,this.snapshot))();break;case R.CANCELED:case R.ERROR:const n=this._reject;Q(n.bind(null,this._error))();break;default:t=!1;break}t&&(this._resolve=void 0,this._reject=void 0)}}_notifyObserver(t){switch(Oe(this._state)){case R.RUNNING:case R.PAUSED:t.next&&Q(t.next.bind(t,this.snapshot))();break;case R.SUCCESS:t.complete&&Q(t.complete.bind(t))();break;case R.CANCELED:case R.ERROR:t.error&&Q(t.error.bind(t,this._error))();break;default:t.error&&Q(t.error.bind(t,this._error))()}}resume(){const t=this._state==="paused"||this._state==="pausing";return t&&this._transition("running"),t}pause(){const t=this._state==="running";return t&&this._transition("pausing"),t}cancel(){const t=this._state==="running"||this._state==="pausing";return t&&this._transition("canceling"),t}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Z{constructor(t,n){this._service=t,n instanceof k?this._location=n:this._location=k.makeFromUrl(n,t.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(t,n){return new Z(t,n)}get root(){const t=new k(this._location.bucket,"");return this._newRef(this._service,t)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return vn(this._location.path)}get storage(){return this._service}get parent(){const t=xa(this._location.path);if(t===null)return null;const n=new k(this._location.bucket,t);return new Z(this._service,n)}_throwIfRoot(t){if(this._location.path==="")throw sa(t)}}function za(e,t,n){return e._throwIfRoot("uploadBytesResumable"),new qa(e,new H(t),n)}function Va(e){e._throwIfRoot("getDownloadURL");const t=Oa(e.storage,e._location,xn());return e.storage.makeRequestWithTokens(t,ee).then(n=>{if(n===null)throw ta();return n})}function Wa(e,t){const n=Ca(e._location.path,t),s=new k(e._location.bucket,n);return new Z(e.storage,s)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ga(e){return/^[A-Za-z]+:\/\//.test(e)}function Ka(e,t){return new Z(e,t)}function Nn(e,t){if(e instanceof nt){const n=e;if(n._bucket==null)throw Qi();const s=new Z(n,n._bucket);return t!=null?Nn(s,t):s}else return t!==void 0?Wa(e,t):e}function Xa(e,t){if(t&&Ga(t)){if(e instanceof nt)return Ka(e,t);throw He("To use ref(service, url), the first argument must be a Storage instance.")}else return Nn(e,t)}function At(e,t){const n=t==null?void 0:t[fn];return n==null?null:k.makeFromBucketSpec(n,e)}function Ya(e,t,n,s={}){e.host=`${t}:${n}`;const r=qe(t);r&&(Zn(`https://${e.host}/b`),ns("Storage",!0)),e._isUsingEmulator=!0,e._protocol=r?"https":"http";const{mockUserToken:i}=s;i&&(e._overrideAuthToken=typeof i=="string"?i:Qn(i,e.app.options.projectId))}class nt{constructor(t,n,s,r,i,a=!1){this.app=t,this._authProvider=n,this._appCheckProvider=s,this._url=r,this._firebaseVersion=i,this._isUsingEmulator=a,this._bucket=null,this._host=hn,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=qi,this._maxUploadRetryTime=zi,this._requests=new Set,r!=null?this._bucket=k.makeFromBucketSpec(r,this._host):this._bucket=At(this._host,this.app.options)}get host(){return this._host}set host(t){this._host=t,this._url!=null?this._bucket=k.makeFromBucketSpec(this._url,t):this._bucket=At(t,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(t){Ct("time",0,Number.POSITIVE_INFINITY,t),this._maxUploadRetryTime=t}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(t){Ct("time",0,Number.POSITIVE_INFINITY,t),this._maxOperationRetryTime=t}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;const t=this._authProvider.getImmediate({optional:!0});if(t){const n=await t.getToken();if(n!==null)return n.accessToken}return null}async _getAppCheckToken(){if(or(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const t=this._appCheckProvider.getImmediate({optional:!0});return t?(await t.getToken()).token:null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(t=>t.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(t){return new Z(this,t)}_makeRequest(t,n,s,r,i=!0){if(this._deleted)return new ra(_n());{const a=ma(t,this._appId,s,r,n,this._firebaseVersion,i,this._isUsingEmulator);return this._requests.add(a),a.getPromise().then(()=>this._requests.delete(a),()=>this._requests.delete(a)),a}}async makeRequestWithTokens(t,n){const[s,r]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(t,n,s,r).getPromise()}}const Rt="@firebase/storage",Nt="0.14.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kn="storage";function Ja(e,t,n){return e=ne(e),za(e,t,n)}function Za(e){return e=ne(e),Va(e)}function Qa(e,t){return e=ne(e),Xa(e,t)}function eo(e=dr(),t){e=ne(e);const s=Ve(e,kn).getImmediate({identifier:t}),r=Yn("storage");return r&&to(s,...r),s}function to(e,t,n,s={}){Ya(e,t,n,s)}function no(e,{instanceIdentifier:t}){const n=e.getProvider("app").getImmediate(),s=e.getProvider("auth-internal"),r=e.getProvider("app-check-internal");return new nt(n,s,r,t,ur)}function so(){V(new B(kn,no,"PUBLIC").setMultipleInstances(!0)),O(Rt,Nt,""),O(Rt,Nt,"esm2020")}so();const ro={apiKey:"AIzaSyBYg58nMjuVv0FetDBtKifl5-7DtM4Z53k",authDomain:"ai-smart-campus-management.firebaseapp.com",projectId:"ai-smart-campus-management",storageBucket:"ai-smart-campus-management.firebasestorage.app",messagingSenderId:"593398594428",appId:"1:593398594428:web:754a3289996e92d3b0c2f9",measurementId:"G-42K08PXCX0"},io=$t(ro),ao=eo(io),_o=()=>{const{user:e,refreshUser:t}=Pn(),[n,s]=$.useState(!1),[r,i]=$.useState(!1),[a,c]=$.useState(!1),[o,u]=$.useState(!1),[h,f]=$.useState("profile"),[d,m]=$.useState({firstName:"",lastName:"",title:"",gender:"",dateOfBirth:"",address:"",mobileNumber:"",homeNumber:""}),[p,T]=$.useState({currentPassword:"",newPassword:"",confirmPassword:""});$.useEffect(()=>{e&&(m({firstName:e.firstName||"",lastName:e.lastName||"",title:e.title||"Mr",gender:e.gender||"OTHER",dateOfBirth:e.dateOfBirth?e.dateOfBirth.split("T")[0]:"",address:e.address||"",mobileNumber:e.mobileNumber||"",homeNumber:e.homeNumber||""}),_())},[e]);const _=async()=>{try{const v=(await Un.getSettingByKey("profile_picture_download")).data.setting;if(v.type==="json"){const F=JSON.parse(v.value),re=(e==null?void 0:e.role)||"";u(!!F[re])}else u(v.value==="true")}catch(w){console.error("Failed to check download permission:",w),u(!1)}},A=async w=>{var F;const v=(F=w.target.files)==null?void 0:F[0];if(v){if(!v.type.startsWith("image/"))return N.error("Please upload an image file");if(v.size>2*1024*1024)return N.error("Image size should be less than 2MB");c(!0);try{const re=Qa(ao,`profile-pics/${e==null?void 0:e.id}_${Date.now()}`),st=Ja(re,v);st.on("state_changed",null,ie=>{console.error("Upload error:",ie),N.error("Failed to upload image"),c(!1)},async()=>{try{const ie=await Za(st.snapshot.ref);await ve.updateProfile({profilePic:ie}),await t(),N.success("Profile picture updated")}catch(ie){console.error("Error updating profile with image:",ie),N.error("Failed to update profile picture")}finally{c(!1)}})}catch(re){console.error("Upload error:",re),N.error("Failed to start upload"),c(!1)}}},x=()=>{if(!o)return N.error("You do not have permission to download profile pictures");const w=e==null?void 0:e.profilePic;if(!w)return N.error("No profile picture to download");window.open(w,"_blank","noopener,noreferrer")},g=w=>{m({...d,[w.target.name]:w.target.value})},I=w=>{T({...p,[w.target.name]:w.target.value})},L=async w=>{w.preventDefault(),s(!0);try{await ve.updateProfile(d),await t(),N.success("Profile updated successfully")}catch(v){N.error(v.message||"Failed to update profile")}finally{s(!1)}},j=async w=>{if(w.preventDefault(),p.newPassword!==p.confirmPassword)return N.error("Passwords do not match");i(!0);try{await ve.changePassword({currentPassword:p.currentPassword,newPassword:p.newPassword}),N.success("Password changed successfully"),T({currentPassword:"",newPassword:"",confirmPassword:""})}catch(v){N.error(v.message||"Failed to change password")}finally{i(!1)}};return l.jsx(On,{children:l.jsxs("div",{className:"max-w-4xl mx-auto space-y-6",children:[l.jsxs("div",{children:[l.jsx("h1",{className:"text-3xl font-bold text-gray-900",children:"My Profile"}),l.jsx("p",{className:"text-gray-600 mt-1",children:"Manage your personal information and security"})]}),l.jsxs("div",{className:"bg-white rounded-lg shadow-md overflow-hidden",children:[l.jsxs("div",{className:"flex border-b",children:[l.jsx("button",{onClick:()=>f("profile"),className:`px-6 py-4 text-sm font-medium transition-colors ${h==="profile"?"border-b-2 border-primary-600 text-primary-600":"text-gray-500 hover:text-gray-700"}`,children:"Profile Information"}),l.jsx("button",{onClick:()=>f("password"),className:`px-6 py-4 text-sm font-medium transition-colors ${h==="password"?"border-b-2 border-primary-600 text-primary-600":"text-gray-500 hover:text-gray-700"}`,children:"Security Settings"})]}),l.jsx("div",{className:"p-6",children:h==="profile"?l.jsxs("form",{onSubmit:L,className:"space-y-6",children:[l.jsxs("div",{className:"flex flex-col md:flex-row gap-8 items-start",children:[l.jsxs("div",{className:"flex flex-col items-center space-y-4",children:[l.jsxs("div",{className:"relative",children:[l.jsx("div",{className:"w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center border-4 border-white shadow-sm overflow-hidden",children:e!=null&&e.profilePic?l.jsx("img",{src:e.profilePic,alt:"Profile",className:"w-full h-full object-cover"}):l.jsx(Bn,{className:"w-24 h-24 text-gray-400"})}),l.jsx("button",{type:"button",onClick:()=>{var w;return(w=document.getElementById("profile-pic-upload"))==null?void 0:w.click()},disabled:a,className:"absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full shadow-md hover:bg-primary-700 transition disabled:bg-gray-400",title:"Upload new picture",children:a?l.jsx(Te,{className:"w-4 h-4 animate-spin"}):l.jsx(jn,{className:"w-4 h-4"})}),l.jsx("input",{id:"profile-pic-upload",type:"file",accept:"image/*",className:"hidden",onChange:A})]}),l.jsxs("div",{className:"text-center",children:[l.jsxs("p",{className:"font-semibold text-gray-900",children:[e==null?void 0:e.firstName," ",e==null?void 0:e.lastName]}),l.jsx("p",{className:"text-sm text-gray-500 uppercase",children:e==null?void 0:e.role}),l.jsx("p",{className:"text-xs text-gray-400 mt-1",children:e==null?void 0:e.registrationNumber}),o&&(e==null?void 0:e.profilePic)&&l.jsxs("button",{type:"button",onClick:x,className:"mt-4 flex items-center justify-center space-x-2 text-primary-600 hover:text-primary-700 text-sm font-medium",children:[l.jsx(Mn,{className:"w-4 h-4"}),l.jsx("span",{children:"Download Profile Picture"})]})]})]}),l.jsxs("div",{className:"flex-1 grid grid-cols-1 md:grid-cols-2 gap-4",children:[l.jsxs("div",{children:[l.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Title"}),l.jsxs("select",{name:"title",value:d.title,onChange:g,className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500",children:[l.jsx("option",{value:"Mr",children:"Mr"}),l.jsx("option",{value:"Ms",children:"Ms"}),l.jsx("option",{value:"Dr",children:"Dr"}),l.jsx("option",{value:"Prof",children:"Prof"})]})]}),l.jsxs("div",{children:[l.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Gender"}),l.jsxs("select",{name:"gender",value:d.gender,onChange:g,className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500",children:[l.jsx("option",{value:"MALE",children:"Male"}),l.jsx("option",{value:"FEMALE",children:"Female"}),l.jsx("option",{value:"OTHER",children:"Other"})]})]}),l.jsxs("div",{children:[l.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"First Name"}),l.jsx("input",{type:"text",name:"firstName",value:d.firstName,onChange:g,className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500",required:!0})]}),l.jsxs("div",{children:[l.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Last Name"}),l.jsx("input",{type:"text",name:"lastName",value:d.lastName,onChange:g,className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500",required:!0})]}),l.jsxs("div",{children:[l.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Email (Read-only)"}),l.jsx("input",{type:"email",value:e==null?void 0:e.email,className:"w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500",readOnly:!0})]}),l.jsxs("div",{children:[l.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Date of Birth"}),l.jsx("input",{type:"date",name:"dateOfBirth",value:d.dateOfBirth,onChange:g,className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"})]}),l.jsxs("div",{children:[l.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Mobile Number"}),l.jsx("input",{type:"tel",name:"mobileNumber",value:d.mobileNumber,onChange:g,className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"})]}),l.jsxs("div",{children:[l.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Home Number"}),l.jsx("input",{type:"tel",name:"homeNumber",value:d.homeNumber,onChange:g,className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"})]}),l.jsxs("div",{className:"md:col-span-2",children:[l.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Address"}),l.jsx("textarea",{name:"address",value:d.address,onChange:g,rows:3,className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"})]})]})]}),l.jsx("div",{className:"pt-6 border-t flex justify-end",children:l.jsx("button",{type:"submit",disabled:n,className:"flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50",children:n?l.jsxs(l.Fragment,{children:[l.jsx(Te,{className:"w-5 h-5 mr-2 animate-spin"}),"Saving..."]}):l.jsxs(l.Fragment,{children:[l.jsx(Ln,{className:"w-5 h-5 mr-2"}),"Save Changes"]})})})]}):l.jsxs("form",{onSubmit:j,className:"max-w-md space-y-6",children:[l.jsxs("div",{children:[l.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Current Password"}),l.jsxs("div",{className:"relative",children:[l.jsx("div",{className:"absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",children:l.jsx(he,{className:"h-5 w-5 text-gray-400"})}),l.jsx("input",{type:"password",name:"currentPassword",value:p.currentPassword,onChange:I,required:!0,className:"w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500",placeholder:"••••••••"})]})]}),l.jsxs("div",{children:[l.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"New Password"}),l.jsxs("div",{className:"relative",children:[l.jsx("div",{className:"absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",children:l.jsx(he,{className:"h-5 w-5 text-gray-400"})}),l.jsx("input",{type:"password",name:"newPassword",value:p.newPassword,onChange:I,required:!0,minLength:6,className:"w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500",placeholder:"••••••••"})]})]}),l.jsxs("div",{children:[l.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Confirm New Password"}),l.jsxs("div",{className:"relative",children:[l.jsx("div",{className:"absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",children:l.jsx(he,{className:"h-5 w-5 text-gray-400"})}),l.jsx("input",{type:"password",name:"confirmPassword",value:p.confirmPassword,onChange:I,required:!0,className:"w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500",placeholder:"••••••••"})]})]}),l.jsx("div",{className:"pt-6 border-t flex justify-end",children:l.jsx("button",{type:"submit",disabled:r,className:"flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50",children:r?l.jsxs(l.Fragment,{children:[l.jsx(Te,{className:"w-5 h-5 mr-2 animate-spin"}),"Updating..."]}):l.jsxs(l.Fragment,{children:[l.jsx(he,{className:"w-5 h-5 mr-2"}),"Update Password"]})})})]})})]})]})})};export{_o as default};
