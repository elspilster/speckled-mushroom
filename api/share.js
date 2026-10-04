const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.POSTGRES_URL);
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
module.exports=async(req,res)=>{try{
 const id=String(req.query.id||'').slice(0,100);
 const rows=await sql.query('SELECT id,title,body,image,author,kind,url AS source_url FROM wiggles WHERE id=$1 LIMIT 1',[id]);
 if(!rows.length)return res.redirect(302,'/');
 const w=rows[0], base='https://speckled-mushroom.vercel.app', url=base+'/wiggle/'+encodeURIComponent(w.id);
 const title=esc(w.title+' — Speckled Mushroom'), desc=esc((w.body||'A Wiggle on Speckled Mushroom').slice(0,240)), img=w.image&&/^https?:\/\//i.test(w.image)?esc(w.image):'';
 res.setHeader('Content-Type','text/html; charset=utf-8');
 res.setHeader('Cache-Control','public, max-age=60, s-maxage=300, stale-while-revalidate=86400');
 res.setHeader('X-Robots-Tag','index, follow');
 return res.status(200).send(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><meta name="description" content="${desc}"><meta property="og:type" content="article"><meta property="og:site_name" content="Speckled Mushroom"><meta property="og:title" content="${title}"><meta property="og:description" content="${desc}"><meta property="og:url" content="${url}">${img?`<meta property="og:image" content="${img}">`:''}<meta name="twitter:card" content="${img?'summary_large_image':'summary'}"><meta name="twitter:title" content="${title}"><meta name="twitter:description" content="${desc}">${img?`<meta name="twitter:image" content="${img}">`:''}<script>location.replace('/#'+${JSON.stringify(w.id)})</script></head><body><p><a href="/#${esc(w.id)}">Open this Wiggle on Speckled Mushroom</a></p></body></html>`);
}catch(e){console.error(e);return res.redirect(302,'/');}};