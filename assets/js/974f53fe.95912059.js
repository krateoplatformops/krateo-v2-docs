"use strict";(self.webpackChunkkrateo_v_2_docs=self.webpackChunkkrateo_v_2_docs||[]).push([[296],{4956:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>c,contentTitle:()=>i,default:()=>h,frontMatter:()=>s,metadata:()=>a,toc:()=>l});var n=r(7624),o=r(2172);const s={sidebar_label:"Krateo Operator Generator",description:"Find out more about Krateo Operator Generator (KOG) key concepts"},i="What is Krateo Operator Generator (KOG)?",a={id:"key-concepts/kog",title:"What is Krateo Operator Generator (KOG)?",description:"Find out more about Krateo Operator Generator (KOG) key concepts",source:"@site/docs/20-key-concepts/40-kog.md",sourceDirName:"20-key-concepts",slug:"/key-concepts/kog",permalink:"/key-concepts/kog",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:40,frontMatter:{sidebar_label:"Krateo Operator Generator",description:"Find out more about Krateo Operator Generator (KOG) key concepts"},sidebar:"tutorialSidebar",previous:{title:"Krateo Composable FinOps",permalink:"/key-concepts/kcf"},next:{title:"Quickstart",permalink:"/quickstart"}},c={},l=[{value:"oasgen-provider",id:"oasgen-provider",level:2},{value:"rest-dynamic-controller",id:"rest-dynamic-controller",level:2}];function d(e){const t={a:"a",h1:"h1",h2:"h2",li:"li",p:"p",strong:"strong",ul:"ul",...(0,o.M)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.h1,{id:"what-is-krateo-operator-generator-kog",children:"What is Krateo Operator Generator (KOG)?"}),"\n",(0,n.jsx)(t.p,{children:"\ud83d\udca1 KOG is designed to generate Kubernetes controllers from OpenAPI specifications of REST APIs for services and resources you want to control."}),"\n",(0,n.jsx)(t.p,{children:"\ud83d\udcda The main goal is to automate the creation of Kubernetes operators by leveraging existing API specifications, making it easier to integrate external services with Kubernetes."}),"\n",(0,n.jsx)(t.p,{children:"\ud83e\udd1d KOG adapts perfectly to both new projects and existing APIs, allowing you to quickly create Kubernetes-native interfaces for your services."}),"\n",(0,n.jsx)(t.p,{children:"\ud83c\udfaf Through its generation capabilities, KOG can create both Custom Resource Definitions (CRDs) and controllers that match your API specifications, standardizing how you interact with external services through Kubernetes."}),"\n",(0,n.jsx)(t.p,{children:"KOG consists of the following features:"}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsx)(t.li,{children:"oasgen-provider"}),"\n",(0,n.jsx)(t.li,{children:"rest-dynamic-controller"}),"\n"]}),"\n",(0,n.jsx)(t.h2,{id:"oasgen-provider",children:"oasgen-provider"}),"\n",(0,n.jsx)(t.p,{children:"The \ud835\ude30\ud835\ude22\ud835\ude34\ud835\ude28\ud835\ude26\ud835\ude2f-\ud835\ude31\ud835\ude33\ud835\ude30\ud835\ude37\ud835\ude2a\ud835\ude25\ud835\ude26\ud835\ude33 is the core component of Krateo Operator Generator (KOG), responsible for generating CRDs and controllers from OpenAPI Specification (OAS) 3.1 (with backward compatibility for 3.0)."}),"\n",(0,n.jsx)(t.p,{children:"\ud83d\udccc The component assumes that your services expose REST APIs documented with OpenAPI Specification as the standard for defining your service interfaces."}),"\n",(0,n.jsx)(t.p,{children:"\ud83d\udcc8 OpenAPI Specification is the most widely used standard for documenting REST APIs."}),"\n",(0,n.jsx)(t.p,{children:"\u261d It's important to note that oasgen-provider not only generates the Kubernetes resources but also manages their lifecycle through the rest-dynamic-controller."}),"\n",(0,n.jsx)(t.p,{children:"\u26a1\ufe0f The \ud835\ude30\ud835\ude22\ud835\ude34\ud835\ude28\ud835\ude26\ud835\ude2f-\ud835\ude31\ud835\ude33\ud835\ude30\ud835\ude37\ud835\ude2a\ud835\ude25\ud835\ude26\ud835\ude33 analyzes your OpenAPI specification to:"}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsx)(t.li,{children:"Generate Custom Resource Definitions (CRDs) that match your API schema"}),"\n",(0,n.jsx)(t.li,{children:"Create controllers that handle the lifecycle of these resources"}),"\n",(0,n.jsx)(t.li,{children:"Establish proper validation rules based on your API specification"}),"\n",(0,n.jsx)(t.li,{children:"Set up the necessary reconciliation logic"}),"\n"]}),"\n",(0,n.jsxs)(t.p,{children:["Check the detailed ",(0,n.jsx)(t.a,{href:"https://github.com/krateoplatformops/oasgen-provider/blob/main/README.md",children:"README"})]}),"\n",(0,n.jsx)(t.h2,{id:"rest-dynamic-controller",children:"rest-dynamic-controller"}),"\n",(0,n.jsx)(t.p,{children:"The second component of Krateo Operator Generator (KOG) is the \ud835\ude33\ud835\ude26\ud835\ude34\ud835\ude35-\ud835\ude25\ud835\ude3a\ud835\ude2f\ud835\ude22\ud835\ude2e\ud835\ude2a\ud835\ude24-\ud835\ude24\ud835\ude30\ud835\ude2f\ud835\ude35\ud835\ude33\ud835\ude30\ud835\ude2d\ud835\ude2d\ud835\ude26\ud835\ude33, which manages the resources generated by the oasgen-provider."}),"\n",(0,n.jsx)(t.p,{children:"\ud83d\udd27 Key Features:"}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsxs)(t.li,{children:["\n",(0,n.jsxs)(t.p,{children:[(0,n.jsx)(t.strong,{children:"Resource Management"}),": Automatically creates Kubernetes Custom Resource Definitions that match your OpenAPI specifications"]}),"\n"]}),"\n",(0,n.jsxs)(t.li,{children:["\n",(0,n.jsxs)(t.p,{children:[(0,n.jsx)(t.strong,{children:"Automated Workflow"}),": Reduces manual coding and accelerates operator development"]}),"\n"]}),"\n",(0,n.jsxs)(t.li,{children:["\n",(0,n.jsxs)(t.p,{children:[(0,n.jsx)(t.strong,{children:"Easy Maintenance"}),": Updates to your API automatically reflect in your Kubernetes operators"]}),"\n"]}),"\n",(0,n.jsxs)(t.li,{children:["\n",(0,n.jsxs)(t.p,{children:[(0,n.jsx)(t.strong,{children:"Resource Management"}),": Enables full CRUD operations on your custom resources within Kubernetes"]}),"\n"]}),"\n"]}),"\n",(0,n.jsxs)(t.p,{children:["Check the detailed ",(0,n.jsx)(t.a,{href:"https://github.com/krateoplatformops/rest-dynamic-controller/blob/main/README.md",children:"README"}),"."]}),"\n",(0,n.jsx)(t.p,{children:"For more details about KOG and to get started, visit our GitHub repositories:"}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsxs)(t.li,{children:["oasgen-provider: ",(0,n.jsx)(t.a,{href:"https://github.com/krateoplatformops/oasgen-provider",children:"https://github.com/krateoplatformops/oasgen-provider"})]}),"\n",(0,n.jsxs)(t.li,{children:["rest-dynamic-controller: ",(0,n.jsx)(t.a,{href:"https://github.com/krateoplatformops/rest-dynamic-controller",children:"https://github.com/krateoplatformops/rest-dynamic-controller"})]}),"\n"]})]})}function h(e={}){const{wrapper:t}={...(0,o.M)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(d,{...e})}):d(e)}},2172:(e,t,r)=>{r.d(t,{I:()=>a,M:()=>i});var n=r(1504);const o={},s=n.createContext(o);function i(e){const t=n.useContext(s);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:i(e.components),n.createElement(s.Provider,{value:t},e.children)}}}]);