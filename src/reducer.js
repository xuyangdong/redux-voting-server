import {
  setEntries,
  next,
  restart,
  vote,
  INITIAL_STATE
} from './core';
import {
  Map
} from 'immutable'
import moniker from 'moniker'

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    // Prepare stage.
    case 'JOIN_GAME':
      return state.updateIn(['player', action.clientId], player => player || Map({
        name: moniker.choose(),
        isReady: false,
      }))
    case 'TOGGLE_READY':
      return state.updateIn(['player', action.clientId, 'isReady'], v => !v)

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