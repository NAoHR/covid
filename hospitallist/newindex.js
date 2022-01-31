$(document).ready(()=>{
    const urlProvince = "https://rs-bed-covid-api.vercel.app/api/get-provinces";
    const urlCityId = "https://rs-bed-covid-api.vercel.app/api/get-cities?provinceid=";
    const getRoomandHospital= "https://rs-bed-covid-api.vercel.app/api/get-bed-detail?hospitalid=5171133&type=1";


    const urlProvinceParse = (dataUP) =>{
        dataUP.provinces.forEach((item)=>{
            $("#selected").append(`<option value='${item.id}'>${item.name}</option>`);
        })
    }
    const urlCityIdParse = (dataUCI) =>{
        $("#city option").remove();
        dataUCI.cities.forEach((item)=>{
            $("#city").append(`<option value='${item.id}'>${item.name}</option>`);
        });
    };
    const getRoomandHospitalParse = (dataGR,provinceId,cityId) =>{
        const getMap = (mapDetails,jsonItem) =>{

            if(popup < 1){
                $(".right-loader").css("display","none");
                $(".noti").css("right","20px");
                setTimeout(()=>{
                    $(".noti").css("right","-200px");
                },2000);
            };
            $(".bottomcontent").append(`
            <div class="contentbottom">
                <h2 class="titlebottom">
                    <a href="${mapDetails.data.gmaps}" class="linkMap">
                        <i class="fa fa-hospital-o" aria-hidden="true"></i> ${jsonItem.name}
                    </a>
                </h2>
                <h3 class="details">
                    <a href="${mapDetails.data.gmaps}" class="linkMap">
                        <i class="fa fa-map-marker" aria-hidden="true"></i>&nbsp ${jsonItem.address}
                    </a>
                </h3>
                <h3 class="details">
                    <a href="hospital-detail/index.html?hospitallid=${jsonItem.id}&provinceName=${provinceId}&cityName=${cityId}" class="linkMap">
                        <i class="fa fa-info-circle" aria-hidden="true"></i>&nbsp Detail Rumah Sakit
                    </a>
                </h3>
                <h3 class="details">
                    <i class="fa fa-phone" aria-hidden="true"></i>&nbsp ${jsonItem.phone}
                </h3>
                <h3 class="details">
                    <i class="fa fa-bed" aria-hidden="true"></i> &nbsp ${jsonItem.bed_availability} unit
                </h3>
                <h3 class="details">
                    antrean: &nbsp ${jsonItem.queue}
                </h3>
                <h3 class="details">
                    status data: &nbsp ${jsonItem.info}
                </h3>
            </div>
            `);
        };
        let popup = 0;
        if(dataGR.hospitals != ""){
            $(".contentbottom").remove()
            dataGR.hospitals.forEach((item)=>{
                const ajaxGetMap = new XMLHttpRequest;
                ajaxGetMap.onload = (()=>{
                    const mapData = JSON.parse(ajaxGetMap.responseText);
                    getMap(mapData,item);
                    popup +=1;
                });
                ajaxGetMap.open("GET",`https://rs-bed-covid-api.vercel.app/api/get-hospital-map?hospitalid=${item.id}`)
                ajaxGetMap.send();
            });
            popup = 0;
        }else{
            $(".right-loader").css("display","none");
            $(".noti").css("right","20px");
            setTimeout(()=>{
                $(".noti").css("right","-200px");
            },2000)
            $(".contentbottom").remove()
            $(".bottomcontent").append(`
            <div class="contentbottom">
                <h2 class="titlebottom">
                    <i class="fa fa-frown-o" aria-hidden="true"></i> Data Tidak Ada
                </h2>
                <h3 class="details">
                    <i class="fa fa-times" aria-hidden="true"></i>&nbsp Tidak ada rumah sakit khusus covid di tempat yang anda cari
                </h3>
            </div>
            `)
        }
    }


    const getProvice = async () =>{
        try{
            const provinceCreds = await fetch(urlProvince);
            const jsonedProviceCreds = await provinceCreds.json();
            urlProvinceParse(jsonedProviceCreds);
        }catch(Err){
            alert("province api is not working");
        }
    }
    getProvice();
    $("#selected").on("change" , async () =>{
        const valofProvince = $("#selected").val();
        if(valofProvince !== "none"){
            try{
                const reqtoCity = await fetch(`${urlCityId}${valofProvince}`);
                const jsonedReqtoCity = await reqtoCity.json();
                urlCityIdParse(jsonedReqtoCity);
                $("#city").prop("disabled",false);
                $("#submitdata").prop("disabled",false);
                $("#submitdata").css("color","#eee")
            }catch(Err){
                alert("city api is not working");
            }
        }else{
            $("#city").prop("disabled",true);
            $("#submitdata").prop("disabled",true);
            $("#submitdata").css("color","var(--textdarker)")
        }
    })

    const mainfunc = async (sbmit=null,provDataName = null,citDataName = null) => {
        try{
            const provdata = provDataName == null ? $("#selected").val() : provDataName;
            const citydata = citDataName == null ? $("#city").val() : citDataName;
            const reqtofinal = await fetch(`https://rs-bed-covid-api.vercel.app/api/get-hospitals?provinceid=${provdata}&cityid=${citydata}&type=1`)
            const jsonedRTF = await reqtofinal.json()
            getRoomandHospitalParse(jsonedRTF,provdata,citydata);
            if(sbmit){
                $("#submitdata").css("width","90px");
                $("#height").css("height","50px");
            }
        }catch(Err){
            console.log(Err)
            alert("cant retrify the data");
        }
    }
    const urlLink = window.location.search;
    const parameterUrlLink = new URLSearchParams(urlLink);
    const prName = parameterUrlLink.get("provinceName")
    const ctName = parameterUrlLink.get("cityName");

    if(prName && ctName){
        $(".right-loader").css("display","inline-block");
        mainfunc(false,prName,ctName);
    }
    $("#submitdata").click(()=>{
        $("#submitdata").css("width","80px");
        $("#height").css("height","30px");
        mainfunc(true,null,null);
    })
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