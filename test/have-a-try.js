var 缤纷录志机 = require('../index.js').现成录志机;
var logger = 缤纷录志机;

缤纷录志机.志('《志》：甲乙丙丁戊己庚心壬癸');
缤纷录志机.追踪('《追踪》：看看函数的调用历史吧。下面会有一大串内容，可要注意了！');
缤纷录志机.提示('《提示》：坚持使用汉语不是什么坏事情。');
缤纷录志机.警示('《警告》：子丑寅卯辰巳午未申酉戌亥');
缤纷录志机.报误('录志机报错了！');

logger.log('This is a log recorded by a logger of type "colorful-log".');
logger.info('This is an information recorded by a logger of type "colorful-log".');
logger.warn('This is a warning recorded by a logger of type "colorful-log".');
logger.error('This is an error recorded by a logger of type "colorful-log".');

logger.志('中英文显然可以混用，因为它们都指向相同的对象或函数。');
缤纷录志机.warn('Don\'t do anything dangerous!');
