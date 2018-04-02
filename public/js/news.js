const getResults = () => {
  $.ajax({
    url: 'http://content.guardianapis.com/football?order-by=newest&page-size=30&show-fields=all&api-key=689cfede-93c4-413e-8dce-4fa59dab5f43',
    type: 'GET',
    dataType: 'json',
    success(data) {
      let results = '';
      data.response.results.forEach(item => {
        results += `
          <article class="col-md-12 panel article">
            <a href="${item.webUrl}" target="_blank">
              <div class="row">
                <div class="col-md-4">
                  <img class="img-responsive" src="${item.fields.thumbnail}" alt="Image">
                </div>
                <div class="col-md-8">
                  <h5>${new Date(Date.parse(item.webPublicationDate)).toDateString()}</h5>
                  <h3>${item.fields.headline}</h3>
                  <p>${item.fields.trailText}</p>
                </div>
              </div>
            </a>
          </article>
        `;
      });
      $('#news-list').html(results);
      $('.article').slice(0,4).show();
    }
  })
};

$(document).ready(() => {
  getResults();
  $('#loadMore').on('click', e => {
    e.preventDefault();
    $('.article:hidden').slice(0,4).slideDown().delay(() => {
      $('html,body').animate({
        scrollTop: $(this).offset().top
      },150);
    });
  });
  $('#top').on('click', e => {
    e.preventDefault();
    $('html,body').animate({
      scrollTop: 0
    },1500);
  });
});