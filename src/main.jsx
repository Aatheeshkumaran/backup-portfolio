import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import * as THREE from 'three';
import { ArrowDown, ArrowDownRight, ArrowUpRight, Asterisk, Menu, X, Mail, Download, ExternalLink } from 'lucide-react';
import './style.css';

function GithubMark({ size = 17 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.08c-3.1.67-3.76-1.32-3.76-1.32-.51-1.29-1.24-1.63-1.24-1.63-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 1.71 2.62 1.22 3.26.93.1-.72.39-1.22.71-1.5-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.15-3-.11-.28-.5-1.42.11-2.96 0 0 .94-.3 3.06 1.14a10.7 10.7 0 0 1 5.57 0c2.12-1.44 3.06-1.14 3.06-1.14.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.29-2.61 5.23-5.1 5.51.4.34.75 1.02.75 2.06v3.05c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z"/></svg>;
}

function LinkedinMark({ size = 17 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0h.01Z"/></svg>;
}

function OrbScene() {
  const host = useRef(null);
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, el.clientWidth / el.clientHeight, .1, 100);
    camera.position.z = 7.2;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const group = new THREE.Group(); scene.add(group);
    const geometry = new THREE.IcosahedronGeometry(1.58, 5);
    const material = new THREE.MeshStandardMaterial({ color: 0xc6ff4a, roughness: .24, metalness: .16, flatShading: true });
    const core = new THREE.Mesh(geometry, material); group.add(core);
    const wire = new THREE.Mesh(new THREE.IcosahedronGeometry(1.63, 2), new THREE.MeshBasicMaterial({ color: 0xe4ffab, wireframe: true, transparent: true, opacity: .25 })); group.add(wire);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.05, .006, 8, 180), new THREE.MeshBasicMaterial({ color: 0xc6ff4a, transparent: true, opacity: .5 }));
    ring.rotation.set(1.22, .2, -.35); group.add(ring);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.24, .004, 8, 180), new THREE.MeshBasicMaterial({ color: 0xefffce, transparent: true, opacity: .3 }));
    ring2.rotation.set(.4, -.7, .6); group.add(ring2);
    scene.add(new THREE.AmbientLight(0xffffff, 1.9));
    const light = new THREE.PointLight(0xd5ff81, 18, 20); light.position.set(3, 3, 5); scene.add(light);
    const point = new THREE.PointLight(0xffffff, 9, 12); point.position.set(-4, -1, 2); scene.add(point);
    const starsGeo = new THREE.BufferGeometry(); const coords = [];
    for (let i = 0; i < 440; i++) coords.push((Math.random() - .5) * 13, (Math.random() - .5) * 9, (Math.random() - .5) * 5 - 1);
    starsGeo.setAttribute('position', new THREE.Float32BufferAttribute(coords, 3));
    const stars = new THREE.Points(starsGeo, new THREE.PointsMaterial({ color: 0xc6ff4a, size: .018, transparent: true, opacity: .72 })); scene.add(stars);
    let frame, mx = 0, my = 0, tx = 0, ty = 0;
    const move = e => { const b = el.getBoundingClientRect(); tx = ((e.clientX - b.left) / b.width - .5) * .5; ty = ((e.clientY - b.top) / b.height - .5) * .35; };
    const animate = () => { frame = requestAnimationFrame(animate); mx += (tx - mx) * .035; my += (ty - my) * .035; group.rotation.y += .0028; group.rotation.x = my + Math.sin(Date.now() * .0004) * .06; group.rotation.y += mx * .002; stars.rotation.z -= .00015; renderer.render(scene, camera); };
    animate(); el.addEventListener('pointermove', move);
    const resize = () => { if (!el.clientWidth) return; camera.aspect = el.clientWidth / el.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(el.clientWidth, el.clientHeight); };
    const observer = new ResizeObserver(resize); observer.observe(el);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); el.removeEventListener('pointermove', move); renderer.dispose(); geometry.dispose(); material.dispose(); el.removeChild(renderer.domElement); };
  }, []);
  return <div className="orb-scene" ref={host} aria-hidden="true" />;
}

const projects = [
  { num: '01', title: 'Jarvis AI', label: 'PERSONAL ASSISTANT', description: 'A desktop companion that turns natural language into useful action. Built around Hugging Face language models, with a modular automation layer for the everyday.', tags: ['PYTHON', 'HUGGING FACE', 'NLP', 'AUTOMATION'], tone: 'project-lime', symbol: '✳' },
  { num: '02', title: 'Personal Productivity Tracker', label: 'PRODUCTIVITY TRACKER', description: 'A calm, considered space to plan the day, track progress, and make momentum visible through a focused analytics dashboard.', tags: ['DJANGO', 'JAVASCRIPT', 'HTML / CSS', 'MYSQL'], tone: 'project-violet', symbol: '◒' },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [time, setTime] = useState('');
  useEffect(() => { const tick = () => setTime(new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date())); tick(); const id = setInterval(tick, 30000); return () => clearInterval(id); }, []);
  const closeMenu = () => setMenuOpen(false);
  return <>
    <header className="site-header">
      <a className="brand" href="#home" aria-label="Aatheesh home"><span className="brand-mark">A<span>.</span></span><span className="brand-caption">INDEPENDENT<br/>DEVELOPER</span></a>
      <nav className={menuOpen ? 'nav nav-open' : 'nav'} aria-label="Main navigation">
        <a href="#work" onClick={closeMenu}>Work <span>01</span></a><a href="#about" onClick={closeMenu}>About <span>02</span></a><a href="#contact" onClick={closeMenu}>Contact <span>03</span></a>
        <a className="nav-resume" href="/Aatheesh-Kumaran-Resume.pdf" target="_blank" rel="noreferrer" onClick={closeMenu}>Resume <Download size={13}/></a>
      </nav>
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}>{menuOpen ? <X/> : <Menu/>}</button>
    </header>

    <main>
      <section className="hero" id="home">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy">
          <div className="eyebrow"><span className="live-dot"/> AVAILABLE FOR OPPORTUNITIES <span className="eyebrow-index">COIMBATORE, IN · {time || '—:—'}</span></div>
          <h1>Making the<br/>web feel <span className="italic-word">human<span className="lime-dot">.</span></span></h1>
          <p className="hero-intro">I’m Aatheesh — a developer and designer crafting digital experiences with clarity, care, and a little curiosity.</p>
          <div className="hero-actions"><a href="#work" className="button button-lime">Explore my work <ArrowDownRight size={16}/></a><a href="#contact" className="text-link">Let’s talk <ArrowUpRight size={15}/></a></div>
        </div>
        <div className="hero-art"><div className="art-label label-top">FIG. 001 <span>IDEAS IN MOTION</span></div><OrbScene/><div className="art-coordinate">11°00' N<br/>76°58' E</div><div className="art-caption"><span className="caption-line"/>DESIGN · CODE · ITERATE</div></div>
        <div className="hero-bottom"><span>SCROLL TO EXPLORE <ArrowDown size={13}/></span><span className="hero-bottom-mid">DIGITAL CRAFT / 2026</span><span>01 — 04</span></div>
      </section>

      <section className="intro-strip" id="about"><div className="strip-mark"><Asterisk size={31}/></div><p>A computer science student with a <em>frontend-first</em> mindset, building at the intersection of useful technology and thoughtful design.</p><a href="#about-details" className="round-link" aria-label="Read more about me"><ArrowDownRight size={20}/></a></section>

      <section className="work-section section-pad" id="work">
        <div className="section-heading"><div><span className="section-kicker">SELECTED WORK <span> / 2024 — 2026</span></span><h2>Things I’ve<br/><span className="serif-title">put into the world.</span></h2></div><p className="heading-aside">A few experiments in making<br/>the useful feel delightful.</p></div>
        <div className="project-list">{projects.map(p => <article className={`project-card ${p.tone}`} key={p.num}>
          <div className="project-visual"><div className="visual-top"><span>PROJECT / {p.num}</span><span>◌ &nbsp; CASE STUDY</span></div><div className="visual-orbit orbit-one"/><div className="visual-orbit orbit-two"/><div className="visual-symbol">{p.symbol}</div><div className="visual-window"><div className="window-dots"><i/><i/><i/></div><div className="window-content"><span className="window-tag">{p.label}</span><strong>{p.title}</strong><div className="window-bars"><i/><i/><i/></div><div className="window-pulse">↗</div></div></div><div className="visual-index">AK<span>© 2026</span></div></div>
          <div className="project-info"><div className="project-meta"><span>{p.num} / FEATURED PROJECT</span><a href="https://github.com/Aatheeshkumaran" target="_blank" rel="noreferrer" aria-label={`View ${p.title} on GitHub`}><ArrowUpRight size={20}/></a></div><h3>{p.title}<span className="project-period">— {p.label}</span></h3><p>{p.description}</p><div className="tag-row">{p.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div>
        </article>)}</div>
        <div className="more-work"><span>MORE PROJECTS & CODE</span><a href="https://github.com/Aatheeshkumaran" target="_blank" rel="noreferrer">Explore GitHub <ArrowUpRight size={15}/></a></div>
      </section>

      <section className="about-section section-pad" id="about-details"><div className="section-kicker">A LITTLE ABOUT ME <span> / 02</span></div><div className="about-layout"><h2>Curious by<br/>nature. <span className="serif-title">Builder<br/>by choice.</span></h2><div className="about-copy"><p className="about-lead">I care about how things work — and how they make people feel.</p><p>Currently completing my BE in Computer Science and Engineering at Nehru Institute of Engineering and Technology. I bring together frontend craft, full stack foundations, and a user-first design approach to turn ideas into clear, capable products.</p><div className="education-card"><span className="mini-label">EDUCATION / 2022—2026</span><strong>BE Computer Science & Engineering</strong><span>Nehru Institute of Engineering and Technology · Coimbatore</span><div className="cgpa"><b>7.4</b><span>CGPA</span></div></div></div></div>
        <div className="experience-block"><div className="experience-title"><span className="section-kicker">WHERE I’VE LEARNED <span> / 03</span></span><span className="mini-label">EXPERIENCE</span></div><article className="experience-row"><div className="exp-date">FEB — AUG 2025</div><div><h3>Web Developer Intern</h3><span className="exp-company">Frazon Digital Marketing</span><p>Designed and developed responsive business websites, collaborated with design and marketing teams, and improved performance and cross-browser experience.</p></div><span className="exp-arrow"><ArrowUpRight size={18}/></span></article><article className="experience-row"><div className="exp-date">JAN — JUL 2026</div><div><h3>Python Full Stack Developer Intern</h3><span className="exp-company">Career Ladder</span><p>Built full stack web apps using Django and SQL, integrated REST APIs, and developed responsive interfaces with attention to security and scalability.</p></div><span className="exp-arrow"><ArrowUpRight size={18}/></span></article></div>
      </section>

      <section className="skills-section"><div className="section-pad skills-inner"><div><span className="section-kicker">MY TOOLKIT <span> / 04</span></span><h2>Good tools.<br/><span className="serif-title">Better questions.</span></h2></div><div className="skills-grid"><div className="skill-group"><span>01 — FRONTEND</span><p>React.js · JavaScript<br/>HTML5 · CSS3 · Bootstrap</p></div><div className="skill-group"><span>02 — BACKEND</span><p>Python · Django<br/>REST APIs · SQL</p></div><div className="skill-group"><span>03 — DATA</span><p>MySQL · MongoDB<br/>CRUD · Authentication</p></div><div className="skill-group"><span>04 — PRACTICE</span><p>Figma · Git · Postman<br/>Responsive UI / UX</p></div></div></div><div className="ticker" aria-label="Build with intention, stay curious"><div className="ticker-track">{Array.from({length: 4}, (_, i) => <span key={i}>BUILD WITH INTENTION <Asterisk size={20}/> STAY CURIOUS <Asterisk size={20}/> SHIP WITH CARE <Asterisk size={20}/></span>)}</div></div></section>

      <section className="contact-section section-pad" id="contact"><div className="contact-top"><span className="section-kicker">HAVE A GOOD ONE IN MIND? <span> / CONTACT</span></span><span className="contact-status"><i/> OPEN TO WORK</span></div><h2>Let’s make<br/>something <span className="serif-title">matter.</span></h2><a href="mailto:aatheeshle@gmail.com" className="contact-cta">START A CONVERSATION <ArrowUpRight size={21}/></a><div className="contact-bottom"><a href="mailto:aatheeshle@gmail.com"><Mail size={15}/> AATHEESHLE@GMAIL.COM</a><div className="social-links"><a href="https://www.linkedin.com/in/aatheesh-kumaran/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedinMark size={17}/></a><a href="https://github.com/Aatheeshkumaran" target="_blank" rel="noreferrer" aria-label="GitHub"><GithubMark size={17}/></a><a href="https://aatheeshkumaran.github.io/dev_portfolio/" target="_blank" rel="noreferrer" aria-label="Portfolio"><ExternalLink size={17}/></a></div></div></section>
    </main>
    <footer className="footer"><a className="footer-mark" href="#home">A<span>.</span></a><span>© 2026 AATHEESH KUMARAN SP</span><a href="#home">BACK TO TOP ↑</a><span>MADE WITH CURIOSITY <Asterisk size={13}/></span></footer>
  </>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
