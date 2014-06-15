var fs = require('fs');

function chooseFile(name) {
  document.querySelector('#file-input').addEventListener('change', function(evt) {
    fs.createReadStream('temp.gif')
      .pipe(fs.createWriteStream(this.value));
  },false);

  document.querySelector('#file-input').click();
}

document.querySelector('#save-video').addEventListener('click', function(evt) {
  chooseFile();
});
