(function () {
  class KalendarzMiesieczny2Builder extends HTMLElement {
    constructor() {
      super();

      this.innerHTML = `
        <form id="form">
          <fieldset>
            <legend>Ustawienia kalendarza</legend>

            <label>Minimalny rok:</label><br>
            <input type="number" id="minYear"><br><br>

            <label>Maksymalny rok:</label><br>
            <input type="number" id="maxYear"><br><br>

            <label>Miesiące numerycznie:</label><br>
            <input type="checkbox" id="numericMonths"><br><br>

            <label>Kolor tła miesięcy:</label><br>
            <input type="color" id="monthBgColor"><br><br>

            <label>Kolor tła kwartałów:</label><br>
            <input type="color" id="quarterBgColor"><br><br>

            <label>Kolor czcionki:</label><br>
            <input type="color" id="fontColor"><br><br>

            <label>Czcionka (np. Arial):</label><br>
            <input type="text" id="fontFamily"><br><br>

            <label>Kolor aktywnej komórki:</label><br>
            <input type="color" id="activeCellColor"><br><br>

            <label>Kolor tła przycisków:</label><br>
            <input type="color" id="buttonColor"><br><br>

            <label>Kolor tekstu przycisków:</label><br>
            <input type="color" id="buttonTextColor"><br><br>

            <button type="submit">Zapisz</button>
          </fieldset>
        </form>
      `;

      this.querySelector("#form").addEventListener("submit", (e) => {
        e.preventDefault();
        this._updateProperties();
      });
    }

    getProperties() {
      return {
        minYear: parseInt(this.querySelector("#minYear").value),
        maxYear: parseInt(this.querySelector("#maxYear").value),
        numericMonths: this.querySelector("#numericMonths").checked,
        monthBgColor: this.querySelector("#monthBgColor").value,
        quarterBgColor: this.querySelector("#quarterBgColor").value,
        fontColor: this.querySelector("#fontColor").value,
        fontFamily: this.querySelector("#fontFamily").value,
        activeCellColor: this.querySelector("#activeCellColor").value,
        buttonColor: this.querySelector("#buttonColor").value,
        buttonTextColor: this.querySelector("#buttonTextColor").value
      };
    }

    setProperties(props) {
      this.querySelector("#minYear").value = props.minYear ?? 2000;
      this.querySelector("#maxYear").value = props.maxYear ?? 2035;
      this.querySelector("#numericMonths").checked = !!props.numericMonths;
      this.querySelector("#monthBgColor").value = props.monthBgColor ?? "#ffffff";
      this.querySelector("#quarterBgColor").value = props.quarterBgColor ?? "#eeeeee";
      this.querySelector("#fontColor").value = props.fontColor ?? "#000000";
      this.querySelector("#fontFamily").value = props.fontFamily ?? "Arial";
      this.querySelector("#activeCellColor").value = props.activeCellColor ?? "#3399ff";
      this.querySelector("#buttonColor").value = props.buttonColor ?? "#f0f0f0";
      this.querySelector("#buttonTextColor").value = props.buttonTextColor ?? "#000000";
    }

    _updateProperties() {
      const props = this.getProperties();
      console.log("Wysłano propertiesChanged:", props);
      this.dispatchEvent(new CustomEvent("propertiesChanged", {
        detail: {
          properties: props
        }
      }));
    }
  }

  customElements.define(
    "com-sap-analytics-custom-widget-monthlycalendar-2-builder",
    KalendarzMiesieczny2Builder
  );
})();
