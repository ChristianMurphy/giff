// prevent default behavior from changing page on dropped file
window.ondragover = function(e) {
  e.preventDefault();
  return false
};

window.ondrop = function(e) {
  e.preventDefault();
  return false
};

var holder = document.getElementById('holder');
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
