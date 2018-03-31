($=>{
  $.deparam = $.deparam || function(uri){
    if(uri === undefined) {
      uri = location.pathname;
    }
    const chatName = location.pathname.split('/').pop();
    return chatName;
  }
})(jQuery);