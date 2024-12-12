"use strict";(self.webpackChunkkrateo_v_2_docs=self.webpackChunkkrateo_v_2_docs||[]).push([[700],{8748:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>d,contentTitle:()=>o,default:()=>h,frontMatter:()=>r,metadata:()=>i,toc:()=>c});var a=n(7624),s=n(2172);const r={},o="finops-database-handler",i={id:"key-concepts/kcf/finops-database-handler",title:"finops-database-handler",description:"This service offers a set of endpoints to connect to the Krateo's CrateDB instance and use notebooks to compute data starting from SQL queries.",source:"@site/docs/20-key-concepts/30-kcf/40-finops-database-handler.md",sourceDirName:"20-key-concepts/30-kcf",slug:"/key-concepts/kcf/finops-database-handler",permalink:"/key-concepts/kcf/finops-database-handler",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:40,frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"finops-operator-focus",permalink:"/key-concepts/kcf/finops-operator-focus"},next:{title:"finops-prometheus-exporter-generic",permalink:"/key-concepts/kcf/finops-prometheus-exporter-generic"}},d={},c=[{value:"Summary",id:"summary",level:2},{value:"Overview",id:"overview",level:2},{value:"Architecture",id:"architecture",level:2},{value:"API",id:"api",level:2},{value:"Examples",id:"examples",level:2},{value:"Querying the data",id:"querying-the-data",level:3},{value:"Installation",id:"installation",level:2}];function l(e){const t={a:"a",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...(0,s.M)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(t.h1,{id:"finops-database-handler",children:"finops-database-handler"}),"\n",(0,a.jsx)(t.p,{children:"This service offers a set of endpoints to connect to the Krateo's CrateDB instance and use notebooks to compute data starting from SQL queries."}),"\n",(0,a.jsxs)(t.p,{children:["This service requires ",(0,a.jsx)(t.a,{href:"https://github.com/crate/",children:"CrateDB"})," to be installed in the Kubernetes cluster. The CrateDB Kubernetes operator is recommended."]}),"\n",(0,a.jsxs)(t.p,{children:["For an in-depth look at the architecture and how to configure all the components, download the summary document ",(0,a.jsx)(t.a,{href:"https://github.com/krateoplatformops/finops-operator-exporter/blob/main/resources/Krateo_Composable_FinOps___Full.pdf",children:"here"}),"."]}),"\n",(0,a.jsx)(t.h2,{id:"summary",children:"Summary"}),"\n",(0,a.jsxs)(t.ol,{children:["\n",(0,a.jsx)(t.li,{children:(0,a.jsx)(t.a,{href:"#overview",children:"Overview"})}),"\n",(0,a.jsx)(t.li,{children:(0,a.jsx)(t.a,{href:"#architecture",children:"Architecture"})}),"\n",(0,a.jsx)(t.li,{children:(0,a.jsx)(t.a,{href:"#api",children:"API"})}),"\n",(0,a.jsx)(t.li,{children:(0,a.jsx)(t.a,{href:"#examples",children:"Examples"})}),"\n",(0,a.jsx)(t.li,{children:(0,a.jsx)(t.a,{href:"#Installation",children:"Installation"})}),"\n"]}),"\n",(0,a.jsx)(t.h2,{id:"overview",children:"Overview"}),"\n",(0,a.jsx)(t.p,{children:"This webservice acts as a proxy for all requests to the database, including the possibility of performing computations on the stored data. The structure is: the database requires username/password authentication for the HTTP endpoint. The password is stored in a Kubernetes secret. The RBAC to the secret should allow to filter who can access the webservice-database functionality. The handler calls the database HTTP endpoint to perform queries (both input and output). The result is returned by the endpoint."}),"\n",(0,a.jsx)(t.h2,{id:"architecture",children:"Architecture"}),"\n",(0,a.jsx)(t.p,{children:(0,a.jsx)(t.img,{alt:"Krateo Composable FinOps Database Handler",src:n(872).c+"",width:"669",height:"469"})}),"\n",(0,a.jsx)(t.h2,{id:"api",children:"API"}),"\n",(0,a.jsx)(t.p,{children:"All endpoints must have the basic auth header field compiled with the username and password of the database."}),"\n",(0,a.jsxs)(t.ul,{children:["\n",(0,a.jsxs)(t.li,{children:["POST ",(0,a.jsx)(t.code,{children:"/upload"}),": the webservice receives the data (divided into chunks) and directly uploads it into the specified table in the database"]}),"\n",(0,a.jsxs)(t.li,{children:["POST ",(0,a.jsx)(t.code,{children:"/compute/<compute_name>"}),": calls the specified compute notebook with the POST body data being the parameters required by the given algorithm, encoded in JSON as parameter_name=parameter_value"]}),"\n",(0,a.jsxs)(t.li,{children:["POST ",(0,a.jsx)(t.code,{children:"/compute/<compute_name>/upload"}),": uploads the specified notebook into the database with the name ",(0,a.jsx)(t.em,{children:"compute_name"})]}),"\n",(0,a.jsxs)(t.li,{children:["GET ",(0,a.jsx)(t.code,{children:"/compute/list"}),": lists all available compute notebooks"]}),"\n"]}),"\n",(0,a.jsx)(t.h2,{id:"examples",children:"Examples"}),"\n",(0,a.jsx)(t.p,{children:"Upload endpoint:"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{children:'curl -X POST -u <db-user>:<db-password> http://finops-database-handler.finops:8088/upload?table=<table_name>&type=<cost|resource> -d "<metrics>"\n'})}),"\n",(0,a.jsx)(t.p,{children:"Compute endpoint:"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{children:'curl -X POST -u <db-user>:<db-password> http://finops-database-handler.finops:8088/compute/cyclic \\\n    --header "Content-Type: application/json" \\\n    --data \'{"table_name":"testfocus_res"}\'\n'})}),"\n",(0,a.jsx)(t.p,{children:"Compute endpoint upload:"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{children:'curl -X POST -u <db-user>:<db-password> http://finops-database-handler.finops:8088/compute/cyclic/upload --data-binary "@cyclic.py"\n'})}),"\n",(0,a.jsxs)(t.p,{children:["For a notebook example, see ",(0,a.jsx)(t.code,{children:"./notebook_samples/cyclic.py"})]}),"\n",(0,a.jsx)(t.p,{children:"Compute endpoint list:"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{children:"curl -u <db-user>:<db-password> http://finops-database-handler.finops:8088/compute/list\n"})}),"\n",(0,a.jsx)(t.h3,{id:"querying-the-data",children:"Querying the data"}),"\n",(0,a.jsx)(t.p,{children:"The Tags in the CSV data read by the exporters need to be in the following format::"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{children:'{"CostCenter": "1234","Cost department": "Marketing","env": "prod","org": "trey","Project": "Foo"}\n'})}),"\n",(0,a.jsx)(t.p,{children:"If this formatting is not used, the finops-database-handler will not insert the data into the database.\nTo query the data using the information present inside the tags, you can use a query like this:"}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-sql",children:"SELECT resourceid, tags['value']\nFROM \"doc\".\"focus_table\"\nWHERE 'CostAllocationTest' like any(tags['key']) or 'Sameer' like any(tags['value'])\n"})}),"\n",(0,a.jsx)(t.h2,{id:"installation",children:"Installation"}),"\n",(0,a.jsxs)(t.p,{children:["The webservice can be installed through the ",(0,a.jsx)(t.a,{href:"https://github.com/krateoplatformops/finops-database-handler-chart",children:"HELM chart"}),":"]}),"\n",(0,a.jsx)(t.pre,{children:(0,a.jsx)(t.code,{className:"language-sh",children:"helm repo add krateo https://charts.krateo.io\nhelm repo update krateo\nhelm install finops-database-handler krateo/finops-database-handler\n"})}),"\n",(0,a.jsxs)(t.p,{children:["You need to configure the environment variables ",(0,a.jsx)(t.code,{children:"CRATE_HOST"})," and ",(0,a.jsx)(t.code,{children:"CRATE_PORT"})," in the HELM chart of the webservice to connect to the database on the HTTP endpoint of CrateDB."]})]})}function h(e={}){const{wrapper:t}={...(0,s.M)(),...e.components};return t?(0,a.jsx)(t,{...e,children:(0,a.jsx)(l,{...e})}):l(e)}},872:(e,t,n)=>{n.d(t,{c:()=>a});const a=n.p+"assets/images/finops-database-handler-architecture-23ed9a6d00ff995d39f8aae3bc694164.png"},2172:(e,t,n)=>{n.d(t,{I:()=>i,M:()=>o});var a=n(1504);const s={},r=a.createContext(s);function o(e){const t=a.useContext(r);return a.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function i(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:o(e.components),a.createElement(r.Provider,{value:t},e.children)}}}]);