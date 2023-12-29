/**
 * @description: CSS预编译器
 * @return {*}
 */
class XPreprocessor {
    constructor(dup) {
        // 全局方法，可在预编译标签里使用
        this.funcs = {
            concat: function (a, b) { return a + b } // 拼接字符
        }
        // 存储css变量
        this.variables = {}
        // 存储css混合
        this.mixins = {}
        this.ori = "" // 预编译前字符
        if (dup instanceof XPreprocessor) {
            this.funcs = dup.funcs
            this.variables = dup.variables
            this.mixins = dup.mixins
            this.ori = dup.ori
        }
    }
    /**
     * @description: 获取指定位置字段的行数
     * @param {*} targetPosition
     * @return {*}
     */
    getline(targetPosition) {
        let positionCount = 0
        let lineNumber = 1
        for (let i = 0; i < this.ori.length; i++) {
            if (this.ori[i] === '\n') {
                lineNumber++
            } else {
                positionCount++
            }
            if (positionCount === targetPosition) {
                return lineNumber - 2
            }
        }
        return -1
    }
    // 值预处理
    parseValue(val) {
        try {
            return new Function("return " + val)()
        } catch (e) {
            return val
        }
    }
    /**
     * @description: 解析变量（存储到this.variables里）
     * @return {*}
     */
    parseVariables() {
        this.css = String(this.css).replace(/\--:([a-zA-Z0-9_-]+)\s*:\s*([^;]+);/g, (match, variable, value) => {
            this.variables[variable] = this.parseValue(value.trim())
            return ""
        });
        return this
    }
    /**
     * @description: 解析混合（存储到this.mixins里）
     * @return {*}
     */
    parseMixins() {
        this.css = String(this.css).replace(/:mix\s+([a-zA-Z0-9_-]+)\s*\{([^}]+)\}/g, (match, mixinName, mixinContent) => {
            this.mixins[mixinName] = mixinContent.trim()
            return ''
        });
        return this
    }
    /**
     * @description: 处理混合（将原来的导入标签替换为混合里的内容，如果不存在就替换为''）
     * @return {*}
     */
    processMixins() {
        this.css = String(this.css).replace(/include\s*:\s*([a-zA-Z0-9_-]+);/g, (match, mixinName) => {
            const mixinContent = this.mixins[mixinName]
            return mixinContent ? mixinContent : ''
        });
        return this
    }
    /**
     * @description: 处理变量（将原来的变量标签替换为指定变量的内容，如果不存在保留原来）
     * @return {*}
     */
    processVariables() {
        this.css = String(this.css).replace(/--X([a-zA-Z0-9_-]+)/g, (match, variable) => {
            const variableValue = this.variables[variable]
            // 因为使用全局匹配可能会替换其他内容，所以我们这里不替换为''
            return variableValue ? this.parseValue(variableValue) : match
        });
        return this
    }
    /**
     * @description: 解析for循环
     * @return {*}
     */
    parseForLoops() {
        // 数字循环
        this.css = String(this.css).replace(/@for\s+\$([a-zA-Z0-9_-]+)\s+from\s+(\d+)\s+to\s+(\d+)\s*\{([^}]+)\}/g, (match, variable, start, end, loopContent, index) => {
            let result = ''
            for (let i = parseInt(start); i <= parseInt(end); i++) {
                result += loopContent.replace(/\n\s*/, "").replace(new RegExp(`\\$${variable}`, 'g'), i)
            }
            return result
        });
        // 遍历循环
        this.css = String(this.css).replace(/@for\s+\$([a-zA-Z0-9_-]+)\s+from\s+\$([a-zA-Z0-9_-]+)\s*\{([^}]+)\}/g, (match, variable, target, loopContent, index) => {
            let result = ''
            let target_val = this.variables[target]
            if (typeof target_val !== "object") {
                console.error(match)
                console.error("预编译错误，在" + this.getline(index) + "行")
                return match
            }
            for (let i in target_val) {
                const loopIterationContent = loopContent.replace(/\n\s*/, "").replace(new RegExp(`\\$${variable}`, 'g'), target_val[i])
                result += loopIterationContent
            }
            return result
        });
        return this
    }
    /**
     * @description: 解析单行注释
     * @param {*} skip
     * @return {*}
     */
    parseSingleLineComments(skip) {
        this.css = String(this.css).replace(/\/\/([^\n]*)\n/g, (ma, line, index) => {
            // 判断是否保留注释，如果有 @skip 标记则会跳过这行注释
            if (!skip && !(/^\s*@skip\s.*/i.test(line))) {
                return "/* " + line + " */\n"
            }
            return ""
        });
        return this
    }
    /**
     * @description: 解析多行注释
     * @param {*} skip
     * @return {*}
     */
    parseMultiLineComments(skip) {
        this.css = String(this.css).replace(/\/\*([\s\S]*?)\*\//g, (ma, line, index) => {
            // 判断是否保留注释，如果有 @skip 标记则会跳过这行注释
            if (!skip && !(/^\s*@skip\s.*/i.test(line))) {
                return "/* " + line + " */"
            }
            return ""
        });
        return this
    }
    /**
     * @description: 解析函数
     * @return {*}
     */
    parseFunc() {
        // 单函数
        this.css = String(this.css).replace(/\--F([a-zA-z]+)\(([^\)]+)\)/g, (ma, name, args, index) => {
            if (this.funcs.hasOwnProperty(name)) {
                return this.funcs[name].bind(this)(...args.split(","))
            }
            return ma
        });
        return this
    }
    /**
     * @description: 处理预编译css
     * @param {*} css 
     * @param {*} skip_comment 是否跳过注释
     * @return {*} 返回编译后的字符串
     */
    process(css, skip_comment = false) {
        this.css = css
        this.ori = css
        this.parseSingleLineComments(skip_comment)
            .parseMultiLineComments(skip_comment)
            .parseVariables()
            .parseForLoops()
            .parseMixins()
            .processMixins()
            .processVariables()
            .parseFunc()
        return this.css;
    }
}
module.exports.XPreprocessor = XPreprocessor