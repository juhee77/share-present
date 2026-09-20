// Web Audio API based Sound Synthesizer for SharePresent Luxury Interaction Effects
// Provides zero-asset, instant, tactile sound synthesis for unboxing, wax seal breaks, and celebrations.

class SoundEffects {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;

  constructor() {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sharepresent_sound_enabled");
      this.soundEnabled = saved !== null ? saved === "true" : true;
    }
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public toggleSound(): boolean {
    this.soundEnabled = !this.soundEnabled;
    if (typeof window !== "undefined") {
      localStorage.setItem("sharepresent_sound_enabled", String(this.soundEnabled));
    }
    return this.soundEnabled;
  }

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Wax Seal Crack & Paper Rustle Sound
   * Synthesizes a crisp, textured tactile seal break and paper slide.
   */
  public playWaxSealBreak() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Tactile Crack (Noise buffer filtered)
    const bufferSize = ctx.sampleRate * 0.12;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.02));
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1400, now);
    filter.Q.setValueAtTime(3, now);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.28, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    whiteNoise.start(now);

    // 2. Resonant warm wooden/wax snap tone
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);

    oscGain.gain.setValueAtTime(0.35, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  /**
   * Luxury Harmonic Chime Chord
   * Plays a warm, soothing C-maj9 resonant bell chime.
   */
  public playLuxuryChime() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Frequencies for C5, E5, G5, B5, D6
    const freqs = [523.25, 659.25, 783.99, 987.77, 1174.66];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.12 / (idx + 1), now + idx * 0.04 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 1.3);
    });
  }

  /**
   * Champagne Pop & Celebration Confetti Shimmer
   */
  public playCelebrationPop() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Pop oscillator
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.08);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);

    // Sparkle shimmer
    const sparkleNotes = [1046.5, 1318.5, 1567.98, 2093.0];
    sparkleNotes.forEach((freq, i) => {
      const sparkle = ctx.createOscillator();
      const sparkleGain = ctx.createGain();

      sparkle.type = "triangle";
      sparkle.frequency.setValueAtTime(freq, now + 0.06 + i * 0.05);

      sparkleGain.gain.setValueAtTime(0.001, now);
      sparkleGain.gain.exponentialRampToValueAtTime(0.1, now + 0.06 + i * 0.05 + 0.01);
      sparkleGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06 + i * 0.05 + 0.6);

      sparkle.connect(sparkleGain);
      sparkleGain.connect(ctx.destination);

      sparkle.start(now + 0.06 + i * 0.05);
      sparkle.stop(now + 0.06 + i * 0.05 + 0.7);
    });
  }

  /**
   * Crisp UI Success Click / Copy Tick
   */
  public playSuccessTick() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.05);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }
}

export const soundFx = new SoundEffects();
