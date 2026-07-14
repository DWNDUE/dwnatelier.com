/* SCRIPT UNIFICATO E SICURO */
(function () {
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  document.addEventListener("DOMContentLoaded", () => {

    /* ---------- ELEMENTI PRINCIPALI ---------- */
    const header = $("#site-header");
    const headerContent = $("#header-content");
    const logoTrigger = $("#logo-trigger");
    const typeTarget = $("#typewriter");
    const hero = $("#hero");
    const works = $("#works");
    const worksTrigger = $("#works-trigger");
    const terminal = $("#terminal-log");
    const masonry = $(".masonry");

    /* ---------- TYPEWRITER ---------- */
    if (typeTarget && header) {
      const text = "I'M NOT A DESIGNER\nI'M AN IMPULSIVE CREATIVE";
      let i = 0;
      let typing = false;

      function type() {
        if (!typing) {
          typing = true;
          header.classList.add("header-white");
        }

        if (i < text.length) {
          const char = text.charAt(i);
          typeTarget.innerHTML += char === "\n" ? "<br>" : char;
          i++;
          setTimeout(type, 60);
        } else {
          setTimeout(() => {
            typeTarget.innerHTML = "";
            i = 0;
            typing = false;
            header.classList.remove("header-white");
            setTimeout(type, 800);
          }, 2000);
        }
      }
      type();

      const observer = new MutationObserver(() => {
        const hasText = typeTarget.innerText.trim().length > 0;
        header.classList.toggle("header-white", hasText);
      });
      observer.observe(typeTarget, { childList: true, subtree: true });
    }

    /* ---------- CURSORE PERSONALIZZATO ---------- */
    (function initCursor() {
      const isTouch = matchMedia("(hover: none), (pointer: coarse)").matches || "ontouchstart" in window;
      if (isTouch) return;
      if ($(".custom-cursor")) return;

      const cursor = document.createElement("div");
      cursor.className = "custom-cursor";
      cursor.textContent = "✦";
      document.body.appendChild(cursor);

      document.addEventListener("mousemove", (e) => {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;

        const trail = document.createElement("div");
        trail.className = "cursor-trail";
        trail.style.left = `${e.clientX}px`;
        trail.style.top = `${e.clientY}px`;
        document.body.appendChild(trail);
        setTimeout(() => trail.remove(), 400);
      }, { passive: true });
    })();

    /* ---------- SHUFFLE WORKS ---------- */
    if (masonry) {
      setInterval(() => {
        const items = Array.from(masonry.children);
        if (!items.length) return;
        const random = items[Math.floor(Math.random() * items.length)];
        masonry.appendChild(random);
      }, 7000);
    }

    /* ---------- HERO SCROLL ---------- */
    (function initHeroScroll() {
      if (!hero || !works) return;
      let isScrolling = false;

      function scrollToSection(selector) {
        const el = document.querySelector(selector);
        if (!el) return;
        isScrolling = true;
        window.scrollTo({ top: el.offsetTop, behavior: "smooth" });
        setTimeout(() => (isScrolling = false), 600);
      }

      window.addEventListener("wheel", (e) => {
        if (isScrolling) return;
        const y = window.scrollY || window.pageYOffset;
        const goingDown = e.deltaY > 0;
        const heroEnd = hero.offsetHeight;
        if (goingDown && y < heroEnd - 50) {
          scrollToSection("#works");
        }
      }, { passive: true });
    })();

    /* ---------- WORKS SEQUENCE ---------- */
    (function initWorksSequence() {
      const cards = $$(".work-card");
      if (!worksTrigger || cards.length === 0 || !terminal) return;

      const terminalLines = [
        "> initializing DWN.ATELIER system...",
        "> loading visual modules...",
        "> ready.",
      ];

      function resetTerminal() {
        terminal.innerHTML = "";
        terminal.classList.remove("terminal-hidden", "terminal-gone");
        terminal.classList.add("terminal-visible");
      }

      function resetCards() {
        cards.forEach((card) => {
          card.classList.remove("enter", "from-left", "from-right", "from-top", "from-bottom");
        });
      }

      function playTerminal(onComplete) {
        resetTerminal();
        let index = 0;

        function typeLine() {
          if (index < terminalLines.length) {
            const line = terminalLines[index];
            let charIndex = 0;
            const interval = setInterval(() => {
              terminal.innerHTML = terminal.innerHTML.replace(/<span class="cursor"><\/span>/, "");
              terminal.innerHTML += line[charIndex];
              charIndex++;
              if (charIndex === line.length) {
                clearInterval(interval);
                terminal.innerHTML += "\n";
                index++;
                setTimeout(typeLine, 250);
              } else {
                terminal.innerHTML += '<span class="cursor"></span>';
              }
            }, 25);
          } else {
            terminal.innerHTML = terminal.innerHTML.replace(/<span class="cursor"><\/span>/, "");
            terminal.innerHTML += '<span class="cursor"></span>';
            setTimeout(() => {
              terminal.classList.remove("terminal-visible");
              terminal.classList.add("terminal-hidden");
              setTimeout(() => {
                terminal.classList.add("terminal-gone");
                if (typeof onComplete === "function") onComplete();
              }, 450);
            }, 2500);
          }
        }
        typeLine();
      }

      function animateCards() {
        cards.forEach((card) => {
          const dirs = ["from-left", "from-right", "from-top", "from-bottom"];
          const dir = dirs[Math.floor(Math.random() * dirs.length)];
          const delay = Math.random() * 500;
          card.classList.add(dir);
          setTimeout(() => card.classList.add("enter"), delay);
        });
      }

      function enableOrganic() {
        cards.forEach((card) => {
          const t = 4 + Math.random() * 4;
          card.style.setProperty("--t", `${t}s`);
          card.classList.add("organic");
        });
      }

      function disableOrganic() {
        cards.forEach((card) => card.classList.remove("organic"));
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.target === worksTrigger) {
            if (entry.isIntersecting) {
              resetCards();
              disableOrganic();
              playTerminal(() => {
                animateCards();
                enableOrganic();
              });
            } else {
              disableOrganic();
            }
          }
        });
      }, { threshold: 0.4 });

      observer.observe(worksTrigger);
    })();

    /* ---------- PARALLAX ---------- */
    (function initParallax() {
      const items = $$(".parallax-item");
      if (!items.length) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("parallax-visible");
        });
      }, { threshold: 0.2 });

      items.forEach((item) => observer.observe(item));

      document.addEventListener("mousemove", (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        items.forEach((item) => {
          const speed = parseFloat(item.dataset.speed) || 0.6;
          item.style.transform = `translate(${x * speed * 20}px, ${y * speed * 20}px)`;
        });
      }, { passive: true });
    })();

   /* ---------- HEADER: OPEN/CLOSE + COLOR LOGIC ---------- */
if (header && headerContent && logoTrigger) {
  let lastScroll = window.scrollY || 0;

  function updateHeaderState() {
    const current = window.scrollY || 0;
    const isOpen = headerContent.classList.contains("open");
    const isTyping = header.classList.contains("header-white");

    /* -------------------------
       COLORE HEADER
       ------------------------- */

    // MENU APERTO → header bianco sempre
    if (isOpen) {
      header.classList.add("scrolled");
    }
    // MENU CHIUSO → header trasparente se sei in alto e non sta scrivendo
    else if (current < 50 && !isTyping) {
      header.classList.remove("scrolled");
    }
    // MENU CHIUSO → scroll > 50 → header bianco
    else {
      header.classList.add("scrolled");
    }

    /* -------------------------
       HIDE / SHOW HEADER
       ------------------------- */

    // se il menu è aperto → header sempre visibile
    if (isOpen) {
      header.classList.remove("hide");
      lastScroll = current;
      return;
    }

    // SCROLL DOWN → nascondi
    if (current > lastScroll && current > 80) {
      header.classList.add("hide");
    }

    // SCROLL UP → mostra SEMPRE
    else {
      header.classList.remove("hide");

      // se sei tornato in alto → header trasparente
      if (current < 50 && !isTyping) {
        header.classList.remove("scrolled");
      }
    }

    lastScroll = current;
  }

  /* CLICK LOGO */
  logoTrigger.addEventListener("click", () => {
    headerContent.classList.toggle("open");
    updateHeaderState();
  });

  /* SCROLL */
  window.addEventListener("scroll", () => {
    updateHeaderState();
  }, { passive: true });
}

    /* ---------- MICRO GLITCH ---------- */
    (function initMicroGlitch() {
      setInterval(() => {
        const logoVid = document.querySelector(".logo video");
        if (!logoVid) return;
        logoVid.classList.add("glitch");
        setTimeout(() => logoVid.classList.remove("glitch"), 200);
      }, 3500);
    })();

  });
})();
