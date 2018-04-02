const sendFavItem = (name,url) => {
  let valid = true;
  if(name === '') {
    valid = false;
    $('#error').html('<div class="alert alert-danger">You cannot submit empty field</div>');
  }
  else {
    $('#error').html('');
  }
  if(valid) {
    $.ajax({
      url,
      type: 'POST',
      data: {
        name
      },
      success() {
        setTimeout(() => {
          window.location.reload();
        }, 200);
      }
    });
  }
};

$(document).ready(() => {
  $('#fav-club-btn').on('click',() => {
    const clubName = $('#fav-club-input').val();
    sendFavItem(clubName,'/settings/interests/addFavClub');
  });
  $('#fav-player-btn').on('click',() => {
    const playerName = $('#fav-player-input').val();
    sendFavItem(playerName,'/settings/interests/addFavPlayer');
  });
  $('#fav-team-btn').on('click',() => {
    const teamName = $('#fav-team-input').val();
    sendFavItem(teamName,'/settings/interests/addFavTeam');
  });
});