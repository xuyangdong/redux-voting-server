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
  '1': ['氢的原子序数', '见人就变大', '江阴长江大桥是中国第（ ）的大钢箱梁悬索桥'],
  '2': ['太极的儿子 四象的爸爸', '知名羽毛球选手李宗伟', '测试线索'],
  '3': ['变小之后会很危险', '一周内最长的一天', '大于e 小于<π', '桃园结义', '颜料的原色数目'],
  '5': ['体育频道', '联合国常任理事国数目', '地球上大洋的数目'],
  '6': ['简谱中的la', '禄，很吉利的一个数字', '上帝在这一天创造了生物', '3的阶乘', '在网络语言中，一个人在某一事件中表现得极为出彩'],
  '7': ['葫芦娃', '奥特曼之一的英文名', '五指并拢'],
  '+': ['我有+', '我有+', '我有+', '我有+'],
  '-': ['我有-', '我有-', '我有-', '我有+'],
  '×': ['我有×', '我有×', '我有×', '我有+'],
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
  var indexDecorator = parseInt(_.uniqueId()) % decorator.length
  var indexNoun = parseInt(_.uniqueId()) % noun.length
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
    '013': genPlayer(),
    '014': genPlayer(),
    '015': genPlayer(),
    '016': genPlayer(),
    '017': genPlayer(),
    '018': genPlayer(),
    '020': genPlayer(),
    '021': genPlayer(),
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
      tip: TIP_MAP[value].pop(),
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
