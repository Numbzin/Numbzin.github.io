const OFFSET = 150;
const TYPING_SPEED = 150;
const DELETING_SPEED = 50;

// Selecting DOM elements
const menuIcon = document.querySelector("#menu-icon");
const navbar = document.querySelector(".navbar");
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("header nav a");
const contactForm = document.getElementById("contact-form");
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

// Function to set the active link in the navigation
const setActiveLink = (id) => {
  navLinks.forEach((link) => {
    link.classList.remove("active");
  });
  const activeLink = document.querySelector(`header nav a[href*='${id}']`);
  if (activeLink) activeLink.classList.add("active");
};

// Function to validate the form
const validateForm = (name, email, phone, message) => {
  return {
    isValid: !!(name && email && phone && message),
    emailValid: isValidEmail(email),
    phoneValid: isValidPhone(phone),
  };
};

// Function to validate email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Function to validate phone
const isValidPhone = (phone) => {
  const phoneRegex = /^\d{10,}$/;
  return phoneRegex.test(phone);
};

// Function to submit the form
const submitForm = async () => {
  const formData = new FormData(contactForm);

  try {
    const response = await fetch(contactForm.action, {
      method: contactForm.method,
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });
    const data = await response.json();

    if (data.ok) {
      showMessage(
        "Thank you for your message. It has been sent successfully!",
        "success"
      );
      contactForm.reset();
    } else {
      showMessage(
        data.error ||
          "Oops! There was a problem submitting your form. Please try again.",
        "error"
      );
    }
  } catch (error) {
    showMessage(
      "Oops! There was a problem submitting your form. Please try again.",
      "error"
    );
  }
};

const showMessage = (message, type) => {
  const messageElement = document.createElement("div");
  messageElement.textContent = message;
  messageElement.className = `message ${type}`;

  const contactSection = document.querySelector(".contact");
  contactSection.appendChild(messageElement);

  setTimeout(() => {
    messageElement.remove();
  }, 5000);
};


function throttle(func, limit) {
  let lastFunc;
  let lastRan;
  return function () {
    const context = this;
    const args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function () {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

const typeEffect = () => {
  const texts = [
    "Front-End Developer",
    "Student",
    "Video Editor",
    "Autodidact",
  ];
  const typingElement = document.querySelector(".typing-text span");
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const type = () => {
    const currentText = texts[textIndex];
    const typingSpeed = isDeleting ? DELETING_SPEED : TYPING_SPEED;

    if (!isDeleting && charIndex < currentText.length) {
      typingElement.textContent += currentText.charAt(charIndex);
      charIndex++;
    } else if (isDeleting && charIndex > 0) {
      typingElement.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      isDeleting = !isDeleting;
      if (!isDeleting) {
        textIndex = (textIndex + 1) % texts.length;
      }
    }

    setTimeout(type, typingSpeed);
  };

  type();
};

const updateThemeIcon = () => {
  const icon = themeToggle.querySelector("i");
  icon.classList.toggle("fa-moon");
  icon.classList.toggle("fa-sun");
};

document.addEventListener("DOMContentLoaded", () => {
  menuIcon.addEventListener("click", () => {
    menuIcon.classList.toggle("bx-x");
    navbar.classList.toggle("active");
  });

  window.onscroll = throttle(() => {
    let top = window.scrollY;
    sections.forEach((sec) => {
      let offset = sec.offsetTop - OFFSET;
      let height = sec.offsetHeight;
      let id = sec.getAttribute("id");

      if (top >= offset && top < offset + height) {
        setActiveLink(id);
      }
    });
  }, 100);

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });
    });
  });

  typeEffect();

  themeToggle.addEventListener("click", () => {
    body.classList.toggle("light-mode");
    updateThemeIcon();
  });

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.querySelector('input[name="name"]').value.trim();
    const email = document.querySelector('input[name="email"]').value.trim();
    const phone = document.querySelector('input[name="phone"]').value.trim();
    const message = document
      .querySelector('textarea[name="message"]')
      .value.trim();

    const { isValid, emailValid, phoneValid } = validateForm(
      name,
      email,
      phone,
      message
    );

    if (!isValid) {
      showMessage("Please fill in all required fields.", "error");
      return;
    }

    if (!emailValid) {
      showMessage("Please enter a valid email address.", "error");
      return;
    }

    if (!phoneValid) {
      showMessage("Please enter a valid phone number.", "error");
      return;
    }

    submitForm();
  });
});
