(function () {
  let template = document.createElement("template");
  template.innerHTML = `
    <style>
      :host {
        display: block;
        position: relative;
        width: 100%;
        height: 100%;
        box-sizing: border-box;

        /* sterowane z JS */
        --size: 100px;
      }

      #container {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      #progress-spinner {
        border-radius: 50%;
        width: var(--size);
        height: var(--size);
      }

      #middle-circle {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 50%;

        /* rozmiary ustawiane w JS jako inline style (pewniejsze niż same CSS var) */
        background-color: rgb(248, 248, 248);
        display: flex;
        align-items: center;
        justify-content: center;

        font-weight: bold;
        line-height: 1;
        user-select: none;
        pointer-events: none;
      }
    </style>

    <div id="container">
      <div id="middle-circle">0%</div>
      <div id="progress-spinner"></div>
    </div>
  `;

  class Widget extends HTMLElement {
    constructor() {
      super();
      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.appendChild(template.content.cloneNode(true));

      this._props = {};
      this._intervalId = null;

      this._resizeObserver = null;
      this._rafId = null;
      this._lastW = 0;
      this._lastH = 0;

      // Emit SAC event declared in manifest ("events": { "onClick": ... })
      this.addEventListener("click", () => {
        this.dispatchEvent(new Event("onClick"));
      });
    }

    // --- getters/setters used by manifest methods (simple JSON bodies) ---
    set percentage(v) {
      const n = Number(v);
      this._props = { ...this._props, percentage: Number.isFinite(n) ? n : 75 };
      if (this.isConnected) this.initMain();
    }
    get percentage() {
      return this._props && this._props.percentage;
    }

    set barColor(v) {
      this._props = { ...this._props, barColor: v };
      if (this.isConnected) this.initMain();
    }
    get barColor() {
      return this._props && this._props.barColor;
    }

    set emptyBarColor(v) {
      this._props = { ...this._props, emptyBarColor: v };
      if (this.isConnected) this.initMain();
    }
    get emptyBarColor() {
      return this._props && this._props.emptyBarColor;
    }

    _applySize(width, height) {
      const progressBar = this.shadowRoot.querySelector("#progress-spinner");
      const progressText = this.shadowRoot.querySelector("#middle-circle");
      if (!progressBar || !progressText) return;

      let w = Number(width);
      let h = Number(height);

      // fallback: bierz z bounding rect (łapie też zmiany przez transform/layout)
      if (!Number.isFinite(w) || w <= 0 || !Number.isFinite(h) || h <= 0) {
        const r = this.getBoundingClientRect();
        w = r.width;
        h = r.height;
      }

      if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) return;

      const size = Math.max(24, Math.floor(Math.min(w, h)));
      const inner = Math.max(18, Math.floor(size * 0.8));
      const fontPx = Math.max(10, Math.floor(size * 0.22));

      // CSS var (dla progress-spinner)
      this.style.setProperty("--size", `${size}px`);

      // Inline (pewniej niż tylko var)
      progressBar.style.width = `${size}px`;
      progressBar.style.height = `${size}px`;

      progressText.style.width = `${inner}px`;
      progressText.style.height = `${inner}px`;
      progressText.style.fontSize = `${fontPx}px`;
    }

    // ✅ SAC resize callback (najbardziej “oficjalny”)
    onCustomWidgetResize(width, height) {
      // UWAGA: nie restartujemy animacji, tylko rozmiar
      this._applySize(width, height);
    }

    _startSizeMonitor() {
      if (this._rafId) return;

      let lastTs = 0;
      const tick = (ts) => {
        // throttle ~200ms
        if (ts - lastTs >= 200) {
          lastTs = ts;
          const r = this.getBoundingClientRect();
          const w = Math.round(r.width);
          const h = Math.round(r.height);

          if (w !== this._lastW || h !== this._lastH) {
            this._lastW = w;
            this._lastH = h;
            this._applySize(w, h);
          }
        }
        this._rafId = requestAnimationFrame(tick);
      };

      this._rafId = requestAnimationFrame(tick);
    }

    _stopSizeMonitor() {
      if (this._rafId) {
        cancelAnimationFrame(this._rafId);
        this._rafId = null;
      }
    }

    connectedCallback() {
      // Fallback observer (czasem działa, czasem nie — ale nie przeszkadza)
      if (!this._resizeObserver) {
        this._resizeObserver = new ResizeObserver((entries) => {
          const cr = entries?.[0]?.contentRect;
          if (cr) this._applySize(cr.width, cr.height);
        });
      }
      this._resizeObserver.observe(this);

      // Najpewniejszy fallback na “dziwne” resize’y w SAC
      this._startSizeMonitor();

      // Startowo ustaw rozmiar i narysuj
      this._applySize(this.clientWidth, this.clientHeight);
      this.initMain();
    }

    disconnectedCallback() {
      if (this._resizeObserver) this._resizeObserver.disconnect();
      this._stopSizeMonitor();

      if (this._intervalId) {
        clearInterval(this._intervalId);
        this._intervalId = null;
      }
    }

    initMain() {
      const progressBar = this.shadowRoot.querySelector("#progress-spinner");
      const progressText = this.shadowRoot.querySelector("#middle-circle");
      if (!progressBar || !progressText) return;

      const barColor =
        this._props && this._props.barColor != null ? this._props.barColor : "#03ff4f";
      const emptyBarColor =
        this._props && this._props.emptyBarColor != null ? this._props.emptyBarColor : "#ededed";

      let rawPercentage =
        this._props && this._props.percentage != null ? Number(this._props.percentage) : 75;
      if (!Number.isFinite(rawPercentage)) rawPercentage = 75;

      const fillTarget = Math.max(0, Math.min(100, rawPercentage));

      if (this._intervalId) {
        clearInterval(this._intervalId);
        this._intervalId = null;
      }

      // Jeśli rozmiar nie był jeszcze ustawiony, ustaw z rect
      this._applySize(this.clientWidth, this.clientHeight);

      progressBar.style.background = `conic-gradient(${barColor} 0%, ${emptyBarColor} 0%)`;
      progressText.innerText = "0%";

      const frames = 50;
      let frame = 0;

      this._intervalId = setInterval(() => {
        frame++;
        const t = Math.min(1, frame / frames);

        const fill = Math.round(fillTarget * t);
        const shown = Math.round(rawPercentage * t);

        progressBar.style.background = `conic-gradient(${barColor} ${fill}%, ${emptyBarColor} ${fill}%)`;
        progressText.innerText = `${shown}%`;

        if (t >= 1) {
          clearInterval(this._intervalId);
          this._intervalId = null;

          progressBar.style.background = `conic-gradient(${barColor} ${fillTarget}%, ${emptyBarColor} ${fillTarget}%)`;
          progressText.innerText = `${rawPercentage}%`;
        }
      }, 20);
    }

    onCustomWidgetBeforeUpdate(changedProperties) {
      this._props = { ...this._props, ...changedProperties };
    }

    onCustomWidgetAfterUpdate() {
      this.initMain();
    }
  }

  customElements.define("com-orlen-sap-orlencircleprogressbarwidget", Widget);
})();
