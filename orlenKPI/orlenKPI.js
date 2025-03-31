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
        arrowDirectionRR: 'down'
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
        const value = this[prop] || this._properties[prop];
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

    // ... (Analogiczne gettery/settery dla wszystkich pozostałych właściwości)

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

    onCustomWidgetResize(width, height) {
      const scale = Math.min(width / 300, 1.5);
      this._root.style.setProperty('--title-font-size', `${Math.max(14, 16 * scale)}px`);
      this._root.style.setProperty('--main-value-font-size', `${Math.max(20, 28 * scale)}px`);
      this._root.style.setProperty('--delta-font-size', `${Math.max(12, 14 * scale)}px`);
      this._root.style.setProperty('--bar-width', `${Math.max(15, 20 * scale)}px`);
      this._root.style.setProperty('--bar-height', `${Math.max(60, 80 * scale)}px`);
    }
  }

  // Rejestracja wszystkich właściwości
  const properties = [
    'title', 'mainValue', 'deltaB', 'deltaBPercent', 'deltaRR', 'deltaRRPercent',
    'labelB', 'labelRR', 'arrowDirectionB', 'arrowDirectionRR', 'barColor',
    'fontColor', 'bgUpColor', 'bgDownColor', 'fontFamily', 'fontSize',
    'titleFontFamily', 'titleFontSize', 'mainValueFontFamily', 'mainValueFontSize',
    'deltaFontFamily', 'deltaFontSize', 'deltaFontWeight', 'textColorB', 'textColorRR',
    'arrowColorB', 'arrowColorRR'
  ];

  properties.forEach(prop => {
    Object.defineProperty(OrlenKPI.prototype, prop, {
      get: function() { return this._properties[prop]; },
      set: function(value) { 
        const shouldAnimate = (prop.includes('Value') || prop.includes('delta'));
        if (this._properties[prop] !== value) {
          if (shouldAnimate) this._shouldAnimate = true;
          this._properties[prop] = value;
          this._render();
        }
      }
    });
  });

  customElements.define("com-sap-analytics-custom-widget-orlenkpi", OrlenKPI);
})();