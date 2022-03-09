import { THEMES } from './themes.js';

const LitElement = Object.getPrototypeOf(
  customElements.get("ha-panel-lovelace")
);
const html = LitElement.prototype.html;

export const fireEvent = (node, type, detail = {}, options = {}) => {
  const event = new Event(type, {
    bubbles: options.bubbles === undefined ? true : options.bubbles,
    cancelable: Boolean(options.cancelable),
    composed: options.composed === undefined ? true : options.composed,
  });

  event.detail = detail;
  node.dispatchEvent(event);
  return event;
};

export class HomeCardEditor extends LitElement {
  
  static get properties() {
    return { hass: {}, _config: {} };
  }
  
  setConfig(config) {
    this._config = config;
    }

  get getWeathers() {
    const weathers = Object.keys(this.hass.states).filter(eid => {
      return ['weather'].includes(eid.substr(0, eid.indexOf('.')));
    });

    weathers.sort();
    return weathers;
  }
/*  
  get getClimates() {
    const climates = Object.keys(this.hass.states).filter(eid => {
      return ['climate'].includes(eid.substr(0, eid.indexOf('.')));
    });

    climates.sort();
    return climates;
  }
*/
  firstUpdated() {
    this._firstRendered = true;
  }

  render() {
    if (!this.hass) {
      return html``;
    }

    const weathers = this.getWeathers.map(entity => {
      return html`<paper-item>${entity}</paper-item>`;
    });
/*    
    const climates = this.getClimates.map(entity => {
      return html`<paper-item>${entity}</paper-item>`;
    });
*/
    return html`
      <div class="card-config">
          ${this.make_dropdown("Theme", "theme", Object.keys(Object.assign({}, THEMES, this._config.custom_themes)))}
          
          ${this.make_dropdown("Background", "background", ["transparent", "paper-card"])}
          
          <paper-dropdown-menu 
            label="Weather (optional)"
            @value-changed="${this.configChanged}" 
            .configValue="${'weather'}"
          >
            <paper-listbox 
              slot="dropdown-content" 
              .selected="${this.getWeathers.indexOf(this._config.entity)}"
            >
              ${weathers}
            </paper-listbox>
          </paper-dropdown-menu>
          
      </div>
    `;
  }
  
/*          
          <paper-dropdown-menu 
            label="Climate (optional)"
            @value-changed="${this.configChanged}" 
            .configValue="${'climate'}"
          >
            <paper-listbox 
              slot="dropdown-content" 
              .selected="${this.getClimates.indexOf(this._config.entity)}"
            >
              ${climates}
            </paper-listbox>
          </paper-dropdown-menu>
          
      </div>
    `;
  }
*/ 
    make_dropdown(label, configValue, items) {
    var selected = Math.max(0, items.indexOf(this._config[configValue]));
    return html`
            <div>
              <paper-dropdown-menu
                label="${label}"
                .configValue="${configValue}"
                @value-changed="${this.configChanged}">
                  <paper-listbox slot="dropdown-content" selected="${selected}">
                    ${items.map(
                      (name) => html`
                        <paper-item>${name}</paper-item>
                      `
                    )}
                    </paper-listbox>
              </paper-dropdown-menu>
            </div>
      `;
  }

  configChanged(ev) {
    if (!this._config || !this.hass || !this._firstRendered) return;
    const {
      target: { configValue, value },
      detail: { value: checkedValue },
    } = ev;

    if (checkedValue !== undefined || checkedValue !== null) {
      this._config = { ...this._config, [configValue]: checkedValue };
    } else {
      this._config = { ...this._config, [configValue]: value };
    }

    fireEvent(this, 'config-changed', { config: this._config });
  }
}

customElements.define("home-card-editor", HomeCardEditor);
