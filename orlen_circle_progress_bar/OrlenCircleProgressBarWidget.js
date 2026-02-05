(function () {
  let template = document.createElement("template");
  template.innerHTML = `
    <style>
      :host {
        display: block;
        width: 100%;
        height: 100%;
        position: relative;
        box-sizing: border-box;

        /* Domyślne wartości (nadpisywane przez ResizeObserver) */
        --size: 100px;
        --inner: calc(var(--size) * 0.8);
        --font: calc(var(--size) * 0.22);

        min-width: 24px;
        min-height: 24px;
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

        width: var(--inner);
        height: var(--inner);

        background-color: rgb(248, 248, 248);
        display: flex;
        align-items: center;
        justify-content: center;

        font-size: var(--font);
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

    _updateSize() {
      const rect = this.getBoundingClientRect();
      const w = rect.width || 0;
      const h = rect.height || 0;

      // Jeśli SAC chwilowo raportuje 0 wysokości, fallback na width
      const base = Math.min(w || 0, h || w || 0) || 100;

      // Minimalny sensowny rozmiar
      const size = Math.max(24, Math.floor(base));

      // Zmienna CSS steruje rozmiarem kółka/wnętrza/fontu
      this.style.setProperty("--size", `${size}px`);
    }

    async connectedCallback() {
      if (!this._resizeObserver) {
        this._resizeObserver = new ResizeObserver(() => {
          // Przy resize nie restartujemy animacji — tylko zmieniamy rozmiar
          this._updateSize();
        });
      }

      this._resizeObserver.observe(this);

      this._updateSize();
      this.initMain();
    }

    disconnectedCallback() {
      if (this._resizeObserver) {
        this._resizeObserver.disconnect();
      }
      if (this._intervalId) {
        clearInterval(this._intervalId);
        this._intervalId = null;
      }
    }

    async initMain() {
      const progressBar = this.shadowRoot.querySelector("#progress-spinner");
      const progressText = this.shadowRoot.querySelector("#middle-circle");
      if (!progressBar || !progressText) return;

      const barColor =
        this._props && this._props.barColor != null ? this._props.barColor : "#03ff4f";
      const emptyBarColor =
        this._props && this._props.emptyBarColor != null ? this._props.emptyBarColor : "#ededed";

      // Raw value shown as text (can be >100 or negative)
      let rawPercentage =
        this._props && this._props.percentage != null ? Number(this._props.percentage) : 75;
      if (!Number.isFinite(rawPercentage)) rawPercentage = 75;

      // Fill for the ring is clamped to 0..100
      const fillTarget = Math.max(0, Math.min(100, rawPercentage));

      // Stop previous animation (if any)
      if (this._intervalId) {
        clearInterval(this._intervalId);
        this._intervalId = null;
      }

      // Start state
      progressBar.style.background = `conic-gradient(${barColor} 0%, ${emptyBarColor} 0%)`;
      progressText.innerText = "0%";

      // Fixed-duration animation (~1s)
      const frames = 50; // 50 * 20ms = ~1000ms
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

          // Ensure final values are exact
          progressBar.style.background = `conic-gradient(${barColor} ${fillTarget}%, ${emptyBarColor} ${fillTarget}%)`;
          progressText.innerText = `${rawPercentage}%`;
        }
      }, 20);
    }

    onCustomWidgetBeforeUpdate(changedProperties) {
      this._props = {
        ...this._props,
        ...changedProperties,
      };
    }

    onCustomWidgetAfterUpdate(changedProperties) {
      this.initMain();
    }
  }

  customElements.define("com-orlen-sap-orlencircleprogressbarwidget", Widget);
})();
