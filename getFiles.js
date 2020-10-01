const runAuthorized  = require('./auth')
const google = require('googleapis')
const fs = require('fs')
const async = require('async')

/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
const listFiles = ( auth, options ) => {
  const service = google.drive('v2')
  service.files.list({
    q: "mimeType='image/jpeg'",
    auth: auth,
    spaces: 'drive',
    maxResults: 1000,
  }, (err, response) => {
    if (err) {
      console.log('The API returned an error: ' + err)
      return
    }
    var files = response.items
    if (files.length == 0) {
      console.log('No files found.')
    } else {
      var i = 0
      async.whilst(
        () => i <= files.length-1,
        (innerCallback) => {
          var file = files[i]
          const path = `/${options.dest}/${file.id}.jpg`
          const callBack = () => { i++; innerCallback() }
          if( !fs.existsSync(path) ){
            downloadFile( file, path, service, auth )
            setTimeout(callBack, 1000)
          } else {
            console.log(`Skipping ${file.originalFilename}`)
            setTimeout(callBack, 10)
          }
        },
        () => console.log(`All files done ${new Date()}`)
      )
    }
  })
}

/**
 * Download the file
 */

const downloadFile = ( file, path, service, auth ) => {
    console.log(`Downloading ${file.originalFilename}`)
    const dest = fs.createWriteStream(path)
    const stream = service.files.get({ auth: auth, fileId: file.id, alt: 'media' })
    .on('error', err => {
      console.log('Error during download', err)
    })
    .pipe(dest)

    stream.on('finish', ()=> dest.end())
}

const getFile = (options) => runAuthorized((auth)=>listFiles(auth,options))

module.exports = getFile
