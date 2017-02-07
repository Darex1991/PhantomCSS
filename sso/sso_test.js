/*
	Require and initialise PhantomCSS module
	Paths are relative to CasperJs directory
*/

var fs = require( 'fs' );
var path = fs.absolute( fs.workingDirectory + '/phantomcss.js' );
var phantomcss = require( path );
var server = require('webserver').create();

// var html = fs.read( fs.absolute( fs.workingDirectory + '/demo/coffeemachine.html' ));
//
// server.listen(8080,function(req,res){
// 	res.statusCode = 200;
// 	res.headers = {
// 		'Cache': 'no-cache',
// 		'Content-Type': 'text/html;charset=utf-8'
// 	};
// 	res.write(html);
// 	res.close();
// });


casper.test.begin( 'SSO visual tests', function ( test ) {

	phantomcss.init( {
		rebase: casper.cli.get( "rebase" ),
		// SlimerJS needs explicit knowledge of this Casper, and lots of absolute paths
		casper: casper,
		libraryRoot: fs.absolute( fs.workingDirectory + '' ),
		screenshotRoot: fs.absolute( fs.workingDirectory + '/screenshots' ),
		failedComparisonsRoot: fs.absolute( fs.workingDirectory + '/sso/failures' ),
		addLabelToFailedImage: false,
		/*
		screenshotRoot: '/screenshots',
		failedComparisonsRoot: '/failures'
		casper: specific_instance_of_casper,
		libraryRoot: '/phantomcss',
		fileNameGetter: function overide_file_naming(){},
		onPass: function passCallback(){},
		onFail: function failCallback(){},
		onTimeout: function timeoutCallback(){},
		onComplete: function completeCallback(){},
		hideElements: '#thing.selector',
		addLabelToFailedImage: true,
		outputSettings: {
			errorColor: {
				red: 255,
				green: 255,
				blue: 0
			},
			errorType: 'movement',
			transparency: 0.3
		}*/
	} );

	casper.on( 'remote.message', function ( msg ) {
		this.echo( msg );
	} );

	casper.on( 'error', function ( err ) {
		this.die( "PhantomJS has errored: " + err );
	} );

	casper.on( 'resource.error', function ( err ) {
		casper.log( 'Resource load error: ' + err, 'warning' );
	} );
	/*
		The test scenario
	*/

  links = ['http://localhost:9070/anmelden','http://localhost:9070/registrieren'];


  casper.start().each(links, function(self, link) {
    self.thenOpen(link, function() {
        var filename = this.getCurrentUrl().split('/')[3];
        casper.viewport( 1024, 768 );
        casper.evaluate(function() {
          var content = document.querySelector('.content');
          content.style.background = '#000'
        });
        phantomcss.screenshot( '.userform', filename );
    });
  });

	 
	casper.then( function now_check_the_screenshots() {
		// compare screenshots
		phantomcss.compareAll();
	} );

	/*
	Casper runs tests
	*/
	casper.run( function () {
		console.log( '\nTHE END.' );
		// phantomcss.getExitStatus() // pass or fail?
		casper.test.done();
	} );
} );
