// run `npm test`
var expect = require('chai').expect,
    cssutil = require('../index');

// Force current directory
//process.chdir(__dirname);

describe('cssutil-tests', function() {
    //test1
    it ('should concatenate and minify CSS', function(done) {
        cssutil.build([
            __dirname+'\\'+'file1.css',
            __dirname+'\\'+'file2.css'
        ], function(e, css) {
            expect(e).to.equal(null);
            expect(css).to.equal('h1{color:#BDF17E}h2{color:#83B1FC}');
            done();
        });
    });
    //test2
    it('should just concatenate CSS', function(done) {
        var opts = { minify: false };
        cssutil.build([
            __dirname+'\\'+'file1.css',
            __dirname+'\\'+'file2.css'
        ], opts, function(e, css) {
            expect(e).to.equal(null);

            // Normalize line endings
            css = css.replace(/\r\n/gi, '\n');

            expect(css).to.equal(
                'h1 {\n' +
                '    color: #BDF17E;\n' +
                '}\n' +
                '\n' +
                'h2 {\n' +
                '    color: #83B1FC;\n' +
                '}\n');
            done();
        });
    });
    //test3
    it('should merge imported CSS files', function(done) {
        var opts = { minify: false };
        cssutil.build([
            __dirname+'\\'+'file3.css'
        ], opts, function(e, css) {
            expect(e).to.equal(null);

            // Normalize line endings
            css = css.replace(/\r\n/gi, '\n');

            expect(css).to.equal(
                '/*S-'+__dirname+'\\'+'file1.css*/\n'+
                'h1 {\n' +
                '    color: #BDF17E;\n' +
                '}\n' +
                '\n/*E-'+__dirname+'\\'+'file1.css*/'+
                '\n'+
                '.test3 {\n' +
                '    height: 1px;\n' +
                '}');
            done();
        });
    });
    //test4
    it('should merge complex imported CSS files', function(done) {
        var opts = { minify: false };
        cssutil.build([
            __dirname+'\\'+'file4.css'
        ], opts, function(e, css) {
            expect(e).to.equal(null);

            // Normalize line endings
            css = css.replace(/\r\n/gi, '\n');

            expect(css).to.equal(
                '@import url(http://static.gtimg.com/icson/css/common/v0/gb.css);\n'+
                '/*S-'+__dirname+'\\'+'file3.css*/\n'+
                '/*S-'+__dirname+'\\'+'file1.css*/\n'+
                'h1 {\n' +
                '    color: #BDF17E;\n' +
                '}\n' +
                '\n/*E-'+__dirname+'\\'+'file1.css*/'+
                '\n'+
                '.test3 {\n' +
                '    height: 1px;\n' +
                '}\n'+
                '/*E-'+__dirname+'\\'+'file3.css*/\n'+
                '/*S-'+__dirname+'\\'+'404.css*/\n'+
                "/*"+__dirname+'\\'+"404.css,Error: ENOENT, open '"+__dirname+'\\'+"404.css'*/\n"+
                '/*E-'+__dirname+'\\'+'404.css*/\n'+
                '/*S-'+__dirname+'\\'+'imports\\_file1.css*/\n'+
                '/*S-'+__dirname+'\\'+'imports\\common\\icon.css*/\n'+
                '.ico{background-image: url(../img/icon.png);}\n'+
                '/*E-'+__dirname+'\\'+'imports\\common\\icon.css*/\n'+
                '.imports_file1{\n'+
                '    height:1px;\n'+
                '    background: url(../img/test.jpg) no-repeat;\n'+
                '}\n'+
                '/*E-'+__dirname+'\\'+'imports\\_file1.css*/\n'+
                '.test4 {\n'+
                '    height: 1px;\n'+
                '}'
                );
            done();
        });
    });
    //test5
    it('should compile and minify LESS files', function(done) {
        cssutil.build([
            __dirname+'\\'+'test.less'
        ], function(e, css) {
            expect(e).to.equal(null);
            expect(css).to.equal('h3{color:#FC92A2}');
            done();
        });
    });
    //test6
    it('should use specified LESS import paths', function(done) {
        var opts = { paths: ['imports'] };
        cssutil.build([
            __dirname+'\\'+'import.less'
        ], opts, function(e, css) {
            expect(e).to.equal(null);
            expect(css).to.equal('.foo{display:awesome}');
            done();
        });
    });
    //test7
    it('should minify using ycssmin', function(done) {
        var opts = { compressProviderId: 1 };
        cssutil.build([
            __dirname+'\\'+'file1.css'
        ], opts, function(e, css) {
            expect(e).to.equal(null);
            expect(css).to.equal('h1{color:#bdf17e}');
            done();
        });
    });
});
