
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


 //end product slider