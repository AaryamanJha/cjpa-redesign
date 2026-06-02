"use client"

import { useState, useRef, useCallback } from "react"
import {
  Upload, Download, FileVideo, FileAudio, FileImage, FileText,
  X, Loader2, CheckCircle2, AlertCircle, Info,
} from "lucide-react"
import { Topbar } from "@/components/portal/Topbar"
import { cn } from "@/lib/utils"

// ─── types ────────────────────────────────────────────────────────────────────

type FileCategory = "image" | "video" | "audio" | "pdf" | "unsupported"

interface CompressedResult {
  blob: Blob
  name: string
  originalSize: number
  compressedSize: number
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function getCategory(file: File): FileCategory {
  const type = file.type.toLowerCase()
  if (type.startsWith("image/")) return "image"
  if (type.startsWith("video/")) return "video"
  if (type.startsWith("audio/")) return "audio"
  if (type === "application/pdf") return "pdf"
  return "unsupported"
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function reductionPct(original: number, compressed: number): number {
  return Math.round(((original - compressed) / original) * 100)
}

function toBlobPart(data: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(data.byteLength)
  new Uint8Array(buffer).set(data)
  return buffer
}

function CategoryIcon({ category, size = 20 }: { category: FileCategory; size?: number }) {
  const cls = "shrink-0"
  if (category === "image") return <FileImage size={size} className={cls} />
  if (category === "video") return <FileVideo size={size} className={cls} />
  if (category === "audio") return <FileAudio size={size} className={cls} />
  return <FileText size={size} className={cls} />
}

// ─── quality presets ──────────────────────────────────────────────────────────

const IMAGE_PRESETS = [
  { label: "High",   maxSizeMB: 2.0,  maxPx: 1920, value: 80 },
  { label: "Medium", maxSizeMB: 0.8,  maxPx: 1280, value: 50 },
  { label: "Low",    maxSizeMB: 0.25, maxPx: 800,  value: 20 },
]

const VIDEO_PRESETS = [
  { label: "High",   crf: "22", audioBitrate: "192k" },
  { label: "Medium", crf: "28", audioBitrate: "128k" },
  { label: "Low",    crf: "36", audioBitrate: "96k"  },
]

const AUDIO_PRESETS = [
  { label: "High",   bitrate: "192" },
  { label: "Medium", bitrate: "128" },
  { label: "Low",    bitrate: "64"  },
]

// ─── ffmpeg singleton ─────────────────────────────────────────────────────────

type FFmpegInstance = {
  load: (opts: object) => Promise<void>
  exec: (args: string[]) => Promise<void>
  writeFile: (name: string, data: Uint8Array) => Promise<void>
  readFile: (name: string) => Promise<Uint8Array | string>
  deleteFile: (name: string) => Promise<void>
  on: (event: string, cb: (evt: { ratio?: number; message?: string }) => void) => void
}

let ffmpegCache: FFmpegInstance | null = null

async function getFFmpeg(
  onProgress: (p: number) => void,
  onStatus: (s: string) => void
): Promise<FFmpegInstance> {
  if (ffmpegCache) return ffmpegCache

  onStatus("Loading compression engine… (first use ~5s)")

  const { FFmpeg } = await import("@ffmpeg/ffmpeg")
  const { toBlobURL } = await import("@ffmpeg/util")

  const ffmpeg = new FFmpeg() as unknown as FFmpegInstance
  ffmpeg.on("progress", ({ ratio }) => {
    if (ratio !== undefined) onProgress(Math.min(99, Math.round(ratio * 100)))
  })
  ffmpeg.on("log", ({ message }) => {
    if (message) onStatus(message.slice(0, 80))
  })

  const base = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd"
  await ffmpeg.load({
    coreURL:  await toBlobURL(`${base}/ffmpeg-core.js`,   "text/javascript"),
    wasmURL:  await toBlobURL(`${base}/ffmpeg-core.wasm`, "application/wasm"),
  })

  ffmpegCache = ffmpeg
  return ffmpeg
}

// ─── compression functions ────────────────────────────────────────────────────

async function compressImage(
  file: File,
  presetIdx: number,
  onProgress: (p: number) => void
): Promise<Blob> {
  const preset = IMAGE_PRESETS[presetIdx]
  const { default: imageCompression } = await import("browser-image-compression")
  const result = await imageCompression(file, {
    maxSizeMB:        preset.maxSizeMB,
    maxWidthOrHeight: preset.maxPx,
    useWebWorker:     true,
    onProgress,
  })
  return result
}

async function compressVideo(
  file: File,
  presetIdx: number,
  onProgress: (p: number) => void,
  onStatus: (s: string) => void
): Promise<Blob> {
  const preset = VIDEO_PRESETS[presetIdx]
  const ffmpeg = await getFFmpeg(onProgress, onStatus)
  const { fetchFile } = await import("@ffmpeg/util")

  const inName  = "input"  + file.name.slice(file.name.lastIndexOf("."))
  const outName = "output.mp4"

  onStatus("Writing file…")
  await ffmpeg.writeFile(inName, await fetchFile(file))

  onStatus("Compressing video…")
  await ffmpeg.exec([
    "-i", inName,
    "-vcodec", "libx264",
    "-crf", preset.crf,
    "-preset", "fast",
    "-acodec", "aac",
    "-b:a", preset.audioBitrate,
    "-movflags", "+faststart",
    outName,
  ])

  const data = await ffmpeg.readFile(outName) as Uint8Array
  await ffmpeg.deleteFile(inName)
  await ffmpeg.deleteFile(outName)

  return new Blob([toBlobPart(data)], { type: "video/mp4" })
}

async function compressAudio(
  file: File,
  presetIdx: number,
  onProgress: (p: number) => void,
  onStatus: (s: string) => void
): Promise<Blob> {
  const preset = AUDIO_PRESETS[presetIdx]
  const ffmpeg = await getFFmpeg(onProgress, onStatus)
  const { fetchFile } = await import("@ffmpeg/util")

  const inName  = "input"  + file.name.slice(file.name.lastIndexOf("."))
  const outName = "output.mp3"

  onStatus("Writing file…")
  await ffmpeg.writeFile(inName, await fetchFile(file))

  onStatus("Compressing audio…")
  await ffmpeg.exec(["-i", inName, "-b:a", `${preset.bitrate}k`, outName])

  const data = await ffmpeg.readFile(outName) as Uint8Array
  await ffmpeg.deleteFile(inName)
  await ffmpeg.deleteFile(outName)

  return new Blob([toBlobPart(data)], { type: "audio/mpeg" })
}

// PDF compression not supported client-side without a native binary.
// The compress button is hidden for PDFs; users see a redirect note instead.

// ─── component ────────────────────────────────────────────────────────────────

export default function FileResizerPage() {
  const [file, setFile]               = useState<File | null>(null)
  const [category, setCategory]       = useState<FileCategory>("unsupported")
  const [preset, setPreset]           = useState(1)
  const [status, setStatus]           = useState("")
  const [progress, setProgress]       = useState(0)
  const [compressing, setCompressing] = useState(false)
  const [result, setResult]           = useState<CompressedResult | null>(null)
  const [error, setError]             = useState("")
  const [dragging, setDragging]       = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(f: File) {
    setFile(f)
    setCategory(getCategory(f))
    setResult(null)
    setError("")
    setProgress(0)
    setStatus("")
    setPreset(1)
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }, [])

  async function compress() {
    if (!file) return
    setCompressing(true)
    setError("")
    setProgress(0)
    setStatus("Starting…")
    setResult(null)

    try {
      let compressed: Blob

      if (category === "image") {
        compressed = await compressImage(file, preset, setProgress)
      } else if (category === "video") {
        compressed = await compressVideo(file, preset, setProgress, setStatus)
      } else if (category === "audio") {
        compressed = await compressAudio(file, preset, setProgress, setStatus)
      } else {
        throw new Error("Unsupported file type.")
      }

      const ext   = category === "video" ? ".mp4" : category === "audio" ? ".mp3" : ""
      const stem  = file.name.replace(/\.[^.]+$/, "")
      const outName = ext ? `${stem}-compressed${ext}` : `${stem}-compressed${file.name.slice(file.name.lastIndexOf("."))}`

      setResult({
        blob:           compressed,
        name:           outName,
        originalSize:   file.size,
        compressedSize: compressed.size,
      })
      setProgress(100)
      setStatus("Done")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Compression failed.")
    } finally {
      setCompressing(false)
    }
  }

  function download() {
    if (!result) return
    const url = URL.createObjectURL(result.blob)
    const a = document.createElement("a")
    a.href = url
    a.download = result.name
    a.click()
    URL.revokeObjectURL(url)
  }

  function reset() {
    setFile(null)
    setResult(null)
    setError("")
    setStatus("")
    setProgress(0)
    setCompressing(false)
  }

  const PRESETS = category === "image" ? IMAGE_PRESETS : category === "video" ? VIDEO_PRESETS : AUDIO_PRESETS

  return (
    <>
      <Topbar title="File Resizer" subtitle="Compress images, video, audio, and PDFs client-side" />
      <div className="flex-1 overflow-y-auto p-7">
        <div className="max-w-2xl space-y-6">

          {/* Info banner */}
          <div className="flex items-start gap-2.5 border border-[#C8A96A]/12 bg-[#C8A96A]/04 rounded-sm px-4 py-3">
            <Info size={13} strokeWidth={1.5} className="text-[#C8A96A]/60 shrink-0 mt-0.5" />
            <p className="font-sans text-[#A8B0C0]/60 leading-relaxed" style={{ fontSize: "12px" }}>
              All compression runs in your browser — no files are uploaded to any server.
              Supports <span className="text-[#A8B0C0]/80">images</span> (jpg, png, gif, webp),{" "}
              <span className="text-[#A8B0C0]/80">video</span> (mp4, mov, webm),{" "}
              <span className="text-[#A8B0C0]/80">audio</span> (mp3, wav, ogg), and{" "}
              <span className="text-[#A8B0C0]/80">PDF</span>.
            </p>
          </div>

          {/* Drop zone */}
          {!file && (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-sm flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors",
                "py-16 px-8 text-center",
                dragging
                  ? "border-[#C8A96A]/60 bg-[#C8A96A]/06"
                  : "border-[rgba(200,169,106,0.18)] bg-[#080E19] hover:border-[#C8A96A]/35 hover:bg-[#C8A96A]/04"
              )}
            >
              <div className="w-12 h-12 rounded-sm bg-[#C8A96A]/10 border border-[#C8A96A]/20 flex items-center justify-center">
                <Upload size={20} strokeWidth={1.5} className="text-[#C8A96A]/80" />
              </div>
              <div>
                <p className="font-sans font-medium text-[#F5F1E8]" style={{ fontSize: "14px" }}>
                  Drop a file here, or click to browse
                </p>
                <p className="mt-1 font-sans text-[#A8B0C0]/50" style={{ fontSize: "12px" }}>
                  Images · Video · Audio · PDF
                </p>
              </div>
              <input
                ref={inputRef}
                type="file"
                accept="image/*,video/*,audio/*,application/pdf"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
              />
            </div>
          )}

          {/* File card */}
          {file && !result && (
            <div className="border border-[rgba(200,169,106,0.14)] bg-[#0D1520] rounded-sm p-5 space-y-5">
              {/* File header */}
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-9 h-9 rounded-sm border flex items-center justify-center shrink-0",
                  category === "image" ? "bg-blue-900/20 border-blue-700/25 text-blue-400"
                  : category === "video" ? "bg-purple-900/20 border-purple-700/25 text-purple-400"
                  : category === "audio" ? "bg-emerald-900/20 border-emerald-700/25 text-emerald-400"
                  : category === "pdf" ? "bg-orange-900/20 border-orange-700/25 text-orange-400"
                  : "bg-[#101827] border-[#C8A96A]/15 text-[#A8B0C0]"
                )}>
                  <CategoryIcon category={category} size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans font-medium text-[#F5F1E8] truncate" style={{ fontSize: "13px" }}>
                    {file.name}
                  </p>
                  <p className="font-sans text-[#A8B0C0]/50" style={{ fontSize: "12px" }}>
                    {formatBytes(file.size)}
                    {category === "unsupported" && (
                      <span className="ml-2 text-red-400/70">· Unsupported format</span>
                    )}
                  </p>
                </div>
                <button
                  onClick={reset}
                  className="text-[#A8B0C0]/30 hover:text-[#A8B0C0] transition-colors"
                >
                  <X size={15} strokeWidth={1.5} />
                </button>
              </div>

              {category !== "unsupported" && category !== "pdf" && (
                <>
                  <div className="h-px bg-[rgba(200,169,106,0.08)]" />
                  <div className="space-y-2">
                    <p className="font-sans text-[#A8B0C0]/60 uppercase font-medium tracking-widest" style={{ fontSize: "10px" }}>
                      Quality
                    </p>
                    <div className="flex gap-2">
                      {PRESETS.map((p, i) => (
                        <button
                          key={p.label}
                          onClick={() => setPreset(i)}
                          className={cn(
                            "flex-1 py-2 rounded-sm font-sans font-medium transition-colors border text-center cursor-pointer",
                            preset === i
                              ? "bg-[#C8A96A]/12 border-[#C8A96A]/30 text-[#C8A96A]"
                              : "bg-[#101827] border-[rgba(200,169,106,0.12)] text-[#A8B0C0] hover:text-[#F5F1E8] hover:border-[rgba(200,169,106,0.22)]"
                          )}
                          style={{ fontSize: "12px" }}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] text-[#A8B0C0]/30 font-sans">
                      {category === "image" && `Max ${IMAGE_PRESETS[preset].maxSizeMB} MB, ${IMAGE_PRESETS[preset].maxPx}px`}
                      {category === "video" && `CRF ${VIDEO_PRESETS[preset].crf}, audio ${VIDEO_PRESETS[preset].audioBitrate}`}
                      {category === "audio" && `${AUDIO_PRESETS[preset].bitrate} kbps MP3`}
                    </p>
                  </div>
                </>
              )}

              {category === "pdf" && (
                <div className="space-y-3">
                  <div className="flex items-start gap-2 text-[#A8B0C0]/50 text-[12px] font-sans border border-[#C8A96A]/12 bg-[#C8A96A]/04 rounded-sm px-3 py-3">
                    <Info size={12} strokeWidth={1.5} className="text-[#C8A96A]/50 shrink-0 mt-0.5" />
                    <span>PDF compression requires server-side processing not available here. Use <strong className="text-[#A8B0C0]/70">Smallpdf</strong>, <strong className="text-[#A8B0C0]/70">ilovepdf.com</strong>, or Adobe Acrobat to compress PDFs.</span>
                  </div>
                  <a
                    href="https://smallpdf.com/compress-pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full border border-[rgba(200,169,106,0.20)] bg-[#101827] text-[#A8B0C0] hover:text-[#F5F1E8] hover:border-[rgba(200,169,106,0.35)] font-sans rounded-sm py-3 transition-colors"
                    style={{ fontSize: "13px" }}
                  >
                    Open Smallpdf →
                  </a>
                </div>
              )}

              {/* Progress */}
              {compressing && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-sans text-[#A8B0C0]/60 truncate max-w-xs" style={{ fontSize: "12px" }}>{status}</p>
                    <p className="font-sans text-[#A8B0C0]/50 tabular-nums" style={{ fontSize: "12px" }}>{progress}%</p>
                  </div>
                  <div className="h-1 bg-[#101827] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#C8A96A] transition-all duration-300 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 text-red-400/80 font-sans" style={{ fontSize: "13px" }}>
                  <AlertCircle size={13} strokeWidth={1.5} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {category !== "unsupported" && category !== "pdf" && (
                <button
                  onClick={compress}
                  disabled={compressing}
                  className="flex items-center justify-center gap-2 w-full bg-[#C8A96A] hover:bg-[#D4BB82] text-[#070B14] font-sans font-semibold rounded-sm py-3 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ fontSize: "13px" }}
                >
                  {compressing ? (
                    <><Loader2 size={14} className="animate-spin" /> Compressing…</>
                  ) : (
                    <>Compress File</>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Result card */}
          {result && (
            <div className="border border-emerald-700/20 bg-emerald-900/08 rounded-sm p-5 space-y-5">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={16} strokeWidth={1.5} className="text-emerald-400 shrink-0" />
                <h3 className="font-sans font-semibold text-[#F5F1E8]" style={{ fontSize: "14px" }}>
                  Compression Complete
                </h3>
              </div>

              {/* Size stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Original",    value: formatBytes(result.originalSize),   dim: false },
                  { label: "Compressed",  value: formatBytes(result.compressedSize), dim: false },
                  { label: "Reduction",   value: `${reductionPct(result.originalSize, result.compressedSize)}%`, dim: false },
                ].map(stat => (
                  <div key={stat.label} className="bg-[#080E19] border border-[rgba(200,169,106,0.10)] rounded-sm p-3 text-center">
                    <p className="font-sans font-semibold text-[#F5F1E8]" style={{ fontSize: "16px" }}>{stat.value}</p>
                    <p className="mt-0.5 font-sans text-[#A8B0C0]/50 uppercase tracking-widest" style={{ fontSize: "9px" }}>{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={download}
                  className="flex items-center gap-2 bg-[#C8A96A] hover:bg-[#D4BB82] text-[#070B14] font-sans font-semibold rounded-sm px-5 py-3 transition-colors"
                  style={{ fontSize: "13px" }}
                >
                  <Download size={14} strokeWidth={2} />
                  Download {result.name.slice(result.name.lastIndexOf(".")).toUpperCase()}
                </button>
                <button
                  onClick={reset}
                  className="text-[#A8B0C0]/50 hover:text-[#A8B0C0] font-sans transition-colors"
                  style={{ fontSize: "13px" }}
                >
                  Compress another
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}
