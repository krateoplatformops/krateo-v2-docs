"use strict";(self.webpackChunkkrateo_v_2_docs=self.webpackChunkkrateo_v_2_docs||[]).push([[440],{8104:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>u,contentTitle:()=>i,default:()=>p,frontMatter:()=>o,metadata:()=>c,toc:()=>d});var n=a(7624),r=a(2172),s=a(1268),l=a(5388);const o={description:"Learn how to install Krateo PlatformOps using this step-by-step guide",sidebar_label:"Installing Krateo PlatformOps"},i="Installing Krateo PlatformOps",c={id:"how-to-guides/installing-krateo",title:"Installing Krateo PlatformOps",description:"Learn how to install Krateo PlatformOps using this step-by-step guide",source:"@site/docs/30-how-to-guides/10-installing-krateo.md",sourceDirName:"30-how-to-guides",slug:"/how-to-guides/installing-krateo",permalink:"/how-to-guides/installing-krateo",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:10,frontMatter:{description:"Learn how to install Krateo PlatformOps using this step-by-step guide",sidebar_label:"Installing Krateo PlatformOps"},sidebar:"tutorialSidebar",previous:{title:"Krateo Composable FinOps",permalink:"/key-concepts/kcf"},next:{title:"Migrating Krateo PlatformOps Composition from v1 to v2",permalink:"/how-to-guides/migrating-from-composition-to-helm"}},u={},d=[{value:"Basic Installation",id:"basic-installation",level:2},{value:"Advanced Installation",id:"advanced-installation",level:2}];function h(e){const t={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...(0,r.M)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.h1,{id:"installing-krateo-platformops",children:"Installing Krateo PlatformOps"}),"\n",(0,n.jsx)(t.h2,{id:"basic-installation",children:"Basic Installation"}),"\n",(0,n.jsx)(t.p,{children:"Installing Krateo with default configuration is quick and easy."}),"\n",(0,n.jsx)(t.p,{children:"You will need:"}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.a,{href:"https://helm.sh/docs/",children:"Helm"}),": These instructions were tested with v3.13.1."]}),"\n",(0,n.jsx)(t.li,{children:"A Kubernetes cluster."}),"\n"]}),"\n",(0,n.jsx)(t.admonition,{type:"note",children:(0,n.jsx)(t.p,{children:"Krateo PlatformOps installer is a flexible workflow engine that executes sequential steps. The installer-chart is a helper that provider already baked configurations for Krateo PlatformOps. It is however possible to implement a custom installer."})}),"\n",(0,n.jsxs)(s.c,{groupId:"local-cluster-start",children:[(0,n.jsxs)(l.c,{value:"kind",label:"kind",children:[(0,n.jsxs)(t.p,{children:["If you have any Docker-compatible container runtime installed (including native\nDocker, Docker Desktop, or OrbStack), you can easily launch a disposable cluster\njust for this quickstart using\n",(0,n.jsx)(t.a,{href:"https://kind.sigs.k8s.io/#installation-and-usage",children:"kind"}),"."]}),(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-shell",children:"helm repo add krateo https://charts.krateo.io\nhelm repo update krateo\n\nkind create cluster \\\n  --wait 120s \\\n  --config - <<EOF\nkind: Cluster\napiVersion: kind.x-k8s.io/v1alpha4\nname: krateo-quickstart\nnodes:\n- role: control-plane\n- role: worker\n  extraPortMappings:\n  - containerPort: 30080 # Krateo Portal\n    hostPort: 30080\n  - containerPort: 30081 # Krateo BFF\n    hostPort: 30081\n  - containerPort: 30082 # Krateo AuthN Service\n    hostPort: 30082\n  - containerPort: 30443 # Krateo Gateway\n    hostPort: 30443\n  - containerPort: 31180 # Krateo FireworksApp Frontend\n    hostPort: 31180\n  - containerPort: 31443 # vCluster API Server Port\n    hostPort: 31443\nnetworking:\n  # By default the API server listens on a random open port.\n  # You may choose a specific port but probably don't need to in most cases.\n  # Using a random port makes it easier to spin up multiple clusters.\n  apiServerPort: 6443\nEOF\n\nhelm upgrade installer installer \\\n  --repo https://charts.krateo.io \\\n  --namespace krateo-system \\\n  --create-namespace \\\n  --install \\\n  --wait\n"})}),(0,n.jsx)(t.admonition,{type:"info",children:(0,n.jsx)(t.p,{children:"While this option is a bit more complex than using Docker Desktop or OrbStack\ndirectly, it offers the advantage of being fully-disposable. If your cluster\nreaches a state you are dissatisfied with, you can simply destroy it and\nlaunch a new one."})}),(0,n.jsx)(t.p,{children:"At the end of this process:"}),(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsxs)(t.li,{children:["The Krateo Composable Portal will be accessible at ",(0,n.jsx)(t.a,{href:"http://localhost:30080",children:"localhost:30080"}),"."]}),"\n"]})]}),(0,n.jsxs)(l.c,{value:"loadbalancer-ip",label:"LoadBalancer with external IP",children:[(0,n.jsx)(t.p,{children:"Krateo PlatformOps can be exposed via LoadBalancer service type that exposes an IP."}),(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-shell",children:"helm repo add krateo https://charts.krateo.io\nhelm repo update krateo\n\nhelm upgrade installer installer \\\n  --repo https://charts.krateo.io \\\n  --namespace krateo-system \\\n  --create-namespace \\\n  --set krateoplatformops.service.type=LoadBalancer \\\n  --set krateoplatformops.service.externalIpAvailable=true \\\n  --install \\\n  --wait\n"})}),(0,n.jsx)(t.p,{children:"The following command will install Krateo with default configuration and a user-specified admin password:"}),(0,n.jsxs)(t.admonition,{type:"info",children:[(0,n.jsx)(t.p,{children:"Default values deploy Krateo exposing services via LoadBalancer:"}),(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsx)(t.li,{children:"8080 - Krateo Frontend"}),"\n",(0,n.jsx)(t.li,{children:"8081 - Krateo BFF"}),"\n",(0,n.jsx)(t.li,{children:"8082 - Krateo AuthN Service"}),"\n",(0,n.jsx)(t.li,{children:"8443 - Krateo Gateway"}),"\n",(0,n.jsx)(t.li,{children:"443 - vCluster API Server Port"}),"\n"]})]}),(0,n.jsx)(t.p,{children:"At the end of this process:"}),(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsx)(t.li,{children:"Find the Krateo Composable Portal IP:"}),"\n"]}),(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-shell",children:"kubectl get svc krateo-frontend-x-krateo-system-x-vcluster-k8s -n krateo-system  -o=jsonpath='{.status.loadBalancer.ingress[0].ip}'\n"})}),(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsx)(t.li,{children:"The Krateo Composable Portal will be accessible at previous IP at port 8080."}),"\n"]})]}),(0,n.jsxs)(l.c,{value:"loadbalancer-hostname",label:"LoadBalancer with external hostname",children:[(0,n.jsx)(t.p,{children:"Krateo PlatformOps can be exposed via LoadBalancer service type that exposes a hostname."}),(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-shell",children:"helm repo add krateo https://charts.krateo.io\nhelm repo update krateo\n\nhelm upgrade installer installer \\\n  --repo https://charts.krateo.io \\\n  --namespace krateo-system \\\n  --create-namespace \\\n  --set krateoplatformops.service.type=LoadBalancer \\\n  --set krateoplatformops.service.externalIpAvailable=false \\\n  --install \\\n  --wait\n"})}),(0,n.jsx)(t.p,{children:"The following command will install Krateo with default configuration and a user-specified admin password:"}),(0,n.jsxs)(t.admonition,{type:"info",children:[(0,n.jsx)(t.p,{children:"Default values deploy Krateo exposing services via LoadBalancer:"}),(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsx)(t.li,{children:"8080 - Krateo Frontend"}),"\n",(0,n.jsx)(t.li,{children:"8081 - Krateo BFF"}),"\n",(0,n.jsx)(t.li,{children:"8082 - Krateo AuthN Service"}),"\n",(0,n.jsx)(t.li,{children:"8443 - Krateo Gateway"}),"\n",(0,n.jsx)(t.li,{children:"443 - vCluster API Server Port"}),"\n"]})]}),(0,n.jsx)(t.p,{children:"At the end of this process:"}),(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsx)(t.li,{children:"Find the Krateo Composable Portal IP:"}),"\n"]}),(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-shell",children:"kubectl get svc krateo-frontend-x-krateo-system-x-vcluster-k8s -n krateo-system  -o=jsonpath='{.status.loadBalancer.ingress[0].hostname}'\n"})}),(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsx)(t.li,{children:"The Krateo Composable Portal will be accessible at previous IP at port 8080."}),"\n"]})]})]}),"\n",(0,n.jsx)(t.admonition,{type:"info",children:(0,n.jsxs)(t.p,{children:["Krateo PlatformOps requires access to Kubernetes CertificateAuthority certificate and key in order to generate certificates for logged users.\nFor this reason we provide with the installer the default installation of vCluster (",(0,n.jsx)(t.a,{href:"https://github.com/loft-sh/vcluster",children:"https://github.com/loft-sh/vcluster"}),") in order to provide a sandboxed installation of Krateo PlatformOps."]})}),"\n",(0,n.jsx)(t.admonition,{type:"info",children:(0,n.jsxs)(t.p,{children:["The installer by default deploys a starter-pack with example to immediately start to play with Krateo PlatformOps. The starter-pack is available here: ",(0,n.jsx)(t.a,{href:"https://github.com/krateoplatformops/installer-starter-pack",children:"https://github.com/krateoplatformops/installer-starter-pack"}),"."]})}),"\n",(0,n.jsx)(t.p,{children:"Wait until Krateo frontend is running:"}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-shell",children:"kubectl wait --for=condition=Ready $(kubectl get pods --field-selector=status.phase!=Succeeded,status.phase!=Failed --output=name -n krateo-system | grep '^pod/krateo-frontend') -n krateo-system\n\nkubectl wait krateoplatformops vcluster --for condition=Ready=True --timeout=300s --namespace krateo-system\n\nkubectl wait deployment vcluster-k8s --for condition=Available=True --timeout=300s --namespace krateo-system\n\ncurl -L -o vcluster \"https://github.com/loft-sh/vcluster/releases/latest/download/vcluster-linux-amd64\" && chmod +x vcluster\n./vcluster connect vcluster-k8s\n\nkubectl wait krateoplatformops krateo --for condition=Ready=True --timeout=300s --namespace krateo-system\n"})}),"\n",(0,n.jsx)(t.h2,{id:"advanced-installation",children:"Advanced Installation"}),"\n","\n","\n",(0,n.jsxs)(s.c,{groupId:"advanced-installation",children:[(0,n.jsxs)(l.c,{value:"disable",label:"Disable starter-pack",children:[(0,n.jsx)(t.p,{children:"If you're not interested in the Krateo PlatformOps starter-pack, you can disable this option and you'll get a deployment without examples."}),(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-shell",children:"helm install installer krateo/installer --create-namespace -n krateo-system --set krateoplatformops.init.service=LoadBalancer --wait\n"})})]}),(0,n.jsxs)(l.c,{value:"custom",label:"Custom",children:[(0,n.jsxs)(t.p,{children:["Krateo PlatformOps installer can be configured with a custom workflow. You can find two examples: ",(0,n.jsx)(t.a,{href:"https://github.com/krateoplatformops/installer-chart/blob/main/chart/templates/krateo-installer.yaml",children:"https://github.com/krateoplatformops/installer-chart/blob/main/chart/templates/krateo-installer.yaml"})," and ",(0,n.jsx)(t.a,{href:"https://github.com/krateoplatformops/installer-chart/blob/main/chart/templates/vcluster-installer.yaml",children:"https://github.com/krateoplatformops/installer-chart/blob/main/chart/templates/vcluster-installer.yaml"}),"."]}),(0,n.jsxs)(t.ol,{children:["\n",(0,n.jsxs)(t.li,{children:["\n",(0,n.jsxs)(t.p,{children:["Extract the default values from the Helm chart and save it to a convenient\nlocation. In the example below, we save it to ",(0,n.jsx)(t.code,{children:"~/krateo-values.yaml"})]}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-shell",children:"helm inspect values krateo/installer > krateo-values.yaml\n"})}),"\n"]}),"\n",(0,n.jsxs)(t.li,{children:["\n",(0,n.jsx)(t.p,{children:"Edit the values."}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-shell",children:'krateoplatformops:\n  custom:\n    enabled: true\n    values:\n    apiVersion: krateo.io/v1alpha1\n      kind: KrateoPlatformOps\n      metadata:\n      annotations:\n        "krateo.io/connector-verbose": "true"\n      name: krateo\n      namespace: krateo-system\n      spec:\n      steps:\n        - id: extract-vcluster-addr\n          type: var\n          with:\n            name: KUBECONFIG_SERVER_URL\n            valueFrom:\n              apiVersion: v1\n              kind: ConfigMap\n              metadata:\n                name: vcluster-k8s-cm\n              selector: .data.KUBECONFIG_SERVER_URL\n'})}),"\n"]}),"\n",(0,n.jsxs)(t.li,{children:["\n",(0,n.jsx)(t.p,{children:"Proceed with installation, using your modified values:"}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-shell",children:"helm install installer krateo/installer --create-namespace -n krateo-system  --values krateo-values.yaml --wait\n"})}),"\n"]}),"\n"]})]})]}),"\n",(0,n.jsx)(t.p,{children:"Wait until Krateo frontend is running:"}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-shell",children:"kubectl wait --for=condition=Ready $(kubectl get pods --field-selector=status.phase!=Succeeded,status.phase!=Failed --output=name -n krateo-system | grep '^pod/krateo-frontend') -n krateo-system\n\nkubectl wait krateoplatformops vcluster --for condition=Ready=True --timeout=300s --namespace krateo-system\n\nkubectl wait deployment vcluster-k8s --for condition=Available=True --timeout=300s --namespace krateo-system\n\ncurl -L -o vcluster \"https://github.com/loft-sh/vcluster/releases/latest/download/vcluster-linux-amd64\" && chmod +x vcluster\n./vcluster connect vcluster-k8s\n\nkubectl wait krateoplatformops krateo --for condition=Ready=True --timeout=300s --namespace krateo-system\n"})})]})}function p(e={}){const{wrapper:t}={...(0,r.M)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(h,{...e})}):h(e)}},5388:(e,t,a)=>{a.d(t,{c:()=>l});a(1504);var n=a(5456);const r={tabItem:"tabItem_Ymn6"};var s=a(7624);function l(e){let{children:t,hidden:a,className:l}=e;return(0,s.jsx)("div",{role:"tabpanel",className:(0,n.c)(r.tabItem,l),hidden:a,children:t})}},1268:(e,t,a)=>{a.d(t,{c:()=>y});var n=a(1504),r=a(5456),s=a(3943),l=a(5592),o=a(5288),i=a(632),c=a(7128),u=a(1148);function d(e){return n.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,n.isValidElement)(e)&&function(e){const{props:t}=e;return!!t&&"object"==typeof t&&"value"in t}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function h(e){const{values:t,children:a}=e;return(0,n.useMemo)((()=>{const e=t??function(e){return d(e).map((e=>{let{props:{value:t,label:a,attributes:n,default:r}}=e;return{value:t,label:a,attributes:n,default:r}}))}(a);return function(e){const t=(0,c.w)(e,((e,t)=>e.value===t.value));if(t.length>0)throw new Error(`Docusaurus error: Duplicate values "${t.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[t,a])}function p(e){let{value:t,tabValues:a}=e;return a.some((e=>e.value===t))}function m(e){let{queryString:t=!1,groupId:a}=e;const r=(0,l.Uz)(),s=function(e){let{queryString:t=!1,groupId:a}=e;if("string"==typeof t)return t;if(!1===t)return null;if(!0===t&&!a)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return a??null}({queryString:t,groupId:a});return[(0,i._M)(s),(0,n.useCallback)((e=>{if(!s)return;const t=new URLSearchParams(r.location.search);t.set(s,e),r.replace({...r.location,search:t.toString()})}),[s,r])]}function f(e){const{defaultValue:t,queryString:a=!1,groupId:r}=e,s=h(e),[l,i]=(0,n.useState)((()=>function(e){let{defaultValue:t,tabValues:a}=e;if(0===a.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(t){if(!p({value:t,tabValues:a}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${t}" but none of its children has the corresponding value. Available values are: ${a.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return t}const n=a.find((e=>e.default))??a[0];if(!n)throw new Error("Unexpected error: 0 tabValues");return n.value}({defaultValue:t,tabValues:s}))),[c,d]=m({queryString:a,groupId:r}),[f,b]=function(e){let{groupId:t}=e;const a=function(e){return e?`docusaurus.tab.${e}`:null}(t),[r,s]=(0,u.IN)(a);return[r,(0,n.useCallback)((e=>{a&&s.set(e)}),[a,s])]}({groupId:r}),v=(()=>{const e=c??f;return p({value:e,tabValues:s})?e:null})();(0,o.c)((()=>{v&&i(v)}),[v]);return{selectedValue:l,selectValue:(0,n.useCallback)((e=>{if(!p({value:e,tabValues:s}))throw new Error(`Can't select invalid tab value=${e}`);i(e),d(e),b(e)}),[d,b,s]),tabValues:s}}var b=a(3664);const v={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var x=a(7624);function k(e){let{className:t,block:a,selectedValue:n,selectValue:l,tabValues:o}=e;const i=[],{blockElementScrollPositionUntilNextRender:c}=(0,s.MV)(),u=e=>{const t=e.currentTarget,a=i.indexOf(t),r=o[a].value;r!==n&&(c(t),l(r))},d=e=>{let t=null;switch(e.key){case"Enter":u(e);break;case"ArrowRight":{const a=i.indexOf(e.currentTarget)+1;t=i[a]??i[0];break}case"ArrowLeft":{const a=i.indexOf(e.currentTarget)-1;t=i[a]??i[i.length-1];break}}t?.focus()};return(0,x.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,r.c)("tabs",{"tabs--block":a},t),children:o.map((e=>{let{value:t,label:a,attributes:s}=e;return(0,x.jsx)("li",{role:"tab",tabIndex:n===t?0:-1,"aria-selected":n===t,ref:e=>i.push(e),onKeyDown:d,onClick:u,...s,className:(0,r.c)("tabs__item",v.tabItem,s?.className,{"tabs__item--active":n===t}),children:a??t},t)}))})}function g(e){let{lazy:t,children:a,selectedValue:r}=e;const s=(Array.isArray(a)?a:[a]).filter(Boolean);if(t){const e=s.find((e=>e.props.value===r));return e?(0,n.cloneElement)(e,{className:"margin-top--md"}):null}return(0,x.jsx)("div",{className:"margin-top--md",children:s.map(((e,t)=>(0,n.cloneElement)(e,{key:t,hidden:e.props.value!==r})))})}function j(e){const t=f(e);return(0,x.jsxs)("div",{className:(0,r.c)("tabs-container",v.tabList),children:[(0,x.jsx)(k,{...e,...t}),(0,x.jsx)(g,{...e,...t})]})}function y(e){const t=(0,b.c)();return(0,x.jsx)(j,{...e,children:d(e.children)},String(t))}},2172:(e,t,a)=>{a.d(t,{I:()=>o,M:()=>l});var n=a(1504);const r={},s=n.createContext(r);function l(e){const t=n.useContext(s);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function o(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:l(e.components),n.createElement(s.Provider,{value:t},e.children)}}}]);