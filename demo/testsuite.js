/*
	Require and initialise PhantomCSS module
	Paths are relative to CasperJs directory
*/

var fs = require( 'fs' );
var path = fs.absolute( fs.workingDirectory + '/phantomcss.js' );
var phantomcss = require( path );

var links = [
	'http://localhost:3000/',
	// 'http://localhost:3000/todos'
];

casper.options.waitTimeout = 1000;

casper.test.begin( 'Coffee machine visual tests', function ( test ) {
	phantomcss.init( {
		rebase: casper.cli.get( "rebase" ),
		casper: casper,
		screenshotRoot: fs.absolute( fs.workingDirectory + '/screenshots' ),
		failedComparisonsRoot: fs.absolute( fs.workingDirectory + '/demo/failures' ),
		mismatchTolerance: 0
		// outputSettings: {
		// 	errorColor: {
		// 		red: 255,
		// 		green: 255,
		// 		blue: 0
		// 	},
		// 	transparency: 0.8
		// }
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

  casper.start().eachThen(links, function(response) {
		this.thenOpen(response.data, function() {
			casper.viewport( 360, 640 );
			phantomcss.screenshot('html','screenshot_mobile' );
			casper.viewport( 1024, 768 );
			phantomcss.screenshot('html','screenshot_tablet' );
			casper.viewport( 1920, 1080 );
			phantomcss.screenshot( 'html','screenshot_desktop' );
		});
	});

	casper.then( function now_check_the_screenshots() {
		phantomcss.compareAll();
	} );

	casper.run( function () {
		casper.test.done();
	} );
} );
