import * as archiver from 'archiver';
import * as fs from 'fs-extra';

export async function createZip(params: {
  sourcePath: string;
  outputFile: string;
}) {
  // Function to create a zip file from the compiled JavaScript files and node_modules
  const outputZip = fs.createWriteStream(params.outputFile);
  const archive = archiver('zip', {
    zlib: { level: 9 }, // Sets the compression level.
  });

  outputZip.on('close', () => {
    console.log();
    console.log(`Zip created,  ${Math.round(archive.pointer() / 1000000)} MB:`);
    console.log('     ' + params.sourcePath);
    console.log('     ' + params.outputFile);
  });

  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(outputZip);

  // Append files from 'dist' and 'node_modules' directories
  archive.directory(params.sourcePath, false);
  // archive.directory('node_modules/', 'node_modules');

  await archive.finalize();
}
