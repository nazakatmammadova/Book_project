$(document).ready(function () {
    $(".all").click(function(){
        if($(this).prop('checked')){
            $('input').prop('checked',true)
            $('.box').show()
        }else{
            $('input').prop('checked',false)
            $('.box').hide()
        }
    });
    var a=' '
    $('.filtr').click(function(){
        if($(this).prop('checked')===true){
            a=$(this).parent().children().attr('cat')
            $('.box img').each(function(){
                if(a==$(this).attr('cat')){
                    $(this).parent('.box').show()
                }
            })
        }else{
            a=$(this).parent().children().attr('cat')
            $('.box img').each(function(){
                if(a==$(this).attr('cat')){
                    $(this).parent('.box').hide()
                }
            })
        }
    })
});
//////////////////////////////////////////////////////
var daire=document.querySelector('.daire')
document.addEventListener('mousemove', function(e){
var x= e.clientX;
var y= e.clientY;
daire.style.left=x+"px";
daire.style.top=y+"px";    
})
////////////////////////////////////////////////////////
function sil(){
    $(".menu").hide()
}
function menu(){
    $(".menu").show()

}