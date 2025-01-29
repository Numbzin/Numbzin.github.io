const CONFIG = {
    ANIMATION: {
      OFFSET: 150,
      TYPING_SPEED: 150,
      DELETING_SPEED: 55,
      MESSAGE_DURATION: 5e3,
      SCROLL_THROTTLE: 100,
    },
    TYPING: {
      TEXTS: ["Front-End Developer", "Student", "Video Editor", "Autodidact"],
    },
    REGEX: {
      EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      PHONE: /^(\+\d{2}\s?)?\(?([0-9]{2})\)?[-\s]?([0-9]{5})[-\s]?([0-9]{4})$/,
    },
  },
  DOM = {
    init() {
      (this.menu = {
        icon: document.querySelector("#menu-icon"),
        navbar: document.querySelector(".navbar"),
      }),
        (this.sections = document.querySelectorAll("section")),
        (this.navLinks = document.querySelectorAll("header nav a")),
        (this.theme = {
          toggle: document.getElementById("theme-toggle"),
          body: document.body,
        }),
        (this.form = {
          container: document.getElementById("contact-form"),
          name: document.querySelector('input[name="name"]'),
          email: document.querySelector('input[name="email"]'),
          phone: document.querySelector('input[name="phone"]'),
          message: document.querySelector('textarea[name="message"]'),
        }),
        (this.typingElement = document.querySelector(
          ".typing-text .type-span"
        )),
        (this.translateButton = document.getElementById("translate-button"));
    },
  },
  Utils = {
    throttle(e, t) {
      let a;
      return function (...n) {
        a || (e.apply(this, n), (a = !0), setTimeout(() => (a = !1), t));
      };
    },
    formatPhone: (e) =>
      e
        ? e.replace(/\D/g, "").replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
        : "",
  },
  Validator = {
    errorMessages: {
      name: "Name is required",
      email: "Please enter a valid email",
      phone: "Please enter a valid phone number",
      message: "Message is required",
    },
    showError(e, t) {
      let a = document.querySelector(`#${e}-error`);
      a && ((a.textContent = t), (a.style.display = "block"));
    },
    hideError(e) {
      let t = document.querySelector(`#${e}-error`);
      t && (t.style.display = "none");
    },
    validateField(e, t) {
      let a = {
        name: () => "" !== t.trim(),
        email: () => CONFIG.REGEX.EMAIL.test(t),
        phone: () => CONFIG.REGEX.PHONE.test(t),
        message: () => "" !== t.trim(),
      };
      return !!a[e] && a[e]();
    },
  },
  AnimationController = {
    typingState: { textIndex: 0, charIndex: 0, isDeleting: !1 },
    animateTyping() {
      let { TEXTS: e } = CONFIG.TYPING,
        { textIndex: t, charIndex: a, isDeleting: n } = this.typingState,
        r = e[t];
      !n && a < r.length
        ? ((DOM.typingElement.textContent += r.charAt(a)),
          this.typingState.charIndex++)
        : n && a > 0
        ? ((DOM.typingElement.textContent = r.substring(0, a - 1)),
          this.typingState.charIndex--)
        : ((this.typingState.isDeleting = !n),
          this.typingState.isDeleting ||
            (this.typingState.textIndex = (t + 1) % e.length)),
        setTimeout(
          () => requestAnimationFrame(() => this.animateTyping()),
          n ? CONFIG.ANIMATION.DELETING_SPEED : CONFIG.ANIMATION.TYPING_SPEED
        );
    },
  },
  FormController = {
    async submitForm(e) {
      try {
        let t = await (
          await fetch(DOM.form.container.action, {
            method: DOM.form.container.method,
            body: e,
            headers: { Accept: "application/json" },
          })
        ).json();
        if (t.ok)
          this.showMessage(
            "Thank you for your message. It has been sent successfully!",
            "success"
          ),
            DOM.form.container.reset();
        else throw Error(t.error);
      } catch (a) {
        this.showMessage(
          a.message ||
            "Oops! There was a problem submitting your form. Please try again.",
          "error"
        );
      }
    },
    showMessage(e, t) {
      let a = document.createElement("div");
      (a.textContent = e),
        (a.className = `message ${t}`),
        document.querySelector(".contact").appendChild(a),
        setTimeout(() => a.remove(), CONFIG.ANIMATION.MESSAGE_DURATION);
    },
  },
  LanguageController = {
    currentLanguage: "en",
    translations: {},
    async loadTranslations() {
      try {
        let e = await fetch("lang.json");
        (this.translations = await e.json()),
          this.applyLanguage(this.currentLanguage);
      } catch (t) {
        console.error("Erro ao carregar tradu\xe7\xf5es:", t);
      }
    },
    toggleLanguage() {
      (this.currentLanguage = "en" === this.currentLanguage ? "pt" : "en"),
        this.applyLanguage(this.currentLanguage);
    },
    applyLanguage(e) {
      let t = this.translations[e];
      document.querySelectorAll("[data-translate]").forEach((e) => {
        let a = e.getAttribute("data-translate");
        t[a] &&
          ("INPUT" === e.tagName || "TEXTAREA" === e.tagName
            ? (e.placeholder = t[a])
            : "INPUT" === e.tagName && "submit" === e.type
            ? (e.value = t[a])
            : (e.textContent = t[a]));
      }),
        DOM.typingElement &&
          ((CONFIG.TYPING.TEXTS = t.typingTexts),
          (AnimationController.typingState.textIndex = 0),
          (AnimationController.typingState.charIndex = 0),
          (DOM.typingElement.textContent = ""));
    },
  },
  EventHandlers = {
    init() {
      DOM.menu.icon.addEventListener("click", () => {
        DOM.menu.icon.classList.toggle("bx-x"),
          DOM.menu.navbar.classList.toggle("active");
      }),
        (window.onscroll = Utils.throttle(() => {
          let e = window.scrollY;
          DOM.sections.forEach((t) => {
            let a = t.offsetTop - CONFIG.ANIMATION.OFFSET,
              n = t.offsetHeight,
              r = t.getAttribute("id");
            e >= a &&
              e < a + n &&
              DOM.navLinks.forEach((e) =>
                e.classList.toggle("active", e.getAttribute("href").includes(r))
              );
          });
        }, CONFIG.ANIMATION.SCROLL_THROTTLE)),
        document.body.addEventListener("click", (e) => {
          e.target.matches('a[href^="#"]') &&
            (e.preventDefault(),
            document
              .querySelector(e.target.getAttribute("href"))
              .scrollIntoView({ behavior: "smooth" }));
        }),
        Object.entries(DOM.form).forEach(([e, t]) => {
          "container" !== e &&
            t.addEventListener("keyup", (t) => {
              let a = t.target.value;
              "phone" === e && (t.target.value = Utils.formatPhone(a)),
                Validator.validateField(e, a)
                  ? Validator.hideError(e)
                  : Validator.showError(e, Validator.errorMessages[e]);
            });
        }),
        DOM.form.container.addEventListener("submit", (e) => {
          e.preventDefault();
          let t = {
            name: DOM.form.name.value.trim(),
            email: DOM.form.email.value.trim(),
            phone: DOM.form.phone.value.trim(),
            message: DOM.form.message.value.trim(),
          };
          Object.values(t).every((e, a) =>
            Validator.validateField(Object.keys(t)[a], e)
          ) && FormController.submitForm(new FormData(DOM.form.container));
        }),
        DOM.translateButton.addEventListener("click", () => {
          LanguageController.toggleLanguage();
        });
    },
  },
  ThemeController = {
    systemTheme: window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
    init() {
      this.applyTheme(this.systemTheme),
        document
          .getElementById("theme-toggle")
          .addEventListener("click", () => {
            let e = document.body.classList.contains("light-mode")
              ? "dark"
              : "light";
            this.applyTheme(e);
          });
    },
    applyTheme(e) {
      document.body.classList.toggle("dark-mode", "dark" === e),
        document.body.classList.toggle("light-mode", "light" === e),
        document
          .getElementById("theme-icon")
          .classList.toggle("fa-sun", "light" === e),
        document
          .getElementById("theme-icon")
          .classList.toggle("fa-moon", "dark" === e);
    },
  };
document.addEventListener("DOMContentLoaded", () => {
  DOM.init(),
    EventHandlers.init(),
    AnimationController.animateTyping(),
    LanguageController.loadTranslations(),
    ThemeController.init();
});
