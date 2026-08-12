const button=document.querySelector('.menu-toggle');const nav=document.querySelector('.main-nav');const links=document.querySelectorAll('.main-nav a');button?.addEventListener('click',()=>{const open=nav.classList.toggle('open');button.setAttribute('aria-expanded',String(open));});links.forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('open');button?.setAttribute('aria-expanded','false');}));const sections=[...document.querySelectorAll('main section[id]')];const observer=new IntersectionObserver(entries=>{const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(!visible)return;links.forEach(link=>link.classList.toggle('active',link.getAttribute('href')===`#${visible.target.id}`));},{rootMargin:'-35% 0px -55% 0px',threshold:[.05,.2,.5]});sections.forEach(section=>observer.observe(section));document.getElementById('year').textContent=new Date().getFullYear();

/* --- Hero video dongusu ---
    klasorune klip1.mp4, klip2.mp4 ... koyun.
   Dosya yoksa otomatik olarak yedek gorsel gosterilir. */
(function(){
  const KLIPLER = ['klip1.mp4','klip2.mp4'];
  const alan = document.getElementById('hero-media');
  if(!alan) return;
  const a = document.getElementById('hero-video-a');
  const b = document.getElementById('hero-video-b');
  const yedek = document.getElementById('hero-fallback');
  const noktalar = document.getElementById('hero-dots');
  const azHareket = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function varMi(url){
    return fetch(url, {method:'HEAD'}).then(r => r.ok).catch(() => false);
  }

  Promise.all(KLIPLER.map(varMi)).then(sonuc => {
    const gecerli = KLIPLER.filter((_, i) => sonuc[i]);
    if(!gecerli.length) return;            // klip yok -> yedek gorsel kalir

    alan.removeAttribute('data-fallback');
    yedek.remove();

    gecerli.forEach((_, i) => {
      const n = document.createElement('span');
      if(i === 0) n.className = 'is-on';
      noktalar.appendChild(n);
    });
    const isaret = [...noktalar.children];

    let sira = 0;
    let aktif = a, bekleyen = b;
    aktif.src = gecerli[0];
    aktif.play().catch(() => {});
    if(gecerli.length > 1) bekleyen.src = gecerli[1];

    if(azHareket || gecerli.length === 1){
      aktif.loop = true;
      return;
    }

    function sonraki(){
      sira = (sira + 1) % gecerli.length;
      bekleyen.currentTime = 0;
      bekleyen.play().catch(() => {});
      bekleyen.classList.add('is-active');
      aktif.classList.remove('is-active');
      isaret.forEach((n, i) => n.classList.toggle('is-on', i === sira));

      const eski = aktif;
      aktif = bekleyen;
      bekleyen = eski;
      bekleyen.src = gecerli[(sira + 1) % gecerli.length];
      aktif.addEventListener('ended', sonraki, {once:true});
    }
    aktif.addEventListener('ended', sonraki, {once:true});
  });
})();
