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
  '0': ['测试线索0', '测试线索', '测试线索'],
  '1': ['测试线索1', '测试线索', '测试线索'],
  '2': ['测试线索2', '测试线索', '测试线索'],
  '3': ['测试线索3', '测试线索', '测试线索'],
  '4': ['测试线索4', '测试线索', '测试线索'],
  '5': ['测试线索5', '测试线索', '测试线索'],
  '6': ['测试线索6', '测试线索', '测试线索'],
  '7': ['测试线索7', '测试线索', '测试线索'],
  '8': ['测试线索8', '测试线索', '测试线索'],
  '9': ['测试线索9', '测试线索', '测试线索'],
  '+': ['测试线索10', '测试线索', '测试线索'],
  '-': ['测试线索11', '测试线索', '测试线索'],
  '*': ['测试线索12', '测试线索', '测试线索'],
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

export const genPlayer = () => Map({
  name: getName3(),
  isReady: true,
  elements: List(),
})

export const INITIAL_STATE = fromJS({
  targetValue: 9,
  stage: 'PREPARE_STAGE',
  player: fromJS({
    '001': genPlayer(),
    '002': genPlayer(),
    '003': genPlayer(),
    '004': genPlayer(),
    '005': genPlayer(),
    '006': genPlayer(),
    '007': genPlayer(),
    '008': genPlayer(),
    '009': genPlayer(),
    '010': genPlayer(),
    '011': genPlayer(),
    '012': genPlayer(),
  }),
  game: {
    startTime: null,
    totalTime: 300,
  },
})

export const genElement = function() {
  const ELEMENT_SET = ['+', '-', '*', '4', '0', '2', '3', '7', '5', '9', '1', '6', '8']
  let i = 0

  return (source) => {
    const value = ELEMENT_SET[(i++) % ELEMENT_SET.length]
    return Map({
      value,
      source,
      code: genCode(),
      tip: TIP_MAP[value][0],
    })
  }
}()

export const valueFromElements = (elements) => {
  let result
  try {
    const expr = elements.map(v => v.get('value')).join(" ")
    result = eval(expr)
  } catch (err) {
    result = 0
  }
  return result
}