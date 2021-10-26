$(document).ready(()=>{
    const urlCovid = "https://damp-wave-20892.herokuapp.com/https://api.kawalcorona.com/indonesia";
    const dataParser = (data)=>{
        data = data[0]
        const confirmed = data.positif;
        const sembuh = data.sembuh;
        const meninggal = data.meninggal;

        $(".lds-ring").remove();
		$(".sembuh .centered").append(`<h1 class="case">${sembuh}</h1>`);
		$(".positif .centered").append(`<h1 class="case">${confirmed}</h1>`);
		$(".kematian .centered").append(`<h1 class="case">${meninggal}</h1>`);
    };
    const fetchData = async (urlData)=>{
        const data = await fetch(urlData,{"method" : "GET"}).then((val)=>{
            return val.json()
        });
        await dataParser(data);
    }
    fetchData(urlCovid);

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