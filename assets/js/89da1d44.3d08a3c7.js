"use strict";(self.webpackChunkkrateo_v_2_docs=self.webpackChunkkrateo_v_2_docs||[]).push([[192],{7332:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>d,contentTitle:()=>l,default:()=>h,frontMatter:()=>o,metadata:()=>c,toc:()=>u});var s=r(7624),a=r(2172),n=r(1268),i=r(5388);const o={description:"Learn about Krateo PlatformOps by progressing a change through multiple stages in a Kubernetes cluster",sidebar_label:"Quickstart"},l="Krateo PlatformOps Quickstart",c={id:"quickstart",title:"Krateo PlatformOps Quickstart",description:"Learn about Krateo PlatformOps by progressing a change through multiple stages in a Kubernetes cluster",source:"@site/docs/40-quickstart.mdx",sourceDirName:".",slug:"/quickstart",permalink:"/quickstart",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:40,frontMatter:{description:"Learn about Krateo PlatformOps by progressing a change through multiple stages in a Kubernetes cluster",sidebar_label:"Quickstart"},sidebar:"tutorialSidebar",previous:{title:"Migrating Krateo PlatformOps Composition from v1 to v2",permalink:"/how-to-guides/migrating-from-composition-to-helm"},next:{title:"core-provider",permalink:"/core-crd-reference/core-provider-crd"}},d={},u=[{value:"Requirements",id:"requirements",level:2},{value:"Deploy Krateo PlatformOps on a local cluster (kind)",id:"deploy-krateo-platformops-on-a-local-cluster-kind",level:2},{value:"Deploy the FireworksApp Template",id:"deploy-the-fireworksapp-template",level:2},{value:"Deploy a Composition leveraging the FireworksApp Template",id:"deploy-a-composition-leveraging-the-fireworksapp-template",level:2},{value:"Overview",id:"overview",level:3},{value:"Composition Status",id:"composition-status",level:3},{value:"Application Status",id:"application-status",level:3},{value:"Events",id:"events",level:3},{value:"Destroy the cluster",id:"destroy-the-cluster",level:2}];function p(e){const t={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",img:"img",li:"li",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,a.M)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.h1,{id:"krateo-platformops-quickstart",children:"Krateo PlatformOps Quickstart"}),"\n",(0,s.jsx)(t.p,{children:"This guide presents a basic introduction to Krateo PlatformOps. Together, we will:"}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsx)(t.li,{children:"Install Krateo PlatformOps into a local or managed Kubernetes cluster."}),"\n",(0,s.jsx)(t.li,{children:"Deploy the FireworksApp Template"}),"\n",(0,s.jsx)(t.li,{children:"Deploy a Composition leveraging the FireworksApp Template"}),"\n",(0,s.jsx)(t.li,{children:"Destroy the cluster"}),"\n"]}),"\n",(0,s.jsx)(t.h2,{id:"requirements",children:"Requirements"}),"\n",(0,s.jsx)(t.p,{children:"The FireworksApp Template will create a new public GitHub repository in your organization. Fill the form according to the organization name."}),"\n",(0,s.jsx)(t.h2,{id:"deploy-krateo-platformops-on-a-local-cluster-kind",children:"Deploy Krateo PlatformOps on a local cluster (kind)"}),"\n",(0,s.jsxs)(t.p,{children:["Any of the following approaches require ",(0,s.jsx)(t.a,{href:"https://helm.sh/docs/",children:"Helm"})," v3.13.1 or\ngreater to be installed."]}),"\n",(0,s.jsx)(n.c,{groupId:"local-cluster-start",children:(0,s.jsxs)(i.c,{value:"kind",label:"kind",children:[(0,s.jsxs)(t.p,{children:["If you have any Docker-compatible container runtime installed (including native\nDocker, Docker Desktop, or OrbStack), you can easily launch a disposable cluster\njust for this quickstart using\n",(0,s.jsx)(t.a,{href:"https://kind.sigs.k8s.io/#installation-and-usage",children:"kind"}),"."]}),(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-shell",children:"curl -L https://github.com/krateoplatformops/krateo-v2-docs/releases/latest/download/kind.sh | sh\n"})}),(0,s.jsx)(t.admonition,{type:"info",children:(0,s.jsx)(t.p,{children:"While this option is a bit more complex than using Docker Desktop or OrbStack\ndirectly, it offers the advantage of being fully-disposable. If your cluster\nreaches a state you are dissatisfied with, you can simply destroy it and\nlaunch a new one."})}),(0,s.jsx)(t.p,{children:"Wait for Krateo PlatformOps to be up&running:"}),(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-shell",children:"kubectl wait krateoplatformops krateo --for condition=Ready=True --namespace krateo-system --timeout=300s\n"})}),(0,s.jsx)(t.p,{children:"At the end of this process:"}),(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsxs)(t.li,{children:["The ",(0,s.jsx)(t.em,{children:"Krateo Composable Portal"})," will be accessible at ",(0,s.jsx)(t.a,{href:"http://localhost:30080",children:"localhost:30080"}),"."]}),"\n",(0,s.jsxs)(t.li,{children:["The ",(0,s.jsx)(t.em,{children:"admin"})," user password can be retrieved with the following command:"]}),"\n"]}),(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-shell",children:'kubectl get secret admin-password  -n krateo-system -o jsonpath="{.data.password}" | base64 -d\n'})})]})}),"\n",(0,s.jsx)(t.p,{children:"Login into the Krateo Composable Portal:"}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.img,{alt:"Login",src:r(9188).c+"",width:"2854",height:"1376"})}),"\n",(0,s.jsx)(t.h2,{id:"deploy-the-fireworksapp-template",children:"Deploy the FireworksApp Template"}),"\n",(0,s.jsxs)(t.p,{children:["We will leverage the ",(0,s.jsx)(t.a,{href:"https://github.com/krateoplatformops/krateo-v2-template-fireworksapp",children:"FireworksApp template"}),".\nFollow the ",(0,s.jsx)(t.a,{href:"https://github.com/krateoplatformops/krateo-v2-template-fireworksapp/blob/main/README.md",children:"README"})," instructions to deploy the template leveraging ",(0,s.jsx)(t.a,{href:"https://github.com/krateoplatformops/krateo-v2-template-fireworksapp/blob/main/README.md#with-krateo-composable-portal",children:"Krateo Composable Portal"}),"."]}),"\n",(0,s.jsxs)(t.p,{children:["Wait for the ",(0,s.jsx)(t.em,{children:"CompositionDefinition"})," to become Ready:"]}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-shell",children:"kubectl wait compositiondefinition fireworksapp --for condition=Ready=True --namespace fireworksapp-system --timeout=300s\n"})}),"\n",(0,s.jsxs)(t.p,{children:["Check the ",(0,s.jsx)(t.em,{children:"Templates"})," section in the Portal:"]}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.img,{alt:"Templates",src:r(2008).c+"",width:"2866",height:"736"})}),"\n",(0,s.jsx)(t.h2,{id:"deploy-a-composition-leveraging-the-fireworksapp-template",children:"Deploy a Composition leveraging the FireworksApp Template"}),"\n",(0,s.jsxs)(t.p,{children:["Click on the ",(0,s.jsx)(t.em,{children:"FireworksApp"})," card, a form will appear on the right:"]}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.img,{alt:"Form",src:r(3744).c+"",width:"2866",height:"1600"})}),"\n",(0,s.jsx)(t.p,{children:"Fill the form fields in the following way:"}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{children:"Key"}),(0,s.jsx)(t.th,{children:"Value"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"name"}),(0,s.jsx)(t.td,{children:"krateo-demo"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"namespace"}),(0,s.jsx)(t.td,{children:"fireworksapp-system"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"namespace"}),(0,s.jsx)(t.td,{children:"fireworksapp-system"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"git.toRepo.org"}),(0,s.jsx)(t.td,{children:(0,s.jsx)(t.em,{children:"your github organization"})})]})]})]}),"\n",(0,s.jsx)(t.p,{children:"A new Composition is now available:"}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.img,{alt:"Composition",src:r(7172).c+"",width:"2866",height:"808"})}),"\n",(0,s.jsx)(t.p,{children:"Let's dig into the Composition tabs:"}),"\n",(0,s.jsx)(t.h3,{id:"overview",children:"Overview"}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.img,{alt:"Composition-Overview",src:r(8564).c+"",width:"2866",height:"808"})}),"\n",(0,s.jsx)(t.h3,{id:"composition-status",children:"Composition Status"}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.img,{alt:"Composition-CompositionStatus",src:r(1900).c+"",width:"2866",height:"1476"})}),"\n",(0,s.jsx)(t.h3,{id:"application-status",children:"Application Status"}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.img,{alt:"Composition-ApplicationStatus",src:r(2032).c+"",width:"2866",height:"1476"})}),"\n",(0,s.jsx)(t.h3,{id:"events",children:"Events"}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.img,{alt:"Composition-Events",src:r(3308).c+"",width:"2866",height:"1476"})}),"\n",(0,s.jsx)(t.h2,{id:"destroy-the-cluster",children:"Destroy the cluster"}),"\n",(0,s.jsx)(t.p,{children:"Simply destroy the cluster:"}),"\n",(0,s.jsx)(n.c,{groupId:"local-cluster-start",children:(0,s.jsx)(i.c,{value:"kind",label:"kind",children:(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-shell",children:"kind delete cluster --name krateo-quickstart\n"})})})})]})}function h(e={}){const{wrapper:t}={...(0,a.M)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(p,{...e})}):p(e)}},5388:(e,t,r)=>{r.d(t,{c:()=>i});r(1504);var s=r(5456);const a={tabItem:"tabItem_Ymn6"};var n=r(7624);function i(e){let{children:t,hidden:r,className:i}=e;return(0,n.jsx)("div",{role:"tabpanel",className:(0,s.c)(a.tabItem,i),hidden:r,children:t})}},1268:(e,t,r)=>{r.d(t,{c:()=>w});var s=r(1504),a=r(5456),n=r(3943),i=r(5592),o=r(5288),l=r(632),c=r(7128),d=r(1148);function u(e){return s.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,s.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function p(e){const{values:t,children:r}=e;return(0,s.useMemo)((()=>{const e=t??function(e){return u(e).map((e=>{let{props:{value:t,label:r,attributes:s,default:a}}=e;return{value:t,label:r,attributes:s,default:a}}))}(r);return function(e){const t=(0,c.w)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,r])}function h(e){let{value:t,tabValues:r}=e;return r.some((e=>e.value===t))}function m(e){let{queryString:t=!1,groupId:r}=e;const a=(0,i.Uz)(),n=function(e){let{queryString:t=!1,groupId:r}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!r)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return r??null}({queryString:t,groupId:r});return[(0,l._M)(n),(0,s.useCallback)((e=>{if(!n)return;const t=new URLSearchParams(a.location.search);t.set(n,e),a.replace({...a.location,search:t.toString()})}),[n,a])]}function f(e){const{defaultValue:t,queryString:r=!1,groupId:a}=e,n=p(e),[i,l]=(0,s.useState)((()=>function(e){let{defaultValue:t,tabValues:r}=e;if(0===r.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!h({value:t,tabValues:r}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${r.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const s=r.find((e=>e.default))??r[0];if(!s)throw new Error("Unexpected error: 0 tabValues");return s.value}({defaultValue:t,tabValues:n}))),[c,u]=m({queryString:r,groupId:a}),[f,g]=function(e){let{groupId:t}=e;const r=function(e){return e?`docusaurus.tab.${e}`:null}(t),[a,n]=(0,d.IN)(r);return[a,(0,s.useCallback)((e=>{r&&n.set(e)}),[r,n])]}({groupId:a}),b=(()=>{const e=c??f;return h({value:e,tabValues:n})?e:null})();(0,o.c)((()=>{b&&l(b)}),[b]);return{selectedValue:i,selectValue:(0,s.useCallback)((e=>{if(!h({value:e,tabValues:n}))throw new Error(`Can't select invalid tab value=${e}`);l(e),u(e),g(e)}),[u,g,n]),tabValues:n}}var g=r(3664);const b={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var x=r(7624);function j(e){let{className:t,block:r,selectedValue:s,selectValue:i,tabValues:o}=e;const l=[],{blockElementScrollPositionUntilNextRender:c}=(0,n.MV)(),d=e=>{const t=e.currentTarget,r=l.indexOf(t),a=o[r].value;a!==s&&(c(t),i(a))},u=e=>{let t=null;switch(e.key){case"Enter":d(e);break;case"ArrowRight":{const r=l.indexOf(e.currentTarget)+1;t=l[r]??l[0];break}case"ArrowLeft":{const r=l.indexOf(e.currentTarget)-1;t=l[r]??l[l.length-1];break}}t?.focus()};return(0,x.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,a.c)("tabs",{"tabs--block":r},t),children:o.map((e=>{let{value:t,label:r,attributes:n}=e;return(0,x.jsx)("li",{role:"tab",tabIndex:s===t?0:-1,"aria-selected":s===t,ref:e=>l.push(e),onKeyDown:u,onClick:d,...n,className:(0,a.c)("tabs__item",b.tabItem,n?.className,{"tabs__item--active":s===t}),children:r??t},t)}))})}function v(e){let{lazy:t,children:r,selectedValue:a}=e;const n=(Array.isArray(r)?r:[r]).filter(Boolean);if(t){const e=n.find((e=>e.props.value===a));return e?(0,s.cloneElement)(e,{className:"margin-top--md"}):null}return(0,x.jsx)("div",{className:"margin-top--md",children:n.map(((e,t)=>(0,s.cloneElement)(e,{key:t,hidden:e.props.value!==a})))})}function k(e){const t=f(e);return(0,x.jsxs)("div",{className:(0,a.c)("tabs-container",b.tabList),children:[(0,x.jsx)(j,{...e,...t}),(0,x.jsx)(v,{...e,...t})]})}function w(e){const t=(0,g.c)();return(0,x.jsx)(k,{...e,children:u(e.children)},String(t))}},9188:(e,t,r)=>{r.d(t,{c:()=>s});const s=r.p+"assets/images/01-Quickstart-Login-6249aa62f53fffed8bab8692fa3115a1.png"},2008:(e,t,r)=>{r.d(t,{c:()=>s});const s=r.p+"assets/images/02-Quickstart-Template-584b67d10625165bd4faac3409578fd6.png"},3744:(e,t,r)=>{r.d(t,{c:()=>s});const s=r.p+"assets/images/03-Quickstart-Form-7e8dc5c52841a615c4e9437bdca7a71f.png"},7172:(e,t,r)=>{r.d(t,{c:()=>s});const s=r.p+"assets/images/04-Quickstart-Composition-2c3d78cb7024346f2926e21632bc953b.png"},8564:(e,t,r)=>{r.d(t,{c:()=>s});const s=r.p+"assets/images/05-Quickstart-Composition-Overview-6f6405512f30c674a895c0204a1af5b7.png"},1900:(e,t,r)=>{r.d(t,{c:()=>s});const s=r.p+"assets/images/06-Quickstart-Composition-CompositionStatus-ed62c813d3ac31b1288c8499a4d68265.png"},2032:(e,t,r)=>{r.d(t,{c:()=>s});const s=r.p+"assets/images/07-Quickstart-Composition-ApplicationStatus-e993f93609b6f51d0ed44aed95cb1766.png"},3308:(e,t,r)=>{r.d(t,{c:()=>s});const s=r.p+"assets/images/08-Quickstart-Composition-Events-101c274c0f91a236d709adc7f8c7be12.png"},2172:(e,t,r)=>{r.d(t,{I:()=>o,M:()=>i});var s=r(1504);const a={},n=s.createContext(a);function i(e){const t=s.useContext(n);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function o(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:i(e.components),s.createElement(n.Provider,{value:t},e.children)}}}]);