// 四個版本共用：導覽、卷動進場。刻意極簡，重點是各版自己的視覺。
document.addEventListener('DOMContentLoaded',function(){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.05});
  document.querySelectorAll('.rv').forEach(function(el){io.observe(el)});
  var n=document.querySelector('.nav'); if(n){
    var f=function(){ n.dataset.stuck=String(window.scrollY>8) }; f();
    window.addEventListener('scroll',f,{passive:true});
  }
});
