(function () {
  const template = document.createElement("template");
  template.innerHTML = `
  <style>
    :host {
      display: block;
      font-family: var(--font-family, Arial), sans-serif;
    }

    .kpi-container {
      border: 1px solid #ccc;
      padding: 10px;
      position: relative;
      background: white;
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
    }

    .label-cell {
      font-style: italic;
    }

    .arrow.up::before {
      content: "▲";
      color: var(--arrow-color-b, #006400);
    }

    .arrow.down::before {
      content: "▼";
      color: var(--arrow-color-rr, #a94442);
    }

    .arrow.none::before {
      content: "";
    }

    .delta-val {
      font-weight: var(--delta-font-weight, bold);
      font-family: var(--delta-font-family, Arial);
      font-size: var(--delta-font-size, 14px);
    }

    .delta-pct {
      font-weight: normal;
      font-family: var(--delta-font-family, Arial);
      font-size: var(--delta-font-size, 14px);
      text-align: right;
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

      this._root.addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("onClick"));
      });
    }

    onCustomWidgetAfterUpdate(changedProperties) {
      this.properties = { ...this.properties, ...changedProperties };
      this._applyStyles();
      this._render();
    }

    onCustomWidgetBeforeUpdate(changedProperties) {
      this.properties = { ...this.properties, ...changedProperties };
    }

    onCustomWidgetResize(width, height) {
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
                <!-- Nowy układ tabelaryczny -->
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

                <!-- Poprzedni układ zakomentowany -->
                <!--
                <div class="kpi-line delta-bg-up">
                  <div class="arrow ${arrowDirectionB}"></div>
                  <div class="delta-val">${deltaB}</div>
                  <div class="delta-pct">${deltaBPercent}</div>
                </div>
                <div class="label-line">${labelB}</div>
                <div class="kpi-line delta-bg-down">
                  <div class="arrow ${arrowDirectionRR}"></div>
                  <div class="delta-val">${deltaRR}</div>
                  <div class="delta-pct">${deltaRRPercent}</div>
                </div>
                <div class="label-line">${labelRR}</div>
                -->
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

    // Gettery i settery – pozostawione bez zmian
    getTitle() { return this.properties.title; }
    setTitle(value) { this.properties.title = value; this._render(); }
    getMainValue() { return this.properties.mainValue; }
    setMainValue(value) { this.properties.mainValue = value; this._render(); }
    getDeltaB() { return this.properties.deltaB; }
    setDeltaB(value) { this.properties.deltaB = value; this._render(); }
    getDeltaBPercent() { return this.properties.deltaBPercent; }
    setDeltaBPercent(value) { this.properties.deltaBPercent = value; this._render(); }
    getDeltaRR() { return this.properties.deltaRR; }
    setDeltaRR(value) { this.properties.deltaRR = value; this._render(); }
    getDeltaRRPercent() { return this.properties.deltaRRPercent; }
    setDeltaRRPercent(value) { this.properties.deltaRRPercent = value; this._render(); }
    getLabelB() { return this.properties.labelB; }
    setLabelB(value) { this.properties.labelB = value; this._render(); }
    getLabelRR() { return this.properties.labelRR; }
    setLabelRR(value) { this.properties.labelRR = value; this._render(); }
    getTextColorB() { return this.properties.textColorB; }
    setTextColorB(value) { this.properties.textColorB = value; this._render(); }
    getTextColorRR() { return this.properties.textColorRR; }
    setTextColorRR(value) { this.properties.textColorRR = value; this._render(); }
    getArrowColorB() { return this.properties.arrowColorB; }
    setArrowColorB(value) { this.properties.arrowColorB = value; this._render(); }
    getArrowColorRR() { return this.properties.arrowColorRR; }
    setArrowColorRR(value) { this.properties.arrowColorRR = value; this._render(); }
    getArrowDirectionB() { return this.properties.arrowDirectionB; }
    setArrowDirectionB(value) { this.properties.arrowDirectionB = value; this._render(); }
    getArrowDirectionRR() { return this.properties.arrowDirectionRR; }
    setArrowDirectionRR(value) { this.properties.arrowDirectionRR = value; this._render(); }
    getTitleFontFamily() { return this.properties.titleFontFamily; }
    setTitleFontFamily(value) { this.properties.titleFontFamily = value; this._render(); }
    getTitleFontSize() { return this.properties.titleFontSize; }
    setTitleFontSize(value) { this.properties.titleFontSize = value; this._render(); }
    getMainValueFontFamily() { return this.properties.mainValueFontFamily; }
    setMainValueFontFamily(value) { this.properties.mainValueFontFamily = value; this._render(); }
    getMainValueFontSize() { return this.properties.mainValueFontSize; }
    setMainValueFontSize(value) { this.properties.mainValueFontSize = value; this._render(); }
    getDeltaFontFamily() { return this.properties.deltaFontFamily; }
    setDeltaFontFamily(value) { this.properties.deltaFontFamily = value; this._render(); }
    getDeltaFontSize() { return this.properties.deltaFontSize; }
    setDeltaFontSize(value) { this.properties.deltaFontSize = value; this._render(); }
    getDeltaFontWeight() { return this.properties.deltaFontWeight; }
    setDeltaFontWeight(value) { this.properties.deltaFontWeight = value; this._render(); }
    getBarColor() { return this.properties.barColor; }
    setBarColor(value) { this.properties.barColor = value; this._render(); }
    getFontColor() { return this.properties.fontColor; }
    setFontColor(value) { this.properties.fontColor = value; this._render(); }
    getBgUpColor() { return this.properties.bgUpColor; }
    setBgUpColor(value) { this.properties.bgUpColor = value; this._render(); }
    getBgDownColor() { return this.properties.bgDownColor; }
    setBgDownColor(value) { this.properties.bgDownColor = value; this._render(); }
    getFontFamily() { return this.properties.fontFamily; }
    setFontFamily(value) { this.properties.fontFamily = value; this._render(); }
    getFontSize() { return this.properties.fontSize; }
    setFontSize(value) { this.properties.fontSize = value; this._render(); }
  }

  customElements.define("com-sap-analytics-custom-widget-orlenkpi", OrlenKPI);
})();
