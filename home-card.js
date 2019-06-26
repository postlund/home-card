import { THEMES } from './themes.js';

const LitElement = Object.getPrototypeOf(
  customElements.get("ha-panel-lovelace")
);
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

const VERSION = 3;

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
      hass: {},
      held: false,
      timer: {},
    };
  }

  static async getConfigElement() {
    await import("./home-card-editor.js");
    return document.createElement("home-card-editor");
  }

  static getStubConfig() {
    return {
      tap_action: { action: "more-info" },
      hold_action: { action: "none" },
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
    try {
      if (this.config.background == 'paper-card') {
        return html `<ha-card>${this.make_content()}</ha-card>`;
      }

      return this.make_content();
    } catch (error) {
      return html `
              <ha-card>
                <div class="error-message">
                  ${error}
                </div>
              </ha-card>
        `;
    }
  }

  make_content() {
    var weather = "";
    var resources = "";

    if (this.config.weather) {
      var weatherObj = this.stateObject('weather', this.config.weather);
      weather = html `
                 <div id="weather">
                   <img id="weather-icon" src="${this.imgPath("weather-" + weatherObj.state + ".png")}" />
                   <span id="weather-info">
                     ${weatherObj.attributes.friendly_name}
                     ${weatherObj.attributes.temperature}${this.hass.config.unit_system.temperature}
                   </span>
                  </div>`;
    }

    if (this.config.resources) {
	resources = html `
                     <div id="resource-usage">
                       ${this.config.resources.map(resource => this.make_resource(resource))}
                    </div>`;
    }

    return html `
            <div id="root">
              ${weather}
              <div id="house">
                <img id="house-image" src="${this.imgPath(this.theme.house)}" />
                ${this.make_entities()}
              </div>
              ${resources}
            </div>
      `;
  }

  make_resource(resource) {
    var stateObj = this.stateObject('resources', resource.entity);
    return html `
            <span @mousedown="${ev => this._down(resource)}"
                  @touchstart="${ev => this._down(resource)}"
                  @mouseup="${ev => this._up(resource, false)}">
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

      var stateObj = this.stateObject('entities', entity.entity);

      var state = stateObj.state;
      if (entity.state_map && stateObj.state in entity.state_map) {
        state = entity.state_map[stateObj.state];
      }

      var overlay = this.theme.overlays[entity.type][state];
      if (overlay) {
        for (var i = 0; i < overlay.length; ++i) {
          var imageName = entity.type + '_' + stateObj.state + '_' + i;
          to_add.push(this.create_overlay(
            imageName, overlay[i].image, overlay[i].style, entity));
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
                 @mousedown="${ev => this._down(entity)}"
                 @touchstart="${ev => this._down(entity)}"
                 @mouseup="${ev => this._up(entity, true)}" />
    `
  }

  imgPath(filename) {
    return `/local/home-card/themes/${this.config.theme}/${filename}?v=${VERSION}`;
  }

  stateObject(source, entity_id) {
    if (!entity_id) {
      throw Error(`Empty entity id specified in ${source}`);
    }

    var stateObj = this.hass.states[entity_id];
    if (!stateObj) {
      throw Error(`The entity "${entity_id}" does not exist (${source})`)
    }

    return stateObj;
  }

  // The function contains so much magic...
  get_entity_action(config, action) {
    // If action is specified for this entity, use that
    if (config[action]) {
      return config[action];
    }

    // If no action is specified, use theme defined action
    if (this.theme.overlay_actions) {
      var overlayActions = this.theme.overlay_actions;

      // First check for specific overlay in theme
      if (overlayActions[config.type] && overlayActions[config.type][action]) {
        return overlayActions[config.type][action];
      }

      // Next check default for all overlays in theme
      if (overlayActions['*'] && overlayActions['*'][action]) {
        return overlayActions['*'][action];
      }
    }

    // If no theme action, fallback to default action
    return { action: 'more-info', };
  }

  // Tap/hold for resources are hardcoded to more-info for now (maybe configurable in the future)
  get_resource_action(action) {
    return { 'action':  'more-info'};
  }

  handleClick(config, actionConfig) {
    switch (actionConfig.action) {
      case "more-info":
        if (config.entity || config.camera_image) {
          fireEvent(this, "hass-more-info", {
            entityId: config.entity ? config.entity : config.camera_image,
          });
        }
        break;
      case "navigate":
        if (actionConfig.navigation_path) {
          history.pushState(null, "", actionConfig.navigation_path);
          fireEvent(window, "location-changed");
        }
        break;
      case "toggle":
        if (!config.entity) {
          return;
        }

        if (config.entity.startsWith("cover.")) {
          var coverState = this.hass.states[config.entity].state;
          this.hass.callService('cover',
                               coverState == 'open' ? 'close_cover' : 'open_cover',
                               {'entity_id': config.entity});
        } else {
          this.hass.callService('homeassistant', 'toggle', {'entity_id': config.entity});
        }
        break;
      case "call-service": {
        if (actionConfig.service) {
          const [domain, service] = actionConfig.service.split(".", 2);
          this.hass.callService(domain, service, actionConfig.service_data);
        }
      }
    }
  }

  _down(config) {
    if (!this.timer) {
      this.timer = window.setTimeout(() => { this.held = true; }, 500);
      this.held = false;
    }
  }

  _up(config, is_overlay) {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;

      let actionConfig = undefined;
      if (is_overlay) {
        actionConfig = this.get_entity_action(config, this.held ? 'hold_action' : 'tap_action');
      } else {
        actionConfig = this.get_resource_action(this.held ? 'hold_action' : 'tap_action')
      }
      this.handleClick(config, actionConfig);
    }
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
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
        grid-auto-rows: 20px;
        grid-gap: 5px;
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
      .error-message {
        flex: 1;
        background-color: yellow;
        padding: 1em;
      }
  `;
  }
}

customElements.define('home-card', HomeCard);
