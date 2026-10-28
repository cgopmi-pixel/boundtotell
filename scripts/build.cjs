const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),dist=path.join(root,'dist');
// The review ZIP stores the unchanged assets once, beside the editable source.
for(const dir of ['assets','previous']){
 const local=path.join(root,'public',dir),bundled=path.resolve(root,'../website',dir);
 if(!fs.existsSync(local)&&fs.existsSync(bundled))fs.cpSync(bundled,local,{recursive:true});
}
const copy=JSON.parse(fs.readFileSync(path.join(root,'content/site-copy.json'),'utf8'));
const data=JSON.parse(fs.readFileSync(path.join(root,'content/packages.json'),'utf8'));
const render=require(path.join(root,'src/render.cjs'));
fs.rmSync(dist,{recursive:true,force:true});fs.cpSync(path.join(root,'public'),dist,{recursive:true});
for(const [file,html] of [['index.html',render.home(copy,data)],['packages.html',render.packagePage(data)],['contact.html',render.contact()],['samples.html',render.samples(copy)],['faqs.html',render.faqs(copy)]])fs.writeFileSync(path.join(dist,file),html);
fs.writeFileSync(path.join(dist,'package-data.js'),'window.BTT_PACKAGES = '+JSON.stringify(data.packages.map(p=>({...p,inquiryEmail:render.email(p)})))+';\n');
console.log('Built all five pages, the printable comparison and preserved website in dist/. No deployment performed.');
