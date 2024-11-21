import { festivalDatas } from "./festival.js";

const $searchBtn = document.getElementById('searchBtn');
const $startDay = document.getElementById('start-calendar');
const $endDay = document.getElementById('end-calendar');

function setCalendarDate(){
  const date = new Date();
  const weekFromDate =  new Date();
  weekFromDate.setDate(date.getDate() + 7);
  const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
    
  )}-${String(date.getDate()).padStart(2, "0")}`;
  const weekFromToday = `${weekFromDate.getFullYear()}-${String(weekFromDate.getMonth() + 1).padStart(
    2,
    "0"
    
  )}-${String(weekFromDate.getDate()).padStart(2, "0")}`;

  if($startDay.value){
    console.log('true');
    
    const weekFromDate =  new Date($startDay.value);
    console.log(weekFromDate);
    
    weekFromDate.setDate(date.getDate() + 7);
    const weekFromToday = `${weekFromDate.getFullYear()}-${String(weekFromDate.getMonth() + 1).padStart(
      2,
      "0"
      
    )}-${String(weekFromDate.getDate()).padStart(2, "0")}`;
    $endDay.value = weekFromToday;
  }else{
    console.log('false');
    $startDay.value = today;
    $endDay.value = weekFromToday;
  }
}

setCalendarDate();



$startDay.addEventListener('input',e=>{
  setCalendarDate();
});

$searchBtn.addEventListener('click',e=>{
  const $startDay = $startDay.value;
  const $endDay = $endDay.value;
});