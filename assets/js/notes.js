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
      
      // --- PERUBAHAN DI SINI: Menampilkan Deskripsi ---
      const descElement = document.getElementById('detailDesc');
      if (descElement) {
        descElement.textContent = note.description || 'Tidak ada deskripsi singkat.';
      }
      // ------------------------------------------------

      // Di sini kita menampilkan ISI LENGKAP (content)
      document.getElementById('detailContent').textContent = note.content; 
      document.getElementById('detailDate').textContent = formatDate(note.timestamp);
      
      // Tampilkan Container
      detailContainer.style.display = 'block';

      // 3. Tombol Hapus
      document.getElementById('btnDeleteDetail').addEventListener('click', () => {
        if (confirm('Yakin ingin menghapus catatan ini selamanya sayang?')) {
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
      // Sort Date Descending
      myNotes.sort((a, b) => b.timestamp - a.timestamp);

      // Render HTML
      listContainer.innerHTML = '';
      document.getElementById('notesCount').textContent = myNotes.length;

      if (myNotes.length === 0) {
        listContainer.innerHTML = `<div class="col-12 text-center py-5 text-muted">Belum ada catatan sayang. Yuk buat satu!</div>`;
        return;
      }

      myNotes.forEach((note) => {
        const col = document.createElement('div');
        col.className = 'col-lg-4 col-md-6';
        
        // Disini kita menampilkan Judul dan DESKRIPSI SINGKAT
        col.innerHTML = `
          <div class="note-card h-100 position-relative" style="cursor: pointer;">
            <div class="note-header">
               <i class="bi bi-journal-text text-white fs-1 opacity-50"></i>
            </div>
            <div class="note-body">
              <h5 class="note-title text-truncate fw-bold mb-2">${note.title}</h5>
              <p class="note-desc text-muted mb-3" style="font-size:0.95rem; min-height:40px;">
                ${note.description || '-'}
              </p>
              <div class="border-top pt-2">
                 <small class="text-secondary"><i class="bi bi-clock"></i> ${formatDateShort(note.timestamp)}</small>
              </div>
            </div>
          </div>
        `;
        
        listContainer.appendChild(col);

        // --- KLIK KARTU = PINDAH HALAMAN KE DETAIL (UNTUK LIHAT ISI) ---
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
        const description = document.getElementById('noteDescription').value.trim(); // Ambil Deskripsi
        const content = document.getElementById('noteContent').value.trim();

        if (!title || !content || !description) { alert('Sayang, judul, deskripsi, dan isinya diisi dulu ya!'); return; }

        if (editingId) {
          // Update Existing
          const idx = myNotes.findIndex(n => n.id == editingId);
          if (idx !== -1) {
            myNotes[idx].title = title;
            myNotes[idx].description = description; // Simpan Deskripsi
            myNotes[idx].content = content;
            myNotes[idx].timestamp = Date.now();
          }
        } else {
          // Create New
          myNotes.push({
            id: Date.now(),
            title, 
            description, // Simpan Deskripsi
            content, 
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
        document.getElementById('modalFormTitle').textContent = "Buat Catatan Baru ❤️";
        
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
        document.getElementById('noteDescription').value = targetNote.description || ''; // Load Deskripsi
        document.getElementById('noteContent').value = targetNote.content;
        document.getElementById('modalFormTitle').textContent = "Edit Catatan";
        
        // Buka Modal Otomatis
        formModal.show();
        
        // Handle saat modal ditutup user (batal edit)
        document.getElementById('modalFormNote').addEventListener('hidden.bs.modal', () => {
           // Opsional
        }, {once:true});
      }
    }

    // Jalankan render awal
    renderList();
  }
});