const AppConfig = {
  Animation: {
    SCROLL_OFFSET: 150,
    TYPING_DELAY: 150,
    DELETING_DELAY: 55,
    MESSAGE_DISPLAY_TIME: 5000,
    SCROLL_THROTTLE: 100,
  },
  TypingTexts: ["Front-End Developer", "Student", "Video Editor", "Autodidact"],
  ValidationPatterns: {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^(\+\d{2}\s?)?\(?([0-9]{2})\)?[-\s]?([0-9]{5})[-\s]?([0-9]{4})$/,
  },
};

const DomElements = {
  initialize() {
    this.menu = {
      toggleButton: document.querySelector("#menu-icon"),
      navigation: document.querySelector(".navbar"),
    };
    this.pageSections = document.querySelectorAll("section");
    this.navigationLinks = document.querySelectorAll("header nav a");
    this.theme = {
      toggle: document.getElementById("theme-toggle"),
      body: document.body,
    };
    this.contactForm = {
      container: document.getElementById("contact-form"),
      nameField: document.querySelector('input[name="name"]'),
      emailField: document.querySelector('input[name="email"]'),
      phoneField: document.querySelector('input[name="phone"]'),
      messageField: document.querySelector('textarea[name="message"]'),
    };
    this.typingElement = document.querySelector(".typing-text .type-span");
    this.languageToggle = document.getElementById("translate-button");
  },
};

const HelperFunctions = {
  throttle(func, delay) {
    let isThrottled = false;
    return function (...args) {
      if (!isThrottled) {
        func.apply(this, args);
        isThrottled = true;
        setTimeout(() => (isThrottled = false), delay);
      }
    };
  },

  formatPhoneNumber(phoneNumber) {
    return phoneNumber
      ? phoneNumber
          .replace(/\D/g, "")
          .replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
      : "";
  },
};

const FormValidator = {
  errorMessages: {
    name: "Name is required",
    email: "Please enter a valid email",
    phone: "Please enter a valid phone number",
    message: "Message is required",
  },

  displayError(fieldName, errorMessage) {
    const errorElement = document.querySelector(`#${fieldName}-error`);
    if (errorElement) {
      errorElement.textContent = errorMessage;
      errorElement.style.display = "block";
    }
  },

  hideError(fieldName) {
    const errorElement = document.querySelector(`#${fieldName}-error`);
    if (errorElement) {
      errorElement.style.display = "none";
    }
  },

  validateField(fieldName, value) {
    const validationRules = {
      name: () => value.trim() !== "",
      email: () => AppConfig.ValidationPatterns.EMAIL.test(value),
      phone: () => AppConfig.ValidationPatterns.PHONE.test(value),
      message: () => value.trim() !== "",
    };
    return validationRules[fieldName] ? validationRules[fieldName]() : false;
  },
};

const TypingAnimation = {
  currentState: { textIndex: 0, charIndex: 0, isDeleting: false },

  updateAnimation() {
    const { TypingTexts: texts } = AppConfig;
    const {
      textIndex: currentTextIndex,
      charIndex: currentCharIndex,
      isDeleting,
    } = this.currentState;
    const currentText = texts[currentTextIndex];

    if (!isDeleting && currentCharIndex < currentText.length) {
      DomElements.typingElement.textContent +=
        currentText.charAt(currentCharIndex);
      this.currentState.charIndex++;
    } else if (isDeleting && currentCharIndex > 0) {
      DomElements.typingElement.textContent = currentText.substring(
        0,
        currentCharIndex - 1
      );
      this.currentState.charIndex--;
    } else {
      this.currentState.isDeleting = !isDeleting;
      if (!this.currentState.isDeleting) {
        this.currentState.textIndex = (currentTextIndex + 1) % texts.length;
      }
    }

    const animationSpeed = isDeleting
      ? AppConfig.Animation.DELETING_DELAY
      : AppConfig.Animation.TYPING_DELAY;

    setTimeout(
      () => requestAnimationFrame(() => this.updateAnimation()),
      animationSpeed
    );
  },
};

const FormHandler = {
  async submitFormData(formData) {
    try {
      const response = await fetch(DomElements.contactForm.container.action, {
        method: DomElements.contactForm.container.method,
        body: formData,
        headers: { Accept: "application/json" },
      });

      const result = await response.json();

      if (result.ok) {
        this.showStatusMessage(
          "Thank you for your message. It has been sent successfully!",
          "success"
        );
        DomElements.contactForm.container.reset();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      this.showStatusMessage(
        error.message ||
          "Oops! There was a problem submitting your form. Please try again.",
        "error"
      );
    }
  },

  showStatusMessage(message, type) {
    const messageElement = document.createElement("div");
    messageElement.textContent = message;
    messageElement.className = `message ${type}`;
    document.querySelector(".contact").appendChild(messageElement);
    setTimeout(
      () => messageElement.remove(),
      AppConfig.Animation.MESSAGE_DISPLAY_TIME
    );
  },
};

const LanguageManager = {
  currentLanguage: "en",
  translations: {},

  async loadLanguageResources() {
    try {
      const response = await fetch("lang.json");
      this.translations = await response.json();
      this.updateInterfaceLanguage(this.currentLanguage);
    } catch (error) {
      console.error("Error loading translations:", error);
    }
  },

  switchLanguage() {
    this.currentLanguage = this.currentLanguage === "en" ? "pt" : "en";
    this.updateInterfaceLanguage(this.currentLanguage);
  },

  updateInterfaceLanguage(language) {
    const translatedContent = this.translations[language];

    document.querySelectorAll("[data-translate]").forEach((element) => {
      const translationKey = element.getAttribute("data-translate");
      if (!translatedContent[translationKey]) return;

      if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
        element.placeholder = translatedContent[translationKey];
      } else if (element.type === "submit") {
        element.value = translatedContent[translationKey];
      } else {
        element.textContent = translatedContent[translationKey];
      }
    });

    if (DomElements.typingElement) {
      AppConfig.TypingTexts = translatedContent.typingTexts;
      TypingAnimation.currentState = {
        textIndex: 0,
        charIndex: 0,
        isDeleting: false,
      };
      DomElements.typingElement.textContent = "";
    }
  },
};

const EventManager = {
  initialize() {
    DomElements.menu.toggleButton.addEventListener(
      "click",
      this.toggleNavigationMenu
    );

    document.addEventListener("click", this.handleOutsideClick);

    window.onscroll = HelperFunctions.throttle(
      this.handleScroll,
      AppConfig.Animation.SCROLL_THROTTLE
    );

    document.body.addEventListener("click", this.handleSmoothScroll);

    Object.entries(DomElements.contactForm).forEach(([fieldName, element]) => {
      if (fieldName !== "container") {
        element.addEventListener("keyup", this.handleFormInput);
      }
    });

    DomElements.contactForm.container.addEventListener(
      "submit",
      this.handleFormSubmit
    );

    DomElements.languageToggle.addEventListener("click", () => {
      LanguageManager.switchLanguage();
    });
  },

  toggleNavigationMenu() {
    DomElements.menu.toggleButton.classList.toggle("fa-xmark");
    DomElements.menu.navigation.classList.toggle("active");
  },

  handleOutsideClick(event) {
    const isMenuOpen = DomElements.menu.navigation.classList.contains("active");
    const clickedInsideMenu = DomElements.menu.navigation.contains(
      event.target
    );
    const clickedMenuButton = DomElements.menu.toggleButton.contains(
      event.target
    );

    if (isMenuOpen && !clickedInsideMenu && !clickedMenuButton) {
      DomElements.menu.toggleButton.classList.remove("fa-xmark");
      DomElements.menu.navigation.classList.remove("active");
    }
  },

  handleScroll() {
    const scrollPosition = window.scrollY;

    DomElements.pageSections.forEach((section) => {
      const sectionTop = section.offsetTop - AppConfig.Animation.SCROLL_OFFSET;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        DomElements.navigationLinks.forEach((link) => {
          const isActive = link.getAttribute("href").includes(sectionId);
          link.classList.toggle("active", isActive);
        });
      }
    });
  },

  handleSmoothScroll(event) {
    if (event.target.matches('a[href^="#"]')) {
      event.preventDefault();
      const targetElement = document.querySelector(
        event.target.getAttribute("href")
      );
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  },

  handleFormInput(event) {
    const fieldName = event.target.name;
    let inputValue = event.target.value;

    if (fieldName === "phone") {
      event.target.value = HelperFunctions.formatPhoneNumber(inputValue);
    }

    if (FormValidator.validateField(fieldName, inputValue)) {
      FormValidator.hideError(fieldName);
    } else {
      FormValidator.displayError(
        fieldName,
        FormValidator.errorMessages[fieldName]
      );
    }
  },

  handleFormSubmit(event) {
    event.preventDefault();
    const formData = {
      name: DomElements.contactForm.nameField.value.trim(),
      email: DomElements.contactForm.emailField.value.trim(),
      phone: DomElements.contactForm.phoneField.value.trim(),
      message: DomElements.contactForm.messageField.value.trim(),
    };

    const isValid = Object.entries(formData).every(([fieldName, value]) =>
      FormValidator.validateField(fieldName, value)
    );

    if (isValid) {
      FormHandler.submitFormData(
        new FormData(DomElements.contactForm.container)
      );
    }
  },
};

const ThemeManager = {
  systemTheme: window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light",

  initialize() {
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

    const themeIcon = document.getElementById("theme-icon");
    themeIcon.classList.toggle("fa-sun", theme === "light");
    themeIcon.classList.toggle("fa-moon", theme === "dark");
  },
};

document.addEventListener("DOMContentLoaded", () => {
  DomElements.initialize();
  EventManager.initialize();
  TypingAnimation.updateAnimation();
  LanguageManager.loadLanguageResources();
  ThemeManager.initialize();
});
