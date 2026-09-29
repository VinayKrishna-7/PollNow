import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UserX,
  Share2,
  ShieldCheck,
  Zap,
  Lock,
  Plus,
  Server,
  Layers,
  Sparkles,
} from 'lucide-react';
import Button from '../components/Button';

export const About = () => {
  useEffect(() => {
    document.title = 'About — PollNow';
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      {/* Hero */}
      <div className="text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Our Philosophy
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Polling made simple.
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          PollNow allows anyone to create and share polls instantly without creating an account,
          remembering passwords, or giving up their private data.
        </p>
      </div>

      {/* Core Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-7 rounded-3xl bg-white dark:bg-[#12151e] border border-slate-200/80 dark:border-white/[0.08] shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 mb-4">
            <UserX className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Zero Sign-up
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            No signup forms, passwords, OAuth popups, or email confirmations. Ask a question, get answers, and move forward.
          </p>
        </div>

        <div className="p-7 rounded-3xl bg-white dark:bg-[#12151e] border border-slate-200/80 dark:border-white/[0.08] shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mb-4">
            <Share2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Frictionless Sharing
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Every poll gets a clean, short, memorable URL. Send it across Slack, Telegram, WhatsApp, email, or social networks.
          </p>
        </div>

        <div className="p-7 rounded-3xl bg-white dark:bg-[#12151e] border border-slate-200/80 dark:border-white/[0.08] shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-500 mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Anonymous & Fair Voting
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Voters maintain total anonymity. Our system prevents ballot stuffing and duplicate submissions via compound indexed voter hashes.
          </p>
        </div>

        <div className="p-7 rounded-3xl bg-white dark:bg-[#12151e] border border-slate-200/80 dark:border-white/[0.08] shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-4">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Instant Real-time Results
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Watch live responses roll in with real-time percentage progress bars, detailed breakdowns, and interactive distribution charts.
          </p>
        </div>
      </div>

      {/* Architecture Deep Dive */}
      <div className="rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-xl space-y-6">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <Server className="w-4 h-4" />
          <span>Technology & Architecture</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Built with modern engineering standards
        </h2>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          PollNow is constructed on the modern MERN stack (MongoDB, Express, React, Node.js).
          To protect data integrity, every vote count is executed via MongoDB atomic array operations,
          preventing race conditions even under concurrent load. Poll management is protected by
          SHA-256 hashed cryptographically secure tokens.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10 text-xs">
          <div>
            <span className="text-indigo-400 font-semibold block">Frontend</span>
            <span className="text-slate-300">React + Vite + Tailwind</span>
          </div>
          <div>
            <span className="text-indigo-400 font-semibold block">Backend</span>
            <span className="text-slate-300">Node.js + Express API</span>
          </div>
          <div>
            <span className="text-indigo-400 font-semibold block">Database</span>
            <span className="text-slate-300">MongoDB + Mongoose</span>
          </div>
          <div>
            <span className="text-indigo-400 font-semibold block">Security</span>
            <span className="text-slate-300">Rate Limiting + Helmet</span>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center pt-4">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Ready to ask your question?
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          No credit card, no account, no setup required.
        </p>
        <Link to="/create">
          <Button
            variant="primary"
            size="lg"
            leftIcon={<Plus className="w-5 h-5" />}
            className="px-8 font-semibold shadow-indigo-500/25"
          >
            Create a Poll
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default About;
