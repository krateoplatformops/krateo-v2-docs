"use strict";(self.webpackChunkkrateo_v_2_docs=self.webpackChunkkrateo_v_2_docs||[]).push([[994],{3304:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>a,contentTitle:()=>i,default:()=>h,frontMatter:()=>s,metadata:()=>c,toc:()=>l});var t=r(7624),o=r(2172);const s={},i="Rest Dynamic Controller",c={id:"key-concepts/kog/rest-dynamic-controller",title:"Rest Dynamic Controller",description:"The rest-dynamic-controller is an operator instantiated by the oasgen-provider to manage Custom Resources whose Custom Resource Definitions (CRDs) are generated by the oasgen-provider.",source:"@site/docs/20-key-concepts/40-kog/20-rest-dynamic-controller.md",sourceDirName:"20-key-concepts/40-kog",slug:"/key-concepts/kog/rest-dynamic-controller",permalink:"/key-concepts/kog/rest-dynamic-controller",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:20,frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"oasgen-provider",permalink:"/key-concepts/kog/oasgen-provider"},next:{title:"Quickstart",permalink:"/quickstart"}},a={},l=[{value:"Table of Contents",id:"table-of-contents",level:2},{value:"Overview",id:"overview",level:2},{value:"How It Works",id:"how-it-works",level:2},{value:"Usage Examples",id:"usage-examples",level:2},{value:"Configuration",id:"configuration",level:2},{value:"Environment Variables",id:"environment-variables",level:3}];function d(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,o.M)(),...e.components},{Details:r}=n;return r||function(e,n){throw new Error("Expected "+(n?"component":"object")+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}("Details",!0),(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{id:"rest-dynamic-controller",children:"Rest Dynamic Controller"}),"\n",(0,t.jsxs)(n.p,{children:["The ",(0,t.jsx)(n.code,{children:"rest-dynamic-controller"})," is an operator instantiated by the ",(0,t.jsx)(n.a,{href:"https://github.com/krateoplatformops/oasgen-provider",children:"oasgen-provider"})," to manage Custom Resources whose Custom Resource Definitions (CRDs) are generated by the ",(0,t.jsx)(n.code,{children:"oasgen-provider"}),"."]}),"\n",(0,t.jsx)(n.h2,{id:"table-of-contents",children:"Table of Contents"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:(0,t.jsx)(n.a,{href:"#overview",children:"Overview"})}),"\n",(0,t.jsx)(n.li,{children:(0,t.jsx)(n.a,{href:"#how-it-works",children:"How It Works"})}),"\n",(0,t.jsx)(n.li,{children:(0,t.jsx)(n.a,{href:"#usage-examples",children:"Usage Examples"})}),"\n",(0,t.jsx)(n.li,{children:(0,t.jsx)(n.a,{href:"#configuration",children:"Configuration"})}),"\n"]}),"\n",(0,t.jsx)(n.h2,{id:"overview",children:"Overview"}),"\n",(0,t.jsxs)(n.p,{children:["The ",(0,t.jsx)(n.code,{children:"rest-dynamic-controller"}),' is a dynamic controller that manages Remote Resources through REST APIs. It\'s considered "dynamic" because it can manage any type of remote resource represented by a Custom Resource Definition and its related Custom Resource. The controller is configured at startup through environment variables (or CLI parameters) to manage a specific Group Version Resource.']}),"\n",(0,t.jsx)(n.h2,{id:"how-it-works",children:"How It Works"}),"\n",(0,t.jsxs)(n.p,{children:["When a Custom Resource (CR) is created and its Custom Resource Definition (CRD) has been generated by a ",(0,t.jsx)(n.code,{children:"RestDefinition"})," from the ",(0,t.jsx)(n.code,{children:"oasgen-provider"}),", the following process occurs:"]}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsxs)(n.li,{children:["The ",(0,t.jsx)(n.code,{children:"rest-dynamic-controller"})," instance checks if the remote resource exists by following the instructions defined in the ",(0,t.jsx)(n.a,{href:"https://doc.crds.dev/github.com/krateoplatformops/oasgen-provider",children:(0,t.jsx)(n.code,{children:"RestDefinition"})}),"."]}),"\n",(0,t.jsxs)(n.li,{children:["If the resource doesn't exist, the controller performs the action described in the ",(0,t.jsx)(n.code,{children:"verbsDescription"})," field of the ",(0,t.jsx)(n.code,{children:"RestDefinition"})," CR."]}),"\n",(0,t.jsx)(n.li,{children:"For deletion requests, a similar process is followed."}),"\n",(0,t.jsx)(n.li,{children:"During resource observation, the controller verifies if the remote resource is synchronized with the CR and performs updates if necessary."}),"\n"]}),"\n",(0,t.jsx)(n.h2,{id:"usage-examples",children:"Usage Examples"}),"\n",(0,t.jsx)(n.p,{children:"Here's an example of a Custom Resource manifest:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:'kind: Repo\napiVersion: gen.github.com/v1alpha1\nmetadata:\n  name: gh-repo1\n  namespace: default\n  annotations:\n    krateo.io/connector-verbose: "true"\nspec:\n  org: krateoplatformops\n  name: test-generatore\n  authenticationRefs:\n    bearerAuthRef: bearer-gh-ref\n'})}),"\n",(0,t.jsxs)(n.p,{children:["This manifest represents a CR of kind ",(0,t.jsx)(n.code,{children:"Repo"})," with apiVersion ",(0,t.jsx)(n.code,{children:"gen.github.com/v1alpha1"}),". The CRD was generated by the oasgen-provider based on the specifications in the RestDefinition shown below."]}),"\n",(0,t.jsxs)(r,{children:[(0,t.jsx)("summary",{children:(0,t.jsx)("b",{children:"GitHub Repo RestDefinition"})}),(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:"kind: RestDefinition\napiVersion: swaggergen.krateo.io/v1alpha1\nmetadata:\n  name: def-github\n  namespace: default\nspec:\n  oasPath: https://github.com/krateoplatformops/github-oas3/raw/1-oas-specification-fixes/openapi.yaml\n  resourceGroup: gen.github.com\n  resource:\n    kind: Repo\n    identifiers:\n      - id\n      - name\n      - html_url\n    verbsDescription:\n    - action: create\n      method: POST\n      path: /orgs/{org}/repos\n    - action: delete\n      method: DELETE\n      path: /repos/{owner}/{repo}\n      altFieldMapping:\n        org: owner\n        name: repo\n    - action: get\n      method: GET\n      path: /repos/{owner}/{repo}\n      altFieldMapping:\n        org: owner\n        name: repo\n"})})]}),"\n",(0,t.jsx)(n.h2,{id:"configuration",children:"Configuration"}),"\n",(0,t.jsx)(n.h3,{id:"environment-variables",children:"Environment Variables"}),"\n",(0,t.jsx)(n.p,{children:"The following environment variables can be configured in the rest-dynamic-controller's Deployment:"}),"\n",(0,t.jsxs)(n.table,{children:[(0,t.jsx)(n.thead,{children:(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.th,{children:"Name"}),(0,t.jsx)(n.th,{children:"Description"}),(0,t.jsx)(n.th,{children:"Default Value"})]})}),(0,t.jsxs)(n.tbody,{children:[(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:"REST_CONTROLLER_DEBUG"}),(0,t.jsx)(n.td,{children:"Enable verbose output"}),(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"false"})})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:"REST_CONTROLLER_WORKERS"}),(0,t.jsx)(n.td,{children:"Number of worker threads"}),(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"1"})})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:"REST_CONTROLLER_RESYNC_INTERVAL"}),(0,t.jsx)(n.td,{children:"Interval between resyncs"}),(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"3m"})})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:"REST_CONTROLLER_GROUP"}),(0,t.jsx)(n.td,{children:"Resource API group"}),(0,t.jsx)(n.td,{children:"-"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:"REST_CONTROLLER_VERSION"}),(0,t.jsx)(n.td,{children:"Resource API version"}),(0,t.jsx)(n.td,{children:"-"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:"REST_CONTROLLER_RESOURCE"}),(0,t.jsx)(n.td,{children:"Resource plural name"}),(0,t.jsx)(n.td,{children:"-"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:"URL_PLURALS"}),(0,t.jsx)(n.td,{children:"BFF plurals endpoint"}),(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"http://bff.krateo-system.svc.cluster.local:8081/api-info/names"})})]})]})]})]})}function h(e={}){const{wrapper:n}={...(0,o.M)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(d,{...e})}):d(e)}},2172:(e,n,r)=>{r.d(n,{I:()=>c,M:()=>i});var t=r(1504);const o={},s=t.createContext(o);function i(e){const n=t.useContext(s);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:i(e.components),t.createElement(s.Provider,{value:n},e.children)}}}]);