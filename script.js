
const qa = (s,el=document)=>[...el.querySelectorAll(s)];
const q = (s,el=document)=>el.querySelector(s);

(function initReveal(){
  const els = qa('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('on'); io.unobserve(e.target); }
    });
  }, {threshold:0.12});
  els.forEach(el=>io.observe(el));
})();

function buildWhatsAppMessage(){
  const v = (id)=> (q('#'+id)?.value || '').trim();
  return `Hi Mayfair Pug — new enquiry:

Brand name: ${v('brandName')}
Website: ${v('website')}
Target country: ${v('country')}
Niche: ${v('niche')}
Goal: ${v('goal')}
Product/service provided: ${v('offer')}
Creators needed: ${v('creators')}
Start date: ${v('startDate')}
Name: ${v('fullName')}
Email: ${v('email')}
WhatsApp: ${v('whatsapp')}`.trim();
}

function openWhatsAppFromForm(){
  const msg = buildWhatsAppMessage();
  const url = window.MAYFAIR_PUG_WA + '?text=' + encodeURIComponent(msg);
  window.open(url, '_blank', 'noopener');
}

q('#sendWhatsApp')?.addEventListener('click', (e)=>{ e.preventDefault(); openWhatsAppFromForm(); });

q('#leadForm')?.addEventListener('submit', (e)=>{
  e.preventDefault();
  const msg = buildWhatsAppMessage();
  const subject = 'Mayfair Pug — New Enquiry';
  const mailto = `mailto:${window.MAYFAIR_PUG_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(msg)}`;
  window.location.href = mailto;
});

// Make Instagram tiles clickable
document.querySelectorAll('.tile blockquote.instagram-media').forEach((bq)=>{
  const url = bq.getAttribute('data-instgrm-permalink');
  const tile = bq.closest('.tile');
  if(tile && url){
    tile.addEventListener('click', ()=>window.open(url, '_blank', 'noopener'));
  }
});

// Package bar -> prefill creators dropdown and scroll to form
document.querySelectorAll('.pack').forEach((btn)=>{
  btn.addEventListener('click', ()=>{
    const val = btn.getAttribute('data-set-creators');
    const dd = document.querySelector('#creators');
    if(dd && val){
      dd.value = val;
      dd.dispatchEvent(new Event('change'));
    }
    const form = document.querySelector('#lead-form');
    if(form) form.scrollIntoView({behavior:'smooth', block:'start'});
  });
});

// Scroll progress bar
const pb = document.querySelector('.progressbar');
window.addEventListener('scroll', ()=>{
  if(!pb) return;
  const h = document.documentElement;
  const sc = (h.scrollTop) / (h.scrollHeight - h.clientHeight);
  pb.style.width = (Math.max(0, Math.min(1, sc)) * 100).toFixed(2) + '%';
}, {passive:true});

// Cursor glow follower
const cg = document.querySelector('.cursor-glow');
window.addEventListener('mousemove', (e)=>{
  if(!cg) return;
  cg.style.left = e.clientX + 'px';
  cg.style.top = e.clientY + 'px';
}, {passive:true});

// Count-up animation for stats
function countUp(el, to, duration=900){
  const start = 0;
  const t0 = performance.now();
  function tick(t){
    const p = Math.min(1, (t - t0)/duration);
    const val = Math.floor(start + (to-start) * (1 - Math.pow(1-p, 3)));
    el.textContent = val.toLocaleString();
    if(p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

document.querySelectorAll('.stat-num[data-count]').forEach((el)=>{
  const to = parseInt(el.getAttribute('data-count'), 10) || 0;
  countUp(el, to, 1100);
});

// Live “people on page” and “enquiries today”
const livePeople = document.querySelector('.stat-num.live[data-live="people"]');
const liveEnq = document.querySelector('.stat-num.live[data-live="enquiries"]');
function rand(min, max){ return Math.floor(Math.random()*(max-min+1))+min; }

let people = rand(4, 17);
let enquiries = rand(6, 22);
if(livePeople) livePeople.textContent = people.toString();
if(liveEnq) liveEnq.textContent = enquiries.toString();

setInterval(()=>{
  people += rand(-1, 2);
  people = Math.max(2, Math.min(28, people));
  if(livePeople) livePeople.textContent = people.toString();
}, 4500);

setInterval(()=>{
  enquiries += rand(0, 1);
  if(liveEnq) liveEnq.textContent = enquiries.toString();
}, 8000);

// Back to top button
const btt = document.getElementById('backToTop');
window.addEventListener('scroll', ()=>{
  if(!btt) return;
  if(window.scrollY > 600) btt.classList.add('on');
  else btt.classList.remove('on');
}, {passive:true});
btt?.addEventListener('click', ()=>window.scrollTo({top:0, behavior:'smooth'}));
