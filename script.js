"use strict";

// Modal window
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");

// BUTTONS
const btnScrollTo = document.querySelector(".btn--scroll-to");
const navBtns = document.querySelectorAll(".nav__link");
const tabBtns = document.querySelectorAll(".operations__tab");
const sliderBtnLeft = document.querySelector(".slider__btn--left");
const sliderBtnRIght = document.querySelector(".slider__btn--right");

// ELEMENTS
const section1 = document.querySelector("#section--1");
const section2 = document.querySelector("#section--2");
const section3 = document.querySelector("#section--3");
const allSections = document.querySelectorAll(".section");
const navBtnsContainer = document.querySelector(".nav__links");
const tabBtnsContainer = document.querySelector(".operations__tab-container");
const tabContentsContainer = document.querySelectorAll(".operations__content");
const navbar = document.querySelector(".nav");
const header = document.querySelector(".header");
const lazyImgs = document.querySelectorAll("img[data-src]");
const slides = document.querySelectorAll(".slide");
const dotsContainer = document.querySelector(".dots");

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

// SCROLL BUTTON
btnScrollTo.addEventListener("click", (e) => {
  section1.scrollIntoView({ behavior: "smooth" });

  // Scrolling old school way

  // const coordinate = section1.getBoundingClientRect();
  // window.scrollTo({
  //   top: coordinate.top + window.scrollY,
  //   left: coordinate.left + window.scrollX,
  //   behavior: "smooth",
  // });
});

// navBtns.forEach((btn) =>
//   btn.addEventListener("click", function (e) {
//     e.preventDefault();
//     const id = this.getAttribute("href");
//     document.querySelector(id).scrollIntoView({ behavior: "smooth" });
//   })
// );

// PAGE NAVIGATION
navBtnsContainer.addEventListener("click", (e) => {
  e.preventDefault();
  // matching strategy
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

// TAB COMPONENT
tabBtnsContainer.addEventListener("click", function (e) {
  // opposite of querySelector cuz closest find the parent upward and querySelector find the children downward
  const btn = e.target.closest(".operations__tab");
  if (!btn) return;

  tabBtns.forEach((item) => item.classList.remove("operations__tab--active"));
  tabContentsContainer.forEach((item) =>
    item.classList.remove("operations__content--active")
  );

  btn.classList.add("operations__tab--active");
  document
    .querySelector(`.operations__content--${btn.dataset.tab}`)
    .classList.add("operations__content--active");
});

// MENU FADE ANIMATION
const fadeAnimation = function (e) {
  const selectedLink = e.target;
  if (selectedLink.classList.contains("nav__link")) {
    const childElements = selectedLink
      .closest(".nav")
      .querySelectorAll(".nav__link");
    childElements.forEach((item) => {
      if (item !== selectedLink) item.style.opacity = this;
    });
    const logo = selectedLink.closest(".nav").querySelector("img");
    logo.style.opacity = this;
  }
};

navbar.addEventListener("mouseover", fadeAnimation.bind(0.5));
navbar.addEventListener("mouseout", fadeAnimation.bind(1));

// const initialCoordinate = section1.getBoundingClientRect();
// window.addEventListener("scroll", () => {
//   if (window.scrollY > initialCoordinate.top) navbar.classList.add("sticky");
//   else navbar.classList.remove("sticky");
// });

// const obsCallback = (entires, observer) => {
//   entires.forEach((entry) => {
//     console.log(entry);
//   });
// };

// const obsOptions = {
//   root: null, Set null cuz interested in the entire viewport
//   this invoke the function and intersect (in & out) current viewport of the web page (start intersect at 0% and 20%)
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

// STICKY NAV
const navbarHeight = navbar.getBoundingClientRect().height;
const headerObserver = new IntersectionObserver(handleHeaderIntersection, {
  root: null,
  threshold: 0,
  rootMargin: `-${navbarHeight}px`,
}).observe(header);

function handleHeaderIntersection(entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) navbar.classList.add("sticky");
  else navbar.classList.remove("sticky");
}

// SCROLL ANIMATION
const sectionObserver = new IntersectionObserver(handleSectionsIntersection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach((section) => {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

function handleSectionsIntersection(entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
}

// LAZY LOADING IMAGES
const imageObserver = new IntersectionObserver(handleImageIntersection, {
  root: null,
  threshold: 0,
  rootMargin: "-200px",
});

lazyImgs.forEach((img) => imageObserver.observe(img));

function handleImageIntersection(entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });
  observer.unobserve(entry.target);
}

// SLIDER
const slider = () => {
  let currentSlide = 0;

  const init = () => {
    slideItems(0);
    createDots();
    activeDot(0);
  };
  init();

  function slideItems(slide) {
    slides.forEach(
      (item, index) =>
        (item.style.transform = `translateX(${100 * (index - slide)}%)`)
    );
  }

  const prevSlide = () => {
    currentSlide--;
    if (currentSlide < 0) currentSlide = slides.length - 1;
    slideItems(currentSlide);
    activeDot(currentSlide);
  };

  const nextSlide = () => {
    currentSlide++;
    if (currentSlide === slides.length) currentSlide = 0;
    slideItems(currentSlide);
    activeDot(currentSlide);
  };

  // Event handler
  sliderBtnLeft.addEventListener("click", prevSlide);
  sliderBtnRIght.addEventListener("click", nextSlide);

  function createDots() {
    slides.forEach((_, i) => {
      dotsContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide=${i}></button>`
      );
    });
  }

  function activeDot(slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  }

  dotsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset;
      slideItems(slide);
      activeDot(slide);
    }
  });

  document.addEventListener("keydown", function (e) {
    e.key === "ArrowLeft" && prevSlide();
    e.key === "ArrowRight" && nextSlide();
  });
};
slider();
