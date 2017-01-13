import {
  List,
  Map,
  fromJS
} from 'immutable';
import {
  decorator,
  noun
} from './resource/name_dic'
import _ from 'underscore'

const TIP_MAP = {
  '0': ['我是0', '测试线索', '测试线索'],
  '1': ['我是1', '测试线索', '测试线索'],
  '2': ['我是2', '测试线索', '测试线索'],
  '3': ['我是3', '测试线索', '测试线索'],
  '4': ['我是4', '测试线索', '测试线索'],
  '5': ['我是5', '测试线索', '测试线索'],
  '6': ['我是6', '测试线索', '测试线索'],
  '7': ['我是7', '测试线索', '测试线索'],
  '8': ['我是8', '测试线索', '测试线索'],
  '9': ['我是9', '测试线索', '测试线索'],
  '+': ['我是10', '测试线索', '测试线索'],
  '-': ['我是11', '测试线索', '测试线索'],
  '×': ['我是12', '测试线索', '测试线索'],
}

function k_combinations(set, k) {
  var i, j, combs, head, tailcombs;

  // There is no way to take e.g. sets of 5 elements from
  // a set of 4.
  if (k > set.length || k <= 0) {
    return [];
  }

  // K-sized set has only one K-sized subset.
  if (k == set.length) {
    return [set];
  }

  // There is N 1-sized subsets in a N-sized set.
  if (k == 1) {
    combs = [];
    for (i = 0; i < set.length; i++) {
      combs.push([set[i]]);
    }
    return combs;
  }

  // Assert {1 < k < set.length}

  // Algorithm description:
  // To get k-combinations of a set, we want to join each element
  // with all (k-1)-combinations of the other elements. The set of
  // these k-sized sets would be the desired result. However, as we
  // represent sets with lists, we need to take duplicates into
  // account. To avoid producing duplicates and also unnecessary
  // computing, we use the following approach: each element i
  // divides the list into three: the preceding elements, the
  // current element i, and the subsequent elements. For the first
  // element, the list of preceding elements is empty. For element i,
  // we compute the (k-1)-computations of the subsequent elements,
  // join each with the element i, and store the joined to the set of
  // computed k-combinations. We do not need to take the preceding
  // elements into account, because they have already been the i:th
  // element so they are already computed and stored. When the length
  // of the subsequent list drops below (k-1), we cannot find any
  // (k-1)-combs, hence the upper limit for the iteration:
  combs = [];
  for (i = 0; i < set.length - k + 1; i++) {
    // head is a list that includes only our current element.
    head = set.slice(i, i + 1);
    // We take smaller combinations from the subsequent elements
    tailcombs = k_combinations(set.slice(i + 1), k - 1);
    // For each (k-1)-combination we join it with the current
    // and store it to the set of k-combinations.
    for (j = 0; j < tailcombs.length; j++) {
      combs.push(head.concat(tailcombs[j]));
    }
  }
  return combs;
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

const CODE_SET = k_combinations(['R', 'A', 'N', 'D', 'O', 'M'], 3)
const pool = []

function genCode() {

  return CODE_SET.pop().join('')
    // const ret = _.sample(CODE_SET, 3).sort().join("")
    // if (~pool.indexOf(ret)) {
    //   return genCode()
    // } else {
    //   pool.push(ret)
    //   return ret
    // }
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
  var indexDecorator = parseInt(uuid(2, 6)) % 25
  var indexNoun = parseInt(uuid(1, 10)) % 25
  return decorator[indexDecorator] + '的' + noun[indexNoun]
}

export const genPlayer = () => Map({
  name: getName3(),
  isReady: true,
  elements: List(),
})

export const INITIAL_STATE = fromJS({
  targetValue: 24,
  stage: 'PREPARE_STAGE',
  // stage: 'PLAYING_STAGE',
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
  const ELEMENT_SET = ['3', '×', '6', '+', '+', '6', '2', '3', '×', '5', '-', '7', '1']
  // const ELEMENT_SET = ['1', '+', '1']
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
    const expr = elements.map(v => v.get('value')).join(" ").replace(/×/g, "*")
    result = eval(expr)
  } catch (err) {
    result = 0
  }
  return result
}
