import {
  List,
  Map,
  fromJS
} from 'immutable';
import {
  familyNames,
  givenNames,
  nameDic,
  decorator,
  noun
} from './resource/name_dic'
import _ from 'underscore'

const TIP_MAP = {
  '0': ['我是假的', '第15个字母', '徐阳东的男朋友个数'],
}

function uuid(len, radix) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  var uuid = [],
    i;
  radix = radix || chars.length;
  if (len) {
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
  } else {
    var r;
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.join('');
}

function genCode() {
  return _.uniqueId('00000').slice(-3)
}

//生成名字
export function getName() {
  var i = parseInt(10 * Math.random()) * 10 + parseInt(10 * Math.random());
  var familyName = familyNames[i];

  var j = parseInt(10 * Math.random()) * 10 + parseInt(10 * Math.random());
  var givenName = givenNames[i];

  var name = familyName + givenName;
  return name
}

export function getName2() {
  var index = parseInt(uuid(2, 10))
  return nameDic[index]
}

export function getName3() {
  var indexDecorator = parseInt(uuid(2, 8))
  var indexNoun = parseInt(uuid(1, 10))
  return decorator[indexDecorator] + '的' + noun[indexNoun]
}

export const INITIAL_STATE = fromJS({
  targetValue: 24,
  stage: 'PREPARE_STAGE',
})

export function setEntries(state, entries) {
  const list = List(entries);
  return state.set('entries', list)
    .set('initialEntries', list);
}

export function genElement(source) {
  return Map({
    value: ~~(Math.random() * 9) + 1,
    code: genCode(),
    source,
  })
}

function getWinners(vote) {
  if (!vote) return [];
  const [one, two] = vote.get('pair');
  const oneVotes = vote.getIn(['tally', one], 0);
  const twoVotes = vote.getIn(['tally', two], 0);
  if (oneVotes > twoVotes) return [one];
  else if (oneVotes < twoVotes) return [two];
  else return [one, two];
}

export function next(state, round = state.getIn(['vote', 'round'], 0)) {
  const entries = state.get('entries')
    .concat(getWinners(state.get('vote')));
  if (entries.size === 1) {
    return state.remove('vote')
      .remove('entries')
      .set('winner', entries.first());
  } else {
    return state.merge({
      vote: Map({
        round: round + 1,
        pair: entries.take(2)
      }),
      entries: entries.skip(2)
    });
  }
}

export function restart(state) {
  const round = state.getIn(['vote', 'round'], 0);
  return next(
    state.set('entries', state.get('initialEntries'))
    .remove('vote')
    .remove('winner'),
    round
  );
}

function removePreviousVote(voteState, voter) {
  const previousVote = voteState.getIn(['votes', voter]);
  if (previousVote) {
    return voteState.updateIn(['tally', previousVote], t => t - 1)
      .removeIn(['votes', voter]);
  } else {
    return voteState;
  }
}

function addVote(voteState, entry, voter) {
  if (voteState.get('pair').includes(entry)) {
    return voteState.updateIn(['tally', entry], 0, t => t + 1)
      .setIn(['votes', voter], entry);
  } else {
    return voteState;
  }
}

export function vote(voteState, entry, voter) {
  return addVote(
    removePreviousVote(voteState, voter),
    entry,
    voter
  );
}