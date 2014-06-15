// prevent default behavior from changing page on dropped file
window.ondragover = function(e) {
  e.preventDefault();
  return false;
};

window.ondrop = function(e) {
  e.preventDefault();
  return false;
};

var holder = document.querySelector('#holder');

holder.ondragover = function () {
  this.className = 'hover';
  return false;
};

holder.ondragend = function () {
  this.className = '';
  return false;
};

holder.ondrop = function (e) {
  e.preventDefault();
  sessionStorage.file = e.dataTransfer.files[0].path;
  window.location = 'settings.html';
  return false;
};

document.querySelector('#file').addEventListener("change", function(evt) {
  sessionStorage.file = this.value;
  window.location = 'settings.html';
}, false);
