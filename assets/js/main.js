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
  
  // FIX: Cek scrollTop ada sebelum addEventListener
  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    }
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  if (typeof GLightbox !== 'undefined') {
    const glightbox = GLightbox({
      selector: '.glightbox'
    });
  }

  /**
   * Initiate Pure Counter
   */
  if (typeof PureCounter !== 'undefined') {
    new PureCounter();
  }

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
    let startTime = 0;

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
        startTime = Date.now() - elapsedTime;
        localStorage.setItem('sw_startTime', startTime);
        localStorage.setItem('sw_isRunning', 'true');

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
        
        localStorage.setItem('sw_elapsedTime', elapsedTime);
        localStorage.setItem('sw_isRunning', 'false');
        
        updateButtons();
      }
    }

    // Fungsi Reset
    function resetStopwatch() {
      stopStopwatch();
      elapsedTime = 0;
      if (displayElement) displayElement.textContent = "00:00:00";
      
      localStorage.removeItem('sw_startTime');
      localStorage.removeItem('sw_elapsedTime');
      localStorage.removeItem('sw_isRunning');
    }

    // Inisialisasi Saat Halaman Dimuat
    function initStopwatch() {
      const storedIsRunning = localStorage.getItem('sw_isRunning');
      const storedStartTime = localStorage.getItem('sw_startTime');
      const storedElapsedTime = localStorage.getItem('sw_elapsedTime');

      if (storedIsRunning === 'true' && storedStartTime) {
        startTime = parseInt(storedStartTime);
        elapsedTime = Date.now() - startTime;
        
        if (displayElement) displayElement.textContent = formatTime(elapsedTime);
        
        isRunning = true;
        updateButtons();

        stopwatchInterval = setInterval(() => {
          elapsedTime = Date.now() - startTime;
          if (displayElement) displayElement.textContent = formatTime(elapsedTime);
        }, 100);

      } else if (storedElapsedTime) {
        elapsedTime = parseInt(storedElapsedTime);
        if (displayElement) displayElement.textContent = formatTime(elapsedTime);
        isRunning = false;
        updateButtons();
      }
    }

    initStopwatch();

    if (btnStart) btnStart.addEventListener('click', startStopwatch);
    if (btnStop) btnStop.addEventListener('click', stopStopwatch);
    if (btnReset) btnReset.addEventListener('click', resetStopwatch);
  }
});


/**
 * ==========================================================================
 * LOGIKA HALAMAN MUSIK (Untuk musik.html)
 * ==========================================================================
 */

// Inisialisasi Halaman Musik
document.addEventListener("DOMContentLoaded", function() {
  const container = document.getElementById('playlistListContainer');
  if (!container) return; // Bukan halaman musik, keluar.

  console.log('initMusicPage dipanggil'); // Debug

  // Variabel untuk menyimpan playlist (local scope)
  let myPlaylists = [];

  // --- PLAYLIST DEFAULT (Permanen) ---
  const defaultPlaylists = [
    {
      name: "Lagu Galau Indonesia",
      url: "https://open.spotify.com/embed/playlist/37i9dQZF1DX50QitC6McUH", 
      date: "Rekomendasi Admin"
    },
    {
      name: "Top Hits Global",
      url: "https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M",
      date: "Rekomendasi Admin"
    }
  ];

  // Cek LocalStorage
  let savedData = localStorage.getItem('laksmitaSpotifyPlaylists');

  if (savedData) {
      myPlaylists = JSON.parse(savedData);
  } else {
      myPlaylists = defaultPlaylists;
  }

  // Fungsi Render
  function renderPlaylists() {
    const countBadge = document.getElementById('countBadge');
    
    if (!countBadge) return;

    countBadge.innerText = myPlaylists.length;
    container.innerHTML = '';

    if (myPlaylists.length === 0) {
      container.innerHTML = '<div class="empty-state-grid">Belum ada playlist tersimpan. Tambahkan di atas!</div>';
      return;
    }

    // Loop data playlist
    myPlaylists.forEach((playlist, index) => {
      const cardDiv = document.createElement('div');
      cardDiv.className = 'playlist-card';
      
      cardDiv.innerHTML = `
        <div>
          <div class="d-flex align-items-center mb-2">
            <i class="bi bi-music-note-list text-accent fs-4 me-2"></i> <h5>${playlist.name}</h5>
          </div>
          <span class="date"><i class="bi bi-calendar3 me-1"></i> ${playlist.date}</span>
        </div>
        
        <div class="actions">
          <button class="btn btn-outline-accent btn-play-playlist" data-index="${index}">
            <i class="bi bi-play-fill"></i> Putar
          </button>
          <button class="btn btn-outline-danger btn-delete-playlist" data-index="${index}">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      `;
      container.appendChild(cardDiv);
    });

    // Tambahkan event listener setelah render
    document.querySelectorAll('.btn-play-playlist').forEach(btn => {
      btn.addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-index'));
        playPlaylist(index);
      });
    });

    document.querySelectorAll('.btn-delete-playlist').forEach(btn => {
      btn.addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-index'));
        deletePlaylist(index);
      });
    });
  }

  // Fungsi Tambah Playlist
  function addPlaylist() {
    console.log('addPlaylist dipanggil'); // Debug
    
    const nameInput = document.getElementById('inputName');
    const urlInput = document.getElementById('inputUrl');
    
    if (!nameInput || !urlInput) {
      console.error("Input element tidak ditemukan!");
      return;
    }

    let name = nameInput.value.trim();
    let url = urlInput.value.trim();

    console.log('Name:', name, 'URL:', url); // Debug

    if (!url) {
      alert("Mohon masukkan link Spotify!");
      return;
    }

    // Validasi link
    if (!url.includes('spotify.com')) {
      alert("Link tidak valid. Pastikan link dari Spotify (contoh: https://open.spotify.com/playlist/...).");
      return;
    }

    if (!name) {
      name = "Playlist Musik " + (myPlaylists.length + 1);
    }

    // Logic Konversi Link ke Embed
    let embedUrl = url;
    if (!url.includes('/embed/')) {
      embedUrl = url.replace('open.spotify.com/', 'open.spotify.com/embed/');
    }
    
    embedUrl = embedUrl.split('?')[0];

    const newPlaylist = {
      name: name,
      url: embedUrl,
      date: new Date().toLocaleDateString('id-ID')
    };

    myPlaylists.push(newPlaylist);
    saveToStorage();
    renderPlaylists();

    // Reset Form
    nameInput.value = '';
    urlInput.value = '';
    
    // Putar playlist baru
    playPlaylist(myPlaylists.length - 1);
  }

  // Fungsi Hapus
  function deletePlaylist(index) {
    if (confirm('Yakin ingin menghapus playlist ini dari daftar?')) {
      myPlaylists.splice(index, 1);
      saveToStorage();
      renderPlaylists();
    }
  }

  // Fungsi Putar
  function playPlaylist(index) {
    const playlist = myPlaylists[index];
    const playerContainer = document.getElementById('mainPlayer');
    
    if(playerContainer) {
      playerContainer.innerHTML = `
        <iframe style="border-radius:12px" src="${playlist.url}" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
      `;
      
      // Scroll smooth ke player
      const card = document.querySelector('.music-player-card');
      if(card) card.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Simpan ke LocalStorage
  function saveToStorage() {
    localStorage.setItem('laksmitaSpotifyPlaylists', JSON.stringify(myPlaylists));
  }

  // Render awal
  renderPlaylists();

  // Putar yang pertama jika ada
  if (myPlaylists.length > 0) {
    playPlaylist(0);
  }

  // Tambahkan event listener untuk tombol "Simpan" dengan ID
  const btnSavePlaylist = document.getElementById('btnSavePlaylist');
  if (btnSavePlaylist) {
    btnSavePlaylist.addEventListener('click', function(e) {
      e.preventDefault();
      addPlaylist();
    });
    console.log('Event listener untuk tombol Simpan ditambahkan'); // Debug
  } else {
    console.error('Tombol btnSavePlaylist tidak ditemukan!');
  }

  // Support Enter key pada input URL
  const urlInput = document.getElementById('inputUrl');
  if (urlInput) {
    urlInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        addPlaylist();
      }
    });
  }
});