const texts = ["Front-End Developer", "Student", "Video Editor", "Autodidact"];

let speed = 100;
let pauseDuration = 1000;

const textElement = document.querySelector(".typing-text span");

let textIndex = 0;
let characterIndex = 0;
let isDeleting = false;

function typeWriter() {
  const currentText = texts[textIndex];

  if (!isDeleting && characterIndex < currentText.length) {
    textElement.textContent += currentText.charAt(characterIndex);
    characterIndex++;
    setTimeout(typeWriter, speed);
  } else if (isDeleting && characterIndex > 0) {
    textElement.textContent = currentText.substring(0, characterIndex - 1);
    characterIndex--;
    setTimeout(typeWriter, speed / 2);
  } else {
    isDeleting = !isDeleting;
    if (!isDeleting) {
      textIndex = (textIndex + 1) % texts.length;
    }
    setTimeout(typeWriter, isDeleting ? speed : pauseDuration);
  }
}

window.addEventListener("load", typeWriter);

// Smooth reveal animation for sections
const revealElements = document.querySelectorAll(".reveal");

function reveal() {
  revealElements.forEach((element) => {
    const windowHeight = window.innerHeight;
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;

    if (elementTop < windowHeight - elementVisible) {
      element.classList.add("active");
    } else {
      element.classList.remove("active");
    }
  });
}

window.addEventListener("scroll", reveal);
reveal(); // Call once to check initial state on page load

// Smooth scroll to top button
const scrollToTopBtn = document.createElement("button");
scrollToTopBtn.innerHTML = "&uarr;";
scrollToTopBtn.setAttribute("aria-label", "Scroll to top");
scrollToTopBtn.classList.add("scroll-to-top");
document.body.appendChild(scrollToTopBtn);

scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {
    scrollToTopBtn.style.display = "block";
  } else {
    scrollToTopBtn.style.display = "none";
  }
});
