"use client";

import React, { useState } from "react";

interface NodePoint {
  id: string;
  name: string;
  type: "ambulance" | "emergency" | "hospital";
  x: number; // percentage
  y: number; // percentage
  status: string;
  speed?: string;
  driver?: string;
  eta?: string;
  vitals?: string;
  severity?: "Critical" | "High" | "Medium";
}

const mockNodes: NodePoint[] = [
  {
    id: "AMB-01",
    name: "ALS ICU Unit 01",
    type: "ambulance",
    x: 35,
    y: 42,
    status: "En Route to Incident",
    speed: "64 km/h",
    driver: "Rajesh Shinde",
    eta: "4 mins",
    vitals: "Telemetry active • O2: 98%",
  },
  {
    id: "AMB-02",
    name: "BLS Unit 02",
    type: "ambulance",
    x: 68,
    y: 28,
    status: "Dispatched",
    speed: "48 km/h",
    driver: "Manoj Jadhav",
    eta: "7 mins",
  },
  {
    id: "AMB-03",
    name: "Patient Transport 03",
    type: "ambulance",
    x: 82,
    y: 65,
    status: "Standby at Base",
    speed: "0 km/h",
    driver: "Amit Patil",
  },
  {
    id: "EMG-101",
    name: "Highway 48 Multi-Vehicle Collision",
    type: "emergency",
    x: 30,
    y: 38,
    status: "Triage Priority 1",
    severity: "Critical",
    vitals: "2 Patients • Unconscious • Severe Trauma",
  },
  {
    id: "EMG-102",
    name: "Acute STEMI / Cardiac Event",
    type: "emergency",
    x: 72,
    y: 34,
    status: "Doctor Responding",
    severity: "High",
    vitals: "62M • V-Tach • Defibrillator Ready",
  },
  {
    id: "HOSP-01",
    name: "Metro Trauma Center (HQ)",
    type: "hospital",
    x: 52,
    y: 52,
    status: "Level 1 Trauma Bay Ready (4 Beds)",
  },
];

export default function LiveDispatchRadar() {
  const [selectedNode, setSelectedNode] = useState<NodePoint | null>(mockNodes[0]);
  const [filter, setFilter] = useState<"all" | "ambulance" | "emergency">("all");
  const [isSweepActive, setIsSweepActive] = useState(true);

  const filteredNodes = mockNodes.filter((n) => {
    if (filter === "all") return true;
    if (filter === "ambulance") return n.type === "ambulance";
    if (filter === "emergency") return n.type === "emergency";
    return true;
  });

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 p-6 text-white shadow-2xl">
      {/* Header telemetry info */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
            </span>
            <h3 className="font-extrabold tracking-wide text-white text-base uppercase">
              Tactical Dispatch Telemetry & GPS Radar
            </h3>
            <span className="rounded-md bg-emerald-950/80 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-400 border border-emerald-800/50">
              LIVE 5G FEED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            GNSS Coordinates: 18.5204° N, 73.8567° E • Satellite Lock: 12/12 • Ping: 14ms
          </p>
        </div>

        {/* Filter toggles & Radar sweep button */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-lg px-2.5 py-1 font-semibold transition-all ${
                filter === "all" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              All Nodes
            </button>
            <button
              onClick={() => setFilter("ambulance")}
              className={`rounded-lg px-2.5 py-1 font-semibold transition-all ${
                filter === "ambulance" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              Fleet (3)
            </button>
            <button
              onClick={() => setFilter("emergency")}
              className={`rounded-lg px-2.5 py-1 font-semibold transition-all ${
                filter === "emergency" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              Incidents (2)
            </button>
          </div>

          <button
            onClick={() => setIsSweepActive(!isSweepActive)}
            title="Toggle sweep line"
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-400 text-xs"
          >
            {isSweepActive ? "📡" : "⏸️"}
          </button>
        </div>
      </div>

      {/* Main Grid Viewport */}
      <div className="mt-5 grid gap-6 lg:grid-cols-12">
        {/* Radar View (8 cols) */}
        <div className="relative lg:col-span-8 h-[340px] sm:h-[380px] rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-slate-800/90 overflow-hidden flex items-center justify-center">
          {/* Concentric radar circles */}
          <div className="absolute h-[120px] w-[120px] rounded-full border border-blue-500/20" />
          <div className="absolute h-[220px] w-[220px] rounded-full border border-blue-500/15" />
          <div className="absolute h-[320px] w-[320px] rounded-full border border-blue-500/10" />
          <div className="absolute h-[420px] w-[420px] rounded-full border border-blue-500/5" />

          {/* Crosshairs */}
          <div className="absolute inset-x-0 top-1/2 h-[1px] bg-blue-500/15" />
          <div className="absolute inset-y-0 left-1/2 w-[1px] bg-blue-500/15" />

          {/* Diagonal grid markers */}
          <div className="absolute top-3 left-4 font-mono text-[10px] text-slate-500">
            SECTOR 4A • TRAUMA DISPATCH CORRIDOR
          </div>
          <div className="absolute bottom-3 right-4 font-mono text-[10px] text-slate-500">
            ZOOM: 1:25,000 • METRO PUNE
          </div>

          {/* Rotating Radar Sweep Line */}
          {isSweepActive && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div
                className="h-[360px] w-[360px] origin-center rounded-full"
                style={{
                  background:
                    "conic-gradient(from 0deg at 50% 50%, rgba(59, 130, 246, 0.28) 0deg, rgba(59, 130, 246, 0) 65deg)",
                  animation: "radarSweep 5s linear infinite",
                }}
              />
            </div>
          )}

          {/* Interactive Nodes */}
          {filteredNodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            let dotColor = "bg-blue-500 text-blue-200 border-blue-400";
            let pingColor = "bg-blue-400";

            if (node.type === "emergency") {
              dotColor = "bg-rose-600 text-rose-100 border-rose-400";
              pingColor = "bg-rose-500";
            } else if (node.type === "hospital") {
              dotColor = "bg-emerald-600 text-emerald-100 border-emerald-400";
              pingColor = "bg-emerald-500";
            }

            return (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                style={{ top: `${node.y}%`, left: `${node.x}%` }}
                className={`group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-125 focus:outline-none z-10`}
              >
                <div className="relative flex items-center justify-center">
                  {/* Ping Animation */}
                  <span
                    className={`absolute -inset-1.5 animate-ping rounded-full opacity-70 ${pingColor}`}
                  />
                  {/* Outer Ring if Selected */}
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold shadow-lg transition-all ${dotColor} ${
                      isSelected ? "ring-4 ring-white/50 scale-110" : ""
                    }`}
                  >
                    {node.type === "ambulance" && "🚑"}
                    {node.type === "emergency" && "🚨"}
                    {node.type === "hospital" && "🏥"}
                  </span>
                </div>

                {/* Node Pill Tooltip */}
                <div className="pointer-events-none absolute left-1/2 top-9 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-md border border-slate-700/80 opacity-90 group-hover:opacity-100">
                  {node.id}
                </div>
              </button>
            );
          })}
        </div>

        {/* Node Telemetry Inspector Card (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between rounded-2xl bg-slate-900/80 border border-slate-800 p-5">
          {selectedNode ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">
                    {selectedNode.type === "ambulance"
                      ? "🚑"
                      : selectedNode.type === "emergency"
                      ? "🚨"
                      : "🏥"}
                  </span>
                  <div>
                    <h4 className="font-extrabold text-white text-sm">
                      {selectedNode.name}
                    </h4>
                    <span className="font-mono text-[11px] text-blue-400">
                      ID: {selectedNode.id}
                    </span>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    selectedNode.type === "emergency"
                      ? "bg-rose-950 text-rose-300 border border-rose-800"
                      : selectedNode.type === "ambulance"
                      ? "bg-blue-950 text-blue-300 border border-blue-800"
                      : "bg-emerald-950 text-emerald-300 border border-emerald-800"
                  }`}
                >
                  {selectedNode.type}
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-2.5 border border-slate-800/80">
                  <span className="text-slate-400">Current Status:</span>
                  <span className="font-bold text-white">
                    {selectedNode.status}
                  </span>
                </div>

                {selectedNode.speed && (
                  <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-2.5 border border-slate-800/80">
                    <span className="text-slate-400">Speed / Velocity:</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {selectedNode.speed}
                    </span>
                  </div>
                )}

                {selectedNode.driver && (
                  <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-2.5 border border-slate-800/80">
                    <span className="text-slate-400">Assigned Driver:</span>
                    <span className="font-semibold text-slate-200">
                      {selectedNode.driver}
                    </span>
                  </div>
                )}

                {selectedNode.eta && (
                  <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-2.5 border border-slate-800/80">
                    <span className="text-slate-400">ETA to Scene:</span>
                    <span className="font-mono font-extrabold text-amber-300">
                      ⏱️ {selectedNode.eta}
                    </span>
                  </div>
                )}

                {selectedNode.vitals && (
                  <div className="rounded-xl bg-slate-950/60 p-2.5 border border-slate-800/80">
                    <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                      Clinical Notes & Telemetry
                    </span>
                    <p className="font-semibold text-slate-200 text-[11px]">
                      {selectedNode.vitals}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-center text-xs text-slate-500">
              Select any pulsing node on the radar to inspect real-time telemetry.
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Grid Refresh: Auto (1.5s)</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Transceiver Online
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
