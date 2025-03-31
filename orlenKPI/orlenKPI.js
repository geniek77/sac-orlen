(function () {
  const template = document.createElement("template");
  template.innerHTML = `
  <style>
    :host {
      display: block;
      font-family: var(--font-family, Arial), sans-serif;
      min-width: 300px;
    }

    .kpi-container {
      border: 1px solid #ccc;
      padding: 10px;
      position: relative;
      background: white;
      box-sizing: border-box;
    }

    .kpi-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .edit-icon {
      position: absolute;
      top: 8px;
      right: 8px;
      font-size: 18px;
      cursor: pointer;
      color: #888;
      transition: transform 0.2s ease;
    }

    .edit-icon:hover {
      transform: scale(1.1);
    }

    .kpi-main {
      display: flex;
      align-items: flex-start;
      gap: 10px;
    }

    .kpi-bar {
      width: var(--bar-width, 20px);
      background: var(--bar-color, #006400);
      height: var(--bar-height, 80px);
      transition: all 0.5s ease;
    }

    .kpi-content {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }

    .kpi-value {
      font-size: var(--main-value-font-size, 28px);
      font-family: var(--main-value-font-family, Arial);
      font-weight: bold;
      margin-bottom: 8px;
      color: var(--font-color, #000000);
      transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .kpi-matrix {
      display: flex;
      flex-direction: column;
      gap: var(--row-gap, 5px);
      margin-top: 15px;
    }

    .kpi-line {
      display: grid;
      grid-template-columns: 30px 40px 90px 90px;
      align-items: center;
      padding: 6px 8px;
      transition: all 0.3s ease;
    }

    .arrow {
      text-align: center;
      font-size: var(--delta-font-size, 14px);
    }

    .arrow.up::before {
      content: "▲";
      color: var(--arrow-color-b, #006400);
    }

    .arrow.down::before {
      content: "▼";
      color: var(--arrow-color-rr, #a94442);
    }

    .label {
      font-family: var(--delta-font-family, Arial);
      font-size: var(--delta-font-size, 14px);
      font-style: italic;
    }

    .delta-val {
      font-weight: var(--delta-font-weight, bold);
      font-family: var(--delta-font-family, Arial);
      font-size: var(--delta-font-size, 14px);
      padding-left: 10px;
      transition: all 0.3s ease;
    }

    .delta-pct {
      font-family: var(--delta-font-family, Arial);
      font-size: var(--delta-font-size, 14px);
      padding-left: 10px;
      transition: all 0.3s ease;
    }

    .kpi-title {
      font-family: var(--title-font-family, Arial);
      font-size: var(--title-font-size, 16px);
      font-weight: bold;
      color: var(--font-color, #000000);
    }

    .delta-bg-up {
      background-color: var(--bg-up-color, #dff0d8);
      color: var(--text-color-b, #006400);
    }

    .delta-bg-down {
      background-color: var(--bg-down-color, #f2dede);
      color: var(--text-color-rr, #a94442);
    }

    @keyframes pulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.05); opacity: 0.8; }
      100% { transform: scale(1); opacity: 1; }
    }

    .value-change {
      animation: pulse 0.5s ease;
    }
  </style>
  <div id="root"></div>
`;

  class OrlenKPI extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this._root = this._shadowRoot.getElementById("root");
      this._props = this._getDefaultProperties();
      this._shouldAnimate = false;
      this._render();
      this._setupEventListeners();
    }

    _getDefaultProperties() {
      return {
        title: 'EBITDA LIFO',
        mainValue: '315,8',
        deltaB: '+198',
        deltaBPercent: '+168%',
        deltaRR: '-521',
        deltaRRPercent: '-254%',
        labelB: 'B',
        labelRR: 'R/R',
        arrowDirectionB: 'up',
        arrowDirectionRR: 'down',
        barColor: '#006400',
        fontColor: '#000000',
        bgUpColor: '#dff0d8',
        bgDownColor: '#f2dede',
        fontFamily: 'Arial',
        fontSize: '14px',
        titleFontFamily: 'Arial',
        titleFontSize: '16px',
        mainValueFontFamily: 'Arial',
        mainValueFontSize: '28px',
        deltaFontFamily: 'Arial',
        deltaFontSize: '14px',
        deltaFontWeight: 'bold',
        textColorB: '#006400',
        textColorRR: '#a94442',
        arrowColorB: '#006400',
        arrowColorRR: '#a94442'
      };
    }

    _setupEventListeners() {
      this._root.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-icon')) {
          e.stopPropagation();
          this.dispatchEvent(new CustomEvent('onEdit'));
        } else {
          this.dispatchEvent(new CustomEvent('onClick'));
        }
      });
    }

    _applyStyles() {
      const styleMap = {
        '--font-family': this._props.fontFamily,
        '--font-color': this._props.fontColor,
        '--bar-color': this._props.barColor,
        '--bg-up-color': this._props.bgUpColor,
        '--bg-down-color': this._props.bgDownColor,
        '--text-color-b': this._props.textColorB,
        '--text-color-rr': this._props.textColorRR,
        '--title-font-family': this._props.titleFontFamily,
        '--title-font-size': this._props.titleFontSize,
        '--main-value-font-family': this._props.mainValueFontFamily,
        '--main-value-font-size': this._props.mainValueFontSize,
        '--delta-font-family': this._props.deltaFontFamily,
        '--delta-font-size': this._props.deltaFontSize,
        '--delta-font-weight': this._props.deltaFontWeight,
        '--arrow-color-b': this._props.arrowColorB,
        '--arrow-color-rr': this._props.arrowColorRR
      };

      Object.entries(styleMap).forEach(([prop, value]) => {
        this._root.style.setProperty(prop, value);
      });
    }

    _render() {
      this._applyStyles();

      this._root.innerHTML = `
        <div class="kpi-container">
          <div class="kpi-header">
            <div class="kpi-title">${this._props.title}</div>
            <div class="edit-icon" title="Edytuj">✎</div>
          </div>
          <div class="kpi-main">
            <div class="kpi-bar"></div>
            <div class="kpi-content">
              <div class="kpi-value ${this._shouldAnimate ? 'value-change' : ''}">${this._props.mainValue}</div>
              <div class="kpi-matrix">
                <div class="kpi-line delta-bg-up">
                  <div class="arrow ${this._props.arrowDirectionB}"></div>
                  <div class="label">${this._props.labelB}</div>
                  <div class="delta-val ${this._shouldAnimate ? 'value-change' : ''}">${this._props.deltaB}</div>
                  <div class="delta-pct ${this._shouldAnimate ? 'value-change' : ''}">${this._props.deltaBPercent}</div>
                </div>
                <div class="kpi-line delta-bg-down">
                  <div class="arrow ${this._props.arrowDirectionRR}"></div>
                  <div class="label">${this._props.labelRR}</div>
                  <div class="delta-val ${this._shouldAnimate ? 'value-change' : ''}">${this._props.deltaRR}</div>
                  <div class="delta-pct ${this._shouldAnimate ? 'value-change' : ''}">${this._props.deltaRRPercent}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      if (this._shouldAnimate) {
        setTimeout(() => {
          const elements = this._root.querySelectorAll('.value-change');
          elements.forEach(el => el.classList.remove('value-change'));
          this._shouldAnimate = false;
        }, 500);
      }
    }

	onCustomWidgetBeforeUpdate(changedProps) {
	  // Metoda wywoływana przed aktualizacją właściwości
	  // Można tutaj dodać walidację lub przygotowanie danych
	  if (changedProps && Object.keys(changedProps).length > 0) {
	    console.log("Widget będzie zaktualizowany z nowymi właściwościami:", changedProps);
	  }
	}

	onCustomWidgetAfterUpdate(changedProps) {
	  this._props = { ...this._props, ...changedProps };
	  this._shouldAnimate = true;
	  this._render();
	}

    onCustomWidgetResize(width, height) {
      const scale = Math.min(width / 300, 1.5);
      this._root.style.setProperty('--title-font-size', `${Math.max(14, 16 * scale)}px`);
      this._root.style.setProperty('--main-value-font-size', `${Math.max(20, 28 * scale)}px`);
      this._root.style.setProperty('--delta-font-size', `${Math.max(12, 14 * scale)}px`);
      this._root.style.setProperty('--bar-width', `${Math.max(15, 20 * scale)}px`);
      this._root.style.setProperty('--bar-height', `${Math.max(60, 80 * scale)}px`);
    }

    getTitle() { return this._props.title; }
    getMainValue() { return this._props.mainValue; }
    getDeltaB() { return this._props.deltaB; }
    getDeltaBPercent() { return this._props.deltaBPercent; }
    getDeltaRR() { return this._props.deltaRR; }
    getDeltaRRPercent() { return this._props.deltaRRPercent; }
    getLabelB() { return this._props.labelB; }
    getLabelRR() { return this._props.labelRR; }
    getTextColorB() { return this._props.textColorB; }
    getTextColorRR() { return this._props.textColorRR; }
    getArrowColorB() { return this._props.arrowColorB; }
    getArrowColorRR() { return this._props.arrowColorRR; }
    getArrowDirectionB() { return this._props.arrowDirectionB; }
    getArrowDirectionRR() { return this._props.arrowDirectionRR; }
    getTitleFontFamily() { return this._props.titleFontFamily; }
    getTitleFontSize() { return this._props.titleFontSize; }
    getMainValueFontFamily() { return this._props.mainValueFontFamily; }
    getMainValueFontSize() { return this._props.mainValueFontSize; }
    getDeltaFontFamily() { return this._props.deltaFontFamily; }
    getDeltaFontSize() { return this._props.deltaFontSize; }
    getDeltaFontWeight() { return this._props.deltaFontWeight; }
    getBarColor() { return this._props.barColor; }
    getFontColor() { return this._props.fontColor; }
    getBgUpColor() { return this._props.bgUpColor; }
    getBgDownColor() { return this._props.bgDownColor; }
    getFontFamily() { return this._props.fontFamily; }
    getFontSize() { return this._props.fontSize; }

    setTitle(value) { this._props.title = value; this._render(); }
    setMainValue(value) { this._props.mainValue = value; this._shouldAnimate = true; this._render(); }
    setDeltaB(value) { this._props.deltaB = value; this._shouldAnimate = true; this._render(); }
    setDeltaBPercent(value) { this._props.deltaBPercent = value; this._shouldAnimate = true; this._render(); }
    setDeltaRR(value) { this._props.deltaRR = value; this._shouldAnimate = true; this._render(); }
    setDeltaRRPercent(value) { this._props.deltaRRPercent = value; this._shouldAnimate = true; this._render(); }
    setLabelB(value) { this._props.labelB = value; this._render(); }
    setLabelRR(value) { this._props.labelRR = value; this._render(); }
    setTextColorB(value) { this._props.textColorB = value; this._render(); }
    setTextColorRR(value) { this._props.textColorRR = value; this._render(); }
    setArrowColorB(value) { this._props.arrowColorB = value; this._render(); }
    setArrowColorRR(value) { this._props.arrowColorRR = value; this._render(); }
    setArrowDirectionB(value) { this._props.arrowDirectionB = value; this._render(); }
    setArrowDirectionRR(value) { this._props.arrowDirectionRR = value; this._render(); }
    setTitleFontFamily(value) { this._props.titleFontFamily = value; this._render(); }
    setTitleFontSize(value) { this._props.titleFontSize = value; this._render(); }
    setMainValueFontFamily(value) { this._props.mainValueFontFamily = value; this._render(); }
    setMainValueFontSize(value) { this._props.mainValueFontSize = value; this._render(); }
    setDeltaFontFamily(value) { this._props.deltaFontFamily = value; this._render(); }
    setDeltaFontSize(value) { this._props.deltaFontSize = value; this._render(); }
    setDeltaFontWeight(value) { this._props.deltaFontWeight = value; this._render(); }
    setBarColor(value) { this._props.barColor = value; this._render(); }
    setFontColor(value) { this._props.fontColor = value; this._render(); }
    setBgUpColor(value) { this._props.bgUpColor = value; this._render(); }
    setBgDownColor(value) { this._props.bgDownColor = value; this._render(); }
    setFontFamily(value) { this._props.fontFamily = value; this._render(); }
    setFontSize(value) { this._props.fontSize = value; this._render(); }
  }

  customElements.define("com-sap-analytics-custom-widget-orlenkpi", OrlenKPI);
})();