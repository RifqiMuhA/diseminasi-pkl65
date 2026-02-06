import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import './Landing.css';

gsap.registerPlugin(MotionPathPlugin);

const Landing = () => {
  const container = useRef();
  const planeRef = useRef();
  const bgRef = useRef();
  const contentRef = useRef();

  useGSAP(() => {
    const tl = gsap.timeline();

    gsap.set(".mini-plane", { opacity: 0 }); 
    gsap.set(".flight-path", { strokeDasharray: 1000, strokeDashoffset: 1000, opacity: 1 });

  // --- 1. INTRO (PESAWAT BESAR) ---
    tl.to(planeRef.current, {
      x: '150vw', 
      duration: 4, // Diperlambat sedikit biar kerasa "berat" dan megah
      ease: "power1.inOut",
    })
    .to(bgRef.current, {
      opacity: 0, 
      duration: 1.5, 
      ease: "power2.inOut"
    }, "-=2.8") // Background mulai hilang lebih awal

    // --- 2. KONTEN TEKS dan TOMBOL ---
    // A. Judul & Info 
    tl.from(".landing-content h1, .landing-content h2, .landing-content .details-info", { 
      x: -50,      
      opacity: 0, 
      duration: 1.2, 
      stagger: 0.1,  
      ease: "power2.out"
    }, "-=2.2");

    // B. Tombol "Let's Start" (EFEK KETARIK KARET)
    tl.from(".start-button", {
      x: -200,           
      opacity: 0,
      duration: 2,        
      ease: "power4.out"
    }, "+=0.1");

    gsap.to(".landing-content", {
      y: 15,              // Gerak turun 15px
      duration: 2.5, 
      repeat: -1,         // Ulang selamanya
      yoyo: true,         // Bolak-balik
      ease: "sine.inOut", // Gerakan halus seperti ombak
      delay: 3            // Tunggu 3 detik (setelah intro selesai) baru mulai goyang
    });
    
    // --- 3. ANIMASI RUTE PENERBANGAN (JKT ke SUMATERA) ---
    // Munculkan peta 
    tl.from(".map-layer", {
      x: -100,        // Datang dari kiri 
      opacity: 0,     // Dari transparan
      duration: 1.8,  // Geraknya agak lebih lambat biar elegan
      ease: "power2.out"
    }, "-=4.0");

    // Munculkan Pin Lokasi (Pop up)
    tl.from(".map-pin", {
      scale: 0, opacity: 0, transformOrigin: "center center", duration: 0.5, stagger: 0.1, ease: "back.out(1.7)"
    }, "-=0.5");

    // Munculkan garis rute (path)
    // tl.from(".flight-path", {
    //   opacity: 0, duration: 1.5, stagger: 0.3, ease: "power2.out"
    // }, "-=1.5");
    // tl.fromTo(".flight-path", 
    //   {
    //     strokeDasharray: 1000, // Anggap panjang garis 1000px
    //     strokeDashoffset: 1000, // Geser 1000px (Sembunyi total)
    //     opacity: 1
    //   },
    //   {
    //     strokeDashoffset: 0, // Tarik sampai 0 (Muncul full)
    //     duration: 2.5, 
    //     stagger: 0.5, 
    //     ease: "power1.inOut" 
    //   },
    //   "-=0.2"
    // );

    // --- 4. TERBANGKAN PESAWAT KECIL (LOOPING) ---
    const drawDuration = 2.5; // Durasi menarik garis
    
    // Fungsi Helper untuk Looping setelah sampai tujuan
    const startLooping = (planeId, pathId, duration) => {
      gsap.to(planeId, {
        motionPath: { path: pathId, align: pathId, alignOrigin: [0.5, 0.5], autoRotate: true },
        duration: duration, repeat: -1, repeatDelay: 1, ease: "power1.inOut"
      });
    };

    // --- RUTE 1: ACEH ---
    tl.addLabel("acehStart", "-=0.2"); // Tandai waktu mulai
    
    // Garis Aceh Menggambar
    tl.to("#path-aceh", { 
      strokeDashoffset: 0, duration: drawDuration, ease: "power1.inOut" 
    }, "acehStart");

    // Pesawat Aceh Terbang BERSAMAAN
    tl.to("#plane-aceh", {
      opacity: 1, // Munculkan pesawat
      motionPath: { 
        path: "#path-aceh", align: "#path-aceh", alignOrigin: [0.5, 0.5], autoRotate: true,
        start: 0, end: 1 // Dari ujung ke ujung
      },
      duration: drawDuration, // Waktunya SAMA PERSIS dengan garis
      ease: "power1.inOut",   // Easenya SAMA PERSIS dengan garis
      onComplete: () => startLooping("#plane-aceh", "#path-aceh", 5) // Lanjut looping setelah sampai
    }, "acehStart");


    // --- RUTE 2: SUMUT (Delay 0.5 detik) ---
    tl.addLabel("sumutStart", "-=2.0"); // Overlap dikit biar ngalir

    tl.to("#path-sumut", { 
      strokeDashoffset: 0, duration: drawDuration, ease: "power1.inOut" 
    }, "sumutStart");

    tl.to("#plane-sumut", {
      opacity: 1,
      motionPath: { path: "#path-sumut", align: "#path-sumut", alignOrigin: [0.5, 0.5], autoRotate: true, start: 0, end: 1 },
      duration: drawDuration,
      ease: "power1.inOut",
      onComplete: () => startLooping("#plane-sumut", "#path-sumut", 4)
    }, "sumutStart");


    // --- RUTE 3: SUMBAR (Delay lagi) ---
    tl.addLabel("sumbarStart", "-=2.0");

    tl.to("#path-sumbar", { 
      strokeDashoffset: 0, duration: drawDuration, ease: "power1.inOut" 
    }, "sumbarStart");

    tl.to("#plane-sumbar", {
      opacity: 1,
      motionPath: { path: "#path-sumbar", align: "#path-sumbar", alignOrigin: [0.5, 0.5], autoRotate: true, start: 0, end: 1 },
      duration: drawDuration,
      ease: "power1.inOut",
      onComplete: () => startLooping("#plane-sumbar", "#path-sumbar", 3.5)
    }, "sumbarStart");

  }, { scope: container });

  return (
    <div ref={container} className="landing">
      <div ref={bgRef} className="intro-overlay"></div>
      
      {/* Pesawat Intro Besar */}
      <div className="plane-layer">
        <img ref={planeRef} src="/assets/airplane-top-view.png" alt="Pesawat Intro" className="plane-img" />
      </div>

      <div className="bg-layer">
        <div className="bg-dark-tint"></div>
        <img src="/assets/view-bg1.jpg" className="bg-img" alt="Background" />
      </div>
      
      <div ref={contentRef} className="landing-content">
        <h1 className="main-title">Praktik Kerja Lapangan</h1>
        <h2 className="sub-title">Cerita di balik “Pendataan Rencana Rehabilitasi Rekonstruksi Pascabencana”</h2>
        <div className="details-info">
          <p className="detail-text">Sumatra Barat | Sumatra Utara | Aceh</p>
          <p className="detail-text">14 Januari - 02 Februari 2026</p>
        </div>
        <Link to="/journey" className="start-button custom-btn-style">Let's Start the Journey ➝</Link>
      </div>

      {/* --- LAYER PETA & ANIMASI RUTE --- */}
      <div className="map-layer">
         {/* 1. Gambar Peta Dasar */}
         <img src="/assets/peta-indonesia.png" alt="Peta Sebaran" className="base-map" />

         {/* 2. SVG Overlay (Lapisan Jalur) */}
         {/* viewBox harus cukup besar agar koordinat leluasa */}
         <svg className="routes-svg" viewBox="0 0 500 800" preserveAspectRatio="xMidYMid slice">
            
            {/* DEFINISI GARIS RUTE (Path) */}
            {/* Format: M(Mulai X,Y) Q(Lengkungan X,Y) (Tujuan X,Y) */}
            {/* Koordinat ini estimasi, sesuaikan nanti jika kurang pas */}
            
            {/* 1. JALUR KE ACEH (Paling Jauh) */}
            <path id="path-aceh" className="flight-path" d="M -82 590 Q -250 300 -470 130" />
            
            {/* 2. JALUR KE SUMUT (Tengah) */}
            <path id="path-sumut" className="flight-path" d="M -82 590 Q -210 400 -370 250" />
            
            {/* 3. JALUR KE SUMBAR (Paling Dekat) */}
            <path id="path-sumbar" className="flight-path" d="M -82 590 Q -180 460 -310 360" />

            {/* PIN LOKASI (Lingkaran Kecil) */}
            <circle cx="-82" cy="590" r="8" className="map-pin origin" /> {/* JKT (Merah) */}
            <circle cx="-470" cy="130" r="6" className="map-pin dest" />  {/* Aceh */}
            <circle cx="-370" cy="250" r="6" className="map-pin dest" /> {/* Sumut */}
            <circle cx="-310" cy="360" r="6" className="map-pin dest" /> {/* Sumbar */}

            {/* IKON PESAWAT KECIL (SVG Shape) */}
            {/* Menggunakan Grup <g> agar mudah di-transform */}
            
            <g id="plane-aceh" className="mini-plane">
              {/* Gambar pesawat sederhana (vector) */}
              <path fill="#F3EAD2" transform="rotate(90 12 12)" d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </g>

            <g id="plane-sumut" className="mini-plane">
               <path fill="#F3EAD2" transform="rotate(90 12 12)" d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </g>

            <g id="plane-sumbar" className="mini-plane">
               <path fill="#F3EAD2" transform="rotate(90 12 12)" d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </g>

         </svg>
      </div>

    </div>
  );
};

export default Landing;