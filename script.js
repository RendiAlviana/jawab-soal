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
let url = "";
let soalKe = 0;
let jawabanUser = [];
const seluruhNoSoal = document.querySelector(".seluruh-nomor-soal");
const seluruhOpsi = document.querySelectorAll(".pilihan-ganda li input");
let selesai = false;
let dataHasil = "";

// Ketika tombol info di klik
const footer = document.querySelector("footer");
document
  .querySelector(".info")
  .addEventListener("click", () => (footer.style.display = "flex"));

// ketik tombol tutup di klik
footer.lastElementChild.addEventListener("click", (element) => {
  footer.style.display = "none";
  url = ambilURL();
  main();
  // Riset Lemabr Soal
  soalKe = 0;
  jawabanUser = [];
  seluruhOpsi.forEach((opsi) => {
    opsi.checked = false;
    opsi.disabled = false;
  });
  selesai = false;
  document.querySelector(".tombol-selesai").style.display = "inline";
  document.querySelector(".hasil").style.display = "none";
  document.querySelector(".jawaban-benar").style.display = "none";
});

// Ketika tombol selanjutnya, sebelumnya, atau selesai diklik
const tombol = document.querySelector(".tombol");
tombol.addEventListener("click", (element) => {
  // Ketika tombol selanjutnya atau sebelumnya di klik
  if (element.target.classList.contains("tombol-selanjutnya")) soalKe++;
  if (element.target.classList.contains("tombol-sebelumnya")) soalKe--;
  if (soalKe < 0) soalKe = dataHasil.jumlah_soal - 1;
  if (soalKe > dataHasil.jumlah_soal - 1) soalKe = 0;
  console.log(soalKe);
  // Ketika tombol selesai di klik
  if (element.target.classList.contains("tombol-selesai")) {
    if (confirm("Rek ntosan bae sugan?")) {
      soalKe = 0;
      seluruhOpsi.forEach((opsi) => (opsi.disabled = true));
      element.target.style.display = "none";
      selesai = true;
      let nilai = 0;
      seluruhNoSoal.childNodes.forEach((noSoal, index) => {
        if (
          jawabanUser[index] == undefined ||
          jawabanUser[index][0] != dataHasil.soal[index].jawaban_benar
        ) {
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
    }
  }
  mencetakLembarSoal(dataHasil);
  gantiNoAktif();
  aktifKanOpsi();
});

// Ketika pilihan ganda atau opsi diklik
seluruhOpsi.forEach((opsi) => {
  opsi.addEventListener("click", (element) => {
    jawabanUser[soalKe] = [
      element.target.id,
      element.target.nextElementSibling.innerHTML,
    ];
    seluruhNoSoal.childNodes[soalKe].classList.add("terpilih");
    console.log(jawabanUser[soalKe][0]);
  });
});

function ambilURL() {
  return `soal/${document.querySelector("footer select").value}.json`;
}

function main() {
  fetch(url)
    .then((result) => result.json())
    .then((result) => {
      // memindahkan result ke data hasil, untuk di pakai di luar fecth
      dataHasil = result;
      // Mengganti judul soal sesuai data
      const judul = document.querySelector(".judul h3");
      judul.innerHTML = result.judul;
      // Menggati seluruh nomor soal sesuai data yang ada di data base
      let nomor = "";
      for (let i = 0; i < result.jumlah_soal; i++) {
        nomor += `<span>${i + 1}</span>`;
      }
      seluruhNoSoal.innerHTML = nomor;
      seluruhNoSoal.childNodes[soalKe].classList.add("aktif");
      // Mencetak Lembar Soal Ke documen
      mencetakLembarSoal(result);

      // Ketika no soal di klik
      seluruhNoSoal.childNodes.forEach((noSoal) => {
        noSoal.addEventListener("click", () => {
          soalKe = parseInt(noSoal.innerHTML) - 1;
          console.log(soalKe);
          mencetakLembarSoal(result);
          gantiNoAktif();
          aktifKanOpsi();
        });
      });
    });
}

function aktifKanOpsi() {
  // Apakah Nomor ini sudah dijawab sebelumnya
  if (jawabanUser[soalKe] != undefined) {
    seluruhOpsi.forEach((opsi) => {
      // Jika ya maka radio opsi aktif sesuai jawaban yang telah dipilih sebelumnya
      if (opsi.id == jawabanUser[soalKe][0]) opsi.checked = true;
    });
  } else {
    // Jika belum maka radio opsi mati semua
    seluruhOpsi.forEach((opsi) => (opsi.checked = false));
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
  soal.innerHTML = result.soal[soalKe].pertanyaan
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
  // Mengganti pilihan ganda
  const pilihanGanda = document.querySelectorAll(".pilihan-ganda li label");
  pilihanGanda[0].innerHTML = result.soal[soalKe].pilihan.a
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
  pilihanGanda[1].innerHTML = result.soal[soalKe].pilihan.b
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
  pilihanGanda[2].innerHTML = result.soal[soalKe].pilihan.c
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
  pilihanGanda[3].innerHTML = result.soal[soalKe].pilihan.d
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
  if (selesai) {
    const jawabanBenar = document.querySelector(".jawaban-benar");
    // Menggati jawaban yang benar
    jawabanBenar.children[1].children[0].children[0].innerHTML = `${result.soal[soalKe].jawaban_benar}`;
    if (
      jawabanUser[soalKe] == undefined ||
      jawabanUser[soalKe][0] != result.soal[soalKe].jawaban_benar
    ) {
      jawabanBenar.style.display = "block";
    } else {
      jawabanBenar.style.display = "none";
    }
  }
}
