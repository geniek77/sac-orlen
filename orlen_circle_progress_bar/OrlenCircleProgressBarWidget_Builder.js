(function () {
   let template = document.createElement("template");
   template.innerHTML = `
<br>
<style>
    #form {
        font-family: Arial, sans-serif;
        width: 400px;
        margin: 0 auto;
    }

    a {
        text-decoration: none;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 10px;
    }

    td {
        padding: 1px;
        text-align: left;
        font-size: 13px;
    }

    input {
        width: 100%;
        padding: 10px;
        margin: 5px 0;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    input[type="color"] {
        padding: 0;
        height: 30px;
        border: none;
    }

    input[type="number"] {
        width: 93%;
    }

    button {
        background-color: #4CAF50;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    button:hover {
        background-color: #45a049;
    }

    .label {
        font-weight: bold;
        display: block;
        margin-bottom: 5px;
    }

    .container {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
    }

    .container .label {
        width: 150px;
    }

    .container input {
        flex: 1;
    }

    .spacer {
        margin-bottom: 10px;
    }

    .header-row td {
        padding-top: 10px;
        padding-bottom: 10px;
    }
</style>

<form id="form">
    <table>
        <tr class="header-row">
            <td colspan="2">
                <h2>Circle Progress Bar</h2>
            </td>
        </tr>

        <tr>
            <td class="label">Percentage:</td>
            <td>
                <input id="builder_percentage" type="number" min="-999999" max="999999" step="1" />
            </td>
        </tr>

        <tr>
            <td class="label">Bar Color:</td>
            <td>
                <input id="builder_barColor" type="color" />
            </td>
        </tr>

        <tr>
            <td class="label">Empty Bar Color:</td>
            <td>
                <input id="builder_emptyBarColor" type="color" />
            </td>
        </tr>
    </table>
</form>
   `;

   class WidgetBuilder extends HTMLElement {
      constructor() {
         super();
         this._shadowRoot = this.attachShadow({ mode: "open" });
         this._shadowRoot.appendChild(template.content.cloneNode(true));
         this._shadowRoot.getElementById("form").addEventListener("change", this._submit.bind(this));
      }

      _submit(e) {
         e.preventDefault();
         this.dispatchEvent(new CustomEvent("propertiesChanged", {
            detail: {
               properties: {
                  percentage: this.percentage,
                  barColor: this.barColor,
                  emptyBarColor: this.emptyBarColor
               }
            }
         }));
      }

      set percentage(_percentage) {
         this._shadowRoot.getElementById("builder_percentage").value = _percentage;
      }
      get percentage() {
         return Number(this._shadowRoot.getElementById("builder_percentage").value);
      }

      set barColor(_barColor) {
         this._shadowRoot.getElementById("builder_barColor").value = _barColor;
      }
      get barColor() {
         return this._shadowRoot.getElementById("builder_barColor").value;
      }

      set emptyBarColor(_emptyBarColor) {
         this._shadowRoot.getElementById("builder_emptyBarColor").value = _emptyBarColor;
      }
      get emptyBarColor() {
         return this._shadowRoot.getElementById("builder_emptyBarColor").value;
      }
   }

   customElements.define("com-orlen-sap-orlencircleprogressbarwidget-builder", WidgetBuilder);
})();
