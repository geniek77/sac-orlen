(function () {
  const template = document.createElement("template");
  template.innerHTML = `
  <style>
    :host {
      display: block;
      font-family: var(--font-family, "'72'"), sans-serif;
      min-width: 300px;
    }
 
	.kpi-container {
	  padding: 20px;
	  position: relative;
	  background: transparent;
	  box-sizing: border-box;
	  max-width: 100%;
	  overflow: hidden;
	  border: var(--kpi-border, 0px solid #ccc);
	  cursor: pointer;
	  transition: border 0.3s ease;
	}
 
    .kpi-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      margin-top: 10px;
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
      background-color: var(--bar-color, #006400);
      height: calc(var(--bar-height, 80px));
      transition: background-color 0.5s ease, opacity 0.5s ease;
      opacity: 1;
    }
 
    .kpi-content {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }
 
    .kpi-value {
      font-size: var(--main-value-font-size, 28px);
      font-family: var(--main-value-font-family, "'72'");
      font-weight: var(--main-value-font-weight, bold);
      margin-bottom: 8px;
      color: var(--font-color, #000000);
      transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
 
    .kpi-matrix {
      display: flex;
      flex-direction: column;
      gap: var(--row-gap, 5px);
      margin-top: 30px;
      position: relative;
      top: 10px;
    }
 
	.kpi-line {
	  display: grid;
	  grid-template-columns: auto 1fr 1fr 1fr;
	  gap: 8px;
      align-items: center;
      transition: all 0.3s ease;
    }
 
    .delta-b {
      font-family: var(--delta-b-font-family, "'72'");
      font-size: var(--delta-b-font-size, 14px);
      font-weight: var(--delta-b-font-weight, bold);
      background-color: var(--delta-b-bg-color, #dff0d8);
      color: var(--delta-b-text-color, #006400);
      padding: var(--delta-b-padding, 6px 8px);
      border-radius: var(--delta-b-border-radius, 4px);
    }
 
    .delta-rr {
      font-family: var(--delta-rr-font-family, "'72'");
      font-size: var(--delta-rr-font-size, 14px);
      font-weight: var(--delta-rr-font-weight, bold);
      background-color: var(--delta-rr-bg-color, #f2dede);
      color: var(--delta-rr-text-color, #a94442);
      padding: var(--delta-rr-padding, 6px 8px);
      border-radius: var(--delta-rr-border-radius, 4px);
    }
 
    .arrow {
      text-align: center;
    }
 
	.arrow-b.up::before {
	  content: "▲";
	  color: var(--arrow-color-b, #006400);
	}

	.arrow-b.down::before {
	  content: "▼";
	  color: var(--arrow-color-b, #006400);
	}

	.arrow-rr.up::before {
	  content: "▲";
	  color: var(--arrow-color-rr, #a94442);
	}

	.arrow-rr.down::before {
	  content: "▼";
	  color: var(--arrow-color-rr, #a94442);
	}
 
    .label {
      font-style: italic;
      font-size: var(--label-font-size, 12px);
    }
 
    .delta-val, .delta-pct {
      padding-left: 10px;
      transition: all 0.3s ease;
    }
 
    .kpi-title {
      font-family: var(--title-font-family, "'72'");
      font-size: var(--title-font-size, 16px);
      font-weight: var(--title-font-weight, bold);
      color: var(--font-color, #000000);
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
        titleFontFamily: "'72'",
        titleFontWeight: 'bold',
        titleFontSize: '16px',
        mainValueFontFamily: "'72'",
        mainValueFontWeight: 'bold',
        deltaBFontFamily: "'72'",
        deltaBFontWeight: 'bold',
        deltaRRFontFamily: "'72'",
        deltaRRFontWeight: 'bold',
        deltaBFontSize: '14px',
        deltaRRFontSize: '14px',
        labelBFontSize: '12px',
        labelRRFontSize: '12px',
        textColorB: '#006400',
        textColorRR: '#a94442',
        arrowColorB: '#006400',
        arrowColorRR: '#a94442',
        deltaBBackgroundColor: '#dff0d8',
        deltaRRBackgroundColor: '#f2dede',
        deltaBPadding: '6px 8px',
        deltaRRPadding: '6px 8px',
        deltaBBorderRadius: '4px',
        deltaRRBorderRadius: '4px'
      };
    }
               
    getDefaultProperties() {
      return this._getDefaultProperties();
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
        '--font-color': this._props.fontColor,
        '--bar-color': this._props.barColor,
        '--title-font-family': this._props.titleFontFamily,
        '--title-font-weight': this._props.titleFontWeight,
        '--title-font-size': this._props.titleFontSize,
        '--main-value-font-family': this._props.mainValueFontFamily,
        '--main-value-font-weight': this._props.mainValueFontWeight,
        '--delta-b-font-family': this._props.deltaBFontFamily,
        '--delta-b-font-weight': this._props.deltaBFontWeight,
        '--delta-b-font-size': this._props.deltaBFontSize,
        '--delta-b-bg-color': this._props.deltaBBackgroundColor,
        '--delta-b-text-color': this._props.textColorB,
        '--delta-b-padding': this._props.deltaBPadding,
        '--delta-b-border-radius': this._props.deltaBBorderRadius,
        '--delta-rr-font-family': this._props.deltaRRFontFamily,
        '--delta-rr-font-weight': this._props.deltaRRFontWeight,
        '--delta-rr-font-size': this._props.deltaRRFontSize,
        '--delta-rr-bg-color': this._props.deltaRRBackgroundColor,
        '--delta-rr-text-color': this._props.textColorRR,
        '--delta-rr-padding': this._props.deltaRRPadding,
        '--delta-rr-border-radius': this._props.deltaRRBorderRadius,
		'--arrow-color-b': this._props.arrowColorB,
		'--arrow-color-rr': this._props.arrowColorRR, // Poprawiona literówka 
        '--label-font-size': this._props.labelBFontSize,
        '--label-rr-font-size': this._props.labelRRFontSize,
		'--kpi-border': this._props.kpiBorder 
      };
 
      Object.entries(styleMap).forEach(([prop, value]) => {
        this._root.style.setProperty(prop, value);
      });
    }
 
    _render() {
      try {
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
                  <div class="kpi-line delta-b">
                    <div class="arrow-b ${this._props.arrowDirectionB}"></div>
                    <div class="label">${this._props.labelB}</div>
                    <div class="delta-val ${this._shouldAnimate ? 'value-change' : ''}">${this._props.deltaB}</div>
                    <div class="delta-pct ${this._shouldAnimate ? 'value-change' : ''}">${this._props.deltaBPercent}</div>
                  </div>
                  <div class="kpi-line delta-rr">
                    <div class="arrow-rr ${this._props.arrowDirectionRR}"></div>
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
            try {
              const elements = this._root.querySelectorAll('.value-change');
              elements.forEach(el => el.classList.remove('value-change'));
              this._shouldAnimate = false;
            } catch (error) {
              console.error('Błąd podczas czyszczenia animacji:', error);
            }
          }, 500);
        }
      } catch (error) {
        console.error('Błąd renderowania:', error);
        this._root.innerHTML = `<div class="kpi-container" style="color:red;padding:20px;">
          Błąd podczas renderowania widżetu. Sprawdź konfigurację.
        </div>`;
      }
    }
 
    onCustomWidgetBeforeUpdate(changedProps) {
      if (changedProps && Object.keys(changedProps).length > 0) {
        console.log("Aktualizacja właściwości widgetu:", changedProps);
      }
    }
 
    onCustomWidgetAfterUpdate(changedProps) {
      try {
        this._props = { ...this._props, ...changedProps };
        this._shouldAnimate = true;
        this._render();
      } catch (error) {
        console.error('Błąd aktualizacji:', error);
        this._props = this._getDefaultProperties();
        this._render();
      }
    }
 
    onCustomWidgetResize(width, height) {
      const scale = Math.min(width / 300, 1.5);
      this._root.style.setProperty('--title-font-size', `${Math.max(14, 16 * scale)}px`);
      this._root.style.setProperty('--main-value-font-size', `${Math.max(20, 28 * scale)}px`);
      this._root.style.setProperty('--delta-b-font-size', `${Math.max(12, 14 * scale)}px`);
      this._root.style.setProperty('--delta-rr-font-size', `${Math.max(12, 14 * scale)}px`);
      this._root.style.setProperty('--bar-width', `${Math.max(15, 20 * scale)}px`);
      this._root.style.setProperty('--bar-height', `${Math.max(60, 80 * scale)}px`);
    }
 
    // Gettery i Settery
    getTitle() { return this._props.title; }
    setTitle(value) { this._props.title = value; this._render(); }
    getMainValue() { return this._props.mainValue; }
    setMainValue(value) { this._props.mainValue = value; this._shouldAnimate = true; this._render(); }
    getDeltaB() { return this._props.deltaB; }
    setDeltaB(value) { this._props.deltaB = value; this._shouldAnimate = true; this._render(); }
    getDeltaBPercent() { return this._props.deltaBPercent; }
    setDeltaBPercent(value) { this._props.deltaBPercent = value; this._shouldAnimate = true; this._render(); }
    getDeltaRR() { return this._props.deltaRR; }
    setDeltaRR(value) { this._props.deltaRR = value; this._shouldAnimate = true; this._render(); }
    getDeltaRRPercent() { return this._props.deltaRRPercent; }
    setDeltaRRPercent(value) { this._props.deltaRRPercent = value; this._shouldAnimate = true; this._render(); }
    getLabelB() { return this._props.labelB; }
    setLabelB(value) { this._props.labelB = value; this._render(); }
    getLabelRR() { return this._props.labelRR; }
    setLabelRR(value) { this._props.labelRR = value; this._render(); }
    getTextColorB() { return this._props.textColorB; }
    setTextColorB(value) { this._props.textColorB = value; this._render(); }
    getTextColorRR() { return this._props.textColorRR; }
    setTextColorRR(value) { this._props.textColorRR = value; this._render(); }
    getArrowColorB() { return this._props.arrowColorB; }
    setArrowColorB(value) { this._props.arrowColorB = value; this._render(); }
    getArrowColorRR() { return this._props.arrowColorRR; }
    setArrowColorRR(value) { this._props.arrowColorRR = value; this._render(); }
    getArrowDirectionB() { return this._props.arrowDirectionB; }
    setArrowDirectionB(value) { this._props.arrowDirectionB = value; this._render(); }
    getArrowDirectionRR() { return this._props.arrowDirectionRR; }
    setArrowDirectionRR(value) { this._props.arrowDirectionRR = value; this._render(); }
    getTitleFontFamily() { return this._props.titleFontFamily; }
    setTitleFontFamily(value) { this._props.titleFontFamily = value; this._render(); }
    getTitleFontWeight() { return this._props.titleFontWeight; }
    setTitleFontWeight(value) { this._props.titleFontWeight = value; this._render(); }
    getTitleFontSize() { return this._props.titleFontSize; }
    setTitleFontSize(value) { this._props.titleFontSize = value; this._render(); }
    getMainValueFontFamily() { return this._props.mainValueFontFamily; }
    setMainValueFontFamily(value) { this._props.mainValueFontFamily = value; this._render(); }
    getMainValueFontWeight() { return this._props.mainValueFontWeight; }
    setMainValueFontWeight(value) { this._props.mainValueFontWeight = value; this._render(); }
    getDeltaBFontFamily() { return this._props.deltaBFontFamily; }
    setDeltaBFontFamily(value) { this._props.deltaBFontFamily = value; this._render(); }
    getDeltaBFontWeight() { return this._props.deltaBFontWeight; }
    setDeltaBFontWeight(value) { this._props.deltaBFontWeight = value; this._render(); }
    getDeltaRRFontFamily() { return this._props.deltaRRFontFamily; }
    setDeltaRRFontFamily(value) { this._props.deltaRRFontFamily = value; this._render(); }
    getDeltaRRFontWeight() { return this._props.deltaRRFontWeight; }
    setDeltaRRFontWeight(value) { this._props.deltaRRFontWeight = value; this._render(); }
    getDeltaBFontSize() { return this._props.deltaBFontSize; }
    setDeltaBFontSize(value) { this._props.deltaBFontSize = value; this._render(); }
    getDeltaRRFontSize() { return this._props.deltaRRFontSize; }
    setDeltaRRFontSize(value) { this._props.deltaRRFontSize = value; this._render(); }
    getLabelBFontSize() { return this._props.labelBFontSize; }
    setLabelBFontSize(value) { this._props.labelBFontSize = value; this._render(); }
    getLabelRRFontSize() { return this._props.labelRRFontSize; }
    setLabelRRFontSize(value) { this._props.labelRRFontSize = value; this._render(); }
    getBarColor() { return this._props.barColor; }
    setBarColor(value) { 
      this._props.barColor = value;
      const bar = this._shadowRoot.querySelector('.kpi-bar');
      if (bar) {
        bar.style.opacity = 0;
        setTimeout(() => {
          bar.style.backgroundColor = value;
          bar.style.opacity = 1;
        }, 10);
      }
      this._render();
    }
    getFontColor() { return this._props.fontColor; }
    setFontColor(value) { this._props.fontColor = value; this._render(); }
    getDeltaBBackgroundColor() { return this._props.deltaBBackgroundColor; }
    setDeltaBBackgroundColor(value) { this._props.deltaBBackgroundColor = value; this._render(); }
    getDeltaRRBackgroundColor() { return this._props.deltaRRBackgroundColor; }
    setDeltaRRBackgroundColor(value) { this._props.deltaRRBackgroundColor = value; this._render(); }
    getDeltaBPadding() { return this._props.deltaBPadding; }
    setDeltaBPadding(value) { this._props.deltaBPadding = value; this._render(); }
    getDeltaRRPadding() { return this._props.deltaRRPadding; }
    setDeltaRRPadding(value) { this._props.deltaRRPadding = value; this._render(); }
    getDeltaBBorderRadius() { return this._props.deltaBBorderRadius; }
    setDeltaBBorderRadius(value) { this._props.deltaBBorderRadius = value; this._render(); }
    getDeltaRRBorderRadius() { return this._props.deltaRRBorderRadius; }
    setDeltaRRBorderRadius(value) { this._props.deltaRRBorderRadius = value; this._render(); }
  }

  customElements.define("com-sap-analytics-custom-widget-orlenkpi", OrlenKPI);
})();