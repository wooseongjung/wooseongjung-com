import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Cpu, Calendar, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

/* ═══════════════════════════════════════
   Circuit Design Journal
   - Index view at /learning/circuit-design
   - Single-post view at /learning/circuit-design/:postId
   To add a new entry: prepend an object to POSTS (newest first).
   ═══════════════════════════════════════ */

const POSTS = [
  {
    id: 'kickoff',
    date: '2026-04-17',
    title: 'Starting a circuit-design journal',
    tags: ['Meta', 'Notes'],
    excerpt:
      'Why this page exists, what will go in it, and the first batch of topics lined up — op-amp compensation, current-mirror matching, and Bode plots from first principles.',
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

/* ─────────────────────────────────────── */
/* Shared bits                             */
/* ─────────────────────────────────────── */

const PageShell = ({ children }) => (
  <main className="max-w-4xl mx-auto px-6 md:px-12 py-20 md:py-28">{children}</main>
);

const JournalHeader = ({ entryCount }) => (
  <header className="mb-12 pb-10 border-b border-midnight-200 dark:border-midnight-800">
    <div className="flex items-center gap-3 mb-5 font-mono text-[11px] uppercase tracking-[0.18em] text-gold font-semibold">
      <Cpu size={14} />
      Learning Journal · Circuit Design
    </div>
    <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-midnight-900 dark:text-white mb-5 leading-[1.05]">
      Circuit Design Journal
    </h1>
    <p className="text-base md:text-lg text-midnight-600 dark:text-midnight-300 max-w-2xl font-medium leading-relaxed">
      A living log of analogue and mixed-signal design notes. Written as I re-derive the
      fundamentals so that I can read them rather than re-derive them next time.
    </p>
    <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.15em] text-midnight-500 dark:text-midnight-400 font-semibold">
      <span className="inline-flex items-center gap-2">
        <BookOpen size={12} />
        {entryCount} {entryCount === 1 ? 'entry' : 'entries'}
      </span>
      <span className="w-px h-3 bg-midnight-300 dark:bg-midnight-700" />
      <span>Updated as I write</span>
    </div>
  </header>
);

/* ─────────────────────────────────────── */
/* Index view                              */
/* ─────────────────────────────────────── */

function JournalIndex() {
  return (
    <PageShell>
      <Link
        to="/life"
        className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] font-semibold text-midnight-500 dark:text-midnight-400 hover:text-gold dark:hover:text-gold transition-colors mb-10"
      >
        <ArrowLeft size={14} /> Back to Life
      </Link>

      <JournalHeader entryCount={POSTS.length} />

      {POSTS.length === 0 ? (
        <div className="p-10 border border-dashed border-midnight-300 dark:border-midnight-700 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-midnight-500 dark:text-midnight-400 font-semibold">
            First entry coming soon
          </p>
        </div>
      ) : (
        <ol className="border-t border-midnight-200 dark:border-midnight-800">
          {POSTS.map((post, i) => {
            const num = String(POSTS.length - i).padStart(2, '0');
            return (
              <li
                key={post.id}
                className="border-b border-midnight-200 dark:border-midnight-800"
              >
                <Link
                  to={`/learning/circuit-design/${post.id}`}
                  className="block group relative py-6 md:py-7 px-1 hover:bg-midnight-50/70 dark:hover:bg-midnight-900/40 transition-colors"
                >
                  <div className="flex items-start gap-5 md:gap-8">
                    <span className="font-mono text-xs md:text-sm font-bold text-gold tracking-[0.15em] mt-1 shrink-0 w-8">
                      {num}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-2 font-mono text-[11px] uppercase tracking-[0.15em] text-midnight-500 dark:text-midnight-400 font-semibold">
                        <span className="inline-flex items-center gap-2">
                          <Calendar size={11} />
                          {post.date}
                        </span>
                        {post.tags.map((t) => (
                          <span key={t} className="inline-flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-midnight-400 dark:bg-midnight-600" />
                            {t}
                          </span>
                        ))}
                      </div>
                      <h2 className="font-display text-xl md:text-2xl font-bold tracking-tight text-midnight-900 dark:text-white mb-2 group-hover:text-gold dark:group-hover:text-gold transition-colors leading-snug">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-sm md:text-base text-midnight-600 dark:text-midnight-300 leading-relaxed font-medium max-w-2xl">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="mt-3 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-gold font-semibold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        Read entry <ArrowRight size={12} />
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      )}

      <div className="mt-16 pt-10 border-t border-midnight-200 dark:border-midnight-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
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
    </PageShell>
  );
}

/* ─────────────────────────────────────── */
/* Single-post view                        */
/* ─────────────────────────────────────── */

function JournalPost({ postId }) {
  const idx = POSTS.findIndex((p) => p.id === postId);
  if (idx === -1) return <Navigate to="/learning/circuit-design" replace />;
  const post = POSTS[idx];
  // POSTS is newest-first, so "newer" is idx-1 and "older" is idx+1
  const newer = idx > 0 ? POSTS[idx - 1] : null;
  const older = idx < POSTS.length - 1 ? POSTS[idx + 1] : null;
  const num = String(POSTS.length - idx).padStart(2, '0');

  return (
    <PageShell>
      <Link
        to="/learning/circuit-design"
        className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] font-semibold text-midnight-500 dark:text-midnight-400 hover:text-gold dark:hover:text-gold transition-colors mb-10"
      >
        <ArrowLeft size={14} /> Back to Index
      </Link>

      <article>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-4 font-mono text-[11px] uppercase tracking-[0.15em] text-midnight-500 dark:text-midnight-400 font-semibold">
          <span className="text-gold">Entry {num}</span>
          <span className="w-1 h-1 rounded-full bg-midnight-400 dark:bg-midnight-600" />
          <span className="inline-flex items-center gap-2">
            <Calendar size={11} />
            {post.date}
          </span>
          {post.tags.map((t) => (
            <span key={t} className="inline-flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-midnight-400 dark:bg-midnight-600" />
              {t}
            </span>
          ))}
        </div>

        <h1 className="font-display text-3xl md:text-5xl font-black tracking-tight text-midnight-900 dark:text-white mb-8 leading-[1.1]">
          {post.title}
        </h1>

        <div className="space-y-5 text-base md:text-[17px] text-midnight-700 dark:text-midnight-300 leading-[1.8] font-medium max-w-2xl">
          {post.body}
        </div>
      </article>

      {/* Prev / Next navigation */}
      <nav
        aria-label="Entry navigation"
        className="mt-16 pt-8 border-t border-midnight-200 dark:border-midnight-800 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {newer ? (
          <Link
            to={`/learning/circuit-design/${newer.id}`}
            className="group flex items-start gap-3 p-5 border border-midnight-200 dark:border-midnight-800 hover:border-gold/50 dark:hover:border-gold/40 transition-colors"
          >
            <ChevronLeft size={16} className="mt-1 shrink-0 text-midnight-400 group-hover:text-gold transition-colors" />
            <div className="min-w-0">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-midnight-500 dark:text-midnight-400 font-semibold mb-1">
                Newer entry
              </div>
              <div className="font-display text-base font-bold text-midnight-900 dark:text-white group-hover:text-gold dark:group-hover:text-gold transition-colors truncate">
                {newer.title}
              </div>
            </div>
          </Link>
        ) : (
          <div />
        )}
        {older ? (
          <Link
            to={`/learning/circuit-design/${older.id}`}
            className="group flex items-start gap-3 p-5 border border-midnight-200 dark:border-midnight-800 hover:border-gold/50 dark:hover:border-gold/40 transition-colors md:text-right md:flex-row-reverse"
          >
            <ChevronRight size={16} className="mt-1 shrink-0 text-midnight-400 group-hover:text-gold transition-colors" />
            <div className="min-w-0 md:flex-1">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-midnight-500 dark:text-midnight-400 font-semibold mb-1">
                Older entry
              </div>
              <div className="font-display text-base font-bold text-midnight-900 dark:text-white group-hover:text-gold dark:group-hover:text-gold transition-colors truncate">
                {older.title}
              </div>
            </div>
          </Link>
        ) : (
          <div />
        )}
      </nav>

      <div className="mt-10 flex justify-center">
        <Link
          to="/learning/circuit-design"
          className="inline-flex items-center gap-2 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] font-semibold text-midnight-600 dark:text-midnight-300 hover:text-gold dark:hover:text-gold transition-colors"
        >
          <BookOpen size={12} /> All Entries
        </Link>
      </div>
    </PageShell>
  );
}

/* ─────────────────────────────────────── */
/* Router                                   */
/* ─────────────────────────────────────── */

export default function CircuitDesignJournal() {
  const { postId } = useParams();
  return postId ? <JournalPost postId={postId} /> : <JournalIndex />;
}
