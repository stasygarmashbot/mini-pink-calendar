// Мини календарь: оттенок зависит от месяца, today подсвечивается автоматически

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

// 12 оттенков розового: от пудрового до чуть более насыщенного, без «кислоты»
const palette = [
  { accent:"#cfa0b1", soft:"#f2dde5" }, // Jan
  { accent:"#c88ea5", soft:"#f1d7e2" }, // Feb
  { accent:"#c27f99", soft:"#efd2de" }, // Mar
  { accent:"#bd7d94", soft:"#edd0db" }, // Apr
  { accent:"#c38fa6", soft:"#f1dae4" }, // May
  { accent:"#d1a0b2", soft:"#f4dfe7" }, // Jun
  { accent:"#cf9aa8", soft:"#f3dde3" }, // Jul
  { accent:"#c58da0", soft:"#f1d7df" }, // Aug
  { accent:"#b97c90", soft:"#edd0d9" }, // Sep
  { accent:"#bf8598", soft:"#efd6de" }, // Oct
  { accent:"#c595a7", soft:"#f1dbe3" }, // Nov
  { accent:"#d0a4b4", soft:"#f4e1e8" }  // Dec
];

const dowContainer = document.getElementById("dow");
const grid = document.getElementById("grid");
const monthLabel = document.getElementById("monthLabel");
const yearLabel = document.getElementById("yearLabel");

const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const todayBtn = document.getElementById("todayBtn");

const now = new Date();
let viewYear = now.getFullYear();
let viewMonth = now.getMonth(); // 0..11

// Понедельник первым как в Украине: Пн..Нд
const dow = ["M","T","W","T","F","S","S"];

function setThemeByMonth(m){
  const { accent, soft } = palette[m];
  document.documentElement.style.setProperty("--accent", accent);
  document.documentElement.style.setProperty("--accentSoft", soft);
}

function mondayFirstIndex(jsDay){ // JS: 0 Sun..6 Sat -> 0 Mon..6 Sun
  return (jsDay + 6) % 7;
}

function daysInMonth(y, m){
  return new Date(y, m + 1, 0).getDate();
}

function buildDow(){
  dowContainer.innerHTML = "";
  dow.forEach(d => {
    const el = document.createElement("div");
    el.textContent = d;
    dowContainer.appendChild(el);
  });
}

function render(){
  setThemeByMonth(viewMonth);

  monthLabel.textContent = monthNames[viewMonth];
  yearLabel.textContent = String(viewYear);

  grid.innerHTML = "";

  const firstDay = new Date(viewYear, viewMonth, 1);
  const firstIndex = mondayFirstIndex(firstDay.getDay()); // 0..6
  const totalDays = daysInMonth(viewYear, viewMonth);

  // Сколько ячеек: 6 недель * 7 = 42 (стабильно для Notion)
  const cells = 42;

  // Предыдущий месяц для «хвостов»
  const prevMonth = (viewMonth + 11) % 12;
  const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear;
  const prevDays = daysInMonth(prevYear, prevMonth);

  for(let i = 0; i < cells; i++){
    const cell = document.createElement("div");
    cell.className = "cell";

    const col = i % 7;
    const isWeekend = (col === 5 || col === 6);

    let dayNum;
    let inMonth = true;
    let cellYear = viewYear;
    let cellMonth = viewMonth;

    if(i < firstIndex){
      // дни предыдущего месяца
      inMonth = false;
      dayNum = prevDays - (firstIndex - 1 - i);
      cellMonth = prevMonth;
      cellYear = prevYear;
      cell.classList.add("out");
    } else if(i >= firstIndex + totalDays){
      // дни следующего месяца
      inMonth = false;
      dayNum = i - (firstIndex + totalDays) + 1;
      cellMonth = (viewMonth + 1) % 12;
      cellYear = viewMonth === 11 ? viewYear + 1 : viewYear;
      cell.classList.add("out");
    } else {
      // дни текущего месяца
      dayNum = i - firstIndex + 1;
      cell.classList.add("in");
    }

    cell.textContent = dayNum;

    if(isWeekend) cell.classList.add("weekend");

    // подсветка сегодняшней даты только если совпадает год/месяц/день
    if(
      inMonth &&
      viewYear === now.getFullYear() &&
      viewMonth === now.getMonth() &&
      dayNum === now.getDate()
    ){
      cell.classList.add("today");
    }

    grid.appendChild(cell);
  }
}

prevBtn.addEventListener("click", () => {
  viewMonth--;
  if(viewMonth < 0){ viewMonth = 11; viewYear--; }
  render();
});

nextBtn.addEventListener("click", () => {
  viewMonth++;
  if(viewMonth > 11){ viewMonth = 0; viewYear++; }
  render();
});

todayBtn.addEventListener("click", () => {
  viewYear = now.getFullYear();
  viewMonth = now.getMonth();
  render();
});

buildDow();
render();
