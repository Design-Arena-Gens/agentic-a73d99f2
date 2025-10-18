"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Atom,
  BadgeCheck,
  CircuitBoard,
  Cpu,
  Gauge,
  Palette,
  PanelsTopLeft,
  Radar,
  Rocket,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Workflow,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import clsx from "clsx";

type DisciplineKey = "design" | "engineering" | "systems";

type KpiCard = {
  id: string;
  label: string;
  value: string;
  unit: string;
  delta: string;
  positive?: boolean;
  accent: string;
  icon: LucideIcon;
};

type DisciplineMetric = {
  label: string;
  primary: string;
  descriptor: string;
  delta: string;
  positive?: boolean;
};

type DisciplinePulse = {
  id: string;
  label: string;
  energy: number;
  load: string;
  freq: string;
  description: string;
};

type IntegrationLoop = {
  id: string;
  title: string;
  completion: number;
  lead: string;
  descriptor: string;
};

type DisciplineProfile = {
  name: string;
  tagline: string;
  synopsis: string;
  accent: string;
  marker: string;
  glow: string;
  metrics: DisciplineMetric[];
  pulses: DisciplinePulse[];
  loops: IntegrationLoop[];
};

type MicroThread = {
  id: string;
  label: string;
  owner: string;
  window: string;
  status: "stabilizing" | "active" | "pending";
  detail: string;
  anchors: string[];
  energy: Record<DisciplineKey, number>;
};

type FocusBand = {
  label: string;
  range: [number, number];
  descriptor: string;
};

const kpiCards: KpiCard[] = [
  {
    id: "interactions",
    label: "Live Micro-Interactions",
    value: "148",
    unit: "patterns ready",
    delta: "+18",
    positive: true,
    accent: "from-cyan-500/30 via-sky-500/20 to-blue-500/5",
    icon: Sparkles,
  },
  {
    id: "velocity",
    label: "Prototype Velocity",
    value: "6h",
    unit: "avg loop time",
    delta: "-3.4h",
    positive: true,
    accent: "from-violet-500/25 via-fuchsia-500/15 to-purple-500/5",
    icon: Rocket,
  },
  {
    id: "latency",
    label: "Interaction Latency",
    value: "18 ms",
    unit: "response budget",
    delta: "-2.4 ms",
    positive: true,
    accent: "from-emerald-500/25 via-teal-500/15 to-green-500/5",
    icon: Gauge,
  },
  {
    id: "confidence",
    label: "Release Confidence",
    value: "91%",
    unit: "ready for shipping",
    delta: "+3.1%",
    positive: true,
    accent: "from-sky-500/25 via-cyan-500/20 to-teal-500/10",
    icon: ShieldCheck,
  },
];

const disciplineProfiles: Record<DisciplineKey, DisciplineProfile> = {
  design: {
    name: "Design Motion Lab",
    tagline: "Choreographs immersive micro-interaction surfaces.",
    synopsis:
      "Every pixel breathes with stateful feedback, stitched into a seamless handoff experience.",
    accent: "from-cyan-400/90 via-sky-500/60 to-blue-500/40",
    marker: "bg-cyan-400/80",
    glow: "shadow-[0_0_25px_rgba(94,234,212,0.35)]",
    metrics: [
      {
        label: "Interaction depth",
        primary: "92%",
        descriptor: "High-fidelity motion arcs in review",
        delta: "+4.3%",
        positive: true,
      },
      {
        label: "Latency handshake",
        primary: "18 ms",
        descriptor: "Gesture to response handshake avg",
        delta: "-2.4 ms",
        positive: true,
      },
      {
        label: "Prototype cadence",
        primary: "8 / day",
        descriptor: "Interactive prototypes shipped daily",
        delta: "+2",
        positive: true,
      },
    ],
    pulses: [
      {
        id: "lattice",
        label: "Harmonic Lattice",
        energy: 78,
        load: "Optimistic",
        freq: "32 µHz",
        description:
          "Designers refining subtle easing envelopes for cross-device continuity.",
      },
      {
        id: "waveform",
        label: "Waveform Resonance",
        energy: 64,
        load: "Nominal",
        freq: "48 µHz",
        description:
          "Micro-feedback tokens aligning to accessibility curves and color contrast.",
      },
      {
        id: "echo",
        label: "Echo Fabric",
        energy: 88,
        load: "Elevated",
        freq: "24 µHz",
        description:
          "Shared motion assets validated for new onboarding micro-journeys.",
      },
    ],
    loops: [
      {
        id: "gesture",
        title: "Gesture Response Loop",
        completion: 86,
        lead: "Owens · Motion",
        descriptor: "Auditing tactile cues against latency budgets.",
      },
      {
        id: "a11y",
        title: "Accessible Touch Mesh",
        completion: 74,
        lead: "Singh · Systems",
        descriptor: "Ensuring contrast + motion preferences cascade.",
      },
      {
        id: "handoff",
        title: "Design → Build Handoff",
        completion: 93,
        lead: "Chen · DesignOps",
        descriptor: "Tokens synced w/ engineering states in realtime.",
      },
    ],
  },
  engineering: {
    name: "Engineering Control Forge",
    tagline: "Stabilizes precision micro-services in motion.",
    synopsis:
      "Runtime orchestrations align with the motion grammar, ensuring sub-20ms response windows.",
    accent: "from-emerald-400/90 via-teal-500/60 to-cyan-500/35",
    marker: "bg-emerald-400/80",
    glow: "shadow-[0_0_25px_rgba(52,211,153,0.35)]",
    metrics: [
      {
        label: "Runtime determinism",
        primary: "97.4%",
        descriptor: "Interactions executing within sync window",
        delta: "+2.1%",
        positive: true,
      },
      {
        label: "Edge deployment",
        primary: "12 shards",
        descriptor: "Deployed edge bundles for haptics + gestures",
        delta: "+3",
        positive: true,
      },
      {
        label: "Regression blockers",
        primary: "2 tickets",
        descriptor: "Critical regressions impacting release",
        delta: "-1",
        positive: true,
      },
    ],
    pulses: [
      {
        id: "runtime",
        label: "Runtime Cohesion",
        energy: 84,
        load: "Stable",
        freq: "64 µHz",
        description:
          "Micro-service orchestration syncs to interaction event bus.",
      },
      {
        id: "observer",
        label: "Observer Mesh",
        energy: 71,
        load: "Nominal",
        freq: "22 µHz",
        description:
          "GraphQL live queries verifying motion states under load.",
      },
      {
        id: "staging",
        label: "Staging Fusion",
        energy: 66,
        load: "Elevated",
        freq: "44 µHz",
        description:
          "Dynamic preview envs validating multi-device interaction debt.",
      },
    ],
    loops: [
      {
        id: "telemetry",
        title: "Telemetry Feedback Loop",
        completion: 81,
        lead: "Keller · Platform",
        descriptor: "Tracing micro-events to latency budgets.",
      },
      {
        id: "qa",
        title: "QA Motion Harness",
        completion: 69,
        lead: "Diaz · QA",
        descriptor: "Synthetic gestures validating runtime states.",
      },
      {
        id: "ops",
        title: "Ops Burn-down",
        completion: 58,
        lead: "Ibarra · SRE",
        descriptor: "Stabilizing release windows and on-call load.",
      },
    ],
  },
  systems: {
    name: "Systems Resonance Core",
    tagline: "Calibrates orchestrated adaptive experiences.",
    synopsis:
      "Holistic oversight of platform rhythms, aligning design + engineering telemetry into one pulse.",
    accent: "from-violet-400/90 via-fuchsia-500/60 to-indigo-500/40",
    marker: "bg-violet-400/80",
    glow: "shadow-[0_0_25px_rgba(168,85,247,0.35)]",
    metrics: [
      {
        label: "Signal integrity",
        primary: "95%",
        descriptor: "Cross-discipline feedback loops in sync",
        delta: "+3.7%",
        positive: true,
      },
      {
        label: "Scenario coverage",
        primary: "28 paths",
        descriptor: "Adaptive flows validated end-to-end",
        delta: "+5",
        positive: true,
      },
      {
        label: "Intervention load",
        primary: "12%",
        descriptor: "Fallback engagements triggered weekly",
        delta: "-1.8%",
        positive: true,
      },
    ],
    pulses: [
      {
        id: "constellation",
        label: "Constellation Sync",
        energy: 76,
        load: "Balanced",
        freq: "18 µHz",
        description:
          "System heuristics balancing micro-interaction variability.",
      },
      {
        id: "aurora",
        label: "Aurora Field",
        energy: 83,
        load: "Elevated",
        freq: "28 µHz",
        description:
          "Predictive alerting across the design-engineering bridge.",
      },
      {
        id: "flux",
        label: "Flux Harmonizer",
        energy: 69,
        load: "Nominal",
        freq: "36 µHz",
        description:
          "Temporal sequencing of experiments + feature flags interplay.",
      },
    ],
    loops: [
      {
        id: "signals",
        title: "Signals Synthesis",
        completion: 88,
        lead: "Nguyen · Strategy",
        descriptor: "Unifying telemetry across experience states.",
      },
      {
        id: "forecast",
        title: "Forecast Modeling",
        completion: 63,
        lead: "Garcia · Insights",
        descriptor: "Predictive frameworks guiding rollout pace.",
      },
      {
        id: "feedback",
        title: "Feedback Router",
        completion: 79,
        lead: "Ahmed · Systems",
        descriptor: "Routing qualitative signals into product backlog.",
      },
    ],
  },
};

const focusBands: FocusBand[] = [
  {
    label: "Exploration",
    range: [0, 40],
    descriptor: "Divergent thinking, spike emerging patterns.",
  },
  {
    label: "Craft",
    range: [41, 70],
    descriptor: "Refine pixels + motion; tighten experience quality.",
  },
  {
    label: "Polish",
    range: [71, 100],
    descriptor: "Frame-perfect tuning for launch-critical flows.",
  },
];

const microThreads: MicroThread[] = [
  {
    id: "handshake",
    label: "Haptic Handshake",
    owner: "Design Ops",
    window: "01h 12m",
    status: "stabilizing",
    detail:
      "Tuning entry sequence haptics for cross-platform onboarding handshake.",
    anchors: ["haptic", "onboarding"],
    energy: {
      design: 82,
      engineering: 64,
      systems: 74,
    },
  },
  {
    id: "latency-guard",
    label: "Latency Guardrail",
    owner: "Platform Eng",
    window: "03h 45m",
    status: "active",
    detail:
      "Deploying predictive throttling for micro-interactions under heavy load.",
    anchors: ["latency", "runtime"],
    energy: {
      design: 58,
      engineering: 91,
      systems: 88,
    },
  },
  {
    id: "presence",
    label: "Presence Gradient",
    owner: "Systems Lab",
    window: "05h 08m",
    status: "pending",
    detail:
      "Aligning ambient presence cues with event orchestration heuristics.",
    anchors: ["ambient", "signals"],
    energy: {
      design: 69,
      engineering: 55,
      systems: 92,
    },
  },
  {
    id: "handoff",
    label: "Design → Build Relay",
    owner: "Design Systems",
    window: "00h 48m",
    status: "active",
    detail:
      "Auto-synchronizing interaction tokens across multi-platform builds.",
    anchors: ["handoff", "automation"],
    energy: {
      design: 94,
      engineering: 78,
      systems: 81,
    },
  },
];

function useNow() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 30_000);

    return () => clearInterval(interval);
  }, []);

  return now;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDay(date: Date) {
  return date.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function Home() {
  const [discipline, setDiscipline] = useState<DisciplineKey>("design");
  const [focusIntensity, setFocusIntensity] = useState(68);
  const [selectedPulseId, setSelectedPulseId] = useState(
    disciplineProfiles.design.pulses[0].id,
  );
  const [hoveredThread, setHoveredThread] = useState<string | null>(null);
  const now = useNow();

  useEffect(() => {
    setSelectedPulseId(disciplineProfiles[discipline].pulses[0].id);
  }, [discipline]);

  const profile = useMemo(() => disciplineProfiles[discipline], [discipline]);

  const activePulse = useMemo(
    () =>
      profile.pulses.find((pulse) => pulse.id === selectedPulseId) ??
      profile.pulses[0],
    [profile, selectedPulseId],
  );

  const focusBand =
    focusBands.find(
      (band) =>
        focusIntensity >= band.range[0] && focusIntensity <= band.range[1],
    ) ?? focusBands.at(-1)!;

  const disciplineThreads = useMemo(
    () =>
      microThreads.map((thread) => ({
        ...thread,
        activation: Math.round(
          thread.energy[discipline] * (0.7 + focusIntensity / 200),
        ),
      })),
    [discipline, focusIntensity],
  );

  return (
    <div className="relative min-h-screen overflow-hidden pb-20">
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="dot-grid absolute inset-0 translate-y-6 opacity-40" />
        <motion.div
          className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-cyan-500/25 blur-3xl"
          animate={{ y: [0, 20, 0], opacity: [0.45, 0.7, 0.45] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-10 top-20 h-64 w-64 rounded-full bg-violet-500/25 blur-3xl"
          animate={{
            y: [0, -18, 0],
            x: [0, -6, 4, 0],
            opacity: [0.4, 0.65, 0.4],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-10 lg:px-10">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
              <PanelsTopLeft className="h-4 w-4 text-cyan-300" />
              <span className="text-xs uppercase tracking-[0.28em] text-white/70">
                FluxLab Control Room
              </span>
            </div>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-100 md:text-4xl">
              Micro-interaction design & engineering dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300/75">
              Synchronize design energy, engineering stability, and systems
              resonance. Tune focus, monitor pulses, and shepherd launch-ready
              experiences in one interface.
            </p>
          </div>

          <div className="flex items-end gap-6">
            <div className="hidden flex-col text-right text-xs text-slate-300/75 md:flex">
              <span>{formatDay(now)}</span>
              <span className="text-lg font-semibold text-slate-100">
                {formatTime(now)}
              </span>
              <span className="text-[11px] text-slate-400">
                Control room · Coordinated Universal Time
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative overflow-hidden rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 px-5 py-2 text-sm font-medium text-slate-900 shadow-lg shadow-cyan-500/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Launch Interaction Sweep
              </span>
              <span className="absolute inset-0 opacity-60">
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent blur-sm">
                  <motion.span
                    className="block h-full w-full bg-white/30"
                    animate={{ x: [0, 200, 200], opacity: [0, 1, 0] }}
                    transition={{
                      duration: 2.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </span>
              </span>
            </motion.button>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
          <aside className="space-y-6">
            <motion.section
              layout
              className="glass-panel relative overflow-hidden rounded-3xl p-6"
            >
              <div className="absolute right-10 top-10 h-28 w-28 rounded-full bg-cyan-400/10 blur-2xl" />
              <div className="absolute left-10 top-10 h-3 w-3 animate-[pulse-ring_3s_ease-in-out_infinite] rounded-full bg-cyan-300/60" />
              <div className="flex items-center justify-between text-xs text-slate-300/70">
                <span className="flex items-center gap-2 font-semibold uppercase tracking-[0.32em] text-slate-300/80">
                  <Activity className="h-3.5 w-3.5 text-cyan-300" />
                  Focus Mode
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[11px] text-slate-200/80">
                  <TimerReset className="h-3 w-3 text-cyan-200" />
                  {focusIntensity}%
                </span>
              </div>
              <div className="mt-6">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-slate-400">
                  <span>Exploration</span>
                  <span>Polish</span>
                </div>
                <div className="relative mt-3 h-2.5 rounded-full bg-white/5">
                  <motion.div
                    className="absolute inset-y-0 rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600"
                    style={{ width: `${focusIntensity}%` }}
                  />
                  <motion.div
                    className="absolute -top-1 h-4 w-4 rounded-full border border-cyan-200/80 bg-cyan-100/90 shadow-[0_0_0_4px_rgba(94,234,212,0.18)]"
                    animate={{
                      left: `calc(${focusIntensity}% - 0.5rem)`,
                      boxShadow: [
                        "0 0 0 4px rgba(94,234,212,0.18)",
                        "0 0 0 6px rgba(94,234,212,0.10)",
                        "0 0 0 4px rgba(94,234,212,0.18)",
                      ],
                    }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={focusIntensity}
                  onChange={(event) =>
                    setFocusIntensity(Number(event.target.value))
                  }
                  className="mt-6 w-full appearance-none bg-transparent"
                  aria-label="Adjust focus intensity"
                />
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={focusBand.label}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-slate-300/80"
                >
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
                    Current Band
                  </div>
                  <div className="mt-2 text-lg font-semibold text-slate-100">
                    {focusBand.label}
                  </div>
                  <p className="mt-2 text-sm leading-6">{focusBand.descriptor}</p>
                </motion.div>
              </AnimatePresence>
            </motion.section>

            <section className="glass-panel relative overflow-hidden rounded-3xl p-6">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-slate-400">
                <span>Pulses</span>
                <span className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-slate-200/70">
                  <Zap className="h-3 w-3 text-amber-300" />
                  Live
                </span>
              </div>
              <div className="mt-5 space-y-3">
                {profile.pulses.map((pulse) => (
                  <motion.button
                    key={pulse.id}
                    onClick={() => setSelectedPulseId(pulse.id)}
                    whileHover={{ scale: 1.01 }}
                    className={clsx(
                      "relative w-full overflow-hidden rounded-2xl border px-4 py-3 text-left transition",
                      selectedPulseId === pulse.id
                        ? "border-cyan-300/40 bg-white/10 text-slate-100"
                        : "border-white/10 bg-white/5 text-slate-300/80",
                    )}
                  >
                    <span className="absolute inset-0 opacity-60">
                      <motion.span
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{
                          x: ["-120%", "120%"],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "linear",
                          delay: 0.3,
                        }}
                      />
                    </span>
                    <div className="relative flex items-center justify-between text-sm text-slate-200">
                      <span className="font-medium">{pulse.label}</span>
                      <span className="text-xs text-slate-400">
                        {pulse.freq}
                      </span>
                    </div>
                    <div className="relative mt-3">
                      <div className="h-2 rounded-full bg-white/10">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500"
                          style={{ width: `${pulse.energy}%` }}
                        />
                      </div>
                      <div className="mt-1 flex justify-between text-[11px] uppercase tracking-[0.28em] text-slate-400/80">
                        <span>{pulse.load}</span>
                        <span>{pulse.energy}%</span>
                      </div>
                    </div>
                    <AnimatePresence>
                      {selectedPulseId === pulse.id ? (
                        <motion.p
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 0.9, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.2 }}
                          className="relative mt-3 text-xs text-slate-200/70"
                        >
                          {pulse.description}
                        </motion.p>
                      ) : null}
                    </AnimatePresence>
                  </motion.button>
                ))}
              </div>
            </section>

            <section className="glass-panel rounded-3xl p-6">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-slate-400">
                <span>Integration Loops</span>
                <BadgeCheck className="h-4 w-4 text-cyan-200/70" />
              </div>
              <div className="mt-4 space-y-4">
                {profile.loops.map((loop) => (
                  <div
                    key={loop.id}
                    className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-medium text-slate-100/90">
                          {loop.title}
                        </div>
                        <div className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-400/80">
                          {loop.lead}
                        </div>
                      </div>
                      <span className="rounded-full bg-white/5 px-2 py-1 text-xs text-slate-200/70">
                        {loop.completion}%
                      </span>
                    </div>
                    <div className="mt-3 h-1.5 rounded-full bg-white/10">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600"
                        animate={{ width: `${loop.completion}%` }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                      />
                    </div>
                    <p className="mt-3 text-xs text-slate-300/70">
                      {loop.descriptor}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </aside>

          <main className="space-y-6">
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {kpiCards.map((card) => {
                const Icon = card.icon;
                const positive = card.positive ?? !card.delta.startsWith("-");

                return (
                  <motion.article
                    key={card.id}
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 180, damping: 18 }}
                    className="group glass-panel relative overflow-hidden rounded-3xl p-5"
                  >
                    <span
                      className={clsx(
                        "pointer-events-none absolute inset-0 bg-gradient-to-r opacity-0 transition duration-500 group-hover:opacity-70",
                        card.accent,
                      )}
                    />
                    <div className="relative z-10">
                      <Icon className="h-5 w-5 text-cyan-200/80" />
                      <h2 className="mt-4 text-xs uppercase tracking-[0.28em] text-slate-400">
                        {card.label}
                      </h2>
                      <div className="mt-2 flex items-end gap-2">
                        <span className="text-2xl font-semibold text-slate-100">
                          {card.value}
                        </span>
                        <span className="text-xs text-slate-400/75">
                          {card.unit}
                        </span>
                      </div>
                      <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-xs text-slate-200/80">
                        {positive ? (
                          <ArrowUpRight className="h-4 w-4 text-emerald-300" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-rose-300" />
                        )}
                        {card.delta}
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </section>

            <section className="glass-panel relative overflow-hidden rounded-3xl p-6 sm:p-8">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />
              <div className="absolute inset-y-8 left-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
              <div className="relative">
                <LayoutGroup>
                  <div className="flex flex-wrap items-center gap-3">
                    {(
                      [
                        { key: "design", icon: Palette, label: "Design" },
                        { key: "engineering", icon: CircuitBoard, label: "Engineering" },
                        { key: "systems", icon: Atom, label: "Systems" },
                      ] satisfies Array<{ key: DisciplineKey; icon: LucideIcon; label: string }>
                    ).map(({ key, icon: Icon, label }) => {
                      const selected = key === discipline;

                      return (
                        <motion.button
                          key={key}
                          layout
                          onClick={() => setDiscipline(key)}
                          className={clsx(
                            "relative overflow-hidden rounded-full border px-4 py-2 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300",
                            selected
                              ? "border-cyan-300/50 bg-white/10 text-slate-100"
                              : "border-white/10 bg-white/5 text-slate-300/80",
                          )}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          {selected ? (
                            <motion.span
                              layoutId="discipline-highlight"
                              className={clsx(
                                "absolute inset-0 bg-gradient-to-r opacity-70",
                                disciplineProfiles[key].accent,
                              )}
                              transition={{ type: "spring", stiffness: 260, damping: 30 }}
                            />
                          ) : null}
                          <span className="relative z-10 flex items-center gap-2">
                            <Icon className="h-4 w-4 text-cyan-200/70" />
                            {label}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>

                  <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
                    <div className="relative">
                      <motion.div
                        layout
                        className={clsx(
                          "rounded-3xl border border-white/10 bg-white/5 p-6",
                          profile.glow,
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.32em] text-slate-300/70">
                              <span className={clsx("h-2 w-2 rounded-full", profile.marker)} />
                              Signature
                            </div>
                            <h2 className="mt-4 text-2xl font-semibold text-slate-100">
                              {profile.name}
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-slate-300/80">
                              {profile.synopsis}
                            </p>
                          </div>
                          <motion.div
                            className="relative h-20 w-20 rounded-full border border-white/10 bg-white/5"
                            animate={{
                              rotate: [0, 6, -6, 0],
                              boxShadow: [
                                "0 0 0 0 rgba(94,234,212,0.0)",
                                "0 0 0 8px rgba(94,234,212,0.12)",
                                "0 0 0 0 rgba(94,234,212,0.0)",
                              ],
                            }}
                            transition={{ duration: 8, repeat: Infinity }}
                          >
                            <motion.span
                              className="absolute inset-1 rounded-full bg-gradient-to-br from-white/5 to-transparent"
                              animate={{
                                rotate: [0, 180, 360],
                              }}
                              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            />
                            <motion.span
                              className="absolute inset-4 rounded-full border border-white/10 bg-gradient-to-br from-transparent to-white/10"
                              animate={{
                                scale: [1, 1.05, 1],
                                opacity: [0.6, 0.9, 0.6],
                              }}
                              transition={{ duration: 6, repeat: Infinity }}
                            />
                          </motion.div>
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-3">
                          <AnimatePresence mode="wait">
                            {profile.metrics.map((metric) => {
                              const positive =
                                metric.positive ?? !metric.delta.startsWith("-");
                              return (
                                <motion.div
                                  key={metric.label}
                                  layout
                                  initial={{ opacity: 0, y: 8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -8 }}
                                  transition={{ duration: 0.25 }}
                                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
                                >
                                  <div className="text-xs uppercase tracking-[0.28em] text-slate-400/80">
                                    {metric.label}
                                  </div>
                                  <div className="mt-2 text-xl font-semibold text-slate-100">
                                    {metric.primary}
                                  </div>
                                  <p className="mt-1 text-xs text-slate-300/80">
                                    {metric.descriptor}
                                  </p>
                                  <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-1 text-[11px] text-slate-200/70">
                                    {positive ? (
                                      <ArrowUpRight className="h-3.5 w-3.5 text-emerald-300" />
                                    ) : (
                                      <ArrowDownRight className="h-3.5 w-3.5 text-rose-300" />
                                    )}
                                    {metric.delta}
                                  </div>
                                </motion.div>
                              );
                            })}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    </div>

                    <motion.div
                      layout
                      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6"
                    >
                      <motion.div
                        className="absolute -left-6 top-10 h-32 w-32 rounded-full bg-cyan-400/20 blur-2xl"
                        animate={{ opacity: [0.35, 0.65, 0.35], scale: [0.9, 1.05, 0.9] }}
                        transition={{ duration: 6, repeat: Infinity }}
                      />
                      <div className="relative z-10">
                        <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-slate-400/80">
                          <span>Pulse Detail</span>
                          <span className="flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-[10px] text-slate-200/70">
                            <Radar className="h-3.5 w-3.5 text-sky-200/80" />
                            {activePulse.freq}
                          </span>
                        </div>
                        <h3 className="mt-4 text-lg font-semibold text-slate-100">
                          {activePulse.label}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-300/80">
                          {activePulse.description}
                        </p>

                        <div className="mt-6 space-y-4">
                          <div>
                            <div className="text-xs uppercase tracking-[0.3em] text-slate-400/80">
                              Energy Signature
                            </div>
                            <div className="mt-3 flex items-center gap-4">
                              <motion.div
                                className="relative h-20 w-20 rounded-full border border-white/10"
                                animate={{
                                  rotate: [0, 12, -8, 0],
                                }}
                                transition={{ duration: 10, repeat: Infinity }}
                              >
                                <motion.span
                                  className="absolute inset-2 rounded-full border border-cyan-200/40"
                                  animate={{
                                    opacity: [0.6, 0.9, 0.6],
                                    scale: [1, 1.05, 1],
                                  }}
                                  transition={{ duration: 4, repeat: Infinity }}
                                />
                                <motion.span
                                  className="absolute inset-4 rounded-full bg-gradient-to-br from-cyan-400/30 via-transparent to-sky-500/40"
                                  animate={{
                                    rotate: [0, 180, 360],
                                  }}
                                  transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                                />
                              </motion.div>
                              <div className="flex-1">
                                <div className="h-2.5 rounded-full bg-white/10">
                                  <motion.div
                                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600"
                                    animate={{ width: `${activePulse.energy}%` }}
                                    transition={{ type: "spring", stiffness: 120, damping: 18 }}
                                  />
                                </div>
                                <div className="mt-2 flex items-center justify-between text-xs uppercase tracking-[0.28em] text-slate-400/80">
                                  <span>{activePulse.load}</span>
                                  <span>{activePulse.energy}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-slate-300/80">
                            <div className="flex items-center gap-3">
                              <Cpu className="h-4 w-4 text-cyan-200/70" />
                              <div>
                                <div className="uppercase tracking-[0.28em] text-slate-400">
                                  Alignment Guidance
                                </div>
                                <p className="mt-1 leading-6">
                                  Correlate this pulse with telemetry signals to
                                  validate real-time motion fidelity and runtime
                                  safety.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </LayoutGroup>
              </div>
            </section>

            <section className="glass-panel rounded-3xl p-6 xl:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-100">
                    Micro Interaction Threads
                  </h2>
                  <p className="mt-1 text-sm text-slate-300/80">
                    Monitor the live threads connecting design, engineering, and
                    systems for the next release window.
                  </p>
                </div>
                <motion.div
                  className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs tracking-[0.28em] text-slate-300/80"
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  <Workflow className="h-4 w-4 text-sky-200" />
                  Thread Sync
                </motion.div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {disciplineThreads.map((thread) => {
                  const isHovered = hoveredThread === thread.id;
                  const threadPositive = thread.status !== "pending";

                  return (
                    <motion.div
                      key={thread.id}
                      onHoverStart={() => setHoveredThread(thread.id)}
                      onHoverEnd={() => setHoveredThread(null)}
                      className={clsx(
                        "group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 transition",
                        isHovered ? "micro-glow" : "",
                      )}
                    >
                      <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-600/10" />
                      </div>
                      <div className="relative z-10 flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-slate-100">
                            {thread.label}
                          </div>
                          <div className="mt-1 text-xs uppercase tracking-[0.28em] text-slate-400/80">
                            {thread.owner}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 text-right text-[11px] uppercase tracking-[0.28em] text-slate-400/70">
                          <span>{thread.window}</span>
                          <span
                            className={clsx(
                              "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px]",
                              thread.status === "active"
                                ? "bg-emerald-500/10 text-emerald-200/90"
                                : thread.status === "pending"
                                  ? "bg-amber-500/10 text-amber-200/90"
                                  : "bg-sky-500/10 text-sky-200/90",
                            )}
                          >
                            {thread.status}
                          </span>
                        </div>
                      </div>

                      <div className="relative mt-5">
                        <div className="h-2.5 rounded-full bg-white/10">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600"
                            animate={{
                              width: `${Math.min(thread.activation, 100)}%`,
                            }}
                            transition={{ type: "spring", stiffness: 160, damping: 18 }}
                          />
                        </div>
                        <div className="mt-2 flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-slate-400/80">
                          <span>Activation</span>
                          <span>{Math.min(thread.activation, 100)}%</span>
                        </div>
                        <motion.div
                          className="absolute -top-1 h-4 w-4 rounded-full border border-white/40 bg-cyan-200/80"
                          animate={{
                            left: `calc(${Math.min(thread.activation, 100)}% - 0.5rem)`,
                            scale: isHovered ? 1.2 : 1,
                          }}
                          transition={{ type: "spring", stiffness: 200, damping: 16 }}
                        />
                      </div>

                      <AnimatePresence>
                        {isHovered ? (
                          <motion.div
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.2 }}
                            className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-slate-300/80"
                          >
                            <div className="flex gap-3">
                              <div className="flex flex-shrink-0 flex-col items-center justify-center gap-2">
                                <Rocket className="h-4 w-4 text-cyan-200/90" />
                                <div
                                  className={clsx(
                                    "h-2 w-2 rounded-full",
                                    threadPositive
                                      ? "bg-emerald-300"
                                      : "bg-amber-300",
                                  )}
                                />
                              </div>
                              <div>
                                <p className="leading-6">{thread.detail}</p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {thread.anchors.map((anchor) => (
                                    <span
                                      key={anchor}
                                      className="rounded-full bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.32em] text-slate-300/70"
                                    >
                                      {anchor}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
