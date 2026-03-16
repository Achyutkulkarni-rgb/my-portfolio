import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      background: #020409;
      color: #fff;
      overflow-x: hidden;
      cursor: none;
      font-family: 'Courier New', monospace;
    }
    @media (max-width: 767px) { body { cursor: auto; } }
    ::selection { background: rgba(0,245,212,0.3); color: #fff; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: #020409; }
    ::-webkit-scrollbar-thumb { background: #00f5d4; border-radius: 2px; }
    .hero-section {
      min-height: 100vh;
      display: flex; align-items: center; justify-content: center;
      position: relative; overflow: hidden;
      padding-top: 80px;
    }
    @media (max-width: 900px) {
      .two-col { grid-template-columns: 1fr !important; gap: 40px !important; }
    }
    .nav-links { display: flex; }
    .hamburger { display: none; }
    @media (max-width: 640px) {
      .nav-links { display: none !important; }
      .hamburger { display: block !important; }
    }
  `}</style>
);

// ─── DATA ─────────────────────────────────────────────────────────────────────
const NAV_LINKS = ["About", "Projects", "Skills", "Experience", "Education", "Contact"];

const PROJECTS = [
  {
    id: 1, title: "SkillSwap", year: "2025", emoji: "🤝",
    color: "#00f5d4",
    desc: "A full-stack skill exchange platform where users can register their skills and get matched with people who can teach or learn from them. Includes authentication, skill matching algorithm, and real-time chat.",
    stack: ["React", "Node.js", "Express", "MongoDB", "Socket.io"],
    live: "https://skillswap-frontend-eta.vercel.app/", github: "https://github.com/Achyutkulkarni-rgb",
  },
  {
    id: 2, title: "Vehicle Movement Analysis", year: "2024", emoji: "🚗",
    color: "#f72585",
    desc: "System for analyzing vehicle movement data to monitor traffic patterns and optimize transportation efficiency using real-time data visualization.",
    stack: ["Python", "Data Analysis", "Machine Learning", "OpenCV", "Matplotlib"],
    live: "#", github: "https://github.com/Achyutkulkarni-rgb",
  },
  {
    id: 3, title: "Solar Powered Smart Irrigation", year: "2024", emoji: "🌱",
    color: "#7209b7",
    desc: "IoT-based smart irrigation system using solar energy and sensors to monitor soil moisture and automatically control water supply for efficient farming.",
    stack: ["Raspberry Pi", "Python", "IoT Sensors", "Solar Power", "Automation"],
    live: "#", github: "https://github.com/Achyutkulkarni-rgb",
  },
  {
    id: 4, title: "E-Commerce Web Application", year: "2025", emoji: "🛒",
    color: "#4cc9f0",
    desc: "Full-stack shopping platform with product catalog, authentication, cart functionality, order management, and address-based checkout system.",
    stack: ["React", "Node.js", "Express", "MongoDB", "JWT"],
    live: "#", github: "https://github.com/Achyutkulkarni-rgb",
  },
];

const SKILLS = [
  { name: "JavaScript",    level: 96, icon: "JS", color: "#f7df1e" },
  { name: "React/Next.js", level: 94, icon: "⚛",  color: "#61dafb" },
  { name: "Node.js",       level: 88, icon: "⬡",  color: "#68a063" },
  { name: "TypeScript",    level: 85, icon: "TS",  color: "#3178c6" },
  { name: "Python",        level: 80, icon: "🐍",  color: "#3572A5" },
  { name: "MongoDB",       level: 82, icon: "🍃",  color: "#47a248" },
  { name: "PostgreSQL",    level: 78, icon: "🐘",  color: "#336791" },
  { name: "Java",          level: 72, icon: "☕",  color: "#f89820" },
];

const EXPERIENCE = [
  {
    role: "ISRO Intern", company: "Indian Space Research Organisation",
    period: "2025", color: "#00f5d4",
    desc: "Developed a command interpreter using JavaScript to process and execute system commands efficiently. Focused on parsing inputs, handling command logic, and improving execution workflow.",
  },
  {
    role: "Full Stack Developer Intern", company: "KodNest",
    period: "2025 – 2026", color: "#f72585",
    desc: "Learned and implemented full-stack development concepts including Java, JavaScript, React, and backend development while building multiple projects and strengthening problem-solving skills.",
  },
  {
    role: "Backend Developer", company: "Amealio",
    period: "2026 – Present", color: "#4cc9f0",
    desc: "Developing backend services and APIs using Node.js and Express. Working with databases, authentication systems, and improving server performance while supporting frontend integrations.",
  },
];

const EDUCATION = [
  {
    degree: "B.Tech – Electronics and Communication Engineering",
    institution: "Sharnbasva University, Kalaburagi",
    period: "Dec 2021 – Jun 2025",
    grade: "CGPA: 8.78 / 10",
    color: "#00f5d4",
    icon: "🎓",
  },
];

const CERTIFICATIONS = [
  {
    title: "ISRO Internship",
    issuer: "Indian Space Research Organisation",
    year: "2025",
    desc: "Worked on real-time system-level task validation and quality-focused development.",
    color: "#00f5d4",
    icon: "🛸",
  },
  {
    title: "Intel Certified Project",
    issuer: "Intel – Edge AI Analysis",
    year: "2024",
    desc: "Applied review parameters and consistency checks in AI workflows for vehicle movement analysis.",
    color: "#f72585",
    icon: "🤖",
  },
  {
    title: "Core Java Certification",
    issuer: "Internshala",
    year: "2024",
    desc: "Completed Core Java certification with a score of 87, covering OOP, data structures, and Java fundamentals.",
    color: "#4cc9f0",
    icon: "☕",
  },
];

const lerp = (a, b, t) => a + (b - a) * t;

// ─── LOADING SCREEN ───────────────────────────────────────────────────────────
function LoadingScreen({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    let v = 0;
    const id = setInterval(() => {
      v += Math.random() * 4 + 1;
      if (v >= 100) { v = 100; clearInterval(id); setTimeout(() => setPhase(1), 300); }
      setProgress(Math.floor(v));
    }, 40);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    if (phase === 1) { setTimeout(() => { setPhase(2); setTimeout(onDone, 600); }, 400); }
  }, [phase, onDone]);
  return (
    <AnimatePresence>
      {phase < 2 && (
        <motion.div key="loader" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          style={{ position: "fixed", inset: 0, zIndex: 10000, background: "#020409", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <motion.div animate={phase === 1 ? { scale: [1, 18], opacity: [1, 0] } : {}} transition={{ duration: 0.4 }} style={{ textAlign: "center" }}>
            <motion.p animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 2 }}
              style={{ fontSize: "11px", letterSpacing: "0.4em", color: "#00f5d4", marginBottom: "32px", textTransform: "uppercase" }}>
              Initializing Portfolio
            </motion.p>
            <div style={{ fontSize: "clamp(64px,12vw,120px)", fontWeight: 900, color: "#fff", lineHeight: 1, letterSpacing: "-0.04em" }}>
              {String(progress).padStart(3, "0")}<span style={{ color: "#00f5d4" }}>%</span>
            </div>
            <div style={{ width: "200px", height: "1px", background: "#111", margin: "24px auto 0", position: "relative", overflow: "hidden" }}>
              <motion.div animate={{ width: `${progress}%` }} style={{ height: "100%", background: "#00f5d4", position: "absolute", left: 0, top: 0 }} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── CUSTOM CURSOR ────────────────────────────────────────────────────────────
function CustomCursor() {
  const dot = useRef(null), ring = useRef(null);
  const pos = useRef({ x: 0, y: 0 }), rPos = useRef({ x: 0, y: 0 });
  const raf = useRef(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (window.innerWidth < 768) return;
    setShow(true);
    const mv = (e) => { pos.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", mv);
    const tick = () => {
      if (dot.current) { dot.current.style.left = pos.current.x + "px"; dot.current.style.top = pos.current.y + "px"; }
      if (ring.current) {
        rPos.current.x = lerp(rPos.current.x, pos.current.x, 0.12);
        rPos.current.y = lerp(rPos.current.y, pos.current.y, 0.12);
        ring.current.style.left = rPos.current.x + "px";
        ring.current.style.top  = rPos.current.y + "px";
      }
      raf.current = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(raf.current); window.removeEventListener("mousemove", mv); };
  }, []);
  if (!show) return null;
  return (
    <>
      <div ref={dot} style={{ position: "fixed", width: 6, height: 6, borderRadius: "50%", background: "#00f5d4", pointerEvents: "none", zIndex: 9999, transform: "translate(-50%,-50%)", mixBlendMode: "difference" }} />
      <div ref={ring} style={{ position: "fixed", width: 30, height: 30, borderRadius: "50%", border: "1.5px solid #00f5d4", pointerEvents: "none", zIndex: 9998, transform: "translate(-50%,-50%)" }} />
    </>
  );
}

// ─── PARTICLE FIELD ───────────────────────────────────────────────────────────
function ParticleField() {
  const cvs = useRef(null), raf = useRef(null), pts = useRef([]), mou = useRef({ x: -9999, y: -9999 });
  useEffect(() => {
    const canvas = cvs.current, ctx = canvas.getContext("2d");
    let W, H;
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const COLORS = ["#00f5d4","#f72585","#4cc9f0","#7209b7"];
    pts.current = Array.from({ length: window.innerWidth < 600 ? 60 : 120 }, () => ({
      x: Math.random()*window.innerWidth, y: Math.random()*window.innerHeight,
      vx: (Math.random()-0.5)*0.4, vy: (Math.random()-0.5)*0.4,
      r: Math.random()*1.5+0.5, a: Math.random()*0.5+0.1,
      c: COLORS[Math.floor(Math.random()*4)],
    }));
    const mv = (e) => { mou.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", mv);
    const draw = () => {
      ctx.clearRect(0,0,W,H);
      pts.current.forEach((p,i) => {
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0)p.x=W; if(p.x>W)p.x=0; if(p.y<0)p.y=H; if(p.y>H)p.y=0;
        const dx=p.x-mou.current.x, dy=p.y-mou.current.y, d0=Math.sqrt(dx*dx+dy*dy);
        if(d0<100){p.x+=dx/d0*1.5; p.y+=dy/d0*1.5;}
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=p.c; ctx.globalAlpha=p.a; ctx.fill();
        pts.current.slice(i+1).forEach(q => {
          const d=Math.hypot(p.x-q.x,p.y-q.y);
          if(d<100){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle=p.c;ctx.globalAlpha=(1-d/100)*0.12;ctx.lineWidth=0.5;ctx.stroke();}
        });
        ctx.globalAlpha=1;
      });
      raf.current=requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf.current); window.removeEventListener("resize",resize); window.removeEventListener("mousemove",mv); };
  }, []);
  return <canvas ref={cvs} style={{ position:"fixed",top:0,left:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0,opacity:0.7 }} />;
}

// ─── GRADIENT BG ─────────────────────────────────────────────────────────────
function GradientBg() {
  return (
    <div style={{ position:"fixed",inset:0,zIndex:-1,overflow:"hidden" }}>
      <div style={{ position:"absolute",inset:0,background:"#020409" }} />
      {[
        {x:"10%",y:"20%",color:"#00f5d4",size:"600px",dur:8},
        {x:"80%",y:"10%",color:"#f72585",size:"500px",dur:12},
        {x:"50%",y:"70%",color:"#7209b7",size:"700px",dur:10},
        {x:"20%",y:"80%",color:"#4cc9f0",size:"400px",dur:9},
      ].map((b,i) => (
        <motion.div key={i}
          animate={{x:[0,30,-20,0],y:[0,-20,30,0],scale:[1,1.1,0.95,1]}}
          transition={{duration:b.dur,repeat:Infinity,ease:"easeInOut",delay:i*2}}
          style={{position:"absolute",left:b.x,top:b.y,width:b.size,height:b.size,borderRadius:"50%",background:b.color,filter:"blur(120px)",opacity:0.05,transform:"translate(-50%,-50%)"}}
        />
      ))}
    </div>
  );
}

// ─── TYPING TEXT ─────────────────────────────────────────────────────────────
function TypingText({ phrases }) {
  const [idx,setIdx]=useState(0), [text,setText]=useState(""), [del,setDel]=useState(false);
  useEffect(()=>{
    const cur=phrases[idx];
    if(!del&&text.length<cur.length){const t=setTimeout(()=>setText(cur.slice(0,text.length+1)),65);return()=>clearTimeout(t);}
    if(!del&&text.length===cur.length){const t=setTimeout(()=>setDel(true),2000);return()=>clearTimeout(t);}
    if(del&&text.length>0){const t=setTimeout(()=>setText(text.slice(0,-1)),32);return()=>clearTimeout(t);}
    if(del&&text.length===0){setDel(false);setIdx((idx+1)%phrases.length);}
  },[text,del,idx,phrases]);
  return <span>{text}<motion.span animate={{opacity:[1,0]}} transition={{repeat:Infinity,duration:0.7}} style={{color:"#00f5d4"}}>|</motion.span></span>;
}

// ─── MAGNETIC BUTTON ─────────────────────────────────────────────────────────
function MagneticBtn({ children, onClick, primary, href }) {
  const ref=useRef(null), [p,setP]=useState({x:0,y:0});
  const Tag = href ? motion.a : motion.button;
  return (
    <Tag ref={ref}
      href={href} download={href ? true : undefined}
      onMouseMove={e=>{const r=ref.current.getBoundingClientRect();setP({x:(e.clientX-r.left-r.width/2)*0.3,y:(e.clientY-r.top-r.height/2)*0.3});}}
      onMouseLeave={()=>setP({x:0,y:0})}
      animate={{x:p.x,y:p.y}} transition={{type:"spring",stiffness:300,damping:20}}
      whileHover={{scale:1.05}} whileTap={{scale:0.97}} onClick={onClick}
      style={{
        padding:"14px 32px",borderRadius:"4px",fontSize:"13px",letterSpacing:"0.15em",
        textTransform:"uppercase",fontWeight:700,cursor:"pointer",textDecoration:"none",
        display:"inline-flex",alignItems:"center",gap:"8px",
        ...(primary?{background:"linear-gradient(135deg,#00f5d4,#4cc9f0)",border:"none",color:"#020409",boxShadow:"0 0 30px rgba(0,245,212,0.35)"}
          :{background:"transparent",border:"1px solid rgba(255,255,255,0.25)",color:"#fff"}),
      }}
    >{children}</Tag>
  );
}

// ─── FLOATING SHAPE ───────────────────────────────────────────────────────────
function FloatingShape({x,y,size,color,delay,shape}) {
  return (
    <motion.div
      animate={{opacity:[0.1,0.3,0.1],scale:[1,1.1,1],y:[0,-20,0],rotate:[0,180,360]}}
      transition={{duration:9,repeat:Infinity,delay,ease:"easeInOut"}}
      style={{
        position:"absolute",left:x,top:y,width:size,height:size,
        borderRadius:shape==="circle"?"50%":"8px",
        background:shape==="triangle"?"transparent":`linear-gradient(135deg,${color}44,${color}11)`,
        border:`1px solid ${color}44`,backdropFilter:"blur(4px)",
        clipPath:shape==="triangle"?"polygon(50% 0%,0% 100%,100% 100%)":undefined,
        pointerEvents:"none",
      }}
    />
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled,setScrolled]=useState(false), [open,setOpen]=useState(false);
  useEffect(()=>{const h=()=>setScrolled(window.scrollY>40);window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h);},[]);
  const goto=(id)=>{setOpen(false);document.getElementById(id.toLowerCase())?.scrollIntoView({behavior:"smooth"});};
  return (
    <motion.nav initial={{y:-80,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:0.2,duration:0.8,ease:[0.16,1,0.3,1]}}
      style={{position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"16px 40px",display:"flex",alignItems:"center",justifyContent:"space-between",
        background:scrolled?"rgba(2,4,9,0.85)":"transparent",backdropFilter:scrolled?"blur(20px)":"none",
        borderBottom:scrolled?"1px solid rgba(255,255,255,0.04)":"none",transition:"all 0.4s"}}>
      <motion.div whileHover={{scale:1.05}} onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}
        style={{cursor:"pointer",display:"flex",alignItems:"center",gap:"10px"}}>
        <div style={{width:32,height:32,borderRadius:"8px",background:"linear-gradient(135deg,#00f5d4,#f72585)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:"14px",color:"#020409"}}>A</div>
        <span style={{fontWeight:700,fontSize:"16px"}}>Achyut.dev</span>
      </motion.div>
      <div className="nav-links" style={{gap:"4px",alignItems:"center"}}>
        {NAV_LINKS.map(l=>(
          <motion.button key={l} whileHover={{color:"#00f5d4"}} onClick={()=>goto(l)}
            style={{background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.5)",fontSize:"13px",letterSpacing:"0.1em",padding:"8px 14px",textTransform:"uppercase",transition:"color 0.2s"}}>{l}</motion.button>
        ))}
        <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.97}} onClick={()=>goto("contact")}
          style={{marginLeft:"8px",background:"transparent",border:"1px solid #00f5d4",color:"#00f5d4",padding:"8px 20px",borderRadius:"4px",cursor:"pointer",fontSize:"12px",letterSpacing:"0.1em",textTransform:"uppercase"}}>Hire Me</motion.button>
      </div>
      <button className="hamburger" onClick={()=>setOpen(!open)} style={{background:"none",border:"none",cursor:"pointer",padding:"8px"}}>
        <div style={{width:24,display:"flex",flexDirection:"column",gap:"5px"}}>
          {[0,1,2].map(i=><motion.div key={i} animate={open?i===0?{rotate:45,y:7}:i===1?{opacity:0}:{rotate:-45,y:-7}:{rotate:0,y:0,opacity:1}} style={{height:2,background:"#00f5d4",borderRadius:2}}/>)}
        </div>
      </button>
      <AnimatePresence>
        {open&&<motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}
          style={{position:"absolute",top:"100%",left:0,right:0,background:"rgba(2,4,9,0.97)",backdropFilter:"blur(20px)",padding:"20px",display:"flex",flexDirection:"column",gap:"4px",borderBottom:"1px solid rgba(0,245,212,0.15)"}}>
          {[...NAV_LINKS,"Hire Me"].map(l=><button key={l} onClick={()=>goto(l)} style={{background:"none",border:"none",cursor:"pointer",color:"#fff",fontSize:"14px",padding:"12px 0",textAlign:"left",borderBottom:"1px solid rgba(255,255,255,0.05)",letterSpacing:"0.1em",textTransform:"uppercase"}}>{l}</button>)}
        </motion.div>}
      </AnimatePresence>
    </motion.nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  const {scrollY}=useScroll();
  const y=useTransform(scrollY,[0,600],[0,150]);
  const opacity=useTransform(scrollY,[0,400],[1,0]);
  const shapes=[
    {x:"8%",y:"20%",size:60,color:"#00f5d4",delay:0,shape:"circle"},
    {x:"85%",y:"15%",size:80,color:"#f72585",delay:1,shape:"square"},
    {x:"75%",y:"65%",size:50,color:"#4cc9f0",delay:2,shape:"triangle"},
    {x:"12%",y:"70%",size:70,color:"#7209b7",delay:0.5,shape:"square"},
    {x:"50%",y:"85%",size:40,color:"#00f5d4",delay:1.5,shape:"circle"},
    {x:"30%",y:"10%",size:55,color:"#f72585",delay:2.5,shape:"circle"},
    {x:"60%",y:"30%",size:45,color:"#7209b7",delay:3,shape:"triangle"},
    {x:"90%",y:"50%",size:35,color:"#4cc9f0",delay:1,shape:"square"},
  ];
  return (
    <motion.section id="hero" className="hero-section" style={{y,opacity}}>
      {shapes.map((s,i)=><FloatingShape key={i} {...s}/>)}
      <div style={{position:"relative",zIndex:2,textAlign:"center",padding:"0 20px"}}>
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.5,duration:0.6}}
          style={{fontSize:"11px",letterSpacing:"0.4em",color:"#00f5d4",textTransform:"uppercase",marginBottom:"24px",display:"flex",alignItems:"center",justifyContent:"center",gap:"12px"}}>
          <motion.span animate={{opacity:[0,1,0]}} transition={{repeat:Infinity,duration:2}} style={{width:6,height:6,borderRadius:"50%",background:"#00f5d4",display:"inline-block"}}/>
          Available for work
          <motion.span animate={{opacity:[0,1,0]}} transition={{repeat:Infinity,duration:2,delay:1}} style={{width:6,height:6,borderRadius:"50%",background:"#00f5d4",display:"inline-block"}}/>
        </motion.div>
        <motion.h1 initial={{opacity:0,y:40}} animate={{opacity:1,y:0}} transition={{delay:0.7,duration:0.8,ease:[0.16,1,0.3,1]}}
          style={{fontSize:"clamp(48px,9vw,120px)",fontWeight:900,lineHeight:0.95,letterSpacing:"-0.04em",color:"#fff",marginBottom:"12px"}}>
          Achyut
          <span style={{display:"block",WebkitTextStroke:"1px rgba(255,255,255,0.3)",WebkitTextFillColor:"transparent"}}>Kulkarni</span>
        </motion.h1>
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1,duration:0.6}}
          style={{fontSize:"clamp(18px,3vw,28px)",color:"rgba(255,255,255,0.55)",marginBottom:"48px",minHeight:"1.4em"}}>
          <TypingText phrases={["Full Stack Developer","React Specialist","Node.js Engineer","Open Source Contributor","Performance Obsessed"]}/>
        </motion.div>
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:1.2,duration:0.6}}
          style={{display:"flex",gap:"16px",justifyContent:"center",flexWrap:"wrap"}}>
          <MagneticBtn primary onClick={()=>document.getElementById("projects")?.scrollIntoView({behavior:"smooth"})}>View Projects</MagneticBtn>
          <MagneticBtn onClick={()=>document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}>Get In Touch</MagneticBtn>
        </motion.div>
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.8,duration:1}} style={{marginTop:"80px",display:"flex",justifyContent:"center"}}>
          <motion.div animate={{y:[0,10,0]}} transition={{repeat:Infinity,duration:2,ease:"easeInOut"}}
            onClick={()=>document.getElementById("about")?.scrollIntoView({behavior:"smooth"})}
            style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"8px",cursor:"pointer"}}>
            <span style={{fontSize:"11px",letterSpacing:"0.3em",color:"rgba(255,255,255,0.3)",textTransform:"uppercase"}}>Scroll</span>
            <div style={{width:1,height:40,background:"linear-gradient(to bottom,#00f5d4,transparent)"}}/>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const SectionLabel=({children})=>(
  <div style={{fontSize:"11px",letterSpacing:"0.4em",color:"#00f5d4",textTransform:"uppercase",marginBottom:"16px",display:"flex",alignItems:"center",gap:"12px"}}>
    <div style={{width:20,height:1,background:"#00f5d4"}}/>{children}
  </div>
);
const SectionTitle=({children})=>(
  <h2 style={{fontSize:"clamp(32px,5vw,64px)",fontWeight:900,letterSpacing:"-0.03em",lineHeight:1.05,marginBottom:"56px"}}>{children}</h2>
);

// ─── ABOUT ───────────────────────────────────────────────────────────────────
function About() {
  const ref=useRef(null), inView=useInView(ref,{once:true,margin:"-100px"});
  const stats=[
    {num:"0-1",label:"Years Experience",color:"#00f5d4"},
    {num:"5+",label:"Projects Shipped",color:"#f72585"},
    {num:"2+",label:"Open Source Repos",color:"#4cc9f0"},
    {num:"87",label:"Internshala Score",color:"#7209b7"},
  ];
  return (
    <section id="about" style={{padding:"120px 40px"}}>
      <div ref={ref} style={{maxWidth:"1200px",margin:"0 auto"}}>
        <SectionLabel>About Me</SectionLabel>
        <div className="two-col" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"80px",alignItems:"start"}}>
          <div>
            <SectionTitle>Crafting digital<br/>experiences that<br/><span style={{WebkitTextStroke:"1px rgba(255,255,255,0.3)",WebkitTextFillColor:"transparent"}}>matter.</span></SectionTitle>
            <p style={{color:"rgba(255,255,255,0.55)",lineHeight:1.8,fontSize:"14px",marginBottom:"20px"}}>Results-driven Full Stack Developer with hands-on experience in designing, developing, and deploying scalable web applications. Proficient in building secure REST APIs and responsive front-end interfaces.</p>
            <p style={{color:"rgba(255,255,255,0.35)",lineHeight:1.8,fontSize:"14px",marginBottom:"32px"}}>Based in Hyderabad. Currently working at Amealio. Open to new opportunities and freelance projects. Specializing in Node.js backends, React frontends, and everything in between.</p>
            <MagneticBtn
              href="/Achyut_CV.pdf"
              primary
            >
              ⬇ Download Resume
            </MagneticBtn>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"}}>
            {stats.map((c,i)=>(
              <motion.div key={i} initial={{opacity:0,y:30}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:i*0.1,duration:0.6,ease:[0.16,1,0.3,1]}} whileHover={{y:-4,boxShadow:`0 20px 40px ${c.color}22`}}
                style={{padding:"32px 24px",borderRadius:"12px",border:`1px solid ${c.color}22`,background:`linear-gradient(135deg,${c.color}08,transparent)`,backdropFilter:"blur(10px)",transition:"box-shadow 0.3s"}}>
                <div style={{fontSize:"clamp(28px,4vw,42px)",fontWeight:900,color:c.color,lineHeight:1,marginBottom:"8px"}}>{c.num}</div>
                <div style={{fontSize:"12px",color:"rgba(255,255,255,0.4)",letterSpacing:"0.05em"}}>{c.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── PROJECT CARD ─────────────────────────────────────────────────────────────
function ProjectCard({p,index}) {
  const ref=useRef(null), inView=useInView(ref,{once:true,margin:"-80px"});
  const [hov,setHov]=useState(false), [modal,setModal]=useState(false);
  return (
    <>
      <motion.div ref={ref} initial={{opacity:0,y:50}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:index*0.12,duration:0.7,ease:[0.16,1,0.3,1]}}
        onHoverStart={()=>setHov(true)} onHoverEnd={()=>setHov(false)} whileHover={{y:-8}} onClick={()=>setModal(true)}
        style={{borderRadius:"16px",overflow:"hidden",cursor:"pointer",border:`1px solid ${hov?p.color+"44":"rgba(255,255,255,0.06)"}`,background:`linear-gradient(135deg,${p.color}08,rgba(2,4,9,0.6))`,backdropFilter:"blur(20px)",transition:"border-color 0.3s"}}>
        <div style={{padding:"40px 32px 28px",borderBottom:`1px solid ${p.color}15`,position:"relative",overflow:"hidden"}}>
          <motion.div animate={{scale:hov?1.5:1,opacity:hov?0.15:0.05}} style={{position:"absolute",top:"-20px",right:"-20px",width:"120px",height:"120px",borderRadius:"50%",background:p.color,filter:"blur(40px)",pointerEvents:"none"}}/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <span style={{fontSize:"32px"}}>{p.emoji}</span>
            <span style={{fontSize:"11px",color:p.color,letterSpacing:"0.2em",border:`1px solid ${p.color}33`,padding:"4px 10px",borderRadius:"3px"}}>{p.year}</span>
          </div>
          <h3 style={{fontSize:"22px",fontWeight:800,color:"#fff",marginTop:"16px",letterSpacing:"-0.02em"}}>{p.title}</h3>
        </div>
        <div style={{padding:"24px 32px 32px"}}>
          <p style={{color:"rgba(255,255,255,0.5)",fontSize:"13px",lineHeight:1.7,marginBottom:"20px"}}>{p.desc}</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:"8px",marginBottom:"20px"}}>
            {p.stack.map(s=><span key={s} style={{fontSize:"11px",color:p.color,background:p.color+"15",padding:"4px 10px",borderRadius:"3px",border:`1px solid ${p.color}22`}}>{s}</span>)}
          </div>
          <div style={{display:"flex",gap:"20px"}}>
            {[{label:"Live Demo →",href:p.live},{label:"GitHub ↗",href:p.github}].map(l=>(
              <motion.a key={l.label} href={l.href} onClick={e=>e.stopPropagation()} whileHover={{color:p.color}}
                style={{fontSize:"12px",color:"rgba(255,255,255,0.35)",textDecoration:"none",letterSpacing:"0.1em",transition:"color 0.2s"}}>{l.label}</motion.a>
            ))}
          </div>
        </div>
      </motion.div>
      <AnimatePresence>
        {modal&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setModal(false)}
            style={{position:"fixed",inset:0,zIndex:1000,background:"rgba(2,4,9,0.85)",backdropFilter:"blur(20px)",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
            <motion.div initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.8,opacity:0}} transition={{type:"spring",stiffness:300,damping:25}}
              onClick={e=>e.stopPropagation()} style={{background:"#0a0d16",borderRadius:"20px",maxWidth:"600px",width:"100%",border:`1px solid ${p.color}33`,overflow:"hidden"}}>
              <div style={{padding:"40px",background:`linear-gradient(135deg,${p.color}15,transparent)`,borderBottom:`1px solid ${p.color}22`}}>
                <div style={{fontSize:"48px",marginBottom:"16px"}}>{p.emoji}</div>
                <h2 style={{fontSize:"32px",fontWeight:900,letterSpacing:"-0.03em"}}>{p.title}</h2>
              </div>
              <div style={{padding:"32px 40px 40px"}}>
                <p style={{color:"rgba(255,255,255,0.6)",lineHeight:1.8,marginBottom:"24px"}}>{p.desc}</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:"8px",marginBottom:"32px"}}>
                  {p.stack.map(s=><span key={s} style={{fontSize:"12px",color:p.color,background:p.color+"15",padding:"6px 14px",borderRadius:"4px"}}>{s}</span>)}
                </div>
                <div style={{display:"flex",gap:"12px"}}>
                  <a href={p.live} style={{flex:1,textAlign:"center",padding:"12px",background:`linear-gradient(135deg,${p.color},${p.color}99)`,color:"#020409",fontSize:"13px",fontWeight:700,borderRadius:"6px",textDecoration:"none",letterSpacing:"0.1em"}}>LIVE DEMO →</a>
                  <a href={p.github} style={{flex:1,textAlign:"center",padding:"12px",border:`1px solid ${p.color}44`,color:p.color,fontSize:"13px",fontWeight:700,borderRadius:"6px",textDecoration:"none",letterSpacing:"0.1em"}}>GITHUB ↗</a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Projects() {
  return (
    <section id="projects" style={{padding:"120px 40px",background:"rgba(255,255,255,0.01)"}}>
      <div style={{maxWidth:"1200px",margin:"0 auto"}}>
        <SectionLabel>Featured Work</SectionLabel>
        <SectionTitle>Projects that<br/><span style={{WebkitTextStroke:"1px rgba(255,255,255,0.3)",WebkitTextFillColor:"transparent"}}>push limits.</span></SectionTitle>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(min(100%,500px),1fr))",gap:"24px"}}>
          {PROJECTS.map((p,i)=><ProjectCard key={p.id} p={p} index={i}/>)}
        </div>
      </div>
    </section>
  );
}

// ─── SKILLS ──────────────────────────────────────────────────────────────────
function SkillRing({skill,index}) {
  const ref=useRef(null), inView=useInView(ref,{once:true,margin:"-60px"});
  const R=45, circ=2*Math.PI*R;
  return (
    <motion.div ref={ref} initial={{opacity:0,scale:0.8}} animate={inView?{opacity:1,scale:1}:{}} transition={{delay:index*0.08,duration:0.5,ease:[0.16,1,0.3,1]}} whileHover={{y:-4}}
      style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"12px",padding:"24px 16px",borderRadius:"12px",border:"1px solid rgba(255,255,255,0.05)",background:"rgba(255,255,255,0.02)",backdropFilter:"blur(10px)"}}>
      <div style={{position:"relative",width:110,height:110}}>
        <svg width={110} height={110} style={{transform:"rotate(-90deg)"}}>
          <circle cx={55} cy={55} r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={6}/>
          <motion.circle cx={55} cy={55} r={R} fill="none" stroke={skill.color} strokeWidth={6} strokeLinecap="round"
            strokeDasharray={circ} initial={{strokeDashoffset:circ}}
            animate={inView?{strokeDashoffset:circ-(circ*skill.level)/100}:{}}
            transition={{delay:index*0.08+0.3,duration:1.2,ease:[0.16,1,0.3,1]}}
            style={{filter:`drop-shadow(0 0 6px ${skill.color}88)`}}/>
        </svg>
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
          <span style={{fontSize:"20px",lineHeight:1}}>{skill.icon}</span>
          <motion.span initial={{opacity:0}} animate={inView?{opacity:1}:{}} transition={{delay:index*0.08+0.8}}
            style={{fontSize:"13px",fontWeight:700,color:skill.color,marginTop:"4px"}}>{skill.level}%</motion.span>
        </div>
      </div>
      <span style={{fontSize:"12px",color:"rgba(255,255,255,0.6)",textAlign:"center",letterSpacing:"0.05em"}}>{skill.name}</span>
    </motion.div>
  );
}

function Skills() {
  return (
    <section id="skills" style={{padding:"120px 40px"}}>
      <div style={{maxWidth:"1200px",margin:"0 auto"}}>
        <SectionLabel>Technical Skills</SectionLabel>
        <SectionTitle>Built with the<br/><span style={{WebkitTextStroke:"1px rgba(255,255,255,0.3)",WebkitTextFillColor:"transparent"}}>right tools.</span></SectionTitle>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:"16px"}}>
          {SKILLS.map((s,i)=><SkillRing key={s.name} skill={s} index={i}/>)}
        </div>
      </div>
    </section>
  );
}

// ─── EXPERIENCE ──────────────────────────────────────────────────────────────
function ExpItem({exp,index}) {
  const ref=useRef(null), inView=useInView(ref,{once:true,margin:"-60px"});
  return (
    <motion.div ref={ref} initial={{opacity:0,x:-40}} animate={inView?{opacity:1,x:0}:{}} transition={{delay:index*0.1,duration:0.7,ease:[0.16,1,0.3,1]}}
      style={{paddingLeft:"60px",paddingBottom:"56px",position:"relative"}}>
      <motion.div animate={inView?{scale:[0,1.3,1]}:{scale:0}} transition={{delay:index*0.1+0.2,duration:0.4}}
        style={{position:"absolute",left:"12px",top:"8px",width:17,height:17,borderRadius:"50%",background:exp.color,boxShadow:`0 0 12px ${exp.color}88`,border:"3px solid #020409"}}/>
      <div style={{padding:"28px 32px",borderRadius:"12px",border:`1px solid ${exp.color}22`,background:`linear-gradient(135deg,${exp.color}06,transparent)`,backdropFilter:"blur(10px)"}}>
        <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:"8px",marginBottom:"8px"}}>
          <div>
            <h3 style={{fontSize:"18px",fontWeight:800,marginBottom:"4px"}}>{exp.role}</h3>
            <span style={{fontSize:"13px",color:exp.color}}>{exp.company}</span>
          </div>
          <span style={{fontSize:"11px",color:"rgba(255,255,255,0.35)",letterSpacing:"0.1em",border:"1px solid rgba(255,255,255,0.1)",padding:"4px 10px",borderRadius:"3px",alignSelf:"flex-start"}}>{exp.period}</span>
        </div>
        <p style={{fontSize:"13px",color:"rgba(255,255,255,0.5)",lineHeight:1.7,marginTop:"12px"}}>{exp.desc}</p>
      </div>
    </motion.div>
  );
}

function Experience() {
  return (
    <section id="experience" style={{padding:"120px 40px",background:"rgba(0,245,212,0.01)"}}>
      <div style={{maxWidth:"800px",margin:"0 auto"}}>
        <SectionLabel>Career Path</SectionLabel>
        <SectionTitle>Where I've<br/><span style={{WebkitTextStroke:"1px rgba(255,255,255,0.3)",WebkitTextFillColor:"transparent"}}>been.</span></SectionTitle>
        <div style={{position:"relative"}}>
          <div style={{position:"absolute",left:"20px",top:0,bottom:0,width:"1px",background:"linear-gradient(to bottom,#00f5d4,#7209b7,transparent)"}}/>
          {EXPERIENCE.map((e,i)=><ExpItem key={i} exp={e} index={i}/>)}
        </div>
      </div>
    </section>
  );
}

// ─── EDUCATION & CERTIFICATIONS ──────────────────────────────────────────────
function Education() {
  const ref = useRef(null), inView = useInView(ref, {once:true, margin:"-80px"});
  return (
    <section id="education" style={{padding:"120px 40px", background:"rgba(114,9,183,0.02)"}}>
      <div ref={ref} style={{maxWidth:"1200px", margin:"0 auto"}}>
        <SectionLabel>Education & Certifications</SectionLabel>
        <SectionTitle>
          Knowledge &<br/>
          <span style={{WebkitTextStroke:"1px rgba(255,255,255,0.3)", WebkitTextFillColor:"transparent"}}>credentials.</span>
        </SectionTitle>

        {/* Education Card */}
        <div style={{marginBottom:"64px"}}>
          <p style={{fontSize:"11px",letterSpacing:"0.3em",color:"rgba(255,255,255,0.3)",textTransform:"uppercase",marginBottom:"24px"}}>— Education</p>
          {EDUCATION.map((e, i) => (
            <motion.div key={i}
              initial={{opacity:0, y:30}}
              animate={inView ? {opacity:1, y:0} : {}}
              transition={{delay:0.1, duration:0.7, ease:[0.16,1,0.3,1]}}
              whileHover={{y:-4, boxShadow:`0 20px 40px ${e.color}22`}}
              style={{
                padding:"36px 40px", borderRadius:"16px",
                border:`1px solid ${e.color}33`,
                background:`linear-gradient(135deg, ${e.color}08, transparent)`,
                backdropFilter:"blur(10px)",
                display:"flex", alignItems:"center", gap:"32px",
                flexWrap:"wrap", transition:"box-shadow 0.3s",
              }}
            >
              <div style={{fontSize:"48px"}}>{e.icon}</div>
              <div style={{flex:1}}>
                <h3 style={{fontSize:"20px", fontWeight:800, color:"#fff", marginBottom:"6px", letterSpacing:"-0.02em"}}>{e.degree}</h3>
                <p style={{fontSize:"14px", color:e.color, marginBottom:"8px"}}>{e.institution}</p>
                <div style={{display:"flex", gap:"16px", flexWrap:"wrap"}}>
                  <span style={{fontSize:"12px", color:"rgba(255,255,255,0.35)", border:"1px solid rgba(255,255,255,0.1)", padding:"4px 12px", borderRadius:"3px"}}>{e.period}</span>
                  <span style={{fontSize:"12px", color:e.color, background:e.color+"15", border:`1px solid ${e.color}33`, padding:"4px 12px", borderRadius:"3px", fontWeight:700}}>{e.grade}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Certifications */}
        <p style={{fontSize:"11px",letterSpacing:"0.3em",color:"rgba(255,255,255,0.3)",textTransform:"uppercase",marginBottom:"24px"}}>— Certifications & Awards</p>
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(min(100%, 340px), 1fr))", gap:"20px"}}>
          {CERTIFICATIONS.map((c, i) => (
            <motion.div key={i}
              initial={{opacity:0, y:40}}
              animate={inView ? {opacity:1, y:0} : {}}
              transition={{delay:i*0.12 + 0.2, duration:0.7, ease:[0.16,1,0.3,1]}}
              whileHover={{y:-6, boxShadow:`0 20px 40px ${c.color}22`}}
              style={{
                padding:"28px 32px", borderRadius:"14px",
                border:`1px solid ${c.color}22`,
                background:`linear-gradient(135deg, ${c.color}08, transparent)`,
                backdropFilter:"blur(10px)", transition:"box-shadow 0.3s",
              }}
            >
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"16px"}}>
                <span style={{fontSize:"28px"}}>{c.icon}</span>
                <span style={{fontSize:"11px", color:c.color, border:`1px solid ${c.color}33`, padding:"3px 10px", borderRadius:"3px", letterSpacing:"0.1em"}}>{c.year}</span>
              </div>
              <h3 style={{fontSize:"17px", fontWeight:800, color:"#fff", marginBottom:"4px"}}>{c.title}</h3>
              <p style={{fontSize:"13px", color:c.color, marginBottom:"12px"}}>{c.issuer}</p>
              <p style={{fontSize:"13px", color:"rgba(255,255,255,0.45)", lineHeight:1.7}}>{c.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Resume Download CTA */}
        <motion.div
          initial={{opacity:0, y:30}}
          animate={inView ? {opacity:1, y:0} : {}}
          transition={{delay:0.6, duration:0.7}}
          style={{
            marginTop:"64px", padding:"40px",
            borderRadius:"16px",
            border:"1px solid rgba(0,245,212,0.2)",
            background:"linear-gradient(135deg, rgba(0,245,212,0.05), transparent)",
            display:"flex", alignItems:"center", justifyContent:"space-between",
            flexWrap:"wrap", gap:"24px",
          }}
        >
          <div>
            <h3 style={{fontSize:"22px", fontWeight:800, marginBottom:"8px"}}>Want the full picture?</h3>
            <p style={{fontSize:"14px", color:"rgba(255,255,255,0.45)", lineHeight:1.7}}>Download my resume to see my complete experience, skills, and achievements.</p>
          </div>
          <motion.a
  href="https://drive.google.com/uc?export=download&id=1KPVDOXQJcuniakmd1mhdCI7rTVZFIpfa"
  target="_blank"
  rel="noreferrer"
  whileHover={{scale:1.05, boxShadow:"0 0 30px rgba(0,245,212,0.4)"}}
  whileTap={{scale:0.97}}
  style={{
    padding:"16px 36px", borderRadius:"4px",
    background:"linear-gradient(135deg,#00f5d4,#4cc9f0)",
    color:"#020409", fontWeight:900, fontSize:"13px",
    letterSpacing:"0.15em", textTransform:"uppercase",
    textDecoration:"none", whiteSpace:"nowrap",
    display:"flex", alignItems:"center", gap:"8px",
  }}
>
  ⬇ Download Resume
</motion.a>
        </motion.div>
      </div>
    </section>
  );
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────
function Contact() {
  const ref=useRef(null), inView=useInView(ref,{once:true,margin:"-80px"});
  const [form,setForm]=useState({name:"",email:"",message:""}), [sent,setSent]=useState(false), [focused,setFocused]=useState(null);
  const iStyle=(f)=>({width:"100%",padding:"16px 20px",background:focused===f?"rgba(0,245,212,0.05)":"rgba(255,255,255,0.03)",border:`1px solid ${focused===f?"rgba(0,245,212,0.4)":"rgba(255,255,255,0.08)"}`,borderRadius:"8px",color:"#fff",fontSize:"14px",outline:"none",transition:"all 0.2s",boxSizing:"border-box",resize:f==="message"?"vertical":"none"});
  const socials=[
    {name:"GitHub",  icon:"⌥", url:"https://github.com/achyut03/"},
    {name:"LinkedIn",icon:"in", url:"https://www.linkedin.com/in/achyut03/"},
    {name:"Instagram",icon:"I",url:"#"},
    {name:"Dribbble", icon:"⬡", url:"#"},
  ];
  return (
    <section id="contact" style={{padding:"120px 40px"}}>
      <div ref={ref} style={{maxWidth:"1000px",margin:"0 auto"}}>
        <SectionLabel>Get In Touch</SectionLabel>
        <SectionTitle>Let's build<br/><span style={{WebkitTextStroke:"1px rgba(255,255,255,0.3)",WebkitTextFillColor:"transparent"}}>something great.</span></SectionTitle>
        <div className="two-col" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"80px",alignItems:"start"}}>
          <motion.div initial={{opacity:0,x:-30}} animate={inView?{opacity:1,x:0}:{}} transition={{duration:0.7}}>
            <p style={{color:"rgba(255,255,255,0.5)",fontSize:"14px",lineHeight:1.8,marginBottom:"48px"}}>I'm currently available for full-time roles and select freelance engagements. Whether you have a project in mind or just want to talk code — my inbox is always open.</p>
            <div style={{marginBottom:"48px",display:"flex",flexDirection:"column",gap:"16px"}}>
              <a href="mailto:achyutk105@gmail.com" style={{display:"flex",alignItems:"center",gap:"12px",textDecoration:"none"}}>
                <span>✉</span><span style={{fontSize:"14px",color:"#00f5d4"}}>achyutk105@gmail.com</span>
              </a>
              <a href="tel:+919620533824" style={{display:"flex",alignItems:"center",gap:"12px",textDecoration:"none"}}>
                <span>☎</span><span style={{fontSize:"14px",color:"rgba(255,255,255,0.4)"}}>+91 9620533824</span>
              </a>
            </div>
            <div style={{display:"flex",gap:"12px"}}>
              {socials.map(s=>(
                <motion.a key={s.name} href={s.url} title={s.name} whileHover={{y:-4}}
                  style={{width:44,height:44,borderRadius:"8px",border:"1px solid rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center",color:"rgba(255,255,255,0.5)",fontSize:"13px",fontWeight:700,textDecoration:"none"}}>{s.icon}</motion.a>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{opacity:0,x:30}} animate={inView?{opacity:1,x:0}:{}} transition={{duration:0.7,delay:0.1}}>
            <AnimatePresence mode="wait">
              {!sent?(
                <motion.div key="form" exit={{opacity:0,y:-20}} style={{display:"flex",flexDirection:"column",gap:"16px"}}>
                  <input placeholder="Your Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} onFocus={()=>setFocused("name")} onBlur={()=>setFocused(null)} style={iStyle("name")}/>
                  <input placeholder="Email Address" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} onFocus={()=>setFocused("email")} onBlur={()=>setFocused(null)} style={iStyle("email")}/>
                  <textarea placeholder="Tell me about your project..." value={form.message} rows={5} onChange={e=>setForm({...form,message:e.target.value})} onFocus={()=>setFocused("message")} onBlur={()=>setFocused(null)} style={iStyle("message")}/>
                  <MagneticBtn primary onClick={async () => {
                    if(form.name && form.email && form.message) {
                      await fetch("https://formspree.io/f/xgonnvzl", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ name: form.name, email: form.email, message: form.message }),
                      });
                      setSent(true);
                    }
                  }}>Send Message →</MagneticBtn>
                </motion.div>
              ):(
                <motion.div key="success" initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}}
                  style={{padding:"60px 40px",border:"1px solid rgba(0,245,212,0.2)",borderRadius:"12px",textAlign:"center",background:"rgba(0,245,212,0.04)"}}>
                  <div style={{fontSize:"48px",marginBottom:"20px"}}>✓</div>
                  <div style={{color:"#00f5d4",fontSize:"18px",fontWeight:700,marginBottom:"12px"}}>Message Sent!</div>
                  <div style={{color:"rgba(255,255,255,0.4)",fontSize:"13px"}}>I'll get back to you within 24 hours.</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{borderTop:"1px solid rgba(255,255,255,0.05)",padding:"40px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"16px"}}>
      <span style={{fontSize:"12px",color:"rgba(255,255,255,0.2)",letterSpacing:"0.1em"}}>© 2025 Achyut Kulkarni. Built with React + Framer Motion.</span>
      <span style={{fontSize:"12px",color:"rgba(255,255,255,0.2)",letterSpacing:"0.1em"}}>Designed to impress. Engineered to perform.</span>
    </footer>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
function App() {
  const [loaded,setLoaded]=useState(false);
  return (
    <>
      <GlobalStyles/>
      <LoadingScreen onDone={()=>setLoaded(true)}/>
      {loaded&&(
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.8}}>
          <GradientBg/>
          <ParticleField/>
          <CustomCursor/>
          <Nav/>
          <main>
            <Hero/>
            <About/>
            <Projects/>
            <Skills/>
            <Experience/>
            <Education/>
            <Contact/>
          </main>
          <Footer/>
        </motion.div>
      )}
    </>
  );
}

// ─── MOUNT ───────────────────────────────────────────────────────────────────
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode><App/></React.StrictMode>
);