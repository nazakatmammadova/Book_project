$(function(){
    $('.kitaplar').mousemove(function(x){
        $('.kitaplar').css('transform', `translate(${Math.round(x.screenX/50)}px,${Math.round(x.screenY/30)}px)`)
        $('.kitaplar').css('transform', `translate(${Math.round(x.screenX/50)}px,${Math.round(x.screenY/30)}px)`)
    })
})
///////////////////////////////////////////////////////////////////////////////
var daire=document.querySelector('.daire')
document.addEventListener('mousemove', function(e){
 var x= e.clientX;
 var y= e.clientY;
 daire.style.left=x+"px";
 daire.style.top=y+"px";    
})
////////////////////////////////////////////////////////////////////////////
let books=[
    {
        id:1,
        img:"./img/book1.jpg",
        price:'20.00',
        name:"A Curse so Dark and Lonely"
    },
    {
        id:2,
        img:"./img/book17.jpg",
        price:'37.00',
        name:"Ride the Wind"
    },
    {
        id:3,
        img:"./img/book18.jpg",
        price:'49.00',
        name:"Flame's Fury"
    },
    {
        id:4,
        img:"./img/book19.jpg",
        price:'54.00',
        name:"The Crimson Birds"
    },
    {
        id:5,
        img:"./img/book5.jpg",
        price:'55.00',
        name:"A Flicker in the Dark"
    },
    {
        id:6,
        img:"./img/book20.jpg",
        price:'58.00',
        name:"The Elemental Mage"
    },
    {
        id:7,
        img:"./img/book14.jpg",
        price:'55.00',
        name:"The Kite Runner"
    },
    {
        id:8,
        img:"./img/book21.jpg",
        price:'74.00',
        name:"The Hall of Shadows"
    },
    {
        id:9,
        img:"./img/book29.jpg",
        price:'37.00',
        name:"Wnierspeil"
    },
    {
        id:10,
        img:"./img/book10.jpg",
        price:'29.00',
        name:"The 1619 Project"
    },
    {
        id:11,
        img:"./img/book22.jpg",
        price:'35.00',
        name:"Relgn of Blood"
    },
    {
        id:12,
        img:"./img/book12.webp",
        price:'39.00',
        name:"We Hunt the Flame"
    },
]
books.forEach((x)=>{
    document.querySelector('.books').innerHTML+=
    ` <div class="book"><div class="sira">
    <div class="nizam">
      <div class="book-img">
        <a href=""><img src="${x.img}"></a>
      </div>
      <div class="sebet">
        <div class="book-title">
          <a href=""><h5>${x.name}</h5></a>
        </div>
        <div class="book-price">
          <div>
            <p class="cost">${x.price}<span>$</span></p>
          </div>
          <div>
            <button class="btn-add">
              <i class="fas fa-cart-plus"onclick="addbasket(${x.id})"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div></div>`
})
//////////////////////////////////////////////////////////////////////////////
let sebet=[]
function sebetload(){
    document.querySelector("table").innerHTML=" "
    let total=0 ;
    sebet.forEach((s,index)=>{
        const test=books.filter((item)=>{
            return item.id==s.id
        })[0]
        test.count=s.count  
        document.querySelector("table").innerHTML+=
    `<tr>
        <td><img src="${test.img}"></td>
        <td>${test.name}</td>
        <td ><span class="btn" onclick="azalt(${test.id})"><i class="fas fa-minus-circle"></i></span>${test.count}<span class="btn" onclick="artir(${test.id})"><i class="fas fa-plus-circle"></i></span></td>
        <td><span>${test.count*test.price}</span> $</td>
        <td onclick="removerow(${index})"><span class="dlt"><i class="far fa-times-circle"></i></span></td>
    </tr>`
    total+=test.price*test.count
    })
    document.querySelector("#totalprice").innerHTML=total+" $ "
}
function removerow(x){
    sebet.splice(x,1)
    sebetload()
    document.querySelector("#btnbasket span").innerHTML=sebet.length
}
function addbasket(x){
    let axtar=sebet.filter((s)=>{
        return s.id==x
    })
    if(axtar.length==0){
        sebet.push({
            id: x,
            count:1
        })
    }else{
        axtar[0].count++
    }
    document.querySelector("#btnbasket span").innerHTML=sebet.length
}
function azalt(x){
    let axtar=sebet.filter((s)=>{
        return s.id==x
    })[0];
    axtar.count--
    if(axtar.count==0){
        sebet.splice(sebet.indexOf(axtar),1)
    }
    sebetload()
    document.querySelector("#btnbasket span").innerHTML=sebet.length
}
function artir(x){
    sebet.filter((s)=>{
        return s.id==x
    })[0].count++;
    sebetload()
}
document.querySelector("#btnbasket").onclick=()=>{
    sebetload()
    document.querySelector("#basket").style.display="block"
}
document.querySelector(".modal-bas1 span").onclick=()=>{
    document.querySelector("#basket").style.display="none"
}
////////////////////////////////////////////////////////////////////////////////////
var stop1;
var stop2;
var stop3;
var a=0;
var b=0;
var c=0;
window.addEventListener("scroll",function(){
    if(window.scrollY>2500){
        clearInterval(stop1);
        stop1=setInterval(yazicisayi,41);
        clearInterval(stop2);
        stop2=setInterval(toplam,6);
        clearInterval(stop3);
        stop3=setInterval(satilan,15)
    }else{
        a=0;
        b=0;
        c=0;
        document.querySelector('.yazicisayi').innerHTML=a;
        document.querySelector('.toplam').innerHTML=b;
        document.querySelector('.satilan').innerHTML=c;
    }
})
function yazicisayi(){
    if(a==112){
        clearInterval(stop1)
    }else{
        document.querySelector('.yazicisayi').innerHTML=++a;
    }
}
function toplam(){
    if(b==745){
        clearInterval(stop2)
    }else{
        document.querySelector('.toplam').innerHTML=++b;
    }
}
function satilan(){
    if(c==323){
        clearInterval(stop3)
    }else{
        document.querySelector('.satilan').innerHTML=++c;
    }
}
//////////////////////////////////////////////////////////////////////////////
document.ready(function(){
    $(".all").click(function(){
        if($(this).prop('checked')){
            $('input').prop('checked',true)
            $('.box').show()
        }else{
            $('input').prop('checked',false)
            $('.box').hide()
        }
    });
    var n=' '
    $('.filtr').click(function(){
        if($(this).prop('checked')===true){
            n=$(this).parent().children().attr('cat')
            $('.box img').each(function(){
                if(n==$(this).attr('cat')){
                    $(this).parent('.box').show()
                }
            })
        }else{
            n=$(this).parent().children().attr('cat')
            $('.box img').each(function(){
                if(n==$(this).attr('cat')){
                    $(this).parent('.box').hide()
                }
            })
        }
    })
})
///////////////////////////////////////////////////////////////////////
function sil(){
    $(".menu").hide()
}
function menu(){
    $(".menu").show()
}