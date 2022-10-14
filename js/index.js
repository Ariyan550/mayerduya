
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





//  scroll to top

// Get the button
let myTop = document.getElementById("myTop");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    myTop.style.display = "block";
  } else {
    myTop.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}


//end  scroll to top
