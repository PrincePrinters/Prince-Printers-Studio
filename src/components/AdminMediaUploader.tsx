'use client';

/* eslint-disable @next/next/no-img-element -- QR code is a generated data URL */

import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Upload, QrCode, Download, ExternalLink, CheckCircle2, AlertCircle, Loader2, Copy } from 'lucide-react';
import { uploadMediaFile } from '@/lib/upload-client';

const FOLDERS = ['Highlights', 'Haldi', 'Mehendi', 'Sangeet', 'Wedding', 'Reception', 'Pre-Wedding', 'Videos'];

interface Props {
  /** pre-fill event code (e.g. from an event card) */
  initialCode?: string;
  onUploaded?: (eventCode: string, count: number) => void;
}

export default function AdminMediaUploader({ initialCode = '', onUploaded }: Props) {
  const [eventCode, setEventCode] = useState(initialCode);
  const [folder, setFolder] = useState('Highlights');
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0, failed: 0 });
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const code = eventCode.toUpperCase().replace(/[^A-Z0-9_-]/g, '');
  const galleryUrl = typeof window !== 'undefined' && code ? `${window.location.origin}/gallery/${code}` : '';

  useEffect(() => {
    if (!galleryUrl) return;
    QRCode.toDataURL(galleryUrl, { width: 640, margin: 2, color: { dark: '#0f172a', light: '#ffffff' } })
      .then(setQr)
      .catch(() => setQr(null));
  }, [galleryUrl]);

  const startUpload = async () => {
    if (!code) return setMessage({ text: 'Pehle event code likhiye (e.g. RAHUL2026).', error: true });
    if (files.length === 0) return setMessage({ text: 'Photos ya videos chuniye.', error: true });

    setBusy(true);
    setMessage(null);
    let done = 0;
    let failed = 0;
    let lastError = '';
    setProgress({ done: 0, total: files.length, failed: 0 });

    for (const file of files) {
      const res = await uploadMediaFile(file, code, folder);
      if (res.ok) done++;
      else {
        failed++;
        lastError = res.error || '';
      }
      setProgress({ done: done + failed, total: files.length, failed });
    }

    setBusy(false);
    setFiles([]);
    if (fileInput.current) fileInput.current.value = '';
    if (done) onUploaded?.(code, done);
    setMessage(
      failed
        ? { text: `${done} upload hue, ${failed} fail hue. ${lastError}`, error: true }
        : { text: `${done} files upload ho gaye! Guests ab QR / code se dekh sakte hain.` }
    );
  };

  return (
    <div className="rounded-2xl border border-amber-500/40 bg-slate-900/80 p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-1">
        <Upload className="w-5 h-5 text-amber-400" />
        <h2 className="text-lg font-bold text-white">Photos / Videos Upload</h2>
      </div>
      <p className="text-xs text-slate-400 mb-5">
        Event code likhiye (naya ya purana), folder chuniye, files chuniye — bas. Guests isi code ya QR se gallery kholenge.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-semibold text-slate-300">Event Code</span>
              <input
                value={eventCode}
                onChange={(e) => setEventCode(e.target.value.toUpperCase())}
                placeholder="e.g. RAHUL2026"
                className="mt-1 w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-400 outline-none font-mono text-white uppercase"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-slate-300">Folder</span>
              <select
                value={folder}
                onChange={(e) => setFolder(e.target.value)}
                className="mt-1 w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-400 outline-none text-white"
              >
                {FOLDERS.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </label>
          </div>

          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            disabled={busy}
            className="w-full p-6 rounded-xl border-2 border-dashed border-slate-700 hover:border-amber-400 text-center transition cursor-pointer disabled:opacity-50"
          >
            <Upload className="w-7 h-7 text-amber-400 mx-auto mb-2" />
            <div className="text-sm font-semibold text-white">
              {files.length ? `${files.length} file(s) chuni gayi` : 'Photos / Videos chuniye'}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">JPG, PNG, WEBP, MP4, MOV — ek saath kai files</div>
          </button>
          <input
            ref={fileInput}
            type="file"
            multiple
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
          />

          {busy && (
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" /> Upload + face scan ho raha hai…
                </span>
                <span className="font-mono">
                  {progress.done}/{progress.total}
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all"
                  style={{ width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          )}

          {message && (
            <div
              className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                message.error
                  ? 'bg-rose-500/15 border border-rose-500/40 text-rose-300'
                  : 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
              }`}
            >
              {message.error ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
              <span>{message.text}</span>
            </div>
          )}

          <button
            onClick={startUpload}
            disabled={busy}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            <span>{busy ? 'Uploading…' : 'Upload Karein'}</span>
          </button>
        </div>

        {/* QR for guests */}
        <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 flex flex-col items-center text-center">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-3">
            <QrCode className="w-4 h-4" /> Guest QR Code
          </div>
          {qr && galleryUrl ? (
            <>
              <img src={qr} alt={`QR code for ${code}`} className="w-44 h-44 rounded-lg bg-white" />
              <div className="mt-2 font-mono text-sm font-bold text-white">{code}</div>
              <div className="mt-3 grid grid-cols-2 gap-2 w-full">
                <a
                  href={qr}
                  download={`${code}-gallery-qr.png`}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-semibold flex items-center justify-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> QR
                </a>
                <a
                  href={`/gallery/${code}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-semibold flex items-center justify-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Open
                </a>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(galleryUrl)}
                className="mt-2 w-full px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" /> Link Copy
              </button>
              <p className="mt-3 text-[10px] text-slate-500">
                QR print karke venue par lagaiye. Guest phone camera se scan karega to seedha gallery khulegi.
              </p>
            </>
          ) : (
            <p className="text-xs text-slate-500 py-10">Event code likhte hi QR yahan ban jaayega.</p>
          )}
        </div>
      </div>
    </div>
  );
}
