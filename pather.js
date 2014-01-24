module.exports = (function(){

    var reg = /(background(?:\-image)?\s*:\s*url\(['|"]?)([^'")]*)(['|"]?\))/gi;
    /**
     * process relative image pathes in specified imported css
     * @param {String} cssPath css absolute file path
     * @param {String} importCssPath relative imported css file path
     * @param {String} importCssText contents of the imported css file
     */
    function processRelativePath(cssPath, importCssPath, importCssText) {
        cssPath = cssPath.split('\\');
        importCssPath = importCssPath.split('/');
        var isSibling = importCssPath.length == 1;
        return importCssText.replace(reg, function(css, before, imgPath, after) {
            if (/^http\S/.test(imgPath) || /^\/\S/.test(imgPath) || isSibling) { //绝对路径or同级跳过
                return css;
            }
            imgPath = imgPath.split('/');
            imgPath = getRelativePath(cssPath, importCssPath, imgPath);
            return before + imgPath + after;
        });
    };
    /**
     * get images' relative path after css merging
     * @param {String} cssPath css absolute file path
     * @param {String} importCssPath relative imported css file path
     * @param {String} imgPath raw image relative path
     */
    function getRelativePath(cssPath, importCssPath, imgPath) {
        var count1 = 0,
            count2 = 0,
            result = '';
        importCssPath = getFilePath(cssPath, importCssPath);
        imgPath = getFilePath(importCssPath, imgPath);
        for (var i = 0, length = cssPath.length; i < length; i++) {
            if (cssPath[i] == imgPath[i]) {
                count1++;
            } else {
                break;
            }
        }
        count2 = cssPath.length - count1 - 1;
        for (var i = 0; i < count2; i++) {
            result += '../';
        }
        result = result + imgPath.splice(count1).join('/');
        return result;
    };
    /**
     * get relative file path basing on its containing file path and its relative path
     * @param {String} basePath containing file path
     * @param {String} relative path
     */
    function getFilePath(basePath, relativePath) {
        var count = 0,
            array1, array2;
        for (var i = 0, length = relativePath.length; i < length; i++) {
            if (relativePath[i] == '..') {
                count++;
            }
        }
        array1 = basePath.slice(0, basePath.length - 1 - count);
        array2 = relativePath.slice(count);
        return array1.concat(array2);
    };

    return ({'process':processRelativePath});

})();