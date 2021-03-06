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

function isSameCode(codeStr, codeList) {
  const pre = codeStr.split('').sort().join('')
  const append = codeList.sort().join('')
  return pre === append
}

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    // Prepare stage.
    case 'JOIN_GAME':
      if (state.get('stage') !== 'PREPARE_STAGE') {
        return state
      }
      return state.updateIn(['player', action.clientId], player => player || genPlayer())
    case 'TOGGLE_READY':
      return state.updateIn(['player', action.clientId, 'isReady'], v => !v)

      // Playing stage.
    case 'START_GAME':
      return state.set('stage', 'PLAYING_STAGE')
        .update('player', players => players.filter(player => player.get('isReady')).map((player, playerId) => player.set('elements', List([genElement(playerId)]))).map(player => player.set('value', valueFromElements(player.get('elements')))))
        .setIn(['game', 'startTime'], Date.now())
    case 'RESORT_ELEMENTS':
      return state.updateIn(['player', action.clientId], player => player.set('elements', fromJS(action.newElements)).set('value', valueFromElements(fromJS(action.newElements))))
    case 'ADD_ANOTHER_ELEMENT':
      // 代码默认字母顺序。
      const code = action.codeList

      return state.updateIn(['player', action.clientId, 'elements'], (elements) => {
        if (!elements.some(v => isSameCode(v.get('code'), code.slice()))) {
          const elementsList = state.get('player').toList().map(v => v.get('elements')).flatten(1)
          if (elementsList.find(v => isSameCode(v.get('code'), code.slice()) && v.get('value') == action.targetValue)) {
            return elements.push(elementsList.find(v => isSameCode(v.get('code'), code.slice())).delete('tip'))
          }
        }
        return elements
      }).updateIn(['player', action.clientId], player => player.set('value', valueFromElements(player.get('elements'))))
    case 'DELETE_ELEMENT':
      return state
        .updateIn(['player', action.clientId, 'elements'], elements => elements.filter(v => v.get('tip') || v.get('code') !== action.code))
        .updateIn(['player', action.clientId], player => player.set('value', valueFromElements(player.get('elements'))))
    case 'SIGNAL_COMPLETE':
      return state.updateIn(['result', action.clientId], (record) => {
        record = record ? record : Map()
        return record.set('timestamp', action.timestamp)
      })
  }

  return state;
}