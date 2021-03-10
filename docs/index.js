const core = require('@actions/core');
const github = require('@actions/github');
const fs = require( "fs" );
const path = require( "path" );

try {
  console.log( "Scanning Social Shareboard entries in ", core.getInput('dir_name') );

  let shareboardFull = fs.readdirSync( path.join( core.getInput('dir_name'), "notes" ) )
    .filter( file => path.extname( file ).toLowerCase() === ".md" )
    .filter( file => file !== "sample.md" )
    .map( file => fs.readFileSync( path.join( core.getInput('dir_name'), "notes", file ) ) )
    .join( "\n---\n" );

  console.log( "Shareboard length: ", shareboardFull.length);

  console.log( "Shareboard contents:\n");
  console.log(shareboardFull);

  if(shareboardFull.length == 0) {
    console.log("Writing random number to tracking file because no other changes")
    fs.writeFileSync( core.getInput('tracking_file'), "Random Number: " + Math.random() );
  }
  else {
    console.log("Writing to the markdown file in the talk folder: ", core.getInput('shareboard_file'))
    fs.writeFileSync( core.getInput('shareboard_file'), shareboardFull );

    console.log("Writing to the markdown file for the web: ", core.getInput('web_file'))
    fs.writeFileSync( core.getInput('web_file'), shareboardFull );
  }

} catch (error) {
  core.setFailed(error.message);
}