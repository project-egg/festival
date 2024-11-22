import { xmlToJson } from "./xmlToJson.js";

const pageNo = 1;

const apiKey =
  "3ih8%2BQR83rsvCEY8npFeJxn4kCUYoPwt%2BCGlm5t4iMup1WvwgEErvFno2bFeGwyZ20DymdWNc7mQlGVM8Pb9tg%3D%3D";
const apiUrl = `http://api.data.go.kr/openapi/tn_pubr_public_cltur_fstvl_api?serviceKey=${apiKey}&pageNo=${pageNo}&numOfRows=1266`; // API 호출 URL


const festivalDatas = await fetchFestivalData(apiUrl);

async function fetchFestivalData(apiUrl) {

    const response = await fetch(apiUrl); // API 호출
    const data = await response.text();  // 응답을 텍스트로 변환

    const XmlNode = new DOMParser().parseFromString(data, "text/xml");

    // xml형식을 json으로 파싱
    const date = new Date();
    const today = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  
    console.log(today);
    
    const jsonData = xmlToJson(XmlNode);
    const festivalRes = jsonData.response.body.items.item;
    let index = 0;
    console.log(festivalRes);
    
    const filteredByTodayData = festivalRes.filter((data)=>{
      return data.fstvlEndDate >= today;
    }).map(data=>{
      return {
        latitude : data.latitude,
        longitude: data.longitude,
        auspcInsttNm: data.auspcInsttNm,  // 축제기관
        fstvlCo: data.fstvlCo,  // 축제 상세
        fstvlEndDate: data.fstvlEndDate, // 종료일
        fstvlNm: data.fstvlNm, // 축제이름
        fstvlStartDate: data.fstvlStartDate, // 시작일
        homepageUrl: data.homepageUrl, // 홈페이지 주소
        lnmadr: data.lnmadr, // 지번
        mnnstNm: data.mnnstNm, // 개최기관?
        opar: data.opar, // 장소명
        phoneNumber: data.phoneNumber, //전화번호
        rdnmadr: data.rdnmadr, // 도로명주소
        id: index++, // id 값에 인덱스를 1씩 증가
      };
    })

    return filteredByTodayData;
  
}
  
  export default festivalDatas;