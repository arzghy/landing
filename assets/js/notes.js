/**
 * ==========================================================================
 * MAIN2.JS - KHUSUS UNTUK HALAMAN CATATAN (catatan.html)
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", function() {
  // Cek apakah ini halaman catatan
  const notesContainer = document.getElementById('notesContainer');
  if (!notesContainer) return;

  console.log('initNotesPage dipanggil');

  let myNotes = [];
  let editingIndex = -1;
  let currentSort = 'newest'; // 'newest' atau 'oldest'

  // Load dari LocalStorage
  const savedNotes = localStorage.getItem('laksmitaNotes');
  if (savedNotes) {
    myNotes = JSON.parse(savedNotes);
  }

  // Fungsi untuk format tanggal lengkap
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Fungsi untuk format tanggal singkat
  function formatDateShort(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Fungsi render catatan
  function renderNotes() {
    const countBadge = document.getElementById('notesCount');
    if (countBadge) {
      countBadge.textContent = myNotes.length;
    }

    notesContainer.innerHTML = '';

    if (myNotes.length === 0) {
      notesContainer.innerHTML = `
        <div class="col-12">
          <div class="text-center py-5">
            <i class="bi bi-journal-text" style="font-size: 4rem; color: #ccc;"></i>
            <p class="mt-3 text-muted">Belum ada catatan. Mulai tulis catatan pertamamu!</p>
          </div>
        </div>
      `;
      return;
    }

    // Sort berdasarkan pilihan
    let sortedNotes = [...myNotes];
    if (currentSort === 'newest') {
      sortedNotes.sort((a, b) => b.timestamp - a.timestamp);
    } else {
      sortedNotes.sort((a, b) => a.timestamp - b.timestamp);
    }

    // Render setiap catatan
    sortedNotes.forEach((note, displayIndex) => {
      // Cari index asli di array myNotes
      const actualIndex = myNotes.findIndex(n => n.id === note.id);
      
      const col = document.createElement('div');
      col.className = 'col-lg-4 col-md-6';
      col.setAttribute('data-aos', 'fade-up');
      col.setAttribute('data-aos-delay', (displayIndex * 50 + 200));

      col.innerHTML = `
        <div class="service-item" style="height: 100%;">
          <div class="service-image" style="position: relative; height: 200px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
              <i class="bi bi-journal-bookmark" style="font-size: 4rem; color: white; opacity: 0.9;"></i>
            </div>
            <div class="service-overlay">
              <i class="bi bi-pen"></i>
            </div>
          </div>
          <div class="service-content">
            <h3 style="margin-bottom: 10px;">${note.title}</h3>
            <p style="margin-bottom: 15px; color: #666; line-height: 1.6;">${note.content.substring(0, 120)}${note.content.length > 120 ? '...' : ''}</p>
            <div class="service-features">
              <span class="feature-item"><i class="bi bi-clock"></i> ${formatDateShort(note.timestamp)}</span>
            </div>
            <div style="display: flex; gap: 10px; margin-top: 15px;">
              <button class="btn btn-outline-primary btn-sm btn-edit-note" data-index="${actualIndex}" style="flex: 1;">
                <i class="bi bi-pencil"></i> Edit
              </button>
              <button class="btn btn-outline-danger btn-sm btn-delete-note" data-index="${actualIndex}" style="flex: 1;">
                <i class="bi bi-trash"></i> Hapus
              </button>
            </div>
          </div>
        </div>
      `;

      notesContainer.appendChild(col);
    });

    // Event listener untuk tombol edit
    document.querySelectorAll('.btn-edit-note').forEach(btn => {
      btn.addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-index'));
        editNote(index);
      });
    });

    // Event listener untuk tombol delete
    document.querySelectorAll('.btn-delete-note').forEach(btn => {
      btn.addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-index'));
        deleteNote(index);
      });
    });

    // Trigger AOS refresh untuk animasi baru
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
  }

  // Fungsi tambah/update catatan
  function saveNote() {
    const titleInput = document.getElementById('noteTitle');
    const contentInput = document.getElementById('noteContent');

    if (!titleInput || !contentInput) return;

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !content) {
      alert('Judul dan isi catatan tidak boleh kosong!');
      return;
    }

    if (editingIndex >= 0) {
      // Mode edit
      myNotes[editingIndex].title = title;
      myNotes[editingIndex].content = content;
      myNotes[editingIndex].timestamp = Date.now();
      editingIndex = -1;
      
      // Reset tombol
      const btnSave = document.getElementById('btnSaveNote');
      if (btnSave) {
        btnSave.innerHTML = '<i class="bi bi-plus-circle"></i> Tambah Catatan';
      }
    } else {
      // Mode tambah baru
      const newNote = {
        id: Date.now(),
        title: title,
        content: content,
        timestamp: Date.now()
      };
      myNotes.push(newNote);
    }

    saveToLocalStorage();
    renderNotes();

    // Reset form
    titleInput.value = '';
    contentInput.value = '';

    // Scroll ke list
    notesContainer.scrollIntoView({ behavior: 'smooth' });
  }

  // Fungsi edit catatan
  function editNote(index) {
    const note = myNotes[index];
    editingIndex = index;

    const titleInput = document.getElementById('noteTitle');
    const contentInput = document.getElementById('noteContent');
    const btnSave = document.getElementById('btnSaveNote');

    if (titleInput && contentInput) {
      titleInput.value = note.title;
      contentInput.value = note.content;
      
      if (btnSave) {
        btnSave.innerHTML = '<i class="bi bi-save"></i> Perbarui Catatan';
      }

      // Scroll ke form
      titleInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      titleInput.focus();
    }
  }

  // Fungsi hapus catatan
  function deleteNote(index) {
    if (confirm('Yakin ingin menghapus catatan ini?')) {
      myNotes.splice(index, 1);
      saveToLocalStorage();
      renderNotes();

      // Reset jika sedang edit catatan yang dihapus
      if (editingIndex === index) {
        editingIndex = -1;
        const titleInput = document.getElementById('noteTitle');
        const contentInput = document.getElementById('noteContent');
        const btnSave = document.getElementById('btnSaveNote');
        
        if (titleInput) titleInput.value = '';
        if (contentInput) contentInput.value = '';
        if (btnSave) btnSave.innerHTML = '<i class="bi bi-plus-circle"></i> Tambah Catatan';
      }
    }
  }

  // Fungsi sort
  function toggleSort() {
    currentSort = currentSort === 'newest' ? 'oldest' : 'newest';
    
    const btnSort = document.getElementById('btnSortNotes');
    if (btnSort) {
      if (currentSort === 'newest') {
        btnSort.innerHTML = '<i class="bi bi-sort-down"></i> Terbaru';
      } else {
        btnSort.innerHTML = '<i class="bi bi-sort-up"></i> Terlama';
      }
    }
    
    renderNotes();
  }

  // Fungsi simpan ke LocalStorage
  function saveToLocalStorage() {
    localStorage.setItem('laksmitaNotes', JSON.stringify(myNotes));
  }

  // Event listener tombol save
  const btnSaveNote = document.getElementById('btnSaveNote');
  if (btnSaveNote) {
    btnSaveNote.addEventListener('click', function(e) {
      e.preventDefault();
      saveNote();
    });
  }

  // Event listener tombol sort
  const btnSortNotes = document.getElementById('btnSortNotes');
  if (btnSortNotes) {
    btnSortNotes.addEventListener('click', function(e) {
      e.preventDefault();
      toggleSort();
    });
  }

  // Event listener Enter key pada textarea
  const contentInput = document.getElementById('noteContent');
  if (contentInput) {
    contentInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        saveNote();
      }
    });
  }

  // Event listener untuk tombol cancel jika ada
  const btnCancelNote = document.getElementById('btnCancelNote');
  if (btnCancelNote) {
    btnCancelNote.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Reset form
      const titleInput = document.getElementById('noteTitle');
      const contentInput = document.getElementById('noteContent');
      const btnSave = document.getElementById('btnSaveNote');
      
      if (titleInput) titleInput.value = '';
      if (contentInput) contentInput.value = '';
      if (btnSave) btnSave.innerHTML = '<i class="bi bi-plus-circle"></i> Tambah Catatan';
      
      editingIndex = -1;
    });
  }

  // Render awal
  renderNotes();
});