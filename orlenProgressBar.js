(function () {
  'use strict';

  class OrlenProgressBar extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: 'open' });
      this._props = {};

      // Domyślne właściwości
      this._bottomColor = '#ff0000';      // Kolor wypełnienia dolnego bloku
      this._middleColor = '#00ff00';      // Kolor wypełnienia środkowego bloku
      this._topColor = '#0000ff';         // Kolor wypełnienia górnego bloku
      this._borderColor = '#000';         // Kolor obramowania
      this._animationspeed = 100;         // Czas trwania animacji jednego segmentu (ms)
      this._backgroundcolor = 'transparent'; // Kolor tła (domyślnie przezroczysty)
      this._progress = 100;               // Poziom wypełnienia (0–100 %)
      this._enableAnimation = true;       // Włączona animacja domyślnie
      this._loop = true;                  // Zapętlenie animacji domyślnie
      // Nowe właściwości: liczba segmentów w blokach
      this._bottomCount = 3;              // Dolny blok
      this._middleCount = 6;              // Środkowy blok
      this._topCount = 6;                 // Górny blok
      this._loopAnimationRunning = false;
      this._loopAnimationTimer = null;
      
      // Renderujemy segmenty według ustawionej konfiguracji
      this._renderSegments();
      this.updateFill();
    }

    // Metoda, która renderuje segmenty na podstawie sumarycznej liczby
    _renderSegments() {
      // Obliczamy całkowitą liczbę segmentów
      this._totalSegments = this._bottomCount + this._middleCount + this._topCount;
      // Czyścimy kontener segmentów, jeśli już istnieje
      if (this._segmentsContainer) {
        this._segmentsContainer.innerHTML = "";
      } else {
        this._segmentsContainer = document.createElement('div');
        this._segmentsContainer.className = 'segments-container';
        // Główny kontener (_container) zostanie utworzony w konstruktorze poniżej, ale już mamy go
        if (!this._container) {
          this._container = document.createElement('div');
          this._container.className = 'progress-bar-container';
          this._shadowRoot.appendChild(this._container);
        }
        this._container.appendChild(this._segmentsContainer);
      }
      // Utworzenie stylów – dodajemy również styl dla głównego kontenera
      if (!this._styleElement) {
        this._styleElement = document.createElement('style');
        this._styleElement.textContent = `
          :host {
            --bottom-color: ${this._bottomColor};
            --middle-color: ${this._middleColor};
            --top-color: ${this._topColor};
            --animation-speed: ${this._animationspeed}ms;
            --border-color: ${this._borderColor};
            --background-color: ${this._backgroundcolor};
          }
          .progress-bar-container {
            width: 100px;
            height: 300px;
            border-radius: 5px;
            overflow: hidden;
            position: relative;
            background: var(--background-color);
            clip-path: polygon(0% 0%, 100% 0%, 80% 100%, 0% 100%);
          }
          .segments-container {
            display: flex;
            flex-direction: column;
            height: 100%;
            width: 100%;
            gap: 10px;
            margin: 0;
            padding: 0;
            background: none;
          }
          .segment {
            position: relative;
            flex: 1;
            border: 1px solid var(--border-color);
            box-sizing: border-box;
          }
          .fill {
            width: 100%;
            height: 100%;
            transform: scaleY(0);
            transform-origin: bottom;
          }
        `;
        this._shadowRoot.appendChild(this._styleElement);
      }
      
      // Usuwamy poprzednią tablicę segmentów
      this._segments = [];
      // Łączna liczba segmentów
      for (let i = 0; i < this._totalSegments; i++) {
        const segment = document.createElement('div');
        segment.className = 'segment';
        // Obliczamy clip-path na podstawie całkowitej liczby segmentów
        const topRight = (100 - (20 / this._totalSegments) * i).toFixed(2);
        const bottomRight = (100 - (20 / this._totalSegments) * (i + 1)).toFixed(2);
        segment.style.clipPath = `polygon(0% 0%, calc(${topRight}% + 2px) 0%, calc(${bottomRight}% + 2px) 100%, 0% 100%)`;
        const fill = document.createElement('div');
        fill.className = 'fill';
        segment.appendChild(fill);
        this._segmentsContainer.appendChild(segment);
        this._segments.push({ segment, fill });
      }
    }

    static get observedAttributes() {
      return [
        'bordercolor',
        'animationspeed',
        'backgroundcolor',
        'progress',
        'enableanimation',
        'loop',
        'bottomcolor',
        'middlecolor',
        'topcolor',
        'bottomcount',
        'middlecount',
        'topcount'
      ];
    }

    attributeChangedCallback(name, oldValue, newValue) {
      switch (name) {
        case 'bordercolor':
          this._borderColor = newValue;
          this.style.setProperty('--border-color', newValue);
          this._segments.forEach(({ segment }) => {
            segment.style.border = `1px solid ${this._borderColor}`;
          });
          break;
        case 'animationspeed':
          this._animationspeed = parseInt(newValue);
          this.style.setProperty('--animation-speed', `${this._animationspeed}ms`);
          this.updateFill();
          break;
        case 'backgroundcolor':
          this._backgroundcolor = newValue;
          this.style.setProperty('--background-color', newValue);
          if (this._container) {
            this._container.style.background = newValue;
          }
          break;
        case 'progress':
          this._progress = parseFloat(newValue);
          this.updateFill();
          break;
        case 'enableanimation':
          this._enableAnimation = newValue === "true";
          this.updateFill();
          break;
        case 'loop':
          this._loop = newValue === "true";
          this.updateFill();
          break;
        case 'bottomcolor':
          this._bottomColor = newValue;
          this.style.setProperty('--bottom-color', newValue);
          this.updateFill();
          break;
        case 'middlecolor':
          this._middleColor = newValue;
          this.style.setProperty('--middle-color', newValue);
          this.updateFill();
          break;
        case 'topcolor':
          this._topColor = newValue;
          this.style.setProperty('--top-color', newValue);
          this.updateFill();
          break;
        case 'bottomcount':
          this._bottomCount = parseInt(newValue);
          this._renderSegments();
          this.updateFill();
          break;
        case 'middlecount':
          this._middleCount = parseInt(newValue);
          this._renderSegments();
          this.updateFill();
          break;
        case 'topcount':
          this._topCount = parseInt(newValue);
          this._renderSegments();
          this.updateFill();
          break;
      }
    }

    updateFill() {
      const total = this._totalSegments;
      // Obliczamy ułamek wypełnienia jako suma segmentów, przy czym wypełnienie liczone jest od dołu (revIndex)
      const fraction = (this._progress / 100) * total;
      this._segments.forEach((item, index) => {
        const revIndex = total - 1 - index; // odwrócony indeks: dolny = 0, górny = total-1
        // Określenie, do którego bloku należy dany segment
        let groupColor = this._bottomColor;
        if (revIndex >= this._bottomCount && revIndex < this._bottomCount + this._middleCount) {
          groupColor = this._middleColor;
        } else if (revIndex >= this._bottomCount + this._middleCount) {
          groupColor = this._topColor;
        }
        // Obliczanie stopnia wypełnienia dla segmentu
        let fillAmount = 0;
        if (revIndex + 1 <= fraction) {
          fillAmount = 1;
        } else if (revIndex < fraction && fraction < revIndex + 1) {
          fillAmount = fraction - revIndex;
        } else {
          fillAmount = 0;
        }
        item.fill.style.background = groupColor;
        if (this._enableAnimation) {
          item.fill.style.transition = `transform ${this._animationspeed}ms ease-in-out ${revIndex * this._animationspeed}ms`;
        } else {
          item.fill.style.transition = 'none';
        }
        item.fill.style.transform = `scaleY(${fillAmount})`;
      });

      // Jeśli pętla aktywna, animacja włączona i progress osiągnął 100%, uruchamiamy ciągłą pętlę
      if (this._enableAnimation && this._loop && this._progress >= 100) {
        if (!this._loopAnimationRunning) {
          this._loopAnimationRunning = true;
          const loopCycle = () => {
            // Reset – ustawienie wypełnienia na 0
            this._segments.forEach(item => {
              item.fill.style.transition = 'none';
              item.fill.style.transform = 'scaleY(0)';
            });
            void this.offsetWidth; // wymuszenie reflow
            // Animacja wypełnienia dla każdego segmentu, od dołu do góry
            this._segments.forEach((item, index) => {
              const revIndex = total - 1 - index;
              item.fill.style.transition = `transform ${this._animationspeed}ms ease-in-out ${revIndex * this._animationspeed}ms`;
              item.fill.style.transform = 'scaleY(1)';
            });
            this._loopAnimationTimer = setTimeout(() => {
              if (this._loop && this._progress >= 100 && this._enableAnimation) {
                loopCycle();
              } else {
                this._loopAnimationRunning = false;
              }
            }, total * this._animationspeed);
          };
          loopCycle();
        }
      } else {
        if (this._loopAnimationRunning && this._loopAnimationTimer) {
          clearTimeout(this._loopAnimationTimer);
          this._loopAnimationRunning = false;
        }
      }
    }

    onCustomWidgetBeforeUpdate(changedProperties) {
      this._props = { ...this._props, ...changedProperties };
    }

    onCustomWidgetAfterUpdate(changedProperties) {
      // W przypadku dynamicznej aktualizacji – przypisujemy nowe wartości i odświeżamy wypełnienie
      if ("bordercolor" in changedProperties) {
        this._borderColor = changedProperties.bordercolor;
        this.style.setProperty('--border-color', this._borderColor);
        this._segments.forEach(({ segment }) => {
          segment.style.border = `1px solid ${this._borderColor}`;
        });
      }
      if ("animationspeed" in changedProperties) {
        this._animationspeed = changedProperties.animationspeed;
        this.style.setProperty('--animation-speed', `${this._animationspeed}ms`);
        this.updateFill();
      }
      if ("backgroundcolor" in changedProperties) {
        this._backgroundcolor = changedProperties.backgroundcolor;
        this.style.setProperty('--background-color', this._backgroundcolor);
        this._container.style.background = this._backgroundcolor;
      }
      if ("progress" in changedProperties) {
        this._progress = changedProperties.progress;
        this.updateFill();
      }
      if ("enableanimation" in changedProperties) {
        this._enableAnimation = (changedProperties.enableanimation === "true" || changedProperties.enableanimation === true);
        this.updateFill();
      }
      if ("loop" in changedProperties) {
        this._loop = (changedProperties.loop === "true" || changedProperties.loop === true);
        this.updateFill();
      }
      if ("bottomcolor" in changedProperties) {
        this._bottomColor = changedProperties.bottomcolor;
        this.style.setProperty('--bottom-color', this._bottomColor);
        this.updateFill();
      }
      if ("middlecolor" in changedProperties) {
        this._middleColor = changedProperties.middlecolor;
        this.style.setProperty('--middle-color', this._middleColor);
        this.updateFill();
      }
      if ("topcolor" in changedProperties) {
        this._topColor = changedProperties.topcolor;
        this.style.setProperty('--top-color', this._topColor);
        this.updateFill();
      }
      if ("bottomcount" in changedProperties) {
        this._bottomCount = changedProperties.bottomcount;
        this._renderSegments();
        this.updateFill();
      }
      if ("middlecount" in changedProperties) {
        this._middleCount = changedProperties.middlecount;
        this._renderSegments();
        this.updateFill();
      }
      if ("topcount" in changedProperties) {
        this._topCount = changedProperties.topcount;
        this._renderSegments();
        this.updateFill();
      }
    }
  }

  customElements.define('com-sap-analytics-custom-widget-orlenprogressbar', OrlenProgressBar);
})();

