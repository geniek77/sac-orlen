(function () {
  let template = document.createElement("template");
  template.innerHTML = `
    <style>
      :host {
          display: inline-block;
          position: relative;
          width: 100px;
          height: 100px;
      }

 #progress-spinner {
      border-radius: 50%;
      height: 100px;
      width: 100px;
    }

	#middle-circle {
	  position: absolute;
	  top: 50%;
	  left: 50%;
	  transform: translate(-50%, -50%);
	  border-radius: 50%;
	  height: 80px;
	  width: 80px;
	  background-color: rgb(248, 248, 248);
	  display: flex;
	  align-items: center;
	  justify-content: center;
	  font-size: large;
	  font-weight: bold;
	}

    </style>
  <div
      style="
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
      "
    >
      <div id="middle-circle">10%</div>
      <div id="progress-spinner"></div>
    </div>
  `;
  class Widget extends HTMLElement {
    constructor() {
      super();
      let shadowRoot = this.attachShadow({
        mode: "open"
      });
      shadowRoot.appendChild(template.content.cloneNode(true));
      this._props = {};
	  this._intervalId = null;

	  this.addEventListener("click", () => {
	    this.dispatchEvent(new Event("onClick"));
	  });
    }
    async connectedCallback() {
      this.initMain();
    }

	async initMain() {
	  const progressBar = this.shadowRoot.querySelector("#progress-spinner");
	  const progressText = this.shadowRoot.querySelector("#middle-circle");
	  if (!progressBar || !progressText) return;

	  const barColor = this._props.barColor ?? "#03ff4f";
	  const emptyBarColor = this._props.emptyBarColor ?? "#ededed";

	  // Surowa wartość do wyświetlania (może być >100 albo ujemna)
	  let rawPercentage = Number(this._props.percentage ?? 75);
	  if (!Number.isFinite(rawPercentage)) rawPercentage = 75;

	  // Wypełnienie koła zawsze 0..100
	  const fillTarget = Math.max(0, Math.min(100, rawPercentage));

	  // Zatrzymaj poprzednią animację (jeśli initMain odpala się ponownie)
	  if (this._intervalId) {
	    clearInterval(this._intervalId);
	    this._intervalId = null;
	  }

	  // Stan startowy animacji
	  progressBar.style.background = `conic-gradient(${barColor} 0%, ${emptyBarColor} 0%)`;
	  progressText.innerText = `0%`;

	  // Stała długość animacji (ok. 1 sekunda)
	  const frames = 50; // 50 * 20ms = ~1000ms
	  let frame = 0;

	  this._intervalId = setInterval(() => {
	    frame++;
	    const t = Math.min(1, frame / frames);

	    // koło animuje się do fillTarget (0..100)
	    const fill = Math.round(fillTarget * t);

	    // liczba animuje się do rawPercentage (może być 120, -15 itd.)
	    const shown = Math.round(rawPercentage * t);

	    progressBar.style.background = `conic-gradient(${barColor} ${fill}%, ${emptyBarColor} ${fill}%)`;
	    progressText.innerText = `${shown}%`;

	    if (t >= 1) {
	      clearInterval(this._intervalId);
	      this._intervalId = null;

	      // dopnij finalne wartości
	      progressBar.style.background = `conic-gradient(${barColor} ${fillTarget}%, ${emptyBarColor} ${fillTarget}%)`;
	      progressText.innerText = `${rawPercentage}%`;
	    }
	  }, 20);
	}

	
    onCustomWidgetBeforeUpdate(changedProperties) {
      this._props = {
        ...this._props,
        ...changedProperties
      };
    }
    onCustomWidgetAfterUpdate(changedProperties) {
      this.initMain();
    }
  }
  customElements.define("com-orlen-sap-orlencircleprogressbarwidget", Widget);
})();