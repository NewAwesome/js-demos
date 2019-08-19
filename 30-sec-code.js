/**
 * @function 数组
 */
// 1. all
const all = (arr, fn = Boolean) => arr.every(fn);

console.log(all([2, 3, 4], x => x > 2));

// all equal
const allEqual = arr => arr.every(val => val === arr[0])

console.log(allEqual([2, 2, 2, 2]));

// 2. any
const any = (arr, fn = Boolean) => arr.some(fn);

// 3. 二维数组转CSV（逗号分隔
const arrayToCSV = (arr, delimiter = ',') =>
    arr.map(v => v.map(x => (isNaN(x) ? `"${x.replace(/"/g, '""')}"` : x) /* x=>${x} —— 解析出结果不带引号 */ ).join(delimiter)).join('\n');

console.log(arrayToCSV([
    ['a"', '"b" great'],
    ['c', 3.1415]
]));

// 4. bifurcate 传入参数arr和filter两个数组，用filter来指示每个arr中的值是否为true，最终为true的放在一个数组内，为false的放在另一个数组内。
//          通过arr.reduce实现，reduce为数组中每一个元素调用累加函数
//          reduce参数：累加函数、初始值（最后就会返回这个值）。
//          累加函数的参数：accumulator(累加的值,这里第一次指 [[],[]] ),currentValue当前的值,index当前元素索引，[array]调用reduce的数组
// 这里使用了逗号表达式 (表达式1,表达式2,表达式3, ... ,表达式n) 会依次计算，最终返回表达式n
const bifurcate = (arr, filter) => arr.reduce((acc, val, i) => (acc[filter[i] ? 0 : 1].push(val), acc), [
    [],
    []
]);

// bifurcateBy 第二个参数变为函数，判断是否满足条件来分组
const bifurcateBy = (arr, fn) => arr.reduce((acc, val, i) => (acc[fn(val, i) ? 0 : 1].push(val), acc), [
    [],
    []
])

console.log(bifurcateBy(['beep', 'boop', 'foo', 'bar'], x => x[0] === 'b'));

// 5. chunk 参数：arr,size 功能：将arr数组的内部元素组合成size大小的数组 例如：[[1,2],[3,4],[5]]
// tips: { length: n } 生成一个伪数组。伪数组条件：1.对象 2.有length属性 3.length属性值为Number类型 4.length属性值不为0，并且这个对象按照下标存储数据
const chunk = (arr, size) => Array.from({
    length: Math.ceil(arr.length / size)
}, (v, i) => {
    return arr.slice(i * size, i * size + size)
})
console.log(chunk([1, 2, 3, 4, 5, 6, 7, 8], 2));

// 6. compact 参数arr 功能：移除falsey values(false, null, 0, -0, "", undefined, and NaN).
const compact = arr => arr.filter(Boolean)

console.log(compact([0, 1, false, 2, '', 3, 'a', 'e' * 23, NaN, 's', 34])); // [ 1, 2, 3, 'a', 's', 34 ]

// 7. ??????????????? countBy 参数：arr fn 功能：根据给定的函数对数组进行分组，并返回每个分组中元素的个数
const countBy = (arr, fn) =>
    arr.map(typeof fn === 'function' ? fn : val => val[fn]).reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
    }, {});
const countBy2 = (arr, fn) => arr.map()
console.log(countBy([6.1, 4.2, 6.3], Math.floor));; // {4: 1, 6: 2}
console.log(countBy(['one', 'two', 'three'], 'aa'));; // {3: 2, 5: 1}