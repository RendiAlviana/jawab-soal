// 07.03 WIB
// Senin, 3 November 2025
// Dibuat oleh : Rendi Alvina
// Instagram : @_renlvin
/*
Pesan : 
  Alhamdulillah, pada hari ini saya telah menyelesaikan program "jawab soal" sederhana. Saya sadar
  bahwa program ini banyak sekali kekuranganya. Sehingga saya pribadi meminta maaf atas kekurangan
  tersebut. Tujuan awal dari program ini adalah sebagai sarana belajar dan praktek dasar pemograman
  javaScrip, HTML, dan CSS.
  Selanjutnya dengan ini, saya melepaskan hak cipta saya dalam program ini. Teman teman diluar sana
  boleh untuk mengedit, menambahkan program ini sesuka hati. Akan tetapi dengan catatan beritahu saya,
  karena itu ada hadiah yang sangat berharga bagi saya, jika saya tau bahwa program ini bermanfaat.

  Hubungi saya di DM Instagram, jika ada bug atau saran tentang program ini !!
*/

// Mengambil data file soal untuk di tampilkan di layar
fetch("sistem.json")
  .then((result) => result.json())
  .then((result) => {
    console.log(result);
    let isiAccordion = "";
    result.forEach(({ nama_header, body }) => {
      isiAccordion += `
         <div class="accordion-item">
            <div class="accordion-header">
              ${nama_header}
              <img src="svg/angle-small-down.svg" alt="icon-accordion" />
            </div>
            <div class="accordion-body">
              <ul type="none">
                ${membuatDataAccordion(nama_header, body)}
              </ul>
            </div>
         </div>`;
    });
    document.querySelector(".accordion").innerHTML = isiAccordion;
  });

function membuatDataAccordion(nama_header, body) {
  let dataAccordion = "";
  body.forEach((data) => {
    dataAccordion += ` <li class="data-accordion" data-file="${nama_header}/${data.nama_file}">${data.nama_yang_tampil}</li>`;
  });
  return dataAccordion;
}

// Argoritma untuk Accordion
document.addEventListener("click", function ({ target }) {
  if (target.classList.contains("accordion-header")) {
    const accordionAktif = document.querySelector(".accordion-aktif");
    if (accordionAktif && !target.parentElement.classList.contains("accordion-aktif")) accordionAktif.classList.remove("accordion-aktif");
    target.parentElement.classList.toggle("accordion-aktif");
  } else if (target.classList.contains("data-accordion")) {
    const dataAccordionTerpilih = document.querySelector(".data-accordion-terpilih");
    if (dataAccordionTerpilih) dataAccordionTerpilih.classList.remove("data-accordion-terpilih");
    target.classList.add("data-accordion-terpilih");
    document.querySelector(".tombol-dipengaturan .tombol-simpan").style.display = "block";
  }
});
// ===================================================

let soalKe = 0;
let jawabanUser = [];
const seluruhNoSoal = document.querySelector(".seluruh-nomor-soal");
const seluruhOpsi = document.querySelectorAll(".pilihan-ganda li input");
let selesai = false;
let dataHasil = "";
let namaSoalYangTerpilih = "";

// ==== Algoritma untuk kebutuhan modal secara umum =====
// Ketika Halaman dibuka modal pengaturan langsung terbuka
document.getElementById("modalPengaturan").style.display = "flex";
// Ketika tombol modal diklik maka tampilkan modal terkait
const seluruhTombolModal = document.querySelectorAll(".tombol-modal");
const seluruhModal = document.querySelectorAll(".modal");
seluruhTombolModal.forEach((tombolModal) => {
  tombolModal.addEventListener("click", () => {
    seluruhModal.forEach((modal) => {
      if (tombolModal.dataset.namaTombol == modal.dataset.namaModal) modal.style.display = "flex";
    });
  });
});
// ketik tombol tutup-modal di klik
const tutupModal = document.querySelectorAll(".tutup-modal");
tutupModal.forEach((tutup) => {
  tutup.addEventListener("click", () => {
    // modal akan menghilang jika tombol batal sudah ada,
    // dimana tombol batal akan muncul setelah user tekan tombol simpan
    if (document.querySelector(".tombol-dipengaturan .tombol-batal").style.display == "block") {
      modalDitutup();
      const dataAccordionTerpilih = document.querySelector(".data-accordion-terpilih");
      if (dataAccordionTerpilih) dataAccordionTerpilih.classList.remove("data-accordion-terpilih");
      document.querySelectorAll(".data-accordion").forEach((data) => {
        if (data.textContent == namaSoalYangTerpilih) data.classList.add("data-accordion-terpilih");
      });
    }
  });
});
// ===========================================================

// ------- Modal Pengaturan -------
// ketika tombol batal di klik
document.querySelector(".tombol-batal").addEventListener("click", () => {
  modalDitutup();
  const dataAccordionTerpilih = document.querySelector(".data-accordion-terpilih");
  if (dataAccordionTerpilih) dataAccordionTerpilih.classList.remove("data-accordion-terpilih");
  document.querySelectorAll(".data-accordion").forEach((data) => {
    if (data.textContent == namaSoalYangTerpilih) data.classList.add("data-accordion-terpilih");
  });
});
// Ketika tombol simpan diklik
document.querySelector(".tombol-simpan").addEventListener("click", async function () {
  namaSoalYangTerpilih = document.querySelector(".data-accordion-terpilih").textContent;
  document.querySelector(".tombol-dipengaturan .tombol-batal").style.display = "block";
  soalKe = 0;
  modalDitutup();
  dataHasil = await ambilData();
  console.log(dataHasil);

  // Mengganti judul soal sesuai data
  document.querySelector(".judul h3").innerHTML = dataHasil.judul;
  // Menggati seluruh nomor soal sesuai data yang ada di data base
  let nomor = "";
  for (let i = 0; i < dataHasil.jumlah_soal; i++) nomor += `<span>${i + 1}</span>`;

  seluruhNoSoal.innerHTML = nomor;
  seluruhNoSoal.childNodes[soalKe].classList.add("aktif");
  // Mencetak Lembar Soal Ke documen
  mencetakLembarSoal(dataHasil);
  gantiNoAktif();

  // Ketika no soal di klik
  seluruhNoSoal.childNodes.forEach((noSoal) => {
    noSoal.addEventListener("click", () => {
      soalKe = parseInt(noSoal.innerHTML) - 1;
      console.log(soalKe);
      mencetakLembarSoal(dataHasil);
      gantiNoAktif();
      aktifKanOpsi();
    });
  });

  // Riset Lembar Soal
  soalKe = 0;
  jawabanUser = [];
  seluruhOpsi.forEach((opsi) => {
    opsi.checked = false;
    opsi.disabled = false;
  });
  selesai = false;
  document.querySelector(".tombol-selesai").style.display = "block";
  document.querySelector(".hasil").style.display = "none";
  document.querySelector(".jawaban-benar").style.display = "none";
});

// =========================================================
// Ketika tombol batal-radio diklik
batalRadio.addEventListener("click", () => {
  seluruhOpsi.forEach((opsi) => {
    opsi.checked = false;
  });
  jawabanUser[soalKe] = undefined;
  seluruhNoSoal.childNodes[soalKe].classList.remove("terpilih");
  setTimeout(() => {
    batalRadio.style.display = "none";
  }, 50);
});

// Ketika tombol selanjutnya atau sebelumnya di klik
const tombol = document.querySelector(".tombol");
tombol.addEventListener("click", (element) => {
  if (element.target.classList.contains("tombol-selanjutnya")) soalKe++;
  if (element.target.classList.contains("tombol-sebelumnya")) soalKe--;
  if (soalKe < 0) soalKe = dataHasil.jumlah_soal - 1;
  if (soalKe > dataHasil.jumlah_soal - 1) soalKe = 0;
  console.log(soalKe);
  mencetakLembarSoal(dataHasil);
  gantiNoAktif();
  aktifKanOpsi();
});

// Ketika tombol selesai di klik
document.querySelector(".tombol-selesai").addEventListener("click", function () {
  if (confirm("Ntos yakin, Henteu????")) {
    batalRadio.style.display = "none";
    soalKe = 0;
    seluruhOpsi.forEach((opsi) => (opsi.disabled = true));
    this.style.display = "none";
    selesai = true;
    let nilai = 0;
    seluruhNoSoal.childNodes.forEach((noSoal, index) => {
      if (jawabanUser[index] == undefined || jawabanUser[index][0] != dataHasil.soal[index].jawaban_benar) {
        noSoal.classList.add("salah");
      } else {
        noSoal.classList.add("benar");
        nilai++;
      }
    });
    nilai = (100 / dataHasil.jumlah_soal) * nilai;
    const nilaiUser = document.querySelector(".nilai");
    nilaiUser.innerHTML = nilai;
    if (nilai > 75) nilaiUser.style.color = "lightgreen";
    else nilaiUser.style.color = "red";
    nilaiUser.parentElement.parentElement.style.display = "block";
    mencetakLembarSoal(dataHasil);
    gantiNoAktif();
    aktifKanOpsi();
  }
});

// Ketika pilihan ganda atau opsi diklik
seluruhOpsi.forEach((opsi) => {
  opsi.addEventListener("click", function (element) {
    jawabanUser[soalKe] = [element.target.id, element.target.nextElementSibling.innerHTML];
    seluruhNoSoal.childNodes[soalKe].classList.add("terpilih");
    batalRadio.style.display = "block";
    console.log(jawabanUser[soalKe][0]);
  });
});

function modalDitutup() {
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.style.display = "none";
  });
}
function ambilData() {
  return fetch(`soal/${document.querySelector(".data-accordion-terpilih").dataset.file}`)
    .then((result) => result.json())
    .then((result) => result);
}
function aktifKanOpsi() {
  // Apakah Nomor ini sudah dijawab sebelumnya
  if (jawabanUser[soalKe] != undefined) {
    seluruhOpsi.forEach((opsi) => {
      // Jika ya maka radio opsi aktif sesuai jawaban yang telah dipilih sebelumnya
      if (opsi.id == jawabanUser[soalKe][0]) opsi.checked = true;
    });
    if (!selesai) batalRadio.style.display = "block";
  } else {
    // Jika belum maka radio opsi mati semua
    seluruhOpsi.forEach((opsi) => (opsi.checked = false));
    batalRadio.style.display = "none";
  }
}
function gantiNoAktif() {
  // Menghapus class aktif pada seluruh no soal
  seluruhNoSoal.childNodes.forEach((soal) => soal.classList.remove("aktif"));
  // Memberikan class aktif pada soal yang sedang tampil
  seluruhNoSoal.childNodes[soalKe].classList.add("aktif");
}
function mencetakLembarSoal(result) {
  // Mengganti nomor soal
  const noSoal = document.querySelector(".lembar-soal .nomor-soal");
  noSoal.innerHTML = result.soal[soalKe].nomor;
  // Mengganti soal
  const soal = document.querySelector(".soal");
  soal.innerHTML = result.soal[soalKe].pertanyaan.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  // Mengganti pilihan ganda
  const pilihanGanda = document.querySelectorAll(".pilihan-ganda li label");
  pilihanGanda[0].innerHTML = result.soal[soalKe].pilihan.a.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  pilihanGanda[1].innerHTML = result.soal[soalKe].pilihan.b.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  pilihanGanda[2].innerHTML = result.soal[soalKe].pilihan.c.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  pilihanGanda[3].innerHTML = result.soal[soalKe].pilihan.d.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
  if (selesai) {
    const jawabanBenar = document.querySelector(".jawaban-benar");
    // Menggati jawaban yang benar
    jawabanBenar.children[1].children[0].children[0].innerHTML = `${result.soal[soalKe].jawaban_benar}`;
    if (jawabanUser[soalKe] == undefined || jawabanUser[soalKe][0] != result.soal[soalKe].jawaban_benar) {
      jawabanBenar.style.display = "block";
    } else {
      jawabanBenar.style.display = "none";
    }
  }
}
