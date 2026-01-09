/**
 * ==========================================================================
 * NOTES.JS - Multi-Page Logic (List & Detail)
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", function() {
  
  // --- Global Setup ---
  let myNotes = [];
  const savedNotes = localStorage.getItem('laksmitaNotes');
  if (savedNotes) {
    myNotes = JSON.parse(savedNotes);
  }

  // Helper: Save
  function saveToLocalStorage() {
    localStorage.setItem('laksmitaNotes', JSON.stringify(myNotes));
  }

  // Helper: Format Date
  function formatDate(ts) {
    return new Date(ts).toLocaleDateString('id-ID', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', 
      hour: '2-digit', minute: '2-digit'
    });
  }

  function formatDateShort(ts) {
    return new Date(ts).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  // ============================================================
  // LOGIKA 1: HALAMAN DETAIL (detail-catatan.html)
  // ============================================================
  const detailContainer = document.getElementById('noteDetailContainer');
  
  if (detailContainer) {
    // 1. Ambil ID dari URL (?id=...)
    const urlParams = new URLSearchParams(window.location.search);
    const noteId = urlParams.get('id');

    // 2. Cari Data
    const note = myNotes.find(n => n.id == noteId);

    if (note) {
      // Tampilkan Data
      document.getElementById('detailTitle').textContent = note.title;
      document.getElementById('detailContent').textContent = note.content;
      document.getElementById('detailDate').textContent = formatDate(note.timestamp);
      
      // Kategori Badge
      const catBadge = document.getElementById('detailCategory');
      catBadge.textContent = note.category || 'Umum';
      
      // Tampilkan Container
      detailContainer.style.display = 'block';

      // 3. Tombol Hapus
      document.getElementById('btnDeleteDetail').addEventListener('click', () => {
        if (confirm('Yakin ingin menghapus catatan ini selamanya?')) {
          myNotes = myNotes.filter(n => n.id != noteId);
          saveToLocalStorage();
          window.location.href = 'catatan.html'; // Redirect balik
        }
      });

      // 4. Tombol Edit (Redirect ke halaman depan dengan mode edit)
      document.getElementById('btnEditDetail').addEventListener('click', () => {
        window.location.href = `catatan.html?action=edit&id=${noteId}`;
      });

    } else {
      // Data tidak ketemu
      document.getElementById('noteNotFound').style.display = 'block';
    }
    return; // Stop script di sini jika ini halaman detail
  }


  // ============================================================
  // LOGIKA 2: HALAMAN UTAMA (catatan.html)
  // ============================================================
  const listContainer = document.getElementById('notesContainer');
  
  if (listContainer) {
    let formModal;
    try {
      formModal = new bootstrap.Modal(document.getElementById('modalFormNote'));
    } catch(e) {}

    // State Edit
    let editingId = null;

    // --- Render List ---
    function renderList() {
      // Filter Kategori (Opsional, jika masih dipakai)
      const urlParams = new URLSearchParams(window.location.search);
      const activeCategory = urlParams.get('kategori');
      
      // Navigasi UI update (jika ada)
      document.querySelectorAll('.nav-pills .nav-link').forEach(el => el.classList.remove('active'));
      if(activeCategory) {
          const btn = document.getElementById(`link-${activeCategory}`);
          if(btn) btn.classList.add('active');
      } else {
          const btnAll = document.querySelector('.active-all');
          if(btnAll) btnAll.classList.add('active');
      }

      // Filter Data
      let filtered = activeCategory ? myNotes.filter(n => n.category === activeCategory) : myNotes;

      // Sort Date Descending
      filtered.sort((a, b) => b.timestamp - a.timestamp);

      // Render HTML
      listContainer.innerHTML = '';
      document.getElementById('notesCount').textContent = filtered.length;

      if (filtered.length === 0) {
        listContainer.innerHTML = `<div class="col-12 text-center py-5 text-muted">Belum ada catatan.</div>`;
        return;
      }

      filtered.forEach((note, index) => {
        const col = document.createElement('div');
        col.className = 'col-lg-4 col-md-6';
        
        // Warna badge
        let badgeColor = 'bg-secondary';
        if(note.category === 'Pribadi') badgeColor = 'bg-success';
        if(note.category === 'Pekerjaan') badgeColor = 'bg-primary';
        if(note.category === 'Ide') badgeColor = 'bg-warning text-dark';

        col.innerHTML = `
          <div class="note-card h-100 position-relative" style="cursor: pointer;">
            <div class="note-header">
               <i class="bi bi-journal-text text-white fs-1 opacity-50"></i>
            </div>
            <div class="note-body">
              <span class="badge ${badgeColor} mb-2">${note.category || 'Umum'}</span>
              <h5 class="note-title text-truncate">${note.title}</h5>
              <p class="note-excerpt" style="color:#666; font-size:0.9rem; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden;">
                ${note.content}
              </p>
              <small class="text-muted"><i class="bi bi-clock"></i> ${formatDateShort(note.timestamp)}</small>
            </div>
          </div>
        `;
        
        listContainer.appendChild(col);

        // --- KLIK KARTU = PINDAH HALAMAN ---
        col.querySelector('.note-card').addEventListener('click', () => {
          window.location.href = `detail-catatan.html?id=${note.id}`;
        });
      });
    }

    // --- Create / Update Logic ---
    const btnSave = document.getElementById('btnSaveNote');
    if (btnSave) {
      btnSave.addEventListener('click', () => {
        const title = document.getElementById('noteTitle').value.trim();
        const content = document.getElementById('noteContent').value.trim();
        const category = document.getElementById('noteCategory').value;

        if (!title || !content) { alert('Isi data dengan lengkap'); return; }

        if (editingId) {
          // Update Existing
          const idx = myNotes.findIndex(n => n.id == editingId);
          if (idx !== -1) {
            myNotes[idx].title = title;
            myNotes[idx].content = content;
            myNotes[idx].category = category;
            myNotes[idx].timestamp = Date.now();
          }
        } else {
          // Create New
          myNotes.push({
            id: Date.now(),
            title, content, category,
            timestamp: Date.now()
          });
        }

        saveToLocalStorage();
        
        // Jika mode edit dari halaman detail, balik ke halaman detail setelah save
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('action') === 'edit') {
            window.location.href = `detail-catatan.html?id=${editingId}`;
        } else {
            renderList();
            formModal.hide();
        }
      });
    }

    // --- FAB Button (Tambah Baru) ---
    const fab = document.getElementById('fabAddNote');
    if (fab) {
      fab.addEventListener('click', () => {
        editingId = null;
        document.getElementById('noteForm').reset();
        document.getElementById('modalFormTitle').textContent = "Tambah Catatan Baru";
        
        // Bersihkan URL query param agar bersih saat tambah baru
        window.history.pushState({}, document.title, window.location.pathname);
        
        formModal.show();
      });
    }

    // --- Cek URL: Apakah ada perintah Edit? ---
    // (Redirect dari halaman Detail untuk melakukan Edit)
    const params = new URLSearchParams(window.location.search);
    if (params.get('action') === 'edit' && params.get('id')) {
      const editId = params.get('id');
      const targetNote = myNotes.find(n => n.id == editId);
      
      if (targetNote && formModal) {
        editingId = editId;
        document.getElementById('noteTitle').value = targetNote.title;
        document.getElementById('noteContent').value = targetNote.content;
        document.getElementById('noteCategory').value = targetNote.category || 'Pribadi';
        document.getElementById('modalFormTitle').textContent = "Edit Catatan";
        
        // Buka Modal Otomatis
        formModal.show();
        
        // Handle saat modal ditutup user (batal edit), bersihkan URL
        document.getElementById('modalFormNote').addEventListener('hidden.bs.modal', () => {
           if(editingId) { // Jika batal, kembalikan user ke detail atau list
             // Opsional: window.history.pushState({}, document.title, "catatan.html");
           }
        }, {once:true});
      }
    }

    // Jalankan render awal
    renderList();
  }
});