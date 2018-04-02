module.exports = {
  setRouting(router) {
    router.get('/news',this.getNewsPage);
  },
  getNewsPage(req,res) {
    res.render('news/football-news',{
      title: 'Latest news',
      user: req.user
    });
  }
};