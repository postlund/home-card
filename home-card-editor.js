import { THEMES } from './themes.js';

// Not sure this is really needed, should be available through the frontend?
const deps = ['paper-input', 'paper-dropdown-menu', 'paper-item', 'paper-listbox'];
deps.map(dep => {
  if (!customElements.get(dep)) {
    console.log("imported", dep);
    import(`https://unpkg.com/@polymer/${dep}/${dep}.js?module`);
  }
});

const fireEvent = (node, type, detail, options) => {
  options = options || {};
  detail = detail === null || detail === undefined ? {} : detail;
  const event = new Event(type, {
    bubbles: options.bubbles === undefined ? true : options.bubbles,
    cancelable: Boolean(options.cancelable),
    composed: options.composed === undefined ? true : options.composed
  });
  event.detail = detail;
  node.dispatchEvent(event);
  return event;
};

const LitElement = Object.getPrototypeOf(
  customElements.get("ha-panel-lovelace")
);
const html = LitElement.prototype.html;

export class HomeCardEditor extends LitElement {
  setConfig(config) {
    this.config = config;
  }

  static get properties() {
    return {
      hass: {},
      config: {}
    };
  }

  get _weather() {
    return this.config.weather || "";
  }

  render() {
    if (!this.hass) {
      return html``;
    }
    return html`
      <div class="card-config">
          ${this.make_dropdown("Theme", "theme", Object.keys(Object.assign({}, THEMES, this.config.custom_themes)))}
          ${this.make_dropdown("Background", "background", ["transparent", "paper-card"])}
          <paper-input
            label="Weather"
            .value="${this._weather}"
            .configValue="${"weather"}"
            @value-changed="${this._valueChanged}"
          ></paper-input>
      </div>
    `;
  }

  make_dropdown(label, configValue, items) {
    var selected = Math.max(0, items.indexOf(this.config[configValue]));
    return html`
            <div>
              <paper-dropdown-menu
                label="${label}"
                .configValue="${configValue}"
                @value-changed="${this._valueChanged}">
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

  _valueChanged(ev) {
    if (!this.config || !this.hass) {
      return;
    }
    const target = ev.target;
    if (this[`_${target.configValue}`] === target.value) {
      return;
    }
    if (target.configValue) {
      if (target.value === "") {
        delete this.config[target.configValue];
      } else {
        this.config = {
          ...this.config,
          [target.configValue]: target.value
        };
      }
    }
    fireEvent(this, "config-changed", { config: this.config });
  }
}

customElements.define("home-card-editor", HomeCardEditor);