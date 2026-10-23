document.getElementById('year').textContent = new Date().getFullYear();

// ---------------------------------------------------------
// Hero Live-Measure-Tool: gestrichelte Maßlinie vom Cursor
// zur Headline, Design-Tool-Inspector (Figma-Style)
// ---------------------------------------------------------
(function setupInspector() {
  const hero = document.getElementById('top');
  const headline = document.getElementById('heroHeadline');
  const svg = hero ? hero.querySelector('.hero-inspector') : null;
  if (!hero || !headline || !svg) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
  if (prefersReducedMotion || !hasFinePointer) return;

  const line = svg.querySelector('.inspector-line');
  const dot = svg.querySelector('.inspector-dot');
  const labelGroup = svg.querySelector('.inspector-label');
  const labelRect = labelGroup.querySelector('rect');
  const labelText = labelGroup.querySelector('text');

  let pending = false;
  let lastEvent = null;

  function render() {
    pending = false;
    if (!lastEvent) return;

    const heroRect = hero.getBoundingClientRect();

    const x = lastEvent.clientX - heroRect.left;
    const y = lastEvent.clientY - heroRect.top;

    // Textzeilen der Headline messen
    const range = document.createRange();
    range.selectNodeContents(headline);
    const lineRects = Array.from(range.getClientRects()).filter(r => r.width > 0 && r.height > 0);
    if (!lineRects.length) return;

    // nächster Punkt auf Textzeile zum Cursor
    let closestX = 0, closestY = 0, best = Infinity;
    lineRects.forEach((r) => {
      const left = r.left - heroRect.left;
      const right = r.right - heroRect.left;
      const top = r.top - heroRect.top;
      const bottom = r.bottom - heroRect.top;
      const cx = Math.min(Math.max(x, left), right);
      const cy = Math.min(Math.max(y, top), bottom);
      const d = Math.hypot(x - cx, y - cy);
      if (d < best) { best = d; closestX = cx; closestY = cy; }
    });

    const distance = Math.round(best);

    line.setAttribute('x1', closestX);
    line.setAttribute('y1', closestY);
    line.setAttribute('x2', x);
    line.setAttribute('y2', y);

    dot.setAttribute('cx', closestX);
    dot.setAttribute('cy', closestY);

    const labelStr = `${distance}px`;
    labelText.textContent = labelStr;

    // Box an die Schrift anpassen
    // Breite = echte Textlänge, Höhe = Schriftgröße
    const padX = 3;
    const padY = 2;
    const fontSize = parseFloat(getComputedStyle(labelText).fontSize) || 11;
    const textWidth = labelText.getComputedTextLength();
    const labelWidth = Math.round(textWidth + padX * 2);
    const labelHeight = Math.round(fontSize + padY * 2);
    const labelX = x + 12;
    const labelY = y - 10;

    labelText.setAttribute('x', padX);
    labelText.setAttribute('y', 0);
    labelRect.setAttribute('x', 0);
    labelRect.setAttribute('y', -labelHeight / 2);
    labelRect.setAttribute('width', labelWidth);
    labelRect.setAttribute('height', labelHeight);
    labelRect.setAttribute('rx', 2);
    labelGroup.setAttribute('transform', `translate(${labelX}, ${labelY})`);

    svg.classList.add('is-active');
  }

  hero.addEventListener('mousemove', (e) => {
    lastEvent = e;
    if (!pending) {
      pending = true;
      requestAnimationFrame(render);
    }
  });

  hero.addEventListener('mouseleave', () => {
    svg.classList.remove('is-active');
    lastEvent = null;
  });
})();


// Scroll-Reveal für Projekt-Karten
// ---------------------------------------------------------
const projectCards = document.querySelectorAll('.project-card');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

projectCards.forEach((el) => revealObserver.observe(el));


// Case-Study für Projekte
// ---------------------------------------------------------
const projectsData = {
  appkellner: {
    title: 'UI Design & Prompt Engineering',
    subtitle: 'Praktikum bei appkellner UG',
    images: [
      { src: 'assets/title-screen.png', alt: 'Startbildschirm' },
      { src: 'assets/scene-crash.png', alt: 'Spielszene 1' },
      { src: 'assets/scene-glovebox.png', alt: 'Spielszene 2' },
      { src: 'assets/design-system.png', alt: 'UI-Design-System mit Typografie, Farben und Button-States' }
    ],
    sections: [
      { label: 'Kontext', text: 'Ein neues Produkt von appkellner: ein interaktives Story-Spiel, bei dem eine KI (OpenAI API) Geschichte und Bilder generieren soll.Die Spieler treffen fortlaufend Entscheidungen, um einen Fall zu lösen. Zu Praktikumsbeginn existierten nur eine Idee, ein erster Prototyp und ein festgelegter Tech-Stack (Figma, Godot Engine, Python-Backend, OpenAI API).' },
      { label: 'Aufgabe', text: 'Das komplette UI-Design der Applikation von Grund auf entwickeln, den Prototyp in die Godot-Engine implementieren und den Prompt zur KI-Story-Generierung so verfeinern, dass konsistente, spielbare Storylines entstehen.' },
      { label: 'Vorgehen', text: 'Mehrere UI-Prototyp-Iterationen in Figma, mit ersten Wireframes bis zum finalen Look mit definierter Typografie, Farbsystem und Button-States. Dunkle, atmosphärische Art Direction passend zum Mystery/Noir-Genre. Umsetzung des Interfaces in der Godot-Engine, iterative Prompt-Optimierung für die KI-gestützte Story-Generierung sowie wöchentliche Team-Abstimmung zu Fortschritt und Anpassungen.' },
      { label: 'Ergebnis', text: 'Ein funktionierender UI-Prototyp mit klarem visuellem System, implementiert in der Godot-Engine, sowie verbesserte, spielbare KI-generierte Storylines durch gezielte Prompt-Anpassung.' },
      { label: 'Learning', text: 'Direkter Bezug zur späteren Bachelorarbeit: Die Arbeit an der Prompt-Optimierung zeigte konkret, wo KI-gestütztes interaktives Storytelling an Grenzen stößt, dies wurde zum Ausgangspunkt für die vertiefte wissenschaftliche Auseinandersetzung mit dem Thema im Rahmen meiner Bachelorarbeit.' }
    ]
  },
    farbflut: {
    title: 'Website Design & Umsetzung',
    subtitle: 'Farbflut-Graffiti',
    images: [
      { src: 'assets/Farbflut_MockUp_Portfolio.png', alt: 'Website Design' },
      { src: 'assets/Cover_Farbflut-Graffiti_Website.png', alt: 'Logo' },
    ],
    sections: [
      { label: 'Kontext', text: 'Farbflut-Graffiti ist ein Unternehmen für Wandgestalltung, das ich gemeinsam mit meinem Geschäftspartner betreibe. Für Fassaden, Innenräume, Lettering und Workshops fehlte ein eigener Webauftritt, der die Arbeiten zeigt, Vertrauen aufbaut und Anfragen möglichst einfach macht.' },
      { label: 'Aufgabe', text: 'Die komplette Website von der Struktur bis zum Livegang entwerfen und umsetzen: Design, Inhalte, Frontend-Entwicklung. Dabei sollte die Seite die Bilder in den Mittelpunkt stellen, auf allen Geräten funktionieren und für alle Nutzer zugänglich sein.' },
      { label: 'Vorgehen', text: 'Die Seite ist ein One-Pager in HTML, CSS und JavaScript, ohne Framework. Aufgebaut ist sie in klaren Abschnitten: Leistungen, Referenzen, Kunden, Über uns, Kontakt, FAQ. Gestalterisch setzt sie auf eine reduzierte Schwarz-Weiß-Optik mit Barlow Condensed als Headline-Schrift, damit die farbigen Wandarbeiten stärker wirken. Die Referenzen werden als Galerie in ihrem Originalformat gezeigt, mit Filter (Fassade, Innen, Events) und Lightbox. Die Kundenlogos ordnen sich automatisch im Raster an und skalieren mit der Anzahl, sodass neue Kunden ohne Code-Anpassung ergänzt werden können. Das Kontaktformular enthält Validierung mit verständlichen Fehlermeldungen. Die FAQ beantwortet typische Fragen zu Preisen, Material, Nutzungsrechten und Ablauf. Barrierefreiheit war von Beginn an Teil der Umsetzung (orientiert an WCAG): Skip-Link, sichtbare Fokus-Stile, geprüfte Farbkontraste, Tastaturbedienung, mobile Navigation mit korrekten ARIA-Attributen und Unterstützung für reduzierte Bewegung.' },
      { label: 'Ergebnis', text: 'Eine responsive, barrierearme Website, die Leistungen, Arbeiten, Kunden und Kontaktmöglichkeiten an einem Ort bündelt und leicht erweiterbar ist. Neue Referenzen, Logos und FAQ-Einträge lassen sich ohne Umbau ergänzen.' },
      { label: 'Learning', text: 'Als Designer und Auftraggeber in einer Person musste ich Gestaltung, Inhalt und Technik gegeneinander abwägen. Die Umsetzung hat mir gezeigt, wie viel Barrierefreiheit und saubere Struktur zur Qualität einer Website beitragen, auch ohne Framework.' }
    ]
  },
  bachelorarbeit: {
    title: 'Grenzen und Möglichkeiten aktueller KI-Systeme für interaktives Storytelling in Videospielen',
    subtitle: 'Bachelorarbeit, Medieningenieur, HAW Kiel - Note 1,3 (Arbeit) / 1,7 (Kolloquium)',
    images: [
      { src: 'assets/chart-fallbeispiele.png', alt: 'Eigenes Modell zur Systemorchestrierung hybrider KI-Systeme für interaktive Narrative' },
      { src: 'assets/chart-mittelwerte.png', alt: 'Balkendiagramm: Mittelwerte aller Testindikatoren im Vergleich der vier Systeme' },
      { src: 'assets/diagramm-orchestrierung.png', alt: 'Balkendiagramm: Anzahl der Immersionsbrüche je System über alle Testdurchläufe' }
    ],
    table: {
      caption: 'Testergebnisse — Gesamt-/Mittelwerte aller 240 Turns (60 je System)',
      headers: ['System', 'Agency lokal', 'Agency global', 'Kohärenz (Charakter)', 'Legibility', 'Immersionsbrüche', 'Latenz'],
      rows: [
        ['Façade', '2,63', '1,82', '4,00', '3,68', '23 / 60', '00:05'],
        ['AI Dungeon', '4,58', '3,19', '4,25', '4,27', '39 / 60', '00:06'],
        ['Shadow of Mordor', '3,05', '3,38', '4,00', '5,00', '0 / 60', '00:45'],
        ['Vaudeville', '4,68', '4,67', '5,00', '4,66', '4 / 60', '00:03']
      ]
    },
    sections: [
      { label: 'Kontext', text: 'Direkt angeknüpft an mein Praktikum bei appkellner: Dort zeigte die praktische Arbeit an der KI-Story-Generierung erste konkrete Grenzen von LLM-gestütztem interaktivem Storytelling. Im Rahmen meiner Bachelorarbeit konnte ich dieses Problem wissenschaftlich analysieren, betreut von Prof. Dr. Stefanie Reich (Erstprüferin) und Dipl.-Inf. Falko Kellner (Zweitprüfer).' },
      { label: 'Forschungsfrage', text: 'Welche technischen und gestalterischen Möglichkeiten und Grenzen bieten aktuelle KI-Systeme für interaktives Storytelling in Videospielen? Ergänzt wird diese Forschugsfrage durch drei Unterfragen zu dynamischen Erzählstrukturen, zukünftigen Perspektiven und der Evaluation von Spielerlebnissen.' },
      { label: 'Methodik', text: 'Qualitativ-vergleichende Fallstudie mit vier Systemen unterschiedlicher technischer Ansätze: Façade (regel-/planungsbasiert), Middle-earth: Shadow of Mordor (systemisch emergent), AI Dungeon (LLM-basiert) und Vaudeville (hybrid). Je System 60 standardisierte Testdurchläufe (240 insgesamt), bewertet anhand von fünf Kriterien: Agency, Immersion, narrative Kohärenz, Legibility und technische Performanz.' },
      { label: 'Ergebnis', text: 'Hybride Systeme wie Vaudeville (LLM + persistente Zustands- und Gedächtnissysteme) erzielen die besten Werte über fast alle Kriterien. Reine LLM-Systeme wie AI Dungeon bieten die höchste lokale Handlungsfreiheit, aber auch die meisten Immersionsbrüche (mit 39 brüchen von 60 Turns ingesamt). Regelbasierte Systeme wie Façade sichern Kohärenz, schränken die Handlungsfreiheit jedoch stark ein. Daraus lässt sich das Gestaltungsprinzip „Struktur - Zustand - Oberfläche (UI)" für hochwertiges KI-gestütztes Storytelling ableiten.' },
      { label: 'Reflexion', text: 'Die Prompt-Optimierung bei appkellner hatte gezeigt, wo generative KI im interaktiven Storytelling an Grenzen stößt, diese praktische Beobachtung wurde zum wissenschaftlichen Ausgangspunkt. Das entwickelte Orchestrierungs-Modell lässt sich direkt auf zukünftige Projekte mit KI-generierten Inhalten übertragen.' }
    ]
  }
};

// Kacheln ohne eigenes Caption-Element bekommen automatisch
// eine Hover-Beschriftung aus data-title
document.querySelectorAll('.project-card').forEach((card) => {
  const media = card.querySelector('.project-media');
  if (media && !media.querySelector('.project-caption') && card.dataset.title) {
    const cap = document.createElement('span');
    cap.className = 'project-caption';
    cap.textContent = card.dataset.title;
    media.appendChild(cap);
  }
});


// Lightbox — Projekt-Details bei Klick auf eine Galerie-Kachel
// ---------------------------------------------------------
(function setupLightbox() {
  const lightbox = document.getElementById('lightbox');
  const backdrop = document.getElementById('lightboxBackdrop');
  const closeBtn = document.getElementById('lightboxClose');
  const mediaEl = document.getElementById('lightboxMedia');
  const titleEl = document.getElementById('lightboxTitle');
  const descEl = document.getElementById('lightboxDesc');
  const tagsEl = document.getElementById('lightboxTags');
  const cards = document.querySelectorAll('.project-card');

  if (!lightbox || cards.length === 0) return;

  let lastFocused = null;

  function renderSimple(card) {
    const title = card.dataset.title || '';
    const desc = card.dataset.desc || '';
    const tags = (card.dataset.tags || '').split(',').map((t) => t.trim()).filter(Boolean);
    const placeholder = card.querySelector('.project-media')?.dataset.placeholder || '';

    mediaEl.innerHTML = '';
    mediaEl.className = 'lightbox-media';
    mediaEl.setAttribute('data-placeholder', placeholder);

    titleEl.textContent = title;
    descEl.style.display = '';
    descEl.textContent = desc;
    tagsEl.innerHTML = tags.map((t) => `<span>${t}</span>`).join('');
  }

  function renderRich(data, tags) {
    mediaEl.className = 'lightbox-media lightbox-media-rich';
    mediaEl.removeAttribute('data-placeholder');

    const main = document.createElement('div');
    main.className = 'lightbox-main-image';
    const mainImg = document.createElement('img');
    mainImg.src = data.images[0].src;
    mainImg.alt = data.images[0].alt;
    main.appendChild(mainImg);

    const strip = document.createElement('div');
    strip.className = 'lightbox-thumb-strip';
    data.images.forEach((img, i) => {
      const thumb = document.createElement('button');
      thumb.type = 'button';
      thumb.className = 'lightbox-thumb' + (i === 0 ? ' is-active' : '');
      thumb.setAttribute('aria-label', img.alt);
      const thumbImg = document.createElement('img');
      thumbImg.src = img.src;
      thumbImg.alt = '';
      thumb.appendChild(thumbImg);
      thumb.addEventListener('click', () => {
        mainImg.src = img.src;
        mainImg.alt = img.alt;
        strip.querySelectorAll('.lightbox-thumb').forEach((t) => t.classList.remove('is-active'));
        thumb.classList.add('is-active');
      });
      strip.appendChild(thumb);
    });

    mediaEl.innerHTML = '';
    mediaEl.appendChild(main);
    mediaEl.appendChild(strip);

    titleEl.textContent = data.title;
    descEl.style.display = 'none';
    tagsEl.innerHTML = tags.map((t) => `<span>${t}</span>`).join('');

    const sectionsWrap = document.createElement('div');
    sectionsWrap.className = 'lightbox-sections';
    data.sections.forEach((sec) => {
      const block = document.createElement('div');
      block.className = 'lightbox-section';
      const h = document.createElement('h4');
      h.textContent = sec.label;
      const p = document.createElement('p');
      p.textContent = sec.text;
      block.appendChild(h);
      block.appendChild(p);
      sectionsWrap.appendChild(block);
    });

    if (data.table) {
      const tableWrap = document.createElement('div');
      tableWrap.className = 'lightbox-table-wrap';
      const caption = document.createElement('p');
      caption.className = 'lightbox-table-caption';
      caption.textContent = data.table.caption;
      const table = document.createElement('table');
      table.className = 'lightbox-table';
      const thead = document.createElement('thead');
      const headRow = document.createElement('tr');
      data.table.headers.forEach((h) => {
        const th = document.createElement('th');
        th.textContent = h;
        headRow.appendChild(th);
      });
      thead.appendChild(headRow);
      const tbody = document.createElement('tbody');
      data.table.rows.forEach((row) => {
        const tr = document.createElement('tr');
        row.forEach((cell) => {
          const td = document.createElement('td');
          td.textContent = cell;
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      table.appendChild(thead);
      table.appendChild(tbody);
      tableWrap.appendChild(caption);
      tableWrap.appendChild(table);
      sectionsWrap.appendChild(tableWrap);
    }

    tagsEl.insertAdjacentElement('afterend', sectionsWrap);
  }

  function clearRichSections() {
    document.querySelectorAll('.lightbox-sections').forEach((el) => el.remove());
  }

  function openLightbox(card) {
    clearRichSections();
    const projectKey = card.dataset.project;
    const tags = (card.dataset.tags || '').split(',').map((t) => t.trim()).filter(Boolean);

    if (projectKey && projectsData[projectKey]) {
      renderRich(projectsData[projectKey], tags);
    } else {
      renderSimple(card);
    }

    lastFocused = document.activeElement;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    closeBtn.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  cards.forEach((card) => {
    card.addEventListener('click', () => openLightbox(card));
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(card);
      }
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  backdrop.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
  });
})();


// Aktiven Nav-Link je nach Scroll-Position markieren
// ---------------------------------------------------------
const navLinks = document.querySelectorAll('.nav-links a');
const sections = ['work', 'branding', 'print', 'about', 'contact']
  .map((id) => document.getElementById(id))
  .filter(Boolean);

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const link = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
    if (!link) return;
    if (entry.isIntersecting) {
      navLinks.forEach((l) => l.classList.remove('is-active'));
      link.classList.add('is-active');
    }
  });
}, { threshold: 0.4 });

sections.forEach((section) => navObserver.observe(section));


// Poster-Galerie: ein Poster gross, per Pfeil, Thumbnail,
// Tastatur oder Wischen durchklicken
// ---------------------------------------------------------
(function setupPrintGallery() {
  const gallery = document.getElementById('printGallery');
  if (!gallery) return;

  const items = Array.from(gallery.querySelectorAll('.print-item'));
  const prev = gallery.querySelector('.print-prev');
  const next = gallery.querySelector('.print-next');
  const counter = gallery.querySelector('.print-counter');
  const thumbsWrap = document.getElementById('printThumbs');
  if (!items.length) return;

  let index = 0;

  const thumbs = items.map((item, i) => {
    const src = item.querySelector('img').getAttribute('src');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'print-thumb';
    btn.setAttribute('aria-label', `Poster ${i + 1} anzeigen`);
    btn.innerHTML = `<img src="${src}" alt="">`;
    btn.addEventListener('click', () => show(i));
    thumbsWrap.appendChild(btn);
    return btn;
  });

  function show(i) {
    index = (i + items.length) % items.length;
    items.forEach((el, n) => el.classList.toggle('is-active', n === index));
    thumbs.forEach((el, n) => el.classList.toggle('is-active', n === index));
    counter.textContent = `${index + 1} / ${items.length}`;
  }

  prev.addEventListener('click', () => show(index - 1));
  next.addEventListener('click', () => show(index + 1));

  // Pfeiltasten, solange die Galerie Fokus hat
  gallery.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { show(index - 1); e.preventDefault(); }
    if (e.key === 'ArrowRight') { show(index + 1); e.preventDefault(); }
  });

  // Wischen auf Touch-Geräten
  let startX = null;
  gallery.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  gallery.addEventListener('touchend', (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
    startX = null;
  });

  show(0);
})();
