(function () {
  const template = document.createElement("template");
  template.innerHTML = `
  

<style>
  :host {
    display: block;
    font-family: Arial, sans-serif;
  }

  .kpi-container {
    border: 1px solid #ccc;
    padding: 10px;
    position: relative;
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
    width: 20px;
    background: var(--bar-color, #006400);
    height: 80px;
  }

  .kpi-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  .kpi-value {
    font-size: var(--main-value-font-size, 28px);
    font-weight: bold;
    margin-bottom: 8px;
  }

  .kpi-matrix {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .kpi-line {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .label-line {
    font-size: 12px;
    color: #666;
    margin-left: 22px;
    margin-bottom: 4px;
  }

  .arrow.up::before {
    content: "▲";
    color: var(--arrow-color-b, green);
  }

  .arrow.down::before {
    content: "▼";
    color: var(--arrow-color-rr, red);
  }

  .arrow.none::before {
    content: "";
  }

  .delta-val {
    font-weight: bold;
  }

  .delta-pct {
    font-weight: normal;
  }
</style>


  <div id="root"></div>`;

  class OrlenKPI extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this._root = this._shadowRoot.getElementById("root");
      this.properties = {};

      this._root.addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("onClick", {
          detail: {
            title: this.properties.title,
            mainValue: this.properties.mainValue
          }
        }));
      });
    }

    onCustomWidgetBeforeUpdate(changedProperties) {
      this.properties = { ...this.properties, ...changedProperties };
    }

    onCustomWidgetAfterUpdate() {
      this.render();
    }

    onCustomWidgetResize(width, height) {
  const baseWidth = 300;
  const scale = Math.min(width / baseWidth, 2);

  const titleSize = (16 * scale).toFixed(1) + "px";
  const mainSize = (28 * scale).toFixed(1) + "px";
  const deltaSize = (14 * scale).toFixed(1) + "px";
  const barWidth = Math.max(4, Math.round(10 * scale)) + "px";
  const barHeight = Math.round(40 * scale) + "px";
  const cellPadding = Math.round(4 * scale) + "px";
  const rowGap = Math.round(4 * scale) + "px";
  const labelWidth = Math.round(40 * scale) + "px";
  const cellWidth = Math.round(60 * scale) + "px";

  this._root.style.setProperty("--title-font-size", titleSize);
  this._root.style.setProperty("--main-value-font-size", mainSize);
  this._root.style.setProperty("--delta-font-size", deltaSize);
  this._root.style.setProperty("--bar-width", barWidth);
  this._root.style.setProperty("--bar-height", barHeight);
  this._root.style.setProperty("--cell-padding", cellPadding);
  this._root.style.setProperty("--row-gap", rowGap);
  this._root.style.setProperty("--label-width", labelWidth);
  this._root.style.setProperty("--cell-width", cellWidth);
}

    applyStyles() {
      const {
        fontColor = "#000000",
        
        
        barColor = "#006400",
        bgUpColor = "#dff0d8",
        bgDownColor = "#f2dede",
        textColorB = "#006400",
        textColorRR = "#a94442"
      } = this.properties;

      this._root.style.setProperty("--font-color", fontColor);
      this._root.style.setProperty("--font-family", fontFamily);
      this._root.style.setProperty("--font-size", fontSize);
      this._root.style.setProperty("--bar-color", barColor);
      this._root.style.setProperty("--bg-up-color", bgUpColor);
      this._root.style.setProperty("--bg-down-color", bgDownColor);
      this._root.style.setProperty("--text-color-b", textColorB);
      
      this._root.style.setProperty("--title-font-size", this.properties.titleFontSize || "16px");
      this._root.style.setProperty("--title-font-family", this.properties.titleFontFamily || "Arial");
      this._root.style.setProperty("--main-value-font-size", this.properties.mainValueFontSize || "28px");
      this._root.style.setProperty("--main-value-font-family", this.properties.mainValueFontFamily || "Arial");
      this._root.style.setProperty("--delta-font-size", this.properties.deltaFontSize || "14px");
      this._root.style.setProperty("--delta-font-family", this.properties.deltaFontFamily || "Arial");
      this._root.style.setProperty("--delta-font-weight", this.properties.deltaFontWeight || "bold");
      this._root.style.setProperty("--bar-color", this.properties.barColor || "#006400");
      this._root.style.setProperty("--font-color", this.properties.fontColor || "#000000");
      this._root.style.setProperty("--bg-up-color", this.properties.bgUpColor || "#dff0d8");
      this._root.style.setProperty("--bg-down-color", this.properties.bgDownColor || "#f2dede");
      this._root.style.setProperty("--text-color-rr", textColorRR);
    }

    render() {
    const {
      title = "EBITDA LIFO",
      mainValue = "315,8",
      deltaB = "+198",
      deltaBPercent = "+168%",
      deltaRR = "-521",
      deltaRRPercent = "-254%",
      labelB = "B",
      labelRR = "R/R",
      arrowDirectionB = "up",
      arrowDirectionRR = "down",
      arrowColorB = "#006400",
      arrowColorRR = "#a94442",
      titleFontFamily = "Arial",
      titleFontSize = "16px",
      mainValueFontFamily = "Arial",
      mainValueFontSize = "28px",
      deltaFontFamily = "Arial",
      deltaFontSize = "14px",
      deltaFontWeight = "bold",
      barColor = "#006400",
      bgUpColor = "#dff0d8",
      bgDownColor = "#f2dede",
      fontColor = "#000000",
      textColorB = "#006400",
      textColorRR = "#a94442"
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
              <div class="kpi-line">
                <div class="arrow ${arrowDirectionB}"></div>
                <div class="delta-val">${deltaB}</div>
                <div class="delta-pct">${deltaBPercent}</div>
              </div>
              <div class="label-line">${labelB}</div>
              <div class="kpi-line">
                <div class="arrow ${arrowDirectionRR}"></div>
                <div class="delta-val">${deltaRR}</div>
                <div class="delta-pct">${deltaRRPercent}</div>
              </div>
              <div class="label-line">${labelRR}</div>
            </div>
          </div>
        </div>
      </div>
    `;
    

      const editIcon = this._root.querySelector("#editIcon");
      if (editIcon) {
        editIcon.addEventListener("click", (e) => {
          e.stopPropagation();
          this.dispatchEvent(new CustomEvent("onEdit", {
            detail: {
              title: this.properties.title || ""
            }
          }));
        });
      }
    }

    getTitle() { return this.properties.title; }
    setTitle(value) { this.properties.title = value; this.render(); }

    getMainValue() { return this.properties.mainValue; }
    setMainValue(value) { this.properties.mainValue = value; this.render(); }

    getDeltaB() { return this.properties.deltaB; }
    setDeltaB(value) { this.properties.deltaB = value; this.render(); }

    getDeltaRR() { return this.properties.deltaRR; }
    setDeltaRR(value) { this.properties.deltaRR = value; this.render(); }

    getLabelB() { return this.properties.labelB; }
    setLabelB(value) { this.properties.labelB = value; this.render(); }

    getLabelRR() { return this.properties.labelRR; }
    setLabelRR(value) { this.properties.labelRR = value; this.render(); }

    getTextColorB() { return this.properties.textColorB; }
    setTextColorB(value) { this.properties.textColorB = value; this.render(); }

    getTextColorRR() { return this.properties.textColorRR; }
    setTextColorRR(value) { this.properties.textColorRR = value; this.render(); }

    getArrowColorB() { return this.properties.arrowColorB; }
    setArrowColorB(value) { this.properties.arrowColorB = value; this.render(); }

    getArrowColorRR() { return this.properties.arrowColorRR; }
    setArrowColorRR(value) { this.properties.arrowColorRR = value; this.render(); }

    getArrowDirectionB() { return this.properties.arrowDirectionB; }
    setArrowDirectionB(value) { this.properties.arrowDirectionB = value; this.render(); }

    getArrowDirectionRR() { return this.properties.arrowDirectionRR; }
    setArrowDirectionRR(value) { this.properties.arrowDirectionRR = value; this.render(); }
  }

  customElements.define("com-sap-analytics-custom-widget-orlenkpi", OrlenKPI);
})();

