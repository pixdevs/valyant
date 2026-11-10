/* Dummy stand-ins. Replace with confirmed details when Valyant has them.
   Leave formEndpoint empty until a real submission URL is confirmed.
   atsUrl is a placeholder until the live ATS / careers system URL is available. */
const VALYANT = {
  email: "info@valyant.com",
  phone: "99000 99000",
  location: "18, Lake View Street, Pammal, Chennai 600075",
  formEndpoint: "",
  atsUrl: "https://example.com/ats"
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function applyContact() {
  document.querySelectorAll("[data-contact='email']").forEach((node) => {
    node.textContent = VALYANT.email;
    if (node.tagName === "A") node.href = "mailto:" + VALYANT.email;
  });

  document.querySelectorAll("[data-contact='resume-email']").forEach((node) => {
    if (node.tagName === "A") {
      node.href = "mailto:" + VALYANT.email + "?subject=" + encodeURIComponent("Resume for Valyant talent pool");
    }
  });

  document.querySelectorAll("[data-contact='phone']").forEach((node) => {
    node.textContent = VALYANT.phone;
    if (node.tagName === "A") node.href = "tel:" + VALYANT.phone.replace(/[^\d+]/g, "");
  });

  document.querySelectorAll("[data-contact='location']").forEach((node) => {
    node.textContent = VALYANT.location;
  });

  document.querySelectorAll("[data-ats]").forEach((node) => {
    if (node.tagName === "A") node.href = VALYANT.atsUrl;
  });
}

function setupNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  if (!toggle || !nav) return;

  const close = () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  };

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("nav-open", open);
  });

  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", close));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      close();
      toggle.focus();
    }
  });

  window.matchMedia("(min-width: 801px)").addEventListener("change", (event) => {
    if (event.matches) close();
  });
}

function setupHeaderTheme() {
  const header = document.querySelector(".site-header");
  const hero = document.querySelector(".hero");
  if (!header || !hero || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      header.classList.toggle("is-over-hero", entry.isIntersecting);
    });
  }, { rootMargin: "-64px 0px 0px 0px", threshold: 0 });

  observer.observe(hero);
  header.classList.add("is-over-hero");
}

function setupEnquire() {
  const toggle = document.getElementById("enquire-toggle");
  const panel = document.getElementById("enquiry-panel");
  const label = document.querySelector("[data-enquire-label]");
  if (!toggle || !panel) return;

  const setOpen = (open) => {
    panel.hidden = !open;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (label) label.textContent = open ? "Close form" : "Open form";
  };

  toggle.addEventListener("click", () => {
    setOpen(panel.hidden);
  });

  document.querySelectorAll("[data-open-form]").forEach((link) => {
    link.addEventListener("click", () => {
      setOpen(true);
    });
  });

  if (window.location.hash === "#enquire") setOpen(true);
}

function setupAudience() {
  const options = [...document.querySelectorAll("[data-audience]")];
  const emailLabel = document.querySelector("[data-label-email]");
  const businessFields = document.querySelectorAll("[data-business-field]");
  const professionalFields = document.querySelectorAll("[data-professional-field]");
  const businessActions = document.querySelector("[data-business-actions]");
  const professionalActions = document.querySelector("[data-professional-actions]");
  const interest = document.getElementById("interest");
  const message = document.getElementById("message");
  let audience = "business";

  const apply = (next) => {
    audience = next;
    options.forEach((button) => {
      const on = button.getAttribute("data-audience") === next;
      button.classList.toggle("is-selected", on);
      button.setAttribute("aria-pressed", on ? "true" : "false");
    });

    const isBusiness = next === "business";
    businessFields.forEach((field) => { field.hidden = !isBusiness; });
    professionalFields.forEach((field) => { field.hidden = isBusiness; });
    if (businessActions) businessActions.hidden = !isBusiness;
    if (professionalActions) professionalActions.hidden = isBusiness;
    if (emailLabel) emailLabel.textContent = isBusiness ? "Work email" : "Email";
    if (interest) interest.required = isBusiness;
    if (message) message.required = isBusiness;
    document.body.dataset.audience = next;
  };

  options.forEach((button) => {
    button.addEventListener("click", () => apply(button.getAttribute("data-audience")));
  });

  apply("business");

  return () => audience;
}

function setupMarquee() {
  const root = document.querySelector("[data-marquee]");
  if (!root) return;
  const track = root.querySelector(".client-track");
  if (!track) return;

  const rail = document.createElement("div");
  rail.className = "client-rail";
  root.appendChild(rail);
  rail.appendChild(track);

  if (reduceMotion) return;

  const clone = track.cloneNode(true);
  clone.setAttribute("aria-hidden", "true");
  rail.appendChild(clone);
  root.classList.add("is-animated");
}

function setupMotion() {
  if (reduceMotion) {
    document.querySelectorAll(".reveal").forEach((node) => node.classList.add("is-in"));
    return;
  }

  const reveals = document.querySelectorAll(".reveal");
  if (!reveals.length || !("IntersectionObserver" in window)) {
    reveals.forEach((node) => node.classList.add("is-in"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

  reveals.forEach((node) => observer.observe(node));
}

function fieldError(input, message) {
  const error = document.getElementById(input.id + "-error");
  if (!error) return;
  if (message) {
    error.hidden = false;
    error.textContent = message;
    input.setAttribute("aria-invalid", "true");
    input.setAttribute("aria-describedby", error.id);
  } else {
    error.hidden = true;
    error.textContent = "";
    input.removeAttribute("aria-invalid");
    input.removeAttribute("aria-describedby");
  }
}

function validateField(input, audience) {
  const value = input.value.trim();
  if (input.id === "name" && value.length < 2) return "Enter your name.";
  if (input.id === "email") {
    if (!value) return audience === "business" ? "Enter a work email address." : "Enter an email address.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "That email doesn’t look complete.";
  }
  if (audience === "business") {
    if (input.id === "interest" && !value) return "Choose a service interest.";
    if (input.id === "message" && value.length < 12) return "Add a few words about what you need.";
    if (input.id === "company" && value.length > 120) return "Use a shorter company name.";
  }
  return "";
}

function setupForm(getAudience) {
  const form = document.getElementById("enquiry-form");
  if (!form) return;
  const status = document.getElementById("form-status");
  const submitButtons = form.querySelectorAll("[type='submit']");

  const showStatus = (text, kind) => {
    status.hidden = false;
    status.className = "form-status is-" + kind;
    status.textContent = text;
  };

  const activeFields = () => {
    const audience = getAudience();
    if (audience === "professional") {
      return ["name", "email", "skills", "message-pro"].map((id) => document.getElementById(id));
    }
    return ["name", "email", "company", "interest", "role-note", "message"].map((id) => document.getElementById(id));
  };

  form.addEventListener("input", (event) => {
    const input = event.target;
    if (!(input instanceof HTMLElement) || !input.id) return;
    if (input.getAttribute("aria-invalid") === "true") {
      fieldError(input, validateField(input, getAudience()));
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const audience = getAudience();
    const fields = activeFields().filter(Boolean);
    let firstInvalid = null;

    fields.forEach((input) => {
      const problem = validateField(input, audience);
      fieldError(input, problem);
      if (problem && !firstInvalid) firstInvalid = input;
    });

    if (firstInvalid) {
      showStatus("Check the highlighted fields and try again.", "error");
      firstInvalid.focus();
      return;
    }

    if (audience === "professional" && !document.getElementById("message-pro").value.trim()) {
      showStatus(
        "For resumes, use Email your resume or the ATS link. Add a short note here only if you want to leave a message.",
        "hold"
      );
      status.focus();
      return;
    }

    if (!VALYANT.formEndpoint) {
      showStatus(
        "Your enquiry was not sent. This form is not connected to an inbox yet. Email " + VALYANT.email + " instead.",
        "hold"
      );
      status.focus();
      return;
    }

    submitButtons.forEach((button) => { button.disabled = true; });
    try {
      const payload = audience === "business"
        ? {
            audience,
            name: document.getElementById("name").value.trim(),
            email: document.getElementById("email").value.trim(),
            company: document.getElementById("company").value.trim(),
            interest: document.getElementById("interest").value,
            role: document.getElementById("role-note").value.trim(),
            message: document.getElementById("message").value.trim()
          }
        : {
            audience,
            name: document.getElementById("name").value.trim(),
            email: document.getElementById("email").value.trim(),
            skills: document.getElementById("skills").value.trim(),
            message: document.getElementById("message-pro").value.trim()
          };

      const response = await fetch(VALYANT.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Request failed");
      form.reset();
      showStatus("Your enquiry has been sent. The team will follow up using the details you provided.", "sent");
    } catch (error) {
      showStatus("The enquiry could not be sent. Try again, or email " + VALYANT.email + ".", "error");
    } finally {
      submitButtons.forEach((button) => { button.disabled = false; });
      status.focus();
    }
  });
}

applyContact();
setupNav();
setupHeaderTheme();
setupEnquire();
const getAudience = setupAudience();
setupForm(getAudience);
setupMarquee();
setupMotion();
