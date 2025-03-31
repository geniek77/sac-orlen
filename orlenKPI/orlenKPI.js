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
      this._shouldAnimate = false;
      this._initProperties();
      this._render();
      this._setupEventListeners();
    }

    _initProperties() {
      this._properties = {
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
      const styleProps = [
        'fontFamily', 'fontColor', 'barColor', 'bgUpColor', 'bgDownColor',
        'textColorB', 'textColorRR', 'titleFontFamily', 'titleFontSize',
        'mainValueFontFamily', 'mainValueFontSize', 'deltaFontFamily',
        'deltaFontSize', 'deltaFontWeight', 'arrowColorB', 'arrowColorRR'
      ];

      styleProps.forEach(prop => {
        const cssVar = `--${prop.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        const value = this._properties[prop];
        if (value) {
          this._root.style.setProperty(cssVar, value);
        }
      });
    }

    _render() {
      this._applyStyles();

      this._root.innerHTML = `
        <div class="kpi-container">
          <div class="kpi-header">
            <div class="kpi-title">${this._properties.title}</div>
            <div class="edit-icon" title="Edytuj">✎</div>
          </div>
          <div class="kpi-main">
            <div class="kpi-bar"></div>
            <div class="kpi-content">
              <div class="kpi-value ${this._shouldAnimate ? 'value-change' : ''}">${this._properties.mainValue}</div>
              <div class="kpi-matrix">
                <div class="kpi-line delta-bg-up">
                  <div class="arrow ${this._properties.arrowDirectionB}"></div>
                  <div class="label">${this._properties.labelB}</div>
                  <div class="delta-val ${this._shouldAnimate ? 'value-change' : ''}">${this._properties.deltaB}</div>
                  <div class="delta-pct ${this._shouldAnimate ? 'value-change' : ''}">${this._properties.deltaBPercent}</div>
                </div>
                <div class="kpi-line delta-bg-down">
                  <div class="arrow ${this._properties.arrowDirectionRR}"></div>
                  <div class="label">${this._properties.labelRR}</div>
                  <div class="delta-val ${this._shouldAnimate ? 'value-change' : ''}">${this._properties.deltaRR}</div>
                  <div class="delta-pct ${this._shouldAnimate ? 'value-change' : ''}">${this._properties.deltaRRPercent}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      if (this._shouldAnimate) {
        setTimeout(() => {
          const animatedElements = this._root.querySelectorAll('.value-change');
          animatedElements.forEach(el => el.classList.remove('value-change'));
          this._shouldAnimate = false;
        }, 500);
      }
    }

    // Metody cyklu życia widgetu
    onCustomWidgetAfterUpdate(changedProperties) {
      Object.keys(changedProperties).forEach(prop => {
        if (this._properties.hasOwnProperty(prop)) {
          if (prop.includes('Value') || prop.includes('delta')) {
            this._shouldAnimate = true;
          }
          this._properties[prop] = changedProperties[prop];
        }
      });
      this._render();
    }

    onCustomWidgetBeforeUpdate(changedProperties) {
      Object.keys(changedProperties).forEach(prop => {
        if (this._properties.hasOwnProperty(prop)) {
          this._properties[prop] = changedProperties[prop];
        }
      });
    }

    onCustomWidgetResize(width, height) {
      const scale = Math.min(width / 300, 1.5);
      this._root.style.setProperty('--title-font-size', `${Math.max(14, 16 * scale)}px`);
      this._root.style.setProperty('--main-value-font-size', `${Math.max(20, 28 * scale)}px`);
      this._root.style.setProperty('--delta-font-size', `${Math.max(12, 14 * scale)}px`);
      this._root.style.setProperty('--bar-width', `${Math.max(15, 20 * scale)}px`);
      this._root.style.setProperty('--bar-height', `${Math.max(60, 80 * scale)}px`);
    }

    // Gettery i settery dla wszystkich właściwości
    get title() { return this._properties.title; }
    set title(value) { 
      this._properties.title = value; 
      this._render(); 
    }

    get mainValue() { return this._properties.mainValue; }
    set mainValue(value) { 
      if (this._properties.mainValue !== value) {
        this._shouldAnimate = true;
        this._properties.mainValue = value; 
        this._render();
      }
    }

    get deltaB() { return this._properties.deltaB; }
    set deltaB(value) { 
      if (this._properties.deltaB !== value) {
        this._shouldAnimate = true;
        this._properties.deltaB = value; 
        this._render();
      }
    }

    get deltaBPercent() { return this._properties.deltaBPercent; }
    set deltaBPercent(value) { 
      if (this._properties.deltaBPercent !== value) {
        this._shouldAnimate = true;
        this._properties.deltaBPercent = value; 
        this._render();
      }
    }

    get deltaRR() { return this._properties.deltaRR; }
    set deltaRR(value) { 
      if (this._properties.deltaRR !== value) {
        this._shouldAnimate = true;
        this._properties.deltaRR = value; 
        this._render();
      }
    }

    get deltaRRPercent() { return this._properties.deltaRRPercent; }
    set deltaRRPercent(value) { 
      if (this._properties.deltaRRPercent !== value) {
        this._shouldAnimate = true;
        this._properties.deltaRRPercent = value; 
        this._render();
      }
    }

    get labelB() { return this._properties.labelB; }
    set labelB(value) { 
      this._properties.labelB = value; 
      this._render(); 
    }

    get labelRR() { return this._properties.labelRR; }
    set labelRR(value) { 
      this._properties.labelRR = value; 
      this._render(); 
    }

    get arrowDirectionB() { return this._properties.arrowDirectionB; }
    set arrowDirectionB(value) { 
      this._properties.arrowDirectionB = value; 
      this._render(); 
    }

    get arrowDirectionRR() { return this._properties.arrowDirectionRR; }
    set arrowDirectionRR(value) { 
      this._properties.arrowDirectionRR = value; 
      this._render(); 
    }

    get barColor() { return this._properties.barColor; }
    set barColor(value) { 
      this._properties.barColor = value; 
      this._render(); 
    }

    get fontColor() { return this._properties.fontColor; }
    set fontColor(value) { 
      this._properties.fontColor = value; 
      this._render(); 
    }

    get bgUpColor() { return this._properties.bgUpColor; }
    set bgUpColor(value) { 
      this._properties.bgUpColor = value; 
      this._render(); 
    }

    get bgDownColor() { return this._properties.bgDownColor; }
    set bgDownColor(value) { 
      this._properties.bgDownColor = value; 
      this._render(); 
    }

    get fontFamily() { return this._properties.fontFamily; }
    set fontFamily(value) { 
      this._properties.fontFamily = value; 
      this._render(); 
    }

    get fontSize() { return this._properties.fontSize; }
    set fontSize(value) { 
      this._properties.fontSize = value; 
      this._render(); 
    }

    get titleFontFamily() { return this._properties.titleFontFamily; }
    set titleFontFamily(value) { 
      this._properties.titleFontFamily = value; 
      this._render(); 
    }

    get titleFontSize() { return this._properties.titleFontSize; }
    set titleFontSize(value) { 
      this._properties.titleFontSize = value; 
      this._render(); 
    }

    get mainValueFontFamily() { return this._properties.mainValueFontFamily; }
    set mainValueFontFamily(value) { 
      this._properties.mainValueFontFamily = value; 
      this._render(); 
    }

    get mainValueFontSize() { return this._properties.mainValueFontSize; }
    set mainValueFontSize(value) { 
      this._properties.mainValueFontSize = value; 
      this._render(); 
    }

    get deltaFontFamily() { return this._properties.deltaFontFamily; }
    set deltaFontFamily(value) { 
      this._properties.deltaFontFamily = value; 
      this._render(); 
    }

    get deltaFontSize() { return this._properties.deltaFontSize; }
    set deltaFontSize(value) { 
      this._properties.deltaFontSize = value; 
      this._render(); 
    }

    get deltaFontWeight() { return this._properties.deltaFontWeight; }
    set deltaFontWeight(value) { 
      this._properties.deltaFontWeight = value; 
      this._render(); 
    }

    get textColorB() { return this._properties.textColorB; }
    set textColorB(value) { 
      this._properties.textColorB = value; 
      this._render(); 
    }

    get textColorRR() { return this._properties.textColorRR; }
    set textColorRR(value) { 
      this._properties.textColorRR = value; 
      this._render(); 
    }

    get arrowColorB() { return this._properties.arrowColorB; }
    set arrowColorB(value) { 
      this._properties.arrowColorB = value; 
      this._render(); 
    }

    get arrowColorRR() { return this._properties.arrowColorRR; }
    set arrowColorRR(value) { 
      this._properties.arrowColorRR = value; 
      this._render(); 
    }
  }

  customElements.define("com-sap-analytics-custom-widget-orlenkpi", OrlenKPI);
})();