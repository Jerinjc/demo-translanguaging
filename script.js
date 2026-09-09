document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("site-menu");

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    menu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  /*
    Optional engagement tracking:
    If Google Analytics 4 is installed, track important actions as events.
    Do NOT create fake pageviews for every scroll section; use section_view events
    for engagement instead.
  */
  document.querySelectorAll('a[href="#strategies"], a[href="#research"], a[href="#book"]').forEach(link => {
    link.addEventListener("click", () => {
      if (typeof gtag === "function") {
        gtag("event", "content_navigation", {
          section: link.getAttribute("href")
        });
      }
    });
  });

  const sections = document.querySelectorAll("main section[id]");
  const viewed = new Set();

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
          const id = entry.target.id;
          if (!viewed.has(id)) {
            viewed.add(id);
            if (typeof gtag === "function") {
              gtag("event", "section_view", {
                section_id: id,
                section_title: entry.target.querySelector("h2")?.textContent || id
              });
            }
          }
        }
      });
    }, { threshold: [0.35] });

    sections.forEach(section => observer.observe(section));
  }

  /*
    Scroll-spy: keep the address bar hash in sync with whichever section
    is currently centered in the viewport. Uses a thin horizontal band
    around the vertical middle of the screen so only one section is
    "active" at a time. replaceState (not pushState) is used so this
    never adds entries to browser history or triggers a jump/scroll.
  */
  if ("IntersectionObserver" in window && "history" in window) {
    let activeId = null;
    const spyObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (id && id !== activeId) {
            activeId = id;
            history.replaceState(null, "", `#${id}`);
          }
        }
      });
    }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });

    sections.forEach(section => spyObserver.observe(section));
  }

  /*
    Track the external book-purchase click as an engagement/conversion event.
  */
  document.querySelectorAll('a[href*="amazon.com"]').forEach(link => {
    link.addEventListener("click", () => {
      if (typeof gtag === "function") {
        gtag("event", "book_purchase_click", {
          destination: "Amazon"
        });
      }
    });
  });
});