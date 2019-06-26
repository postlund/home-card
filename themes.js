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
      },
      'sprinkler': {
        'tap_action': {
          'action': 'more-info',
        },
      },
    },
    'overlays': {
      'door': {
        'on': [
          {
            'image': 'door-close.png',
            'style': { 'width': '8%', 'left': '40%', 'top': '68.5%', 'z-index': '10'},
          }
        ],
        'off': [
          {
            'image': 'door-open.png',
            'style': { 'width': '8%', 'left': '40%', 'top': '68.5%', 'z-index': '10'},
          },
        ],
      },
      'garage': {
        'open': [
          {
            'image': 'garage-open.png',
            'style': { 'width': '21%', 'left': '73.5%', 'top': '67.5%', 'z-index': '10' },
          },
        ],
        'closed': [
          {
          'image': 'garage-close.png',
          'style': { 'width': '21%', 'left': '73.5%', 'top': '67.5%', 'z-index': '10' },
          },
        ],
      },
      'outside_light': {
        'on': [
          {
            'image': 'outside-light-on.png',
            'style': { 'width': '8%', 'left': '10%', 'top': '77%', 'z-index': '10' },
          },
          {
            'image': 'outside-light-on.png',
            'style': { 'width': '8%', 'left': '56%', 'top': '77%', 'z-index': '10' },
          },
          {
            'image': 'outside-light-on.png',
            'style': { 'width': '8%', 'left': '91%', 'top': '77%', 'z-index': '10' },
          },
        ],
        'off': [
          {
            'image': 'outside-light-off.png',
            'style': { 'width': '8%', 'left': '10%', 'top': '77%', 'z-index': '10' },
          },
          {
            'image': 'outside-light-off.png',
            'style': { 'width': '8%', 'left': '56%', 'top': '77%', 'z-index': '10' },
          },
          {
            'image': 'outside-light-off.png',
            'style': { 'width': '8%', 'left': '91%', 'top': '77%', 'z-index': '10' },
          },
        ],
      },
      'downstairs_light': {
        'on': [
          {
            'image': 'window-light.png',
            'style': { 'width': '6%', 'left': '56%', 'top': '61%', 'z-index': '10' },
          },
          {
            'image': 'window-light.png',
            'style': { 'width': '6%', 'left': '17%', 'top': '61%', 'z-index': '10' },
          },
          {
            'image': 'window-light.png',
            'style': { 'width': '6%', 'left': '25%', 'top': '61%', 'z-index': '10' },
          },
        ],
        'off': [
          {
            'image': 'window-dark.png',
            'style': { 'width': '6%', 'left': '56%', 'top': '61%', 'z-index': '10' },
          },
          {
            'image': 'window-dark.png',
            'style': { 'width': '6%', 'left': '17%', 'top': '61%', 'z-index': '10' },
          },
          {
            'image': 'window-dark.png',
            'style': { 'width': '6%', 'left': '25%', 'top': '61%', 'z-index': '10' },
          },
        ]
      },
      'upstairs_light': {
        'on': [
          {
            'image': 'window-light.png',
            'style': { 'width': '6%', 'left': '33%', 'top': '25%', 'z-index': '10' },
          },
        ],
        'off': [
          {
            'image': 'window-dark.png',
            'style': { 'width': '6%', 'left': '33%', 'top': '25%', 'z-index': '10' },
          },
        ]
      },
      'car': {
        'home': [
          {
            'image': 'car.png',
            'style': { 'width': '18%', 'left': '73.5%', 'top': '85%', 'z-index': '10' },
          },
        ],
      },
      'sprinkler': {
        'on': [
          {
            'image': 'sprinkler-on.png',
            'style': { 'left': '23%', 'top': '86%', 'z-index': '10' },
          },
          {
            'image': 'sprinkler-on.png',
            'style': { 'left': '50%', 'top': '89%', 'z-index': '10' },
          },
        ],
        'off': [
          {
            'image': 'sprinkler-off.png',
            'style': { 'left': '23%', 'top': '86%', 'z-index': '10' },
          },
          {
            'image': 'sprinkler-off.png',
            'style': { 'left': '50%', 'top': '89%', 'z-index': '10' },
          },
        ],
      },
    },
  },
};
