(()=>{var e={};e.id=2520,e.ids=[2520],e.modules={62849:e=>{function t(e){var t=Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}t.keys=()=>[],t.resolve=t,t.id=62849,e.exports=t},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},14300:e=>{"use strict";e.exports=require("buffer")},6113:e=>{"use strict";e.exports=require("crypto")},82361:e=>{"use strict";e.exports=require("events")},41808:e=>{"use strict";e.exports=require("net")},72254:e=>{"use strict";e.exports=require("node:buffer")},92110:e=>{"use strict";e.exports=require("node:diagnostics_channel")},71017:e=>{"use strict";e.exports=require("path")},77282:e=>{"use strict";e.exports=require("process")},12781:e=>{"use strict";e.exports=require("stream")},71576:e=>{"use strict";e.exports=require("string_decoder")},39512:e=>{"use strict";e.exports=require("timers")},24404:e=>{"use strict";e.exports=require("tls")},57310:e=>{"use strict";e.exports=require("url")},73837:e=>{"use strict";e.exports=require("util")},59796:e=>{"use strict";e.exports=require("zlib")},69962:(e,t,r)=>{"use strict";r.r(t),r.d(t,{originalPathname:()=>w,patchFetch:()=>k,requestAsyncStorage:()=>m,routeModule:()=>f,serverHooks:()=>y,staticGenerationAsyncStorage:()=>S});var s={};r.r(s),r.d(s,{GET:()=>g,POST:()=>h,dynamic:()=>b});var a=r(43410),o=r(88716),i=r(60670),n=r(87070),c=r(73785);let d=require("fs");var u=r.n(d),p=r(71017),l=r.n(p);let b="force-dynamic";async function g(e){return x(e)}async function h(e){return x(e)}async function x(e){let t;let r=[];function s(e){r.push(`[${new Date().toISOString().slice(11,19)}] ${e}`)}s("Starting database seed / restore process...");let a=process.env.MYSQL_HOST||"127.0.0.1",o=parseInt(process.env.MYSQL_PORT||"3306"),i=process.env.MYSQL_USER||"root",d=process.env.MYSQL_PASSWORD||"",p=process.env.MYSQL_DATABASE||"ocean_lighting";s(`Target database: ${p} on ${a}:${o} (user: ${i})`);try{t=await c.createConnection({host:a,port:o,user:i,password:d,database:p,multipleStatements:!0,ssl:"127.0.0.1"!==a&&"localhost"!==a?{rejectUnauthorized:!1}:void 0}),s("✅ Database connection established successfully");let b="",g=l().join(process.cwd(),"database","full_production_backup.sql");if(u().existsSync(g))s(`Found local SQL dump at ${g}`),b=u().readFileSync(g,"utf8");else{s("Local SQL file not found on disk, fetching latest dump from GitHub repository...");let e=await fetch("https://raw.githubusercontent.com/zationlk/ocean/main/database/full_production_backup.sql",{cache:"no-store"});if(!e.ok)throw Error(`Failed to fetch SQL from GitHub: HTTP ${e.status} ${e.statusText}`);b=await e.text(),s(`Fetched ${Math.round(b.length/1024)} KB SQL dump from GitHub`)}if(!b||b.length<100)throw Error("SQL content is empty or invalid.");s("Executing SQL statements (creating tables & inserting rows)..."),await t.query(b),s("✅ SQL script executed with 0 errors");let[h]=await t.query("SELECT COUNT(*) as c FROM products"),[x]=await t.query("SELECT COUNT(*) as c FROM categories"),[f]=await t.query("SELECT COUNT(*) as c FROM brands"),[m]=await t.query("SELECT COUNT(*) as c FROM site_settings"),[S]=await t.query("SELECT COUNT(*) as c FROM testimonials"),y={products:h[0]?.c??0,categories:x[0]?.c??0,brands:f[0]?.c??0,siteSettings:m[0]?.c??0,testimonials:S[0]?.c??0};if(s("Summary of imported records:"),s(`   Products:      ${y.products}`),s(`   Categories:    ${y.categories}`),s(`   Brands:        ${y.brands}`),s(`   Site Settings: ${y.siteSettings}`),s(`   Testimonials:  ${y.testimonials}`),await t.end(),(e.headers.get("accept")||"").includes("text/html"))return new n.NextResponse(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Ocean Lighting — Database Seed Successful</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px 20px; }
    .card { max-width: 700px; margin: 0 auto; background: #1e293b; border-radius: 12px; padding: 32px; border: 1px solid #334155; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    h1 { color: #38bdf8; margin-top: 0; }
    .badge { display: inline-block; background: #065f46; color: #34d399; padding: 6px 14px; border-radius: 9999px; font-weight: bold; font-size: 14px; margin-bottom: 20px; }
    pre { background: #020617; color: #a5f3fc; padding: 18px; border-radius: 8px; font-size: 13px; line-height: 1.6; white-space: pre-wrap; border: 1px solid #1e293b; }
    .btn { display: inline-block; background: #2563eb; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; }
    .btn:hover { background: #1d4ed8; }
    .btn-site { background: #059669; margin-left: 10px; }
    .btn-site:hover { background: #047857; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">✅ Database Seeded Successfully</div>
    <h1>Ocean Lighting Database Ready!</h1>
    <pre>${r.join("\n")}</pre>
    <a class="btn" href="/admin/login">🔐 Go to Admin Login</a>
    <a class="btn btn-site" href="/">🏠 View Website Home</a>
  </div>
</body>
</html>`,{headers:{"Content-Type":"text/html; charset=utf-8"}});return n.NextResponse.json({success:!0,message:"Database seeded successfully",counts:y,logs:r})}catch(a){if(t)try{await t.end()}catch(e){}if(s(`❌ Error: ${a.message}`),(e.headers.get("accept")||"").includes("text/html"))return new n.NextResponse(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Ocean Lighting — Database Seed Error</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px 20px; }
    .card { max-width: 700px; margin: 0 auto; background: #1e293b; border-radius: 12px; padding: 32px; border: 1px solid #ef4444; }
    h1 { color: #f87171; margin-top: 0; }
    pre { background: #020617; color: #fca5a5; padding: 18px; border-radius: 8px; font-size: 13px; line-height: 1.6; white-space: pre-wrap; }
    .btn { display: inline-block; background: #2563eb; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Database Seed Error</h1>
    <p>Could not connect or execute seed on database <code>${p}</code>.</p>
    <pre>${r.join("\n")}

Stack:
${a.stack||a.message}</pre>
    <a class="btn" href="/">Return to Site</a>
  </div>
</body>
</html>`,{status:500,headers:{"Content-Type":"text/html; charset=utf-8"}});return n.NextResponse.json({success:!1,error:a.message,code:a.code||null,logs:r},{status:500})}}let f=new a.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/seed/route",pathname:"/api/seed",filename:"route",bundlePath:"app/api/seed/route"},resolvedPagePath:"C:\\xampp\\htdocs\\ocean\\ocean-lighting\\app\\api\\seed\\route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:m,staticGenerationAsyncStorage:S,serverHooks:y}=f,w="/api/seed/route";function k(){return(0,i.patchFetch)({serverHooks:y,staticGenerationAsyncStorage:S})}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[8948,8874,5972],()=>r(69962));module.exports=s})();