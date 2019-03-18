export const THEMES = {
  'two_story_with_garage': {
    'house': 'house.png',
    'overlay_actions': {
      '*': {
        'tap_action': {
          'action': 'toggle',
        },
        'hold_action': {
          'action': 'more-info',
        },
      },
      'car': {
        'tap_action': {
          'action': 'more-info',
        },
      }
    },
    'overlays': {
      'door': {
        'on': [
          {
            'image': 'door-close.png',
            'style': { 'width': '10%', 'left': '39%', 'top': '80.5%', 'z-index': '10'},
          }
        ],
        'off': [
          {
            'image': 'door-open.png',
            'style': { 'width': '10%', 'left': '39%', 'top': '80.5%', 'z-index': '10'},
          },
        ],
      },
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
      'outside_light': {
        'on': [
          {
            'image': 'outside-light-on.png',
            'style': { 'width': '9%', 'left': '8%', 'top': '92%', 'z-index': '10' },
          },
          {
            'image': 'outside-light-on.png',
            'style': { 'width': '9%', 'left': '56%', 'top': '92%', 'z-index': '10' },
          },
          {
            'image': 'outside-light-on.png',
            'style': { 'width': '9%', 'left': '94%', 'top': '92%', 'z-index': '10' },
          },
        ],
        'off': [
          {
            'image': 'outside-light-off.png',
            'style': { 'width': '9%', 'left': '8%', 'top': '92%', 'z-index': '10' },
          },
          {
            'image': 'outside-light-off.png',
            'style': { 'width': '9%', 'left': '56%', 'top': '92%', 'z-index': '10' },
          },
          {
            'image': 'outside-light-off.png',
            'style': { 'width': '9%', 'left': '94%', 'top': '92%', 'z-index': '10' },
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