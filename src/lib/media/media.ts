import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";

const MAX_FILE_BYTES = 25 * 1024 * 1024;
const MAX_VIDEO_SECONDS = 30;

export function validateMedia(file: File) {
  if (file.size <= 0) throw new Error("EMPTY_FILE");
  if (file.size > MAX_FILE_BYTES) throw new Error("FILE_TOO_LARGE");
  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");
  if (!isImage && !isVideo) throw new Error("UNSUPPORTED_MEDIA_TYPE");
  return isVideo ? "VIDEO" : "IMAGE";
}

export async function imageFileToDataUrl(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  return `data:${file.type};base64,${buffer.toString("base64")}`;
}

function run(command: string, args: string[]) {
  return new Promise<string>((resolve, reject) => {
    const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (d) => (stdout += d.toString()));
    child.stderr.on("data", (d) => (stderr += d.toString()));
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve(stdout);
      else reject(new Error(`${command} failed: ${stderr}`));
    });
  });
}

export async function extractVideoFrames(file: File) {
  const dir = await mkdtemp(join(tmpdir(), "dog-mind-"));
  const inputPath = join(dir, "input-video");
  try {
    await writeFile(inputPath, Buffer.from(await file.arrayBuffer()));

    const durationText = await run("ffprobe", [
      "-v", "error",
      "-show_entries", "format=duration",
      "-of", "default=noprint_wrappers=1:nokey=1",
      inputPath,
    ]);
    const duration = Number(durationText.trim());
    if (!Number.isFinite(duration)) throw new Error("VIDEO_DURATION_UNKNOWN");
    if (duration > MAX_VIDEO_SECONDS + 0.2) throw new Error("VIDEO_TOO_LONG");

    const framePattern = join(dir, "frame-%02d.jpg");
    const fps = Math.max(1 / 4, 8 / Math.max(duration, 1));
    await run("ffmpeg", [
      "-hide_banner", "-loglevel", "error", "-i", inputPath,
      "-vf", `fps=${fps},scale='min(1280,iw)':-2`,
      "-frames:v", "8",
      "-q:v", "3",
      framePattern,
    ]);

    const frames: string[] = [];
    for (let i = 1; i <= 8; i++) {
      try {
        const data = await readFile(join(dir, `frame-${String(i).padStart(2, "0")}.jpg`));
        frames.push(`data:image/jpeg;base64,${data.toString("base64")}`);
      } catch {
        break;
      }
    }
    if (frames.length === 0) throw new Error("NO_VIDEO_FRAMES");
    return frames;
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
