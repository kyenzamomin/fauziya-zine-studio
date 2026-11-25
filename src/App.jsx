import React, { useEffect, useMemo, useRef, useState } from "react";
import "./styles/zineTheme.css";
import {
  STUDIO_PROFILE,
  LIVE_DEMOS,
  PRICING_TIERS,
  STUDIO_RULES,
} from "./config/studioConfig";

function SmartImage({ candidates = [], alt, className, fallbackLabel }) {
  const [attempt, setAttempt] = useState(0);

  if (attempt >= candidates.length) {
    return (
      <div className="demo-placeholder-box">
        <span className="demo-placeholder-title">{fallbackLabel || alt}</span>
        <small>Screenshot not added yet — click link below to view live</small>
      </div>
    );
  }

  return (
    <img
      src={candidates[attempt]}
      alt={alt}
      className={className}
      loading="eager"
      decoding="async"
      onError={() => setAttempt((prev) => prev + 1)}
    />
  );
}

function ZineGifSticker({ src, alt }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <span className="brand-stamp">✦</span>;
  }

  return (
    <img
      src={src}
      alt={alt}
      className="gif-sticker"
      loading="eager"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

function ReelPlayer({ src, poster, label }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    el.muted = true;
    el.defaultMuted = true;
    el.playsInline = true;
    el.playbackRate = 1;

    const tryPlay = () => {
      const p = el.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => { });
      }
    };

    tryPlay();
    el.addEventListener("canplay", tryPlay);
    return () => {
      el.removeEventListener("canplay", tryPlay);
    };
  }, [src]);

  return (
    <div className="reel-box">
      <video
        ref={videoRef}
        className="reel-video"
        src={src}
        poster={poster}
        aria-label={label}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
      />
    </div>
  );
}

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCurrency, setSelectedCurrency] = useState("ALL");

  const categories = ["All", "Portfolio", "Editorial", "Studio"];

  const filteredDemos = useMemo(() => {
    if (selectedCategory === "All") return LIVE_DEMOS;
    return LIVE_DEMOS.filter((demo) => demo.category === selectedCategory);
  }, [selectedCategory]);

  const visibleTiers = useMemo(() => {
    if (selectedCurrency === "ALL") return PRICING_TIERS;
    return PRICING_TIERS.filter((tier) => tier.region === selectedCurrency);
  }, [selectedCurrency]);

  const gmailComposeUrl = useMemo(() => {
    const to = encodeURIComponent(STUDIO_PROFILE.email);
    const su = encodeURIComponent(
      STUDIO_PROFILE.emailSubject || "Zine Website Inquiry"
    );
    const body = encodeURIComponent(
      STUDIO_PROFILE.emailBody ||
      "Hi Fauziya,\nI want to connect about a custom zine website.\nSharing a few quick details below:\n"
    );
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${su}&body=${body}`;
  }, []);

  return (
    <div className="zine-page">
      <header className="zine-topbar">
        <a href="#top" className="brand-mark">
          <span>{STUDIO_PROFILE.name}</span>
          <span className="brand-stamp">ISSUE 01</span>
        </a>

        <nav className="zine-nav" aria-label="Primary navigation">
          <a href="#about">About</a>
          <a href="#demos">Demos</a>
          <a href="#pricing">Pricing</a>
          <a href="#rules">Notes</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero-spread">
          <span className="tape-strip" aria-hidden="true" />
          <div>
            <span className="hero-kicker">{STUDIO_PROFILE.badgeText}</span>
            <h1>{STUDIO_PROFILE.name}</h1>
            <p className="hero-tagline">{STUDIO_PROFILE.tagline}</p>
            <p className="hero-copy">{STUDIO_PROFILE.heroPitch}</p>
            <div className="hero-actions">
              <a href="#demos" className="zine-btn">
                Explore Live Sites
              </a>
              <a href="#pricing" className="zine-btn-ghost">
                See Tiers
              </a>
            </div>
          </div>

          <ReelPlayer
            src={STUDIO_PROFILE.videos.heroVideo}
            poster={STUDIO_PROFILE.videos.heroPoster}
            label="Hero spiral reel"
          />
        </section>

        <section id="about" className="zine-block">
          <div className="block-head">
            <div className="block-title-wrap">
              <h2>{STUDIO_PROFILE.aboutTitle}</h2>
            </div>
          </div>

          <div className="credentials-spread">
            <ReelPlayer
              src={STUDIO_PROFILE.videos.studioVideo}
              label="Studio graffiti reel"
            />
            <div>
              <span className="degree-tag">{STUDIO_PROFILE.handle}</span>
              <p>{STUDIO_PROFILE.aboutCopy}</p>
              <p>{STUDIO_PROFILE.aboutExtra}</p>
            </div>
          </div>
        </section>

        <section id="demos" className="zine-block">
          <div className="block-head">
            <div className="block-title-wrap">
              <h2>Live Demo Sites</h2>
            </div>

            <div className="filter-row" role="group" aria-label="Filter demos">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`filter-chip ${selectedCategory === cat ? "is-active" : ""
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="demo-shelf">
            {filteredDemos.map((demo) => (
              <article key={demo.id} className="demo-sheet">
                <div className="demo-preview-box">
                  <SmartImage
                    candidates={demo.candidates}
                    alt={`${demo.title} preview`}
                    className="demo-preview-img"
                    fallbackLabel={demo.title}
                  />
                </div>
                <div className="demo-sheet-body">
                  <span className="vibe-badge">{demo.vibe}</span>
                  <h3>{demo.title}</h3>
                  <a
                    href={demo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="demo-visit-link"
                  >
                    Open Live Link →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="pricing" className="zine-block">
          <div className="block-head">
            <div className="block-title-wrap">
              <ZineGifSticker
                src={STUDIO_PROFILE.stickers.priceTagGif}
                alt="Animated price tag"
              />
              <h2>Pricing (INR & USD)</h2>
            </div>

            <div className="filter-row" role="group" aria-label="Currency filter">
              {["ALL", "INR", "USD"].map((curr) => (
                <button
                  key={curr}
                  type="button"
                  onClick={() => setSelectedCurrency(curr)}
                  className={`filter-chip ${selectedCurrency === curr ? "is-active" : ""
                    }`}
                >
                  {curr === "ALL" ? "All Tiers" : curr}
                </button>
              ))}
            </div>
          </div>

          <div className="pricing-rack">
            {visibleTiers.map((tier) => (
              <article key={tier.id} className="tier-card">
                <strong>{tier.name}</strong>
                <div className="tier-price">{tier.price}</div>
                <p className="tier-note">{tier.ruleNote}</p>
                <ul className="tier-perks">
                  {tier.perks.map((perk) => (
                    <li key={perk}>{perk}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="rules" className="zine-block">
          <div className="block-head">
            <div className="block-title-wrap">
              <ZineGifSticker
                src={STUDIO_PROFILE.stickers.zineNoteGif}
                alt="Animated note"
              />
              <h2>Good to Know</h2>
            </div>
          </div>

          <div className="rules-rack">
            {STUDIO_RULES.map((rule) => (
              <article key={rule.code} className="rule-sheet">
                <span className="rule-code">{rule.code}</span>
                <h3>{rule.title}</h3>
                <p>{rule.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="zine-block">
          <div className="block-head">
            <div className="block-title-wrap">
              <ZineGifSticker
                src={STUDIO_PROFILE.stickers.mailStampGif}
                alt="Animated mail stamp"
              />
              <h2>Say Hello</h2>
            </div>
          </div>

          <div className="dispatch-box">
            <p>
              Tell me a little about what you’re building and which chapter you’re in—we’ll find the right fit and bring it to life.
            </p>
            <div className="dispatch-actions">
              <a
                href={gmailComposeUrl}
                target="_blank"
                rel="noreferrer"
                className="zine-btn"
              >
                Email
              </a>
              {STUDIO_PROFILE.whatsappDigits &&
                !STUDIO_PROFILE.whatsappDigits.includes("X") && (
                  <a
                    href={`https://wa.me/${STUDIO_PROFILE.whatsappDigits}`}
                    target="_blank"
                    rel="noreferrer"
                    className="zine-btn-ghost"
                  >
                    WhatsApp
                  </a>
                )}
              <a
                href={STUDIO_PROFILE.linkedin}
                target="_blank"
                rel="noreferrer"
                className="zine-btn-ghost"
              >
                LinkedIn
              </a>
              <a
                href={STUDIO_PROFILE.github}
                target="_blank"
                rel="noreferrer"
                className="zine-btn-ghost"
              >
                GitHub
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}