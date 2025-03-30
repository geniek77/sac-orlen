(function () {
  let template = document.createElement("template");
  template.innerHTML = `
    <style>
      #form {
        font-family: Arial, sans-serif;
        width: 100%;
        margin: 0 auto;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 10px;
      }
      td {
        padding: 5px;
        text-align: left;
        font-size: 13px;
      }
      input[type="text"], input[type="number"] {
        width: 100%;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 13px;
        box-sizing: border-box;
        margin-bottom: 10px;
      }
      input[type="color"] {
        width: 100%;
        height: 40px;
        padding: 2px;
        box-sizing: border-box;
        margin-bottom: 10px;
      }
      input[type="checkbox"] {
        margin: 5px 0;
      }
      input[type="submit"] {
        background-color: #487cac;
        color: white;
        padding: 10px;
        border: none;
        border-radius: 5px;
        font-size: 14px;
        cursor: pointer;
        width: 100%;
      }
    </style>
    <form id="form">
      <table>
        <tr>
          <td><label for="builder_progress">Progress (%)</label></td>
          <td><input id="builder_progress" type="number" min="0" max="100"></td>
        </tr>
        <tr>
          <td><label for="builder_bottomcolor">Kolor wypełnienia - dolny blok</label></td>
          <td><input id="builder_bottomcolor" type="color"></td>
        </tr>
        <tr>
          <td><label for="builder_middlecolor">Kolor wypełnienia - środkowy blok</label></td>
          <td><input id="builder_middlecolor" type="color"></td>
        </tr>
        <tr>
          <td><label for="builder_topcolor">Kolor wypełnienia - górny blok</label></td>
          <td><input id="builder_topcolor" type="color"></td>
        </tr>
        <tr>
          <td><label for="builder_bottomcount">Ilość segmentów - dolny blok</label></td>
          <td><input id="builder_bottomcount" type="number" min="1"></td>
        </tr>
        <tr>
          <td><label for="builder_middlecount">Ilość segmentów - środkowy blok</label></td>
          <td><input id="builder_middlecount" type="number" min="1"></td>
        </tr>
        <tr>
          <td><label for="builder_topcount">Ilość segmentów - górny blok</label></td>
          <td><input id="builder_topcount" type="number" min="1"></td>
        </tr>
        <tr>
          <td><label for="builder_backgroundcolor">Kolor tła</label></td>
          <td><input id="builder_backgroundcolor" type="color"></td>
        </tr>
        <tr>
          <td><label for="builder_transparent">Tło przezroczyste</label></td>
          <td><input id="builder_transparent" type="checkbox"></td>
        </tr>
        <tr>
          <td><label for="builder_animationspeed">Szybkość animacji (ms)</label></td>
          <td><input id="builder_animationspeed" type="number" min="10"></td>
        </tr>
        <tr>
          <td><label for="builder_enableanimation">Włącz animację</label></td>
          <td><input id="builder_enableanimation" type="checkbox" checked></td>
        </tr>
        <tr>
          <td><label for="builder_loop">Zapętl animację po 100%</label></td>
          <td><input id="builder_loop" type="checkbox" checked></td>
        </tr>
      </table>
      <input type="submit" value="Zapisz ustawienia">
    </form>
  `;

  class OrlenProgressBarBuilder extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this._shadowRoot.getElementById("form").addEventListener("submit", this._submit.bind(this));
    }

    _submit(e) {
      e.preventDefault();
      const transparentChecked = this.transparent;
      const bgColorValue = transparentChecked ? "transparent" : this.backgroundcolor;
      this.dispatchEvent(
        new CustomEvent("propertiesChanged", {
          detail: {
            properties: {
              progress: parseFloat(this.progress),
              bottomcolor: this.bottomcolor,
              middlecolor: this.middlecolor,
              topcolor: this.topcolor,
              bottomcount: parseInt(this.bottomcount),
              middlecount: parseInt(this.middlecount),
              topcount: parseInt(this.topcount),
              backgroundcolor: bgColorValue,
              animationspeed: parseFloat(this.animationspeed),
              enableanimation: this.enableanimation,
              loop: this.loop
            }
          }
        })
      );
    }

    // Gettery i settery
    set progress(value) {
      this._shadowRoot.getElementById("builder_progress").value = value;
    }
    get progress() {
      return this._shadowRoot.getElementById("builder_progress").value;
    }

    set bottomcolor(value) {
      this._shadowRoot.getElementById("builder_bottomcolor").value = value;
    }
    get bottomcolor() {
      return this._shadowRoot.getElementById("builder_bottomcolor").value;
    }

    set middlecolor(value) {
      this._shadowRoot.getElementById("builder_middlecolor").value = value;
    }
    get middlecolor() {
      return this._shadowRoot.getElementById("builder_middlecolor").value;
    }

    set topcolor(value) {
      this._shadowRoot.getElementById("builder_topcolor").value = value;
    }
    get topcolor() {
      return this._shadowRoot.getElementById("builder_topcolor").value;
    }

    set bottomcount(value) {
      this._shadowRoot.getElementById("builder_bottomcount").value = value;
    }
    get bottomcount() {
      return this._shadowRoot.getElementById("builder_bottomcount").value;
    }

    set middlecount(value) {
      this._shadowRoot.getElementById("builder_middlecount").value = value;
    }
    get middlecount() {
      return this._shadowRoot.getElementById("builder_middlecount").value;
    }

    set topcount(value) {
      this._shadowRoot.getElementById("builder_topcount").value = value;
    }
    get topcount() {
      return this._shadowRoot.getElementById("builder_topcount").value;
    }

    set backgroundcolor(value) {
      this._shadowRoot.getElementById("builder_backgroundcolor").value = value;
    }
    get backgroundcolor() {
      return this._shadowRoot.getElementById("builder_backgroundcolor").value;
    }

    set animationspeed(value) {
      this._shadowRoot.getElementById("builder_animationspeed").value = value;
    }
    get animationspeed() {
      return this._shadowRoot.getElementById("builder_animationspeed").value;
    }

    set enableanimation(value) {
      this._shadowRoot.getElementById("builder_enableanimation").checked = value;
    }
    get enableanimation() {
      return this._shadowRoot.getElementById("builder_enableanimation").checked;
    }

    set loop(value) {
      this._shadowRoot.getElementById("builder_loop").checked = value;
    }
    get loop() {
      return this._shadowRoot.getElementById("builder_loop").checked;
    }

    set transparent(value) {
      this._shadowRoot.getElementById("builder_transparent").checked = value;
    }
    get transparent() {
      return this._shadowRoot.getElementById("builder_transparent").checked;
    }
  }

  customElements.define("com-sap-analytics-custom-widget-orlenprogressbar-builder", OrlenProgressBarBuilder);
})();


