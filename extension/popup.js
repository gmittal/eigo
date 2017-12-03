document.addEventListener('DOMContentLoaded', function() {
  var checkPageButton = document.getElementById('checkPage');
  checkPageButton.addEventListener('click', function() {

    chrome.tabs.getSelected(null, function(tab) {
      d = document;



      var f = d.createElement('form');
      f.action = 'http://eigo-server.herokuapp.com/check';
      f.method = 'post';
      var i = d.createElement('input');
      i.type = 'hidden';
      i.name = 'url';
      i.value = document.getElementById("link").value;

      var j = d.createElement('input');
      j.type = 'hidden';
      j.name = 'email';
      j.value = document.getElementById("email").value;

      f.appendChild(i);
      f.appendChild(j);
      d.body.appendChild(f);
      f.submit();
    });
  }, false);
}, false);
