// ── UTILITY ──
const WA_NUM = '923454489123';
function waLink(msg) { return `https://wa.me/${WA_NUM}?text=${encodeURIComponent(msg)}`; }

// ── NAV SCROLL ──
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── HERO BG PARALLAX & LOADED ──
const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
  heroBg.classList.add('loaded');
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    heroBg.style.transform = `scale(1) translateY(${scrolled * 0.25}px)`;
  }, { passive: true });
}

// ── SCROLL REVEAL ──
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); }});
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

// ── MOBILE MENU ──
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileClose = document.querySelector('.mobile-close');
hamburger?.addEventListener('click', () => mobileMenu?.classList.add('open'));
mobileClose?.addEventListener('click', () => mobileMenu?.classList.remove('open'));
document.querySelectorAll('.mobile-menu a').forEach(a => a.addEventListener('click', () => mobileMenu?.classList.remove('open')));

// ── FAQ ──
document.querySelectorAll('.faq-item').forEach(item => {
  item.querySelector('.faq-q')?.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ── GALLERY FILTERS ──
const galleryItems = document.querySelectorAll('.gallery-item');
document.querySelectorAll('.gallery-category').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.gallery-category').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.cat;
    galleryItems.forEach(item => {
      item.style.display = (cat === 'all' || item.dataset.cat === cat) ? '' : 'none';
    });
  });
});

// ── LIGHTBOX ──
const lightbox = document.querySelector('.lightbox');
const lightboxImg = document.querySelector('.lightbox img');
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const src = item.querySelector('img')?.src;
    if (src && lightbox && lightboxImg) { lightboxImg.src = src; lightbox.classList.add('active'); }
  });
});
document.querySelector('.lightbox-close')?.addEventListener('click', () => lightbox?.classList.remove('active'));
lightbox?.addEventListener('click', e => { if (e.target === lightbox) lightbox.classList.remove('active'); });

// ── CHATBOT ──
const chatTrigger = document.querySelector('.chatbot-trigger');
const chatWindow = document.querySelector('.chatbot-window');
const chatClose = document.querySelector('.chatbot-close');
const chatBody = document.querySelector('.chatbot-body');

chatTrigger?.addEventListener('click', () => chatWindow?.classList.toggle('open'));
chatClose?.addEventListener('click', () => chatWindow?.classList.remove('open'));

function addBotMsg(text, delay = 0) {
  return new Promise(res => setTimeout(() => {
    const div = document.createElement('div');
    div.className = 'chat-msg bot';
    div.innerHTML = `<div class="chat-bubble">${text}</div>`;
    chatBody?.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
    res();
  }, delay));
}

function showQuickOptions(options) {
  const wrap = document.createElement('div');
  wrap.className = 'chat-msg bot';
  const inner = document.createElement('div');
  inner.className = 'chat-options';
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'chat-option';
    btn.textContent = opt.label;
    btn.addEventListener('click', () => { handleChatOption(opt); wrap.remove(); });
    inner.appendChild(btn);
  });
  wrap.appendChild(inner);
  chatBody?.appendChild(wrap);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function addUserMsg(text) {
  const div = document.createElement('div');
  div.className = 'chat-msg user';
  div.innerHTML = `<div class="chat-bubble">${text}</div>`;
  chatBody?.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function handleChatOption(opt) {
  addUserMsg(opt.label);
  if (opt.action === 'wa') {
    setTimeout(() => {
      addBotMsg('Connecting you to WhatsApp…');
      setTimeout(() => window.open(waLink(opt.msg), '_blank'), 800);
    }, 300);
  } else if (opt.action === 'availability') {
    addBotMsg('✅ <strong>Isabel Brahma Chicks</strong> — Available on Booking<br>✅ <strong>Fertile Isabel Brahma Eggs</strong> — Available on Booking<br>🔴 Light Columbian, Blue Columbian, BSO — Currently Out of Stock', 300);
    setTimeout(() => showQuickOptions(mainOptions.filter(o => o.label !== 'Check Availability')), 800);
  } else if (opt.action === 'waitlist') {
    addBotMsg('Join our waitlist on our website or contact us directly on WhatsApp.', 300);
    setTimeout(() => window.open(waLink('Hello Pure Brahma House, I would like to join the waitlist for upcoming Brahma varieties.'), '_blank'), 800);
  } else if (opt.action === 'support') {
    addBotMsg('Our team is available via WhatsApp for all inquiries.', 300);
    setTimeout(() => window.open(waLink('Hello Pure Brahma House, I need assistance.'), '_blank'), 800);
  }
}

const mainOptions = [
  { label: '📋 Check Availability', action: 'availability' },
  { label: '🐔 Book Isabel Chicks', action: 'wa', msg: 'Hello Pure Brahma House, I would like to book Isabel Brahma chicks. Please share availability, pricing, and booking details. My city is: ___ and quantity required is: ___.' },
  { label: '🥚 Book Fertile Eggs', action: 'wa', msg: 'Hello Pure Brahma House, I would like to book Fertile Isabel Brahma Eggs. Please share availability, pricing, and collection or delivery details. My city is: ___ and quantity required is: ___.' },
  { label: '📝 Join Waitlist', action: 'waitlist' },
  { label: '💬 Contact Support', action: 'support' },
];

// Init chatbot on first open
let chatInited = false;
chatTrigger?.addEventListener('click', async () => {
  if (!chatInited && chatWindow?.classList.contains('open')) {
    chatInited = true;
    await addBotMsg('Welcome to <strong>Pure Brahma House</strong>. How can I assist you today?', 300);
    setTimeout(() => showQuickOptions(mainOptions), 700);
  }
});

// ── BOOKING FORM ──
const bookingForm = document.getElementById('bookingForm');
bookingForm?.addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(bookingForm);
  const product = data.get('product') || 'your selected product';
  const name = data.get('name') || 'there';
  const city = data.get('city') || '___';
  const qty = data.get('quantity') || '___';
  const msg = `Hello Pure Brahma House, my name is ${name}. I would like to book ${product}. My city is: ${city} and quantity required is: ${qty}. Please share availability and pricing.`;
  bookingForm.style.display = 'none';
  const success = document.getElementById('formSuccess');
  if (success) {
    success.style.display = 'block';
    const waBtn = success.querySelector('.wa-continue');
    if (waBtn) waBtn.href = waLink(msg);
  }
});

// ── WAITLIST FORMS ──
document.querySelectorAll('.waitlist-form-el').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const variety = form.dataset.variety || 'this variety';
    const name = form.querySelector('[name="name"]')?.value || '';
    const phone = form.querySelector('[name="phone"]')?.value || '';
    const msg = `Hello Pure Brahma House, I would like to be notified when ${variety} becomes available again. My name is ${name} and my phone is ${phone}.`;
    const wrap = form.closest('.waitlist-form');
    if (wrap) {
      wrap.innerHTML = `<div style="text-align:center;padding:40px"><h3 style="color:var(--gold);font-family:'Cormorant Garamond',serif;margin-bottom:12px">You're on the list.</h3><p style="color:var(--text-muted)">We'll contact you as soon as ${variety} becomes available.</p><a href="${waLink(msg)}" target="_blank" class="btn btn-secondary" style="margin-top:24px;display:inline-flex">Continue on WhatsApp</a></div>`;
    }
  });
});

// ── TRUST STRIP DUPLICATE ──
const trustTrack = document.querySelector('.trust-track');
if (trustTrack) {
  trustTrack.innerHTML += trustTrack.innerHTML;
}

// ── COUNTERS ──
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  let count = 0;
  const step = Math.ceil(target / 60);
  const timer = setInterval(() => {
    count = Math.min(count + step, target);
    el.textContent = count + (el.dataset.suffix || '');
    if (count >= target) clearInterval(timer);
  }, 24);
}
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); counterObs.unobserve(e.target); }});
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(el => counterObs.observe(el));

// ── WHATSAPP BUTTON LINKS ──
document.querySelectorAll('[data-wa]').forEach(el => {
  el.addEventListener('click', () => window.open(waLink(el.dataset.wa), '_blank'));
});
