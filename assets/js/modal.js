$('#introbutton').on('click', function () {
  $('.modal-body-resources').load('intro.html', function () {
    $('#introduction').modal({ show: true });
  });
});
$('#glossbutton').on('click', function () {
  $('.modal-body-resources').load('glossary.html', function () {
    $('#glossary').modal({ show: true });
  });
});
$('#bibbutton').on('click', function () {
  $('.modal-body-resources').load('bibliography.html', function () {
    $('#bibliography').modal({ show: true });
  });
});
