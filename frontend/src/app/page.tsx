import Link from "next/link";
import Countdown from "../components/Countdown";
import FloatingUpload from "../components/FloatingUpload";
import GalleryPreview from "../components/GalleryPreview";
import HeroCarousel from "../components/HeroCarousel";
import HeroPetals from "../components/HeroPetals";
import QrCard from "../components/QrCard";
import Reveal from "../components/Reveal";
import WeddingAnimation from "../components/WeddingAnimation";
import { wedding } from "../config";
import type { ReactNode } from "react";

// The three "how it works" steps
const steps = [
  { n: "01", title: "Open the page", text: "Scan the QR code at the venue, or use the link you were given." },
  { n: "02", title: "Add your photos", text: "Choose the photos and videos you took and tap upload." },
  { n: "03", title: "Enjoy the gallery", text: "Watch every guest's memories appear in one place." },
];

// Google Calendar link built from the details in config.js
const calendarLink =
  "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  `&text=${encodeURIComponent(`${wedding.partnerOne} & ${wedding.partnerTwo}'s Wedding`)}` + // Event title
  `&dates=${wedding.calendarStart}/${wedding.calendarEnd}` + // Start and end in UTC
  `&location=${encodeURIComponent(wedding.venues[0].address)}` + // First venue address
  `&details=${encodeURIComponent(wedding.hashtag)}`; // Hashtag in the description

// Small gold heading used above each section title
function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-center text-xs uppercase tracking-[0.3em] text-gold">{children}</p>;
}

// Section title with a thin gold divider underneath
function Title({ children }: { children: ReactNode }) {
  return (
    <>
      <h2 className="mt-2 text-center font-display text-4xl sm:text-5xl">{children}</h2>
      <div className="mx-auto my-5 h-px w-16 bg-gold" />
    </>
  );
}

export default function HomePage() {
  return (
    <main>
      {/* Floating upload button: appears after the hero, phones only */}
      <FloatingUpload />

      {/* Hero: full photo carousel on top, names and countdown below */}
      <section className="bg-ink text-cream">
        {/* Photo area: the carousel and the drifting petals fill this box */}
        <div className="relative h-[65vh] min-h-[340px] w-full overflow-hidden sm:h-[80vh]">
          <HeroCarousel />
          <HeroPetals /> {/* Delete this line to remove the falling petals */}
        </div>

        {/* Text area on deep olive: each piece eases in after the one before it */}
        <div className="flex w-full flex-col items-center px-6 py-16 text-center">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.35em] text-[#e6cf9f]">Join us in celebrating</p>
          </Reveal>

          {/* Names: stacked on phones so they always fit, one line on larger screens */}
          <Reveal from="blur" delay={150}>
            <h1 className="mt-6 font-display leading-[0.95]">
              <span className="block text-[length:clamp(2.75rem,15vw,4.5rem)] md:inline md:text-7xl lg:text-8xl">
                {wedding.partnerOne}
              </span>
              <span className="block py-1 text-4xl font-light italic text-[#e6cf9f] md:mx-3 md:inline md:py-0 md:text-7xl lg:text-8xl">
                &
              </span>
              <span className="block text-[length:clamp(2.75rem,15vw,4.5rem)] md:inline md:text-7xl lg:text-8xl">
                {wedding.partnerTwo}
              </span>
            </h1>
          </Reveal>

          <Reveal delay={300}>
            <div className="my-8 h-px w-24 bg-[#e6cf9f]" /> {/* Thin gold divider */}
          </Reveal>

          <Reveal delay={400} className="flex flex-col items-center">
            <p className="text-sm uppercase tracking-[0.3em]">{wedding.dateText}</p>
            <p className="mt-2 max-w-sm text-balance text-cream/75">{wedding.venue}</p>
            <p className="mt-4 font-display text-3xl italic text-[#e6cf9f]">{wedding.hashtag}</p> {/* Wedding theme */}
          </Reveal>

          <Reveal delay={550} className="mt-8">
            <Countdown target={wedding.dateISO} /> {/* Live countdown */}
          </Reveal>

          <Reveal delay={700}>
            <p className="mt-8 max-w-md text-balance text-cream/85">{wedding.welcome}</p>
          </Reveal>

          <Reveal delay={850} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/upload"
              className="rounded-full bg-cream px-8 py-3 text-sm uppercase tracking-widest text-ink transition hover:bg-gold hover:text-cream"
            >
              Share your photos
            </Link>
            <Link
              href="/gallery"
              className="rounded-full border border-cream px-8 py-3 text-sm uppercase tracking-widest transition hover:border-gold hover:text-[#e6cf9f]"
            >
              View gallery
            </Link>
          </Reveal>

          <Reveal delay={1000}>
            <a
              href={calendarLink}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-block text-xs uppercase tracking-widest text-[#e6cf9f] underline"
            >
              Add to calendar
            </a>
          </Reveal>
        </div>
      </section>

      {/* Our story, with the bride and groom animation on top */}
      <section className="bg-blush/40 px-6 py-16">
        <Reveal className="mx-auto max-w-2xl text-center">
          <div className="mb-8"><WeddingAnimation /></div> {/* Bride and groom animation */}
          <Eyebrow>How it began</Eyebrow>
          <Title>Our story</Title>
          {wedding.story.map((paragraph, i) => (
            <p key={i} className="mt-4 text-lg leading-relaxed text-ink/75">
              {paragraph}
            </p>
          ))}
        </Reveal>
      </section>

      {/* Meet the couple */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <Reveal>
          <Eyebrow>The happy couple</Eyebrow>
          <Title>Meet the couple</Title>
        </Reveal>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {wedding.couple.map((c, i) => (
            <Reveal
              key={c.role}
              delay={i * 150} // Second card appears after the first
              className="rounded-2xl border border-gold/20 bg-white p-6 text-center shadow-sm"
            >
              {c.photo ? (
                <img src={c.photo} alt={c.name} className="mx-auto h-32 w-32 rounded-full object-cover" /> // Photo from the public folder
              ) : (
                <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-blush font-display text-5xl text-gold">
                  {c.name[0]} {/* First letter when there is no photo */}
                </div>
              )}
              <p className="mt-4 text-xs uppercase tracking-widest text-gold">{c.role}</p>
              <h3 className="mt-1 font-display text-3xl">{c.name}</h3>
              <p className="mt-2 text-sm text-ink/70">{c.bio}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Order of the day */}
      <section className="bg-blush/40 px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <Reveal>
            <Eyebrow>The schedule</Eyebrow>
            <Title>Order of the day</Title>
          </Reveal>
          <ol className="relative mt-10 border-l border-gold/40 pl-8">
            {wedding.schedule.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 100} className="relative pb-10 last:pb-0">
                <span className="absolute -left-[41px] top-1 h-4 w-4 rounded-full border-2 border-gold bg-cream" /> {/* Dot on the line */}
                <p className="text-xs uppercase tracking-widest text-gold">{s.time}</p>
                <h3 className="mt-1 font-display text-2xl">{s.title}</h3>
                <p className="mt-1 text-ink/70">{s.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Venues and dress code */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <Reveal>
          <Eyebrow>Where and what to wear</Eyebrow>
          <Title>The details</Title>
        </Reveal>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {/* One card per venue */}
          {wedding.venues.map((v, i) => (
            <Reveal
              key={v.label}
              delay={i * 150}
              className="rounded-2xl border border-gold/20 bg-white p-6 text-center shadow-sm"
            >
              <p className="text-xs uppercase tracking-widest text-gold">{v.label}</p>
              <h3 className="mt-2 font-display text-2xl">{v.name}</h3>
              <p className="mt-1 text-sm text-ink/70">{v.time}</p>
              <p className="mt-3 text-sm text-ink/70">{v.address}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v.address)}`} // Opens Google Maps
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block text-sm uppercase tracking-widest text-gold underline"
              >
                Get directions
              </a>
            </Reveal>
          ))}

          {/* Dress code card */}
          <Reveal
            delay={wedding.venues.length * 150} // Appears after the venue cards
            className="rounded-2xl border border-gold/20 bg-white p-6 text-center shadow-sm"
          >
            <p className="text-xs uppercase tracking-widest text-gold">Dress code</p>
            <h3 className="mt-2 font-display text-2xl">{wedding.dressCode.title}</h3>
            <p className="mt-3 text-sm text-ink/70">{wedding.dressCode.text}</p>
            <div className="mt-4 flex justify-center gap-2">
              {wedding.dressCode.colors.map((c) => (
                <span key={c} className="h-7 w-7 rounded-full border border-ink/10" style={{ background: c }} /> // Colour circle
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Wedding party */}
      <section className="bg-blush/40 px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <Eyebrow>Standing beside us</Eyebrow>
            <Title>The wedding party</Title>
          </Reveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {wedding.party.map((group, i) => (
              <Reveal
                key={group.role}
                delay={i * 150}
                className="rounded-2xl border border-gold/20 bg-white p-6 text-center shadow-sm"
              >
                <h3 className="font-display text-2xl text-gold">{group.role}</h3>
                <ul className="mt-3 space-y-1 text-ink/75">
                  {group.people.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Good to know (FAQ) */}
      <section className="mx-auto max-w-2xl px-6 py-16">
        <Reveal>
          <Eyebrow>Questions</Eyebrow>
          <Title>Good to know</Title>
        </Reveal>
        <div className="mt-8 space-y-3">
          {wedding.faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 80}>
              {/* <details> opens and closes on tap with no extra code */}
              <details className="group rounded-xl border border-gold/20 bg-white p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between font-medium [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="ml-4 text-2xl text-gold transition group-open:rotate-45">+</span> {/* Turns into an x when open */}
                </summary>
                <p className="mt-3 text-ink/70">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Gifts (hidden when gifts is null in config.js)
      {wedding.gifts && (
        <section className="bg-blush/40 px-6 py-16">
          <Reveal className="mx-auto max-w-md text-center">
            <Eyebrow>With gratitude</Eyebrow>
            <Title>Gifts</Title>
            <p className="text-ink/75">{wedding.gifts.text}</p>
            <div className="mt-6 rounded-2xl border border-gold/20 bg-white p-6 shadow-sm">
              {wedding.gifts.details.map((d) => (
                <p key={d.label} className="py-1 text-sm">
                  <span className="text-ink/60">{d.label}: </span>
                  <span className="font-medium">{d.value}</span>
                </p>
              ))}
            </div>
          </Reveal>
        </section>
      )} */}

      {/* Share the day: how it works + QR code */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <Reveal>
          <Eyebrow>Share the day</Eyebrow>
          <Title>How it works</Title>
        </Reveal>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal
              key={s.n}
              delay={i * 150}
              className="rounded-2xl border border-gold/20 bg-white p-6 text-center shadow-sm"
            >
              <span className="font-display text-3xl text-gold">{s.n}</span>
              <h3 className="mt-2 text-lg font-medium">{s.title}</h3>
              <p className="mt-2 text-sm text-ink/70">{s.text}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200}>
          <QrCard /> {/* Scannable code that opens the upload page */}
          <div className="mt-8 text-center">
            <Link
              href="/upload"
              className="inline-block rounded-full bg-ink px-8 py-3 text-sm uppercase tracking-widest text-cream transition hover:bg-gold"
            >
              Upload now
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Latest guest photos (live from Laravel) */}
      <div className="bg-blush/40">
        <GalleryPreview />
      </div>

      {/* Footer */}
      <footer className="bg-ink px-6 py-12 text-center text-cream">
        <p className="font-display text-3xl">
          {wedding.partnerOne} <span className="text-gold">&</span> {wedding.partnerTwo}
        </p>
        <p className="mt-2 text-sm uppercase tracking-[0.3em] text-gold">{wedding.hashtag}</p>
        <p className="mt-6 text-sm text-cream/70">
          Questions on the day? Contact {wedding.contact.name}:{" "}
          <a href={`tel:${wedding.contact.phone}`} className="underline">
            {wedding.contact.phone}
          </a>
        </p>
        <p className="mt-6 text-xs text-cream/50">With love and gratitude</p>
      </footer>
    </main>
  );
}