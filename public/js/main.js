$(document).ready(() => {
  $('.upload-btn').on('click',e => {
    $('#upload-input').click();
  });

  $('#dashboardForm').on('submit',e => {
    e.preventDefault();
    const uploadInput = $('#upload-input');
    if(uploadInput.val() != '') {
      const formData = new FormData();
      const club = $('form input[name=club]').val();
      const country = $('form input[name=country]').val();
      const file = uploadInput[0].files[0];
      console.log(club,country,file);
      formData.append('club',club);
      formData.append('country',country);
      formData.append('upload',file);
      $.ajax({
        url: '/uploadFile',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success() {
          uploadInput.val('');
        }
      });
    }
  });
});