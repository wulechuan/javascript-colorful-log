// module colorful-Log

module.exports.createColorfulLogger = createColorfulLogger;
var defaultLogger = createColorfulLogger(global.console, {
    prefix: 'colorful-log',
    shouldOverrideRawMethods: false, // console.error === logger.error, console.log === logger.log, so on so forth
    shouldPrefixPlainLoggingsIfNotOverrided: false,
    shouldNotShowTimeStamp: true
});

module.exports.defaultLogger = defaultLogger;
module.exports.现成录志机 = defaultLogger;
module.exports.创建缤纷录志机 = createColorfulLogger;

// chinese version
// export const 现成录志机 = defaultLogger;
// export const 创建缤纷录志机 = createColorfulLogger;

function createColorfulLogger(rawLogger, globalOptions) {
    'use stric';

    const chalk = require('chalk');
    const moduleCaption = 'colorful-logger';
    const moduleCaption2 = moduleCaption + ':';



    const rawMethodsBackup = {
        log: rawLogger.log,
        info: rawLogger.info,
        warn: rawLogger.warn,
        trace: rawLogger.trace,
        error: rawLogger.error
    };



    globalOptions = globalOptions || {};

    const logLines = {};

    ['-', '=', '*', '~', '.', '#'].forEach(function (char, i, allChars) {
        logLines[char] = '\n' + char.repeat(79) + '\n';
    });

    const shouldOverrideRawMethods = !!globalOptions.shouldOverrideRawMethods;
    const shouldPrefixPlainLoggingsIfNotOverrided = !!globalOptions.shouldPrefixPlainLoggingsIfNotOverrided && !shouldOverrideRawMethods;
    const shouldNotShowTimeStamp = !!globalOptions.shouldNotShowTimeStamp;

    const prefixFgColor = getValidColor(globalOptions.prefixColor, false) || 'blue';
    const prefixBgColor = getValidColor(globalOptions.prefixColor, true ) || '';

    const suffixFgColor = getValidColor(globalOptions.suffixColor, false) || 'blue';
    const suffixBgColor = getValidColor(globalOptions.suffixColor, true ) || '';

    const timeStampBracketsFgColor = getValidColor(globalOptions.timeStampBracketsFgColor, false) || 'gray';
    const timeStampBracketsBgColor = getValidColor(globalOptions.timeStampBracketsBgColor, false) || '';

    const timeStampTextFgColor = getValidColor(globalOptions.timeStampTextFgColor, false) || 'magenta';
    const timeStampTextBgColor = getValidColor(globalOptions.timeStampTextBgColor, false) || '';


    const globalPrefix = tryToColorize(globalOptions.prefix, prefixFgColor, prefixBgColor);
    const globalSuffix = tryToColorize(globalOptions.suffix, suffixFgColor, suffixBgColor);

    const timeStampBracketsChalk = createChalkFrom(timeStampBracketsFgColor, timeStampBracketsBgColor);
    const timeStampTextChalk = createChalkFrom(timeStampTextFgColor, timeStampTextBgColor);


    const _fakeChalk = chalk.reset;

    const logger = {};

    logger.chalk = chalk;
    logger.logLines = logLines;
    logger.createChalkFrom = createChalkFrom;

    logger.warnEMChalk = createChalkFrom('black', 'yellow');
    logger.infoEMChalk = createChalkFrom('blue', 'cyan');
    logger.errorEMChalk = createChalkFrom('white', 'red');

    const _errorChalkBeforeThisConstructedCompletely = chalk.white.bgRed;

    logger.formatJSON = function (input) {
        return JSON.stringify(input, null, 4);
    }

    _buildLoggingLevelAccordingToGlobalOptions.call(logger, 'log', {
        shouldNotShowTimeStamp: shouldNotShowTimeStamp,
        // prefix: 'log >>>',
        // suffix: '',
        defaultFgColor: 'black',
        defaultBgColor: ''
    });

    _buildLoggingLevelAccordingToGlobalOptions.call(logger, 'info', {
        shouldNotShowTimeStamp: shouldNotShowTimeStamp,
        // prefix: 'info >>>',
        // suffix: '',
        defaultFgColor: 'cyan',
        defaultBgColor: ''
    });

    _buildLoggingLevelAccordingToGlobalOptions.call(logger, 'warn', {
        shouldNotShowTimeStamp: shouldNotShowTimeStamp,
        // prefix: 'warn >>>',
        // suffix: '',
        defaultFgColor: 'yellow',
        defaultBgColor: ''
    });

    _buildLoggingLevelAccordingToGlobalOptions.call(logger, 'trace', {
        shouldNotShowTimeStamp: shouldNotShowTimeStamp,
        // prefix: 'trace >>>',
        // suffix: '',
        defaultFgColor: 'blue',
        defaultBgColor: ''
    });

    _buildLoggingLevelAccordingToGlobalOptions.call(logger, 'error', {
        shouldNotShowTimeStamp: shouldNotShowTimeStamp,
        // prefix: 'error >>>',
        // suffix: '',
        defaultFgColor: 'red',
        defaultBgColor: ''
    });


    // Chinese version
    logger.志 = logger.log;
    logger.提示 = logger.info;
    logger.警示 = logger.warn;
    logger.追踪 = logger.trace;
    logger.报误 = logger.error;

    return logger;




    function getValidColor(color, shouldBeTreatedAsABgColor) {
        if (typeof color !== 'string' || !color) return '';
        color = color.trim();

        supportedColors = Object.keys(chalk.styles);

        let isValid = false;

        for (let supportedColor of supportedColors) {
            if (supportedColor === color) {
                isValid = true;
                break;
            }
        }

        if (isValid && shouldBeTreatedAsABgColor) {
            if (!color.match(/^bg[RYGCBMW]/)) {
                color = 'bg' + color.slice(0, 1).toUpperCase() + color.slice(1);
            }
        }

        return isValid ? color : '';
    }

    function createChalkFrom(fgColor, bgColor) {
        let newChalk;

        fgColor = getValidColor(fgColor) || '';
        bgColor = getValidColor(bgColor, true) || '';

        if (fgColor || bgColor) {
            newChalk = chalk;

            if (fgColor) {
                newChalk = newChalk[fgColor];
            }

            if (bgColor) {
                newChalk = newChalk[bgColor];
            }
        }

        return newChalk; // might be undefined
    }

    function tryToColorize(stringOrAnotherChalk, fgColor, bgColor) {
        if (typeof stringOrAnotherChalk !== 'string' || !stringOrAnotherChalk) return '';

        let newChalk = createChalkFrom(fgColor, bgColor);
        if (newChalk) {
            return newChalk(stringOrAnotherChalk);
        }

        return stringOrAnotherChalk;
    }

    function loggingLevelIsValid(loggingLevel) {
        if (typeof loggingLevel !== 'string' || !loggingLevel) return false;
        loggingLevel.trim().toLowerCase();

        const validLoggingLevels = ['log', 'info', 'warn', 'trace', 'debug', 'error'];

        let isValid = false;
        for (let validLoggingLevel of validLoggingLevels) {
            if (loggingLevel === validLoggingLevel) {
                isValid = true;
                break;
            }
        }

        return isValid;
    }

    function _buildLoggingLevelAccordingToGlobalOptions(loggingLevel, optionsForThisLevel) {
        if (!loggingLevelIsValid(loggingLevel)) {
            rawMethodsBackup.error(chalk.red(
                moduleCaption2+ 'Invalid logging level/method:',
                '"' + _errorChalkBeforeThisConstructedCompletely(loggingLevel) + '"'
            ));

            return false;
        }

        let loggingLevelRawMethod = rawMethodsBackup[loggingLevel];
        if (typeof loggingLevelRawMethod !== 'function') {
            rawMethodsBackup.error(chalk.red(
                moduleCaption2+ 'Unsupported logging level/method:',
                '"' + _errorChalkBeforeThisConstructedCompletely(loggingLevel) + '"'
            ));

            return false;
        }


        optionsForThisLevel = optionsForThisLevel || {};

        const loggingLevelRawMethodName = 'raw' + loggingLevel.slice(0, 1).toUpperCase() + loggingLevel.slice(1);

        const fgColor =
            getValidColor(globalOptions[loggingLevel+'FgColor'], false) ||
            getValidColor(optionsForThisLevel.defaultFgColor, false);

        const bgColor =
            getValidColor(globalOptions[loggingLevel+'BgColor'], true) ||
            getValidColor(optionsForThisLevel.defaultBgColor, true);

        const msgChalk = createChalkFrom(fgColor, bgColor);
        const loggingLevelChalkName = loggingLevel + 'Chalk';


        const prefixForThisMethod = optionsForThisLevel.prefix || '';
        const suffixForThisMethod = optionsForThisLevel.suffix || '';

        const shouldPrefixPlainLoggingsForThisMethod = shouldPrefixPlainLoggingsIfNotOverrided && !!globalPrefix;
        const shouldNotShowTimeStamp = !!optionsForThisLevel.shouldNotShowTimeStamp;


        this[loggingLevelRawMethodName] = loggingLevelRawMethod; // Always save the raw method

        this[loggingLevelChalkName] = msgChalk || _fakeChalk; // export/publish the chalk for free usage

        // rawMethodsBackup.info('shouldPrefixPlainLoggingsForThisMethod =', shouldPrefixPlainLoggingsForThisMethod);

        // creating new method
        if (shouldPrefixPlainLoggingsForThisMethod) {
            this[loggingLevel] = __logginMethodCoreFunction.bind(rawLogger, globalPrefix);
        } else {
            this[loggingLevel] = __logginMethodCoreFunction.bind(rawLogger);
        }

        if (shouldOverrideRawMethods) {
            rawLogger[loggingLevel] = this[loggingLevel];
        }



        function __logginMethodCoreFunction() {
            let loggingArguments1 = Array.prototype.slice.apply(arguments);

            if (prefixForThisMethod) {
                loggingArguments1.unshift(prefixForThisMethod);
            }

            // utilizing chalk.reset to easily strinify arguments before hand.
            loggingArguments1 = msgChalk ? msgChalk.apply(rawLogger, loggingArguments1) : chalk.reset(loggingArguments1);


            const loggingArguments2 = [loggingArguments1];

            if (!shouldNotShowTimeStamp) {
                let time = new Date();
                let tH = time.getHours();
                let tM = time.getMinutes();
                let tS = time.getSeconds();

                tH = (tH < 10 ? '0' : '') + tH;
                tM = (tM < 10 ? '0' : '') + tM;
                tS = (tS < 10 ? '0' : '') + tS;

                let timeStampText = tH + ':' + tM + ':' + tS;
                if (timeStampTextChalk) {
                    timeStampText = timeStampTextChalk(timeStampText);
                }

                let timeStampFull;
                if (timeStampBracketsChalk) {
                    timeStampFull = timeStampBracketsChalk('[' + timeStampText + ']');
                } else {
                    timeStampFull = '[' + timeStampText + ']';
                }

                loggingArguments2.unshift(timeStampFull);
            }

            if (suffixForThisMethod) {
                loggingArguments2.push(suffixForThisMethod);
            }

            if (shouldOverrideRawMethods && globalPrefix) {
                loggingArguments2.unshift(globalPrefix);
            }

            if (globalSuffix) {
                loggingArguments2.push(globalSuffix);
            }

            loggingLevelRawMethod.apply(rawLogger, loggingArguments2);
        };
    }
}

