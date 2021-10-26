$(document).ready(()=>{
    const urlCovid = "https://covid19.mathdro.id/api/countries/indonesia";
    const ajaxParser = (data)=>{
        console.log(data.confirmed.value)
        console.log(data);
        const confirm = data.confirmed.value;
		const recover = data.recovered.value;
		const death = data.deaths.value;
		$(".sembuh .centered").append(`<h1 class="case">${recover}</h1>`);
		$(".positif .centered").append(`<h1 class="case">${confirm}</h1>`);
		$(".kematian .centered").append(`<h1 class="case">${death}</h1>`);
    };


    const ajax = new XMLHttpRequest();
    ajax.onload = (()=>{
        const data = JSON.parse(ajax.responseText);
        ajaxParser(data);
    });
    ajax.open("GET",urlCovid);
    ajax.send()
    let counter = 0;
    $(".bars").click(()=>{
        if(counter %2 == 0){
            document.getElementsByClassName("fa fa-bars")[0].setAttribute("class","fa fa-times");
            $(".minimaldata").css("height","250px");
            $(".minimaldata").css("padding-top","30px");
        }else{
            document.getElementsByClassName("fa fa-times")[0].setAttribute("class","fa fa-bars");
            $(".minimaldata").css("height","0px");
            $(".minimaldata").css("padding-top","0px");
        };
        counter +=1;
    })
});