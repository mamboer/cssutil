module.exports=(function(){

    var less = require('less'),
        cleanCSS = require('clean-css').process,
        async = require('async'),
        fs = require('fs'),
        path = require('path');

    var pub ={};

    /**
     * building files
     * @param {Array} files array of files to be build!
     * @param {Object} options build configuration
     * @param {Function} cbk callback
     */
    pub.build = function(files, opts, cbk) {
        if (typeof opts === 'function') {
            cbk = opts;
            opts = {};
        }
        opts = opts || {};

        async.map(
            files,
            function process(file, cbk1) {
                if (path.extname(file).toLowerCase() === '.less') {
                    pub.buildLess(file, opts, cbk1);
                } else {
                    fs.readFile(file, 'utf8', cbk1);
                }
            },
            function complete(err, files1) {
                if (err) { return cbk(err); }

                var src = files1.join('\n');
                if (opts.minify !== false) {
                    src = cleanCSS(src);
                }
                cbk(null,src);
            }
        );
    };
    /**
     * build less file
     * @param {String} file less file path
     * @param {Object} options build configuration
     * @param {Function} cbk callback
     */
    pub.buildLess = function(file, opts, cbk) {
        fs.readFile(file, 'utf8', function(err, src) {
            if (err) { return cbk(err); }

            var paths = [path.dirname(file)];
            if (opts.paths) {
                paths = paths.concat(opts.paths);
            }

            var parser = new less.Parser({
                paths: paths,
                filename: file
            });

            parser.parse(src, function(err, tree) {
                if (err) { return cbk(err); }

                var css;
                try {
                    css = tree.toCSS();
                } catch (err1) {
                    return cbk(err1);
                }

                cbk(null,css);
            });
        });
    };

    return pub;
})();