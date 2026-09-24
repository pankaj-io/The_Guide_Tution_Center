const menu = document.getElementById("menu");
const nav = document.getElementById("nav");

if (menu && nav) {
  menu.addEventListener("click", () => nav.classList.toggle("open"));
  document.querySelectorAll("nav a").forEach(a =>
    a.addEventListener("click", () => nav.classList.remove("open"))
  );
}

/* Hero carousel */
const slides = [...document.querySelectorAll(".hero-slide")];
const dots = [...document.querySelectorAll("#carouselDots button")];
const prev = document.getElementById("prevSlide");
const next = document.getElementById("nextSlide");
let currentSlide = 0;
let carouselTimer;

function showSlide(index) {
  if (!slides.length) return;
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => slide.classList.toggle("active", i === currentSlide));
  dots.forEach((dot, i) => dot.classList.toggle("active", i === currentSlide));
}

function restartCarousel() {
  clearInterval(carouselTimer);
  carouselTimer = setInterval(() => showSlide(currentSlide + 1), 5000);
}

if (slides.length) {
  prev?.addEventListener("click", () => { showSlide(currentSlide - 1); restartCarousel(); });
  next?.addEventListener("click", () => { showSlide(currentSlide + 1); restartCarousel(); });
  dots.forEach((dot, i) => dot.addEventListener("click", () => { showSlide(i); restartCarousel(); }));
  document.getElementById("heroCarousel")?.addEventListener("mouseenter", () => clearInterval(carouselTimer));
  document.getElementById("heroCarousel")?.addEventListener("mouseleave", restartCarousel);
  restartCarousel();
}

/* Back to top */
const topBtn = document.getElementById("top");
window.addEventListener("scroll", () => topBtn?.classList.toggle("show", scrollY > 550));
topBtn?.addEventListener("click", () => scrollTo({top: 0, behavior: "smooth"}));

/* Admission enquiry -> email */
const form = document.getElementById("form");
form?.addEventListener("submit", e => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const course = document.getElementById("class").value;
  const message = document.getElementById("message").value.trim();
  const status = document.getElementById("status");

  if (!name || !phone || !course) {
    status.textContent = "Please enter your name, phone number and class/course.";
    status.classList.add("error");
    return;
  }

  status.classList.remove("error");
  status.textContent = "Opening your email application…";

  const subject = encodeURIComponent("Admission Enquiry - " + name);
  const body = encodeURIComponent(
`Hello The Guide Tuition Center,

I would like to enquire about admission.

Name: ${name}
Phone: ${phone}
Class / Course: ${course}
Message: ${message || "Please share fees, timings and admission details."}

Thank you.`
  );

  window.location.href =
    `mailto:theguidetuitioncenter@gmail.com?subject=${subject}&body=${body}`;
});


/* Faculty carousel */
const facultyTrack = document.getElementById("facultyTrack");
const facultyCards = facultyTrack ? [...facultyTrack.querySelectorAll(".faculty-card")] : [];
const facultyPrev = document.getElementById("facultyPrev");
const facultyNext = document.getElementById("facultyNext");
const facultyDotsWrap = document.getElementById("facultyDots");
let facultyIndex = 0;
let facultyPerView = 3;
let facultyTimer;

function facultyVisible() {
  if (window.innerWidth <= 760) return 1;
  if (window.innerWidth <= 1050) return 2;
  return 3;
}

function setupFacultyDots() {
  if (!facultyDotsWrap || !facultyCards.length) return;
  facultyPerView = facultyVisible();
  const pages = Math.max(1, Math.ceil(facultyCards.length / facultyPerView));
  facultyDotsWrap.innerHTML = "";
  for (let i = 0; i < pages; i++) {
    const b = document.createElement("button");
    b.setAttribute("aria-label", "Faculty page " + (i + 1));
    b.addEventListener("click", () => {
      facultyIndex = i;
      moveFaculty();
      restartFaculty();
    });
    facultyDotsWrap.appendChild(b);
  }
}

function moveFaculty() {
  if (!facultyTrack || !facultyCards.length) return;
  facultyPerView = facultyVisible();
  const maxIndex = Math.max(0, facultyCards.length - facultyPerView);
  facultyIndex = Math.min(facultyIndex, maxIndex);
  const gap = 22;
  const cardWidth = facultyCards[0].getBoundingClientRect().width + gap;
  facultyTrack.style.transform = `translateX(-${facultyIndex * cardWidth}px)`;
  [...facultyDotsWrap.children].forEach((dot, i) =>
    dot.classList.toggle("active", i === Math.floor(facultyIndex / facultyPerView))
  );
}

function restartFaculty() {
  clearInterval(facultyTimer);
  if (facultyCards.length > facultyVisible()) {
    facultyTimer = setInterval(() => {
      facultyPerView = facultyVisible();
      facultyIndex += facultyPerView;
      if (facultyIndex >= facultyCards.length) facultyIndex = 0;
      moveFaculty();
    }, 5200);
  }
}

if (facultyCards.length) {
  setupFacultyDots();
  moveFaculty();
  restartFaculty();

  facultyPrev?.addEventListener("click", () => {
    facultyPerView = facultyVisible();
    facultyIndex -= facultyPerView;
    if (facultyIndex < 0) facultyIndex = Math.max(0, facultyCards.length - facultyPerView);
    moveFaculty();
    restartFaculty();
  });

  facultyNext?.addEventListener("click", () => {
    facultyPerView = facultyVisible();
    facultyIndex += facultyPerView;
    if (facultyIndex >= facultyCards.length) facultyIndex = 0;
    moveFaculty();
    restartFaculty();
  });

  document.getElementById("facultyCarousel")?.addEventListener("mouseenter", () => clearInterval(facultyTimer));
  document.getElementById("facultyCarousel")?.addEventListener("mouseleave", restartFaculty);

  window.addEventListener("resize", () => {
    setupFacultyDots();
    moveFaculty();
    restartFaculty();
  });
}
