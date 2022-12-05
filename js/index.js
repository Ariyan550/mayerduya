
// product page
// packet count
let packetText =document.querySelector('.packetCount')

packetText.addEventListener('keyup',()=>{
    let packetTaka =document.querySelector('.packetTaka')

    let pval =packetText.value;
     let chalkmulti =pval * 0.3
    packetTaka.innerHTML =chalkmulti

})


//end packet count





// product slider
document.addEventListener('DOMContentLoaded', function () {
    new Splide('#largeProduct', {
    type   : 'loop',
    autoplay: true,
    drag:true,
    keyboard:true,
  
    }).mount();
  });
  
  document.addEventListener('DOMContentLoaded', function () {
    new Splide('#bigProduct', {
    type   : 'loop',
    autoplay: true,
    drag:true,
    keyboard:true,
    }).mount();
  });


  document.addEventListener('DOMContentLoaded', function () {
    new Splide('#smallProduct', {
    type   : 'loop',
    autoplay: true,
    drag:true,
    keyboard:true,
    }).mount();
  });




  document.addEventListener('DOMContentLoaded', function () {
    new Splide('#mediumProduct', {
    type   : 'loop',
    autoplay: true,
    drag:true,
    keyboard:true,
    }).mount();
  });


  document.addEventListener('DOMContentLoaded', function () {
    new Splide('#enoneProduct', {
    type   : 'loop',
    autoplay: true,
    drag:true,
    keyboard:true,
    }).mount();
  });


  document.addEventListener('DOMContentLoaded', function () {
    new Splide('#entwoProduct', {
    type   : 'loop',
    autoplay: true,
    drag:true,
    keyboard:true,
    }).mount();
  });



  document.addEventListener('DOMContentLoaded', function () {
    new Splide('#enthreeProduct', {
    type   : 'loop',
    autoplay: true,
    drag:true,
    keyboard:true,
    }).mount();
  });


 //end product slider





//  scroll to top


let myTop = document.getElementById("myTop");

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    myTop.style.display = "block";
  } else {
    myTop.style.display = "none";
  }
}

function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

//end  scroll to top








// sticky top

const stickyTop =document.querySelector('.navbar')

window.addEventListener('scroll',()=>{
    if(window.pageYOffset > 50){
        stickyTop.classList.add('fixed-top')
    }else{
        stickyTop.classList.remove('fixed-top')
    }
})


//end sticky top




