import {
  INITIAL_STATE,
  genElement,
  genPlayer,
  valueFromElements,
} from './core'
import {
  Map,
  List,
  fromJS,
} from 'immutable'

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    // Prepare stage.
    case 'JOIN_GAME':
      return state.updateIn(['player', action.clientId], player => player || genPlayer())
    case 'TOGGLE_READY':
      return state.updateIn(['player', action.clientId, 'isReady'], v => !v)

      // Playing stage.
    case 'START_GAME':
      return state.set('stage', 'PLAYING_STAGE')
        .update('player', players => players.filter(player => player.get('isReady')).map((player, playerId) => player.set('elements', List([genElement(playerId)]))).map(player => player.set('value', valueFromElements(player.get('elements')))))
        .setIn(['game', 'startTime'], Date.now())
    case 'RESORT_ELEMENTS':
      return state.updateIn(['player', action.clientId], player => player.set('elements', action.newElements).set('value', valueFromElements(action.newElements)))
    case 'ADD_ANOTHER_ELEMENT':
      return state.updateIn(['player', action.clientId, 'elements'], (elements) => {
        if (!elements.some(v => v.get('code') === action.code)) {
          const elementsList = state.get('player').toList().map(v => v.get('elements')).flatten(1)
          if (elementsList.find(v => v.get('code') === action.code)) {
            return elements.push(elementsList.find(v => v.get('code') === action.code).delete('tip'))
          }
        }

        return elements
      }).updateIn(['player', action.clientId], player => player.set('value', valueFromElements(player.get('elements'))))
    case 'DELETE_ELEMENT':
      return state
        .updateIn(['player', action.clientId, 'elements'], elements => elements.filter(v => v.get('tip') || v.get('code') !== action.code))
        .updateIn(['player', action.clientId], player => player.set('value', valueFromElements(player.get('elements'))))
  }

  return state;
}