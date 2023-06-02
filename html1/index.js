








// 左标题是否打开
let left_check_on=false




window.onload=function(){
    let san=document.getElementsByClassName("san_but")[0]
    let l_bar=document.getElementsByClassName("left_bar")[0]
    console.log(san)
    san.addEventListener("click", (e)=>{
        if(left_check_on){
            l_bar.setAttribute("style", "display:none;")
            left_check_on=false
        }else{
            l_bar.setAttribute("style", "display:inline-block;")
            left_check_on=true
        }
    })
}


