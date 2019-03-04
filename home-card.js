const LitElement = Object.getPrototypeOf(
  customElements.get("ha-panel-lovelace")
);
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

const VERSION = 1;

const THEMES = {
  'two_story_with_garage': {
    'house': 'house.png',
    'overlays': {
      'garage': {
        'open': [
          {
            'image': 'garage-open.png',
            'style': { 'width': '24%', 'left': '74%', 'top': '80%', 'z-index': '10' },
          },
        ],
        'closed': [
          {
          'image': 'garage-close.png',
          'style': { 'width': '24%', 'left': '74%', 'top': '80%', 'z-index': '10' },
          },
        ],
      },
      'downstairs_light': {
        'on': [
          {
            'image': 'window-light.png',
            'style': { 'width': '6.5%', 'left': '56%', 'top': '73%', 'z-index': '10' },
          },
          {
            'image': 'window-light.png',
            'style': { 'width': '6.5%', 'left': '16%', 'top': '73%', 'z-index': '10' },
          },
          {
            'image': 'window-light.png',
            'style': { 'width': '6.5%', 'left': '24%', 'top': '73%', 'z-index': '10' },
          },
        ],
        'off': [
          {
            'image': 'window-dark.png',
            'style': { 'width': '6.5%', 'left': '56%', 'top': '73%', 'z-index': '10' },
          },
          {
            'image': 'window-dark.png',
            'style': { 'width': '6.5%', 'left': '16%', 'top': '73%', 'z-index': '10' },
          },
          {
            'image': 'window-dark.png',
            'style': { 'width': '6.5%', 'left': '24%', 'top': '73%', 'z-index': '10' },
          },
        ]
      },
      'upstairs_light': {
        'on': [
          {
            'image': 'window-light.png',
            'style': { 'width': '7%', 'left': '32%', 'top': '30%', 'z-index': '10' },
          },
        ],
        'off': [
          {
            'image': 'window-dark.png',
            'style': { 'width': '7%', 'left': '32%', 'top': '30%', 'z-index': '10' },
          },
        ]
      },
      'car': {
        'home': [
          {
            'image': 'car.png',
            'style': { 'width': '18%', 'left': '74%', 'top': '91%', 'z-index': '10' },
          },
        ],
      },
    },
  },
};

// From weather-card
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

class HomeCard extends LitElement {

  static get properties() {
    return {
      config: {},
      hass: {}
    };
  }

  setConfig(config) {
    if (!config.theme) {
      throw new Error('No house type defined');
    }

    if (THEMES[config.theme]) {
      this.theme = THEMES[config.theme];
    } else if (config.custom_themes[config.theme]) {
      this.theme = config.custom_themes[config.theme];
    } else {
      throw new Error('Unsupported house type: ' + config.theme);
    }

    this.config = config;
  }

  getCardSize() {
    return 4;
  }

  render() {
    var weatherObj = this.hass.states[this.config.weather];
    return html `
            <div id="root">
              ${this.config.weather ?
                html `
                <div id="weather">
                  <img id="weather-icon" src="${this.imgPath("weather-" + weatherObj.state + ".png")}" /> 
                  <span id="weather-info">
                    ${weatherObj.attributes.friendly_name} 
                    ${weatherObj.attributes.temperature}${this.hass.config.unit_system.temperature}
                  </span>
                </div>`
                : ""
              }
              <div id="house">
                <img id="house-image" src="${this.imgPath(this.theme.house)}" />
                ${this.make_entities()}
              </div>
              <div id="resource-usage">
                ${this.config.resources.map(resource => this.make_resource(resource))}
              </div>
            </div>
      `;
  }

  make_resource(resource) {
    var stateObj = this.hass.states[resource.entity];
    return html `
            <span @click="${ev => this.more_info(resource.entity)}">
              <span class="icon">
                <ha-icon icon="${resource.icon || this.get_attribute(stateObj, 'icon', 'mdi:help-rhombus')}" />
              </span>
              <span>${Math.round(stateObj.state) || stateObj.state}</span>
                <span>${resource.unit_of_measurement || this.get_attribute(stateObj, 'unit_of_measurement', '')}</span>
              </span>
            </span>
    `;
  }

  get_attribute(stateObj, name, _default) {
    if (!stateObj['attributes'] || !stateObj.attributes[name]) {
      return _default;
    }

    return stateObj.attributes[name];
  }

  more_info(entity_id) {
    fireEvent(this, "hass-more-info", { entityId: entity_id });
  }

  make_entities() {
    var to_add = []
    Object.keys(this.config.entities).map(index => {
      var entity = this.config.entities[index];

      if (!this.theme.overlays[entity.type]) {
        throw Error('Unsupported entity type: ' + entity.type);
      }

      var stateObj = this.hass.states[entity.entity];
      if (!stateObj) {
        throw Error('Entity does not exist: ' + entity.entity);
      }

      var state = stateObj.state;
      if (entity.state_map && stateObj.state in entity.state_map) {
        state = entity.state_map[stateObj.state];
      }

      var overlay = this.theme.overlays[entity.type][state];
      if (overlay) {
        for (var i = 0; i < overlay.length; ++i) {
          var imageName = entity.type + '_' + stateObj.state + '_' + i;
          to_add.push(this.create_overlay(
            imageName, overlay[i].image, overlay[i].style, entity.entity));
        }
      }
    });
    return to_add;
  }

  create_overlay(imageName, imageFile, style, entity) {
    var styleString = Object.keys(style).map(prop => prop + ": " + style[prop] + ";");
    return html `
            <img id="${imageName}"
                 src="${this.imgPath(imageFile)}"
                 class="element"
                 style="${styleString}"
                 @click="${ev => this.toggle(entity)}" />
    `
  }

  toggle(entity_id) {
    this.hass.callService('homeassistant', 'toggle', { entity_id: entity_id });
  }

  imgPath(filename) {
    return `/local/home-card/themes/${this.config.theme}/${filename}?v=${VERSION}`;
  }

  static get styles() {
    return css `
      #root {
        width: 100%;
        height: auto;
        padding-top: 5%;
        padding-bottom: 5%;
      }
      #weather {
        position: relative;
        overflow: visible;
        height: 100%;
        width: 90%;
        left: 5%;
        margin-bottom: 25px;
      }
      #weather-icon {
        width: 15%;
      }
      #weather-info {
        position: absolute;
        top: 25%;
        margin-left: 20px;
        color: var(--primary-text-color);
        font-weight: 300;
        font-size: 2em;
      }
      #house {
          position: relative;
          overflow: visible;
          height: 100%;
          width: 90%;
          left: 5%;
          z-index: 1;
      }
      #house-image {
        top: 50%;
        width: 100%;
      }
      #resource-usage {
        width: 90%;
        left: 5%;
        height: 100%;
        position: relative;
        margin-top: 25px;
      }
      .element {
        position: absolute;
        transform: translate(-50%, -50%);
      }
      .icon {
        color: var(--paper-item-icon-color, #44739e);
        display: inline-block;
        flex: 0 0 40px;
        line-height: 40px;
        position: relative;
        text-align: center;
        width: 40px;
      }
  `;
  }
}

customElements.define('home-card', HomeCard);
