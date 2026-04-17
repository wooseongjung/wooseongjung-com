import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Cpu, Calendar, BookOpen } from 'lucide-react';

/* ═══════════════════════════════════════
   Circuit Design Journal
   A living log of circuit-design notes.
   New posts: append to POSTS below.
   ═══════════════════════════════════════ */

const POSTS = [
  {
    id: 'kickoff',
    date: '2026-04-17',
    title: 'Starting a circuit-design journal',
    tags: ['Meta', 'Notes'],
    body: (
      <>
        <p>
          I keep re-deriving the same small-signal results every time I pick up a new
          analogue problem — biasing a common-emitter stage, sizing a feedback network,
          re-convincing myself why the Miller effect bites harder than expected. This
          page is where I'll record those derivations properly so that next time I need
          them, I read rather than re-derive.
        </p>
        <p>
          Entries will stay short and specific. Each post should answer one question
          clearly: a derivation, a design rule, or a lab observation that surprised me.
          Formatting is deliberately plain — the value is in the notes, not the
          presentation.
        </p>
        <p className="text-midnight-500 dark:text-midnight-400 italic">
          First full entry in progress. Topics lined up: op-amp compensation, current-mirror
          matching, and a revisit of Bode plots from first principles.
        </p>
      </>
    ),
  },
];

export default function CircuitDesignJournal() {
  return (
    <main className="max-w-4xl mx-auto px-6 md:px-12 py-20 md:py-28">
      {/* Back link */}
      <Link
        to="/life"
        className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] font-semibold text-midnight-500 dark:text-midnight-400 hover:text-gold dark:hover:text-gold transition-colors mb-10"
      >
        <ArrowLeft size={14} /> Back to Life
      </Link>

      {/* Header */}
      <header className="mb-14 pb-10 border-b border-midnight-200 dark:border-midnight-800">
        <div className="flex items-center gap-3 mb-5 font-mono text-[11px] uppercase tracking-[0.18em] text-gold font-semibold">
          <Cpu size={14} />
          Learning Journal · Circuit Design
        </div>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-midnight-900 dark:text-white mb-5 leading-[1.05]">
          Circuit Design Journal
        </h1>
        <p className="text-base md:text-lg text-midnight-600 dark:text-midnight-300 max-w-2xl font-medium leading-relaxed">
          A living log of analogue and mixed-signal design notes. Written as I re-derive
          the fundamentals so that I can read them rather than re-derive them next time.
          New entries appear at the top.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.15em] text-midnight-500 dark:text-midnight-400 font-semibold">
          <span className="inline-flex items-center gap-2">
            <BookOpen size={12} />
            {POSTS.length} {POSTS.length === 1 ? 'entry' : 'entries'}
          </span>
          <span className="w-px h-3 bg-midnight-300 dark:bg-midnight-700" />
          <span>Updated as I write</span>
        </div>
      </header>

      {/* Post list */}
      <div className="space-y-14">
        {POSTS.map((post) => (
          <article key={post.id} className="group">
            <div className="flex items-center gap-3 mb-3 font-mono text-[11px] uppercase tracking-[0.15em] text-midnight-500 dark:text-midnight-400 font-semibold">
              <Calendar size={12} />
              {post.date}
              <span className="w-1 h-1 rounded-full bg-midnight-400 dark:bg-midnight-600" />
              {post.tags.map((t, i) => (
                <span key={t} className="flex items-center gap-3">
                  {i > 0 && <span className="w-1 h-1 rounded-full bg-midnight-400 dark:bg-midnight-600" />}
                  <span>{t}</span>
                </span>
              ))}
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-midnight-900 dark:text-white mb-5 leading-tight">
              {post.title}
            </h2>
            <div className="prose-journal space-y-4 text-base md:text-[17px] text-midnight-700 dark:text-midnight-300 leading-[1.75] font-medium max-w-2xl">
              {post.body}
            </div>
          </article>
        ))}
      </div>

      {/* Closing note */}
      <div className="mt-20 pt-10 border-t border-midnight-200 dark:border-midnight-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <p className="text-sm text-midnight-500 dark:text-midnight-400 max-w-xl leading-relaxed">
          This is a personal journal. Comments and corrections are welcome — please reach out
          on the contact page if something here is wrong.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-5 py-3 border border-midnight-300 dark:border-midnight-700 text-midnight-700 dark:text-midnight-200 font-mono text-[11px] uppercase tracking-[0.18em] font-semibold hover:border-gold hover:text-gold dark:hover:border-gold dark:hover:text-gold transition-all duration-300"
        >
          Get in Touch
        </Link>
      </div>
    </main>
  );
}
