const starterCards = [
{id:"frog",title:"Pixel frog",text:"He looks like he has just discovered taxation.",image:"https://images.unsplash.com/photo-1496070242169-b672c576566b?auto=format&fit=crop&w=1200&q=80",kind:"image"},
{id:"thought",title:"What if houses remembered?",text:"What if every house quietly kept a memory of everybody who had ever lived there?",image:"",kind:"text"},
{id:"sky",title:"Tonight’s sky",text:"A cold, clear evening. One of those nights that feels much bigger than it looks.",image:"https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=1200&q=80",kind:"image"},
{id:"small-idea",title:"A small idea",text:"Make something. Put it somewhere. Let somebody else find it.",image:"",kind:"text"},
{id:"mushroom",title:"Found growing",text:"Tiny things count too.",image:"https://images.unsplash.com/photo-1504545102780-26774c1bb073?auto=format&fit=crop&w=1200&q=80",kind:"image"},
{id:"story",title:"The five-minute story",text:"A train stopped at a station that wasn’t on any map. Everyone got off except the person who had been waiting for it.",image:"",kind:"text"}
];
const grid=document.querySelector("#cardGrid"),template=document.querySelector("#cardTemplate"),composer=document.querySelector("#composer"),form=document.querySelector("#composerForm"),filterButtons=[...document.querySelectorAll(".filter")];
let stored=JSON.parse(localStorage.getItem("speckled-mushroom-cards")||"[]");
let cards=[...stored,...starterCards],currentFilter="all",editingId=null;
function save(){localStorage.setItem("speckled-mushroom-cards",JSON.stringify(stored))}
function isMine(card){return stored.some(x=>x.id===card.id)}
function render(){
 grid.innerHTML="";
 cards.filter(c=>currentFilter==="all"||c.kind===currentFilter).forEach(card=>{
  const node=template.content.cloneNode(true),article=node.querySelector(".card"),imgWrap=node.querySelector(".card-image-wrap"),img=node.querySelector(".card-image");
  node.querySelector(".card-title").textContent=card.title;node.querySelector(".card-text").textContent=card.text||"";node.querySelector(".kind").textContent=card.kind==="image"?"Picture":"Words";
  if(card.image){article.classList.add("has-image");img.src=card.image;img.alt=card.title}else imgWrap.remove();
  const edit=node.querySelector(".edit-btn"),del=node.querySelector(".delete-btn"),share=node.querySelector(".actual-share");
  if(!isMine(card)){edit.remove();del.remove()} else {
   edit.addEventListener("click",()=>openEdit(card));
   del.addEventListener("click",()=>{if(confirm("Delete this Wiggle? This cannot be undone.")){stored=stored.filter(x=>x.id!==card.id);save();cards=[...stored,...starterCards];render()}});
  }
  share.addEventListener("click",async()=>{const data={title:card.title,text:card.text||card.title,url:location.origin+location.pathname+"#"+card.id};try{if(navigator.share)await navigator.share(data);else{await navigator.clipboard.writeText(data.url);share.textContent="Copied";setTimeout(()=>share.textContent="Share",1200)}}catch{}});
  article.id=card.id;grid.appendChild(node);
 });
}
function openNew(){editingId=null;form.reset();document.querySelector("#composerEyebrow").textContent="NEW WIGGLE";document.querySelector("#composerHeading").textContent="Add a Wiggle";document.querySelector("#postCard").textContent="Post Wiggle";composer.showModal()}
function openEdit(card){editingId=card.id;document.querySelector("#cardTitle").value=card.title;document.querySelector("#cardText").value=card.text||"";document.querySelector("#cardImage").value=card.image||"";document.querySelector("#composerEyebrow").textContent="EDIT WIGGLE";document.querySelector("#composerHeading").textContent="Fix your Wiggle";document.querySelector("#postCard").textContent="Save changes";composer.showModal()}
document.querySelector("#openComposer").addEventListener("click",openNew);document.querySelector("#heroAdd").addEventListener("click",openNew);
filterButtons.forEach(btn=>btn.addEventListener("click",()=>{filterButtons.forEach(b=>b.classList.remove("active"));btn.classList.add("active");currentFilter=btn.dataset.filter;render()}));
form.addEventListener("submit",event=>{
 const submitter=event.submitter;if(!submitter||submitter.value==="cancel")return;event.preventDefault();
 const title=document.querySelector("#cardTitle").value.trim(),text=document.querySelector("#cardText").value.trim(),image=document.querySelector("#cardImage").value.trim();if(!title)return;
 if(editingId){const i=stored.findIndex(x=>x.id===editingId);if(i>=0)stored[i]={...stored[i],title,text,image,kind:image?"image":"text"}}
 else stored.unshift({id:"wiggle-"+Date.now(),title,text,image,kind:image?"image":"text"});
 save();cards=[...stored,...starterCards];const target=editingId||stored[0].id;editingId=null;form.reset();composer.close();currentFilter="all";filterButtons.forEach((b,i)=>b.classList.toggle("active",i===0));render();setTimeout(()=>document.getElementById(target)?.scrollIntoView({behavior:"smooth",block:"center"}),50)
});
composer.addEventListener("close",()=>{editingId=null;form.reset()});
render();