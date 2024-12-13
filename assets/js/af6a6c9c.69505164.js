"use strict";(self.webpackChunkkrateo_v_2_docs=self.webpackChunkkrateo_v_2_docs||[]).push([[576],{8672:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>s,default:()=>d,frontMatter:()=>o,metadata:()=>a,toc:()=>l});var r=t(7624),i=t(2172);const o={},s="finops-operator-focus",a={id:"key-concepts/kcf/finops-operator-focus",title:"finops-operator-focus",description:"This repository is part of the wider exporting architecture for the Krateo Composable FinOps and manages custom costs in the FOCUS format.",source:"@site/docs/20-key-concepts/30-kcf/30-finops-operator-focus.md",sourceDirName:"20-key-concepts/30-kcf",slug:"/key-concepts/kcf/finops-operator-focus",permalink:"/key-concepts/kcf/finops-operator-focus",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:30,frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"finops-operator-scraper",permalink:"/key-concepts/kcf/finops-operator-scraper"},next:{title:"finops-database-handler",permalink:"/key-concepts/kcf/finops-database-handler"}},c={},l=[{value:"Summary",id:"summary",level:2},{value:"Overview",id:"overview",level:2},{value:"Architecture",id:"architecture",level:2},{value:"Examples",id:"examples",level:2},{value:"Configuration",id:"configuration",level:2},{value:"Prerequisites",id:"prerequisites",level:3},{value:"Dependencies",id:"dependencies",level:3},{value:"Configuration",id:"configuration-1",level:3},{value:"Installation with HELM",id:"installation-with-helm",level:3}];function p(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...(0,i.M)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.h1,{id:"finops-operator-focus",children:"finops-operator-focus"}),"\n",(0,r.jsx)(n.p,{children:"This repository is part of the wider exporting architecture for the Krateo Composable FinOps and manages custom costs in the FOCUS format."}),"\n",(0,r.jsx)(n.h2,{id:"summary",children:"Summary"}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.a,{href:"#overview",children:"Overview"})}),"\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.a,{href:"#architecture",children:"Architecture"})}),"\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.a,{href:"#examples",children:"Examples"})}),"\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.a,{href:"#configuration",children:"Configuration"})}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"overview",children:"Overview"}),"\n",(0,r.jsxs)(n.p,{children:["This component is tasked with the creation of a generic exporting pipeline, according to the description given in a Custom Resource (CR). After the creation of the CR, the operator reads the FOCUS fields and creates a new resource for the FinOps Operator Exporter, pointing the ",(0,r.jsx)(n.code,{children:"url"})," field at the Kubernetes API server and the FOCUS custom resource. This allow to create an exporter that reads directly the custom resource. The FinOps Operator Exporter then continues with the creation of the all the required resources, such as deployments, configMaps, services, and the CR for the FinOps Operator Scraper that manages scraping."]}),"\n",(0,r.jsx)(n.h2,{id:"architecture",children:"Architecture"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.img,{alt:"Krateo Composable FinOps Operator FOCUS",src:t(5524).c+"",width:"1968",height:"683"})}),"\n",(0,r.jsx)(n.h2,{id:"examples",children:"Examples"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:"apiVersion: finops.krateo.io/v1\nkind: DatabaseConfig\nmetadata:\n  name: # DatabaseConfig name\n  namespace: # DatabaseConfig namespace\nspec:\n  host: # host name for the database\n  token: # object reference to secret with key bearer-token\n    name: # secret name\n    namespace: # secret namespace\n  clusterName: # generic compute cluster name\n  notebookPath: # path to the notebook \n---\napiVersion: finops.krateo.io/v1\nkind: FocusConfig\nmetadata:\n  name: # FocusConfig name\n  namespace: # FocusConfig namespace\nspec:\n  scraperConfig: # same fields as krateoplatformops/finops-prometheus-scraper-generic\n    tableName: # tableName in the database to upload the data to\n    # url: # path to the exporter, optional (if missing, its taken from the exporter)\n    pollingIntervalHours: # int\n    scraperDatabaseConfigRef: # See above kind DatabaseConfig\n      name: # name of the databaseConfigRef CR \n      namespace: # namespace of the databaseConfigRef CR\n  focusSpec: # See FOCUS for field details\n    availabilityZone:\n    billedCost:\n    billingAccountId:\n    billingAccountName:\n    billingCurrency:\n    billingPeriodEnd:\n    billingPeriodStart:\n    chargeCategory:\n    chargeClass:\n    chargeDescription:\n    chargeFrequency:\n    chargePeriodEnd:\n    chargePeriodStart:\n    commitmentDiscountCategory:\n    commitmentDiscountName:\n    commitmentDiscountStatus:\n    commitmentDiscountType:\n    commitmentDiscoutId:\n    consumedQuantity:\n    consumedUnit:\n    contractedCost:\n    contractedUnitCost:\n    effectiveCost:\n    invoiceIssuerName:\n    listCost:\n    listUnitPrice:\n    pricingCategory:\n    pricingQuantity:\n    pricingUnit:\n    providerName:\n    publisherName:\n    regionId:\n    regionName:\n    resourceId:\n    resourceName:\n    resourceType:\n    serviceCategory:\n    serviceName:\n    skuId:\n    skuPriceId:\n    subAccountId:\n    subAccountName:\n    tags:\n      - key:\n        value:\n"})}),"\n",(0,r.jsx)(n.h2,{id:"configuration",children:"Configuration"}),"\n",(0,r.jsx)(n.h3,{id:"prerequisites",children:"Prerequisites"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"go version v1.21.0+"}),"\n",(0,r.jsx)(n.li,{children:"docker version 17.03+."}),"\n",(0,r.jsx)(n.li,{children:"kubectl version v1.11.3+."}),"\n",(0,r.jsxs)(n.li,{children:["Access to a Kubernetes v1.30.0+ cluster: Kubernetes must have the ",(0,r.jsx)(n.code,{children:"CustomResourceFieldSelectors"})," feature gate enabled."]}),"\n"]}),"\n",(0,r.jsx)(n.h3,{id:"dependencies",children:"Dependencies"}),"\n",(0,r.jsx)(n.p,{children:"To run this repository in your Kubernetes cluster, you need to have the following images in the same container registry:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"finops-operator-exporter"}),"\n",(0,r.jsx)(n.li,{children:"finops-operator-scraper"}),"\n",(0,r.jsx)(n.li,{children:"finops-prometheus-exporter-generic"}),"\n",(0,r.jsx)(n.li,{children:"finops-prometheus-scraper-generic"}),"\n"]}),"\n",(0,r.jsx)(n.h3,{id:"configuration-1",children:"Configuration"}),"\n",(0,r.jsxs)(n.p,{children:['There is also the need to have an active Databricks cluster, with SQL warehouse and notebooks configured. Its login details must be placed in the database-config CR.\nTo start the exporting process, see the "config-sample.yaml" file. It includes the database-config CR.\nThe deployment of the operator needs a secret for the repository, called ',(0,r.jsx)(n.code,{children:"registry-credentials"})," in the namespace ",(0,r.jsx)(n.code,{children:"finops"}),"."]}),"\n",(0,r.jsxs)(n.p,{children:["The exporter container is created in the namespace of the CR. The exporter container looks for a secret in the CR namespace called ",(0,r.jsx)(n.code,{children:"registry-credentials-default"})]}),"\n",(0,r.jsxs)(n.p,{children:["Detailed information on FOCUS can be found at the ",(0,r.jsx)(n.a,{href:"https://focus.finops.org/#specification",children:"official website"}),"."]}),"\n",(0,r.jsx)(n.h3,{id:"installation-with-helm",children:"Installation with HELM"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-sh",children:"$ helm repo add krateo https://charts.krateo.io\n$ helm repo update krateo\n$ helm install finops-operator-focus krateo/finops-operator-focus\n"})})]})}function d(e={}){const{wrapper:n}={...(0,i.M)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(p,{...e})}):p(e)}},5524:(e,n,t)=>{t.d(n,{c:()=>r});const r=t.p+"assets/images/KCF-operator-focus-ebe118d9d2c2078723b2864590e48948.png"},2172:(e,n,t)=>{t.d(n,{I:()=>a,M:()=>s});var r=t(1504);const i={},o=r.createContext(i);function s(e){const n=r.useContext(o);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:s(e.components),r.createElement(o.Provider,{value:n},e.children)}}}]);