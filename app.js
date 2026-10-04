const starterCards = [
  {
    id: "frog",
    title: "Pixel frog",
    text: "He looks like he has just discovered taxation.",
    image: "https://images.unsplash.com/photo-1496070242169-b672c576566b?auto=format&fit=crop&w=1200&q=80",
    kind: "image"
  },
  {
    id: "thought",
    title: "What if houses remembered?",
    text: "What if every house quietly kept a memory of everybody who had ever lived there?",
    image: "",
    kind: "text"
  },
  {
    id: "sky",
    title: "Tonight’s sky",
    text: "A cold, clear evening. One of those nights that feels much bigger than it looks.",
    image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=1200&q=80",
    kind: "image"
  },
  {
    id: "small-idea",
    title: "A small idea",
    text: "Make something. Put it somewhere. Let somebody else find it.",
    image: "",
    kind: "text"
  },
  {
    id: "mushroom",
    title: "Found growing",
    text: "Tiny things count too.",
    image: "https://images.unsplash.com/photo-1504545102780-26774c1bb073?auto=format&fit=crop&w=1200&q=80",
    kind: "image"
  },
  {
    id: "story",
    title: "The five-minute story",
    text: "A train stopped at a station that wasn’t on any map. Everyone got off except the person who had been waiting for it.",
    image: "",
    kind: "text"
  }
];

const grid = document.querySelector("#cardGrid");
const template = document.querySelector("#cardTemplate");
const composer = document.querySelector("#composer");
const form = document.querySelector("#composerForm");
const filterButtons = [...document.querySelectorAll(".filter")];

const stored = JSON.parse(localStorage.getItem("speckled-mushroom-cards") || "[]");
let cards = [...stored, ...starterCards];
let currentFilter = "all";

function render(){
  grid.innerHTML = "";
  const visible = cards.filter(card => currentFilter === "all" || card.kind === currentFilter);
  for (const card of visible){
    const node = template.content.cloneNode(true);
    const article = node.querySelector(".card");
    const imgWrap = node.querySelector(".card-image-wrap");
    const img = node.querySelector(".card-image");
    node.querySelector(".card-title").textContent = card.title;
    node.querySelector(".card-text").textContent = card.text || "";
    node.querySelector(".kind").textContent = card.kind === "image" ? "Picture" : "Words";
    const share = node.querySelector(".share-btn");

    if(card.image){
      article.classList.add("has-image");
      img.src = card.image;
      img.alt = card.title;
    } else {
      imgWrap.remove();
    }

    share.addEventListener("click", async () => {
      const shareData = { title: card.title, text: card.text || card.title, url: location.href + "#" + card.id };
      try {
        if (navigator.share) await navigator.share(shareData);
        else {
          await navigator.clipboard.writeText(shareData.url);
          share.textContent = "Copied";
          setTimeout(()=> share.textContent = "Share", 1200);
        }
      } catch {}
    });

    article.id = card.id;
    grid.appendChild(node);
  }
}

document.querySelector("#openComposer").addEventListener("click", () => composer.showModal());
document.querySelector("#heroAdd").addEventListener("click", () => composer.showModal());

filterButtons.forEach(btn => btn.addEventListener("click", () => {
  filterButtons.forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  currentFilter = btn.dataset.filter;
  render();
}));

form.addEventListener("submit", (event) => {
  const submitter = event.submitter;
  if (!submitter || submitter.value === "cancel") return;

  event.preventDefault();
  const title = document.querySelector("#cardTitle").value.trim();
  const text = document.querySelector("#cardText").value.trim();
  const image = document.querySelector("#cardImage").value.trim();
  if (!title) return;

  const newCard = {
    id: "card-" + Date.now(),
    title, text, image,
    kind: image ? "image" : "text"
  };
  stored.unshift(newCard);
  localStorage.setItem("speckled-mushroom-cards", JSON.stringify(stored));
  cards = [newCard, ...cards];
  form.reset();
  composer.close();
  currentFilter = "all";
  filterButtons.forEach((b,i)=>b.classList.toggle("active",i===0));
  render();
  setTimeout(()=>document.getElementById(newCard.id)?.scrollIntoView({behavior:"smooth",block:"center"}),50);
});

render();
