(function () {
  const template = document.createElement("template");
  template.innerHTML = `
  <style>
    :host {
      display: block;
      font-family: var(--font-family, Arial), sans-serif;
      min-width: 150px;
    }

    .kpi-container {

      padding: 10px;
      position: relative;
      background: white;
      transition: all 0.3s ease;
    }

    .kpi-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
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
      gap: 12px;
      margin-top: 10px;
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
      gap: var(--row-gap, 4px);
      margin-top: 20px;
      margin-left: calc(var(--bar-width, 20px) + 10px);
    }

    .kpi-line {
      display: grid;
      grid-template-columns: 50px 24px 90px 1fr;
      align-items: center;
      padding: var(--cell-padding, 4px);
      transition: background-color 0.3s ease;
    }

    .label-cell {
      font-style: italic;
    }

    .arrow.up::before {
      content: "▲";
      color: var(--arrow-color-b, #006400);
      transition: color 0.3s ease;
    }

    .arrow.down::before {
      content: "▼";
      color: var(--arrow-color-rr, #a94442);
      transition: color 0.3s ease;
    }

    .arrow.none::before {
      content: "";
    }

    .delta-val {
      font-weight: var(--delta-font-weight, bold);
      font-family: var(--delta-font-family, Arial);
      font-size: var(--delta-font-size, 14px);
      transition: all 0.3s ease;
    }

    .delta-pct {
      font-weight: normal;
      font-family: var(--delta-font-family, Arial);
      font-size: var(--delta-font-size, 14px);
      text-align: right;
      transition: all 0.3s ease;
    }

    .kpi-title {
      font-family: var(--title-font-family, Arial);
      font-size: var(--title-font-size, 16px);
      font-weight: bold;
      color: var(--font-color, #000000);
      transition: all 0.3s ease;
    }

    .delta-bg-up {
      background-color: var(--bg-up-color, #dff0d8);
      color: var(--text-color-b, #006400);
    }

    .delta-bg-down {
      background-color: var(--bg-down-color, #f2dede);
      color: var(--text-color-rr, #a94442);
    }

    .value-change {
      animation: pulse 0.5s ease;
    }

    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
  </style>
  <div id="root"></div>
`;

  const DEFAULTS = {
    title: "EBITDA LIFO",
    mainValue: "315,8",
    deltaB: "+198",
    deltaBPercent: "+168%",
    deltaRR: "-521",
    deltaRRPercent: "-254%",
    barColor: "#006400",
    fontColor: "#000000",
    bgUpColor: "#dff0d8",
    bgDownColor: "#f2dede",
    titleFontFamily: "Arial",
    titleFontSize: "16px",
    mainValueFontFamily: "Arial",
    mainValueFontSize: "28px",
    deltaFontFamily: "Arial",
    deltaFontSize: "14px",
    deltaFontWeight: "bold",
    labelB: "B",
    labelRR: "R/R",
    textColorB: "#006400",
    textColorRR: "#a94442",
    arrowColorB: "#006400",
    arrowDirectionB: "up",
    arrowColorRR: "#a94442",
    arrowDirectionRR: "down",
    fontFamily: "Arial",
    fontSize: "14px"
  };

  class OrlenKPI extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this._root = this._shadowRoot.getElementById("root");
      this.properties = { ...DEFAULTS };
      this._definePropertyAccessors();

      this._root.addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("onClick"));
      });
    }

    _definePropertyAccessors() {
      const propertyNames = Object.keys(DEFAULTS);
      
      propertyNames.forEach(prop => {
        Object.defineProperty(this, prop, {
          get: function() {
            return this.properties[prop];
          },
          set: function(value) {
            const oldValue = this.properties[prop];
            this.properties[prop] = value;
            
            if (this._shouldAnimate(prop, oldValue, value)) {
              this._animateValueChange(prop);
            } else {
              this._render();
            }
          }
        });
      });
    }

    _shouldAnimate(prop, oldValue, newValue) {
      const numericProps = ['mainValue', 'deltaB', 'deltaBPercent', 'deltaRR', 'deltaRRPercent'];
      return numericProps.includes(prop) && oldValue !== newValue;
    }

    _animateValueChange(prop) {
      const elementClass = this._getElementClass(prop);
      this._render();
      
      setTimeout(() => {
        const element = this._root.querySelector(`.${elementClass}`);
        if (element) {
          element.classList.add('value-change');
          setTimeout(() => {
            element.classList.remove('value-change');
          }, 500);
        }
      }, 0);
    }

    _getElementClass(prop) {
      const classMap = {
        'mainValue': 'kpi-value',
        'deltaB': 'delta-val',
        'deltaBPercent': 'delta-pct',
        'deltaRR': 'delta-val',
        'deltaRRPercent': 'delta-pct'
      };
      return classMap[prop] || '';
    }

    onCustomWidgetAfterUpdate(changedProperties) {
      this.properties = { ...DEFAULTS, ...this.properties, ...changedProperties };
      this._applyStyles();
      this._render();
    }

    onCustomWidgetBeforeUpdate(changedProperties) {
      this.properties = { ...this.properties, ...changedProperties };
    }

    onCustomWidgetResize(width, height) {
      const minWidth = 150;
      if (width < minWidth) {
        width = minWidth;
      }

      const baseWidth = 300;
      const scale = Math.min(width / baseWidth, 2);

      this._root.style.setProperty("--title-font-size", `${16 * scale}px`);
      this._root.style.setProperty("--main-value-font-size", `${28 * scale}px`);
      this._root.style.setProperty("--delta-font-size", `${14 * scale}px`);
      this._root.style.setProperty("--bar-width", `${Math.max(4, Math.round(10 * scale))}px`);
      this._root.style.setProperty("--bar-height", `${Math.round(40 * scale)}px`);
      this._root.style.setProperty("--cell-padding", `${Math.round(4 * scale)}px`);
      this._root.style.setProperty("--row-gap", `${Math.round(4 * scale)}px`);
    }

    _applyStyles() {
      const styleMap = {
        "--font-family": this.properties.fontFamily,
        "--font-color": this.properties.fontColor,
        "--bar-color": this.properties.barColor,
        "--bg-up-color": this.properties.bgUpColor,
        "--bg-down-color": this.properties.bgDownColor,
        "--text-color-b": this.properties.textColorB,
        "--text-color-rr": this.properties.textColorRR,
        "--title-font-family": this.properties.titleFontFamily,
        "--title-font-size": this.properties.titleFontSize,
        "--main-value-font-family": this.properties.mainValueFontFamily,
        "--main-value-font-size": this.properties.mainValueFontSize,
        "--delta-font-family": this.properties.deltaFontFamily,
        "--delta-font-size": this.properties.deltaFontSize,
        "--delta-font-weight": this.properties.deltaFontWeight,
        "--arrow-color-b": this.properties.arrowColorB,
        "--arrow-color-rr": this.properties.arrowColorRR
      };

      Object.entries(styleMap).forEach(([prop, value]) => {
        this._root.style.setProperty(prop, value || DEFAULTS[prop.replace('--', '')]);
      });
    }

    _render() {
      const {
        title = DEFAULTS.title,
        mainValue = DEFAULTS.mainValue,
        deltaB = DEFAULTS.deltaB,
        deltaBPercent = DEFAULTS.deltaBPercent,
        deltaRR = DEFAULTS.deltaRR,
        deltaRRPercent = DEFAULTS.deltaRRPercent,
        labelB = DEFAULTS.labelB,
        labelRR = DEFAULTS.labelRR,
        arrowDirectionB = DEFAULTS.arrowDirectionB,
        arrowDirectionRR = DEFAULTS.arrowDirectionRR
      } = this.properties;

      this._root.innerHTML = `
        <div class="kpi-container">
          <div class="kpi-header">
            <div class="kpi-title">${title}</div>
            <div class="edit-icon" title="Edytuj">✎</div>
          </div>
          <div class="kpi-main">
            <div class="kpi-bar"></div>
            <div class="kpi-content">
              <div class="kpi-value">${mainValue}</div>
              <div class="kpi-matrix">
                <div class="kpi-line delta-bg-up">
                  <div class="label-cell">${labelB}</div>
                  <div class="arrow ${arrowDirectionB}"></div>
                  <div class="delta-val">${deltaB}</div>
                  <div class="delta-pct">${deltaBPercent}</div>
                </div>
                <div class="kpi-line delta-bg-down">
                  <div class="label-cell">${labelRR}</div>
                  <div class="arrow ${arrowDirectionRR}"></div>
                  <div class="delta-val">${deltaRR}</div>
                  <div class="delta-pct">${deltaRRPercent}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      const editIcon = this._root.querySelector(".edit-icon");
      if (editIcon) {
        editIcon.addEventListener("click", (e) => {
          e.stopPropagation();
          this.dispatchEvent(new CustomEvent("onEdit"));
        });
      }
    }
  }

  customElements.define("com-sap-analytics-custom-widget-orlenkpi", OrlenKPI);
})();