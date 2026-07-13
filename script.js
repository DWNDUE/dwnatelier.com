document.addEventListener("DOMContentLoaded", () => {
  /* HEADER COLOR ON SCROLL */
  const header = document.getElementById("site-header");
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 50);
  });

  /* TYPEWRITER */
  const text = "I'M NOT A DESIGNER\nI'M AN IMPULSIVE CREATIVE";
  const target = document.getElementById("typewriter");
  let i = 0;

  function type() {
    if (i < text.length) {
      const char = text.charAt(i);
      target.innerHTML += char === "\n" ? "<br>" : char;
      i++;
      setTimeout(type, 60);
    } else {
      setTimeout(() => {
        target.innerHTML = "";
        i = 0;
        type();
      }, 2000);
    }
  }
  type();

  /* CURSORE PERSONALIZZATO ✦ + TRAIL */
  const cursor = document.createElement("div");
  cursor.classList.add("custom-cursor");
  cursor.textContent = "✦";
  document.body.appendChild(cursor);

  document.addEventListener("mousemove", (e) => {
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;

    const trail = document.createElement("div");
    trail.classList.add("cursor-trail");
    trail.style.left = `${e.clientX}px`;
    trail.style.top = `${e.clientY}px`;
    document.body.appendChild(trail);
    setTimeout(() => trail.remove(), 400);
  });

  /* SHUFFLE WORKS (masonry) */
  setInterval(() => {
    const grid = document.querySelector(".masonry");
    if (!grid) return;
    const items = Array.from(grid.children);
    if (!items.length) return;
    const random = items[Math.floor(Math.random() * items.length)];
    grid.appendChild(random);
  }, 7000);
});


/* HEADER MOSTRA/NASCONDI IN BASE ALLO SCROLL */
let lastScroll = 0;

window.addEventListener("scroll", () => {
  const current = window.scrollY;
  const header = document.getElementById("site-header");
  const headerContent = document.getElementById("header-content");

  // SE IL MENU È APERTO → NON NASCONDERE MAI L'HEADER
  if (headerContent.classList.contains("open")) {
    header.classList.remove("hide");
    lastScroll = current;
    return;
  }

  // SE IL MENU È CHIUSO → COMPORTAMENTO NORMALE
  if (current > lastScroll && current > 80) {
    header.classList.add("hide");
  } else {
    header.classList.remove("hide");
  }

  lastScroll = current;
});

/* SCROLL SOLO VERSO IL BASSO TRA HERO → WORKS */
let isScrolling = false;

function scrollToSection(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  isScrolling = true;
  window.scrollTo({
    top: el.offsetTop,
    behavior: "smooth",
  });
  setTimeout(() => (isScrolling = false), 600);
}

window.addEventListener("wheel", (e) => {
  if (isScrolling) return;

  const y = window.scrollY;
  const goingDown = e.deltaY > 0;

  const hero = document.querySelector("#hero");
  const works = document.querySelector("#works");

  const heroEnd = hero.offsetHeight;

  // HERO → WORKS (solo verso il basso)
  if (goingDown && y < heroEnd - 50) {
    scrollToSection("#works");
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".work-card");
  const trigger = document.querySelector("#works-trigger");
  const terminal = document.querySelector("#terminal-log");

  if (!trigger || cards.length === 0 || !terminal) return;

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
      card.classList.remove(
        "enter",
        "from-left",
        "from-right",
        "from-top",
        "from-bottom",
      );
    });
  }

  function playTerminal(onComplete) {
    resetTerminal();
    let index = 0;

    function typeLine() {
      if (index < terminalLines.length) {
        let line = terminalLines[index];
        let charIndex = 0;

        let interval = setInterval(() => {
          terminal.innerHTML = terminal.innerHTML.replace(
            /<span class="cursor"><\/span>/,
            "",
          );
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
        terminal.innerHTML = terminal.innerHTML.replace(
          /<span class="cursor"><\/span>/,
          "",
        );
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

      setTimeout(() => {
        card.classList.add("enter");
      }, delay);
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
    cards.forEach((card) => {
      card.classList.remove("organic");
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.target === trigger) {
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
    },
    { threshold: 0.4 },
  );

  observer.observe(trigger);
});
document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".parallax-item");

  // ENTRATA ANIMATA
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("parallax-visible");
        }
      });
    },
    { threshold: 0.2 },
  );

  items.forEach((item) => observer.observe(item));

  // PARALLAX LEGGERO
  document.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    items.forEach((item) => {
      const speed = parseFloat(item.dataset.speed);
      item.style.transform = `translate(${x * speed * 20}px, ${y * speed * 20}px)`;
    });
  });
});

/* HEADER OPEN/CLOSE VIA LOGO */
const headerContent = document.getElementById("header-content");
const logoTrigger = document.getElementById("logo-trigger");

logoTrigger.addEventListener("click", () => {
  headerContent.classList.toggle("open");
});

/* MICRO-GLITCH RANDOM SUL LOGO */
setInterval(() => {
  const logoVid = document.querySelector(".logo video");
  logoVid.classList.add("glitch");
  setTimeout(() => logoVid.classList.remove("glitch"), 200);
}, 3500);
