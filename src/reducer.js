import {
  setEntries,
  next,
  restart,
  vote,
  INITIAL_STATE,
  genElement,
  getName,
  getName2,
  getName3,
} from './core';
import {
  Map,
  List,
} from 'immutable'
import moniker from 'moniker'
export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    // Prepare stage.
    case 'JOIN_GAME':
      return state.updateIn(['player', action.clientId], player => player || Map({
        name: getName3(),
        isReady: false,
        phone: '',
        elements: List(),
      }))
    case 'TOGGLE_READY':
      return state.updateIn(['player', action.clientId, 'isReady'], v => !v)
        .setIn(['player', action.clientId, 'phone'], action.phone)

      // Playing stage.
    case 'START_GAME':
      return state.set('stage', 'PLAYING_STAGE')
        .update('player', players => players.filter(player => player.get('isReady')).map((player, playerId) => player.set('elements', List([genElement(playerId)]))))

    case 'SET_ENTRIES':
      return setEntries(state, action.entries);
    case 'NEXT':
      return next(state);
    case 'RESTART':
      return restart(state);
    case 'VOTE':
      return state.update('vote',
        voteState => vote(voteState, action.entry, action.clientId));
  }
  return state;
}
