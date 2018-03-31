$(document).ready(() => {
  $('.addFavorite').on('click', e => {
    e.preventDefault();
    const btn = e.target;
    const clubId = $(btn).prevAll('.club-id').val();
    const clubName = $(btn).prevAll('.club-name').val();
    $.ajax({
      url: '/home',
      type: 'POST',
      data: {
        clubId,
        clubName
      },
      success() {
        console.log(`${clubName} is added to favorites`);
      }
    })
  });


});