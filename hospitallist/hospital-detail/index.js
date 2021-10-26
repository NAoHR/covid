$(document).ready(()=>{
    const urlString = window.location.search;
    const parameter = new URLSearchParams(urlString);
    const verify = parameter.has("hospitallid");
    const provBack = parameter.get("provinceName");
    const citBack = parameter.get("cityName");
    

    const UrlisInvalid = (invalidMessage)=>{
        $(".lds-dual-ring").css("display","none");
        $(".notiError").append(`
        <h1 class="message">
            <i class="fa fa-frown-o" aria-hidden="true"></i> ${invalidMessage}
        </h1>
        `);
    };

    const UrlisValid = (dataValid)=>{
        $(".mainitem").append(`
            <h2 class="titlebottom" id="link-back">
                <a href="../index.html?provinceName=${provBack}&cityName=${citBack}" id="link-back">
                    <i class="fa fa-arrow-circle-left" aria-hidden="true"></i> back
                </a>
            </h2>
            <h2 class="titlebottom">
                <i class="fa fa-hospital-o" aria-hidden="true"></i> ${dataValid.data.name}
            </h2>
            <h2 class="details" id="goingToMap">
                <i class="fa fa-map-marker" aria-hidden="true"></i> ${dataValid.data.address}
            </h2>
            <h2 class="details">
                <i class="fa fa-phone" aria-hidden="true"></i> ${dataValid.data.phone}
            </h2>
            <br>
            <h2 class="titlebottom">
                <i class="fa fa-bed" aria-hidden="true"></i> Detail Tempat Tidur
            </h2>
        `);


        const urlchangeToMaps = "https://rs-bed-covid-api.vercel.app/api/get-hospital-map?hospitalid="
        const changeToMaps = (mapsAjax)=>{
            console.log(mapsAjax);
            console.log(dataValid);
            $("#goingToMap").replaceWith(`
            <h2 class="details">
                <a href="${mapsAjax.data.gmaps}" class="linkMap">
                    <i class="fa fa-map-marker" aria-hidden="true"></i> ${dataValid.data.address}
                </a>
            </h2>
            `)
        }
        const ajaxCheckMaps = new XMLHttpRequest;
        ajaxCheckMaps.onload = (()=>{
            const mapsData = JSON.parse(ajaxCheckMaps.responseText);
            changeToMaps(mapsData);
        })
        ajaxCheckMaps.open("GET",urlchangeToMaps+String(dataValid.data.id))
        ajaxCheckMaps.send();


        dataValid.data.bedDetail.forEach((item,index)=>{
            $(".mainitem").append(`
                <h2 class="details" id="titlepenjelas">
                    ${index + 1}.&nbsp ${item.stats.title}
                </h2>
                <h2 class="details" id="penjelas">
                    <i class="fa fa-dot-circle-o" aria-hidden="true"></i> Waktu : ${item.time}
                </h2>
                <h2 class="details" id="penjelas">
                    <i class="fa fa-dot-circle-o" aria-hidden="true"></i> tersedia : ${item.stats.bed_available}
                </h2>
                <h2 class="details" id="penjelas">
                    <i class="fa fa-dot-circle-o" aria-hidden="true"></i> Kosong &nbsp: ${item.stats.bed_empty}
                </h2>
                <h2 class="details" id="penjelas">
                    <i class="fa fa-dot-circle-o" aria-hidden="true"></i> Antrean  : ${item.stats.queue}
                </h2>
                <br>
            `);
        });
    }

    const ajaxChecker = (dataTest)=>{
        if(dataTest.status == 200){
            if(dataTest.data.name != ""){
                $(".mainitem").css({
                    "padding-top": "30px",
                    "padding-bottom" : "30px",
                    "padding-left" : "20px",
                    "padding-right" : "20px"
                });
                UrlisValid(dataTest);
            }else{
                UrlisInvalid("invalid hospital");
            };
        }else{
            UrlisInvalid("connection refused");
        };
    };


    if(verify){
        if(parameter.get("hospitallid")){
            $(".notiError").css("display","none");
            const checkIteminVerify = parameter.get("hospitallid");
            const ajaxRequest = new XMLHttpRequest;
            ajaxRequest.onload = (()=>{
                const ajaxRequestData = JSON.parse(ajaxRequest.responseText);
                ajaxChecker(ajaxRequestData);
                $(".lds-dual-ring").css("display","none");
            });
            ajaxRequest.open("GET",`https://rs-bed-covid-api.vercel.app/api/get-bed-detail?hospitalid=${checkIteminVerify}&type=1`);
            ajaxRequest.send()
        }else{
            UrlisInvalid("Link is Invalid");    
        }
    }else{
        UrlisInvalid("Link is Invalid");
    }

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
    });
});