window.requestAniFrame = (function(){
  return window.requestAnimationFrame   ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame    ||
         window.oRequestAnimationFrame      ||
         window.msRequestAnimationFrame     ||
         function (callback, element) {
            var start,
                finish;
            window.setTimeout( function () {
               start = +new Date();
               callback(start);
               finish = +new Date();
               self.timeout = 1000 / 60 - (finish - start);
            }, self.timeout);
         };
})();
window.requestInterval = function(fn, delay) {
  var start = new Date().getTime(),
      handle;
  function loop() {
    handle = window.requestAniFrame(loop);
    var current = new Date().getTime(),
      delta = current - start;
    if (delta >= delay) {
      fn.call();
      start = new Date().getTime();
    }
  }
  handle = window.requestAniFrame(loop);
  return handle;
};
