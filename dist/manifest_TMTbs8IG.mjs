import '@astrojs/internal-helpers/path';
import 'cookie';
import 'kleur/colors';
import 'string-width';
import 'html-escaper';
import 'clsx';
import './chunks/astro_cqkYRnFf.mjs';
import { compile } from 'path-to-regexp';

if (typeof process !== "undefined") {
  let proc = process;
  if ("argv" in proc && Array.isArray(proc.argv)) {
    if (proc.argv.includes("--verbose")) ; else if (proc.argv.includes("--silent")) ; else ;
  }
}

function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return "/" + segment.map((part) => {
      if (part.spread) {
        return `:${part.content.slice(3)}(.*)?`;
      } else if (part.dynamic) {
        return `:${part.content}`;
      } else {
        return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return toPath;
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    })
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  return {
    ...serializedManifest,
    assets,
    componentMetadata,
    clientDirectives,
    routes
  };
}

const manifest = deserializeManifest({"adapterName":"","routes":[{"file":"","links":[],"scripts":[{"type":"inline","value":"document.addEventListener(\"DOMContentLoaded\",function(){const s=document.getElementById(\"themeToggle\"),g=document.documentElement,h=document.getElementById(\"imsakTime\"),f=document.getElementById(\"iftarTime\"),k=document.getElementById(\"currentDateWithoutYear\"),I=document.getElementById(\"currentTime\"),E=document.getElementById(\"remainingToImsakContainer\"),y=document.getElementById(\"remainingToIftarContainer\"),D=document.getElementById(\"remainingToImsak\"),S=document.getElementById(\"remainingToIftar\"),c={\"2024-03-05\":{imsak:\"05:49\",iftar:\"19:13\"},\"2024-03-06\":{imsak:\"05:48\",iftar:\"19:14\"}},p=()=>{const t=g.classList.toggle(\"dark\")?\"dark\":\"light\";localStorage.setItem(\"theme\",t),s.textContent=t===\"dark\"?\"💡\":\"🌑\"},C=()=>{const t=localStorage.getItem(\"theme\")||(window.matchMedia(\"(prefers-color-scheme: dark)\").matches?\"dark\":\"light\");g.classList.toggle(\"dark\",t===\"dark\"),s.textContent=t===\"dark\"?\"💡\":\"🌑\"},l=()=>{const t=new Date,o=T(t),n=T(new Date(t.getTime()+864e5)),e=c[o]||{imsak:\"N/A\",iftar:\"N/A\"},{imsak:m,iftar:a}=t.getTime()>=i(t,e.iftar).getTime()&&c[n]||e;h.textContent=m,f.textContent=a,k.textContent=t.toLocaleDateString(\"tr-TR\",{weekday:\"long\",month:\"long\",day:\"numeric\"}),I.textContent=t.toLocaleTimeString(\"tr-TR\",{hour:\"2-digit\",minute:\"2-digit\"}),B(t,m,a,e,c[n]||e)},B=(t,o,n,e,m)=>{const a=i(t,n);let r=i(t,o);t>a&&(r=i(new Date(t.getTime()+864e5),m.imsak));const L=t<r?u(r-t):u(a-t),d=t>=r&&t<a;E.classList.toggle(\"hidden\",d),y.classList.toggle(\"hidden\",!d),(d?S:D).textContent=L},T=t=>t.toISOString().split(\"T\")[0],i=(t,o)=>{const[n,e]=o.split(\":\").map(Number);return new Date(t.getFullYear(),t.getMonth(),t.getDate(),n,e)},u=t=>{const o=Math.floor(t/36e5),n=Math.floor(t%(1e3*60*60)/(1e3*60)),e=Math.floor(t%(1e3*60)/1e3);return`${o.toString().padStart(2,\"0\")}:${n.toString().padStart(2,\"0\")}:${e.toString().padStart(2,\"0\")}`};s.addEventListener(\"click\",p),C(),l(),setInterval(l,1e3)});\n"}],"styles":[{"type":"external","src":"/_astro/index.wrlprwoZ.css"}],"routeData":{"route":"/","type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"site":"https://ramazan.app","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/Users/mdenesfe/Desktop/ramadanApp/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var i=t=>{let e=async()=>{await(await t())()};\"requestIdleCallback\"in window?window.requestIdleCallback(e):setTimeout(e,200)};(self.Astro||(self.Astro={})).idle=i;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var r=(i,c,s)=>{let n=async()=>{await(await i())()},t=new IntersectionObserver(e=>{for(let o of e)if(o.isIntersecting){t.disconnect(),n();break}});for(let e of s.children)t.observe(e)};(self.Astro||(self.Astro={})).visible=r;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000empty-middleware":"_empty-middleware.mjs","/src/pages/index.astro":"chunks/pages/index_Stq08lTt.mjs","\u0000@astrojs-manifest":"manifest_TMTbs8IG.mjs","/astro/hoisted.js?q=0":"_astro/hoisted.Je9Iq0Vw.js","astro:scripts/before-hydration.js":""},"assets":[]});

export { manifest };
