// ===== DATE DISPLAY =====
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

const today = new Date();
const todayStr = formatDate(today);

const urgencyEl = document.getElementById('urgency-date');
const offerEl = document.getElementById('offer-date');
if (urgencyEl) urgencyEl.textContent = todayStr;
if (offerEl) offerEl.textContent = todayStr;

// ===== COUNTDOWN TIMER =====
// Set countdown to end of today (midnight)
const endOfDay = new Date();
endOfDay.setHours(23, 59, 59, 0);

function updateCountdown() {
  const now = new Date();
  let diff = Math.max(0, endOfDay - now);

  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * 1000 * 60 * 60;
  const minutes = Math.floor(diff / (1000 * 60));
  diff -= minutes * 1000 * 60;
  const seconds = Math.floor(diff / 1000);

  const hEl = document.getElementById('hours');
  const mEl = document.getElementById('minutes');
  const sEl = document.getElementById('seconds');

  if (hEl) hEl.textContent = String(hours).padStart(2, '0');
  if (mEl) mEl.textContent = String(minutes).padStart(2, '0');
  if (sEl) sEl.textContent = String(seconds).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ===== FAQ ACCORDION =====
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');

  // Close all
  document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));

  // Open clicked if it was closed
  if (!isOpen) item.classList.add('open');
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== SCROLL REVEAL (simple intersection observer) =====
const revealEls = document.querySelectorAll(
  '.step-card, .benefit-card, .testimonial-card, .plan-card, .faq-item'
);

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

revealEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});
