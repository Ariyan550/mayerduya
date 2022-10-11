
// product page
// packet count
let packetText =document.querySelector('.packetCount')

packetText.addEventListener('keyup',()=>{
    let packetTaka =document.querySelector('.packetTaka')
    let totalamountsoapchalk =document.querySelector('.totalamountsoapchalk')

    let pval =packetText.value;
     let chalkmulti =pval * 0.3
     let chalkTotal = 500*chalkmulti
    packetTaka.innerHTML =chalkmulti
    totalamountsoapchalk.innerHTML =chalkTotal

})





//end packet count




// product slider
document.addEventListener( 'DOMContentLoaded', function() {
    var splide = new Splide( '.splide',{
        type    : 'loop',
        autoplay: 'true',
    });
    splide.mount();
    
  } );
