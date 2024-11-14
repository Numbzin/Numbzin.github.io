const CONFIG = {
  ANIMATION: {
    OFFSET: 150,
    TYPING_SPEED: 150,
    DELETING_SPEED: 55,
    MESSAGE_DURATION: 5000,
    SCROLL_THROTTLE: 100,
  },
  TYPING: {
    TEXTS: ["Front-End Developer", "Student", "Video Editor", "Autodidact"],
  },
  REGEX: {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^(\+\d{2}\s?)?\(?([0-9]{2})\)?[-\s]?([0-9]{5})[-\s]?([0-9]{4})$/,
  },
};

const DOM = {
  init() {
    this.menu = {
      icon: document.querySelector("#menu-icon"),
      navbar: document.querySelector(".navbar"),
    };
    this.sections = document.querySelectorAll("section");
    this.navLinks = document.querySelectorAll("header nav a");
    this.theme = {
      toggle: document.getElementById("theme-toggle"),
      body: document.body,
    };
    this.form = {
      container: document.getElementById("contact-form"),
      name: document.querySelector('input[name="name"]'),
      email: document.querySelector('input[name="email"]'),
      phone: document.querySelector('input[name="phone"]'),
      message: document.querySelector('textarea[name="message"]'),
    };
    this.typingElement = document.querySelector(".typing-text span");
  },
};

const Utils = {
  throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  formatPhone(phone) {
    if (!phone) return "";

    const isInternational = phone[0] === "+";
    const numbers = isInternational
      ? phone.slice(1).replace(/\D/g, "")
      : phone.replace(/\D/g, "");

    if (isInternational) {
      const countryCode = numbers.slice(0, 2);
      const remaining = numbers.slice(2, 13);

      let formatted = `+${countryCode}`;
      if (remaining.length > 0) {
        formatted += ` (${remaining.slice(0, 2)})`;
        if (remaining.length > 2) {
          formatted += ` ${remaining.slice(2, 7)}`;
          if (remaining.length > 7) {
            formatted += `-${remaining.slice(7)}`;
          }
        }
      }
      return formatted;
    } else {
      const local = numbers.slice(0, 11);
      if (local.length <= 2) return local;

      let formatted = `(${local.slice(0, 2)})`;
      if (local.length > 2) {
        formatted += ` ${local.slice(2, 7)}`;
        if (local.length > 7) {
          formatted += `-${local.slice(7)}`;
        }
      }
      return formatted;
    }
  },
};

const Validator = {
  errorMessages: {
    name: "Name is required",
    email: "Please enter a valid email",
    phone: "Please enter a valid phone number",
    message: "Message is required",
  },

  showError(field, message) {
    const errorElement = document.querySelector(`#${field}-error`);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = "block";
    }
  },

  hideError(field) {
    const errorElement = document.querySelector(`#${field}-error`);
    if (errorElement) {
      errorElement.style.display = "none";
    }
  },

  validateField(field, value) {
    const rules = {
      name: () => value.trim() !== "",
      email: () => CONFIG.REGEX.EMAIL.test(value),
      phone: () => CONFIG.REGEX.PHONE.test(value),
      message: () => value.trim() !== "",
    };
    return rules[field] ? rules[field]() : false;
  },

  validateAll(fields) {
    return Object.entries(fields).every(([field, value]) =>
      this.validateField(field, value)
    );
  },
};

const AnimationController = {
  typingState: {
    textIndex: 0,
    charIndex: 0,
    isDeleting: false,
  },

  async startTypingEffect() {
    const { TEXTS } = CONFIG.TYPING;
    const { TYPING_SPEED, DELETING_SPEED } = CONFIG.ANIMATION;
    const { textIndex, charIndex, isDeleting } = this.typingState;
    const currentText = TEXTS[textIndex];

    if (!DOM.typingElement) return;

    if (!isDeleting && charIndex < currentText.length) {
      DOM.typingElement.textContent += currentText.charAt(charIndex);
      this.typingState.charIndex++;
    } else if (isDeleting && charIndex > 0) {
      DOM.typingElement.textContent = currentText.substring(0, charIndex - 1);
      this.typingState.charIndex--;
    } else {
      this.typingState.isDeleting = !isDeleting;
      if (!this.typingState.isDeleting) {
        this.typingState.textIndex = (textIndex + 1) % TEXTS.length;
      }
    }

    const speed = isDeleting ? DELETING_SPEED : TYPING_SPEED;
    setTimeout(() => this.startTypingEffect(), speed);
  },
};

const FormController = {
  async submitForm(formData) {
    try {
      const response = await fetch(DOM.form.container.action, {
        method: DOM.form.container.method,
        body: formData,
        headers: { Accept: "application/json" },
      });

      const data = await response.json();

      if (data.ok) {
        this.showMessage(
          "Thank you for your message. It has been sent successfully!",
          "success"
        );
        DOM.form.container.reset();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      this.showMessage(
        error.message ||
          "Oops! There was a problem submitting your form. Please try again.",
        "error"
      );
    }
  },

  showMessage(message, type) {
    const messageElement = document.createElement("div");
    messageElement.textContent = message;
    messageElement.className = `message ${type}`;

    document.querySelector(".contact").appendChild(messageElement);
    setTimeout(
      () => messageElement.remove(),
      CONFIG.ANIMATION.MESSAGE_DURATION
    );
  },
};

const ThemeController = {
  systemTheme: window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light",

  init() {
    this.applyTheme(this.systemTheme);
    document.getElementById("theme-toggle").addEventListener("click", () => {
      const newTheme = document.body.classList.contains("light-mode")
        ? "dark"
        : "light";
      this.applyTheme(newTheme);
    });
  },

  applyTheme(theme) {
    document.body.classList.toggle("dark-mode", theme === "dark");
    document.body.classList.toggle("light-mode", theme === "light");
    document
      .getElementById("theme-icon")
      .classList.toggle("fa-sun", theme === "light");
    document
      .getElementById("theme-icon")
      .classList.toggle("fa-moon", theme === "dark");
  },
};

const EventHandlers = {
  init() {
    DOM.menu.icon.addEventListener("click", () => {
      DOM.menu.icon.classList.toggle("bx-x");
      DOM.menu.navbar.classList.toggle("active");
    });

    window.onscroll = Utils.throttle(() => {
      const top = window.scrollY;
      DOM.sections.forEach((sec) => {
        const offset = sec.offsetTop - CONFIG.ANIMATION.OFFSET;
        const height = sec.offsetHeight;
        const id = sec.getAttribute("id");

        if (top >= offset && top < offset + height) {
          DOM.navLinks.forEach((link) =>
            link.classList.toggle(
              "active",
              link.getAttribute("href").includes(id)
            )
          );
        }
      });
    }, CONFIG.ANIMATION.SCROLL_THROTTLE);

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        document
          .querySelector(anchor.getAttribute("href"))
          .scrollIntoView({ behavior: "smooth" });
      });
    });

    Object.entries(DOM.form).forEach(([field, element]) => {
      if (field === "container") return;

      element.addEventListener("keyup", (e) => {
        const value = e.target.value;

        if (field === "phone") {
          e.target.value = Utils.formatPhone(value);
        }

        Validator.validateField(field, value)
          ? Validator.hideError(field)
          : Validator.showError(field, Validator.errorMessages[field]);
      });
    });

    DOM.form.container.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = {
        name: DOM.form.name.value.trim(),
        email: DOM.form.email.value.trim(),
        phone: DOM.form.phone.value.trim(),
        message: DOM.form.message.value.trim(),
      };

      if (Validator.validateAll(formData)) {
        FormController.submitForm(new FormData(DOM.form.container));
      } else {
        Object.entries(formData).forEach(([field, value]) => {
          if (!Validator.validateField(field, value)) {
            Validator.showError(field, Validator.errorMessages[field]);
          }
        });
      }
    });
  },
};

document.addEventListener("DOMContentLoaded", () => {
  DOM.init();
  EventHandlers.init();
  AnimationController.startTypingEffect();
  ThemeController.init();
});
