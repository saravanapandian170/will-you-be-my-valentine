import { useState, useRef } from "react";
import "./App.css";

export default function App() {
  const [accepted, setAccepted] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [burst, setBurst] = useState(false);

  const cardRef = useRef(null);
  const noRef = useRef(null);

  /* =======================
     NO BUTTON MOVEMENT LOGIC
     ======================= */
  const moveNoButton = (clientX, clientY) => {
    const card = cardRef.current;
    const noBtn = noRef.current;
    if (!card || !noBtn) return;

    const cardRect = card.getBoundingClientRect();
    const noRect = noBtn.getBoundingClientRect();

    // Pointer position relative to card
    const pointerX = clientX - cardRect.left;
    const pointerY = clientY - cardRect.top;

    const noCenterX = noBtn.offsetLeft + noRect.width / 2;
    const noCenterY = noBtn.offsetTop + noRect.height / 2;

    let dx = noCenterX - pointerX;
    let dy = noCenterY - pointerY;

    const distance = Math.hypot(dx, dy) || 1;

    dx /= distance;
    dy /= distance;

    // Cursor-based speed
    const TRIGGER_DISTANCE = 220;
    const intensity = Math.max(0, 1 - distance / TRIGGER_DISTANCE);
    const cursorSpeed = 60 + Math.pow(intensity, 3) * 240;

    let newX = noBtn.offsetLeft + dx * cursorSpeed;
    let newY = noBtn.offsetTop + dy * cursorSpeed;

    // Card bounds
    const padding = 16;
    const maxX = card.clientWidth - noRect.width - padding;
    const maxY = card.clientHeight - noRect.height - padding;

    /* Edge force – always active */
    const EDGE_ZONE = 70;
    const EDGE_STRENGTH = 120;

    if (newX < EDGE_ZONE)
      newX += ((EDGE_ZONE - newX) / EDGE_ZONE) * EDGE_STRENGTH;
    if (newX > maxX - EDGE_ZONE)
      newX -= ((newX - (maxX - EDGE_ZONE)) / EDGE_ZONE) * EDGE_STRENGTH;
    if (newY < EDGE_ZONE)
      newY += ((EDGE_ZONE - newY) / EDGE_ZONE) * EDGE_STRENGTH;
    if (newY > maxY - EDGE_ZONE)
      newY -= ((newY - (maxY - EDGE_ZONE)) / EDGE_ZONE) * EDGE_STRENGTH;

    // Final clamp
    newX = Math.max(padding, Math.min(newX, maxX));
    newY = Math.max(padding, Math.min(newY, maxY));

    noBtn.style.position = "absolute";
    noBtn.style.left = `${newX}px`;
    noBtn.style.top = `${newY}px`;
  };

  /* Desktop */
  const handleMouseMove = (e) => {
    moveNoButton(e.clientX, e.clientY);
  };

  /* Mobile */
  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    if (touch) moveNoButton(touch.clientX, touch.clientY);
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    if (touch) moveNoButton(touch.clientX, touch.clientY);
  };

  /* YES CLICK */
  const handleYes = () => {
    setBurst(true);

    setTimeout(() => {
      setAccepted(true);
      setShowMessage(true);
    }, 600);

    const pieces = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random(),
    }));

    setConfetti(pieces);
    setTimeout(() => setConfetti([]), 2000);
  };

  return (
    <div className="page">
      {/* ❤️ Floating hearts background */}
      <div className="hearts-bg">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className="heart"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              fontSize: `${14 + Math.random() * 20}px`,
            }}
          >
            ❤️
          </span>
        ))}
      </div>

      {/* 🟥 Main card */}
      <div
        className="card"
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
      >
        {/* 🎈 Balloon burst */}
        {burst && (
          <div className={`balloon ${burst ? "burst" : ""}`}>
            🎈
          </div>
        )}

        {/* Main content */}
        {!accepted ? (
          <>
            <h1>Will you be my Valentine?</h1>

            <div className="buttons">
              <button className="yes" onClick={handleYes}>
                Yes
              </button>

              <button className="no" ref={noRef}>
                No
              </button>
            </div>
          </>
        ) : (
          showMessage && (
            <h2>I knew you wouldn’t say No ❤️</h2>
          )
        )}

        {/* Confetti */}
        {confetti.map((c) => (
          <span
            key={c.id}
            className="confetti"
            style={{
              left: `${c.left}%`,
              animationDelay: `${c.delay}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
