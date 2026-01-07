/**
* Template Name: Clinic
* Template URL: https://bootstrapmade.com/clinic-bootstrap-template/
* Updated: Jul 23 2025 with Bootstrap v5.3.7
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Frequently Asked Questions Toggle
   */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle, .faq-item .faq-header').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

})();

/* ==========================================================================
   FITUR TAMBAHAN: FOKUS PAGE (JAM & STOPWATCH PERSISTENT)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Cek elemen jam untuk memastikan script hanya jalan di halaman Fokus
  const clockElement = document.getElementById('digital-clock');
  
  if (clockElement) {
    
    // --- 1. Logic Jam Digital ---
    function updateClock() {
      const now = new Date();
      const timeString = now.toLocaleTimeString('id-ID', { hour12: false });
      const dateString = now.toLocaleDateString('id-ID', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

      clockElement.textContent = timeString;
      const dateElement = document.getElementById('date-display');
      if (dateElement) dateElement.textContent = dateString;
    }

    setInterval(updateClock, 1000);
    updateClock();


    // --- 2. Logic Stopwatch dengan LocalStorage ---
    let stopwatchInterval;
    let elapsedTime = 0;
    let isRunning = false;
    let startTime = 0; // Timestamp kapan start ditekan (adjusted)

    const displayElement = document.getElementById('stopwatch-display');
    const btnStart = document.getElementById('btn-start');
    const btnStop = document.getElementById('btn-stop');
    const btnReset = document.getElementById('btn-reset');

    // Fungsi Format Waktu
    function formatTime(ms) {
      const totalSeconds = Math.floor(ms / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      const h = String(hours).padStart(2, '0');
      const m = String(minutes).padStart(2, '0');
      const s = String(seconds).padStart(2, '0');

      return `${h}:${m}:${s}`;
    }

    // Fungsi Update UI Button
    function updateButtons() {
      if (btnStart) btnStart.disabled = isRunning;
      if (btnStop) btnStop.disabled = !isRunning;
    }

    // Fungsi Start
    function startStopwatch() {
      if (!isRunning) {
        // Hitung waktu mulai (Sekarang dikurangi waktu yang sudah berlalu sebelumnya)
        startTime = Date.now() - elapsedTime;
        
        // Simpan state ke LocalStorage
        localStorage.setItem('sw_startTime', startTime);
        localStorage.setItem('sw_isRunning', 'true');

        // Jalankan interval
        stopwatchInterval = setInterval(() => {
          elapsedTime = Date.now() - startTime;
          if (displayElement) displayElement.textContent = formatTime(elapsedTime);
        }, 100);

        isRunning = true;
        updateButtons();
      }
    }

    // Fungsi Stop
    function stopStopwatch() {
      if (isRunning) {
        clearInterval(stopwatchInterval);
        isRunning = false;
        
        // Simpan waktu terakhir saat pause agar tidak hilang saat refresh
        localStorage.setItem('sw_elapsedTime', elapsedTime); // Simpan waktu beku
        localStorage.setItem('sw_isRunning', 'false');
        
        updateButtons();
      }
    }

    // Fungsi Reset
    function resetStopwatch() {
      stopStopwatch(); // Pastikan berhenti dulu
      elapsedTime = 0;
      if (displayElement) displayElement.textContent = "00:00:00";
      
      // Hapus data dari LocalStorage
      localStorage.removeItem('sw_startTime');
      localStorage.removeItem('sw_elapsedTime');
      localStorage.removeItem('sw_isRunning');
    }

    // --- 3. Inisialisasi Saat Halaman Dimuat (Load State) ---
    function initStopwatch() {
      const storedIsRunning = localStorage.getItem('sw_isRunning');
      const storedStartTime = localStorage.getItem('sw_startTime');
      const storedElapsedTime = localStorage.getItem('sw_elapsedTime');

      if (storedIsRunning === 'true' && storedStartTime) {
        // KASUS 1: Stopwatch sedang berjalan saat user meninggalkan/refresh halaman
        startTime = parseInt(storedStartTime);
        elapsedTime = Date.now() - startTime; // Hitung selisih waktu nyata saat ini dengan waktu start
        
        // Update tampilan langsung agar tidak 00:00:00
        if (displayElement) displayElement.textContent = formatTime(elapsedTime);
        
        isRunning = true;
        updateButtons();

        // Lanjutkan interval
        stopwatchInterval = setInterval(() => {
          elapsedTime = Date.now() - startTime;
          if (displayElement) displayElement.textContent = formatTime(elapsedTime);
        }, 100);

      } else if (storedElapsedTime) {
        // KASUS 2: Stopwatch dalam keadaan PAUSE (Stop) saat user meninggalkan halaman
        elapsedTime = parseInt(storedElapsedTime);
        if (displayElement) displayElement.textContent = formatTime(elapsedTime);
        isRunning = false;
        updateButtons();
      }
    }

    // Jalankan inisialisasi
    initStopwatch();

    // --- 4. Event Listeners ---
    if (btnStart) btnStart.addEventListener('click', startStopwatch);
    if (btnStop) btnStop.addEventListener('click', stopStopwatch);
    if (btnReset) btnReset.addEventListener('click', resetStopwatch);
  }
});