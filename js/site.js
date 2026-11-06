/* Dummy stand-ins. Replace with confirmed details when Valyant has them.
   Leave formEndpoint empty until a real submission URL is confirmed. */
const VALYANT = {
  email: "info@valyant.com",
  phone: "99000 99000",
  location: "18, Lake View Street, Pammal, Chennai 600075",
  industries: [
    "Product engineering",
    "IT services",
    "Healthcare technology",
    "Banking systems"
  ],
  formEndpoint: ""
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function applyContact() {
  document.querySelectorAll("[data-contact='email']").forEach((node) => {
    node.textContent = VALYANT.email;
    if (node.tagName === "A") node.href = "mailto:" + VALYANT.email;
  });
  document.querySelectorAll("[data-contact='phone']").forEach((node) => {
    node.textContent = VALYANT.phone;
    if (node.tagName === "A") node.href = "tel:" + VALYANT.phone.replace(/[^\d+]/g, "");
  });
  document.querySelectorAll("[data-contact='location']").forEach((node) => {
    node.textContent = VALYANT.location;
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

function scrollToId(id) {
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
}

function setPressed(group, selected) {
  group.forEach((button) => {
    const on = button === selected;
    button.classList.toggle("is-selected", on);
    button.setAttribute("aria-pressed", on ? "true" : "false");
  });
}

function setupFlow() {
  const interest = document.getElementById("interest");
  const roleNote = document.getElementById("role-note");
  const message = document.getElementById("message");
  const situation = document.getElementById("situation");
  const roleSection = document.getElementById("role");
  const needButtons = [...document.querySelectorAll("[data-need]")];
  const roleButtons = [...document.querySelectorAll("[data-role]")];
  const hiringNeed = needButtons.find((button) => button.getAttribute("data-need") === "Hiring support");

  needButtons.forEach((button) => {
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", () => {
      const need = button.getAttribute("data-need");
      const isHiring = need === "Hiring support";
      interest.value = need;
      setPressed(needButtons, button);
      if (!isHiring) {
        setPressed(roleButtons, null);
        roleNote.value = "";
      }
      roleSection.hidden = isHiring;
      if (isHiring) {
        scrollToId("services");
        document.getElementById("services-title").focus({ preventScroll: true });
      } else {
        scrollToId("role");
        document.getElementById("role-title").focus({ preventScroll: true });
      }
    });
  });

  roleButtons.forEach((button) => {
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", () => {
      if (hiringNeed) setPressed(needButtons, hiringNeed);
      interest.value = "Hiring support";
      roleSection.hidden = true;
      roleNote.value = button.getAttribute("data-role");
      setPressed(roleButtons, button);
      scrollToId("enquiry");
      roleNote.focus({ preventScroll: true });
    });
  });

  situation.addEventListener("input", () => {
    roleNote.value = situation.value;
  });

  document.getElementById("continue-role").addEventListener("click", () => {
    const text = situation.value.trim();
    roleNote.value = text;
    if (text && message.value.trim().length < 12) message.value = text;
    scrollToId("enquiry");
    if (!text) situation.focus();
    else document.getElementById("name").focus({ preventScroll: true });
  });

  document.getElementById("role-title").setAttribute("tabindex", "-1");
  document.getElementById("services-title").setAttribute("tabindex", "-1");
}

function setupMotion() {
  if (reduceMotion) return;
  const flow = document.querySelector(".flow");
  if (flow) {
    const updateThread = () => {
      const rect = flow.getBoundingClientRect();
      const start = window.innerHeight * 0.82;
      const total = rect.height + window.innerHeight * 0.2;
      const seen = start - rect.top;
      const progress = Math.min(1, Math.max(0, seen / total));
      flow.style.setProperty("--thread-scale", progress.toFixed(3));
    };
    updateThread();
    window.addEventListener("scroll", updateThread, { passive: true });
    window.addEventListener("resize", updateThread);
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

function validateField(input) {
  const value = input.value.trim();
  if (input.id === "name" && value.length < 2) return "Enter your name.";
  if (input.id === "email") {
    if (!value) return "Enter a work email address.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "That email doesn’t look complete.";
  }
  if (input.id === "interest" && !value) return "Choose what you’re interested in.";
  if (input.id === "message" && value.length < 12) return "Add a few words about what you need.";
  if (input.id === "company" && value.length > 120) return "Use a shorter company name.";
  return "";
}

function setupForm() {
  const form = document.getElementById("enquiry-form");
  if (!form) return;
  const status = document.getElementById("form-status");
  const submit = form.querySelector("[type='submit']");
  const fields = ["name", "email", "company", "interest", "role-note", "message"]
    .map((id) => document.getElementById(id));

  const showStatus = (text, kind) => {
    status.hidden = false;
    status.className = "form-status is-" + kind;
    status.textContent = text;
  };

  fields.forEach((input) => {
    if (!input) return;
    input.addEventListener("input", () => {
      if (input.getAttribute("aria-invalid") === "true") fieldError(input, validateField(input));
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    let firstInvalid = null;
    fields.forEach((input) => {
      if (!input) return;
      const problem = validateField(input);
      fieldError(input, problem);
      if (problem && !firstInvalid) firstInvalid = input;
    });

    if (firstInvalid) {
      showStatus("Check the highlighted fields and try again.", "error");
      firstInvalid.focus();
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

    submit.disabled = true;
    try {
      const response = await fetch(VALYANT.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: document.getElementById("name").value.trim(),
          email: document.getElementById("email").value.trim(),
          company: document.getElementById("company").value.trim(),
          interest: document.getElementById("interest").value,
          role: document.getElementById("role-note").value.trim(),
          message: document.getElementById("message").value.trim()
        })
      });
      if (!response.ok) throw new Error("Request failed");
      form.reset();
      showStatus("Your enquiry has been sent. The team will follow up using the details you provided.", "sent");
    } catch (error) {
      showStatus("The enquiry could not be sent. Try again, or email " + VALYANT.email + ".", "error");
    } finally {
      submit.disabled = false;
      status.focus();
    }
  });
}

applyContact();
setupNav();
setupFlow();
setupForm();
setupMotion();
