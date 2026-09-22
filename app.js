'use strict';
const menuButton = document.querySelector('.menu-button');
const mobileNav = document.querySelector('#mobile-nav');
function closeMenu() {
  mobileNav.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Открыть меню');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  mobileNav.hidden = !open;
});
mobileNav.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !mobileNav.hidden) { closeMenu(); menuButton.focus(); }
});
window.matchMedia('(min-width: 761px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});
const track = document.querySelector('#team-track');
// Native dialogs may restore :focus-visible after touch. Preserve focus, but
// show the carousel focus ring only when the visitor uses the keyboard.
document.addEventListener('pointerdown', () => {
  track.classList.add('pointer-interaction');
}, {capture: true, passive: true});
document.addEventListener('keydown', event => {
  if (!['Shift', 'Control', 'Alt', 'Meta'].includes(event.key)) {
    track.classList.remove('pointer-interaction');
  }
}, {capture: true});
const previous = document.querySelector('#team-prev');
const next = document.querySelector('#team-next');
const position = document.querySelector('.team-position');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
function syncSlider() {
  const cards = [...track.children];
  const max = track.scrollWidth - track.clientWidth;
  previous.disabled = track.scrollLeft < 3;
  next.disabled = max < 3 || track.scrollLeft >= max - 3;
  const left = track.getBoundingClientRect().left;
  let first = cards.findIndex(card => card.getBoundingClientRect().right > left + 20);
  let last = cards.findLastIndex(card => card.getBoundingClientRect().left < left + track.clientWidth - 20);
  position.textContent = `${first + 1}–${last + 1} / ${cards.length}`;
}
function moveSlider(direction) { track.scrollBy({left: direction * (track.clientWidth * .85), behavior: reduceMotion.matches ? 'instant' : 'smooth'}); }
previous.addEventListener('click', () => moveSlider(-1));
next.addEventListener('click', () => moveSlider(1));
track.addEventListener('scroll', syncSlider, {passive: true});
track.addEventListener('keydown', event => { if (event.target === track && ['ArrowLeft','ArrowRight'].includes(event.key)) { event.preventDefault(); moveSlider(event.key === 'ArrowLeft' ? -1 : 1); } });
window.addEventListener('resize', syncSlider);
syncSlider();
const dialog = document.querySelector('#staff-dialog');
const dialogContent = document.querySelector('#dialog-content');
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
track.addEventListener('click', event => {
  const card = event.target.closest('[data-staff]');
  if (!card) return;
  const person = window.PSO_STAFF.find(item => item.id === card.dataset.staff);
  if (!person) return;
  dialogContent.innerHTML = `<div class="dialog-heading"><img src="${escapeHTML(person.image)}" alt="" width="160" height="200"><div><p class="eyebrow">НАША КОМАНДА</p><h2 id="dialog-name">${escapeHTML(person.name)}</h2><p class="dialog-role">${escapeHTML(person.role)}</p>${person.category ? `<span class="qualification">${escapeHTML(person.category)} квалификационная категория</span>` : ''}</div></div><p class="dialog-summary">${escapeHTML(person.summary)}</p><h3>Направления работы</h3><ul>${person.directions.map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul>${person.education.length ? `<h3>Образование</h3><ul>${person.education.map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul>` : ''}${person.additional?.length ? `<h3>Профессиональная деятельность</h3><ul>${person.additional.map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul>` : ''}${person.specialty_since ? `<p class="experience">По специальности с ${escapeHTML(person.specialty_since)} года</p>` : ''}${person.head_since ? `<p class="experience">Заведующий отделением с ${escapeHTML(person.head_since)} года</p>` : ''}`;
  dialog.showModal();
  document.body.classList.add('dialog-open');
  dialog.scrollTop = 0;
});
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
});
dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
const sizeButton = document.querySelector('#text-size');
sizeButton.addEventListener('click', () => {
  const active = !document.documentElement.classList.contains('larger-text');
  document.documentElement.classList.toggle('larger-text', active);
  sizeButton.setAttribute('aria-pressed', String(active));
  sizeButton.setAttribute('aria-label', active ? 'Обычный размер текста' : 'Увеличить размер текста');
  sizeButton.querySelector('span').textContent = active ? 'Обычный текст' : 'Увеличить текст';
  syncSlider();
});
