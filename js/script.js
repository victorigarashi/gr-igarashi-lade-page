const whatsappNumber = "554399315130";

const header = document.querySelector("[data-header]");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-link");
const whatsappLinks = document.querySelectorAll("[data-whatsapp]");
const revealItems = document.querySelectorAll(".reveal");
const sections = document.querySelectorAll("main section[id]");

const buildWhatsappUrl = (message) => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

const getPreviousPartsHeading = (element) => {
  let current = element.previousElementSibling;

  while (current) {
    if (current.classList?.contains("parts-head")) {
      return current.querySelector("h4")?.textContent.trim();
    }

    current = current.previousElementSibling;
  }

  return "";
};

const getWhatsappMessage = (link) => {
  if (link.dataset.message) return link.dataset.message;

  const partCard = link.closest(".part-card");

  if (partCard) {
    const partName = partCard.querySelector("h5")?.textContent.trim();
    const category = partCard.querySelector("span")?.textContent.trim();
    const lineName = getPreviousPartsHeading(partCard.parentElement).replace("Peças disponíveis — ", "");

    return `Olá, gostaria de um orçamento para ${partName}${category ? ` (${category})` : ""}${lineName ? ` da ${lineName}` : ""}.`;
  }

  const partsHead = link.closest(".parts-head");

  if (partsHead) {
    const catalogName = partsHead.querySelector("h4")?.textContent.trim().replace("Peças disponíveis — ", "");
    return `Olá, gostaria de ver o catálogo completo${catalogName ? ` da ${catalogName}` : ""}.`;
  }

  const lineContent = link.closest(".line-content");

  if (lineContent) {
    const lineName = lineContent.querySelector("h3")?.textContent.trim();
    return `Olá, gostaria de um orçamento para peças e serviços da ${lineName}.`;
  }

  if (link.closest(".hero")) {
    return link.classList.contains("btn-red")
      ? "Olá, gostaria de solicitar um orçamento com a GR Igarashi."
      : "Olá, gostaria de falar com a GR Igarashi sobre peças automotivas.";
  }

  if (link.closest(".cta")) {
    return "Olá, não encontrei a peça que preciso no site. Pode me ajudar a localizar?";
  }

  if (link.closest(".footer")) {
    return "Olá, vim pelo site da GR Igarashi e gostaria de atendimento pelo WhatsApp.";
  }

  if (link.classList.contains("float-whatsapp")) {
    return "Olá, vim pelo site da GR Igarashi e gostaria de atendimento rápido.";
  }

  if (link.classList.contains("header-whatsapp")) {
    return "Olá, vim pelo site da GR Igarashi e gostaria de falar com um atendente.";
  }

  return "Olá, gostaria de um orçamento.";
};

whatsappLinks.forEach((link) => {
  link.href = buildWhatsappUrl(getWhatsappMessage(link));
  link.target = "_blank";
  link.rel = "noopener noreferrer";
});

const closeMenu = () => {
  document.body.classList.remove("nav-open");
  navMenu?.classList.remove("is-open");
  navToggle?.classList.remove("is-active");
  navToggle?.setAttribute("aria-expanded", "false");
};

navToggle?.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("is-open");
  document.body.classList.toggle("nav-open", isOpen);
  navToggle.classList.toggle("is-active", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const updateHeader = () => {
  header?.classList.toggle("scrolled", window.scrollY > 20);
};

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  {
    rootMargin: "-45% 0px -48% 0px",
    threshold: 0,
  }
);

sections.forEach((section) => activeObserver.observe(section));

document.querySelectorAll(".btn").forEach((button) => {
  button.addEventListener("click", (event) => {
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement("span");

    ripple.className = "ripple";
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;

    button.appendChild(ripple);
    window.setTimeout(() => ripple.remove(), 620);
  });
});
