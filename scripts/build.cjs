const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),dist=path.join(root,'dist');
// The review ZIP stores the unchanged assets once, beside the editable source.
for(const dir of ['assets','previous']){
 const local=path.join(root,'public',dir),bundled=path.resolve(root,'../website',dir);
 if(!fs.existsSync(local)&&fs.existsSync(bundled))fs.cpSync(bundled,local,{recursive:true});
}
const copy=JSON.parse(fs.readFileSync(path.join(root,'content/site-copy.json'),'utf8'));
const data=JSON.parse(fs.readFileSync(path.join(root,'content/packages.json'),'utf8'));
const render=require(path.join(root,'src/render.cjs'));render.setSeo(copy.seo);
fs.rmSync(dist,{recursive:true,force:true});fs.cpSync(path.join(root,'public'),dist,{recursive:true});
fs.writeFileSync(path.join(dist,'package-data.js'),'window.BTT_PACKAGES = '+JSON.stringify(data.packages.map(p=>({...p,inquiryEmail:render.email(p)})))+';\n');
const crypto=require('node:crypto');
const ver=f=>{try{return crypto.createHash('sha1').update(fs.readFileSync(path.join(dist,f))).digest('hex').slice(0,8)}catch{return null}};
const bust=html=>html.replace(/(href|src)="\.\/([\w.-]+\.(?:css|js))"/g,(m,a,f)=>{const v=ver(f);return v?`${a}="./${f}?v=${v}"`:m;});
for(const [file,html] of [['index.html',render.home(copy,data)],['packages.html',render.packagePage(data)],['about.html',render.about(copy)],['contact.html',render.contact()],['samples.html',render.samples(copy)],['faqs.html',render.faqs(copy)]])fs.writeFileSync(path.join(dist,file),bust(html));
fs.writeFileSync(path.join(dist,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+['','packages.html','about.html','samples.html','faqs.html','contact.html'].map(u=>'  <url><loc>https://boundtotell.com/'+u+'</loc></url>').join('\n')+'\n</urlset>\n');
console.log('Built all six pages, the printable comparison and preserved website in dist/. No deployment performed.');
