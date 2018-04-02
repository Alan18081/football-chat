$(document).ready(() => {
  $('.upload-btn').on('click',e => {
    e.preventDefault();
    $('#add-input').click();
  });

  $('#add-input').on('change', e => {
    showImage(e.target);
  });

  $('#profile-form').on('submit',e => {
    e.preventDefault();
    const uploadInput = $('#add-input');
    const formData = new FormData();
    const form = $('#profile-form');

    const username = form.find('input[name=username]').val();
    const fullname = form.find('input[name=fullname]').val();
    const country = form.find('input[name=country]').val();
    const gender = form.find('input[name=gender]:checked').val();
    const info = form.find('input[name=mantra]').val();
    const favClub = form.find('input[name=club]:selected').val();
    const file = uploadInput[0].files[0];

    let valid = true;
    console.log(username);
    if(username === '' || fullname === '' || country === '' || gender === '' || info === '') {
      valid = false;
      console.log('hey');
      $('#error').html('<div class="alert alert-danger">You cannot submit form with empty fields</div>');
    }

    if(valid) {
      formData.append('username',username);
      formData.append('fullname',fullname);
      formData.append('country',country);
      formData.append('gender',gender);
      formData.append('info',info);
      formData.append('upload',file);
      formData.append('favClub',favClub);

      $.ajax({
        url: '/uploadProfile',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success() {
          uploadInput.val('');
          $('#error').html('');
        }
      });
    }
    else {
      return false;
    }
  });
});

function showImage(input) {
  if(input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = e => {
      $('#profile-img').attr('src',e.target.result);
    };
    reader.readAsDataURL(input.files[0]);
  }
}