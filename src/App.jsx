import React, { useState, useRef, useEffect } from "react";

// ============ LASTNOSTI ============
const TRAITS = {
  SN: { ico: "🎯", n: "Snajper" },
  BR: { ico: "🛡️", n: "Branilec" },
  OR: { ico: "🧠", n: "Organizator" },
  SM: { ico: "🔥", n: "Šesti mož" },
  VD: { ico: "⭐", n: "Vodja" },
};

// ============ 116 KART ============
// [ime, klub, pozicija, plača M$, OVR, +/-, lastnost]
const RAW = [
  // ---- PG (23) ----
  ["Shai Gilgeous-Alexander","Oklahoma City","PG",38,98,12,"OR"],
  ["Luka Dončić","LA Lakers","PG",46,97,7,"OR"],
  ["Jalen Brunson","New York","PG",25,94,6,"VD"],
  ["Tyrese Haliburton","Indiana","PG",46,92,8,"OR"],
  ["Cade Cunningham","Detroit","PG",46,91,5,"OR"],
  ["De'Aaron Fox","San Antonio","PG",37,89,2,"BR"],
  ["Jamal Murray","Denver","PG",40,88,5,"SN"],
  ["Ja Morant","Memphis","PG",34,88,2,"OR"],
  ["Trae Young","Atlanta","PG",36,88,2,"OR"],
  ["Immanuel Quickley","Toronto","PG",18,84,1,"SN"],
  ["Coby White","Chicago","PG",12,84,2,"SN"],
  ["Payton Pritchard","Boston","PG",7,84,4,"SM"],
  ["Andrew Nembhard","Indiana","PG",18,83,4,"BR"],
  ["Scoot Henderson","Portland","PG",12,81,0,"OR"],
  ["Keyonte George","Utah","PG",4,81,-1,"SN"],
  ["T.J. McConnell","Indiana","PG",10,81,2,"SM"],
  ["Dennis Schröder","Sacramento","PG",14,80,0,"SM"],
  ["Ajay Mitchell","Oklahoma City","PG",3,80,3,"OR"],
  ["Tyus Jones","Vet. minimum","PG",7,80,0,"VD"],
  ["Jose Alvarado","New Orleans","PG",4,79,1,"BR"],
  ["Reed Sheppard","Houston","PG",5,79,0,"SN"],
  ["Tre Jones","Chicago","PG",7,79,1,"BR"],
  ["Isaiah Collier","Utah","PG",4,79,0,"OR"],
  // ---- SG (23) ----
  ["Anthony Edwards","Minnesota","SG",45,95,6,"SN"],
  ["Donovan Mitchell","Cleveland","SG",46,93,7,"SN"],
  ["Devin Booker","Phoenix","SG",44,92,3,"SN"],
  ["Jaylen Brown","Boston","SG",44,91,4,"BR"],
  ["Tyrese Maxey","Philadelphia","SG",38,90,2,"SN"],
  ["Jalen Williams","Oklahoma City","SG",7,90,9,"BR"],
  ["Amen Thompson","Houston","SG",10,88,7,"BR"],
  ["Derrick White","Boston","SG",28,86,6,"BR"],
  ["Austin Reaves","LA Lakers","SG",14,86,3,"OR"],
  ["Zach LaVine","Sacramento","SG",20,85,0,"SN"],
  ["Josh Giddey","Chicago","SG",18,85,1,"OR"],
  ["Christian Braun","Denver","SG",5,84,5,"BR"],
  ["Norman Powell","Miami","SG",21,84,2,"SN"],
  ["Cam Thomas","Brooklyn","SG",6,83,-2,"SM"],
  ["Malik Monk","Sacramento","SG",18,82,0,"SM"],
  ["Quentin Grimes","Philadelphia","SG",8,82,1,"SN"],
  ["Anfernee Simons","Boston","SG",12,82,-1,"SN"],
  ["Klay Thompson","Dallas","SG",17,80,-1,"SN"],
  ["Malik Beasley","Detroit","SG",6,80,0,"SN"],
  ["Isaiah Joe","Oklahoma City","SG",6,80,2,"SN"],
  ["Max Christie","Dallas","SG",8,80,1,"BR"],
  ["Buddy Hield","Golden State","SG",9,79,0,"SN"],
  ["Gradey Dick","Toronto","SG",6,79,-1,"SN"],
  // ---- SF (23) ----
  ["Jayson Tatum","Boston","SF",54,95,7,"SN"],
  ["Kevin Durant","Houston","SF",48,93,4,"SN"],
  ["LeBron James","LA Lakers","SF",53,93,4,"VD"],
  ["Kawhi Leonard","LA Clippers","SF",50,92,4,"BR"],
  ["Jimmy Butler","Golden State","SF",44,90,4,"VD"],
  ["Paolo Banchero","Orlando","SF",15,90,2,"OR"],
  ["Franz Wagner","Orlando","SF",38,89,4,"OR"],
  ["OG Anunoby","New York","SF",40,86,5,"BR"],
  ["Deni Avdija","Portland","SF",15,86,4,"OR"],
  ["Mikal Bridges","New York","SF",24,85,3,"BR"],
  ["Trey Murphy III","New Orleans","SF",25,85,2,"SN"],
  ["Brandon Miller","Charlotte","SF",11,85,0,"SN"],
  ["Jaden McDaniels","Minnesota","SF",23,84,3,"BR"],
  ["Herbert Jones","New Orleans","SF",14,84,3,"BR"],
  ["Josh Hart","New York","SF",19,83,3,"VD"],
  ["Andrew Wiggins","Miami","SF",15,83,1,"BR"],
  ["Aaron Nesmith","Indiana","SF",11,82,3,"BR"],
  ["Keegan Murray","Sacramento","SF",12,82,1,"SN"],
  ["Matas Buzelis","Chicago","SF",6,82,0,"SM"],
  ["Rui Hachimura","LA Lakers","SF",17,81,1,"SN"],
  ["Jaylen Wells","Memphis","SF",2,80,2,"BR"],
  ["Dorian Finney-Smith","Houston","SF",14,79,1,"BR"],
  ["Ziaire Williams","Brooklyn","SF",6,78,0,"SM"],
  // ---- PF (23) ----
  ["Giannis Antetokounmpo","Milwaukee","PF",54,97,9,"BR"],
  ["Evan Mobley","Cleveland","PF",39,91,7,"BR"],
  ["Pascal Siakam","Indiana","PF",45,89,5,"VD"],
  ["Jaren Jackson Jr.","Memphis","PF",25,88,4,"BR"],
  ["Jalen Johnson","Atlanta","PF",30,87,3,"OR"],
  ["Zion Williamson","New Orleans","PF",28,87,2,"OR"],
  ["Scottie Barnes","Toronto","PF",27,87,1,"OR"],
  ["Lauri Markkanen","Utah","PF",28,86,1,"SN"],
  ["Julius Randle","Minnesota","PF",25,85,2,"OR"],
  ["Aaron Gordon","Denver","PF",23,85,3,"BR"],
  ["Naz Reid","Minnesota","PF",25,83,2,"SM"],
  ["P.J. Washington","Dallas","PF",14,82,2,"BR"],
  ["Jabari Smith Jr.","Houston","PF",12,82,1,"SN"],
  ["Draymond Green","Golden State","PF",26,82,4,"VD"],
  ["Toumani Camara","Portland","PF",2,82,4,"BR"],
  ["Obi Toppin","Indiana","PF",14,80,1,"SM"],
  ["Jeremy Sochan","San Antonio","PF",6,80,1,"BR"],
  ["Santi Aldama","Memphis","PF",8,80,0,"SM"],
  ["Bobby Portis","Milwaukee","PF",13,79,1,"SM"],
  ["GG Jackson","Memphis","PF",2,79,0,"SM"],
  ["Guerschon Yabusele","New York","PF",6,79,1,"SM"],
  ["Naji Marshall","Dallas","PF",9,79,1,"BR"],
  ["Kyle Kuzma","Milwaukee","PF",8,79,-2,"SN"],
  // ---- C (24) ----
  ["Nikola Jokić","Denver","C",55,99,13,"OR"],
  ["Victor Wembanyama","San Antonio","C",13,96,10,"BR"],
  ["Joel Embiid","Philadelphia","C",44,90,3,"VD"],
  ["Chet Holmgren","Oklahoma City","C",14,90,8,"BR"],
  ["Karl-Anthony Towns","New York","C",44,90,4,"SN"],
  ["Alperen Şengün","Houston","C",34,90,5,"OR"],
  ["Bam Adebayo","Miami","C",37,89,4,"BR"],
  ["Domantas Sabonis","Sacramento","C",34,88,2,"OR"],
  ["Ivica Zubac","LA Clippers","C",18,86,5,"BR"],
  ["Jarrett Allen","Cleveland","C",20,86,4,"BR"],
  ["Rudy Gobert","Minnesota","C",35,85,4,"BR"],
  ["Isaiah Hartenstein","Oklahoma City","C",28,84,6,"SM"],
  ["Walker Kessler","Utah","C",4,84,5,"BR"],
  ["Nic Claxton","Brooklyn","C",14,83,1,"BR"],
  ["Dereck Lively II","Dallas","C",5,83,4,"BR"],
  ["Daniel Gafford","Dallas","C",14,83,2,"SM"],
  ["Onyeka Okongwu","Atlanta","C",16,83,1,"SM"],
  ["Kel'el Ware","Miami","C",4,82,3,"BR"],
  ["Zach Edey","Memphis","C",6,81,2,"BR"],
  ["Mitchell Robinson","New York","C",13,81,3,"BR"],
  ["Donovan Clingan","Portland","C",7,81,2,"BR"],
  ["Brook Lopez","LA Clippers","C",9,80,0,"SN"],
  ["Luke Kornet","San Antonio","C",10,79,3,"SM"],
  ["Al Horford","Golden State","C",5,78,2,"VD"],
];
const AGES = {
  "Shai Gilgeous-Alexander":27,"Luka Dončić":26,"Jalen Brunson":29,"Tyrese Haliburton":25,"Cade Cunningham":24,"De'Aaron Fox":28,"Jamal Murray":28,"Ja Morant":26,"Trae Young":27,"Immanuel Quickley":26,"Coby White":25,"Payton Pritchard":27,"Andrew Nembhard":25,"Scoot Henderson":21,"Keyonte George":22,"T.J. McConnell":33,"Dennis Schröder":32,"Ajay Mitchell":23,"Tyus Jones":29,"Jose Alvarado":27,"Reed Sheppard":21,"Tre Jones":25,"Isaiah Collier":21,
  "Anthony Edwards":24,"Donovan Mitchell":29,"Devin Booker":29,"Jaylen Brown":29,"Tyrese Maxey":25,"Jalen Williams":24,"Amen Thompson":22,"Derrick White":31,"Austin Reaves":27,"Zach LaVine":30,"Josh Giddey":23,"Christian Braun":24,"Norman Powell":32,"Cam Thomas":24,"Malik Monk":27,"Quentin Grimes":25,"Anfernee Simons":26,"Klay Thompson":35,"Malik Beasley":29,"Isaiah Joe":26,"Max Christie":22,"Buddy Hield":33,"Gradey Dick":22,
  "Jayson Tatum":27,"Kevin Durant":37,"LeBron James":41,"Kawhi Leonard":34,"Jimmy Butler":36,"Paolo Banchero":23,"Franz Wagner":24,"OG Anunoby":28,"Deni Avdija":25,"Mikal Bridges":29,"Trey Murphy III":25,"Brandon Miller":23,"Jaden McDaniels":25,"Herbert Jones":27,"Josh Hart":30,"Andrew Wiggins":30,"Aaron Nesmith":26,"Keegan Murray":25,"Matas Buzelis":21,"Rui Hachimura":27,"Jaylen Wells":22,"Dorian Finney-Smith":32,"Ziaire Williams":24,
  "Giannis Antetokounmpo":31,"Evan Mobley":24,"Pascal Siakam":31,"Jaren Jackson Jr.":26,"Jalen Johnson":24,"Zion Williamson":25,"Scottie Barnes":24,"Lauri Markkanen":28,"Julius Randle":31,"Aaron Gordon":30,"Naz Reid":26,"P.J. Washington":27,"Jabari Smith Jr.":22,"Draymond Green":35,"Toumani Camara":25,"Obi Toppin":27,"Jeremy Sochan":22,"Santi Aldama":25,"Bobby Portis":30,"GG Jackson":21,"Guerschon Yabusele":30,"Naji Marshall":27,"Kyle Kuzma":30,
  "Nikola Jokić":30,"Victor Wembanyama":22,"Joel Embiid":31,"Chet Holmgren":23,"Karl-Anthony Towns":30,"Alperen Şengün":23,"Bam Adebayo":28,"Domantas Sabonis":29,"Ivica Zubac":28,"Jarrett Allen":27,"Rudy Gobert":33,"Isaiah Hartenstein":27,"Walker Kessler":24,"Nic Claxton":26,"Dereck Lively II":21,"Daniel Gafford":27,"Onyeka Okongwu":25,"Kel'el Ware":21,"Zach Edey":23,"Mitchell Robinson":27,"Donovan Clingan":21,"Brook Lopez":37,"Luke Kornet":30,"Al Horford":39,
};
const PLAYERS = RAW.map((r, i) => ({ id: i, n: r[0], club: r[1], pos: r[2], sal: r[3], ovr: r[4], pm: r[5], tr: r[6], age: AGES[r[0]] ?? 26 }));
// uradni NBA ID-ji za portrete (cdn.nba.com); rookie prospekti jih nimajo → obdržijo ikone
const NBA_ID = {"Shai Gilgeous-Alexander":1628983,"Luka Dončić":1629029,"Jalen Brunson":1628973,"Tyrese Haliburton":1630169,"Cade Cunningham":1630595,"De'Aaron Fox":1628368,"Jamal Murray":1627750,"Ja Morant":1629630,"Trae Young":1629027,"Immanuel Quickley":1630193,"Coby White":1629632,"Payton Pritchard":1630202,"Andrew Nembhard":1629614,"Scoot Henderson":1630703,"Keyonte George":1641718,"T.J. McConnell":204456,"Dennis Schröder":203471,"Ajay Mitchell":1642349,"Tyus Jones":1626145,"Jose Alvarado":1630631,"Reed Sheppard":1642263,"Tre Jones":1630200,"Isaiah Collier":1642268,"Anthony Edwards":1630162,"Donovan Mitchell":1628378,"Devin Booker":1626164,"Jaylen Brown":1627759,"Tyrese Maxey":1630178,"Jalen Williams":1631114,"Amen Thompson":1641708,"Derrick White":1628401,"Austin Reaves":1630559,"Zach LaVine":203897,"Josh Giddey":1630581,"Christian Braun":1631128,"Norman Powell":1626181,"Cam Thomas":1630560,"Malik Monk":1628370,"Quentin Grimes":1629656,"Anfernee Simons":1629014,"Klay Thompson":202691,"Isaiah Joe":1630198,"Max Christie":1631108,"Buddy Hield":1627741,"Gradey Dick":1641711,"Jayson Tatum":1628369,"Kevin Durant":201142,"LeBron James":2544,"Kawhi Leonard":202695,"Jimmy Butler":202710,"Paolo Banchero":1631094,"Franz Wagner":1630532,"OG Anunoby":1628384,"Deni Avdija":1630166,"Mikal Bridges":1628969,"Trey Murphy III":1630530,"Brandon Miller":1641706,"Jaden McDaniels":1630183,"Herbert Jones":1630529,"Josh Hart":1628404,"Andrew Wiggins":203952,"Aaron Nesmith":1630174,"Keegan Murray":1631099,"Matas Buzelis":1641824,"Rui Hachimura":1629060,"Jaylen Wells":1642377,"Dorian Finney-Smith":1627827,"Ziaire Williams":1630533,"Giannis Antetokounmpo":203507,"Evan Mobley":1630596,"Pascal Siakam":1627783,"Jaren Jackson Jr.":1628991,"Jalen Johnson":1630552,"Zion Williamson":1629627,"Scottie Barnes":1630567,"Lauri Markkanen":1628374,"Julius Randle":203944,"Aaron Gordon":203932,"Naz Reid":1629675,"P.J. Washington":1629023,"Jabari Smith Jr.":1631095,"Draymond Green":203110,"Toumani Camara":1641739,"Obi Toppin":1630167,"Jeremy Sochan":1631110,"Santi Aldama":1630583,"Bobby Portis":1626171,"GG Jackson":1641713,"Guerschon Yabusele":1627824,"Naji Marshall":1630230,"Kyle Kuzma":1628398,"Nikola Jokić":203999,"Victor Wembanyama":1641705,"Joel Embiid":203954,"Chet Holmgren":1631096,"Karl-Anthony Towns":1626157,"Alperen Şengün":1630578,"Bam Adebayo":1628389,"Domantas Sabonis":1627734,"Ivica Zubac":1627826,"Jarrett Allen":1628386,"Rudy Gobert":203497,"Isaiah Hartenstein":1628392,"Walker Kessler":1631117,"Nic Claxton":1629651,"Dereck Lively II":1641726,"Daniel Gafford":1629655,"Onyeka Okongwu":1630168,"Kel'el Ware":1642276,"Zach Edey":1641744,"Mitchell Robinson":1629011,"Donovan Clingan":1642270,"Brook Lopez":201572,"Luke Kornet":1628436,"Al Horford":201143,"Malik Beasley":1627736};
const faceUrl = (c) => NBA_ID[c.n] ? `https://cdn.nba.com/headshots/nba/latest/260x190/${NBA_ID[c.n]}.png` : null;
// vsak tier ima svoj POSEL (ne le višjo številko): 🔒 takoj · 🌱 mentor · 💎 minute
const ROOK_TIER = {
  safe: { ico: "🔒", n: "Pripravljen", col: "#2f8f4e", job: "zaigra TAKOJ ob podpisu (en met potenciala)" },
  proj: { ico: "🌱", n: "Projekt", col: "#a8781a", job: "ob mentorju (⭐ vodja ali coach JJ) raste tudi s klopi" },
  elite: { ico: "💎", n: "Elitni", col: "#7a4fd0", job: "zahteva minute — brez peterke pade na dno in 😤" },
};
// build-around kavlji: vsak prospekt ima svojo posebnost — draft ni več "diamant ali nič"
const HOOKS = {
  alfa: { n: "Alfa", d: "+10, če je štartar in tvoj edini igralec z OVR 90+" },
  micro: { n: "Mikrovalovka", d: "na klopi vreden 60 % OVR (namesto 50 %)" },
  rodovnik: { n: "Rodovnik", d: "+6, če imaš v rosterju še enega ⭐ vodjo" },
  kreator: { n: "Kreator", d: "+6 kot štartar ob vsaj 1 🎯 strelcu v peterki" },
  raketa: { n: "Raketa", d: "razvoj vrže 3 žrebe namesto 2 (če raste proti stropu)" },
  samotar: { n: "Samotar", d: "+4 kot štartar, če v peterki ni drugega ball-dominantnega" },
  ucenec: { n: "Učenec", d: "+2 OVR ob razvoju" },
  sidro: { n: "Sidro", d: "+12 kot štartar pri filozofiji Trdnjava (dodatni 🛡️)" },
  instant: { n: "Instant napad", d: "+6 na klopi, če imaš v peterki 🧠 organizatorja" },
  lepilo: { n: "Lepilo", d: "+4 kot štartar, če peterka pokriva vseh 5 pozicij" },
  odrasel: { n: "Odrasel", d: "+3 na klopi — zanesljiva menjava" },
  motor: { n: "Motor", d: "+4 kot štartar ob vsaj 2 🛡️ branilcih v peterki" },
};
// 🏗️ FRANŠIZNA INFRASTRUKTURA — drugi tir gradnje: nadgrajuješ jo čez sezone z 🧱 SKLADOM, spreminja PRAVILA tvoje ekonomije.
// Vsaka linija ima 3 ravni (L3 skrit do L2). Franšiza ob štartu vidi 5 od teh linij (Trening center zajamčen + 4 naključne).
const INFRA_COST = { 1: 3, 2: 5, 3: 8 };
const INFRA = {
  trening: { n: "Trening center", ico: "🏋️", d: ["Klop-proga razvoja +40 % hitreje", "Peterka-proga tudi +30 % hitreje", "⭑ kavelj mladca šteje dvojno ob razvoju"] },
  akademija: { n: "Akademija", ico: "🎓", d: ["Mladi se razvijajo do 24. leta (nam. 23)", "…do 25. leta", "Poletna liga razvija dvakrat hitreje"] },
  medicinski: { n: "Medicinski center", ico: "🩺", d: ["Rehab vedno stane le 1×🥈", "Tveganje poškodbe tvojih −50 %", "Poškodovanec se ob koncu tvoje poteze sam pozdravi"] },
  znanost: { n: "Športna znanost", ico: "🧬", d: ["Staranje 31–33 let blažje (−1)", "Upad 34+ razpolovljen", "Upokojitvena meja 72 → 66 (veterani dlje)"] },
  navijaci: { n: "Navijaška baza", ico: "📣", d: ["+6 tč pri polnem rosterju (10/10)", "+10 tč pri polnem rosterju", "+14 tč pri polnem rosterju"] },
  legende: { n: "Hiša legend", ico: "🧭", d: ["⭐ vodja: bonus +6", "⭐ vodja: bonus +10", "Mentor velja tudi za 💎 elite (na klopi ne 😤)"] },
};
const INFRA_IDS = Object.keys(INFRA);
// ☎️ ROLODEX — potrošne karte-klici, ki jih DRŽIŠ (max 3) in sam izbereš trenutek igranja med sezono.
// kind: now = odigraš na svoji potezi · target = izbereš igralca · reaction = ponudi se v svojem oknu (poškodba/dražba)
const CALLS = {
  drbine:      { n: "Dr. Bine s Ptuja", ico: "🩺", kind: "now",      d: "Takoj pozdravi tvojega poškodovanca (zastonj)." },
  kava:        { n: "Kava z agentom",   ico: "😌", kind: "target",   d: "Pomiri enega nezadovoljnega igralca (😤 → nazaj)." },
  popust:      { n: "Prišepnjen popust", ico: "💸", kind: "now",     d: "Naslednji podpis to potezo: −8 M$." },
  hitra:       { n: "Hitra poteza",     ico: "⚡", kind: "now",      d: "Takoj potegni dodatno karto v roko." },
  usluga:      { n: "Usluga iz lige",   ico: "🥈", kind: "now",      d: "Dobiš +1× 🥈 pick." },
  aneks:       { n: "Aneks k pogodbi",  ico: "🖋️", kind: "target",   d: "Izbranemu igralcu +1 leto pogodbe." },
  zavarovanje: { n: "Zavarovalna polica", ico: "🛡️", kind: "reaction", d: "Ob poškodbi tvojega igralca jo izničiš." },
  zadnja:      { n: "Zadnja ponudba",   ico: "📞", kind: "reaction", d: "Med dražbo razkriješ AI-jevo ponudbo, preden oddaš svojo." },
  neznana:     { n: "Neznana številka", ico: "☎️", kind: "now",      d: "Skrit učinek — razkrije se šele ob klicu." },
};
const CALL_IDS = Object.keys(CALLS);
const randCall = () => CALL_IDS[Math.floor(Math.random() * CALL_IDS.length)];
// 📋 PRAVILA LIGE — proceduralni sezonski twist (razkrit v prestopnem roku PRED gradnjo, velja za oba GM-a).
// Vsaka franšiza ima drugačno zaporedje → jedro prejšnje sezone ni več optimalno.
const LEAGUE_RULES = {
  koledar: { n: "Zgoščen koledar", ico: "📅", d: "Več poškodb to sezono (18 % namesto 12 %)." },
  zdrava:  { n: "Zdrava sezona",   ico: "💚", d: "Manj poškodb to sezono (6 % namesto 12 %)." },
  mladina: { n: "Mladinsko pravilo", ico: "🌱", d: "Mladi se razvijajo 20 % hitreje (vse proge)." },
  bogata:  { n: "Bogata liga",     ico: "💰", d: "Ob koncu sezone oba GM-a +2🧱 v sklad." },
  loterija:{ n: "Loterija talentov", ico: "🎟️", d: "Oba GM-a začneta sezono z dodatnim klicem v Rolodexu." },
  prosti:  { n: "Prosti trg",      ico: "🔓", d: "Oba GM-a začneta sezono z dodatnim 🥇 pickom." },
};
const LEAGUE_IDS = Object.keys(LEAGUE_RULES);
const infraLvl = (side, id) => (side && side.infra ? side.infra[id] || 0 : 0); // side = g.h ali g.a
// cena rehaba: Medicinski L1 → vedno 1×🥈; sicer prvi v franšizi 1×, naslednji 2×
const rehabCostFor = (g, side) => ((g[side] && g[side].infra && g[side].infra.medicinski) >= 1 ? 1 : (g.rehabUsed && g.rehabUsed[side] ? 2 : 1));
// aditivni prispevek infrastrukture k oceni rosterja (izven baseStrOf!) — Navijaška baza + Hiša legend
const infraScoreBonus = (side, roster) => {
  if (!side || !side.infra) return 0;
  let b = 0;
  const nav = side.infra.navijaci || 0;
  if (nav && roster.length >= 10) b += nav >= 3 ? 14 : nav >= 2 ? 10 : 6;
  const leg = side.infra.legende || 0;
  if (leg && roster.some((c) => c.tr === "VD")) b += leg >= 2 ? 10 : 6;
  return b;
};
// draft 2026 prospekti (pozicije/ocene so ocena) — [ime, pos, plača, OVR zdaj, vpliv, lastnost, tier, potencial min, max, starost]
const ROOKIES_RAW = [
  ["AJ Dybantsa", "SF", 8, 74, 2, "SN", "elite", 84, 95, 19, "alfa"],
  ["Darryn Peterson", "SG", 7, 74, 3, "SN", "elite", 83, 94, 19, "micro"],
  ["Cameron Boozer", "PF", 6, 73, 4, "VD", "elite", 82, 93, 19, "rodovnik"],
  ["Kingston Flemings", "PG", 5, 71, 3, "OR", "proj", 76, 91, 19, "kreator"],
  ["Nate Ament", "SF", 4, 70, 1, "SN", "proj", 74, 92, 19, "raketa"],
  ["Darius Acuff", "PG", 4, 71, 1, "OR", "proj", 75, 89, 19, "samotar"],
  ["Mikel Brown Jr.", "PG", 4, 70, 2, "OR", "proj", 74, 90, 19, "ucenec"],
  ["Chris Cenac Jr.", "C", 3, 71, 3, "BR", "proj", 75, 90, 19, "sidro"],
  ["Meleek Thomas", "SG", 3, 70, 1, "SN", "proj", 74, 89, 18, "instant"],
  ["Karim López", "SF", 3, 72, 2, "BR", "safe", 76, 84, 19, "lepilo"],
  ["Yaxel Lendeborg", "PF", 3, 76, 3, "BR", "safe", 78, 84, 23, "odrasel"],
  ["Koa Peat", "PF", 3, 72, 2, "BR", "safe", 76, 85, 19, "motor"],
];
const ROOKIES = ROOKIES_RAW.map((r, i) => ({ id: 1000 + i, n: r[0], club: "Draft 2026", pos: r[1], sal: r[2], ovr: r[3], pm: r[4], tr: r[5], age: r[9], rookie: true, tier: r[6], potLow: r[7], potHigh: r[8], hook: r[10] }));
// prave fotke prospektov (Wikimedia / ESPN college / NBA cdn — vsi resnični igralci draft 2026)
const ESPNH = (id) => `https://a.espncdn.com/i/headshots/mens-college-basketball/players/full/${id}.png`;
const ROOKIE_IMG = {
  "AJ Dybantsa": "https://upload.wikimedia.org/wikipedia/commons/d/da/AJ_Dybantsa_2024.jpg",
  "Cameron Boozer": "https://upload.wikimedia.org/wikipedia/commons/0/0d/Boozer_%E2%80%93_Clemson_%E2%80%93_February_14_2026_%28cropped%29.png",
  "Koa Peat": "https://upload.wikimedia.org/wikipedia/commons/b/bc/Koa_Peat.jpg",
  "Nate Ament": "https://upload.wikimedia.org/wikipedia/commons/f/f5/Nate_Ament.jpg",
  "Yaxel Lendeborg": "https://upload.wikimedia.org/wikipedia/commons/8/8e/20260211_Yaxel_Lendeborg_05.jpg",
  "Darryn Peterson": ESPNH(5041955),
  "Mikel Brown Jr.": ESPNH(5101761),
  "Chris Cenac Jr.": ESPNH(5142621),
  "Kingston Flemings": ESPNH(5149077),
  "Darius Acuff": ESPNH(5142620),
  "Meleek Thomas": ESPNH(5041951),
  "Karim López": "https://cdn.nba.com/headshots/nba/latest/260x190/1643510.png",
};
// naključni LETNIK: prospekti se vsako sezono generirajo na novo (OVR in potencial zanihata, letnik ima moč) — memorizacija med igrami ne pomaga
const genClass = (seed) => {
  const R = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
  const shift = [-3, 0, 0, 3][Math.floor(Math.random() * 4)]; // moč letnika: šibek / soliden / soliden / močan
  const cls = ROOKIES.map((r) => {
    const ovr = Math.max(66, Math.min(80, r.ovr + R(-2, 2)));
    const potHigh = Math.max(80, Math.min(97, r.potHigh + R(-4, 4) + shift));
    const potLow = Math.max(ovr + 2, Math.min(potHigh - 5, r.potLow + R(-4, 4) + shift));
    const tier = r.tier === "safe" ? "safe" : potHigh >= 92 && potLow >= 80 ? "elite" : "proj";
    const lo = Math.min(potLow, potHigh);
    const center = R(lo, potHigh); // pravi talent (skrit, interni razvojni žreb)
    return { ...r, ovr, potLow: lo, potHigh, tier, tl: Math.max(lo, center - 3), th: Math.min(potHigh, center + 3) };
  });
  const elites = cls.filter((c) => c.tier === "elite").length;
  return { cls, elites, strength: elites >= 3 ? "močan" : elites <= 1 ? "šibek" : "soliden" };
};
const POS = ["PG", "SG", "SF", "PF", "C"];
const POS_COLOR = { PG: "#2563EB", SG: "#0D9488", SF: "#16A34A", PF: "#E07020", C: "#7C3AED" };
const CAP = 170, APRON = 20, MB = 145, TARGET = 500, AUCTION_OVR = 92;
const CAP_GROW = 1.05; // plačni limit raste vsako sezono enako kot plače (5 %) — pritisk na obdržano jedro ostane konstanten
const capFor = (season) => Math.round(CAP * Math.pow(CAP_GROW, Math.max(0, (season || 1) - 1))); // sez.1=170, 2=179, 3=187, 4=197, 5=207…
const SIGN_LIMIT = 2; // max podpisov iz roke na potezo (velja za oba GM-a) — ustvari dilemo "podpiši zdaj ali čakaj"
const PV = { f: 3, s: 1, w: 2 }; // osnovna vrednost NEporabljenih pickov (množi se s slotom)
// slot = kje bi draftal; slabša ekipa (večji zaostanek) = boljši slot = dragocenejši pick
const baseStrOf = (p) => (p.starterPts || 0) + (p.benchPts || 0) + (p.syn ? p.syn.total : 0);
// polna AI ocena rosterja: VSE elemente obračuna (bonusi peterke, kemija, filozofija, kavlji, davek…), brez šuma roke/prvega zaključka
const aiStrOf = (roster, picks, coach, injuredId, phil, cap) => scoreRoster(roster, 0, false, null, picks, coach, injuredId, 0, phil, cap).total;
const slotTier = (gap) => gap >= 40 ? { label: "🎰 Loterija (top pick)", mult: 2.0, top: true } : gap >= 15 ? { label: "Zgodnji 1. krog", mult: 1.5, top: true } : gap > -15 ? { label: "Sredina 1. kroga", mult: 1.0, top: false } : { label: "Pozni pick", mult: 0.6, top: false };
// progresivni luksuzni davek: prvih APRON M$ nad limitom −1/M, naprej −2/M
const taxFor = (salary, cap = CAP) => { const o = salary - cap; if (o <= 0) return 0; return -(Math.min(o, APRON) + Math.max(0, o - APRON) * 2); };

// ============ POMOŽNE ============
const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const surname = (n) => n.split(" ").slice(-1)[0];
const spts = (c) => c.ovr + 2 * c.pm;
const val = (c) => spts(c) - (c.ovr >= 93 ? 0.35 : 0.55) * c.sal + (c.tr === "SM" ? 4 : 0) + (c.tr === "VD" ? 3 : 0) + (c.tr === "OR" ? 2 : 0);
const posCount = (r, p) => r.filter((c) => c.pos === p).length;
const salaryOf = (r) => r.reduce((s, c) => s + c.sal, 0);
const emptyPosAfter = (r, addPos) => POS.filter((p) => p !== addPos && !r.some((c) => c.pos === p)).length;
const coverageOk = (r, c) => emptyPosAfter(r, c.pos) <= (10 - (r.length + 1));
const canSign = (r, c) => r.length < 10 && posCount(r, c.pos) < 3 && coverageOk(r, c);
const bidVal = (b) => PV.f * b.f + PV.s * b.s + PV.w * b.w;
const pickStr = (b) => { const p = []; if (b.f) p.push(`1. krog ×${b.f}`); if (b.s) p.push(`2. krog ×${b.s}`); if (b.w) p.push("pick swap"); return p.join(" + ") || "nič"; };
const DISCOUNT = 0.75; // odpuščeni igralci: −25 % na plačo (ugodna pogodba)
const discSal = (c) => Math.max(2, Math.round(c.sal * DISCOUNT));
const asDiscount = (c) => ({ ...c, sal: discSal(c), origSal: c.sal, disc: true });
// faza kariere iz starosti — večsezonsko branje (okno vrhunca)
const careerPhase = (age) =>
  age <= 23 ? { k: "rise", label: "V VZPONU", ico: "↗", col: "#2f8f4e" }
  : age <= 29 ? { k: "prime", label: "VRHUNEC", ico: "◆", col: "#a8781a" }
  : age <= 33 ? { k: "late", label: "POZNA LETA", ico: "↘", col: "#c2661a" }
  : { k: "vet", label: "VETERAN", ico: "↓", col: "#b23b2e" };
const agingOutlook = (age) =>
  age <= 23 ? "še raste — pogosto +1 do +3 OVR na sezono (bolj, če dobi minute)"
  : age <= 29 ? "v vrhuncu — večinoma stabilno (±1 OVR)"
  : age <= 33 ? "blag upad — pogosto −1 do −3 OVR na sezono"
  : "upad −2 do −4 OVR; pri nizkem OVR grozi upokojitev";

// ============ COACHI ============
const COACHES = [
  { id: "lue", n: "Tyronn Lue", t: "Star whisperer", d: "Vsak igralec z OVR 93+ šteje 6 M$ manj v plačno maso." },
  { id: "thibs", n: "Tom Thibodeau", t: "Obramba pred vsem", d: "Vsak 🛡️ branilec v prvi peterki prinese +4." },
  { id: "kerr", n: "Steve Kerr", t: "Motion offense", d: "Spacing bonus je podvojen (+20), 🎯 snajperji na klopi štejejo 60 % OVR." },
  { id: "spo", n: "Erik Spoelstra", t: "Heat Culture", d: "Vsa klop šteje 60 % OVR namesto 50 %, Moneyball prag se dvigne na 155 M$." },
  { id: "okc", n: "Mark Daigneault", t: "Razvojni projekt", d: "Začneš z dodatnim 🥇 pickom, v dražbah vsak tvoj pick šteje +1." },
  { id: "jj", n: "J.J. Redick", t: "Razvoj mladih", d: "Vsak igralec, star 24 let ali manj, v prvi peterki prinese +4. Rookieji se razvijejo, kot da igrajo (tudi s klopi)." },
];
const coachOf = (id) => COACHES.find((c) => c.id === id);
// franšizne filozofije — izbereš eno za celo dinastijo; snowball na tvoji identiteti
const PHILOS = [
  { id: "trojke", ico: "🎯", n: "Napad trojk", d: "Vsak dodaten 🎯 strelec v peterki množi napad — +12 za vsakega nad prvim." },
  { id: "obramba", ico: "🛡️", n: "Trdnjava", d: "Vsak dodaten 🛡️ branilec v peterki gradi zid — +12 za vsakega nad prvim." },
  { id: "razvoj", ico: "🌱", n: "Razvojni klub", d: "Vsak mladi (≤24) v rosterju šteje +6 (do 6 igralcev) — gradi jedro prihodnosti." },
  { id: "zvezde", ico: "⭐", n: "Lov na zvezde", d: "Vsak štartar z OVR 90+ prinese +12 — a pazi na luksuzni davek." },
];
const philOf = (id) => PHILOS.find((p) => p.id === id);
const effSalary = (roster, coach) => roster.reduce((s, c) => s + c.sal - (coach === "lue" && c.ovr >= 93 ? 6 : 0), 0);
const benchPtsOf = (c, coach) => Math.floor(c.ovr * (coach === "spo" ? 0.6 : coach === "kerr" && c.tr === "SN" ? 0.6 : 0.5));
const mbFor = (coach, cap = CAP) => Math.round(cap * 0.85) + (coach === "spo" ? 10 : 0); // Moneyball prag sledi capu (85 %); Spoelstra +10
const bidValC = (b, coach) => bidVal(b) + (coach === "okc" ? b.f + b.s + b.w : 0);

function lineupBonuses(cards, coach) {
  const t = (x) => cards.filter((c) => c.tr === x).length;
  return {
    spacing: t("SN") >= 2 ? (coach === "kerr" ? 20 : 10) : 0,
    wall: t("BR") >= 2 ? 10 : 0,
    dirigent: t("OR") >= 1 ? 8 : 0,
    coachPts: coach === "thibs" ? 4 * t("BR") : coach === "jj" ? 4 * cards.filter((c) => c.age <= 24).length : 0,
  };
}

// ============ ODKLEPANJA / SINERGIJE (pripisano imenoma) ============
// poraba žoge (kdo potrebuje žogo): organizatorji in elitni skorerji so ball-dominantni
const usage = (c) => c.tr === "OR" ? 4 : (c.ovr >= 92 && c.tr !== "BR" && c.tr !== "SM") ? 4 : c.tr === "SN" ? 1 : c.tr === "BR" ? 1 : 2;
const isShooter = (c) => c.tr === "SN";
const isPlaymaker = (c) => c.tr === "OR";
const isDefender = (c) => c.tr === "BR";
const isOffStar = (c) => c.ovr >= 90 && c.tr !== "BR" && c.tr !== "SM";
const isBallDom = (c) => usage(c) >= 4;
const FEED = 8, COVER = 10, JAM = 8;

// tri glasna, pripisana odklepanja za DANO peterko
function synergy(sCards) {
  const shooters = sCards.filter(isShooter);
  const playmakers = sCards.filter(isPlaymaker);
  const defenders = sCards.filter(isDefender);
  const stars = sCards.filter(isOffStar);
  const ballDom = sCards.filter(isBallDom);
  const items = [];
  let feederPts = 0, coverPts = 0, jamPts = 0;
  if (playmakers.length && shooters.length) {
    feederPts = shooters.length * FEED;
    items.push({ k: "feeder", ico: "🅿️", who: `${surname(playmakers[0].n)} → ${shooters.map((c) => surname(c.n)).join(", ")}`, txt: `Hranilec: ${surname(playmakers[0].n)} postavlja strelce ${shooters.map((c) => surname(c.n)).join(", ")} v priložnost (+${FEED} vsak).`, pts: feederPts });
  }
  if (defenders.length && stars.length) {
    const n = Math.min(defenders.length, stars.length, 2);
    coverPts = n * COVER;
    const cov = stars.slice(0, n).map((c) => surname(c.n)).join(", ");
    items.push({ k: "cover", ico: "🛡️", who: `${surname(defenders[0].n)} → ${cov}`, txt: `Kritje zvezdnika: ${surname(defenders[0].n)} pokriva obrambne slabosti zvezdnikov ${cov} (+${COVER} vsak).`, pts: coverPts });
  }
  if (ballDom.length >= 3) {
    jamPts = -(ballDom.length - 2) * JAM;
    items.push({ k: "jam", ico: "🧨", who: ballDom.map((c) => surname(c.n)).join(", "), txt: `Zastoji: preveč igralcev potrebuje žogo (${ballDom.map((c) => surname(c.n)).join(", ")}) — napad se zaustavlja (${jamPts}).`, pts: jamPts });
  }
  return { items, total: feederPts + coverPts + jamPts, feederPts, coverPts, jamPts };
}

// živi predogled: kaj bi ta karta naredila TVOJI trenutni peterki
function previewUnlocks(card, sCards) {
  const shooters = sCards.filter(isShooter);
  const playmakers = sCards.filter(isPlaymaker);
  const defenders = sCards.filter(isDefender);
  const stars = sCards.filter(isOffStar);
  const ballDom = sCards.filter(isBallDom);
  const out = [];
  if (isPlaymaker(card) && !playmakers.length && shooters.length) out.push({ good: true, txt: `aktivira strelce ${shooters.map((c) => surname(c.n)).join(", ")} (+${FEED} vsak)` });
  if (isShooter(card) && playmakers.length) out.push({ good: true, txt: `${surname(playmakers[0].n)} ga bo hranil (+${FEED})` });
  if (isDefender(card) && stars.length) out.push({ good: true, txt: `pokrije zvezdnika ${surname(stars[0].n)} (+${COVER})` });
  if (isOffStar(card) && !defenders.length) out.push({ good: false, txt: `zvezdnik brez obrambnega kritja — dodaj 🛡️ branilca` });
  if (isBallDom(card) && ballDom.length >= 2) out.push({ good: false, txt: `zastoj z ${ballDom.map((c) => surname(c.n)).join(", ")} (−${JAM})` });
  return out;
}

// med sezono: če odstraniš vzrok nezadovoljstva (prodaš/trejdaš drugega ball-dominantnega, daš zvezdnika v peterko), se moralna kazen odpravi
function reEvalMorale(roster, starters) {
  const ballDom = roster.filter(isBallDom).length;
  const starterIds = new Set(POS.map((p) => starters[p]).filter((id) => id != null));
  const freed = [];
  const out = roster.map((c) => {
    if (!c.unhappy) return c;
    let resolved = false;
    if (c.unhappyCause === "jam") resolved = !(ballDom >= 3 && isBallDom(c));            // ni več gneče ob žogi
    else if (c.unhappyCause === "bench") resolved = !(c.ovr >= 85 && !starterIds.has(c.id)); // dobil je minute
    if (!resolved) return c; // poraz sezone / rookie-sulk / neoznačeno → šele naslednji prestopni rok
    const bp = c.basePm != null ? c.basePm : c.pm;
    const { unhappy, basePm, unhappyCause, ...rest } = c;
    freed.push(surname(c.n));
    return { ...rest, pm: bp };
  });
  return { roster: out, freed };
}

function bestStarters(roster, coach, injuredId) {
  const healthy = roster.filter((c) => c.id !== injuredId);
  const cands = POS.map((p) => { const l = healthy.filter((c) => c.pos === p); return l.length ? l : [null]; });
  let best = null, bestPts = -Infinity;
  const rec = (i, cur) => {
    if (i === POS.length) {
      const cards = cur.filter(Boolean);
      const b = lineupBonuses(cards, coach);
      const pts = cards.reduce((s, c) => s + spts(c), 0) + b.spacing + b.wall + b.dirigent + b.coachPts + synergy(cards).total;
      if (pts > bestPts) { bestPts = pts; best = [...cur]; }
      return;
    }
    for (const c of cands[i]) rec(i + 1, [...cur, c]);
  };
  rec(0, []);
  const map = {};
  POS.forEach((p, i) => { if (best[i]) map[p] = best[i].id; });
  return map;
}

function scoreRoster(roster, handCount, isFirst, starterMap, picks, coach, injuredId, deadCap = 0, phil = null, cap = CAP, infraBonus = 0) {
  const map = starterMap || bestStarters(roster, coach, injuredId);
  const starters = {};
  POS.forEach((p) => { const c = roster.find((x) => x.id === map[p]); if (c && c.id !== injuredId) starters[p] = c; });
  const sCards = Object.values(starters);
  const sIds = new Set(sCards.map((c) => c.id));
  const starterPts = sCards.reduce((s, c) => s + spts(c), 0);
  const lb = lineupBonuses(sCards, coach);
  const syn = synergy(sCards);
  const bench = roster.filter((c) => !sIds.has(c.id));
  const benchPts = bench.reduce((s, c) => s + benchPtsOf(c, coach), 0);
  const sixth = bench.filter((c) => c.tr === "SM").sort((a, b) => b.ovr - a.ovr)[0] || null;
  const sixthPts = sixth ? sixth.ovr - benchPtsOf(sixth, coach) + sixth.pm : 0;
  const salary = salaryOf(roster);
  const eff = effSalary(roster, coach);
  const payroll = eff + (deadCap || 0);
  const mbThr = mbFor(coach, cap);
  const clubs = {};
  roster.forEach((c) => (clubs[c.club] = (clubs[c.club] || 0) + 1));
  const duoClubs = Object.keys(clubs).filter((k) => clubs[k] >= 2 && k !== "Vet. minimum" && k !== "Draft 2026");
  const duoPts = Math.min(duoClubs.length, 3) * 10;
  const big3 = roster.filter((c) => c.ovr >= 90).length >= 3 ? 20 : 0;
  const superteam = sCards.filter((c) => c.ovr >= 93).length >= 3 ? 35 : 0;
  const moneyball = roster.length === 10 && payroll < mbThr ? 25 : 0;
  const doncic = sCards.some((c) => c.n.includes("Dončić")) ? 5 : 0;
  const leader = roster.some((c) => c.tr === "VD") ? 8 : 0;
  const tax = taxFor(payroll, cap);
  const missR = 10 - roster.length;
  const missPos = POS.filter((p) => !starters[p]).length;
  const pickPts = picks ? PV.f * picks.f + PV.s * picks.s : 0;
  const stackPos = POS.filter((p) => posCount(roster, p) >= 3);
  const stackPen = stackPos.length * -15;
  let philPts = 0, philLabel = null;
  if (phil === "trojke") { const n = sCards.filter(isShooter).length; if (n >= 2) { philPts = 12 * (n - 1); philLabel = `🎯 Napad trojk (${n} strelcev)`; } }
  else if (phil === "obramba") { const n = sCards.filter(isDefender).length; if (n >= 2) { philPts = 12 * (n - 1); philLabel = `🛡️ Trdnjava (${n} branilcev)`; } }
  else if (phil === "razvoj") { const n = Math.min(6, roster.filter((c) => c.age <= 24).length); if (n) { philPts = 6 * n; philLabel = `🌱 Razvojni klub (${n} mladih)`; } }
  else if (phil === "zvezde") { const n = sCards.filter((c) => c.ovr >= 90).length; if (n) { philPts = 12 * n; philLabel = `⭐ Lov na zvezde (${n})`; } }
  // ⭑ build-around kavlji prospektov (velja tudi za razvite — kavelj ostane celo kariero)
  let hookPts = 0; const hookList = [];
  roster.forEach((c) => {
    if (!c.hook || !HOOKS[c.hook] || c.id === injuredId) return;
    const st = sIds.has(c.id);
    let p = 0;
    if (c.hook === "alfa" && st && !roster.some((o) => o.id !== c.id && o.ovr >= 90)) p = 10;
    else if (c.hook === "micro" && !st) p = Math.floor(c.ovr * 0.6) - Math.floor(c.ovr * 0.5);
    else if (c.hook === "rodovnik" && roster.some((o) => o.id !== c.id && o.tr === "VD")) p = 6;
    else if (c.hook === "kreator" && st && sCards.some((o) => o.id !== c.id && o.tr === "SN")) p = 6;
    else if (c.hook === "samotar" && st && !sCards.some((o) => o.id !== c.id && isBallDom(o))) p = 4;
    else if (c.hook === "sidro" && st && phil === "obramba") p = 12;
    else if (c.hook === "instant" && !st && sCards.some((o) => o.tr === "OR")) p = 6;
    else if (c.hook === "lepilo" && st && missPos === 0) p = 4;
    else if (c.hook === "odrasel" && !st) p = 3;
    else if (c.hook === "motor" && st && sCards.filter((o) => o.tr === "BR").length >= 2) p = 4;
    if (p) { hookPts += p; hookList.push(`⭑ ${HOOKS[c.hook].n} — ${surname(c.n)} +${p}`); }
  });
  const total = starterPts + lb.spacing + lb.wall + lb.dirigent + lb.coachPts + syn.total + benchPts + sixthPts + duoPts + big3 + superteam + moneyball + doncic + leader + pickPts + tax + stackPen + missR * -20 + missPos * -10 + handCount * -5 + (isFirst ? 20 : 0) + philPts + hookPts + infraBonus;
  return { starters, bench, starterPts, ...lb, syn, benchPts, sixth, sixthPts, duoPts, duoClubs, big3, superteam, moneyball, doncic, leader, pickPts, picks, tax, stackPen, stackPos, salary, eff, payroll, deadCap: deadCap || 0, mbThr, coach, phil, philPts, philLabel, hookPts, hookList, missR, missPos, handCount, isFirst, cap, infraBonus, total };
}

function freshRound(round, totals) {
  const deck = shuffle(priceDeck(PLAYERS));
  const h = { hand: deck.splice(0, 8), roster: [], summer: [], starters: {}, picks: { f: 2, s: 3, w: 1 }, tradeUsed: false, coach: null, deadCap: 0, signedTurn: 0, sklad: 0, infra: {}, calls: [] };
  const a = { hand: deck.splice(0, 8), roster: [], summer: [], picks: { f: 2, s: 3, w: 1 }, coach: null, sklad: 0, infra: {}, calls: [] };
  const aDisc = [deck.pop()]; // trg prostih igralcev (ti kupuješ s popustom)
  return { round, totals, deck, hDisc: [], aDisc, h, a, injured: { h: null, a: null }, rehabUsed: { h: false, a: false }, turn: "h", phase: "draw", finisher: null, finalFor: null, reshuffled: false, log: [`Runda ${round}: karte razdeljene. Najprej izberi coacha.`], result: null, aiTurns: 0, banner: null, champion: null, auction: null };
}

const contractFor = (c) => c.rookie ? 3 : c.age >= 30 ? 1 : 2; // rookie 3, veteran 1, ostali 2
const marketSal = (ovr) => Math.max(3, Math.min(58, Math.round((ovr - 70) * 2.1))); // tržna plača glede na OVR
// 🔖 proceduralne pogodbe: vsaka runda/sezona ima SVOJE kradljivce — deck se ne da naučiti na pamet
const DEALS_N = 12;
const priceDeck = (cards) => {
  const dealIdx = new Set(shuffle(cards.map((_, i) => i)).slice(0, DEALS_N));
  return cards.map((c, i) => {
    const mkt = marketSal(c.ovr);
    const sal = dealIdx.has(i)
      ? Math.max(2, Math.round(mkt * (0.55 + Math.random() * 0.15))) // 🔖 ugodna pogodba: 55–70 % tržne
      : Math.max(2, Math.round(c.sal + (mkt - c.sal) * Math.random() * 0.6)); // ostali: naključno zapri do 60 % razlike do tržne
    return { ...c, sal, deal: dealIdx.has(i) };
  });
};
// Bird rights: SVOJEGA igralca podaljšaš ceneje kot na trgu (−15 % zvestoba) — a zvezdnik 90+ pri 30+ letih zahteva polno tržno ceno
const resignSal = (c) => Math.max(3, Math.round(marketSal(c.ovr) * (c.ovr >= 90 && (c.age ?? 26) >= 30 ? 1.0 : 0.85)));
const ESCALATE = 1.05; // letni dvig plač obstoječim pogodbam (blago — cap raste hitreje)
const ROOKIE_SCALE = 0.5; // novinec še na rookie pogodbi: plača sledi razvoju do ~pol tržne vrednosti (nagrada za draft, a ne zastonj superzvezdnik)

// franšizna sezona: season 1 = iz nič; season 2+ = ohrani roster (keepH/keepA)
function freshSeason(season, opts) {
  const { titles, keepH, keepA, keepSummerH, keepSummerA, seasons, cum, bonusPicks, skladH, skladA, infraH, infraA, infraOffer, callsH, callsA, ownerBase, leagueRule } = opts;
  const keptIds = new Set([...(keepH || []), ...(keepA || []), ...(keepSummerH || []), ...(keepSummerA || [])].map((c) => c.id));
  const deck = shuffle(priceDeck(PLAYERS.filter((p) => !keptIds.has(p.id))));
  const lrPick = leagueRule === "prosti" ? 1 : 0; // 🔓 Prosti trg: +1🥇
  const lrCall = leagueRule === "loterija" ? [randCall()] : []; // 🎟️ Loterija talentov: +1 klic
  const h = { hand: deck.splice(0, 8), roster: [...(keepH || [])], summer: [...(keepSummerH || [])], starters: {}, picks: { f: 2 + lrPick + (bonusPicks ? bonusPicks.f : 0), s: Math.max(0, 3 + (bonusPicks ? bonusPicks.s : 0)), w: 1 }, tradeUsed: false, coach: null, deadCap: 0, signedTurn: 0, sklad: skladH || 0, infra: infraH || {}, calls: [...(callsH || []), randCall(), ...lrCall].slice(0, 3) };
  const a = { hand: deck.splice(0, 8), roster: [...(keepA || [])], summer: [...(keepSummerA || [])], picks: { f: 2 + lrPick, s: 3, w: 1 }, coach: null, sklad: skladA || 0, infra: infraA || {}, calls: [...(callsA || []), randCall(), ...(leagueRule === "loterija" ? [randCall()] : [])].slice(0, 3) };
  const aDisc = [deck.pop()];
  const yr = genClass(season);
  const takenNames = new Set([...(keepH || []), ...(keepA || [])].map((c) => c.n));
  const clsAvail = yr.cls.filter((r) => !takenNames.has(r.n));
  return { franchise: true, season, seasons: seasons || 3, infraOffer: infraOffer || null, ownerBase: ownerBase || null, leagueRule: leagueRule || null, cum: cum || { h: 0, a: 0 }, titles: titles || { h: 0, a: 0 }, seasonLog: opts.seasonLog || [], philosophy: opts.philosophy || { h: null, a: null }, round: season, totals: { h: 0, a: 0 }, deck, hDisc: [], aDisc, rookieClass: clsAvail, classInfo: { strength: yr.strength, elites: yr.elites }, h, a, injured: { h: null, a: null }, rehabUsed: { h: false, a: false }, turn: "h", phase: "draw", finisher: null, finalFor: null, reshuffled: false, log: [`SEZONA ${season}: ${keepH && keepH.length ? `obdržal si ${keepH.length} igralcev.` : "prazna ekipa."}${keepSummerH && keepSummerH.length ? ` ${keepSummerH.length} v poletni ligi.` : ""} ${opts.philosophy && opts.philosophy.h ? "" : "Izberi filozofijo in coacha."}`], result: null, aiTurns: 0, banner: null, champion: null, auction: null };
}

// ============ MEDSEZONSKA DRAMA (FTL-slog dogodki) ============
// Dogodek = podatki: req (pogoj), text, choices → resolve vrne { fx: [učinki], txt }.
// Učinki gredo skozi EN tolmač (applyEventFx): pm / ovr / trait / calm / remove / pick / injury / contract / freeAgent.
const EVENTS = [
  // ===== EGO / GARDEROBA =====
  { id: "podcast", weight: 3, req: (c) => c.unhappyStar,
    text: (c) => `📱 ${c.unhappyStar.n} je v podcastu namignil, da se vidi »v drugem sistemu«. Garderoba šepeta.`,
    choices: [
      { label: "Zasebno kosilo, iskren pogovor", resolve: (c) => ({ fx: [{ t: "pm", who: c.unhappyStar, d: 1 }], txt: `Pogovor pomaga. ${surname(c.unhappyStar.n)} vpliv +1.` }) },
      { label: "Javno: »Ni na prodaj!«", resolve: (c) => Math.random() < 0.5 ? { fx: [{ t: "calm", who: c.unhappyStar }], txt: `Gesta ga gane — spet je zadovoljen!` } : { fx: [{ t: "pm", who: c.unhappyStar, d: -2 }], txt: `Misli, da blefiraš. Vpliv −2.` } },
      { label: "Zamenjaj ga, dokler je vroč", resolve: (c) => ({ fx: [{ t: "remove", who: c.unhappyStar }, { t: "pick", f: 2 }], txt: `${surname(c.unhappyStar.n)} odide. +2×🥇 v novi sezoni.` }) },
    ] },
  { id: "rivalstvo", weight: 2, req: (c) => c.two && c.star,
    text: (c) => `🥊 ${c.star.n} in ${(c.any2 && c.any2.id !== c.star.id ? c.any2 : c.any).n} sta se sprla na treningu. Ekipa izbira strani.`,
    choices: [
      { label: "Skupna večerja, zakoplji sekiro", resolve: (c) => ({ fx: [{ t: "pm", who: c.star, d: 1 }], txt: `Pomirjeno. ${surname(c.star.n)} vpliv +1.` }) },
      { label: "Postavi jasno hierarhijo (alfa je alfa)", resolve: (c) => Math.random() < 0.5 ? { fx: [{ t: "pm", who: c.star, d: 2 }], txt: `${surname(c.star.n)} zacveti v vlogi vodje. Vpliv +2.` } : { fx: [{ t: "pm", who: c.star, d: -1 }, { t: "pm", who: c.any, d: -1 }], txt: `Oba užaljena. Oba vpliv −1.` } },
      { label: "Pusti ju, naj se ohladita", resolve: (c) => Math.random() < 0.6 ? { fx: [], txt: `Minilo je samo od sebe.` } : { fx: [{ t: "pm", who: c.star, d: -1 }], txt: `Napetost ostaja. ${surname(c.star.n)} vpliv −1.` } },
    ] },
  { id: "kapetan", weight: 2, req: (c) => c.roster.length >= 5,
    text: () => `🅲 Garderoba nima jasnega vodje. Kdo dobi kapetanski trak?`,
    choices: [
      { label: "Najstarejši veteran", req: (c) => c.vet, resolve: (c) => ({ fx: [{ t: "trait", who: c.vet, to: "VD" }, { t: "pm", who: c.vet, d: 1 }], txt: `${surname(c.vet.n)} postane 🧭 vodja (+vpliv 1).` }) },
      { label: "Najboljši igralec", req: (c) => c.big, resolve: (c) => Math.random() < 0.6 ? { fx: [{ t: "pm", who: c.big, d: 1 }], txt: `${surname(c.big.n)} sprejme odgovornost. Vpliv +1.` } : { fx: [{ t: "pm", who: c.big, d: -1 }], txt: `Breme ga bremeni. Vpliv −1.` } },
      { label: "Nihče — vodite skupinsko", resolve: (c) => Math.random() < 0.5 ? { fx: [{ t: "pm", who: c.any, d: 1 }], txt: `Enakost dvigne moralo. ${surname(c.any.n)} vpliv +1.` } : { fx: [], txt: `Brez vodje, a tudi brez drame.` } },
    ] },
  { id: "instagram", weight: 2, req: (c) => c.young || c.rook,
    text: (c) => { const t = c.young || c.rook; return `📸 ${t.n} živi bolj na Instagramu kot v telovadnici. Sledilci rastejo, met pada.`; },
    choices: [
      { label: "Prepovej telefon v garderobi", resolve: (c) => { const t = c.young || c.rook; return Math.random() < 0.6 ? { fx: [{ t: "ovr", who: t, d: 1 }], txt: `Fokus se vrne. ${surname(t.n)} OVR +1.` } : { fx: [{ t: "pm", who: t, d: -1 }], txt: `Uporništvo. Vpliv −1.` }; } },
      { label: "Izkoristi slavo za sponzorje", resolve: () => ({ fx: [{ t: "pick", s: 1 }], txt: `Klub zasluži na njegovi znamki. +1×🥈.` }) },
      { label: "Pusti mladost mladosti", resolve: (c) => { const t = c.young || c.rook; return { fx: [{ t: "pm", who: t, d: 1 }], txt: `Ceni zaupanje. ${surname(t.n)} vpliv +1.` }; } },
    ] },
  { id: "tehnicna", weight: 2, req: (c) => c.star,
    text: (c) => `🤬 ${c.star.n} je v zadnji tekmi dobil dve tehnični in ligaška kazen visi.`,
    choices: [
      { label: "Plačaj kazen, brani ga", resolve: (c) => ({ fx: [{ t: "pm", who: c.star, d: 1 }], txt: `Čuti podporo. ${surname(c.star.n)} vpliv +1.` }) },
      { label: "Interna kazen — zgled za mlade", resolve: (c) => Math.random() < 0.5 ? { fx: [{ t: "pm", who: c.star, d: -1 }, { t: "pm", who: (c.young || c.any), d: 1 }], txt: `${surname(c.star.n)} vpliv −1, mladi cenijo disciplino.` } : { fx: [{ t: "pm", who: c.star, d: -2 }], txt: `Zvezdnik zameri. Vpliv −2.` } },
      { label: "Pošlji ga k psihologu za obvladovanje jeze", resolve: (c) => ({ fx: [{ t: "pm", who: c.star, d: 2 }], txt: `Dela na sebi. ${surname(c.star.n)} vpliv +2.` }) },
    ] },

  // ===== ROOKIEJI / MLADI =====
  { id: "preboj", weight: 3, req: (c) => c.rook,
    text: (c) => `☀️ ${c.rook.n} je v poletni ligi fantastičen. Agent sprašuje o »pospešenem razvoju«.`,
    choices: [
      { label: "Standardni program", resolve: (c) => ({ fx: [{ t: "ovr", who: c.rook, d: 1 }], txt: `Solidno. ${surname(c.rook.n)} OVR +1.` }) },
      { label: "Elitni zasebni trener", resolve: (c) => Math.random() < 0.7 ? { fx: [{ t: "ovr", who: c.rook, d: 3 }], txt: `Preskok! ${surname(c.rook.n)} OVR +3.` } : { fx: [{ t: "pm", who: c.rook, d: -1 }], txt: `Pregorel. Vpliv −1.` } },
      { label: "Pošlji ga v tujino nabirat izkušnje", resolve: (c) => Math.random() < 0.5 ? { fx: [{ t: "ovr", who: c.rook, d: 2 }, { t: "trait", who: c.rook, to: "OR" }], txt: `Vrne se kot 🧠 organizator (+OVR 2)!` } : { fx: [{ t: "ovr", who: c.rook, d: 1 }], txt: `Kaljenje. OVR +1.` } },
    ] },
  { id: "zid", weight: 2, req: (c) => c.rook,
    text: (c) => `🧱 ${c.rook.n} je zadel »rookie zid« — telo ne dohaja glave.`,
    choices: [
      { label: "Daj mu počitka", resolve: (c) => ({ fx: [{ t: "pm", who: c.rook, d: 1 }], txt: `Spočit se vrne. ${surname(c.rook.n)} vpliv +1.` }) },
      { label: "Porini ga čez zid", resolve: (c) => Math.random() < 0.5 ? { fx: [{ t: "ovr", who: c.rook, d: 2 }], txt: `Prebil se je! OVR +2.` } : { fx: [{ t: "injury", who: c.rook }], txt: `Telo popusti — ${surname(c.rook.n)} začne sezono poškodovan.` } },
      { label: "Individualni kondicijski načrt", resolve: (c) => ({ fx: [{ t: "ovr", who: c.rook, d: 1 }, { t: "pm", who: c.rook, d: 1 }], txt: `${surname(c.rook.n)} OVR +1, vpliv +1.` }) },
    ] },
  { id: "sofomor", weight: 2, req: (c) => c.young,
    text: (c) => `📉 ${c.young.n} je zapadel v »drugoletni sindrom« — nasprotniki so ga razvozlali.`,
    choices: [
      { label: "Nova vloga: čisti strelec", resolve: (c) => ({ fx: [{ t: "trait", who: c.young, to: "SN" }], txt: `${surname(c.young.n)} postane 🎯 strelec.` }) },
      { label: "Video-seje in trdo delo", resolve: (c) => Math.random() < 0.6 ? { fx: [{ t: "ovr", who: c.young, d: 2 }], txt: `Odgovoril je. OVR +2.` } : { fx: [{ t: "ovr", who: c.young, d: -1 }], txt: `Ne najde poti. OVR −1.` } },
      { label: "Zmanjšaj pritisk, vzemi ga iz peterke", resolve: (c) => ({ fx: [{ t: "pm", who: c.young, d: 2 }], txt: `Sprosti se. ${surname(c.young.n)} vpliv +2.` }) },
    ] },
  { id: "ljubljenec", weight: 2, req: (c) => c.rook,
    text: (c) => `❤️ ${c.rook.n} je postal ljubljenec mesta. Pritisk pričakovanj raste.`,
    choices: [
      { label: "Ščiti ga pred mediji", resolve: (c) => ({ fx: [{ t: "pm", who: c.rook, d: 1 }], txt: `Hvaležen za zaslon. ${surname(c.rook.n)} vpliv +1.` }) },
      { label: "Postavi ga v ospredje kampanje", resolve: (c) => Math.random() < 0.5 ? { fx: [{ t: "pick", s: 1 }, { t: "pm", who: c.rook, d: 1 }], txt: `Uspeh! +1×🥈, ${surname(c.rook.n)} vpliv +1.` } : { fx: [{ t: "pm", who: c.rook, d: -1 }], txt: `Preveč, prehitro. Vpliv −1.` } },
      { label: "Nauči ga skromnosti od veterana", req: (c) => c.vet, resolve: (c) => ({ fx: [{ t: "ovr", who: c.rook, d: 1 }, { t: "pm", who: c.vet, d: 1 }], txt: `${surname(c.rook.n)} OVR +1, ${surname(c.vet.n)} vpliv +1.` }) },
    ] },

  // ===== COACH SPECIFIČNI =====
  { id: "thibs", weight: 2, req: (c) => c.coach === "thibs" && c.star,
    text: (c) => `⏱️ Thibodeau ${c.star.n} tudi poleti ne pusti dihati — »minute gradijo može«.`,
    choices: [
      { label: "Zaupaj procesu", resolve: (c) => Math.random() < 0.6 ? { fx: [{ t: "pm", who: c.star, d: 2 }], txt: `Jekleno pripravljen. Vpliv +2.` } : { fx: [{ t: "injury", who: c.star }], txt: `Preveč. ${surname(c.star.n)} začne sezono poškodovan.` } },
      { label: "Omeji mu minute", resolve: () => ({ fx: [], txt: `Thibs godrnja, a uboga. Brez posledic.` }) },
      { label: "Kompromis: nadzorovan program", resolve: (c) => ({ fx: [{ t: "ovr", who: c.star, d: 1 }], txt: `${surname(c.star.n)} OVR +1, brez tveganja.` }) },
    ] },
  { id: "jjkamp", weight: 2, req: (c) => c.coach === "jj" && (c.young || c.rook),
    text: (c) => { const t = c.young || c.rook; return `🎬 Redick pripravi filmski kamp. ${t.n} gleda posnetke do 2h zjutraj.`; },
    choices: [
      { label: "Pusti ga garati", resolve: (c) => { const t = c.young || c.rook; return { fx: [{ t: "ovr", who: t, d: 2 }], txt: `${surname(t.n)} OVR +2. JJ ponosen.` }; } },
      { label: "Povabi veterana za mentorja", req: (c) => c.vet, resolve: (c) => { const t = c.young || c.rook; return { fx: [{ t: "ovr", who: t, d: 1 }, { t: "pm", who: c.vet, d: 1 }], txt: `${surname(t.n)} OVR +1, ${surname(c.vet.n)} vpliv +1.` }; } },
      { label: "Cel kamp za vse mlade", resolve: (c) => { const t = c.young || c.rook; return { fx: [{ t: "pm", who: t, d: 2 }], txt: `Ekipni duh. ${surname(t.n)} vpliv +2.` }; } },
    ] },
  { id: "kerreksp", weight: 2, req: (c) => c.coach === "kerr" && c.shooter,
    text: (c) => `🧪 Kerr eksperimentira: ${c.shooter.n} kot »point-forward« brez klasične peterke.`,
    choices: [
      { label: "Zaupaj mojstru", resolve: (c) => Math.random() < 0.6 ? { fx: [{ t: "trait", who: c.shooter, to: "OR" }, { t: "ovr", who: c.shooter, d: 1 }], txt: `Deluje! ${surname(c.shooter.n)} postane 🧠 organizator (+OVR 1).` } : { fx: [{ t: "pm", who: c.shooter, d: -1 }], txt: `Zmeden v novi vlogi. Vpliv −1.` } },
      { label: "Ostani pri klasiki", resolve: (c) => ({ fx: [{ t: "ovr", who: c.shooter, d: 1 }], txt: `V znani vlogi cveti. OVR +1.` }) },
      { label: "Testiraj obe varianti", resolve: (c) => ({ fx: [{ t: "pm", who: c.shooter, d: 1 }], txt: `Vsestranskost raste. Vpliv +1.` }) },
    ] },
  { id: "spoculture", weight: 2, req: (c) => c.coach === "spo",
    text: () => `🔥 »Heat Culture«: Spoelstra hoče brutalen kondicijski test za vse.`,
    choices: [
      { label: "Cela ekipa gre skozi ogenj", resolve: (c) => Math.random() < 0.5 ? { fx: [{ t: "ovr", who: c.any, d: 1 }, { t: "pm", who: c.any2, d: 1 }], txt: `Ekipa okrepljena. ${surname(c.any.n)} OVR +1.` } : { fx: [{ t: "injury", who: c.any }], txt: `Preveč za enega — ${surname(c.any.n)} poškodovan na startu.` } },
      { label: "Le za tiste, ki potrebujejo", req: (c) => c.nonStar, resolve: (c) => ({ fx: [{ t: "ovr", who: c.nonStar, d: 2 }], txt: `${surname(c.nonStar.n)} OVR +2.` }) },
      { label: "Zavrni — preveč tvegano", resolve: () => ({ fx: [], txt: `Spo ni navdušen, a ekipa je zdrava.` }) },
    ] },
  { id: "luestar", weight: 2, req: (c) => c.coach === "lue" && c.big && c.big.ovr >= 90,
    text: (c) => `🌟 Lue hoče graditi napad okoli ${c.big.n}. Ostali zvezdniki niso navdušeni.`,
    choices: [
      { label: "Sledi Lueju — heliocentrizem", resolve: (c) => Math.random() < 0.6 ? { fx: [{ t: "ovr", who: c.big, d: 2 }], txt: `${surname(c.big.n)} eksplodira. OVR +2.` } : { fx: [{ t: "pm", who: c.any, d: -1 }], txt: `Drugi zapostavljeni. ${surname(c.any.n)} vpliv −1.` } },
      { label: "Uravnotežena delitev žoge", resolve: (c) => ({ fx: [{ t: "pm", who: c.any, d: 1 }], txt: `Vsi vključeni. ${surname(c.any.n)} vpliv +1.` }) },
      { label: "Vprašaj igralce, kaj hočejo", resolve: (c) => ({ fx: [{ t: "pm", who: c.big, d: 1 }], txt: `Demokracija. ${surname(c.big.n)} vpliv +1.` }) },
    ] },
  { id: "coachkonflikt", weight: 2, req: (c) => c.star,
    text: (c) => `⚡ ${c.star.n} in coach se javno nista strinjala o taktiki.`,
    choices: [
      { label: "Stopi na stran coacha", resolve: (c) => Math.random() < 0.5 ? { fx: [{ t: "pm", who: c.star, d: -1 }], txt: `${surname(c.star.n)} zameri. Vpliv −1.` } : { fx: [{ t: "ovr", who: c.star, d: 1 }], txt: `Sprejme lekcijo, raste. OVR +1.` } },
      { label: "Stopi na stran zvezdnika", resolve: (c) => ({ fx: [{ t: "pm", who: c.star, d: 2 }], txt: `${surname(c.star.n)} počaščen. Vpliv +2.` }) },
      { label: "Zapri ju v sobo, dokler se ne zmenita", resolve: (c) => ({ fx: [{ t: "pm", who: c.star, d: 1 }], txt: `Dosežen kompromis. Vpliv +1.` }) },
    ] },

  // ===== VETERANI =====
  { id: "upokoj", weight: 2, req: (c) => c.vet,
    text: (c) => `🎙️ ${c.vet.n} (${c.vet.age} let): »Mogoče je to moja zadnja sezona…«`,
    choices: [
      { label: "Napovej poslovilno turnejo", resolve: (c) => ({ fx: [{ t: "pm", who: c.vet, d: 2 }], txt: `Liga se poklanja. ${surname(c.vet.n)} vpliv +2.` }) },
      { label: "Prepričaj ga: »Še eno leto!«", resolve: (c) => Math.random() < 0.5 ? { fx: [{ t: "contract", who: c.vet, d: 1 }, { t: "pm", who: c.vet, d: 1 }], txt: `Ostaja! Pogodba +1 leto, vpliv +1.` } : { fx: [{ t: "ovr", who: c.vet, d: -2 }], txt: `Motivacije ni. OVR −2.` } },
      { label: "Ponudi mu vlogo igralca-trenerja", resolve: (c) => ({ fx: [{ t: "trait", who: c.vet, to: "VD" }, { t: "pm", who: c.vet, d: 1 }], txt: `${surname(c.vet.n)} postane 🧭 vodja (+vpliv 1).` }) },
    ] },
  { id: "operacija", weight: 2, req: (c) => c.vet,
    text: (c) => `🏥 ${c.vet.n} ima kronično koleno. Zdravniki predlagajo tvegano operacijo.`,
    choices: [
      { label: "Naj gre pod nož", resolve: (c) => Math.random() < 0.5 ? { fx: [{ t: "ovr", who: c.vet, d: 2 }], txt: `Pomlajen! ${surname(c.vet.n)} OVR +2.` } : { fx: [{ t: "injury", who: c.vet }], txt: `Zaplet — začne sezono poškodovan.` } },
      { label: "Konzervativno zdravljenje", resolve: (c) => ({ fx: [{ t: "pm", who: c.vet, d: -1 }], txt: `Igra skozi bolečino. Vpliv −1, a na parketu.` }) },
      { label: "Počitek celo predsezono", resolve: (c) => ({ fx: [{ t: "ovr", who: c.vet, d: 1 }], txt: `Spočit. ${surname(c.vet.n)} OVR +1.` }) },
    ] },
  { id: "legenda", weight: 1, req: (c) => c.vet && c.vet.ovr >= 88,
    text: (c) => `🏛️ Klub hoče upokojiti dres ${c.vet.n} — a on še igra zate.`,
    choices: [
      { label: "Velika slovesnost sredi sezone", resolve: (c) => ({ fx: [{ t: "pm", who: c.vet, d: 3 }], txt: `Ganjen do solz. ${surname(c.vet.n)} vpliv +3.` }) },
      { label: "Počakaj do konca kariere", resolve: (c) => ({ fx: [{ t: "contract", who: c.vet, d: 1 }], txt: `Ostaja motiviran — pogodba +1 leto.` }) },
      { label: "Naj sam odloči", resolve: (c) => ({ fx: [{ t: "pm", who: c.vet, d: 1 }], txt: `Ceni spoštovanje. Vpliv +1.` }) },
    ] },

  // ===== FRONT OFFICE / MEDIJI =====
  { id: "gala", weight: 2, req: () => true,
    text: () => `🥂 Sponzorska gala sezone. Lastnik te pričakuje — skavti pa javljajo o talentu, ki igra isti večer.`,
    choices: [
      { label: "Pojdi na galo", resolve: () => ({ fx: [{ t: "pick", s: 1 }], txt: `Lastnik navdušen. +1×🥈 v novi sezoni.` }) },
      { label: "Pojdi na tekmo skavtirat", resolve: (c) => ({ fx: [{ t: "pm", who: c.any, d: 1 }], txt: `Igralci cenijo, da si »košarkar«. ${surname(c.any.n)} vpliv +1.` }) },
      { label: "Pošlji pomočnika, ostani v pisarni", resolve: () => Math.random() < 0.5 ? { fx: [{ t: "pick", f: 1 }], txt: `Delo se obrestuje. +1×🥇.` } : { fx: [], txt: `Miren, a neproduktiven večer.` } },
    ] },
  { id: "place", weight: 2, req: (c) => c.overCap && c.star,
    text: (c) => `📰 Novinar objavi interno plačno listo. ${c.star.n} vidi, koliko zaslužijo drugi.`,
    choices: [
      { label: "Javno opravičilo in obljuba", resolve: (c) => ({ fx: [{ t: "pm", who: c.star, d: -1 }], txt: `Škoda omejena. ${surname(c.star.n)} vpliv −1.` }) },
      { label: "Ignoriraj — bo minilo", resolve: (c) => Math.random() < 0.5 ? { fx: [], txt: `Mine. Brez posledic.` } : { fx: [{ t: "pm", who: c.star, d: -2 }], txt: `Ne mine. Vpliv −2.` } },
      { label: "Obljubi mu podaljšanje po sezoni", resolve: (c) => ({ fx: [{ t: "pm", who: c.star, d: 1 }, { t: "contract", who: c.star, d: 1 }], txt: `Pomirjen. ${surname(c.star.n)} vpliv +1, pogodba +1.` }) },
    ] },
  { id: "lastnik", weight: 2, req: () => true,
    text: () => `💼 Lastnik zahteva sestanek: »Hočem rezultate ZDAJ, ne čez tri leta.«`,
    choices: [
      { label: "Obljubi zmage, prevzemi pritisk", resolve: (c) => Math.random() < 0.5 ? { fx: [{ t: "pick", f: 1 }], txt: `Odobri sredstva. +1×🥇.` } : { fx: [{ t: "pm", who: c.any, d: -1 }], txt: `Pritisk pade na ekipo. ${surname(c.any.n)} vpliv −1.` } },
      { label: "Zagovarjaj dolgoročni načrt", resolve: (c) => c.rook ? { fx: [{ t: "ovr", who: c.rook, d: 1 }], txt: `Dobiš čas za razvoj. ${surname(c.rook.n)} OVR +1.` } : { fx: [], txt: `Kupiš si čas. Brez takojšnjih posledic.` } },
      { label: "Zahtevaj več proračuna zase", resolve: () => ({ fx: [{ t: "pick", s: 1 }], txt: `Izboriš dodaten pick. +1×🥈.` }) },
    ] },
  { id: "dokumentarec", weight: 1, req: (c) => c.big,
    text: (c) => `🎥 Netflix hoče snemati zakulisje. Kamere povsod, tudi v garderobi.`,
    choices: [
      { label: "Odpri vrata — izpostavljenost!", resolve: (c) => Math.random() < 0.5 ? { fx: [{ t: "pick", s: 1 }, { t: "pm", who: c.big, d: 1 }], txt: `Zvezdništvo. +1×🥈, ${surname(c.big.n)} vpliv +1.` } : { fx: [{ t: "pm", who: c.any, d: -1 }], txt: `Kamere motijo. ${surname(c.any.n)} vpliv −1.` } },
      { label: "Le nadzorovan dostop", resolve: () => ({ fx: [{ t: "pick", s: 1 }], txt: `Varno in koristno. +1×🥈.` }) },
      { label: "Zavrni — zasebnost je svetinja", resolve: (c) => ({ fx: [{ t: "pm", who: c.any, d: 1 }], txt: `Ekipa hvaležna za mir. ${surname(c.any.n)} vpliv +1.` }) },
    ] },
  { id: "govorice", weight: 2, req: (c) => c.star,
    text: (c) => `🔊 Govori se, da rival pripravlja mega ponudbo za ${c.star.n}.`,
    choices: [
      { label: "Zavaruj ga s podaljšanjem", resolve: (c) => ({ fx: [{ t: "contract", who: c.star, d: 1 }, { t: "pm", who: c.star, d: 1 }], txt: `Zvest. ${surname(c.star.n)} pogodba +1, vpliv +1.` }) },
      { label: "Testiraj trg — poslušaj ponudbe", resolve: (c) => Math.random() < 0.4 ? { fx: [{ t: "remove", who: c.star }, { t: "pick", f: 2 }], txt: `Odličen posel! ${surname(c.star.n)} zamenjan za 2×🥇.` } : { fx: [{ t: "pm", who: c.star, d: -1 }], txt: `Izve za pogovore. Vpliv −1.` } },
      { label: "Utišaj govorice, ostani miren", resolve: () => ({ fx: [], txt: `Nevihta mine. Brez posledic.` }) },
    ] },

  // ===== ZDRAVJE / KONDICIJA =====
  { id: "prehrana", weight: 2, req: (c) => c.any,
    text: (c) => `🥗 Novi kuhar in znanstvena prehrana? Cena je visoka, korist negotova.`,
    choices: [
      { label: "Investiraj v vrhunsko prehrano", resolve: (c) => Math.random() < 0.6 ? { fx: [{ t: "ovr", who: c.any, d: 1 }, { t: "pm", who: c.any2, d: 1 }], txt: `Telesa bolje reagirajo. ${surname(c.any.n)} OVR +1.` } : { fx: [], txt: `Draga muha, malo učinka.` } },
      { label: "Le za ključne igralce", req: (c) => c.big, resolve: (c) => ({ fx: [{ t: "ovr", who: c.big, d: 1 }], txt: `${surname(c.big.n)} OVR +1.` }) },
      { label: "Denar raje v skavting", resolve: () => ({ fx: [{ t: "pick", s: 1 }], txt: `+1×🥈 v novi sezoni.` }) },
    ] },
  { id: "spanje", weight: 1, req: (c) => c.any,
    text: () => `😴 Študija o spanju priporoča kasnejše treninge in manj potovanj.`,
    choices: [
      { label: "Prilagodi urnik znanosti", resolve: (c) => ({ fx: [{ t: "pm", who: c.any, d: 1 }], txt: `Spočita ekipa. ${surname(c.any.n)} vpliv +1.` }) },
      { label: "Stara šola: jutranji treningi", resolve: (c) => Math.random() < 0.5 ? { fx: [{ t: "ovr", who: c.any, d: 1 }], txt: `Disciplina. OVR +1.` } : { fx: [{ t: "pm", who: c.any, d: -1 }], txt: `Utrujenost. Vpliv −1.` } },
      { label: "Vsak po svoje", resolve: () => ({ fx: [], txt: `Kaos, a nihče se ne pritožuje.` }) },
    ] },

  // ===== MET / VLOGE =====
  { id: "met", weight: 2, req: (c) => c.shooter,
    text: (c) => `🎯 ${c.shooter.n} je čez poletje izgubil met. Na treningu 3/20 za tri.`,
    choices: [
      { label: "Prekvalificiraj v šestega moža", resolve: (c) => ({ fx: [{ t: "trait", who: c.shooter, to: "SM" }, { t: "pm", who: c.shooter, d: 1 }], txt: `${surname(c.shooter.n)} postane 🔥 šesti mož (ni več strelec).` }) },
      { label: "Vztrajaj pri metu", resolve: (c) => Math.random() < 0.6 ? { fx: [], txt: `Met se vrne. Brez posledic.` } : { fx: [{ t: "ovr", who: c.shooter, d: -2 }], txt: `Kriza se vleče. OVR −2.` } },
      { label: "Nauči ga braniti namesto tega", resolve: (c) => ({ fx: [{ t: "trait", who: c.shooter, to: "BR" }], txt: `${surname(c.shooter.n)} postane 🛡️ branilec.` }) },
    ] },
  { id: "obrambar", weight: 2, req: (c) => c.defender,
    text: (c) => `🛡️ ${c.defender.n} je čez poletje razvil trojko. Hoče več napadalne svobode.`,
    choices: [
      { label: "Naj postane dvosmerni strelec", resolve: (c) => Math.random() < 0.6 ? { fx: [{ t: "trait", who: c.defender, to: "SN" }, { t: "ovr", who: c.defender, d: 1 }], txt: `${surname(c.defender.n)} postane 🎯 strelec (+OVR 1)!` } : { fx: [{ t: "pm", who: c.defender, d: -1 }], txt: `Zanemari obrambo. Vpliv −1.` } },
      { label: "Ostani obrambni specialist", resolve: (c) => ({ fx: [{ t: "ovr", who: c.defender, d: 1 }], txt: `Zvest svoji vlogi. OVR +1.` }) },
      { label: "Razvijaj obe plati počasi", resolve: (c) => ({ fx: [{ t: "pm", who: c.defender, d: 1 }], txt: `Vsestranskost. Vpliv +1.` }) },
    ] },
  { id: "playmaker", weight: 2, req: (c) => c.playmaker,
    text: (c) => `🧠 ${c.playmaker.n} preveč tvega s podajami — asistence in izgube rastejo.`,
    choices: [
      { label: "Pusti kreativnost", resolve: (c) => Math.random() < 0.6 ? { fx: [{ t: "ovr", who: c.playmaker, d: 1 }], txt: `Genialnost prevlada. OVR +1.` } : { fx: [{ t: "pm", who: c.playmaker, d: -1 }], txt: `Izgube bolijo. Vpliv −1.` } },
      { label: "Uči ga varnih odločitev", resolve: (c) => ({ fx: [{ t: "pm", who: c.playmaker, d: 1 }], txt: `Zrelost. ${surname(c.playmaker.n)} vpliv +1.` }) },
      { label: "Daj mu polni ključ napada", resolve: (c) => ({ fx: [{ t: "ovr", who: c.playmaker, d: 1 }, { t: "pm", who: c.playmaker, d: 1 }], txt: `Zaupanje sprosti. OVR +1, vpliv +1.` }) },
    ] },

  // ===== MENTOR / FREE AGENT =====
  { id: "mentor", weight: 1, req: () => true,
    text: () => `📞 Upokojeni as kliče: »Slišim, da gradite nekaj posebnega. Za minimum pridem pomagat.«`,
    choices: [
      { label: "Podpiši ga na pripravah", resolve: () => ({ fx: [{ t: "freeAgent", range: [78, 84] }], txt: `Pride — najdeš ga v svoji roki nove sezone.` }) },
      { label: "Vljudno zavrni", resolve: () => ({ fx: [{ t: "pick", s: 1 }], txt: `Razideta se v dobrem. +1×🥈.` }) },
      { label: "Zaposli ga kot skavta", resolve: () => ({ fx: [{ t: "pick", f: 1 }], txt: `Njegovo oko za talent. +1×🥇.` }) },
    ] },
  { id: "prijatelj", weight: 1, req: (c) => c.star,
    text: (c) => `🤝 ${c.star.n} ti šepne: »Moj stari soigralec je še prost. Bi bil odličen za garderobo.«`,
    choices: [
      { label: "Zaupaj zvezdniku, podpiši ga", resolve: (c) => ({ fx: [{ t: "freeAgent", range: [79, 85] }, { t: "pm", who: c.star, d: 1 }], txt: `${surname(c.star.n)} vesel (+vpliv 1), prijatelj pride v roko.` }) },
      { label: "Preveri ga najprej", resolve: () => Math.random() < 0.5 ? { fx: [{ t: "freeAgent", range: [80, 86] }], txt: `Preverjen in dober — v tvoji roki.` } : { fx: [], txt: `Ni bil pravi. Nič izgubljenega.` } },
      { label: "Ne mešaj prijateljstev in posla", resolve: (c) => Math.random() < 0.5 ? { fx: [], txt: `${surname(c.star.n)} razume.` } : { fx: [{ t: "pm", who: c.star, d: -1 }], txt: `Malo užaljen. Vpliv −1.` } },
    ] },

  // ===== KEMIJA / MESTO =====
  { id: "parada", weight: 2, req: (c) => c.won,
    text: () => `🏆 Mesto hoče parado prvakov. Igralci hočejo dopust. Lastnik hoče oboje.`,
    choices: [
      { label: "Velika parada", resolve: (c) => ({ fx: [{ t: "pm", who: c.any, d: 1 }, { t: "pm", who: c.any2, d: 1 }], txt: `Nepozabno. Dva igralca vpliv +1.` }) },
      { label: "Mirno poletje, skavtiraj", resolve: () => ({ fx: [{ t: "pick", s: 1 }], txt: `Medtem ko slavijo, delaš. +1×🥈.` }) },
      { label: "Kratka parada, nato počitek", resolve: (c) => ({ fx: [{ t: "ovr", who: c.any, d: 1 }], txt: `Ravnovesje. ${surname(c.any.n)} OVR +1.` }) },
    ] },
  { id: "aspen", weight: 2, req: (c) => c.lost,
    text: () => `🏔️ Po izgubljeni sezoni garderoba potrebuje reset. Kapetani predlagajo team-building v Aspnu.`,
    choices: [
      { label: "Plačaj Aspen", resolve: (c) => { const fx = [{ t: "pm", who: c.any, d: 1 }]; if (c.unhappyStar) fx.push({ t: "calm", who: c.unhappyStar }); return { fx, txt: `Zrak očiščen. ${surname(c.any.n)} vpliv +1.${c.unhappyStar ? ` ${surname(c.unhappyStar.n)} pomirjen.` : ""}` }; } },
      { label: "Treningi 2× na dan", resolve: (c) => Math.random() < 0.5 ? { fx: [{ t: "ovr", who: c.any, d: 1 }], txt: `Garanje se obrestuje. OVR +1.` } : { fx: [{ t: "pm", who: c.any, d: -1 }], txt: `Preveč palice. Vpliv −1.` } },
      { label: "Skupinska terapija in analiza", resolve: (c) => ({ fx: [{ t: "pm", who: c.any, d: 1 }, { t: "pm", who: c.any2, d: 1 }], txt: `Iskrenost poveže. Dva vpliv +1.` }) },
    ] },
  { id: "navijaci", weight: 1, req: (c) => c.nonStar,
    text: (c) => `📣 Navijači na tribunah žvižgajo ${c.nonStar.n} po slabi predstavi.`,
    choices: [
      { label: "Javno ga podpri", resolve: (c) => ({ fx: [{ t: "pm", who: c.nonStar, d: 2 }], txt: `${surname(c.nonStar.n)} hvaležen. Vpliv +2.` }) },
      { label: "Uporabi kot motivacijo", resolve: (c) => Math.random() < 0.5 ? { fx: [{ t: "ovr", who: c.nonStar, d: 1 }], txt: `Dokaže jim. OVR +1.` } : { fx: [{ t: "pm", who: c.nonStar, d: -1 }], txt: `Zlomi ga. Vpliv −1.` } },
      { label: "Organiziraj dogodek z navijači", resolve: (c) => ({ fx: [{ t: "pm", who: c.nonStar, d: 1 }], txt: `Most zgrajen. Vpliv +1.` }) },
    ] },
  { id: "dobrodelnost", weight: 1, req: (c) => c.any,
    text: (c) => `❤️ ${c.any.n} vodi dobrodelno akcijo v skupnosti. Vzame čas, a dviga duha.`,
    choices: [
      { label: "Polna klubska podpora", resolve: (c) => ({ fx: [{ t: "pm", who: c.any, d: 2 }], txt: `${surname(c.any.n)} navdihnjen. Vpliv +2.` }) },
      { label: "Vključi celo ekipo", resolve: (c) => ({ fx: [{ t: "pm", who: c.any, d: 1 }, { t: "pm", who: c.any2, d: 1 }], txt: `Skupno poslanstvo. Dva vpliv +1.` }) },
      { label: "Naj ostane osebni projekt", resolve: () => ({ fx: [{ t: "pick", s: 1 }], txt: `Dober PR za klub. +1×🥈.` }) },
    ] },

  // ===== SREČA / NAKLJUČJE =====
  { id: "loterija", weight: 1, req: () => true,
    text: () => `🎰 Nepričakovana kompenzacija zaradi lanske napake lige — dobiš bonus izbor.`,
    choices: [
      { label: "Vzemi zgodnji pick", resolve: () => ({ fx: [{ t: "pick", f: 1 }], txt: `+1×🥇 v novi sezoni.` }) },
      { label: "Vzemi dva pozna", resolve: () => ({ fx: [{ t: "pick", s: 2 }], txt: `+2×🥈 v novi sezoni.` }) },
      { label: "Zamenjaj za razvojni denar", resolve: (c) => c.rook ? { fx: [{ t: "ovr", who: c.rook, d: 2 }], txt: `${surname(c.rook.n)} OVR +2.` } : c.young ? { fx: [{ t: "ovr", who: c.young, d: 2 }], txt: `${surname(c.young.n)} OVR +2.` } : { fx: [{ t: "pick", f: 1 }], txt: `Ni mladih — vzameš +1×🥇.` } },
    ] },
  { id: "vraza", weight: 1, req: (c) => c.any,
    text: (c) => `🔮 ${c.any.n} verjame, da mu je nova rutina prinesla srečo. Ekipa je skeptična.`,
    choices: [
      { label: "Spodbudi vraževerje", resolve: (c) => Math.random() < 0.6 ? { fx: [{ t: "pm", who: c.any, d: 2 }], txt: `Samozavest raste. ${surname(c.any.n)} vpliv +2.` } : { fx: [], txt: `Nič posebnega.` } },
      { label: "Prizemlji ga z znanostjo", resolve: (c) => ({ fx: [{ t: "ovr", who: c.any, d: 1 }], txt: `Fokus na resnično delo. OVR +1.` }) },
      { label: "Naj vsak veruje po svoje", resolve: () => ({ fx: [], txt: `Garderoba ostane raznolika.` }) },
    ] },
  { id: "ulica", weight: 1, req: (c) => c.big,
    text: (c) => `🏀 ${c.big.n} je v ulični ligi razbil lokalne legende. Video postane viralen.`,
    choices: [
      { label: "Slavi svobodo igre", resolve: (c) => ({ fx: [{ t: "pm", who: c.big, d: 1 }], txt: `Ljubezen do igre. ${surname(c.big.n)} vpliv +1.` }) },
      { label: "Opomni ga na tveganje poškodb", resolve: (c) => Math.random() < 0.3 ? { fx: [{ t: "injury", who: c.big }], txt: `Prepozno — ${surname(c.big.n)} se je poškodoval na ulici!` } : { fx: [{ t: "pm", who: c.big, d: -1 }], txt: `Ubere, a je slabe volje. Vpliv −1.` } },
      { label: "Izkoristi hype za trženje", resolve: () => ({ fx: [{ t: "pick", s: 1 }], txt: `Viralnost prinese sponzorja. +1×🥈.` }) },
    ] },
  { id: "novinar", weight: 1, req: () => true,
    text: () => `📝 Vplivni novinar hoče ekskluzivo o tvoji viziji kluba.`,
    choices: [
      { label: "Razkrij velike načrte", resolve: (c) => Math.random() < 0.5 ? { fx: [{ t: "pick", s: 1 }], txt: `Pozitiven odmev. +1×🥈.` } : { fx: [{ t: "pm", who: c.any, d: -1 }], txt: `Igralci nezadovoljni z izjavami. ${surname(c.any.n)} vpliv −1.` } },
      { label: "Diplomatski, splošni odgovori", resolve: () => ({ fx: [], txt: `Varno in pozabljivo.` }) },
      { label: "Preusmeri pozornost na igralce", resolve: (c) => ({ fx: [{ t: "pm", who: c.any, d: 1 }], txt: `Igralci cenijo reflektor. ${surname(c.any.n)} vpliv +1.` }) },
    ] },

  // ===== DODATNI =====
  { id: "ambicija", weight: 2, req: (c) => c.young || c.nonStar,
    text: (c) => { const t = c.young || c.nonStar; return `📈 ${t.n} zahteva večjo vlogo — sicer bo »iskal priložnost drugje«.`; },
    choices: [
      { label: "Daj mu več minut in svobode", resolve: (c) => { const t = c.young || c.nonStar; return Math.random() < 0.6 ? { fx: [{ t: "ovr", who: t, d: 2 }], txt: `Priložnost zgrabi. ${surname(t.n)} OVR +2.` } : { fx: [{ t: "pm", who: t, d: -1 }], txt: `Ni bil pripravljen. Vpliv −1.` }; } },
      { label: "Postavi ga na realna tla", resolve: (c) => { const t = c.young || c.nonStar; return { fx: [{ t: "pm", who: t, d: -1 }], txt: `${surname(t.n)} užaljen. Vpliv −1.` }; } },
      { label: "Obljubi mu jasno pot rasti", resolve: (c) => { const t = c.young || c.nonStar; return { fx: [{ t: "pm", who: t, d: 1 }], txt: `Ceni načrt. ${surname(t.n)} vpliv +1.` }; } },
    ] },
  { id: "socialne", weight: 1, req: (c) => c.big,
    text: (c) => `📲 ${c.big.n} se je na omrežjih zapletel v prepir z zvezdnikom rivala. Liga opozarja.`,
    choices: [
      { label: "Pusti tekmovalni ogenj", resolve: (c) => Math.random() < 0.5 ? { fx: [{ t: "pm", who: c.big, d: 2 }], txt: `Motiviran do konca! Vpliv +2.` } : { fx: [{ t: "pm", who: c.big, d: -1 }], txt: `Izgubi fokus. Vpliv −1.` } },
      { label: "Ukaži medijski molk", resolve: (c) => ({ fx: [{ t: "ovr", who: c.big, d: 1 }], txt: `Kanalizira energijo v igro. OVR +1.` }) },
      { label: "Obrni v marketinško priložnost", resolve: () => ({ fx: [{ t: "pick", s: 1 }], txt: `Rivalstvo se prodaja. +1×🥈.` }) },
    ] },
  { id: "pomocnik", weight: 1, req: () => true,
    text: () => `👔 Rival hoče tvojega najboljšega pomočnika za glavnega trenerja.`,
    choices: [
      { label: "Blagoslovi ga, poberi kompenzacijo", resolve: () => ({ fx: [{ t: "pick", f: 1 }], txt: `Kompenzacijski pick. +1×🥇.` }) },
      { label: "Zadrži ga z višjo plačo", resolve: (c) => ({ fx: [{ t: "pm", who: c.any, d: 1 }], txt: `Kontinuiteta pomaga. ${surname(c.any.n)} vpliv +1.` }) },
      { label: "Povišaj mladega pomočnika", resolve: (c) => Math.random() < 0.6 ? { fx: [{ t: "ovr", who: (c.young || c.any), d: 1 }], txt: `Svež pristop. ${surname((c.young || c.any).n)} OVR +1.` } : { fx: [], txt: `Menjava brez učinka.` } },
    ] },
  { id: "comeback", weight: 2, req: (c) => c.any,
    text: (c) => `💪 ${c.any.n} se vrača po dolgi poškodbi. Rehabilitacija je šla dobro — a strah ostaja.`,
    choices: [
      { label: "Postopna vrnitev, previdno", resolve: (c) => ({ fx: [{ t: "pm", who: c.any, d: 1 }], txt: `Samozavest se vrača. ${surname(c.any.n)} vpliv +1.` }) },
      { label: "Vrzi ga takoj v ogenj", resolve: (c) => Math.random() < 0.5 ? { fx: [{ t: "ovr", who: c.any, d: 2 }], txt: `Kot da ni bil odsoten! OVR +2.` } : { fx: [{ t: "injury", who: c.any }], txt: `Prehitro — ${surname(c.any.n)} spet klecne.` } },
      { label: "Preoblikuj mu igro okoli zdravja", resolve: (c) => ({ fx: [{ t: "trait", who: c.any, to: "SM" }, { t: "pm", who: c.any, d: 1 }], txt: `${surname(c.any.n)} postane 🔥 šesti mož (+vpliv 1).` }) },
    ] },
  { id: "druzina", weight: 1, req: (c) => c.any,
    text: (c) => `🏠 ${c.any.n} ima družinske skrbi izven parketa. Glava ni pri igri.`,
    choices: [
      { label: "Daj mu prosto, kolikor rabi", resolve: (c) => ({ fx: [{ t: "pm", who: c.any, d: 2 }], txt: `Globoka hvaležnost. ${surname(c.any.n)} vpliv +2.` }) },
      { label: "Ponudi klubsko podporo", resolve: (c) => ({ fx: [{ t: "pm", who: c.any, d: 1 }], txt: `Občutek varnosti. Vpliv +1.` }) },
      { label: "Pričakuj profesionalnost", resolve: (c) => Math.random() < 0.5 ? { fx: [{ t: "ovr", who: c.any, d: 1 }], txt: `Košarka mu je pobeg. OVR +1.` } : { fx: [{ t: "pm", who: c.any, d: -2 }], txt: `Zlomi se pod pritiskom. Vpliv −2.` } },
    ] },
];

// ============ AI ============
function aiBidFor(card, g) {
  const none = { f: 0, s: 0, w: 0 };
  if (!canSign(g.a.roster, card)) return none;
  let maxBid = Math.round((spts(card) - 88) * 0.9);
  if (salaryOf(g.a.roster) + card.sal > capFor(g.season) + APRON) maxBid -= 8;
  maxBid = Math.min(maxBid, 10); // strop: igralčev polni arzenal je 11 (2🥇+3🥈+1🔁) — vsaka dražba mora biti zmagljiva z all-in
  if (maxBid <= 0) return none;
  const P = g.a.picks;
  let best = none, bestV = 0;
  for (let f = 0; f <= P.f; f++) for (let s = 0; s <= P.s; s++) for (let w = 0; w <= P.w; w++) {
    const v = bidValC({ f, s, w }, g.a.coach);
    if (v <= maxBid && v > bestV) { bestV = v; best = { f, s, w }; }
  }
  return best;
}

function aiPlay(g) {
  const logs = [];
  let { deck, hDisc, aDisc, reshuffled } = g;
  hDisc = [...hDisc]; aDisc = [...aDisc];
  const a = { ...g.a, hand: [...g.a.hand], roster: [...g.a.roster], calls: [...(g.a.calls || [])] };
  let injured = { ...g.injured };
  let rehabUsed = g.rehabUsed || { h: false, a: false };
  // ☎️ AI odigra NAJVEČ 1 klic na potezo (pošteno: glasno v dnevnik). Ozek nabor s preprostimi sprožilci.
  const aiUseCall = (id) => { a.calls.splice(a.calls.indexOf(id), 1); };
  if (a.calls.includes("drbine") && injured.a) { const inj = a.roster.find((c) => c.id === injured.a); injured = { ...injured, a: null }; aiUseCall("drbine"); logs.push(`📞 AI: dr. Bine je pozdravil ${inj ? surname(inj.n) : "igralca"}.`); }
  else if (a.calls.includes("zavarovanje") && injured.a) { const inj = a.roster.find((c) => c.id === injured.a); injured = { ...injured, a: null }; aiUseCall("zavarovanje"); logs.push(`📞 AI: zavarovalna polica — ${inj ? surname(inj.n) : "igralec"} ostaja zdrav.`); }
  else if (a.calls.includes("kava") && a.roster.some((c) => c.unhappy)) { const u = a.roster.find((c) => c.unhappy); a.roster = a.roster.map((c) => { if (c.id !== u.id) return c; const { unhappy: _u, basePm: _b, unhappyCause: _c, ...rest } = c; return { ...rest, pm: c.basePm != null ? c.basePm : c.pm }; }); aiUseCall("kava"); logs.push(`📞 AI: kava z agentom — ${surname(u.n)} spet zadovoljen.`); }
  else if (a.calls.includes("usluga") && a.picks.s <= 1) { a.picks = { ...a.picks, s: a.picks.s + 1 }; aiUseCall("usluga"); logs.push("📞 AI: usluga iz lige — +1× 🥈."); }
  else if (a.calls.includes("neznana")) { aiUseCall("neznana"); if (Math.random() < 0.5) { a.picks = { ...a.picks, s: a.picks.s + 1 }; logs.push("📞 AI: neznana številka — nekaj mu je uspelo."); } else logs.push("📞 AI: neznana številka — klic v prazno."); }
  const aRc = rehabCostFor(g, "a");
  if (injured.a && a.picks.s >= aRc) {
    const inj = a.roster.find((c) => c.id === injured.a);
    if (inj && spts(inj) >= 95) {
      a.picks = { ...a.picks, s: a.picks.s - aRc };
      injured = { ...injured, a: null };
      rehabUsed = { ...rehabUsed, a: true };
      logs.push(`AI je z ${aRc}× 🥈 poslal ${inj.n} na rehab — spet je zdrav.`);
    }
  }
  const turnN = g.aiTurns + 1;
  const thrDraw = Math.max(58, 78 - 2 * turnN);
  // AI kupuje iz TVOJIH odpuščenih (hDisc) s popustom
  const market = hDisc.filter((c) => canSign(a.roster, c)).map((c) => asDiscount(c)).sort((x, y) => val(y) - val(x));
  const bestMarket = market[0];
  let drew, drewFromH = null;
  if (bestMarket && val(bestMarket) >= thrDraw) {
    drewFromH = hDisc.find((c) => c.id === bestMarket.id) || null; // izvirnik (polna cena) — če ga AI ne obdrži, se vrne v TVOJ odpad
    drew = bestMarket; hDisc = hDisc.filter((c) => c.id !== bestMarket.id);
    logs.push(`AI je iz tvojih odpuščenih pobral ${drew.n} s popustom (${drew.sal} M$ namesto ${drew.origSal}).`);
  } else {
    if (deck.length === 0) {
      if (!reshuffled && (hDisc.length + aDisc.length) > 0) { deck = shuffle([...hDisc, ...aDisc]); hDisc = []; aDisc = []; reshuffled = true; logs.push("Skriti kup je pošel — odpadi premešani nazaj."); }
      else return { ...g, a, injured, log: [...g.log, ...logs, "Kupi so prazni — konec runde."], endNow: true, discardedCard: null };
    }
    drew = deck.pop(); logs.push("AI je vlekel s skritega kupa.");
  }
  a.hand.push(drew);
  // vrata na MEJNI prispevek k POLNI oceni (m vsebuje +20 za zapolnitev mesta, +10 za manjkajočo pozicijo, sinergije, filozofijo, kavlje, davek)
  const mThr = Math.max(58, 112 - 6 * turnN) - (g.finalFor === "a" ? 60 : 0);
  const aiPhil = g.philosophy && g.philosophy.a;
  const aiCap = capFor(g.season);
  let signed = true, signedCount = 0; // AI ima ENAKO omejitev podpisov kot človek
  while (signed && a.roster.length < 10 && signedCount < SIGN_LIMIT) {
    signed = false;
    const aiBaseNow = aiStrOf(a.roster, a.picks, a.coach, injured.a, aiPhil, aiCap);
    const cands = a.hand.filter((c) => canSign(a.roster, c))
      .map((c) => ({ c, m: aiStrOf([...a.roster, c], a.picks, a.coach, injured.a, aiPhil, aiCap) - aiBaseNow }))
      .sort((x, y) => (y.m - x.m) || (val(y.c) - val(x.c)));
    for (const { c, m } of cands) {
      const stack3 = posCount(a.roster, c.pos) === 2;
      const need = mThr + (stack3 ? 12 : 0);
      if (m >= need || (g.finalFor === "a" && a.roster.length < 10)) {
        let sc = g.franchise && c.contract == null ? { ...c, contract: contractFor(c) } : { ...c };
        if (sc.rookie && sc.tier === "safe" && !sc.developed) {
          const to = Math.round((sc.tl ?? sc.potLow) + Math.random() * ((sc.th ?? sc.potHigh) - (sc.tl ?? sc.potLow)));
          logs.push(`🔒 AI-jev novinec ${sc.n} takoj zaigra z OVR ${to} (prej ${sc.ovr}).`);
          sc = { ...sc, ovr: to, developed: true };
        }
        a.roster.push(sc); a.hand = a.hand.filter((x) => x.id !== c.id);
        logs.push(`AI je podpisal: ${c.n} (${c.pos}, OVR ${sc.ovr}, ${c.sal} M$).`);
        signed = true; signedCount++; break;
      }
    }
  }
  let discardedCard = null;
  if (a.hand.length > 0) {
    // pametna odvržba: vrže karto z najmanjšo uporabnostjo ZANJ (mrtve — polna pozicija — najprej, sicer najnižji mejni prispevek)
    const aiBaseD = aiStrOf(a.roster, a.picks, a.coach, injured.a, aiPhil, aiCap);
    const keepScore = (c) => canSign(a.roster, c) ? aiStrOf([...a.roster, c], a.picks, a.coach, injured.a, aiPhil, aiCap) - aiBaseD : val(c) - 200;
    const worst = [...a.hand].sort((x, y) => keepScore(x) - keepScore(y))[0];
    a.hand = a.hand.filter((x) => x.id !== worst.id);
    if (drewFromH && worst.id === drewFromH.id) {
      // AI je pobral tvojo odpadno karto, a je ni obdržal → vrne se v TVOJ odpad (ne na tvoj trg — brez izkoriščanja "odvrzi in vzemi nazaj")
      hDisc = [...hDisc, drewFromH];
      logs.push(`AI je premislil in vrnil ${worst.n} nazaj v tvoj odpad.`);
    } else {
      aDisc = [...aDisc, worst];
      discardedCard = worst;
      logs.push(`AI je odpustil: ${worst.n} (na voljo tebi s popustom).`);
    }
  }
  return { ...g, deck, hDisc, aDisc, a, injured, rehabUsed, reshuffled, aiTurns: turnN, log: [...g.log, ...logs], discardedCard };
}

// ============ VIZUALNE KOMPONENTE ============
function PosBadge({ p, sm }) {
  return <span className={"posb" + (sm ? " sm" : "")} style={{ background: POS_COLOR[p] }}>{p}</span>;
}

// ===== IKONE — "varsity ploskovni stil": 24px mreža, mornarski obris, 2 polnili iz palete =====
function Ico({ k, s = 14, style }) {
  const c = { width: s, height: s, viewBox: "0 0 24 24", "aria-hidden": true, style: { verticalAlign: "-0.15em", display: "inline-block", flexShrink: 0, ...style } };
  const NV = "#152744";
  switch (k) {
    case "ball": return (<svg {...c}><circle cx="12" cy="12" r="9.6" fill="#E4762B" stroke={NV} strokeWidth="1.8" /><path d="M12 2.4v19.2 M2.4 12h19.2 M5.2 5.2c3.2 2.6 3.2 11 0 13.6 M18.8 5.2c-3.2 2.6-3.2 11 0 13.6" fill="none" stroke={NV} strokeWidth="1.5" /></svg>);
    case "SN": return (<svg {...c}><circle cx="12" cy="12" r="9.4" fill="#F5EBDC" stroke={NV} strokeWidth="1.8" /><circle cx="12" cy="12" r="5.9" fill="#C0392B" stroke={NV} strokeWidth="1.1" /><circle cx="12" cy="12" r="2.5" fill="#F5EBDC" stroke={NV} strokeWidth="1" /></svg>);
    case "BR": return (<svg {...c}><path d="M12 2.4 20 5.4 V12 c0 5-3.4 8.6-8 10.2 C7.4 20.6 4 17 4 12 V5.4 Z" fill="#F5EBDC" stroke={NV} strokeWidth="1.8" strokeLinejoin="round" /><path d="M12 5.8 16.6 7.6 V12 c0 3-1.9 5.5-4.6 6.7 C9.3 17.5 7.4 15 7.4 12 V7.6 Z" fill="#2E7D32" stroke={NV} strokeWidth="1.1" strokeLinejoin="round" /></svg>);
    case "OR": return (<svg {...c}><rect x="4.6" y="4" width="14.8" height="17.4" rx="2" fill="#F5EBDC" stroke={NV} strokeWidth="1.8" /><rect x="8.4" y="2" width="7.2" height="4.2" rx="1.3" fill="#F0B429" stroke={NV} strokeWidth="1.3" /><path d="M8 11 l3 3 M11 11 l-3 3" stroke="#C0392B" strokeWidth="1.7" strokeLinecap="round" /><circle cx="15.6" cy="12.4" r="1.8" fill="none" stroke={NV} strokeWidth="1.6" /><path d="M8.2 18.2 c3 .3 5.6-.8 7.4-3" fill="none" stroke={NV} strokeWidth="1.3" strokeDasharray="2 1.7" /></svg>);
    case "SM": return (<svg {...c}><path d="M12 2.4 c1.2 3.2-4.6 5.6-4.6 10.2 a6.6 6.6 0 0 0 13.2 0 c0-2.7-1.5-4.6-2.8-6-.2 1.5-.8 2.3-1.8 2.9 .5-2.9-1.2-5.7-4-7.1z" fill="#E4762B" stroke={NV} strokeWidth="1.6" strokeLinejoin="round" /><path d="M12 20.8 a3.5 3.5 0 0 1-3.5-3.5 c0-2 2-3.1 3.5-5.1 1.5 2 3.5 3.1 3.5 5.1 A3.5 3.5 0 0 1 12 20.8z" fill="#F0B429" /></svg>);
    case "VD": return (<svg {...c}><path d="M12 2.6 l2.9 5.9 6.5.9 -4.7 4.6 1.1 6.4 -5.8-3 -5.8 3 1.1-6.4 L2.6 9.4 l6.5-.9z" fill="#F0B429" stroke={NV} strokeWidth="1.6" strokeLinejoin="round" /></svg>);
    case "f": return (<svg {...c}><path d="M3.6 7.4 H20.4 V10.6 A1.9 1.9 0 0 0 20.4 14.2 V17.4 H3.6 V14.2 A1.9 1.9 0 0 0 3.6 10.6 Z" fill="#F0B429" stroke={NV} strokeWidth="1.6" strokeLinejoin="round" /><path d="M8.7 8.6 V16.2" stroke={NV} strokeWidth="1.1" strokeDasharray="1.7 1.5" opacity=".55" /><text x="14.6" y="16.1" textAnchor="middle" fontSize="10" fontWeight="900" fill={NV} fontFamily="'Archivo Black','Arial Black',Arial">1</text></svg>);
    case "s": return (<svg {...c}><path d="M3.6 7.4 H20.4 V10.6 A1.9 1.9 0 0 0 20.4 14.2 V17.4 H3.6 V14.2 A1.9 1.9 0 0 0 3.6 10.6 Z" fill="#CBD3DF" stroke={NV} strokeWidth="1.6" strokeLinejoin="round" /><path d="M8.7 8.6 V16.2" stroke={NV} strokeWidth="1.1" strokeDasharray="1.7 1.5" opacity=".55" /><text x="14.6" y="16.1" textAnchor="middle" fontSize="10" fontWeight="900" fill={NV} fontFamily="'Archivo Black','Arial Black',Arial">2</text></svg>);
    case "w": return (<svg {...c}><path d="M6.2 9 A6.6 6.6 0 0 1 18.6 10.6" fill="none" stroke="#7C3AED" strokeWidth="2.3" strokeLinecap="round" /><path d="M19.6 6.4 18.7 10.8 14.3 9.9" fill="none" stroke="#7C3AED" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" /><path d="M17.8 15 A6.6 6.6 0 0 1 5.4 13.4" fill="none" stroke={NV} strokeWidth="2.3" strokeLinecap="round" /><path d="M4.4 17.6 5.3 13.2 9.7 14.1" fill="none" stroke={NV} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" /></svg>);
    case "elite": return (<svg {...c}><path d="M7 4.4 h10 l4 5.2 L12 21 3 9.6 Z" fill="#7C3AED" stroke={NV} strokeWidth="1.6" strokeLinejoin="round" /><path d="M3 9.6 h18 M7 4.4 l5 16.6 M17 4.4 l-5 16.6" fill="none" stroke={NV} strokeWidth=".9" opacity=".55" /><path d="M7 4.4 h10 l1.7 2.2 H5.3 Z" fill="#9B6DFF" stroke={NV} strokeWidth=".9" /></svg>);
    case "proj": return (<svg {...c}><path d="M12 21.4 V12.6" stroke={NV} strokeWidth="1.9" strokeLinecap="round" /><path d="M12 13.4 C12 8.8 8.8 6.4 4.4 6.4 c0 4.6 3.2 7 7.6 7z" fill="#2E7D32" stroke={NV} strokeWidth="1.4" strokeLinejoin="round" /><path d="M12 13.4 c0-4.6 3.2-7 7.6-7 0 4.6-3.2 7-7.6 7z" fill="#6FBF73" stroke={NV} strokeWidth="1.4" strokeLinejoin="round" /></svg>);
    case "safe": return (<svg {...c}><circle cx="12" cy="12" r="9.5" fill="#2E7D32" stroke={NV} strokeWidth="1.8" /><path d="M7.4 12.5 l3.1 3.1 6.1-6.6" fill="none" stroke="#F5EBDC" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" /></svg>);
    case "inj": return (<svg {...c}><g transform="rotate(-28 12 12)"><rect x="2.6" y="8.6" width="18.8" height="6.8" rx="3.4" fill="#E8C89A" stroke={NV} strokeWidth="1.6" /><rect x="9" y="9.6" width="6" height="4.8" rx="1" fill="#F5EBDC" stroke={NV} strokeWidth="1" /><circle cx="5.9" cy="12" r=".8" fill={NV} /><circle cx="18.1" cy="12" r=".8" fill={NV} /></g></svg>);
    /* gumbi na temnem ozadju → svetle barve */
    case "trade": return (<svg {...c}><path d="M4 9.2 H16" fill="none" stroke="#E4762B" strokeWidth="2.1" strokeLinecap="round" /><path d="M13.3 6.2 16.9 9.2 13.3 12.2" fill="none" stroke="#E4762B" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" /><path d="M20 14.8 H8" fill="none" stroke="#F5EBDC" strokeWidth="2.1" strokeLinecap="round" /><path d="M10.7 11.8 7.1 14.8 10.7 17.8" fill="none" stroke="#F5EBDC" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" /></svg>);
    case "waive": return (<svg {...c}><circle cx="6.6" cy="7.2" r="2.5" fill="none" stroke="#F5EBDC" strokeWidth="1.7" /><circle cx="6.6" cy="16.8" r="2.5" fill="none" stroke="#F5EBDC" strokeWidth="1.7" /><path d="M8.8 8.6 L20 15.6" fill="none" stroke="#F5EBDC" strokeWidth="1.9" strokeLinecap="round" /><path d="M8.8 15.4 L20 8.4" fill="none" stroke="#F5EBDC" strokeWidth="1.9" strokeLinecap="round" /><circle cx="12.2" cy="12" r="1.3" fill="#FF6B5E" /></svg>);
    case "draft": return (<svg {...c}><path d="M3.6 6.6 H20.4 V9.6 a2.2 2.2 0 0 0 0 4.8 V17.4 H3.6 V14.4 a2.2 2.2 0 0 0 0-4.8 Z" fill="#F0B429" stroke="#F5EBDC" strokeWidth="1.2" strokeLinejoin="round" /><path d="M14.4 6.6 V17.4" stroke={NV} strokeWidth="1.1" strokeDasharray="1.5 1.6" /><path d="M8.7 8.9 l.95 1.95 2.15.3 -1.55 1.5 .37 2.15 -1.92-1.02 -1.92 1.02 .37-2.15 -1.55-1.5 2.15-.3z" fill={NV} /></svg>);
    case "cap": return (<svg {...c}><path d="M5 14.6 C5 9 8.2 5.6 12 5.6 C15.8 5.6 19 9 19 14.6 Z" fill="#2E4A78" stroke={NV} strokeWidth="1.5" strokeLinejoin="round" /><path d="M18.3 14.6 C20.9 14.6 22.2 15.8 22.2 17.1 L5 17.1 L5 14.6 Z" fill="#E4762B" stroke={NV} strokeWidth="1.5" strokeLinejoin="round" /><circle cx="12" cy="5.9" r="1.05" fill={NV} /></svg>);
    case "contract": return (<svg {...c}><path d="M6 3.4 H14.4 L18.4 7.4 V20.6 H6 Z" fill="#F5EBDC" stroke={NV} strokeWidth="1.5" strokeLinejoin="round" /><path d="M14.2 3.6 V7.6 H18.2" fill="none" stroke={NV} strokeWidth="1.3" strokeLinejoin="round" /><path d="M8.4 11.2 H15.4 M8.4 14 H15.4 M8.4 16.8 H12.8" stroke={NV} strokeWidth="1.2" strokeLinecap="round" /></svg>);
    case "sulk": return (<svg {...c}><circle cx="12" cy="12.6" r="8.6" fill="#FF6B5E" stroke={NV} strokeWidth="1.5" /><path d="M7.8 10.6 L10.6 11.9 M16.2 10.6 L13.4 11.9" stroke={NV} strokeWidth="1.4" strokeLinecap="round" /><circle cx="9.5" cy="13" r="1" fill={NV} /><circle cx="14.5" cy="13" r="1" fill={NV} /><path d="M9.5 17 C10.6 15.9 13.4 15.9 14.5 17" fill="none" stroke={NV} strokeWidth="1.4" strokeLinecap="round" /></svg>);
    default: return null;
  }
}

// Lesen dražbeni kladivce (gavel) — Unicode nima emojija zanj, zato lastna sličica.
function Gavel({ s = 18, style }) {
  return (
    <svg viewBox="0 0 24 24" width={s} height={s} aria-hidden="true" style={{ verticalAlign: "-0.17em", display: "inline-block", flexShrink: 0, ...style }}>
      <g transform="rotate(-38 12 11)">
        <rect x="10.3" y="9.5" width="3.4" height="13" rx="1.7" fill="#a06a32" stroke="#5a3312" strokeWidth="0.8" />
        <rect x="3.5" y="4" width="17" height="7.6" rx="2.6" fill="#c1874a" stroke="#5a3312" strokeWidth="1" />
        <rect x="7.2" y="4" width="1.7" height="7.6" fill="#7a4e21" />
        <rect x="15.1" y="4" width="1.7" height="7.6" fill="#7a4e21" />
      </g>
      <rect x="2.5" y="20.4" width="19" height="3.2" rx="1.6" fill="#7a4e21" stroke="#5a3312" strokeWidth="0.8" />
    </svg>
  );
}

// silhueta prospekta — novinci še nimajo uradne fotke (kot na pravih draft tablah); barva pozicije da identiteto
function RookieFace({ c, cls }) {
  const col = POS_COLOR[c.pos] || "#152744";
  return (
    <svg className={cls} viewBox="0 0 40 40" aria-hidden="true">
      <defs><clipPath id={`rf${c.id}`}><circle cx="20" cy="20" r="20" /></clipPath></defs>
      <g clipPath={`url(#rf${c.id})`}>
        <rect width="40" height="40" fill="#e9dec4" />
        <path d="M4 40 C4.5 29 11 25 20 25 C29 25 35.5 29 36 40 Z" fill={col} />
        <circle cx="20" cy="15.5" r="7.6" fill={col} />
        <path d="M13 22.5 C15 25 25 25 27 22.5" fill="none" stroke="#e9dec4" strokeWidth="1.1" opacity=".5" />
      </g>
    </svg>
  );
}

// slika igralca: NBA fotka / rookie prava fotka; ob napaki (mrtev URL) graciozno pade na silhueto
function Face({ c, cls }) {
  const [failed, setFailed] = useState(false);
  const url = faceUrl(c) || (c.rookie ? ROOKIE_IMG[c.n] : null);
  if (url && !failed) return <img className={cls} src={url} alt="" loading="lazy" draggable={false} onError={() => setFailed(true)} />;
  if (c.rookie) return <RookieFace c={c} cls={cls} />;
  return null;
}

// hrbet karte za pack-opening obrat — prava ilustracija (ChatGPT), fallback SVG žoga če slika ne naloži
function CardBack({ tell }) {
  const [imgOk, setImgOk] = useState(true);
  return (
    <div className={"card-back" + (tell ? " tell" : "")}>
      {imgOk
        ? <img className="card-back-img" src="/img/cardback-v1.jpg" alt="" draggable={false} onError={() => setImgOk(false)} />
        : <svg viewBox="0 0 32 32" aria-hidden="true">
            <circle cx="16" cy="16" r="13" fill="#E4762B" stroke="#F0B429" strokeWidth="1.6" />
            <path d="M16 3v26 M3 16h26 M8.7 8.7c4 3.2 4 11.4 0 14.6 M23.3 8.7c-4 3.2-4 11.4 0 14.6" fill="none" stroke="#152744" strokeWidth="1.7" strokeLinecap="round" />
          </svg>}
    </div>
  );
}

function PlayerCard({ c, onClick, selected, mini, starter, dim, ribbon, injured, onStar, stamped }) {
  const rare = (c.ovr >= 93 ? " gold" : "") + (c.rookie && c.tier === "elite" ? " holo" : "");
  if (mini) {
    return (
      <button className={"mini" + rare + (starter ? " starter" : "") + (selected ? " msel" : "") + (injured ? " inj" : "")} style={{ borderTopColor: injured ? "#C0392B" : POS_COLOR[c.pos] }} onClick={onClick}>
        <div className="mini-top"><PosBadge p={c.pos} sm /><span>{injured ? <Ico k="inj" s={14} /> : c.rookie ? <Ico k={c.tier} s={14} /> : <Ico k={c.tr} s={14} />}</span><b>{c.ovr}</b></div>
        <div className="mini-name">{injured ? "🩹 " : starter ? "★ " : ""}{c.unhappy && <Ico k="sulk" s={13} style={{ verticalAlign: "-2px", marginRight: 1 }} />}<Face c={c} cls="mini-face" />{surname(c.n)}</div>
        <div className="mini-sal"><span style={{ color: careerPhase(c.age).col, fontWeight: 700 }}>{careerPhase(c.age).ico} {c.age} let</span> · {c.deal ? "🔖 " : ""}{c.sal} M${c.contract != null && <> · <Ico k="contract" s={11} style={{ verticalAlign: "-1px" }} />{c.contract}</>}</div>
        <div className="mini-pts">{injured ? "poškodovan" : starter ? `★ ${spts(c)} tč v peterki` : `klop ${Math.floor(c.ovr / 2)} tč`}</div>
        {onStar && !starter && !injured && <span className="mini-promote" role="button" title="Premakni v prvo peterko" onClick={(e) => { e.stopPropagation(); onStar(); }}>↑ v peterko</span>}
        {stamped && <div className="stamp"><span>{stamped}</span></div>}
      </button>
    );
  }
  return (
    <button className={"card" + rare + (selected ? " sel" : "") + (dim ? " dim" : "")} onClick={onClick} style={{ borderTopColor: POS_COLOR[c.pos] }}>
      {ribbon && <div className="ribbon">{ribbon}</div>}
      <div className="card-row"><PosBadge p={c.pos} /><span className="ovr">{c.ovr >= AUCTION_OVR ? <Gavel s={16} /> : null}{c.ovr}</span></div>
      <Face c={c} cls="face" />
      <div className="card-name">{c.unhappy && <><Ico k="sulk" s={14} /> </>}{c.n}</div>
      <div className="card-club">{c.club} · {c.age} let{c.rookie ? " · ROOKIE" : ""}{c.contract != null && <> · <Ico k="contract" s={12} style={{ verticalAlign: "-1px" }} />{c.contract} {c.contract === 1 ? "sezona" : "sez."}</>}</div>
      <div className="career" style={{ color: careerPhase(c.age).col }}>{careerPhase(c.age).ico} {careerPhase(c.age).label}</div>
      <div className="trait"><Ico k={c.tr} s={13} /> {TRAITS[c.tr].n}</div>
      {c.rookie
        ? <><div className="pot" style={{ color: ROOK_TIER[c.tier].col }}><Ico k={c.tier} s={13} /> {ROOK_TIER[c.tier].n} · potencial {c.potLow}–{c.potHigh}</div><div className="pot-job">{ROOK_TIER[c.tier].job}</div>{c.hook && HOOKS[c.hook] && <div className="pot-job" style={{ color: "#7a4fd0" }}>⭑ {HOOKS[c.hook].n}: {HOOKS[c.hook].d}</div>}</>
        : <div className="vals"><span className="val-chip">v peterki <b>{spts(c)}</b></span><span className="val-chip">klop {Math.floor(c.ovr / 2)}</span></div>}
      <div className="card-row btm">
        <span className="sal" title={c.deal ? "🔖 Ugodna pogodba — letos podcenjen" : undefined}>{c.deal ? "🔖 " : ""}{c.disc ? <><span className="oldsal">{c.origSal}</span> {c.sal} M$</> : `${c.sal} M$`}</span>
        <span className={"pm " + (c.pm >= 0 ? "pos" : "neg")}>vpliv {c.pm >= 0 ? "+" : ""}{c.pm}</span>
      </div>
      {stamped && <div className="stamp"><span>{stamped}</span></div>}
    </button>
  );
}

function Picks({ p, dark }) {
  return <span className={"picks" + (dark ? " dark" : "")}><Ico k="f" s={14} />×{p.f} <Ico k="s" s={14} />×{p.s} {p.w ? <><Ico k="w" s={14} />×1</> : null}</span>;
}

// gladko preštevanje številke proti cilju (Balatro count-up); spoštuje reduced-motion
function useTicker(target, dur = 500) {
  const [val, setVal] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    if (from.current === target) return;
    if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) { from.current = target; setVal(target); return; }
    const start = from.current, t0 = performance.now();
    let raf;
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(start + (target - start) * eased));
      if (p < 1) raf = requestAnimationFrame(step);
      else from.current = target;
    };
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); from.current = target; };
  }, [target, dur]);
  return val;
}

// 8-bit dvig pokala — dinastija (zmagal večino sezon)
function TrophyRaise() {
  const rows = [
    "  OOOOOOOO  ",
    " OHHGGGGGSO ",
    "OOSHGGGGGSOO",
    "OO GGGGGG OO",
    "OO SGGGGS OO",
    " O SGGGGS O ",
    "  OSGGGGSO  ",
    "   OGGGGO   ",
    "    OGGO    ",
    "    OGGO    ",
    "   OGGGGO   ",
    "  OGGGGGGO  ",
    "  OOOOOOOO  ",
  ];
  const col = { O: "#6b4e0e", G: "#F0B429", H: "#FFE39A", S: "#C6900F" };
  return (
    <div className="trophy-wrap" aria-hidden="true">
      <Confetti />
      <svg className="trophy-svg" viewBox="0 0 96 104" width="132" height="144" shapeRendering="crispEdges">
        {rows.flatMap((r, y) => r.split("").map((ch, x) => col[ch] ? <rect key={x + "-" + y} x={x * 8} y={y * 8} width="8" height="8" fill={col[ch]} /> : null))}
      </svg>
      {Array.from({ length: 6 }).map((_, i) => <span key={i} className="tspark" style={{ left: (8 + i * 16) + "%", top: (10 + (i % 3) * 22) + "%", animationDelay: (i * 0.28) + "s" }} />)}
    </div>
  );
}

// žoga, ki se vrti na obroču — tolažilna / ni večinske zmage
function BallRim() {
  return (
    <div className="rim-wrap" aria-hidden="true">
      <svg viewBox="0 0 120 120" width="132" height="132">
        <g className="ball-spin">
          <circle cx="60" cy="46" r="26" fill="#E4762B" stroke="#152744" strokeWidth="3" />
          <path d="M60 20v52 M34 46h52 M41 26c9 8 9 32 0 40 M79 26c-9 8-9 32 0 40" fill="none" stroke="#152744" strokeWidth="2.4" strokeLinecap="round" />
        </g>
        <path d="M30 78 h60" stroke="#F0B429" strokeWidth="6" strokeLinecap="round" />
        <path d="M32 81 l6 22 M48 81 l3 24 M60 81 v25 M72 81 l-3 24 M88 81 l-6 22" stroke="#e6ddc8" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M38 92 h44 M43 101 h34" stroke="#e6ddc8" strokeWidth="2" opacity=".8" />
      </svg>
    </div>
  );
}

function Confetti() {
  const cols = ["#F0B429", "#E4762B", "#2E7D32", "#7C3AED", "#F5EBDC", "#FF6B5E"];
  return (
    <div className="confetti" aria-hidden="true">
      {Array.from({ length: 22 }).map((_, i) => (
        <i key={i} style={{ left: Math.random() * 100 + "%", background: cols[i % cols.length], animationDuration: (1.6 + Math.random() * 1.1) + "s", animationDelay: (Math.random() * 0.6) + "s" }} />
      ))}
    </div>
  );
}

// vrstica razvoja rookieja z count-up (OVR se prešteje ob prikazu, s kaskadnim zamikom)
function DevRow({ d, i }) {
  const diff = d.to - d.from;
  const big = diff >= 12, bust = diff <= 3;
  const [v, setV] = useState(d.from);
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setV(d.to); return; }
    const t0 = performance.now(), dur = 650, delay = 220 + i * 110;
    let raf;
    const step = (t) => {
      const p = Math.max(0, Math.min(1, (t - t0 - delay) / dur));
      setV(Math.round(d.from + (d.to - d.from) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div className={"dev-row " + (big ? "boom" : bust ? "bust" : "")}>
      <span>{d.side === "h" ? "TI" : "AI"} · {d.via || (d.starter ? "★" : "klop")} {surname(d.n)}{d.sulk ? " 😤" : ""}</span>
      <b>{d.from} → {v} {big ? "💥" : bust ? "😐" : "↗"} ({diff >= 0 ? "+" : ""}{diff})</b>
    </div>
  );
}

function Scoreboard({ h, a, rosterH, rosterA }) {
  const prev = useRef({ h, a });
  const [d, setD] = useState({ h: 0, a: 0 });
  useEffect(() => {
    const dh = h - prev.current.h, da = a - prev.current.a;
    if (dh || da) {
      setD({ h: dh, a: da });
      prev.current = { h, a };
      const t = setTimeout(() => setD({ h: 0, a: 0 }), 2400);
      return () => clearTimeout(t);
    }
  }, [h, a]);
  const hDisp = useTicker(h), aDisp = useTicker(a);
  const lead = h - a;
  return (
    <div className="sb">
      <div className="sb-side">
        <div className="sb-team">TI</div>
        <div className="sb-num">{hDisp}{d.h !== 0 && <span className={"sb-delta " + (d.h > 0 ? "up" : "down")}>{d.h > 0 ? "+" : ""}{d.h}</span>}</div>
        <div className="sb-season">podpisani {rosterH}/10</div>
      </div>
      <div className="sb-mid">
        <div className="sb-lbl">PROJEKCIJA RUNDE</div>
        <div className={"sb-lead " + (lead >= 0 ? "up" : "down")}>{lead === 0 ? "izenačeno" : lead > 0 ? `vodiš za ${lead}` : `zaostajaš za ${-lead}`}</div>
        <div className="sb-note">v živo · brez kazni za roko</div>
      </div>
      <div className="sb-side">
        <div className="sb-team">AI GM</div>
        <div className="sb-num">{aDisp}{d.a !== 0 && <span className={"sb-delta " + (d.a > 0 ? "up" : "down")}>{d.a > 0 ? "+" : ""}{d.a}</span>}</div>
        <div className="sb-season">podpisani {rosterA}/10</div>
      </div>
    </div>
  );
}

function CapMeter({ salary, cap = CAP }) {
  const max = cap + 70;
  const pct = Math.min(100, (salary / max) * 100);
  const capPct = (cap / max) * 100;
  const apronPct = ((cap + APRON) / max) * 100;
  const over = salary > cap;
  const deep = salary > cap + APRON;
  const curCol = deep ? "#8f1d12" : over ? "#152744" : "#2E7D32";
  const sep = { color: "#b0a288", fontWeight: 500 };
  return (
    <div className="capm">
      <div className="capm-lbl"><span>Plačna masa</span><span title={`limit ${cap} M$ (nad njim −1/M) · apron ${cap + APRON} M$ (nad njim −2/M)`}><b style={{ color: curCol }}>{salary}</b><span style={sep}> / </span><span style={{ color: "#152744" }}>{cap}</span><span style={sep}> / </span><span style={{ color: "#8f1d12" }}>{cap + APRON}</span><span style={{ ...sep, color: "#8a7c63" }}> M$</span></span></div>
      <div className="capm-bar">
        <div className="capm-fill" style={{ width: pct + "%", background: deep ? "#8f1d12" : over ? "#D97706" : "#2E7D32" }} />
        <div className="capm-cap" style={{ left: capPct + "%" }} />
        <div className="capm-cap apron" style={{ left: apronPct + "%" }} />
      </div>
    </div>
  );
}

function BonusChips({ r, onExplain, coach }) {
  const chips = [];
  const coachExpl = coach ? ({
    lue: "🧢 Tyronn Lue: igralci z OVR 93+ štejejo 6 M$ manj v plačno maso.",
    thibs: "🧢 Tom Thibodeau: vsak 🛡️ branilec v prvi peterki → +4.",
    kerr: "🧢 Steve Kerr: Spacing bonus podvojen (+20), 🎯 snajperji na klopi štejejo 60 % OVR.",
    spo: "🧢 Erik Spoelstra: vsa klop šteje 60 % OVR, Moneyball prag 155 M$.",
    okc: "🧢 Mark Daigneault: dodaten 🥇 pick, v dražbah vsak tvoj pick +1.",
    jj: "🧢 J.J. Redick: vsak igralec ≤24 let v prvi peterki → +4; rookieji se razvijejo, kot da igrajo.",
  }[coach]) : "🧢 Coach bonus.";
  const labelFor = { feeder: "🅿️ Hranilec", cover: "🛡️ Kritje zvezdnika", jam: "🧨 Zastoji" };
  if (r.syn) r.syn.items.forEach((it) => chips.push([`${labelFor[it.k]}: ${it.who}`, it.pts, it.txt]));
  if (r.spacing) chips.push(["🎯 Spacing", r.spacing, "🎯 Spacing: 2+ snajperja (🎯) v prvi peterki → +10 (s coachem Kerr +20)."]);
  if (r.wall) chips.push(["🛡️ Zid", r.wall, "🛡️ Obrambni zid: 2+ branilca (🛡️) v prvi peterki → +10."]);
  if (r.dirigent) chips.push(["🧠 Dirigent", r.dirigent, "🧠 Dirigent: vsaj en organizator (🧠) v prvi peterki → +8."]);
  if (r.coachPts) chips.push(["🧢 Coach", r.coachPts, coachExpl]);
  if (r.sixthPts) chips.push([`🔥 ${surname(r.sixth.n)} s klopi`, r.sixthPts, `🔥 Šesti mož: najboljši 🔥 na klopi šteje poln OVR (namesto pol) IN doda svoj vpliv (${r.sixth.pm >= 0 ? "+" : ""}${r.sixth.pm}). ${surname(r.sixth.n)} skupaj doda ${r.sixthPts}.`]);
  if (r.leader) chips.push(["⭐ Vodja", r.leader, "⭐ Vodja: igralec z lastnostjo ⭐ kjerkoli v rosterju → +8."]);
  if (r.philLabel) chips.push([r.philLabel, r.philPts, `🧭 Franšizna filozofija: snowball na tvoji identiteti. Bolj ko ji slediš, več točk (${r.philLabel}).`]);
  if (r.hookPts) chips.push(["⭑ Kavlji prospektov", r.hookPts, (r.hookList || []).join(" · ") || "⭑ posebnosti tvojih draftanih prospektov"]);
  if (r.duoPts) chips.push([`🤝 Dvojci ×${Math.min(r.duoClubs.length, 3)}`, r.duoPts, `🤝 Klubski dvojci: 2 igralca iz istega kluba → +10 (do 3 dvojci). Tvoji: ${r.duoClubs.slice(0, 3).join(", ")}.`]);
  if (r.big3) chips.push(["👑 Big Three", r.big3, "👑 Big Three: 3+ igralci z OVR 90+ v rosterju → +20."]);
  if (r.superteam) chips.push(["🌟 SUPERTEAM", r.superteam, "🌟 Superteam: 3 štartarji z OVR 93+ v prvi peterki → +35."]);
  if (r.moneyball) chips.push(["💰 Moneyball", r.moneyball, `💰 Moneyball: poln roster (10 igralcev) pod pragom plač (${r.mbThr || 145} M$) → +25.`]);
  if (r.doncic) chips.push(["🇸🇮 Dončić", r.doncic, "🇸🇮 Dončić v prvi peterki → +5."]);
  if (r.pickPts) chips.push(["🥇 Neporabljeni picki", r.pickPts, `🥇 Neporabljeni picki ob koncu runde: vsak 🥇 +${PV.f}, vsak 🥈 +${PV.s}. Namig: pametno porabljen pick (popust na plačo, rehab, dražba) je pogosto vreden precej več kot točke v žepu.`]);
  if (r.tax) chips.push(["💸 Luksuzni davek", r.tax, `💸 Luksuzni davek: plačna masa nad limitom ${r.cap || CAP} M$ — prvih 20 M$ čez po −1/M, nato po −2/M (apron). Tvoja masa: ${r.payroll} M$.`]);
  if (r.stackPen) chips.push([`🚫 Preveč na poziciji (${r.stackPos.join(", ")})`, r.stackPen, `🚫 Prenatrpana pozicija: 3 igralci na isti poziciji (${r.stackPos.join(", ")}) → −15 vsaka. Ne kopiči poceni globine — raje razporedi 2-2-2-2-2 ali vzemi manj, boljših.`]);
  const [open, setOpen] = useState(false);
  const sum = chips.reduce((s, c) => s + c[1], 0);
  const keys = chips.map((c) => c[0]).join("|");
  const prevKeys = useRef(keys);
  const [pulse, setPulse] = useState(false);
  const fresh = new Set(chips.map((c) => c[0]).filter((k) => !prevKeys.current.split("|").includes(k))); // na novo sproženi bonusi
  useEffect(() => {
    if (keys !== prevKeys.current) {
      const gained = keys.split("|").some((k) => k && !prevKeys.current.split("|").includes(k));
      prevKeys.current = keys;
      if (gained) { setPulse(true); const t = setTimeout(() => setPulse(false), 800); return () => clearTimeout(t); }
    }
  }, [keys]);
  if (!chips.length) return <div className="chips-empty">Še brez aktivnih bonusov — lovi lastnosti, klube in kombinacije peterke.</div>;
  const noun = chips.length === 1 ? "postavka" : chips.length === 2 ? "postavki" : chips.length <= 4 ? "postavke" : "postavk";
  return (
    <>
      <button type="button" className={"drawer-btn" + (pulse ? " pulse" : "")} onClick={() => setOpen(!open)}>
        <span>🧾 Zakaj toliko točk? · {chips.length} {noun} ({sum >= 0 ? "+" : ""}{sum})</span>
        <span className="chev">{open ? "▲ skrij" : "▼ pokaži"}</span>
      </button>
      {open && <>
        <div className="chips-hint">👆 Tapni bonus za razlago točkovanja.</div>
        <div className="chips">{chips.map(([l, v, ex], i) => <button key={i} type="button" className={"chip" + (v < 0 ? " neg" : "") + (fresh.has(l) ? " flash" : "")} title={ex} onClick={() => onExplain && onExplain(ex)}>{l} {v > 0 ? "+" : ""}{v}</button>)}</div>
      </>}
    </>
  );
}

function UnlockPreview({ card, sCards }) {
  const ul = previewUnlocks(card, sCards);
  if (!ul.length) return null;
  return (
    <div className="unlocks">
      <div className="unlocks-hd">Kaj naredi tvoji peterki:</div>
      {ul.map((u, i) => <div key={i} className={"unlock " + (u.good ? "good" : "bad")}>{u.good ? "✨" : "⚠️"} {u.txt}</div>)}
    </div>
  );
}

function Breakdown({ name, r }) {
  const row = (l, v, hide) => hide ? null : <div className="brow"><span>{l}</span><b className={v < 0 ? "red" : ""}>{v > 0 ? "+" : ""}{v}</b></div>;
  return (
    <div className="bd">
      <div className="bd-title">{name}</div>
      {r.coach && <div style={{ fontSize: 12, color: "#7a6a4f", marginBottom: 6 }}><Ico k="cap" s={13} /> {coachOf(r.coach).n} — {coachOf(r.coach).t}</div>}
      <div className="bd-five">
        {POS.map((p) => (
          <div key={p} className="bd-slot">
            <PosBadge p={p} sm />
            {r.starters[p] ? <span><Ico k={r.starters[p].tr} s={13} /> {surname(r.starters[p].n)} <b>{spts(r.starters[p])}</b></span> : <span className="red">prazno −10</span>}
          </div>
        ))}
      </div>
      {row("Prva peterka", r.starterPts)}
      {r.syn && r.syn.items.map((it, i) => <div className="brow" key={"syn" + i}><span>{it.ico} {it.k === "feeder" ? "Hranilec" : it.k === "cover" ? "Kritje zvezdnika" : "Zastoji"}: {it.who}</span><b className={it.pts < 0 ? "red" : ""}>{it.pts > 0 ? "+" : ""}{it.pts}</b></div>)}
      {row("🎯 Spacing", r.spacing, !r.spacing)}
      {row("🛡️ Obrambni zid", r.wall, !r.wall)}
      {row("🧠 Dirigent", r.dirigent, !r.dirigent)}
      {row("🧢 Coach bonus", r.coachPts, !r.coachPts)}
      {row(`Klop (${r.bench.length})`, r.benchPts)}
      {row(`🔥 Šesti mož: ${r.sixth ? surname(r.sixth.n) : ""}`, r.sixthPts, !r.sixthPts)}
      {row("⭐ Vodja", r.leader, !r.leader)}
      {r.philLabel ? row(`🧭 ${r.philLabel}`, r.philPts) : null}
      {r.hookPts ? row("⭑ Kavlji prospektov", r.hookPts) : null}
      {row(`🤝 Dvojci (${r.duoClubs.slice(0, 3).join(", ") || "—"})`, r.duoPts, !r.duoPts)}
      {row("👑 Big Three", r.big3, !r.big3)}
      {row("🌟 Superteam (3 štartarji 93+)", r.superteam, !r.superteam)}
      {row(`💰 Moneyball (< ${r.mbThr} M$)`, r.moneyball, !r.moneyball)}
      {row("🇸🇮 Dončić v peterki", r.doncic, !r.doncic)}
      {row(`🥇 Neporabljeni picki${r.slot ? ` · ${r.slot.label}` : ""}`, r.pickPtsScaled != null ? r.pickPtsScaled : r.pickPts, !(r.pickPtsScaled != null ? r.pickPtsScaled : r.pickPts))}
      {r.deadCap ? <div className="brow"><span>✂️ Dead cap (odpuščeni)</span><b className="red">+{r.deadCap} M$</b></div> : null}
      {row(`💸 Luksuzni davek (${r.payroll} M$)`, r.tax, !r.tax)}
      {r.stackPen ? row(`🚫 Preveč na poziciji (${r.stackPos.join(", ")})`, r.stackPen) : null}
      {row(`Nepopoln roster (−${r.missR})`, r.missR * -20, !r.missR)}
      {row(`Prazne pozicije (${r.missPos})`, r.missPos * -10, !r.missPos)}
      {row(`Karte v roki (${r.handCount})`, r.handCount * -5, !r.handCount)}
      {row("Prvi zaključen roster", 20, !r.isFirst)}
      <div className="brow total"><span>SKUPAJ</span><b>{r.total}</b></div>
    </div>
  );
}

// ============ APLIKACIJA ============
// ============ ZVOK (Web Audio — sintetizirano, brez datotek) ============
const SFX = (() => {
  let ac = null, muted = false;
  try { muted = localStorage.getItem("fo-muted") === "1"; } catch {}
  const ctx = () => {
    if (typeof window === "undefined") return null;
    if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch { return null; } }
    if (ac.state === "suspended") ac.resume();
    return ac;
  };
  const noise = (a, dur) => { const n = Math.max(1, Math.floor(a.sampleRate * dur)); const b = a.createBuffer(1, n, a.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1; return b; };
  const tone = (a, t0, f0, f1, dur, amp, type = "sine") => { const o = a.createOscillator(); const g = a.createGain(); o.type = type; o.frequency.setValueAtTime(f0, t0); o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t0 + dur); g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(amp, t0 + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur); o.connect(g).connect(a.destination); o.start(t0); o.stop(t0 + dur + 0.02); };
  const burst = (a, t0, dur, type, freq, q, amp, ramp) => { const s = a.createBufferSource(); s.buffer = noise(a, dur); const f = a.createBiquadFilter(); f.type = type; f.frequency.setValueAtTime(freq, t0); if (ramp) f.frequency.exponentialRampToValueAtTime(ramp, t0 + dur); f.Q.value = q; const g = a.createGain(); g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(amp, t0 + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur); s.connect(f).connect(g).connect(a.destination); s.start(t0); s.stop(t0 + dur + 0.02); };
  return {
    isMuted: () => muted,
    toggle: () => { muted = !muted; try { localStorage.setItem("fo-muted", muted ? "1" : "0"); } catch {} if (!muted) SFX.card(); return muted; },
    gavel() { const a = ctx(); if (!a || muted) return; const t = a.currentTime; const knock = (t0) => { tone(a, t0, 190, 85, 0.13, 0.5); burst(a, t0, 0.03, "bandpass", 1400, 1, 0.35); }; knock(t); knock(t + 0.15); },        // leseno kladivo
    swish() { const a = ctx(); if (!a || muted) return; burst(a, a.currentTime, 0.24, "bandpass", 6500, 0.8, 0.32, 1400); }, // žoga skozi mrežico
    pen() { const a = ctx(); if (!a || muted) return; const t = a.currentTime; for (let i = 0; i < 5; i++) burst(a, t + i * 0.05 + Math.random() * 0.012, 0.045, "highpass", 2600, 0.7, 0.10 + Math.random() * 0.06); }, // kuli piše
    card() { const a = ctx(); if (!a || muted) return; burst(a, a.currentTime, 0.11, "bandpass", 1800, 1.2, 0.26, 4200); }, // karta v roko
    cheer() { const a = ctx(); if (!a || muted) return; const t = a.currentTime; const s = a.createBufferSource(); s.buffer = noise(a, 1.5); const f = a.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 1000; f.Q.value = 0.5; const g = a.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.4, t + 0.35); g.gain.setValueAtTime(0.4, t + 0.95); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.5); s.connect(f).connect(g).connect(a.destination); s.start(t); s.stop(t + 1.55); for (let i = 0; i < 2; i++) tone(a, t + 0.25 + i * 0.45, 1900 + i * 300, 2700 + i * 300, 0.22, 0.11); }, // tribune ob zmagi
    dribble() { const a = ctx(); if (!a || muted) return; const t = a.currentTime; let tt = t, gap = 0.36, amp = 0.42; for (let i = 0; i < 6; i++) { tone(a, tt, 170, 70, 0.12, amp); burst(a, tt, 0.025, "lowpass", 420, 0.5, amp * 0.55); tt += gap; gap *= 0.82; amp *= 0.83; } }, // tapkanje žoge ob porazu
    thanks() { const a = ctx(); if (!a || muted) return; const t = a.currentTime; [523.25, 659.25, 783.99].forEach((f, i) => tone(a, t + i * 0.1, f, f, 0.16, 0.24, "triangle")); }, // vljuden "hvala" ob waivu (C–E–G)
    thud() { const a = ctx(); if (!a || muted) return; const t = a.currentTime; tone(a, t, 120, 55, 0.1, 0.5); burst(a, t, 0.03, "lowpass", 300, 0.7, 0.3); }, // žig udari na papir
  };
})();

function Speaker({ on, s = 18 }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M4 9 h3 l4.2-3.2 v12.4 L7 15 H4 z" fill="#F5EBDC" stroke="#152744" strokeWidth="1.4" strokeLinejoin="round" />
      {on
        ? <><path d="M15 9.6 a3.4 3.4 0 0 1 0 4.8" stroke="#E4762B" strokeWidth="1.7" strokeLinecap="round" /><path d="M17.4 7.2 a6.8 6.8 0 0 1 0 9.6" stroke="#E4762B" strokeWidth="1.7" strokeLinecap="round" /></>
        : <path d="M15.2 9.2 l4.8 5.6 M20 9.2 l-4.8 5.6" stroke="#FF6B5E" strokeWidth="1.8" strokeLinecap="round" />}
    </svg>
  );
}

// ============ GLASBA (ozadje — HTMLAudio, ločeno od SFX, da efekti izstopajo) ============
const MUSIC = (() => {
  let el = null, enabled = true, started = false;
  try { enabled = localStorage.getItem("fo-music") !== "0"; } catch {}
  const TARGET = 0.06; // tiho ozadje, da sintetizirani SFX izrazito izstopajo
  const ensure = () => {
    if (typeof window === "undefined") return null;
    if (!el) { el = new Audio("/music.mp3"); el.loop = true; el.volume = 0; el.preload = "auto"; }
    return el;
  };
  const fade = (to, ms = 700) => {
    const a = ensure(); if (!a) return;
    const from = a.volume, t0 = performance.now();
    const step = (t) => { const k = Math.min(1, (t - t0) / ms); a.volume = Math.max(0, Math.min(1, from + (to - from) * k)); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };
  return {
    isOn: () => enabled,
    kick() { if (!enabled) return; const a = ensure(); if (!a) return; if (a.paused) a.play().then(() => { started = true; fade(TARGET); }).catch(() => {}); }, // ob prvi interakciji
    toggle() { enabled = !enabled; try { localStorage.setItem("fo-music", enabled ? "1" : "0"); } catch {} const a = ensure(); if (enabled) { a.play().then(() => { started = true; fade(TARGET); }).catch(() => {}); } else { fade(0, 400); setTimeout(() => { if (!enabled && el) el.pause(); }, 450); } return enabled; },
    duck() { if (enabled && started && el && !el.paused) { fade(0.02, 200); setTimeout(() => { if (enabled) fade(TARGET, 1400); }, 1700); } }, // umiri ob velikem trenutku (obračun)
  };
})();

function Note({ on, s = 18 }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M9 17.2 V6.4 L18 4.4 V15" stroke="#F5EBDC" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx="6.6" cy="17.4" rx="2.6" ry="2.1" fill={on ? "#E4762B" : "#F5EBDC"} stroke="#152744" strokeWidth="1.3" />
      <ellipse cx="15.6" cy="15.2" rx="2.6" ry="2.1" fill={on ? "#E4762B" : "#F5EBDC"} stroke="#152744" strokeWidth="1.3" />
      {!on && <path d="M4.5 4.5 L20 19.5" stroke="#FF6B5E" strokeWidth="1.8" strokeLinecap="round" />}
    </svg>
  );
}

export default function App() {
  const [screen, setScreen] = useState("menu");
  const [g, setG] = useState(null);
  const [sel, setSel] = useState(null);
  const [toast, setToast] = useState(null);
  const [showRules, setShowRules] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [introPage, setIntroPage] = useState(1);
  const [aiThinking, setAiThinking] = useState(false);
  const [bid, setBid] = useState({ f: 0, s: 0, w: 0 });
  const [trade, setTrade] = useState(null); // {give, get, f, s}
  const [reveal, setReveal] = useState(null); // karta, vlečena s skritega kupa
  const [flipped, setFlipped] = useState(false); // pack-opening: ali je razkrita karta že obrnjena
  const [stamp, setStamp] = useState(null); // { id, txt } — žig na sveže podpisani kartici
  const [bigStamp, setBigStamp] = useState(null); // velik žig čez ekran (TEMELJ FRANŠIZE)
  const [aucReveal, setAucReveal] = useState(null); // razplet dražbe (kuverti)
  const [aucStage, setAucStage] = useState(0); // 0 = tvoja kuverta, 1 = AI kuverta, 2 = udarec kladiva
  const [callModal, setCallModal] = useState(null); // { id } — igranje klica (potrditev / izbira tarče)
  const [injOffer, setInjOffer] = useState(null); // reakcija: tvoj igralec poškodovan + držiš 🛡️
  const [deadline, setDeadline] = useState(null); // ⏰ rok za prestope: { offers: [3 klici] }
  useEffect(() => {
    if (!reveal) { setFlipped(false); return; }
    setFlipped(false);
    const t = setTimeout(() => setFlipped(true), reveal.disc ? 250 : reveal.ovr >= 90 ? 1100 : 450); // 90+: zlati "tell" pred obratom
    return () => clearTimeout(t);
  }, [reveal]);
  useEffect(() => {
    if (!aucReveal) { setAucStage(0); return; }
    setAucStage(0);
    const t1 = setTimeout(() => setAucStage(1), 900);
    const t2 = setTimeout(() => setAucStage(2), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [aucReveal]);
  useEffect(() => { if (aucStage === 2 && aucReveal) { SFX.gavel(); } }, [aucStage, aucReveal]);
  const [rehab, setRehab] = useState(null); // poškodovan igralec za rehab
  const [waiveMode, setWaiveMode] = useState(false);
  const [waiveTarget, setWaiveTarget] = useState(null);
  const [inspect, setInspect] = useState(null); // {card, side} — info modal za igralca v rosterju
  const [aiOpen, setAiOpen] = useState(false); // razširjena AI ploščica
  const [logOpen, setLogOpen] = useState(false); // razširjen dnevnik (privzeto ticker)
  const [discOpen, setDiscOpen] = useState(false); // tvoj odpad — privzeto skrčen (večinoma te ne zanima)
  const [help, setHelp] = useState(null); // ⓘ pomoč za panel: 'kupi' | 'roster' | 'roka'
  const [signOpts, setSignOpts] = useState(null); // izbira ob podpisu: redna cena ali s pickom
  const [offInfo, setOffInfo] = useState(null); // ogled karte v prestopnem roku
  const [offseason, setOffseason] = useState(null); // prestopni rok med sezonami
  const [lbName, setLbName] = useState("");
  const [lbSaved, setLbSaved] = useState(false);
  const [leaderboard, setLeaderboard] = useState(null); // null = še ne naloženo
  const [counts, setCounts] = useState(null); // globalni števec igralcev/iger (null = ni na voljo)
  const [muted, setMuted] = useState(SFX.isMuted());
  const [music, setMusic] = useState(MUSIC.isOn());
  const [evt, setEvt] = useState(null); // medsezonska drama: { text, choices, stage, outcome }
  const [seenEvt, setSeenEvt] = useState([]); // odigrani dogodki te franšize (brez ponavljanja)
  const evtCarryRef = useRef(null); // učinki, ki se prenesejo v novo sezono (picki, poškodba, free agent)
  const prevAuc = useRef(false);
  useEffect(() => { const has = !!(g && g.auction); if (has && !prevAuc.current) SFX.gavel(); prevAuc.current = has; }, [g && g.auction]);
  const prevScreen = useRef(screen);
  useEffect(() => {
    if (screen === "score" && prevScreen.current !== "score" && g && g.result) {
      const win = g.franchise ? g.result.seasonWin === "h" : g.champion === "h";
      const lose = g.franchise ? g.result.seasonWin === "a" : g.champion === "a";
      if (win) { SFX.cheer(); MUSIC.duck(); } else if (lose) { SFX.dribble(); MUSIC.duck(); }
    }
    prevScreen.current = screen;
  }, [screen]);
  useEffect(() => { try { window.scrollTo({ top: 0 }); } catch { window.scrollTo(0, 0); } }, [screen]); // ob menjavi zaslona skoči na vrh (sicer score podeduje scroll s prejšnjega)
  useEffect(() => {
    // nova naprava → prištej igralca in si napravo zapomni; sicer samo preberi
    const isNew = !localStorage.getItem("fo-uid");
    const req = isNew
      ? fetch("/api/count", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "player" }) })
      : fetch("/api/count");
    req.then((r) => r.json()).then((d) => {
      if (d && d.ok) { setCounts(d); if (isNew) localStorage.setItem("fo-uid", String(Date.now())); }
    }).catch(() => {});
  }, []);
  const pingGame = () => { fetch("/api/count", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "game" }) }).catch(() => {}); };
  const loadLeaderboard = async () => {
    try { const r = await window.storage.get("fo-leaderboard"); setLeaderboard(r ? JSON.parse(r.value) : []); }
    catch { setLeaderboard([]); }
  };
  const saveToLeaderboard = async (name, pts, seasons, titles) => {
    try {
      let list = [];
      try { const r = await window.storage.get("fo-leaderboard"); list = r ? JSON.parse(r.value) : []; } catch { list = []; }
      list.push({ name, pts, seasons, t: `${titles.h}:${titles.a}`, d: new Date().toISOString().slice(0, 10) });
      list.sort((x, y) => y.pts - x.pts);
      list = list.slice(0, 25);
      await window.storage.set("fo-leaderboard", JSON.stringify(list));
      setLeaderboard(list); setLbSaved(true);
    } catch { say("Lestvice ni bilo mogoče shraniti (shramba nedosegljiva)."); }
  };
  const toastRef = useRef(null);

  const say = (m) => { setToast(m); clearTimeout(toastRef.current); toastRef.current = setTimeout(() => setToast(null), 3000); };

  const maybeAuctionStart = (st) => {
    const top = st.aDisc[st.aDisc.length - 1];
    if (top && top.ovr >= AUCTION_OVR) { setBid({ f: 0, s: 0, w: 0 }); return { ...st, revealAiBid: null, auction: { card: top, cont: "start" } }; }
    return st;
  };

  const start = () => { pingGame(); setG(freshRound(1, { h: 0, a: 0 })); setScreen("play"); setSel(null); setShowIntro(true); };
  const closeIntro = () => { setShowIntro(false); try { localStorage.setItem("fo-seen-intro", "1"); } catch {} };
  const startFranchise = (seasons) => { MUSIC.kick(); pingGame(); const infraOffer = ["trening", ...shuffle(INFRA_IDS.filter((k) => k !== "trening")).slice(0, 4)]; const g0 = freshSeason(1, { titles: { h: 0, a: 0 }, keepH: [], keepA: [], seasons, cum: { h: 0, a: 0 }, infraOffer }); const foundBoard = shuffle(g0.rookieClass || []).slice(0, 8); setG({ ...g0, founding: { board: foundBoard, hUsed: 0, aUsed: 0 }, log: [...g0.log, "🏗️ USTANOVNI NABOR: izberi 2 mlada temelja svoje franšize."] }); setScreen("founding"); setSel(null); setIntroPage(1); let seen = false; try { seen = !!localStorage.getItem("fo-seen-intro"); } catch {} setShowIntro(!seen); setLbSaved(false); setEvt(null); setSeenEvt([]); evtCarryRef.current = null; };
  const nextRound = () => { setG(freshRound(g.round + 1, g.totals)); setScreen("play"); setSel(null); };
  // ---- MEDSEZONSKA DRAMA ----
  const buildEvtCtx = () => {
    const r = g.h.roster;
    const rnd = (arr) => (arr.length ? arr[Math.floor(Math.random() * arr.length)] : null);
    return {
      roster: r, coach: g.h.coach, phil: g.philosophy && g.philosophy.h, picks: g.h.picks,
      won: g.result && g.result.seasonWin === "h", lost: g.result && g.result.seasonWin === "a",
      star: rnd(r.filter((c) => c.ovr >= 90)), rook: rnd(r.filter((c) => c.rookie)),
      vet: rnd(r.filter((c) => c.age >= 33)), young: rnd(r.filter((c) => c.age <= 23 && !c.rookie)),
      unhappyStar: rnd(r.filter((c) => c.unhappy)), shooter: rnd(r.filter((c) => c.tr === "SN")),
      leader: r.find((c) => c.tr === "VD") || null, overCap: effSalary(r, g.h.coach) > capFor(g.season),
      defender: rnd(r.filter((c) => c.tr === "BR")), playmaker: rnd(r.filter((c) => c.tr === "OR")),
      sixth: rnd(r.filter((c) => c.tr === "SM")), nonStar: rnd(r.filter((c) => c.ovr < 85)),
      any: rnd(r), any2: rnd(r), two: r.length >= 2, big: r.slice().sort((a, b) => b.ovr - a.ovr)[0] || null,
      season: g.season,
    };
  };
  const applyEventFx = (fxList) => {
    let roster = [...g.h.roster];
    const carry = { f: 0, s: 0, injureId: null, freeAgent: null };
    fxList.forEach((fx) => {
      const idx = fx.who ? roster.findIndex((c) => c.id === fx.who.id) : -1;
      if (fx.t === "pm" && idx >= 0) { const c = roster[idx]; roster[idx] = { ...c, pm: c.pm + fx.d, ...(c.basePm != null ? { basePm: c.basePm + fx.d } : {}) }; }
      else if (fx.t === "ovr" && idx >= 0) { const c = roster[idx]; roster[idx] = { ...c, ovr: Math.max(50, Math.min(99, c.ovr + fx.d)) }; }
      else if (fx.t === "trait" && idx >= 0) roster[idx] = { ...roster[idx], tr: fx.to };
      else if (fx.t === "calm" && idx >= 0) { const c = roster[idx]; const bp = c.basePm != null ? c.basePm : c.pm; const { unhappy: _u, basePm: _b, unhappyCause: _c, ...rest } = c; roster[idx] = { ...rest, pm: bp }; }
      else if (fx.t === "remove" && idx >= 0) roster.splice(idx, 1);
      else if (fx.t === "pick") { carry.f += fx.f || 0; carry.s += fx.s || 0; }
      else if (fx.t === "injury" && fx.who) carry.injureId = fx.who.id;
      else if (fx.t === "contract" && idx >= 0) { const c = roster[idx]; roster[idx] = { ...c, contract: (c.contract ?? 1) + fx.d }; }
      else if (fx.t === "freeAgent") carry.freeAgent = fx.range;
    });
    evtCarryRef.current = carry;
    setG({ ...g, h: { ...g.h, roster } });
  };
  const startOffseason = () => {
    if (!g.franchise) { goOffseason(); return; }
    const ctx = buildEvtCtx();
    const pool = EVENTS.filter((ev) => !seenEvt.includes(ev.id) && ev.req(ctx));
    if (!pool.length) { goOffseason(); return; }
    const total = pool.reduce((s, e) => s + (e.weight || 1), 0);
    let roll = Math.random() * total, ev = pool[0];
    for (const e of pool) { roll -= (e.weight || 1); if (roll <= 0) { ev = e; break; } }
    setSeenEvt([...seenEvt, ev.id]);
    SFX.card();
    setEvt({ stage: "choose", text: ev.text(ctx), choices: ev.choices.filter((ch) => !ch.req || ch.req(ctx)).map((ch) => ({ label: ch.label, sub: ch.sub, run: () => ch.resolve(ctx) })) });
  };
  const resolveEvent = (i) => {
    const out = evt.choices[i].run();
    applyEventFx(out.fx || []);
    setEvt({ ...evt, stage: "done", outcome: out.txt });
  };

  const goOffseason = () => {
    const R = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
    const ageReport = [];
    const ageRoster = (roster, coach, injuredId, side) => {
      const kept = [];
      const iZna = (g[side].infra && g[side].infra.znanost) || 0; // 🧬 Športna znanost
      roster.forEach((c) => {
        const age = c.age + 1;
        let d = 0;
        // mladih tu ne razvijamo (to počne večletni `grow` po progah); staranje veteranov je zdaj ostrejše, da kupljene zvezde hitreje zbledijo
        if (c.age <= 23) d = 0;                                                // razvoj mladih: glej grow (peterka/klop/poletna liga)
        else if (c.age <= 30) d = R(-1, 1);                                   // najboljša leta: skoraj stabilno
        else if (c.age <= 33) d = iZna >= 1 ? -R(1, 2) : -R(2, 3);            // pozna leta: znaten upad (L1 blažje)
        else d = iZna >= 2 ? -Math.ceil(R(3, 5) / 2) : -R(3, 5);              // veterani: hiter upad (L2 razpolovljen)
        const ovr = Math.max(50, Math.min(99, c.ovr + d));
        const retired = (age >= 34 && ovr < (iZna >= 3 ? 66 : 72)) || age >= 41; // L3: nižja upokojitvena meja
        if (Math.abs(d) >= 1 || retired) ageReport.push({ n: c.n, side, from: c.ovr, to: ovr, d, age, retired });
        if (!retired) kept.push({ ...c, age, ovr });
      });
      return kept;
    };
    const hAged = ageRoster(g.h.roster, g.h.coach, g.injured.h, "h");
    const aAged = ageRoster(g.a.roster, g.a.coach, g.injured.a, "a");
    const tick = (roster) => roster.map((c) => ({ ...c, contract: (c.contract ?? 1) - 1 }));
    const escalate = (c) => { const base = Math.round(c.sal * ESCALATE); return { ...c, sal: c.rookie ? Math.max(base, Math.round(marketSal(c.ovr) * ROOKIE_SCALE)) : base }; };
    const hT = tick(hAged), aT = tick(aAged);
    const hExp = hT.filter((c) => c.contract <= 0), hKeepAuto = hT.filter((c) => c.contract > 0).map(escalate);
    const aExp = aT.filter((c) => c.contract <= 0), aKeepAuto = aT.filter((c) => c.contract > 0).map(escalate);
    let aRoster = [...aKeepAuto];
    // AI podaljšuje po vrednosti pri NOVI plači, starejši morajo preseči višji prag, masa ostane pod globokim davkom
    aExp.map((c) => ({ c, ns: resignSal(c), vNew: val({ ...c, sal: resignSal(c) }) })).sort((x, y) => y.vNew - x.vNew).forEach(({ c, ns, vNew }) => {
      const bar = c.age >= 34 ? 74 : c.age >= 30 ? 70 : 64;
      if (vNew >= bar && effSalary([...aRoster, { ...c, sal: ns }], g.a.coach) <= capFor(g.season + 1) + Math.round(APRON / 2)) aRoster.push({ ...c, sal: ns, contract: c.age >= 30 ? 1 : 2 });
    });
    // vrnitev iz poletne lige: mladi, ki so bili lani "zunaj", se postarajo (razvoj so dobili v grow) in so spet na voljo za odločitev
    const agePlus = (c) => ({ ...c, age: c.age + 1 });
    const hSummer = (g.h.summer || []).map(agePlus);
    const aSummer = (g.a.summer || []).map(agePlus);
    // "HOČEM VEN": nezadovoljni prek fita — zakopan zvezdnik, zastoj, zvezdnik po porazu
    // vzroki se OCENIJO PONOVNO vsak prestopni rok — po OSNOVNEM vplivu (basePm), da prejšnja kazen ne ustvari začaranega kroga
    const bpm = (c) => (c.basePm != null ? c.basePm : c.pm);
    const hBase = hAged.map((c) => ({ ...c, pm: bpm(c) }));
    const starterIdsH = new Set(Object.values(bestStarters(hBase.length ? hBase : [], g.h.coach, null)));
    const ballDom = hBase.filter((c) => isBallDom(c)).length;
    const lostSeason = g.result && g.result.seasonWin === "a";
    const unhappy = [];
    hBase.forEach((c) => {
      if (c.ovr >= 85 && !starterIdsH.has(c.id)) unhappy.push({ id: c.id, ovr: c.ovr, cause: "bench", why: "zakopan na klopi (zvezdnik brez minut)" });
      else if (ballDom >= 3 && isBallDom(c) && c.ovr >= 88) unhappy.push({ id: c.id, ovr: c.ovr, cause: "jam", why: "🧨 zastoj — preveč ball-dominantnih, hoče svojo ekipo" });
      else if (lostSeason && c.ovr >= 92 && c.age >= 28) unhappy.push({ id: c.id, ovr: c.ovr, cause: "loss", why: "poraz sezone — zvezdnik v najboljših letih izgublja potrpljenje" });
    });
    unhappy.sort((x, y) => y.ovr - x.ovr).splice(2); // max 2 naenkrat (najvišja OVR)
    const evtP = evtCarryRef.current || {};
    // 🧱 žetev neporabljenih pickov ob vstopu v prestopni rok (spendable takoj na infrastrukturi); kapica 4
    const harvest = (p) => Math.min(4, (p.f || 0) * 2 + (p.s || 0) * 1);
    const hHarvest = harvest(g.h.picks), aHarvest = harvest(g.a.picks);
    // AI gradi infrastrukturo pohlepno po vrednosti/ceni (razvojne linije vredne več, ko je še veliko sezon)
    const aiBuildInfra = (infra0, sklad0) => {
      const infra = { ...infra0 }; let budget = sklad0; const remain = (g.seasons || 3) - g.season;
      const base = { trening: 10 + remain * 3, akademija: 6 + remain * 3, medicinski: 7, znanost: 6, navijaci: 8, legende: 7 };
      for (let guard = 0; guard < 10; guard++) {
        let best = null, bestV = 0;
        (g.infraOffer || ["trening"]).forEach((id) => {
          const lvl = infra[id] || 0; if (lvl >= 3) return;
          const cost = INFRA_COST[lvl + 1]; if (cost > budget) return;
          const v = (base[id] || 5) / cost; if (v > bestV) { bestV = v; best = id; }
        });
        if (!best) break;
        const lvl = infra[best] || 0; infra[best] = lvl + 1; budget -= INFRA_COST[lvl + 1];
      }
      return { infra, sklad: budget };
    };
    const aiPost = aiBuildInfra(g.a.infra || {}, (g.a.sklad || 0) + aHarvest);
    setG({ ...g, h: { ...g.h, sklad: (g.h.sklad || 0) + hHarvest }, a: { ...g.a, sklad: aiPost.sklad, infra: aiPost.infra } });
    const nextRule = LEAGUE_IDS[Math.floor(Math.random() * LEAGUE_IDS.length)]; // 📋 pravilo lige NASLEDNJE sezone (razkrito zdaj)
    setOffseason({ hExp, hKeepAuto, aRoster, ageReport, hSummer, aSummer, summerSel: {}, unhappy, sold: {}, bonusPicks: { f: evtP.f || 0, s: evtP.s || 0 }, harvest: hHarvest, nextRule, decisions: Object.fromEntries(hExp.map((c) => [c.id, true])) });
    setScreen("offseason");
  };
  const sellPriceOf = (c) => c.ovr >= 92 ? { f: 2, s: 1 } : c.ovr >= 85 ? { f: 1, s: 1 } : { f: 0, s: 2 };
  const sellUnhappy = (c) => {
    const p = sellPriceOf(c);
    setOffseason({
      ...offseason,
      sold: { ...offseason.sold, [c.id]: true },
      bonusPicks: { f: offseason.bonusPicks.f + p.f, s: offseason.bonusPicks.s + p.s },
      hKeepAuto: offseason.hKeepAuto.filter((x) => x.id !== c.id),
      hExp: offseason.hExp.filter((x) => x.id !== c.id),
    });
    say(`${surname(c.n)} prodan v tujino za ${p.f ? p.f + "×🥇 " : ""}${p.s ? p.s + "×🥈" : ""} — odide v Evropo (ne k AI!), picki pridejo naslednjo sezono.`);
  };
  const upgradeInfra = (id) => {
    const cur = (g.h.infra && g.h.infra[id]) || 0;
    if (cur >= 3) return;
    const cost = INFRA_COST[cur + 1];
    if ((g.h.sklad || 0) < cost) { say(`Za nadgradnjo rabiš ${cost}× 🧱 (imaš ${g.h.sklad || 0}).`); return; }
    SFX.pen();
    setG({ ...g, h: { ...g.h, sklad: g.h.sklad - cost, infra: { ...(g.h.infra || {}), [id]: cur + 1 } } });
    say(`🏗️ ${INFRA[id].n} → raven ${cur + 1}: ${INFRA[id].d[cur]}`);
  };
  const finalizeOffseason = () => {
    const resigned = offseason.hExp.filter((c) => offseason.decisions[c.id]).map((c) => ({ ...c, sal: resignSal(c), contract: c.age >= 30 ? 1 : 2 }));
    const unhappyIds = new Set((offseason.unhappy || []).filter((u) => !offseason.sold[u.id]).map((u) => u.id));
    const causeById = {}; (offseason.unhappy || []).forEach((u) => { if (!offseason.sold[u.id]) causeById[u.id] = u.cause; });
    const morale = (c) => {
      const basePm = c.basePm != null ? c.basePm : c.pm;
      if (unhappyIds.has(c.id)) return { ...c, basePm, pm: Math.min(-4, basePm - 8), unhappy: true, unhappyCause: causeById[c.id] }; // sveža kazen iz osnove (brez kopičenja)
      if (c.unhappy || c.basePm != null) { const { unhappy: _u, basePm: _b, unhappyCause: _c, ...rest } = c; return { ...rest, pm: basePm }; } // vzrok odpravljen → povrni vpliv, odstrani 😤
      return c;
    };
    // vsi človeški obdržani + vrnjeni iz poletne lige; poletna liga vs roster po summerSel
    const summerSel = offseason.summerSel || {};
    const allH = [...offseason.hKeepAuto, ...resigned, ...(offseason.hSummer || [])].map(morale);
    const keptH = allH.filter((c) => !summerSel[c.id]);
    const keepSummerH = allH.filter((c) => summerSel[c.id]);
    // AI: mladce brez mesta/premlade pošlje v poletno ligo (roster poln in ovr občutno pod klop-mejo)
    const allA = [...offseason.aRoster, ...(offseason.aSummer || [])];
    const aYoungStash = new Set();
    const aRosterCount = allA.filter((c) => !(c.age <= 23 && c.ovr < 74)).length;
    allA.forEach((c) => { if (c.age <= 23 && (c.th ?? c.potHigh ?? 0) > c.ovr && c.ovr < 74 && aRosterCount >= 9) aYoungStash.add(c.id); });
    const keptA = allA.filter((c) => !aYoungStash.has(c.id));
    const keepSummerA = allA.filter((c) => aYoungStash.has(c.id));
    let ns = freshSeason(g.season + 1, { titles: g.titles, keepH: keptH, keepA: keptA, keepSummerH, keepSummerA, seasons: g.seasons, cum: g.cum, seasonLog: g.seasonLog, bonusPicks: offseason.bonusPicks, philosophy: g.philosophy, skladH: g.h.sklad || 0, skladA: g.a.sklad || 0, infraH: g.h.infra || {}, infraA: g.a.infra || {}, infraOffer: g.infraOffer, callsH: g.h.calls || [], callsA: g.a.calls || [], ownerBase: g.ownerBase || null, leagueRule: offseason.nextRule });
    ns = { ...ns, rehabUsed: g.rehabUsed || { h: false, a: false } }; // rehab popust velja enkrat na franšizo, ne na sezono
    // preneseni učinki medsezonske drame: poškodba na startu / free agent v roki
    const evtP = evtCarryRef.current || {};
    if (evtP.injureId && ns.h.roster.some((c) => c.id === evtP.injureId)) {
      const inj = ns.h.roster.find((c) => c.id === evtP.injureId);
      ns = { ...ns, injured: { ...ns.injured, h: evtP.injureId }, log: [...ns.log, `🩹 ${inj.n} začne sezono poškodovan (posledice poletja).`] };
    }
    if (evtP.freeAgent) {
      const fi = ns.deck.findIndex((c) => c.ovr >= evtP.freeAgent[0] && c.ovr <= evtP.freeAgent[1]);
      if (fi >= 0) { const card = ns.deck[fi]; ns = { ...ns, deck: [...ns.deck.slice(0, fi), ...ns.deck.slice(fi + 1)], h: { ...ns.h, hand: [...ns.h.hand, card] }, log: [...ns.log, `📞 ${card.n} pride na priprave — v tvoji roki.`] }; }
    }
    evtCarryRef.current = null;
    setG(ns);
    setOffseason(null); setScreen("play"); setSel(null);
    say(`Sezona ${g.season + 1}! ${keepSummerH.length ? `${keepSummerH.map((c) => surname(c.n)).join(", ")} v poletni ligi (počasen razvoj, ni na voljo). ` : ""}Cap te stiska — mladi so poceni.`);
  };

  const pickPhilosophy = (id) => {
    const others = PHILOS.filter((p) => p.id !== id);
    // AI izbere filozofijo po fitu OBDRŽANEGA jedra (sezona 2+); prazen roster → naključno (raznolikost)
    const r = g.a.roster;
    const fitP = { trojke: r.filter(isShooter).length * 2, obramba: r.filter(isDefender).length * 2, razvoj: r.filter((c) => c.age <= 24).length * 2, zvezde: r.filter((c) => c.ovr >= 90).length * 3 };
    const aiP = r.length ? [...others].sort((x, y) => (fitP[y.id] || 0) - (fitP[x.id] || 0) || Math.random() - 0.5)[0].id : others[Math.floor(Math.random() * others.length)].id;
    setG({ ...g, philosophy: { h: id, a: aiP }, log: [...g.log, `🧭 Filozofija: TI — ${philOf(id).n}, rival — ${philOf(aiP).n}.`] });
    say(`Filozofija: ${philOf(id).n}. Rival gradi ${philOf(aiP).n}.`);
  };

  const pickCoach = (id) => {
    const others = COACHES.filter((c) => c.id !== id);
    // AI izbere coacha po fitu rosterja + svoje filozofije; prazen roster → naključno
    const r = g.a.roster, aiPh = g.philosophy && g.philosophy.a;
    const fitC = {
      kerr: r.filter(isShooter).length * 3 + (aiPh === "trojke" ? 4 : 0),
      thibs: r.filter(isDefender).length * 3 + (aiPh === "obramba" ? 4 : 0),
      jj: r.filter((c) => c.age <= 24).length * 3 + (aiPh === "razvoj" ? 4 : 0),
      lue: r.filter((c) => c.ovr >= 93).length * 4 + (aiPh === "zvezde" ? 3 : 0),
      spo: r.filter((c) => c.ovr < 85).length,
      okc: 2,
    };
    const aiC = r.length ? [...others].sort((x, y) => (fitC[y.id] || 0) - (fitC[x.id] || 0) || Math.random() - 0.5)[0].id : others[Math.floor(Math.random() * others.length)].id;
    const h = { ...g.h, coach: id, picks: { ...g.h.picks, f: g.h.picks.f + (id === "okc" ? 1 : 0) } };
    const a = { ...g.a, coach: aiC, picks: { ...g.a.picks, f: g.a.picks.f + (aiC === "okc" ? 1 : 0) } };
    setG(maybeAuctionStart({ ...g, h, a, log: [...g.log, `🧢 Coacha: TI — ${coachOf(id).n} (${coachOf(id).t}), AI — ${coachOf(aiC).n} (${coachOf(aiC).t}).`] }));
    say(`Tvoj coach: ${coachOf(id).n}. AI vodi ${coachOf(aiC).n}.`);
  };

  const endRound = (state) => {
    const R = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
    // večletni razvoj mladih: raste proti stropu vsako sezono, dokler je mlad (≤23) in pod stropom.
    // proga določa hitrost: ★ peterka (najhitreje) > 🎓 klop (srednje) > ☀️ poletna liga (najpočasneje, a sprosti mesto)
    const dev = [];
    const grow = (roster, summer, coach, injuredId, side, starterMap, infra) => {
      // človek: minute štejejo po DEJANSKI peterki (tvoja izbira razvija mladca); AI: najboljša peterka
      const starterIds = starterMap
        ? new Set(Object.values(starterMap).filter((id) => id != null && id !== injuredId))
        : new Set(Object.values(bestStarters(roster, coach, injuredId)));
      const hasVD = roster.some((x) => x.tr === "VD");
      // 🏗️ infrastruktura: Trening center (hitrejše proge, kavelj 2×), Akademija (razvojna doba, poletna liga 2×), Hiša legend L3 (mentor za elite)
      const iTren = (infra && infra.trening) || 0, iAka = (infra && infra.akademija) || 0, iLeg = (infra && infra.legende) || 0;
      const ageMax = 23 + (iAka >= 2 ? 2 : iAka >= 1 ? 1 : 0);
      const lrMul = state.leagueRule === "mladina" ? 1.2 : 1; // 📋 Mladinsko pravilo: +20 % razvoj
      const pFac = (1 + (iTren >= 2 ? 0.3 : 0)) * lrMul, kFac = (1 + (iTren >= 1 ? 0.4 : 0)) * lrMul, sFac = (iAka >= 3 ? 2 : 1) * lrMul;
      const growCard = (c, lane) => {
        const ceil = c.th ?? c.potHigh, gap = (ceil ?? 0) - c.ovr;
        if (!(c.rookie && c.age <= ageMax && gap > 0)) return c; // ni več v razvoju
        const mentored = coach === "jj" || (c.tier === "proj" && hasVD) || (iLeg >= 3 && c.tier === "elite"); // mentor = polne minute tudi s klopi
        const eff = lane === "klop" && mentored ? "peterka" : lane;
        let s;
        if (eff === "peterka") s = Math.max(2, R(Math.round(gap * 0.45), Math.round(gap * 0.7))) * pFac;
        else if (eff === "klop") s = Math.max(1, R(Math.round(gap * 0.18), Math.round(gap * 0.4))) * kFac;
        else s = R(1, Math.max(2, Math.round(gap * 0.12))) * sFac; // poletna liga — občutno počasneje
        if (c.hook === "raketa" && eff === "peterka") s += R(0, Math.round(gap * 0.2)); // ⭑ Raketa
        if (c.hook === "ucenec") s += 2; // ⭑ Učenec
        if ((c.hook === "raketa" || c.hook === "ucenec") && iTren >= 3) s *= 2; // 🏋️ L3: kavelj šteje dvojno
        const to = Math.min(ceil, c.ovr + Math.round(s));
        const sulk = c.tier === "elite" && lane === "klop" && eff !== "peterka"; // 💎 na klopi brez minut → 😤 (ne velja mentor/poletna liga)
        dev.push({ n: c.n, from: c.ovr, to, side, starter: eff === "peterka" && lane !== "summer", via: lane === "summer" ? "☀️" : eff === "peterka" ? "★" : "🎓", sulk });
        let upd = { ...c, ovr: to };
        if (sulk) upd = { ...upd, pm: Math.min(-4, c.pm - 8), unhappy: true };
        return upd;
      };
      return {
        roster: roster.map((c) => growCard(c, starterIds.has(c.id) ? "peterka" : "klop")),
        summer: (summer || []).map((c) => growCard(c, "summer")),
      };
    };
    const hg = grow(state.h.roster, state.h.summer, state.h.coach, state.injured.h, "h", state.h.starters, state.h.infra);
    const ag = grow(state.a.roster, state.a.summer, state.a.coach, state.injured.a, "a", null, state.a.infra);
    const st = { ...state, h: { ...state.h, roster: hg.roster, summer: hg.summer }, a: { ...state.a, roster: ag.roster, summer: ag.summer } };
    const seasonCap = capFor(st.season);
    const hs = scoreRoster(st.h.roster, st.h.hand.length, st.finisher === "h", st.h.starters, st.h.picks, st.h.coach, st.injured.h, st.h.deadCap, st.philosophy && st.philosophy.h, seasonCap, infraScoreBonus(st.h, st.h.roster));
    const as = scoreRoster(st.a.roster, st.a.hand.length, st.finisher === "a", null, st.a.picks, st.a.coach, st.injured.a, 0, st.philosophy && st.philosophy.a, seasonCap, infraScoreBonus(st.a, st.a.roster));
    // slot-vrednost pickov: slabša ekipa dobi dragocenejše (višje) picke
    const hBase = baseStrOf(hs), aBase = baseStrOf(as);
    const hSlot = slotTier(aBase - hBase), aSlot = slotTier(hBase - aBase);
    hs.slot = hSlot; as.slot = aSlot;
    hs.pickPtsScaled = Math.round(hs.pickPts * hSlot.mult); as.pickPtsScaled = Math.round(as.pickPts * aSlot.mult);
    hs.total += hs.pickPtsScaled - hs.pickPts; as.total += as.pickPtsScaled - as.pickPts;
    if (st.franchise) {
      const seasonWin = hs.total === as.total ? null : hs.total > as.total ? "h" : "a";
      const titles = { h: st.titles.h + (seasonWin === "h" ? 1 : 0), a: st.titles.a + (seasonWin === "a" ? 1 : 0) };
      const cum = { h: (st.cum ? st.cum.h : 0) + hs.total, a: (st.cum ? st.cum.a : 0) + as.total };
      const seasonLog = [...(st.seasonLog || []), { s: st.season, h: hs.total, a: as.total, w: seasonWin }];
      // 🧱 SKLAD prihodek ob koncu sezone: rezultat + Moneyball + razviti temelji (≥+4 OVR)
      const skladGain = (side, sc) => {
        let g2 = seasonWin === side ? 3 : seasonWin === null ? 2 : 1; // zmaga/izenačeno/poraz
        if (sc.moneyball) g2 += 1;
        g2 += dev.filter((d) => d.side === side && d.to - d.from >= 4).length; // vsak temelj z resnim skokom
        if (st.leagueRule === "bogata") g2 += 2; // 📋 Bogata liga
        return g2;
      };
      let hGain = skladGain("h", hs); const aGain = skladGain("a", as);
      // 👔 Pričakovanja lastnika: cilj = tvoj rezultat S1 × 1.12^(sezona−1). Dosežen → +2🧱 +klic; zgrešen → lastnik obreže proračun (−1🧱).
      const ownerBase = st.season === 1 ? hs.total : (st.ownerBase || hs.total);
      const ownerTarget = st.season >= 2 ? Math.round(ownerBase * Math.pow(1.12, st.season - 1)) : null;
      let ownerMet = null, ownerNote = "";
      let hCalls = st.h.calls || [];
      if (ownerTarget != null) {
        ownerMet = hs.total >= ownerTarget;
        if (ownerMet) { hGain += 2; if (hCalls.length < 3) hCalls = [...hCalls, randCall()]; ownerNote = `👔 Lastnik zadovoljen (cilj ${ownerTarget}): +2🧱${hCalls.length <= 3 ? " + klic" : ""}.`; }
        else { hGain = Math.max(0, hGain - 1); ownerNote = `👔 Lastnik razočaran (cilj ${ownerTarget}, dosegel ${hs.total}): −1🧱, obrezan proračun.`; }
      }
      const nh = { ...st.h, sklad: (st.h.sklad || 0) + hGain, calls: hCalls };
      const na = { ...st.a, sklad: (st.a.sklad || 0) + aGain };
      setG({ ...st, h: nh, a: na, ownerBase, result: { hs, as, dev, seasonWin, skladGain: hGain, ownerTarget, ownerMet, ownerNote }, totals: { h: hs.total, a: as.total }, titles, cum, seasonLog, log: ownerNote ? [...st.log, ownerNote] : st.log });
      setScreen("score");
      return;
    }
    const totals = { h: st.totals.h + hs.total, a: st.totals.a + as.total };
    const champion = totals.h >= TARGET || totals.a >= TARGET ? (totals.h === totals.a ? "tie" : totals.h > totals.a ? "h" : "a") : null;
    setG({ ...st, result: { hs, as, dev }, totals, champion });
    setScreen("score");
  };

  const postAi = (ns, isFinal) => {
    if (ns.endNow) { endRound(ns); return; }
    if (isFinal) { endRound(ns); return; }
    let offerInj = null; // ☎️ ponudi 🛡️ Zavarovanje, če je tvoj igralec poškodovan in klic držiš
    // 🩺 Medicinski L3: tvoj poškodovanec se ob koncu poteze sam pozdravi
    if (ns.injured.h && (ns.h.infra && ns.h.infra.medicinski) >= 3) {
      const inj = ns.h.roster.find((c) => c.id === ns.injured.h);
      ns = { ...ns, injured: { ...ns.injured, h: null }, log: [...ns.log, `🏗️ Medicinski center: ${inj ? surname(inj.n) : "igralec"} se je sam pozdravil.`] };
    }
    // 🩹 naključna poškodba (12 % po vsakem krogu; 📋 Pravilo lige lahko spremeni stopnjo)
    const injRate = ns.leagueRule === "koledar" ? 0.18 : ns.leagueRule === "zdrava" ? 0.06 : 0.12;
    if (!ns.finisher && Math.random() < injRate) {
      const pool = [];
      if (!ns.injured.h) ns.h.roster.forEach((c) => pool.push(["h", c]));
      if (!ns.injured.a) ns.a.roster.forEach((c) => pool.push(["a", c]));
      if (pool.length) {
        const [side, c] = pool[Math.floor(Math.random() * pool.length)];
        if (side === "h" && (ns.h.infra && ns.h.infra.medicinski) >= 2 && Math.random() < 0.5) { /* 🏗️ Medicinski L2: −50 % tveganja — poškodba preprečena */ }
        else {
        let h = ns.h;
        if (side === "h" && ns.h.starters[c.pos] === c.id) {
          const starters = { ...ns.h.starters };
          const alt = ns.h.roster.filter((x) => x.pos === c.pos && x.id !== c.id).sort((x, y) => spts(y) - spts(x))[0];
          if (alt) starters[c.pos] = alt.id; else delete starters[c.pos];
          h = { ...ns.h, starters };
        }
        ns = { ...ns, h, injured: { ...ns.injured, [side]: c.id }, log: [...ns.log, `🩹 POŠKODBA: ${c.n} (${side === "h" ? "TVOJ" : "AI-jev"} igralec) do konca runde ne more v prvo peterko. Rehab stane ${rehabCostFor(ns, side)}× 🥈.`] };
        say(`🩹 Poškodba: ${c.n} (${side === "h" ? "tvoj igralec!" : "AI-jev igralec"})`);
        if (side === "h" && ns.h.calls.includes("zavarovanje")) offerInj = c;
        }
      }
    }
    if (ns.a.roster.length >= 10 && !ns.finisher) {
      ns = { ...ns, finisher: "a", finalFor: "h", banner: "AI je zaključil roster — to je tvoja ZADNJA poteza!", log: [...ns.log, "AI: »Roster zaključen!«"] };
    }
    // ⏰ ROK ZA PRESTOPE: ko prvi GM doseže 8/10 rosterja (enkrat na sezono). AI simetrično dobi klic.
    let openDeadline = null;
    if (g.franchise && !ns.deadlineDone && !ns.finisher && (ns.h.roster.length >= 8 || ns.a.roster.length >= 8)) {
      ns = { ...ns, deadlineDone: true, a: { ...ns.a, calls: (ns.a.calls || []).length < 3 ? [...ns.a.calls, randCall()] : ns.a.calls }, log: [...ns.log, "⏰ ROK ZA PRESTOPE — agencije kličejo!"] };
      openDeadline = { offers: [randCall(), randCall(), randCall()] };
    }
    setG({ ...ns, discountNext: 0, callTurnUsed: 0, h: { ...ns.h, tradeUsed: false, signedTurn: 0 }, turn: "h", phase: "draw" });
    if (offerInj) setInjOffer({ card: offerInj });
    if (openDeadline) setDeadline(openDeadline);
  };

  const runAi = (state, isFinal) => {
    setAiThinking(true);
    setG({ ...state, banner: null });
    setTimeout(() => {
      const ns = aiPlay(state);
      setAiThinking(false);
      const dc = ns.discardedCard;
      if (!ns.endNow && dc && dc.ovr >= AUCTION_OVR) {
        setBid({ f: 0, s: 0, w: 0 });
        setG({ ...ns, revealAiBid: null, auction: { card: dc, cont: "aiEnd", isFinal } });
        return;
      }
      postAi(ns, isFinal);
    }, 1500);
  };

  // ---- DRAŽBA ----
  const paySwap = (winner, loser) => {
    // zmagovalčev najboljši preostali pick gre poražencu, poraženčev najslabši zmagovalcu
    const w = { ...winner }, l = { ...loser };
    if (w.f > 0) { w.f--; l.f++; } else if (w.s > 0) { w.s--; l.s++; }
    if (l.s > 0) { l.s--; w.s++; } else if (l.f > 0) { l.f--; w.f++; }
    return [w, l];
  };

  const resolveAuction = (humanBid) => {
    const au = g.auction;
    const card = au.card;
    if (!card) { setG({ ...g, auction: null }); return; }
    const rm = { hDisc: g.hDisc.filter((c) => c.id !== card.id), aDisc: g.aDisc.filter((c) => c.id !== card.id) };
    const hCan = canSign(g.h.roster, card);
    const hB = hCan && humanBid ? humanBid : { f: 0, s: 0, w: 0 };
    const aB = aiBidFor(card, g);
    const hV = bidValC(hB, g.h.coach), aV = bidValC(aB, g.a.coach);
    let ns = { ...g, auction: null };
    const logs = [`⚖️ DRAŽBA za ${card.n}: ti ${pickStr(hB)} (${hV}) proti AI ${pickStr(aB)} (${aV}).`];
    if (hV > aV && hV > 0) {
      let hp = { f: g.h.picks.f - hB.f, s: g.h.picks.s - hB.s, w: g.h.picks.w - hB.w };
      let ap = { ...g.a.picks };
      if (hB.w) [hp, ap] = paySwap(hp, ap);
      const starters = { ...g.h.starters };
      if (!starters[card.pos]) starters[card.pos] = card.id;
      ns = { ...ns, ...rm, h: { ...g.h, roster: [...g.h.roster, g.franchise && card.contract == null ? { ...card, contract: contractFor(card) } : card], starters, picks: hp }, a: { ...g.a, picks: ap } };
      logs.push(`✅ ZMAGAL SI DRAŽBO — ${card.n} je tvoj!`);
    } else if (aV > hV && aV > 0) {
      let ap = { f: g.a.picks.f - aB.f, s: g.a.picks.s - aB.s, w: g.a.picks.w - aB.w };
      let hp = { ...g.h.picks };
      if (aB.w) [ap, hp] = paySwap(ap, hp);
      ns = { ...ns, ...rm, a: { ...g.a, roster: [...g.a.roster, g.franchise && card.contract == null ? { ...card, contract: contractFor(card) } : card], picks: ap }, h: { ...g.h, picks: hp } };
      logs.push(`❌ IZGUBIL SI DRAŽBO — ${card.n} gre AI-ju (ponudil ${aV} proti tvojim ${hV}).`);
    } else {
      logs.push(`⚖️ Nihče ni dal dovolj — ${card.n} ostaja prost na trgu.`);
    }
    ns = { ...ns, log: [...ns.log, ...logs] };
    const winner = hV > aV && hV > 0 ? "h" : aV > hV && aV > 0 ? "a" : null;
    setAucReveal({ card, hB, aB, hV, aV, winner, ns, cont: au.cont, isFinal: au.isFinal }); // razplet v treh taktih (kuverti → kladivo)
  };
  const aucFinish = () => {
    const r = aucReveal;
    if (!r) return;
    setAucReveal(null);
    let ns = r.ns;
    // ☎️ tolažba ob IZGUBLJENI dražbi (z neničelno ponudbo): agent ti ostane dolžan uslugo → nov klic
    if (r.winner === "a" && r.hV > 0 && (ns.h.calls || []).length < 3) {
      const nc = randCall();
      ns = { ...ns, h: { ...ns.h, calls: [...ns.h.calls, nc] }, log: [...ns.log, `☎️ Tolažba: izgubil si dražbo, a agent ti dolguje uslugo — klic »${CALLS[nc].n}« v Rolodex.`] };
      say(`☎️ Tolažilni klic: ${CALLS[nc].n}!`);
    }
    if (r.winner === "h" && r.aV > 0 && (ns.a.calls || []).length < 3) { ns = { ...ns, a: { ...ns.a, calls: [...ns.a.calls, randCall()] } }; } // AI simetrična tolažba
    if (r.cont === "start" || r.cont === "resume") setG(ns);
    else if (r.cont === "hDiscard") finishTurn(ns);
    else if (r.cont === "aiEnd") postAi(ns, r.isFinal);
  };

  // ---- ČLOVEŠKE AKCIJE ----
  const withSigned = (h, c) => {
    const card = g.franchise && c.contract == null ? { ...c, contract: contractFor(c) } : c;
    const starters = { ...h.starters };
    if (!starters[card.pos]) starters[card.pos] = card.id;
    return { ...h, hand: h.hand.filter((x) => x.id !== card.id), roster: [...h.roster, card], starters };
  };

  const drawDeck = () => {
    let { deck, hDisc, aDisc, reshuffled } = g;
    if (deck.length === 0) {
      if (!reshuffled && (hDisc.length + aDisc.length) > 0) { deck = shuffle([...hDisc, ...aDisc]); hDisc = []; aDisc = []; reshuffled = true; say("Odpadi premešani nazaj v skriti kup."); }
      else { endRound(g); return; }
    }
    const c = deck[deck.length - 1];
    SFX.card();
    setG({ ...g, deck: deck.slice(0, -1), hDisc, aDisc, reshuffled, h: { ...g.h, hand: [...g.h.hand, c] }, phase: "action", log: [...g.log, `S skritega kupa si vlekel: ${c.n}.`] });
    setSel(c.id);
    setReveal(c);
  };

  // vzameš karto iz AI-jevega odpada s popustom (−25 % plače)
  const takeMarket = (card) => {
    const disc = asDiscount(card);
    SFX.card();
    setG({ ...g, aDisc: g.aDisc.filter((c) => c.id !== card.id), h: { ...g.h, hand: [...g.h.hand, disc] }, phase: "action", log: [...g.log, `Iz AI-jevih odpuščenih si vzel ${card.n} s popustom (${disc.sal} M$ namesto ${card.origSal}).`] });
    setSel(card.id);
    setReveal(disc);
  };

  // ustanovni nabor: prospekt gre naravnost v roster kot temelj franšize; AI odgovori z lastnim izborom (P, A, P, A)
  const mkFounder = (c) => {
    let card = { ...c, contract: 3, developed: false };
    if (c.tier === "safe") { const to = Math.round((c.tl ?? c.potLow) + Math.random() * ((c.th ?? c.potHigh) - (c.tl ?? c.potLow))); card = { ...card, ovr: to, developed: true }; } // 🔒 pride pripravljen
    return card;
  };
  const foundingPick = (c) => {
    const fb = g.founding;
    if (!fb || fb.hUsed >= 2) return;
    let board = fb.board.filter((x) => x.n !== c.n);
    const hRoster = [...g.h.roster, mkFounder(c)];
    let aRoster = [...g.a.roster];
    let aUsed = fb.aUsed;
    const gone = [c.n];
    const logs = [`🏗️ Temelj ${fb.hUsed + 1}/2: draftal si ${c.n} (${ROOK_TIER[c.tier].n}).`];
    if (aUsed < 2 && board.length) {
      const ai = board.filter((p) => p.tier !== "safe").sort((x, y) => (y.potLow + y.potHigh) - (x.potLow + x.potHigh))[0] || board[0];
      board = board.filter((x) => x.n !== ai.n);
      aRoster = [...aRoster, mkFounder(ai)];
      aUsed += 1;
      gone.push(ai.n);
      logs.push(`🤖 Nasprotnik je vzel ${ai.n}.`);
    }
    const hUsed = fb.hUsed + 1;
    const goneSet = new Set(gone);
    SFX.pen();
    setBigStamp("TEMELJ FRANŠIZE");
    setTimeout(() => SFX.thud(), 150);
    setTimeout(() => setBigStamp(null), 1100);
    setG({ ...g, h: { ...g.h, roster: hRoster }, a: { ...g.a, roster: aRoster }, rookieClass: (g.rookieClass || []).filter((x) => !goneSet.has(x.n)), founding: { board, hUsed, aUsed }, log: [...g.log, ...logs] });
    say(`Temelj ${hUsed}/2: ${surname(c.n)} je tvoj. ${hUsed >= 2 ? "Naprej na trg — zgradi okoli njiju." : "Izberi še enega."}`);
  };

  const PICK_DISC = { f: 14, s: 6 }; // olajšava plače ob podpisu s pickom (M$)
  const sign = (discKind) => {
    const c0 = g.h.hand.find((x) => x.id === sel);
    if (!c0) return;
    if ((g.h.signedTurn || 0) >= SIGN_LIMIT) { say(`Omejitev: največ ${SIGN_LIMIT} podpisa na potezo. Odvrzi karto za konec poteze — ali špekuliraj naslednjič.`); return; }
    if (!canSign(g.h.roster, c0)) {
      const emptyP = POS.filter((p) => p !== c0.pos && !g.h.roster.some((x) => x.pos === p));
      const msg = g.h.roster.length >= 10 ? "Roster je poln (10)."
        : posCount(g.h.roster, c0.pos) >= 3 ? `Že 3 igralci na poziciji ${c0.pos}.`
        : `Ne moreš — ostati mora prostor za manjkajoče pozicije: ${emptyP.join(", ")}. Za zaključek rabiš vsaj 1 igralca na vsaki poziciji.`;
      say(msg); return;
    }
    let c = c0, picks = g.h.picks;
    if (discKind) {
      if ((discKind === "f" ? g.h.picks.f : g.h.picks.s) < 1) { say(`Nimaš ${discKind === "f" ? "🥇" : "🥈"} picka za popust.`); return; }
      const newSal = Math.max(2, c0.sal - PICK_DISC[discKind]);
      c = { ...c0, sal: newSal, origSal: c0.origSal ?? c0.sal, disc: true };
      picks = { ...g.h.picks, [discKind]: g.h.picks[discKind] - 1 };
      say(`${surname(c0.n)} podpisan s ${discKind === "f" ? "🥇" : "🥈"} pickom: ${c0.sal} → ${newSal} M$ (cap olajšava).`);
    }
    const logs = [`Podpisal si: ${c0.n}${discKind ? ` (popust s ${discKind === "f" ? "🥇" : "🥈"} pickom)` : ""}.`];
    if (g.discountNext) { const ns2 = Math.max(2, c.sal - g.discountNext); logs.push(`💸 Prišepnjen popust: ${c.sal} → ${ns2} M$.`); c = { ...c, sal: ns2, origSal: c.origSal ?? c0.sal, disc: true }; }
    if (c.rookie && c.tier === "safe" && !c.developed) {
      const to = Math.round((c.tl ?? c.potLow) + Math.random() * ((c.th ?? c.potHigh) - (c.tl ?? c.potLow)));
      logs.push(`🔒 ${c.n} je NBA-pripravljen: takoj zaigra z OVR ${to} (prej ${c.ovr}).`);
      say(`🔒 ${surname(c.n)} je takoj pripravljen: OVR ${c.ovr} → ${to}!`);
      c = { ...c, ovr: to, developed: true };
    }
    SFX.pen();
    setG({ ...g, discountNext: 0, h: { ...withSigned(g.h, c), picks, signedTurn: (g.h.signedTurn || 0) + 1 }, log: [...g.log, ...logs] });
    setSel(null);
    setStamp({ id: c.id, txt: "PODPISANO" });
    setTimeout(() => SFX.thud(), 180);
    setTimeout(() => setStamp(null), 1200);
  };

  const discard = () => {
    const c = g.h.hand.find((x) => x.id === sel);
    if (!c) return;
    const ns = { ...g, hDisc: [...g.hDisc, c], h: { ...g.h, hand: g.h.hand.filter((x) => x.id !== c.id) }, log: [...g.log, `Odpustil si: ${c.n} (AI ga lahko vzame s popustom).`] };
    SFX.swish();
    setSel(null);
    if (c.ovr >= AUCTION_OVR) { setBid({ f: 0, s: 0, w: 0 }); setG({ ...ns, revealAiBid: null, auction: { card: c, cont: "hDiscard" } }); return; }
    finishTurn(ns);
  };

  // ☎️ odigraj klic iz Rolodexa. reaction klici (zavarovanje/zadnja) se igrajo v svojem oknu, ne od tod.
  const callEligible = (id) => {
    if (id === "drbine" || id === "zavarovanje") return !!g.injured.h;
    if (id === "kava") return g.h.roster.some((c) => c.unhappy);
    if (id === "aneks") return g.h.roster.length > 0;
    return true;
  };
  const playCall = (id, target) => {
    if (!g.h.calls.includes(id)) return;
    if ((g.callTurnUsed || 0) >= 1 && CALLS[id].kind !== "reaction") { say("Na potezo lahko odigraš le 1 klic."); return; }
    const rmCall = (gg) => ({ ...gg, h: { ...gg.h, calls: gg.h.calls.filter((x, i) => i !== gg.h.calls.indexOf(id)) }, callTurnUsed: (gg.callTurnUsed || 0) + 1 });
    let ng = rmCall(g), msg = "";
    if (id === "drbine") { if (!g.injured.h) { say("Nisi poškodovan."); return; } ng = { ...ng, injured: { ...ng.injured, h: null } }; msg = "🩺 Dr. Bine: tvoj igralec je spet zdrav."; }
    else if (id === "usluga") { ng = { ...ng, h: { ...ng.h, calls: ng.h.calls, picks: { ...ng.h.picks, s: ng.h.picks.s + 1 } } }; msg = "🥈 Usluga iz lige: +1× 🥈 pick."; }
    else if (id === "popust") { ng = { ...ng, discountNext: 8 }; msg = "💸 Naslednji podpis to potezo bo −8 M$."; }
    else if (id === "hitra") { if (!g.deck.length) { say("Kup je prazen."); return; } const [card, ...rest] = g.deck; ng = { ...ng, deck: rest, h: { ...ng.h, hand: [...ng.h.hand, card] } }; msg = `⚡ Hitra poteza: potegnil si ${surname(card.n)} v roko.`; setSel(card.id); }
    else if (id === "kava") { if (!target) { setCallModal({ id }); return; } const { unhappy: _u, basePm: _b, unhappyCause: _c, ...rest } = target; ng = { ...ng, h: { ...ng.h, roster: ng.h.roster.map((c) => c.id === target.id ? { ...rest, pm: target.basePm != null ? target.basePm : target.pm } : c) } }; msg = `😌 ${surname(target.n)} je spet zadovoljen.`; }
    else if (id === "aneks") { if (!target) { setCallModal({ id }); return; } ng = { ...ng, h: { ...ng.h, roster: ng.h.roster.map((c) => c.id === target.id ? { ...c, contract: (c.contract ?? 1) + 1 } : c) } }; msg = `🖋️ ${surname(target.n)}: pogodba +1 leto.`; }
    else if (id === "neznana") { const r = Math.random(); if (r < 0.15) { msg = "☎️ Klic v prazno — nič se ni zgodilo."; } else if (r < 0.5) { ng = { ...ng, h: { ...ng.h, picks: { ...ng.h.picks, s: ng.h.picks.s + 2 } } }; msg = "☎️ Skrivni pokrovitelj: +2× 🥈 pick!"; } else if (r < 0.8) { ng = { ...ng, discountNext: 12 }; msg = "☎️ Zveza na vrhu: naslednji podpis −12 M$."; } else { const u = g.h.roster.find((c) => c.unhappy); if (u) { const { unhappy: _u, basePm: _b, unhappyCause: _c, ...rest } = u; ng = { ...ng, h: { ...ng.h, roster: ng.h.roster.map((c) => c.id === u.id ? { ...rest, pm: u.basePm != null ? u.basePm : u.pm } : c) } }; msg = `☎️ Skrivni mediator: ${surname(u.n)} pomirjen.`; } else { ng = { ...ng, h: { ...ng.h, picks: { ...ng.h.picks, f: ng.h.picks.f + 1 } } }; msg = "☎️ Zlati stik: +1× 🥇 pick!"; } } }
    SFX.card();
    setCallModal(null);
    setG({ ...ng, log: [...ng.log, msg] });
    say(msg);
  };

  const resolveDeadline = (choice) => {
    if (choice === "sklad") { setG({ ...g, h: { ...g.h, sklad: (g.h.sklad || 0) + 2 }, log: [...g.log, "⏰ Rok za prestope: vzel si +2🧱 v sklad."] }); say("⏰ +2🧱 v sklad."); setDeadline(null); return; }
    if ((g.h.calls || []).length >= 3) { setG({ ...g, h: { ...g.h, sklad: (g.h.sklad || 0) + 2 }, log: [...g.log, "⏰ Rolodex poln — namesto klica +2🧱."] }); say("Rolodex poln — dobil si +2🧱."); setDeadline(null); return; }
    SFX.card();
    setG({ ...g, h: { ...g.h, calls: [...g.h.calls, choice] }, log: [...g.log, `⏰ Rok za prestope: v Rolodex si vzel »${CALLS[choice].n}«.`] });
    say(`☎️ ${CALLS[choice].n} v Rolodex!`);
    setDeadline(null);
  };

  const finishTurn = (ns) => {
    if (ns.finalFor === "h") { endRound(ns); return; }
    if (ns.h.roster.length >= 10 && !ns.finisher) {
      runAi({ ...ns, finisher: "h", finalFor: "a", log: [...ns.log, "TI: »Roster zaključen!« AI ima še eno potezo."] }, true);
      return;
    }
    runAi({ ...ns, turn: "a" }, false);
  };

  const setStarter = (c) => {
    if (waiveMode) { setWaiveTarget(c); return; }
    if (g.injured.h === c.id) { setRehab(c); return; }
    const starters = { ...g.h.starters, [c.pos]: c.id };
    const { roster, freed } = reEvalMorale(g.h.roster, starters);
    setG({ ...g, h: { ...g.h, roster, starters } });
    say(`★ ${surname(c.n)} je zdaj štartar na ${c.pos}.` + (freed.length ? ` 😊 ${freed.join(", ")} spet zadovoljen — vzrok odpravljen.` : ""));
  };
  const optimize = () => { setG({ ...g, h: { ...g.h, starters: bestStarters(g.h.roster, g.h.coach, g.injured.h) } }); say("Peterka optimizirana."); };

  const deadFor = (c) => Math.max(3, Math.ceil(c.sal / 4));
  const doWaive = () => {
    const c = waiveTarget;
    const dead = deadFor(c);
    const roster = g.h.roster.filter((x) => x.id !== c.id);
    const starters = { ...g.h.starters };
    if (starters[c.pos] === c.id) {
      const alt = roster.filter((x) => x.pos === c.pos && g.injured.h !== x.id).sort((x, y) => spts(y) - spts(x))[0];
      if (alt) starters[c.pos] = alt.id; else delete starters[c.pos];
    }
    const injured = g.injured.h === c.id ? { ...g.injured, h: null } : g.injured;
    const rem = reEvalMorale(roster, starters);
    let ns = { ...g, hDisc: [...g.hDisc, c], injured, h: { ...g.h, roster: rem.roster, starters, deadCap: (g.h.deadCap || 0) + dead }, log: [...g.log, `✂️ WAIVE: odpustil si ${c.n} (AI ga lahko vzame s popustom) — dead cap +${dead} M$ do konca runde.`, ...(rem.freed.length ? [`😊 ${rem.freed.join(", ")} spet zadovoljen — vzrok nezadovoljstva odpravljen.`] : [])] };
    SFX.thanks();
    setWaiveTarget(null); setWaiveMode(false);
    if (c.ovr >= AUCTION_OVR) { setBid({ f: 0, s: 0, w: 0 }); setG({ ...ns, revealAiBid: null, auction: { card: c, cont: "resume" } }); return; }
    // obupan izhod: po waivu potegneš 1 karto iz skritega kupa (npr. loviš manjkajočo pozicijo)
    if (ns.deck.length > 0) {
      const drawn = ns.deck[ns.deck.length - 1];
      ns = { ...ns, deck: ns.deck.slice(0, -1), h: { ...ns.h, hand: [...ns.h.hand, drawn] }, log: [...ns.log, `Po waivu si iz kupa potegnil: ${drawn.n}.`] };
      setG(ns); setSel(drawn.id); setReveal(drawn);
      say(`✂️ ${surname(c.n)} odpuščen (dead cap +${dead} M$). Iz kupa si potegnil ${surname(drawn.n)}.`);
    } else {
      setG(ns);
      say(`✂️ ${surname(c.n)} odpuščen. Dead cap +${dead} M$. (Kup je prazen — brez nove karte.)`);
    }
  };

  const heal = () => {
    const rc = rehabCostFor(g, "h");
    if (g.h.picks.s < rc) { say(`Nimaš ${rc}× 🥈 picka za rehab.`); setRehab(null); return; }
    setG({ ...g, injured: { ...g.injured, h: null }, rehabUsed: { ...(g.rehabUsed || { h: false, a: false }), h: true }, h: { ...g.h, picks: { ...g.h.picks, s: g.h.picks.s - rc } }, log: [...g.log, `Rehab: ${rehab.n} je spet zdrav (porabljeno ${rc}× 🥈).`] });
    say(`💪 ${surname(rehab.n)} je spet zdrav!`);
    setRehab(null);
  };

  // ---- TREJD ----
  const openTrade = () => setTrade({ give: null, get: null, f: 0, s: 0 });
  const submitTrade = () => {
    const give = g.h.roster.find((c) => c.id === trade.give);
    const get = g.a.roster.find((c) => c.id === trade.get);
    if (!give || !get) { say("Izberi svojega in AI-jevega igralca."); return; }
    const hOk = posCount(g.h.roster.filter((c) => c.id !== give.id), get.pos) < 3;
    const aOk = posCount(g.a.roster.filter((c) => c.id !== get.id), give.pos) < 3;
    const hAfter = [...g.h.roster.filter((c) => c.id !== give.id), get];
    const hEmpty = POS.filter((p) => !hAfter.some((c) => c.pos === p));
    const coversOk = hEmpty.length <= (10 - hAfter.length);
    let verdict, accepted = false;
    if (trade.f > 0 && g.h.picks.f - trade.f < 1) verdict = `Stepien pravilo: obdržati moraš vsaj en 🥇 1.-krogni pick — ne moreš se »prodati do golega«.`;
    else if (!hOk) verdict = `Ne gre: na poziciji ${get.pos} bi imel več kot 3 igralce.`;
    else if (!coversOk) verdict = `Ne gre: s tem bi ostal brez pokrite pozicije ${hEmpty.join(", ")} in je ne bi mogel več zapolniti.`;
    else if (!aOk) verdict = `AI zavrne: na poziciji ${give.pos} bi imel več kot 3 igralce.`;
    else {
      // AI oceni trejd po DELTI CELOTNE ocene svojega rosterja (fit, sinergije, davek), ne po surovi vrednosti karte
      const aiPhilT = g.philosophy && g.philosophy.a, capT = capFor(g.season);
      const before = aiStrOf(g.a.roster, g.a.picks, g.a.coach, g.injured.a, aiPhilT, capT);
      const after = aiStrOf([...g.a.roster.filter((c) => c.id !== get.id), give], { ...g.a.picks, f: g.a.picks.f + trade.f, s: g.a.picks.s + trade.s }, g.a.coach, g.injured.a, aiPhilT, capT);
      accepted = after >= before + 4;
      verdict = accepted ? `AI sprejme trejd!` : `AI zavrne: menjava ne izboljša njegove ekipe (${get.n} mu v postavi pomeni več). Dodaj picke ali boljšega igralca.`;
    }
    let ns = { ...g, h: { ...g.h, tradeUsed: true }, log: [...g.log, `TREJD ponudba: ${give.n} + ${pickStr({ f: trade.f, s: trade.s, w: 0 })} za ${get.n} → ${accepted ? "SPREJETO" : "ZAVRNJENO"}.`] };
    if (accepted) {
      const hRoster = [...g.h.roster.filter((c) => c.id !== give.id), get];
      const aRoster = [...g.a.roster.filter((c) => c.id !== get.id), give];
      const starters = { ...g.h.starters };
      if (starters[give.pos] === give.id) { const alt = hRoster.filter((c) => c.pos === give.pos).sort((x, y) => spts(y) - spts(x))[0]; if (alt) starters[give.pos] = alt.id; else delete starters[give.pos]; }
      if (!starters[get.pos] || !hRoster.find((c) => c.id === starters[get.pos])) starters[get.pos] = get.id;
      const rem = reEvalMorale(hRoster, starters);
      if (rem.freed.length) { verdict += ` 😊 ${rem.freed.join(", ")} spet zadovoljen.`; ns = { ...ns, log: [...ns.log, `😊 ${rem.freed.join(", ")} spet zadovoljen — vzrok nezadovoljstva odpravljen.`] }; }
      ns = { ...ns, h: { ...ns.h, roster: rem.roster, starters, picks: { ...g.h.picks, f: g.h.picks.f - trade.f, s: g.h.picks.s - trade.s } }, a: { ...g.a, roster: aRoster, picks: { ...g.a.picks, f: g.a.picks.f + trade.f, s: g.a.picks.s + trade.s } } };
    }
    setG(ns);
    setTrade(null);
    say(verdict);
  };

  // ============ CSS ============
  const css = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Barlow+Condensed:wght@500;600;700&display=swap');
      .fo * { box-sizing: border-box; margin: 0; }
      .fo { font-family:'Barlow Condensed','Arial Narrow',Arial,sans-serif; min-height:100vh; color:#1d2433;
        background:#dcc296 url('/img/tex-karton-v1.jpg'); background-size:420px; } /* prava kartonska tekstura (ChatGPT) */
      .wrap { max-width:520px; margin:0 auto; padding:10px 10px 92px; }
      .hdr { background-color:#152744; background-image:radial-gradient(rgba(255,255,255,.07) 1px, transparent 1.5px); background-size:7px 7px; color:#F5EBDC; border-radius:12px; padding:10px 14px; display:flex; justify-content:space-between; align-items:center; box-shadow:0 3px 0 #0c1830; }
      .hdr h1 { font-family:'Archivo Black','Arial Black',sans-serif; font-size:17px; letter-spacing:1px; }
      .hdr .sub { font-size:12px; opacity:.75; }
      .sklad-chip { background:#3a2a5c; color:#F0B429; font-weight:800; font-size:13px; padding:2px 8px; border-radius:8px; white-space:nowrap; }
      .score-strip { display:flex; gap:10px; font-size:15px; font-weight:700; text-align:center; }
      .score-strip b { color:#F0B429; font-size:18px; display:block; }
      .panel { background:linear-gradient(180deg,#fffdf7,#faf5e8); border-radius:12px; padding:10px; margin-top:10px; box-shadow: inset 0 1px 0 #fff, 0 2px 6px rgba(20,25,40,.15), 0 1px 0 #d8cdb8; }
      .lbl { font-size:12px; text-transform:uppercase; letter-spacing:1.2px; color:#7a6a4f; font-weight:700; margin-bottom:6px; }
      .hint { font-size:13px; color:#6d5f45; margin-bottom:6px; line-height:1.35; }
      .posb { color:#fff; font-weight:700; font-size:12px; padding:1px 6px; border-radius:4px; }
      .posb.sm { font-size:10px; padding:0 4px; }
      .picks { font-size:13px; font-weight:700; background:#f2e9d4; border-radius:8px; padding:2px 8px; }
      .picks.dark { background:#2a3f66; color:#F5EBDC; }
      .card { position:relative; width:112px; min-width:112px; background:#fff; border:1px solid #d8cdb8; border-top:5px solid; border-radius:10px;
        padding:7px 8px; text-align:left; cursor:pointer; transition:transform .12s, box-shadow .12s; font-family:inherit; }
      .card.sel { transform:translateY(-8px); box-shadow:0 6px 14px rgba(20,25,40,.3); outline:3px solid #E4762B; }
      .card.dim { opacity:.45; }
      .card:focus-visible, .mini:focus-visible { outline:3px solid #E4762B; }
      .ribbon { position:absolute; top:-9px; right:6px; background:#E4762B; color:#fff; font-size:10px; font-weight:700; padding:1px 6px; border-radius:6px; }
      .card-row { display:flex; justify-content:space-between; align-items:center; }
      .card-row.btm { margin-top:4px; }
      .ovr { font-family:'Archivo Black','Arial Black',sans-serif; font-size:18px; color:#152744; }
      .card-name { font-weight:700; font-size:14px; line-height:1.1; margin-top:4px; min-height:30px; }
      .face { display:block; width:54px; height:54px; border-radius:50%; object-fit:cover; object-position:center top; margin:5px auto 0; background:#eee6d2; border:2px solid #e0d5bc; }
      .mini-face { width:16px; height:16px; border-radius:50%; object-fit:cover; object-position:center top; vertical-align:-3px; margin-right:3px; background:#eee6d2; display:inline-block; }
      .card-club { font-size:12px; color:#8a7c63; }
      .trait { font-size:12px; font-weight:700; color:#4a4232; background:#f2e9d4; border-radius:5px; padding:1px 5px; margin-top:3px; display:inline-block; }
      .career { font-size:10.5px; font-weight:800; letter-spacing:.4px; margin-top:2px; }
      .vals { font-size:11.5px; color:#215c26; background:#e7f3e7; border-radius:5px; padding:1px 5px; margin-top:3px; font-weight:700; display:flex; flex-wrap:wrap; column-gap:9px; }
      .val-chip { white-space:nowrap; }
      .sal { font-weight:700; color:#8a6d1a; font-size:13px; }
      .oldsal { text-decoration:line-through; color:#b3a37e; font-weight:600; font-size:11px; }
      .pot { font-size:11px; font-weight:700; margin-top:2px; }
      .pot-job { font-size:10.5px; color:#6d5f45; line-height:1.25; margin-top:1px; }
      .dev-box { margin-top:12px; background:#0e1c33; border-radius:12px; padding:12px 14px; }
      .dev-hd { color:#F0B429; font-weight:800; letter-spacing:1px; font-size:13px; margin-bottom:8px; }
      .dev-row { display:flex; justify-content:space-between; align-items:center; font-size:14px; color:#e8eefc; padding:4px 0; border-bottom:1px solid #1c2f4d; }
      .dev-row b { font-variant-numeric:tabular-nums; }
      .dev-row.boom b { color:#7ED77E; }
      .dev-row.bust b { color:#FF8A7A; }
      .dev-note { font-size:11px; color:#8ea3c4; margin-top:8px; }
      .addbox { margin-top:10px; background:#eef4ff; border:1px solid #c9d8f2; border-radius:10px; padding:8px 12px; }
      .addval { font-size:15px; font-weight:800; color:#1c3d6e; }
      .addval .red { color:#b23b2e; }
      .addstand { font-size:12px; color:#5a6b85; margin-top:2px; }
      .pm { font-weight:700; font-size:13px; } .pm.pos{color:#2E7D32;} .pm.neg{color:#C0392B;}
      .hand { display:flex; gap:8px; overflow-x:auto; padding:8px 2px 10px; }
      .mini { position:relative; width:102px; background:#fff; border:1px solid #d8cdb8; border-top:4px solid; border-radius:8px; padding:6px 7px; font-size:12px; text-align:left; cursor:pointer; font-family:inherit; }
      .mini.starter { box-shadow:0 0 0 2.5px #F0B429; background:#fffaea; }
      .mini.msel { outline:3px solid #E4762B; }
      .mini-top { display:flex; justify-content:space-between; align-items:center; }
      .mini-top b { font-size:16px; }
      .mini-name { font-weight:700; font-size:13px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; margin-top:2px; }
      .mini-sal { color:#8a6d1a; font-size:11px; margin-top:1px; }
      .mini-pts { font-size:11px; font-weight:700; color:#4a4232; }
      .mini.starter .mini-pts { color:#8a6d1a; }
      .mini-promote { display:block; margin-top:5px; padding-top:4px; border-top:1px dashed #d8cdb8; font-size:10.5px; font-weight:700; letter-spacing:.3px; color:#8a7c63; text-align:center; cursor:pointer; }
      .mini-promote:hover, .mini-promote:focus-visible { color:#E4762B; }
      .roster-grid { display:flex; flex-wrap:wrap; gap:6px; }
      .slot-empty { width:102px; height:92px; border:2px dashed #c9b892; border-radius:8px; display:flex; align-items:center; justify-content:center; color:#b3a37e; font-size:12px; }
      .slot-empty.need { flex-direction:column; gap:3px; font-weight:700; font-size:11px; background:rgba(255,255,255,.35); }
      .piles { display:flex; gap:12px; align-items:flex-start; }
      .market-zone { flex:1; min-width:0; }
      .pile-cap { font-size:12px; font-weight:700; color:#7a6a4f; text-transform:uppercase; letter-spacing:.6px; margin:0 0 3px 2px; display:flex; align-items:center; gap:6px; }
      .pile-n { background:#f2e9d4; color:#4a4232; border-radius:999px; padding:1px 8px; font-size:11px; }
      .pile-sub { text-transform:none; letter-spacing:0; font-weight:500; color:#8a7c63; font-size:11px; }
      .pile-empty { font-size:13px; color:#8a7c63; align-self:center; }
      .lbl-sub { text-transform:none; letter-spacing:0; font-weight:500; color:#8a7c63; font-size:12px; }
      .coach-chip { display:inline-flex; align-items:center; gap:6px; background:#f2e9d4; border:1px solid #e0d5bc; border-radius:999px; padding:3px 12px; font-family:inherit; font-size:13px; color:#4a4232; cursor:pointer; margin-bottom:8px; }
      .rolodex { display:flex; flex-wrap:wrap; align-items:center; gap:6px; margin:2px 0 8px; }
      .rolo-lbl { font-family:'Archivo Black','Arial Black',sans-serif; font-size:11px; color:#3a2a5c; letter-spacing:.5px; }
      .rolo-empty { font-size:11.5px; color:#8a7c63; }
      .call-chip { display:inline-flex; align-items:center; gap:4px; background:#3a2a5c; color:#F5EBDC; border:1px solid #F0B429; border-radius:999px; padding:4px 11px; font-family:inherit; font-size:12.5px; font-weight:700; cursor:pointer; animation:fopulse 2.4s ease-in-out infinite; }
      .call-chip.dim { opacity:.5; filter:grayscale(.5); animation:none; }
      .call-chip.react { background:#5a4a2c; border-color:#c9992a; animation:none; }
      .coach-chip b { color:#152744; }
      .coach-chip:hover, .coach-chip:focus-visible { border-color:#E4762B; }
      .ico-btn { display:inline-flex; align-items:center; justify-content:center; gap:6px; line-height:1.2; }
      .opt-sub { opacity:.72; font-weight:500; }
      .deckbtn { position:relative; flex:0 0 112px; min-height:214px; margin:10px 12px 16px 0; color:#F5EBDC; border:2px solid #33507e; border-radius:12px;
        font-family:'Archivo Black','Arial Black',sans-serif; font-size:13px; cursor:pointer; padding:12px 8px; line-height:1.2;
        display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px;
        background: linear-gradient(rgba(16,31,56,.45), rgba(16,31,56,.45)), url('/img/cardback-v1.jpg') center/cover, linear-gradient(155deg, #26426f, #101f38); /* prava ilustracija hrbta (ChatGPT) + tančica za berljivost napisa */
        text-shadow:0 1px 3px rgba(0,0,0,.8);
        box-shadow:
          inset 0 0 0 4px #101f38, inset 0 0 0 5px rgba(240,180,41,.32),
          4px 5px 0 0 #16294a, 4px 5px 0 2px #33507e,
          9px 11px 0 0 #101f38, 9px 11px 0 2px #33507e;
        transition:transform .12s; }
      .deckbtn:not(:disabled):hover { transform:translateY(-3px); }
      .deckbtn:not(:disabled):active { transform:translateY(0); }
      .deckbtn:disabled { opacity:.45; cursor:default; }
      .deckbtn-emblem { display:flex; align-items:center; justify-content:center; width:48px; height:48px; border-radius:50%; border:2px solid rgba(240,180,41,.55); background:rgba(240,180,41,.1); }
      .deckbtn-title { font-size:13px; letter-spacing:.5px; }
      .deckbtn-count { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:12px; background:#F0B429; color:#152744; border-radius:999px; padding:1px 10px; box-shadow:0 1px 2px rgba(0,0,0,.4); }
      .deckbtn small { font-family:'Barlow Condensed',sans-serif; font-weight:500; font-size:11px; opacity:.75; text-align:center; }
      .fa-row { display:flex; gap:6px; overflow-x:auto; flex:1; padding:10px 2px 4px; }
      .phase { margin-top:10px; background:#E4762B; color:#fff; border-radius:10px; padding:8px 12px; font-weight:700; font-size:15px; text-align:center; box-shadow:0 3px 0 #b3541a; line-height:1.3; }
      .phase.warn { background:#C0392B; box-shadow:0 3px 0 #8f2a1f; }
      .panel.draw-hi { box-shadow:0 0 0 2px #E4762B, 0 2px 6px rgba(20,25,40,.15); }
      .steps { margin-top:10px; background:#152744; border-radius:10px; padding:8px 6px; display:flex; align-items:center; justify-content:center; gap:4px; box-shadow:0 3px 0 #0c1830; }
      .stp { display:flex; align-items:center; gap:6px; padding:4px 9px; border-radius:8px; color:#8ea3c4; font-weight:700; font-size:13px; white-space:nowrap; }
      .stp-n { width:22px; height:22px; border-radius:50%; background:#2a3f66; color:#F5EBDC; display:flex; align-items:center; justify-content:center; font-family:'Archivo Black','Arial Black',sans-serif; font-size:11px; flex-shrink:0; }
      .stp.on { background:#E4762B; color:#fff; }
      .stp.on .stp-n { background:#fff; color:#E4762B; }
      .stp.done { color:#7ED77E; }
      .stp.done .stp-n { background:#2E7D32; color:#fff; }
      .stp-sep { color:#4a6291; font-weight:700; }
      .infob { width:22px; height:22px; border-radius:50%; border:none; background:#e7dcc4; color:#5a4a2f; font-weight:800; font-size:13px; cursor:pointer; font-family:inherit; line-height:1; flex-shrink:0; }
      .infob:hover, .infob:focus-visible { background:#F0B429; color:#152744; }
      .ai-tile { width:100%; display:flex; justify-content:space-between; align-items:center; gap:8px; background:none; border:none; cursor:pointer; font-family:inherit; padding:0; text-align:left; }
      .ai-last { font-size:12px; color:#8a7c63; margin-top:3px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:100%; }
      .chev { color:#8a7c63; font-size:11px; font-weight:700; flex-shrink:0; }
      .drawer-btn { width:100%; display:flex; justify-content:space-between; align-items:center; gap:8px; background:#f2e9d4; border:1px solid #e0d5bc; border-radius:10px; padding:8px 12px; margin-top:8px; font-family:inherit; font-weight:700; font-size:13px; color:#4a4232; cursor:pointer; }
      .drawer-btn:hover, .drawer-btn:focus-visible { border-color:#E4762B; }
      .actions { position:fixed; bottom:0; left:0; right:0; background:#152744; padding:8px 10px; display:flex; flex-direction:column; align-items:center; gap:5px; z-index:20; }
      .act-hint { font-size:12px; color:#cdd7ea; font-weight:600; text-align:center; line-height:1.25; }
      .act-row { display:flex; gap:8px; justify-content:center; width:100%; max-width:520px; }
      .actbar-prompt { width:100%; max-width:520px; padding:12px 10px; border:2px dashed #E4762B; background:#1c2f4d; color:#F5EBDC; border-radius:10px; font-family:inherit; font-weight:700; font-size:14px; line-height:1.3; cursor:pointer; text-align:center; }
      .actbar-prompt.nudge { animation:fonudge .45s ease; border-color:#F0B429; }
      @keyframes fonudge { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
      .abtn { flex:1; max-width:200px; padding:9px 8px; border:none; border-radius:10px; font-family:'Archivo Black','Arial Black',sans-serif; font-size:14px; cursor:pointer; line-height:1.15; }
      .abtn-main { display:block; }
      .abtn-sub { display:block; font-family:'Barlow Condensed','Arial Narrow',sans-serif; font-weight:600; font-size:11px; opacity:.82; margin-top:1px; }
      .abtn:disabled { opacity:.35; cursor:default; }
      .abtn.sign { background:#2E7D32; color:#fff; }
      .abtn.drop { background:#C0392B; color:#fff; }
      .abtn.go { background:#2E7D32; color:#fff; }
      .abtn.ghost { background:#F5EBDC; color:#152744; }
      .signopt { display:flex; flex-direction:column; align-items:flex-start; gap:2px; width:100%; padding:12px 14px; border:2px solid transparent; border-radius:10px; color:#f5efe0; cursor:pointer; text-align:left; }
      .signopt.alt { background:#fff; }
      .h3-tag { font-family:inherit; font-size:13px; font-weight:700; color:#8a7c63; white-space:nowrap; }
      .signopt-main { font-family:'Archivo Black','Arial Black',sans-serif; font-size:15px; line-height:1.2; }
      .signopt-sub { font-size:12px; opacity:.8; font-family:inherit; }
      .pickbar { display:flex; align-items:center; gap:12px; background:#f2e9d4; border:1px solid #e0d5bc; border-radius:9px; padding:6px 12px; margin:0 0 10px; }
      .pickbar-lbl { font-size:11px; font-weight:700; letter-spacing:.4px; text-transform:uppercase; color:#8a7c63; }
      .pickbar-item { display:inline-flex; align-items:center; gap:3px; font-size:15px; font-weight:800; color:#152744; }
      .age-sub { font-family:'Archivo Black','Arial Black',sans-serif; font-size:12px; letter-spacing:.5px; padding:2px 0; }
      .capm-lbl { display:flex; justify-content:space-between; font-size:13px; font-weight:700; }
      .capm-bar { position:relative; height:12px; background:#e7dcc4; border-radius:6px; margin-top:3px; overflow:hidden; }
      .capm-fill { height:100%; transition:width .3s; }
      .capm-cap { position:absolute; top:-2px; bottom:-2px; width:3px; background:#152744; }
      .capm-cap.apron { background:#8f1d12; }
      .red { color:#C0392B; } .green { color:#2E7D32; }
      .evt-text { font-size:15px; line-height:1.45; color:#2a3346; background:#f7f1e2; border-left:4px solid #E4762B; border-radius:8px; padding:10px 12px; margin:0 0 12px; }
      .evt-outcome { font-size:14.5px; font-weight:700; line-height:1.4; color:#152744; background:#e7f3e7; border-radius:8px; padding:10px 12px; }
      .chips { display:flex; flex-wrap:wrap; gap:5px; margin-top:8px; }
      .chip { background:#e7f3e7; color:#215c26; border-radius:12px; padding:3px 10px; font-size:12px; font-weight:700; border:1px solid #c7e0c7; cursor:pointer; font-family:inherit; transition:transform .1s, box-shadow .1s; }
      .chip:hover, .chip:focus-visible { transform:translateY(-1px); box-shadow:0 2px 6px rgba(20,25,40,.2); outline:none; }
      .chip:active { transform:translateY(0); }
      .chip.neg { background:#fbe3e0; color:#8f2a1f; border-color:#eab3ac; }
      .chips-hint { font-size:12px; color:#8a7c63; margin-top:8px; font-weight:600; }
      .chips-hint + .chips { margin-top:4px; }
      .chips-empty { font-size:12px; color:#8a7c63; margin-top:8px; }
      .unlocks { margin-top:8px; background:#0e1c33; border-radius:10px; padding:8px 10px; }
      .unlocks-hd { font-size:11px; text-transform:uppercase; letter-spacing:1px; color:#F0B429; font-weight:700; margin-bottom:4px; }
      .unlock { font-size:13px; font-weight:700; padding:2px 0; }
      .unlock.good { color:#7ED77E; }
      .unlock.bad { color:#FF8A7A; }
      .optbtn { background:#152744; color:#F5EBDC; border:none; border-radius:8px; padding:6px 12px; font-weight:700; font-family:inherit; font-size:13px; cursor:pointer; }
      .optbtn:disabled { opacity:.4; }
      .log { font-size:13px; max-height:96px; overflow-y:auto; line-height:1.5; color:#4a4232; }
      .toast { position:fixed; top:14px; left:50%; transform:translateX(-50%); background:#152744; color:#fff; padding:10px 16px; border-radius:10px; z-index:60; font-weight:700; box-shadow:0 4px 12px rgba(0,0,0,.4); max-width:92%; }
      .modal-bg { position:fixed; inset:0; background:rgba(12,18,32,.72); z-index:40; display:flex; align-items:center; justify-content:center; padding:16px; }
      .modal { background:#fffdf7; border-radius:14px; padding:18px; max-width:470px; width:100%; max-height:86vh; overflow-y:auto; }
      .modal h3 { font-family:'Archivo Black','Arial Black',sans-serif; color:#152744; margin-bottom:10px; }
      .modal p, .modal li { font-size:15px; line-height:1.5; }
      .modal ul { padding-left:18px; }
      .mrow { display:flex; gap:8px; margin-top:14px; }
      .step { display:flex; gap:10px; margin-bottom:12px; align-items:flex-start; }
      .stepn { flex:0 0 30px; height:30px; border-radius:50%; background:#E4762B; color:#fff; font-family:'Archivo Black','Arial Black',sans-serif; display:flex; align-items:center; justify-content:center; }
      .stepper { display:flex; align-items:center; justify-content:space-between; background:#f2e9d4; border-radius:10px; padding:6px 10px; margin-top:8px; }
      .stepper b { font-size:16px; }
      .stbtn { width:38px; height:38px; border-radius:9px; border:none; background:#152744; color:#fff; font-size:20px; font-weight:700; cursor:pointer; }
      .stbtn:disabled { opacity:.3; }
      .bidsum { text-align:center; font-family:'Archivo Black','Arial Black',sans-serif; font-size:18px; color:#152744; margin-top:10px; }
      .auc-card { display:flex; justify-content:center; margin:8px 0; }
      .tr-col { max-height:230px; overflow-y:auto; display:flex; flex-wrap:wrap; gap:6px; padding:4px; background:#f7f1e2; border-radius:10px; }
      .found-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(340px, 1fr)); gap:10px; padding:4px; background:#f7f1e2; border-radius:10px; }
      .found-cell { display:flex; align-items:center; gap:8px; background:#fffdf7; border-radius:10px; padding:6px; box-shadow:inset 0 1px 0 #fff, 0 1px 3px rgba(20,25,40,.12); }
      .bd { background:#fffdf7; border-radius:12px; padding:12px; flex:1; min-width:230px; }
      .bd-title { font-family:'Archivo Black','Arial Black',sans-serif; color:#152744; margin-bottom:8px; font-size:15px; }
      .bd-five { display:flex; flex-direction:column; gap:3px; margin-bottom:8px; font-size:13px; }
      .bd-slot { display:flex; gap:6px; align-items:center; }
      .brow { display:flex; justify-content:space-between; font-size:14px; padding:2px 0; border-bottom:1px dotted #e0d5bc; gap:8px; }
      .brow.total { border-top:2px solid #152744; border-bottom:none; margin-top:6px; padding-top:6px; font-size:17px; font-family:'Archivo Black','Arial Black',sans-serif; }
      .menu { text-align:center; padding-top:60px; }
      .menu h1 { font-family:'Archivo Black','Arial Black',sans-serif; font-size:44px; color:#152744; line-height:1; text-shadow:3px 3px 0 #F0B429; }
      .menu .tag { font-size:18px; margin:12px 0 26px; color:#4a4232; }
      .menu-count { font-size:14px; font-weight:700; color:#7a6a4f; background:#fffdf7; border-radius:999px; display:inline-block; padding:4px 14px; margin:-16px 0 22px; box-shadow:0 2px 5px rgba(20,25,40,.12); }
      .bigbtn { background:#E4762B; color:#fff; border:none; border-radius:12px; padding:16px 40px; font-family:'Archivo Black','Arial Black',sans-serif; font-size:20px; cursor:pointer; box-shadow:0 4px 0 #b3541a; }
      .linkbtn { background:none; border:none; color:#152744; text-decoration:underline; font-size:16px; margin-top:18px; cursor:pointer; font-family:inherit; font-weight:700; }
      .menu-btns { display:flex; flex-direction:column; gap:12px; max-width:340px; margin:0 auto; }
      .menu-btns .bigbtn { width:100%; }
      .menu-group-lbl { margin-top:12px; font-size:13px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:#7a6a4f; }
      .bigbtn.franchise { background:#3a2a5c; box-shadow:0 4px 0 #241a3d; font-size:18px; padding:13px 40px; }
      .menu-links { display:flex; gap:24px; justify-content:center; align-items:center; margin-top:28px; }
      .menu-links .linkbtn { margin-top:0; }
      .win-banner { text-align:center; font-family:'Archivo Black','Arial Black',sans-serif; font-size:20px; color:#152744; background:#F0B429; border-radius:12px; padding:12px; margin-top:10px; }
      .ai-overlay { position:fixed; inset:0; background:rgba(12,18,32,.62); z-index:35; display:flex; align-items:center; justify-content:center; }
      .ai-box { background:#152744; color:#F5EBDC; border-radius:16px; padding:22px 30px; text-align:center; font-family:'Archivo Black','Arial Black',sans-serif; font-size:18px; box-shadow:0 8px 30px rgba(0,0,0,.5); }
      .ai-box small { display:block; font-family:'Barlow Condensed',sans-serif; font-weight:500; font-size:14px; opacity:.8; margin-top:6px; }
      .spin { width:34px; height:34px; border:4px solid #2a3f66; border-top-color:#F0B429; border-radius:50%; margin:0 auto 10px; animation:fospin .8s linear infinite; }
      @keyframes fospin { to { transform:rotate(360deg); } }
      .phase.go { background:#2E7D32; box-shadow:0 3px 0 #1d5220; }
      .coachbtn { display:block; width:100%; text-align:left; background:#fff; border:2px solid #d8cdb8; border-radius:10px; padding:10px 12px; margin-top:8px; cursor:pointer; font-family:inherit; font-size:14px; line-height:1.35; }
      .coachbtn:hover, .coachbtn:focus-visible { border-color:#E4762B; }
      .coachbtn b { font-size:16px; color:#152744; }
      .coachbtn .ct { color:#E4762B; font-weight:700; margin-left:6px; }
      .mini.inj { border-color:#C0392B; background:#fbe3e0; opacity:.85; }
      .mini.inj .mini-name { color:#8f2a1f; }
      .sb { margin-top:10px; background:#0e1c33; border:2px solid #2a3f66; border-radius:12px; padding:10px 12px; display:flex; align-items:stretch; gap:6px; color:#F5EBDC; box-shadow:0 3px 0 #0c1830, 0 6px 14px rgba(10,16,30,.35); position:sticky; top:8px; z-index:25; }
      .sb-side { flex:1; text-align:center; }
      .sb-team { font-size:12px; letter-spacing:1.5px; opacity:.8; font-weight:700; }
      .sb-num { font-family:'Archivo Black','Arial Black',sans-serif; font-size:34px; color:#F0B429; line-height:1.05; position:relative; display:inline-block; }
      .sb-delta { position:absolute; top:-8px; right:-36px; font-size:15px; font-family:'Barlow Condensed',sans-serif; font-weight:700; animation:fodelta 2.4s ease forwards; }
      .sb-delta.up { color:#7ED77E; } .sb-delta.down { color:#FF8A7A; }
      @keyframes fodelta { 0%{opacity:0; transform:translateY(6px);} 15%{opacity:1; transform:translateY(0);} 75%{opacity:1;} 100%{opacity:0; transform:translateY(-10px);} }
      .sb-mid { flex:0 0 auto; display:flex; flex-direction:column; justify-content:center; align-items:center; gap:2px; min-width:106px; }
      .sb-lbl { font-size:10px; letter-spacing:1.5px; opacity:.7; font-weight:700; }
      .sb-lead { font-weight:700; font-size:15px; }
      .sb-lead.up { color:#7ED77E; } .sb-lead.down { color:#FF8A7A; }
      .sb-note { font-size:10px; opacity:.6; }
      .sb-season { font-size:11px; opacity:.75; }
      /* ===== MIKRO ANIMACIJE — kratke, namenske (jasnost pred okrasjem) ===== */
      /* dealing: vstopna animacija SAMO v roki in na trgu (ne ob vsakem re-renderju vseh kart) */
      @keyframes fodeal { from { opacity:0; transform:translateX(-18px) rotate(-4deg) scale(.9); } }
      .hand .card, .fa-row .card { animation: fodeal .28s cubic-bezier(.2,1.1,.4,1) both; }
      .hand .card:nth-child(2), .fa-row .card:nth-child(2) { animation-delay:50ms; }
      .hand .card:nth-child(3), .fa-row .card:nth-child(3) { animation-delay:100ms; }
      .hand .card:nth-child(4), .fa-row .card:nth-child(4) { animation-delay:150ms; }
      .hand .card:nth-child(5), .fa-row .card:nth-child(5) { animation-delay:200ms; }
      .hand .card:nth-child(6), .fa-row .card:nth-child(6) { animation-delay:250ms; }
      .hand .card:nth-child(7), .fa-row .card:nth-child(7) { animation-delay:300ms; }
      .hand .card:nth-child(8), .fa-row .card:nth-child(8) { animation-delay:350ms; }
      /* gumbi s pero-vzmetjo */
      .bigbtn:not(:disabled):active { transform:translateY(4px); box-shadow:0 0 0 rgba(0,0,0,0); }
      .abtn:not(:disabled):active { transform:translateY(2px) scale(.98); }
      .deckbtn:not(:disabled):active { transform:translateY(3px); }
      /* pack-opening: 3D obrat karte s skritega kupa */
      .flip-scene { perspective:900px; }
      .flip-inner { position:relative; display:inline-block; transform-style:preserve-3d; transition:transform .65s cubic-bezier(.3,1.2,.4,1); transform:rotateY(0); }
      .flip-inner.flipped { transform:rotateY(180deg); }
      .flip-front { backface-visibility:hidden; -webkit-backface-visibility:hidden; transform:rotateY(180deg); }
      .flip-back { position:absolute; inset:0; backface-visibility:hidden; -webkit-backface-visibility:hidden; z-index:2; }
      .card-back { width:100%; height:100%; border-radius:10px; border:2px solid #33507e; display:flex; align-items:center; justify-content:center;
        background:
          repeating-linear-gradient(45deg, rgba(240,180,41,.14) 0 5px, transparent 5px 10px),
          repeating-linear-gradient(-45deg, rgba(240,180,41,.14) 0 5px, transparent 5px 10px),
          linear-gradient(155deg, #26426f, #101f38);
        box-shadow: inset 0 0 0 4px #101f38, inset 0 0 0 5px rgba(240,180,41,.32); }
      .card-back svg { width:56px; height:56px; opacity:.9; }
      .card-back { position:relative; overflow:hidden; }
      .card-back-img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; border-radius:8px; }
      .card-back.tell { animation: fotell .6s ease-in-out infinite; }
      @keyframes fotell { 50% { box-shadow: inset 0 0 0 4px #101f38, inset 0 0 0 5px rgba(240,180,41,.32), 0 0 24px 6px rgba(240,180,41,.75); } }
      .flip-info { opacity:0; transition:opacity .3s ease .15s; }
      .flip-info.show { opacity:1; }
      .flip-spark { position:absolute; width:7px; height:7px; border-radius:2px; background:#F0B429; pointer-events:none; z-index:3; animation: fospark .7s ease-out forwards; }
      @keyframes fospark { from { opacity:1; transform:translate(0,0) rotate(0); } to { opacity:0; transform:translate(var(--sx), var(--sy)) rotate(200deg); } }
      /* zlata folija (93+) in holo (elitni rookie) */
      .card.gold { border-color:#c9992a; box-shadow:0 2px 10px rgba(160,120,20,.35); }
      .card.gold::before { content:""; position:absolute; inset:0; border-radius:9px; pointer-events:none; z-index:2;
        background:linear-gradient(115deg, transparent 30%, rgba(255,235,170,.55) 45%, rgba(255,255,255,.9) 50%, rgba(255,235,170,.55) 55%, transparent 70%);
        background-size:250% 100%; animation: fofoil 3.2s ease-in-out infinite; mix-blend-mode:soft-light; }
      @keyframes fofoil { 0%,100%{background-position:120% 0;} 50%{background-position:-20% 0;} }
      .card.gold .ovr, .card.gold .card-name { background:linear-gradient(100deg,#8a6d1a,#F0B429 40%,#fff2c9 50%,#F0B429 60%,#8a6d1a); -webkit-background-clip:text; background-clip:text; color:transparent; }
      .card.holo { overflow:hidden; }
      .card.holo::after { content:""; position:absolute; inset:0; border-radius:9px; pointer-events:none; opacity:.28; mix-blend-mode:color-dodge;
        background:conic-gradient(from 180deg, #ff8a7a, #F0B429, #7ED77E, #7cc4ff, #b18cff, #ff8a7a); filter:blur(14px) saturate(1.3);
        animation: foholo 5s linear infinite; }
      @keyframes foholo { to { transform:rotate(1turn) scale(1.6); } }
      .mini.gold { border-color:#c9992a; }
      .mini.gold .mini-name { background:linear-gradient(100deg,#8a6d1a,#c9992a 45%,#F0B429 55%,#8a6d1a); -webkit-background-clip:text; background-clip:text; color:transparent; }
      /* žig na papir */
      .stamp { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; pointer-events:none; z-index:4; }
      .stamp span { font-family:'Archivo Black','Arial Black',sans-serif; font-size:14px; color:#8f1d12; border:3px solid #8f1d12;
        padding:2px 8px; border-radius:4px; transform:rotate(-14deg); opacity:.92; mix-blend-mode:multiply; background:rgba(255,255,255,.25);
        animation: fostamp .45s cubic-bezier(.25,1.6,.4,1) both; }
      @keyframes fostamp { 0%{transform:rotate(-14deg) scale(3); opacity:0;} 55%{transform:rotate(-14deg) scale(.92); opacity:1;} 70%{transform:rotate(-12deg) scale(1.06);} 100%{transform:rotate(-14deg) scale(1);} }
      .stamp-big { position:fixed; inset:0; display:flex; align-items:center; justify-content:center; pointer-events:none; z-index:72; }
      .stamp-big span { font-family:'Archivo Black','Arial Black',sans-serif; font-size:34px; color:#8f1d12; border:5px solid #8f1d12;
        padding:6px 18px; border-radius:8px; transform:rotate(-10deg); mix-blend-mode:multiply; background:rgba(255,253,247,.55);
        animation: fostamp .5s cubic-bezier(.25,1.6,.4,1) both; }
      /* dražba: kuverti + udarec */
      .env-row { display:flex; gap:10px; margin:12px 0; }
      .env { position:relative; flex:1; min-height:92px; border-radius:10px; border:2px solid #d8cdb8; background:linear-gradient(180deg,#fffdf7,#f2ead8); padding:8px; text-align:center; transition:transform .3s ease, box-shadow .3s ease; }
      .env::before { content:""; position:absolute; left:0; right:0; top:0; height:26px; background:linear-gradient(180deg,#efe6d2,#e4d9c0); border-radius:8px 8px 0 0; clip-path:polygon(0 0, 100% 0, 50% 100%); opacity:.9; }
      .env-who { position:relative; font-family:'Archivo Black','Arial Black',sans-serif; font-size:12px; color:#152744; margin-bottom:14px; }
      .env-bid { position:relative; font-size:13.5px; font-weight:700; color:#1d2433; animation: fofadein .3s ease; }
      .env-bid b { display:block; font-size:22px; color:#152744; }
      .env-seal { position:relative; width:34px; height:34px; margin:4px auto 0; border-radius:50%; background:radial-gradient(circle at 35% 30%, #b3462f, #8f1d12); box-shadow:0 1px 4px rgba(0,0,0,.35); animation: fosealpulse 1s ease-in-out infinite; }
      @keyframes fosealpulse { 50% { transform:scale(1.08); } }
      .env.win { border-color:#c9992a; box-shadow:0 0 0 3px rgba(240,180,41,.4), 0 4px 14px rgba(160,120,20,.35); transform:translateY(-3px); }
      .aucrev-res { font-size:15px; font-weight:800; text-align:center; padding:8px; border-radius:8px; animation: fofadein .3s ease; }
      .aucrev-res.won { background:#e7f3e7; color:#1f7a3d; } .aucrev-res.lost { background:#f7e6e3; color:#8f1d12; }
      .modal.slam { animation: foshake .4s ease; }
      @keyframes foshake { 20%{transform:translate(-6px,3px) rotate(-.5deg);} 40%{transform:translate(5px,-3px);} 60%{transform:translate(-4px,2px);} 80%{transform:translate(3px,0);} }
      .slam-flash { position:fixed; inset:0; background:#fff; z-index:70; pointer-events:none; animation: foflashout .35s ease-out forwards; }
      @keyframes foflashout { from{opacity:.85;} to{opacity:0;} }
      @keyframes fofadein { from { opacity:0; } }
      /* premium: prava kartonska tekstura je zdaj na .fo (glej zgoraj) — SVG šum ni več potreben */
      .trophy-art { display:block; width:100%; max-width:320px; margin:10px auto; border-radius:14px; border:3px solid #c9992a; box-shadow:0 6px 18px rgba(160,120,20,.4); }
      /* meni kot plakat tekme */
      .menu { position:relative; overflow:hidden; }
      .menu-ball { position:absolute; top:-30px; left:50%; width:340px; height:340px; margin-left:-170px; opacity:.10; pointer-events:none; animation: fospinslow 90s linear infinite; }
      @keyframes fospinslow { to { transform:rotate(1turn); } }
      .menu .est { position:relative; font-size:12px; letter-spacing:4px; color:#8a7c63; margin-bottom:6px; font-weight:700; }
      .menu h1 .t1, .menu h1 .t2 { display:inline-block; animation: fotitle .6s cubic-bezier(.2,1.3,.4,1) both; }
      .menu h1 .t1 { --dx:-60px; } .menu h1 .t2 { --dx:60px; animation-delay:.12s; }
      @keyframes fotitle { from { opacity:0; transform:translateX(var(--dx)); } }
      .menu .tag { animation: fofadein .5s ease .4s both; }
      .menu-btns .bigbtn { position:relative; }
      .menu-btns .bigbtn::before { content:""; position:absolute; top:9px; bottom:9px; left:16px; border-left:2px dashed rgba(255,255,255,.5); pointer-events:none; }
      .marq { overflow:hidden; white-space:nowrap; }
      .marq-in { display:inline-block; animation: fomarq 18s linear infinite; }
      @keyframes fomarq { to { transform:translateX(-50%); } }
      .modal-bg { animation: fofade .15s ease-out; }
      @keyframes fofade { from { opacity:0; } to { opacity:1; } }
      .modal { animation: fomodal .17s ease-out; }
      @keyframes fomodal { from { opacity:0; transform:scale(.95) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
      .win-banner { animation: fobanner .45s ease; }
      @keyframes fobanner { 0% { transform:scale(.9); opacity:0; } 60% { transform:scale(1.03); } 100% { transform:scale(1); opacity:1; } }
      .trophy-wrap, .rim-wrap { position:relative; display:flex; justify-content:center; padding:6px 0 2px; }
      .trophy-svg { image-rendering:pixelated; filter:drop-shadow(0 4px 0 rgba(0,0,0,.18)); animation: tRise .7s cubic-bezier(.2,1.4,.4,1) both, tBob 1.7s ease-in-out .7s infinite; transform-origin:center bottom; }
      @keyframes tRise { 0% { transform:translateY(70px) scale(.6); opacity:0; } 70% { transform:translateY(-6px) scale(1.05); opacity:1; } 100% { transform:translateY(0) scale(1); } }
      @keyframes tBob { 0%,100% { transform:translateY(0) rotate(-1.5deg); } 50% { transform:translateY(-7px) rotate(1.5deg); } }
      .tspark { position:absolute; width:7px; height:7px; background:#FFE39A; box-shadow:0 0 6px #F0B429; animation: tSpark 1.1s ease-in-out infinite; }
      @keyframes tSpark { 0%,100% { transform:scale(0) rotate(45deg); opacity:0; } 50% { transform:scale(1) rotate(45deg); opacity:1; } }
      .ball-spin { transform-origin:60px 46px; animation: bSpin 1.15s linear infinite, bRattle 2.2s ease-in-out infinite; }
      @keyframes bSpin { to { transform:rotate(360deg); } }
      @keyframes bRattle { 0%,100% { transform:translateX(-3px); } 50% { transform:translateX(3px); } }
      .slog { margin-top:8px; background:#0f1d33; border-radius:10px; overflow:hidden; }
      .slog-row { display:flex; align-items:center; justify-content:space-between; gap:8px; padding:7px 12px; font-size:13px; color:#e6ddc8; border-top:1px solid #21324e; }
      .slog-row:first-child { border-top:none; }
      .slog-row.win { background:rgba(31,122,61,.28); } .slog-row.loss { background:rgba(122,42,42,.28); }
      .slog-row b { font-family:'Barlow Condensed','Arial Narrow',sans-serif; letter-spacing:.4px; }
      @media (prefers-reduced-motion: reduce){ .trophy-svg, .ball-spin, .tspark { animation:none !important; } }
      .phase, .actions .act-hint { animation: fofade .2s ease-out; }
      .toast { animation: fotoast .2s ease-out; }
      @keyframes fotoast { from { opacity:0; transform:translate(-50%, -8px); } to { opacity:1; transform:translate(-50%, 0); } }
      .drawer-btn.pulse { animation: fopulse .75s ease; }
      @keyframes fopulse { 0% { box-shadow:0 0 0 0 rgba(240,180,41,0); } 30% { box-shadow:0 0 0 5px rgba(240,180,41,.55); border-color:#F0B429; } 100% { box-shadow:0 0 0 0 rgba(240,180,41,0); } }
      .chip.flash { animation: foflash .8s ease; }
      @keyframes foflash { 30% { background:#F0B429; border-color:#c9992a; color:#152744; transform:translateY(-2px); } }
      .gavelstrike { display:inline-block; transform-origin:72% 82%; animation: fostrike .6s ease .08s 1; }
      @keyframes fostrike { 0%{transform:rotate(-26deg)} 38%{transform:rotate(9deg)} 55%{transform:rotate(-2deg)} 72%{transform:rotate(5deg)} 100%{transform:rotate(0)} }
      .confetti { position:fixed; inset:0; pointer-events:none; overflow:hidden; z-index:30; }
      .confetti i { position:absolute; top:-14px; width:8px; height:13px; border-radius:1px; animation: foconf linear forwards; }
      @keyframes foconf { to { transform: translateY(105vh) rotate(600deg); opacity:.15; } }
      @media (prefers-reduced-motion: reduce){ .fo *, .modal-bg, .modal, .toast { transition:none !important; animation:none !important; } .confetti, .slam-flash, .flip-spark { display:none !important; } }
      /* ===== NAMIZNI (desktop) VIDEZ: širši prostor + večje kartice (velja od 700px navzgor) ===== */
      @media (min-width: 700px) {
        .wrap { max-width: 960px; padding: 16px 18px 108px; }
        .mini { width: 128px; font-size: 13px; padding: 7px 9px; }
        .mini-top { font-size: 13px; }
        .mini-top b { font-size: 17px; }
        .mini-name { font-size: 15px; }
        .mini-sal { font-size: 12px; }
        .mini-pts { font-size: 12px; }
        .roster-grid { gap: 10px; }
        .slot-empty { width: 128px; height: 102px; font-size: 13px; }
        .card { width: 138px; min-width: 138px; padding: 9px 11px; }
        .card-name { font-size: 15px; min-height: 34px; }
        .face { width: 64px; height: 64px; }
        .mini-face { width: 18px; height: 18px; }
        .card-club { font-size: 12px; }
        .trait, .vals { font-size: 12px; }
        .hand { gap: 10px; }
        .deckbtn { flex-basis: 138px; min-height: 226px; }
        .deckbtn-emblem { font-size: 30px; }
        .actions .abtn { max-width: 230px; padding: 14px 12px; font-size: 15px; }
      }
    `}</style>
  );

  // ---- MENI ----
  if (screen === "leaderboard") {
    return (
      <div className="fo">{css}
        <div className="wrap">
          <div className="hdr"><h1>🏅 LESTVICA</h1></div>
          <div className="hint" style={{ marginBottom: 8 }}>Najboljši kumulativni seštevki dokončanih franšiz (shranjeno na tej napravi/računu).</div>
          {leaderboard === null && <p style={{ fontSize: 13 }}>Nalagam …</p>}
          {leaderboard && leaderboard.length === 0 && <p style={{ fontSize: 13, color: "#8a7c63" }}>Še ni vpisov — dokončaj franšizo in se vpiši!</p>}
          {leaderboard && leaderboard.length > 0 && (
            <div className="panel">
              {leaderboard.map((e, i) => (
                <div key={i} className="dev-row" style={{ display: "flex", justifyContent: "space-between", padding: "6px 4px", borderBottom: "1px solid #1c2c48" }}>
                  <span>{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`} <b>{e.name}</b> <small style={{ color: "#8a7c63" }}>· {e.seasons} sez · naslovi {e.t} · {e.d}</small></span>
                  <b>{e.pts} tč</b>
                </div>
              ))}
            </div>
          )}
          <div className="mrow"><button className="bigbtn" style={{ flex: 1 }} onClick={() => setScreen("menu")}>V meni</button></div>
        </div>
      </div>
    );
  }

  if (screen === "menu") {
    return (
      <div className="fo">{css}
        <div className="wrap menu">
          {/* TODO(ChatGPT slike): hero plakat menija → public/img/menu-hero-v1.jpg kot ozadje .menu (zamenja SVG žogo) */}
          <svg className="menu-ball" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="47" fill="none" stroke="#152744" strokeWidth="2.5" />
            <path d="M50 3v94 M3 50h94 M16 15c13 11 13 59 0 70 M84 15c-13 11-13 59 0 70" fill="none" stroke="#152744" strokeWidth="2.5" />
          </svg>
          <div className="est">EST. 2026 · DINASTIJA ZA DINASTIJO</div>
          <h1><span className="t1">FRONT</span><br /><span className="t2">OFFICE</span></h1>
          <div className="tag">Ti proti <b>rivalski AI dinastiji</b> — kdo osvoji več naslovov?<br />Draftaj mlade, razvij jih v zvezdnike, ujemi svoje šampionsko okno.</div>
          {counts && (() => { const s = `👥 ${counts.players} ${counts.players === 1 ? "menedžer" : counts.players === 2 ? "menedžerja" : counts.players <= 4 ? "menedžerji" : "menedžerjev"} doslej · 🎮 ${counts.games} ${counts.games === 1 ? "igra" : counts.games === 2 ? "igri" : counts.games <= 4 ? "igre" : "iger"} · `; return (
            <div className="menu-count marq"><div className="marq-in"><span>{s.repeat(3)}</span><span aria-hidden="true">{s.repeat(3)}</span></div></div>
          ); })()}
          <div className="menu-btns">
            <div className="menu-group-lbl">🏆 Nova dinastija — koliko sezon?</div>
            <button className="bigbtn" onClick={() => startFranchise(3)}>3 sezone</button>
            <button className="bigbtn" onClick={() => startFranchise(5)}>5 sezon</button>
          </div>
          <div className="menu-links">
            <button className="linkbtn" onClick={() => { loadLeaderboard(); setScreen("leaderboard"); }}>🏅 Lestvica</button>
            <button className="linkbtn" onClick={() => setShowRules(true)}>Pravila</button>
          </div>
        </div>
        {showRules && <Rules onClose={() => setShowRules(false)} />}
      </div>
    );
  }

  // ---- OBRAČUN ----
  if (screen === "score" && g?.result) {
    const { hs, as } = g.result;
    const winner = hs.total === as.total ? null : hs.total > as.total ? "TI" : "AI GM";
    const fr = g.franchise;
    const frDone = fr && g.season >= (g.seasons || 3);
    const frWinner = g.titles ? (g.titles.h === g.titles.a ? null : g.titles.h > g.titles.a ? "h" : "a") : null;
    const heroWin = frDone && g.titles && g.titles.h * 2 > (g.seasons || 3); // zmagal večino sezon → dinastija (pokal)
    return (
      <div className="fo">{css}
        <div className="wrap">
          <div className="hdr"><h1>{fr ? `SEZONA ${g.season}/${g.seasons} — OBRAČUN` : `RUNDA ${g.round} — OBRAČUN`}</h1><div className="score-strip">{fr ? <><span>naslovi<b>TI {g.titles.h} : {g.titles.a} AI</b></span><span>seštevek<b>{g.cum ? g.cum.h : 0}</b></span><span>🧱 sklad<b>{g.h.sklad || 0}{g.result && g.result.skladGain ? ` (+${g.result.skladGain})` : ""}</b></span></> : <span>cilj<b>{TARGET}</b></span>}</div></div>
          {fr
            ? <>{g.result.seasonWin === "h" && <Confetti />}<div className="win-banner">{g.result.seasonWin === "h" ? "🏆 NASLOV je tvoj to sezono!" : g.result.seasonWin === "a" ? "AI GM osvoji sezono." : "Sezona izenačena."}</div></>
            : g.champion ? (
            <div className="win-banner">🏆 {g.champion === "h" ? "TI SI PRVAK LIGE!" : g.champion === "a" ? "AI GM JE PRVAK LIGE." : "Izenačeno na vrhu!"}</div>
          ) : winner && <div className="win-banner">Rundo dobi: {winner} (+{Math.abs(hs.total - as.total)})</div>}
          {fr && g.result.ownerNote && <div className="win-banner" style={{ background: g.result.ownerMet ? "#1f7a3d" : "#7a2a2a", color: "#F5EBDC", fontFamily: "'Barlow Condensed','Arial Narrow',sans-serif", fontWeight: 700, fontSize: 15, lineHeight: 1.35 }}>{g.result.ownerNote}</div>}
          {fr && !frDone && g.result.ownerTarget == null && g.season === 1 && <div className="hint" style={{ textAlign: "center" }}>👔 Lastnik je postavil merilo: tvoj rezultat <b>{hs.total}</b>. Prihodnje sezone pričakuje <b>+12 % vsako leto</b> — motor infrastrukture in temeljev naj ti to omogoči.</div>}
          {frDone && (heroWin ? <TrophyRaise /> : <BallRim />)}
          {frDone && <div className="win-banner" style={{ background: frWinner === "h" ? "#1f7a3d" : frWinner === "a" ? "#7a2a2a" : "#555" }}>KONEC FRANŠIZE — {frWinner === "h" ? `DINASTIJA! Osvojil si ${g.titles.h} od ${g.seasons} naslovov.` : frWinner === "a" ? `AI GM je vladal (${g.titles.a}/${g.seasons}).` : `Izenačeno ${g.titles.h}:${g.titles.a}.`} · Tvoj seštevek: <b>{g.cum ? g.cum.h : 0} tč</b></div>}
          {frDone && frWinner === "h" && <img className="trophy-art" src="/img/trofeja-v1.jpg" alt="Pokal dinastije" onError={(e) => { e.target.style.display = "none"; }} />}
          {frDone && g.seasonLog && g.seasonLog.length > 0 && (
            <div className="slog">
              {g.seasonLog.map((r) => (
                <div key={r.s} className={"slog-row " + (r.w === "h" ? "win" : r.w === "a" ? "loss" : "tie")}>
                  <span>Sezona <b>{r.s}</b></span>
                  <span style={{ color: "#b0a288" }}>{r.h} : {r.a}</span>
                  <b>{r.w === "h" ? "🏆 TI" : r.w === "a" ? "AI GM" : "izenačeno"}</b>
                </div>
              ))}
            </div>
          )}
          {frDone && !lbSaved && (
            <div className="panel" style={{ marginTop: 8 }}>
              <div className="lbl">🏅 Vpis na lestvico</div>
              <div style={{ display: "flex", gap: 6 }}>
                <input value={lbName} onChange={(e) => setLbName(e.target.value)} placeholder="Tvoje ime" maxLength={16} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "2px solid #2a3a5c", background: "#0f1d33", color: "#f5efe0", fontFamily: "inherit", fontSize: 14 }} />
                <button className="abtn sign" disabled={!lbName.trim()} onClick={() => saveToLeaderboard(lbName.trim(), g.cum.h, g.seasons, g.titles)}>Vpiši</button>
              </div>
            </div>
          )}
          {frDone && lbSaved && <div className="hint" style={{ color: "#215c26" }}>✅ Vpisan na lestvico! Poglej jo v meniju.</div>}
          {g.result.dev && g.result.dev.length > 0 && (
            <div className="dev-box">
              <div className="dev-hd">🌱 RAZVOJ ROOKIEJEV</div>
              {g.result.dev.map((d, i) => <DevRow key={i} d={d} i={i} />)}
              <div className="dev-note">★ peterka raste najhitreje · 🎓 klop/mentor srednje · ☀️ poletna liga najpočasneje · 😤 = 💎 elitni na klopi brez minut (nezadovoljen). Mladi rastejo vsako sezono, dokler so pod stropom.</div>
            </div>
          )}
          <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
            <Breakdown name={fr ? `TI — sezona ${hs.total}` : `TI — skupno ${g.totals.h}`} r={hs} />
            <Breakdown name={fr ? `AI GM — sezona ${as.total}` : `AI GM — skupno ${g.totals.a}`} r={as} />
          </div>
          <div className="mrow">
            {fr && !frDone && <button className="bigbtn" style={{ flex: 1, background: "#3a2a5c" }} onClick={startOffseason}>Prestopni rok →</button>}
            {fr && frDone && <button className="bigbtn" style={{ flex: 1 }} onClick={() => setScreen("menu")}>V meni</button>}
            {!fr && !g.champion && <button className="bigbtn" style={{ flex: 1 }} onClick={nextRound}>Runda {g.round + 1} →</button>}
            {!fr && <button className="bigbtn" style={{ flex: 1, background: "#152744", boxShadow: "0 4px 0 #0c1830" }} onClick={start}>Nova sezona</button>}
          </div>
          {evt && (
            <div className="modal-bg">
              <div className="modal">
                <h3>📻 Medsezonska drama</h3>
                <p className="evt-text">{evt.text}</p>
                {evt.stage === "choose"
                  ? <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {evt.choices.map((ch, i) => (
                        <button key={i} className="signopt" style={{ background: ["#215c26", "#3a2a5c", "#7a2a2a", "#152744"][i] || "#152744" }} onClick={() => resolveEvent(i)}>
                          <span className="signopt-main" style={{ fontSize: 14 }}>{ch.label}</span>
                        </button>
                      ))}
                    </div>
                  : <>
                      <div className="evt-outcome">{evt.outcome}</div>
                      <button className="bigbtn" style={{ width: "100%", marginTop: 10 }} onClick={() => { setEvt(null); goOffseason(); }}>V prestopni rok →</button>
                    </>}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---- PRESTOPNI ROK (offseason) ----
  // ---- USTANOVNI NABOR ----
  if (screen === "founding" && g && g.founding) {
    const fb = g.founding;
    const done = fb.hUsed >= 2 && fb.aUsed >= 2;
    const myFounders = g.h.roster.filter((c) => c.rookie);
    return (
      <div className="fo">{css}
        <div className="wrap">
          <div className="hdr"><h1>🏗️ USTANOVNI NABOR</h1></div>
          <div className="hint" style={{ marginBottom: 8 }}>Vsaka dinastija se začne z <b>draftom</b> — in to je <b>edini draft v celi dinastiji</b>. Izbereš <b>2 mlada temelja</b>, ki ju nato neguješ vseh {g.seasons || 3} sezon; okoli njiju gradiš ekipo na trgu. {g.classInfo && <>Letnik je <b>{g.classInfo.strength}</b> ({g.classInfo.elites}×💎). </>}Ti in nasprotnik izbirata izmenično.</div>
          <div className="hint" style={{ margin: "0 0 8px" }}><b>Posli:</b> 💎 Elitni — najvišji strop, a zahteva minute v peterki · 🌱 Projekt — raste ob mentorju (⭐/coach) · 🔒 Pripravljen — zaigra takoj. Potencialni razpon je viden, dejanski razvoj je loterija znotraj njega.</div>
          <div className="hint" style={{ color: "#7a4fd0", margin: "0 0 6px" }}>Tvoji temelji: <b>{fb.hUsed}/2</b>{myFounders.length > 0 && <> — {myFounders.map((c) => `${surname(c.n)} (${ROOK_TIER[c.tier].ico})`).join(", ")}</>} · Nasprotnik: <b>{fb.aUsed}/2</b></div>
          <div className="panel">
            <div className="lbl">Razpoložljivi prospekti</div>
            <div className="found-grid">
              {fb.board.map((c) => (
                <div key={c.id} className="found-cell" style={{ opacity: fb.hUsed >= 2 ? 0.5 : 1 }}>
                  <PlayerCard c={c} mini onClick={() => setOffInfo(c)} />
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
                    <div className="pot" style={{ color: ROOK_TIER[c.tier].col, fontSize: 12 }}><Ico k={c.tier} s={13} /> {ROOK_TIER[c.tier].n} · potencial {c.potLow}–{c.potHigh}{c.hook && HOOKS[c.hook] ? ` · ⭑ ${HOOKS[c.hook].n}` : ""}</div>
                    <button className="abtn sign" disabled={fb.hUsed >= 2} onClick={() => foundingPick(c)}>Draftaj temelj</button>
                  </div>
                </div>
              ))}
              {fb.board.length === 0 && <div style={{ fontSize: 13, color: "#8a7c63" }}>Razred izčrpan.</div>}
            </div>
          </div>
          {done && <div className="mrow"><button className="bigbtn" style={{ flex: 1 }} onClick={() => setScreen("play")}>Naprej na trg →</button></div>}
          {!done && <div className="hint" style={{ textAlign: "center", opacity: .7 }}>Izberi še {2 - fb.hUsed} {2 - fb.hUsed === 1 ? "temelj" : "temelja"}, da nadaljuješ.</div>}
          {bigStamp && <div className="stamp-big"><span>{bigStamp}</span></div>}
          {offInfo && (
            <div className="modal-bg" onClick={() => setOffInfo(null)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>{offInfo.n}</h3>
                <div className="auc-card"><PlayerCard c={offInfo} onClick={() => {}} /></div>
                <ul>
                  <li><b>{offInfo.pos}</b> · {offInfo.club} · <b>{offInfo.age} let</b> · ROOKIE · <Ico k={offInfo.tr} s={14} /> {TRAITS[offInfo.tr].n}</li>
                  <li>OVR <b>{offInfo.ovr}</b> · vpliv {offInfo.pm >= 0 ? "+" : ""}{offInfo.pm} · plača {offInfo.sal} M$</li>
                  <li>V peterki <b>{spts(offInfo)}</b> tč · na klopi {Math.floor(offInfo.ovr / 2)} tč.</li>
                  <li className="pot" style={{ color: ROOK_TIER[offInfo.tier].col }}><Ico k={offInfo.tier} s={14} /> {ROOK_TIER[offInfo.tier].n} · potencial {offInfo.potLow}–{offInfo.potHigh} — {ROOK_TIER[offInfo.tier].job}.{offInfo.hook && HOOKS[offInfo.hook] ? ` ⭑ ${HOOKS[offInfo.hook].n}: ${HOOKS[offInfo.hook].d}.` : ""}</li>
                </ul>
                <div className="mrow"><button className="abtn ghost" style={{ flex: 1 }} onClick={() => setOffInfo(null)}>Zapri</button></div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (screen === "offseason" && offseason) {
    const { hExp, hKeepAuto, aRoster, decisions, hSummer, summerSel } = offseason;
    const sSel = summerSel || {};
    const devEligible = (c) => c.rookie && c.age <= 23 && (c.th ?? c.potHigh ?? 0) > c.ovr;
    const youngPool = [...hKeepAuto, ...(hSummer || [])].filter(devEligible);
    const nextCap = capFor(g.season + 1);
    const projectedSal = effSalary([...hKeepAuto, ...hExp.filter((c) => decisions[c.id]).map((c) => ({ ...c, sal: resignSal(c) }))], null);
    return (
      <div className="fo">{css}
        <div className="wrap">
          <div className="hdr"><h1>PRESTOPNI ROK · po sezoni {g.season}</h1></div>
          {offseason.nextRule && <div className="win-banner" style={{ background: "#2a3a5c", color: "#F5EBDC", fontSize: 14.5, lineHeight: 1.35 }}>📋 PRAVILO LIGE za sezono {g.season + 1}: {LEAGUE_RULES[offseason.nextRule].ico} <b>{LEAGUE_RULES[offseason.nextRule].n}</b> — {LEAGUE_RULES[offseason.nextRule].d} <span style={{ opacity: .8 }}>Gradi z mislijo nanj.</span></div>}
          {/* 🏗️ FRANŠIZNA INFRASTRUKTURA — drugi tir gradnje */}
          <div className="panel" style={{ borderColor: "#3a2a5c" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <div className="lbl" style={{ margin: 0, color: "#7a4fd0" }}>🏗️ Franšizna infrastruktura</div>
              <span className="sklad-chip">🧱 {g.h.sklad || 0}</span>
            </div>
            <div className="hint" style={{ margin: "0 0 8px" }}>Gradiš čez sezone z 🧱 <b>SKLADOM</b> (služiš ga z igranjem + žetvijo neporabljenih pickov{offseason.harvest ? `, letos +${offseason.harvest}🧱` : ""}). Vsaka nadgradnja trajno spremeni pravila tvoje ekonomije. <b>L3</b> se razkrije šele pri L2.</div>
            <div className="found-grid">
              {(g.infraOffer || ["trening"]).map((id) => {
                const inf = INFRA[id]; if (!inf) return null;
                const lvl = (g.h.infra && g.h.infra[id]) || 0;
                const nextCost = lvl < 3 ? INFRA_COST[lvl + 1] : null;
                const canUp = lvl < 3 && (g.h.sklad || 0) >= nextCost;
                return (
                  <div key={id} className="found-cell" style={{ alignItems: "flex-start", flexDirection: "column", gap: 6 }}>
                    <div style={{ fontWeight: 800, fontSize: 13.5 }}>{inf.ico} {inf.n} <span style={{ color: "#7a4fd0" }}>· {["—", "L1", "L2", "L3"][lvl]}</span></div>
                    <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11.5, lineHeight: 1.35 }}>
                      {inf.d.map((t, i) => <li key={i} style={{ color: i < lvl ? "#215c26" : i === lvl ? "#1d2433" : "#a99", fontWeight: i === lvl ? 700 : 400 }}>{i === 2 && lvl < 2 ? "🔒 Načrti: ???" : `L${i + 1}: ${t}`}{i < lvl ? " ✓" : ""}</li>)}
                    </ul>
                    <button className="abtn sign" style={{ width: "100%" }} disabled={!canUp} onClick={() => upgradeInfra(id)}>{lvl >= 3 ? "Zgrajeno (L3)" : `Nadgradi na L${lvl + 1} (${nextCost}🧱)`}</button>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="hint" style={{ marginBottom: 8 }}>Pogodbam je poteklo leto. Igralci brez pogodbe (spodaj) postanejo prosti — <b>podaljšaj</b> (svoje igralce dobiš z <b>−15 % zvestobe</b>, Bird pravica — a zvezdniki 90+ pri 30+ letih zahtevajo polno tržno ceno!) ali <b>pusti oditi</b>. Obstoječim pogodbam plača zraste +5 %. Cap raste na <b>{nextCap} M$</b> to sezono — če preplačaš, te davek požre v točkah.</div>
          {offseason.ageReport && offseason.ageReport.length > 0 && (() => {
            const grp = (side) => offseason.ageReport.filter((r) => r.side === side);
            const renderRows = (rows) => [...rows.filter((r) => r.retired), ...rows.filter((r) => !r.retired).sort((a, b) => a.d - b.d)].map((r, i) => (
              <div key={r.side + i} className={"dev-row " + (r.retired ? "bust" : r.d > 0 ? "boom" : "bust")}>
                <span>{r.retired ? "🎖️ " : ""}{surname(r.n)} ({r.age})</span>
                <b>{r.retired ? "UPOKOJITEV" : `${r.from} → ${r.to} (${r.d > 0 ? "+" : ""}${r.d})`}</b>
              </div>
            ));
            const hRows = grp("h"), aRows = grp("a");
            return (
              <div className="dev-box">
                <div className="dev-hd">📅 STARANJE & UPOKOJITVE</div>
                <div className="age-sub" style={{ color: "#8fd694" }}>▸ TVOJA EKIPA</div>
                {hRows.length ? renderRows(hRows) : <div className="dev-row" style={{ opacity: .6 }}><span>Brez sprememb</span></div>}
                <div className="age-sub" style={{ color: "#e0a94f", marginTop: 6 }}>▸ NASPROTNIK</div>
                {aRows.length ? renderRows(aRows) : <div className="dev-row" style={{ opacity: .6 }}><span>Brez sprememb</span></div>}
                <div className="dev-note">Mladi (≤23) rastejo prek minut (glej obračun — ★/🎓/☀️), veterani (31+) zdaj hitreje upadajo; pri ~34 in nizkem OVR se upokojijo → mesto se sprosti.</div>
              </div>
            );
          })()}
          <div className="panel">
            <div className="lbl">Potekle pogodbe — tvoja odločitev ({hExp.length})</div>
            {hExp.length === 0 && <div style={{ fontSize: 13, color: "#8a7c63" }}>Nobena pogodba ni potekla to sezono.</div>}
            <div className="tr-col">
              {hExp.map((c) => {
                const bigJump = resignSal(c) >= c.sal * 2 && resignSal(c) - c.sal >= 8; // ugodna pogodba potekla → tržna cena
                return (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
                  <PlayerCard c={c} mini onClick={() => setOffInfo(c)} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {bigJump && <div style={{ fontSize: 11.5, fontWeight: 700, color: "#9a6a13", marginBottom: 4 }}>🔓 Ugodna pogodba je potekla — za OVR {c.ovr} zahteva tržno ceno. Podaljšaj ali izgubi.</div>}
                    <div style={{ display: "flex", gap: 4 }}>
                      <button className={"abtn " + (decisions[c.id] ? "sign" : "ghost")} style={{ flex: 1 }} onClick={() => setOffseason({ ...offseason, decisions: { ...decisions, [c.id]: true } })}>Podaljšaj<br /><small>{c.sal} → {resignSal(c)} M$</small></button>
                      <button className={"abtn " + (!decisions[c.id] ? "drop" : "ghost")} style={{ flex: 1 }} onClick={() => setOffseason({ ...offseason, decisions: { ...decisions, [c.id]: false } })}>Pusti<br /><small>oditi</small></button>
                    </div>
                  </div>
                </div>
              );})}
            </div>
          </div>
          <div className="panel">
            <div className="lbl">Ostajajo (pogodba teče, plača +5 %) · {hKeepAuto.length}</div>
            <div className="roster-grid">{hKeepAuto.map((c) => <PlayerCard key={c.id} c={c} mini onClick={() => setOffInfo(c)} />)}</div>
          </div>
          <div className="hint">Projekcija plačne mase v novo sezono: <b style={{ color: projectedSal > nextCap ? "#C0392B" : "#215c26" }}>{projectedSal} M$</b> (cap {nextCap} M$){projectedSal > nextCap + APRON ? " — globoko v davku! Razmisli, koga pustiš in nadomestiš s poceni draftom." : projectedSal > nextCap ? " — nad limitom, davek te čaka." : " — pod limitom."} · AI obdrži {aRoster.length}.</div>
          {(offseason.unhappy || []).filter((u) => !offseason.sold[u.id]).length > 0 && (
            <div className="panel" style={{ borderColor: "#7a2a2a" }}>
              <div className="lbl" style={{ color: "#C0392B" }}>😤 HOČEM VEN — nezadovoljni igralci</div>
              <div className="hint" style={{ margin: "0 0 8px" }}>Slab fit terja davek. <b>Prodaj</b> za picke (prispejo naslednjo sezono — prezidava) ali <b>obdrži</b> nezadovoljnega — a garderoba trpi: <b>vpliv pade globoko v minus</b> (moti ekipo), dokler ga ne trejdaš.</div>
              <div className="tr-col">
                {(offseason.unhappy || []).filter((u) => !offseason.sold[u.id]).map((u) => {
                  const c = [...offseason.hKeepAuto, ...offseason.hExp].find((x) => x.id === u.id);
                  if (!c) return null;
                  const p = sellPriceOf(c);
                  return (
                    <div key={u.id}>
                      <div style={{ fontSize: 12, color: "#b23b2e", marginBottom: 2 }}>{surname(c.n)}: {u.why}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <PlayerCard c={c} mini onClick={() => setOffInfo(c)} />
                        <button className="abtn drop" style={{ flex: 1 }} onClick={() => sellUnhappy(c)}>Prodaj za {p.f ? `${p.f}×🥇` : ""}{p.f && p.s ? " + " : ""}{p.s ? `${p.s}×🥈` : ""}</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {youngPool.length > 0 && (
            <div className="panel">
              <div className="lbl">☀️ Poletna liga — razvoj mladih</div>
              <div className="hint" style={{ margin: "0 0 8px" }}>Vsak mladec raste, <b>dokler dobiva minute</b>: najhitreje v <b>prvi peterki</b>, srednje na <b>klopi</b>. Lahko ga pošlješ v <b>☀️ poletno ligo</b> — naslednjo sezono ni na voljo (sprosti mesto v rosterju), a še vedno <b>počasi raste</b>. Idealno, ko surovca še nočeš igrati, a ne želiš zavreči mesta.</div>
              <div className="found-grid">
                {youngPool.map((c) => {
                  const inSummer = !!sSel[c.id];
                  const ceil = c.th ?? c.potHigh;
                  return (
                    <div key={c.id} className="found-cell">
                      <PlayerCard c={c} mini onClick={() => setOffInfo(c)} />
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
                        <div className="pot" style={{ color: ROOK_TIER[c.tier].col, fontSize: 12 }}><Ico k={c.tier} s={13} /> OVR {c.ovr} → strop ~{ceil} · {c.age} let</div>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button className={"abtn " + (!inSummer ? "sign" : "ghost")} style={{ flex: 1 }} onClick={() => setOffseason({ ...offseason, summerSel: { ...sSel, [c.id]: false } })}>V rosterju</button>
                          <button className={"abtn " + (inSummer ? "sign" : "ghost")} style={{ flex: 1 }} onClick={() => setOffseason({ ...offseason, summerSel: { ...sSel, [c.id]: true } })}>☀️ Poletna liga</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <div className="mrow"><button className="bigbtn" style={{ flex: 1 }} onClick={finalizeOffseason}>Sezona {g.season + 1} →</button></div>
          {offInfo && (
            <div className="modal-bg" onClick={() => setOffInfo(null)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>{offInfo.unhappy && <><Ico k="sulk" s={18} /> </>}{offInfo.n}</h3>
                <div className="auc-card"><PlayerCard c={offInfo} onClick={() => {}} /></div>
                <ul>
                  <li><b>{offInfo.pos}</b> · {offInfo.club} · <b>{offInfo.age} let</b>{offInfo.rookie ? " · ROOKIE" : ""} · <Ico k={offInfo.tr} s={14} /> {TRAITS[offInfo.tr].n}</li>
                  <li><b style={{ color: careerPhase(offInfo.age).col }}>{careerPhase(offInfo.age).ico} {careerPhase(offInfo.age).label}</b> — {agingOutlook(offInfo.age)}</li>
                  <li>OVR <b>{offInfo.ovr}</b> · vpliv {offInfo.pm >= 0 ? "+" : ""}{offInfo.pm} · plača {offInfo.sal} M$ · pogodba 📄{offInfo.contract != null ? offInfo.contract : "—"}</li>
                  <li>V peterki <b>{spts(offInfo)}</b> tč · na klopi {Math.floor(offInfo.ovr / 2)} tč.</li>
                  {offInfo.rookie && <li className="pot" style={{ color: ROOK_TIER[offInfo.tier].col }}><Ico k={offInfo.tier} s={14} /> {ROOK_TIER[offInfo.tier].n} · potencial {offInfo.potLow}–{offInfo.potHigh} — {ROOK_TIER[offInfo.tier].job}.{offInfo.hook && HOOKS[offInfo.hook] ? ` ⭑ ${HOOKS[offInfo.hook].n}: ${HOOKS[offInfo.hook].d}.` : ""}</li>}
                  {offInfo.contract != null && !offInfo.rookie && <li>Ob podaljšanju bi zahteval <b>{resignSal(offInfo)} M$</b> {offInfo.ovr >= 90 && offInfo.age >= 30 ? "(zvezdnik 30+ — polna tržna cena, brez Bird popusta)" : "(tržna cena −15 % zvestobe)"}.</li>}
                  {offInfo.unhappy && <li style={{ color: "#C0392B" }}>Nezadovoljen — vpliv bo padel v minus, dokler ga ne trejdaš.</li>}
                </ul>
                <div className="mrow"><button className="abtn ghost" style={{ flex: 1 }} onClick={() => setOffInfo(null)}>Zapri</button></div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---- IGRA ----
  if (!g) return null;
  const selCard = g.h.hand.find((c) => c.id === sel);
  const philPending = g.franchise && (!g.philosophy || !g.philosophy.h);
  const coachPending = !philPending && !g.h.coach;
  const myEff = effSalary(g.h.roster, g.h.coach);
  const capNow = capFor(g.season);
  const proj = scoreRoster(g.h.roster, 0, false, g.h.starters, g.h.picks, g.h.coach, g.injured.h, g.h.deadCap, g.philosophy && g.philosophy.h, capNow, infraScoreBonus(g.h, g.h.roster));
  const starterCards = Object.values(proj.starters);
  // ocena rosterja (najboljša peterka) — za mejni prispevek igralca
  const rScore = (roster, side) => scoreRoster(roster, 0, false, null, g[side].picks, g[side].coach, g.injured[side], side === "h" ? (g.h.deadCap || 0) : 0, null, capNow).total;
  const addValue = (roster, card, side) => rScore([...roster, card], side) - rScore(roster, side); // koliko doda nov igralec
  const contribOf = (roster, card, side) => rScore(roster, side) - rScore(roster.filter((c) => c.id !== card.id), side); // koliko že prispeva
  const aiProj = scoreRoster(g.a.roster, 0, false, null, g.a.picks, g.a.coach, g.injured.a, 0, g.philosophy && g.philosophy.a, capNow, infraScoreBonus(g.a, g.a.roster));
  const drawPhase = g.phase === "draw" && !aiThinking && !g.auction && !coachPending && !philPending;
  const actPhase = g.phase === "action" && !aiThinking && !g.auction && !coachPending && !philPending;
  const aucCard = g.auction ? g.auction.card : null;
  const myTurn = drawPhase || actPhase;
  const canTrade = myTurn && !g.h.tradeUsed && g.h.roster.length > 0 && g.a.roster.length > 0;

  return (
    <div className="fo">{css}
      <div className="wrap">
        <div className="hdr">
          <div><h1>FRONT OFFICE</h1><div className="sub">{g.franchise ? `Sezona ${g.season}/${g.seasons} · naslovi ${g.titles.h}:${g.titles.a}` : `Runda ${g.round} · sezona do ${TARGET} točk`}</div></div>
          <div className="score-strip" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span>picki<b style={{ fontSize: 14 }}><Ico k="f" s={14} />{g.h.picks.f} <Ico k="s" s={14} />{g.h.picks.s}{g.h.picks.w ? <> <Ico k="w" s={14} /></> : null}</b></span>
            <button onClick={() => setMusic(MUSIC.toggle())} title={music ? "Izklopi glasbo" : "Vklopi glasbo"} aria-label={music ? "Izklopi glasbo" : "Vklopi glasbo"} style={{ background: "none", border: "none", padding: 4, cursor: "pointer", lineHeight: 0, opacity: music ? 1 : 0.6 }}><Note on={music} s={19} /></button>
            <button onClick={() => setMuted(SFX.toggle())} title={muted ? "Vklopi zvok" : "Izklopi zvok"} aria-label={muted ? "Vklopi zvok" : "Izklopi zvok"} style={{ background: "none", border: "none", padding: 4, cursor: "pointer", lineHeight: 0, opacity: muted ? 0.6 : 1 }}><Speaker on={!muted} s={19} /></button>
          </div>
        </div>

        {g.banner && <div className="phase warn">⚠️ {g.banner}</div>}
        {(aiThinking || g.auction || philPending || coachPending) && (
          <div className="phase">
            {aiThinking ? "🔴 AI GM je na potezi — počakaj…" : g.auction ? <><Gavel s={17} /> DRAŽBA za superzvezdnika!</> : philPending ? "🧭 Izberi filozofijo dinastije" : <><Ico k="cap" s={16} /> Izberi coacha za to rundo</>}
          </div>
        )}

        <Scoreboard h={proj.total} a={aiProj.total} rosterH={g.h.roster.length} rosterA={g.a.roster.length} />

        {/* AI — zložena ploščica, tap razširi */}
        <div className="panel">
          <button className="ai-tile" onClick={() => setAiOpen(!aiOpen)}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div className="lbl" style={{ margin: 0 }}>AI GM {g.a.coach && <>· <Ico k="cap" s={15} /> {coachOf(g.a.coach).n} </>}· roster {g.a.roster.length}/10 · projekcija {aiProj.total}{g.franchise && (g.a.calls || []).length > 0 ? <span style={{ fontWeight: 500, textTransform: "none", letterSpacing: 0 }} title="AI drži toliko klicev v svojem Rolodexu"> · ☎️ {(g.a.calls || []).length}</span> : ""}{g.franchise && g.a.infra && Object.keys(g.a.infra).length > 0 ? <span style={{ fontWeight: 500, textTransform: "none", letterSpacing: 0 }} title="AI-jeva zgrajena infrastruktura"> · 🏗️ {Object.values(g.a.infra).reduce((s, l) => s + l, 0)}</span> : ""}</div>
              {!aiOpen && (() => { const last = [...g.log].reverse().find((l) => l.startsWith("AI")); return last ? <div className="ai-last">{last}</div> : null; })()}
            </div>
            <span className="chev">{aiOpen ? "▲ skrij" : "▼ podrobno"}</span>
          </button>
          {aiOpen && <>
            <div className="lbl" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
              <span>roka {g.a.hand.length} kart</span>
              <Picks p={g.a.picks} />
            </div>
            {g.a.roster.length > 0 && <CapMeter salary={effSalary(g.a.roster, g.a.coach)} cap={capNow} />}
            {g.a.roster.length > 0 ? (() => {
              const aStarterIds = new Set(POS.map((p) => aiProj.starters[p] && aiProj.starters[p].id).filter((id) => id != null));
              const aBench = g.a.roster.filter((c) => !aStarterIds.has(c.id));
              return <>
                <div className="lbl" style={{ margin: "10px 0 4px" }}>★ Prva peterka</div>
                <div className="roster-grid">
                  {POS.map((p) => {
                    const st = aiProj.starters[p] ? g.a.roster.find((c) => c.id === aiProj.starters[p].id) : null;
                    return st
                      ? <PlayerCard key={p} c={st} mini starter={g.injured.a !== st.id} injured={g.injured.a === st.id} onClick={() => setInspect({ card: st, side: "a" })} />
                      : <div key={p} className="slot-empty need" style={{ borderColor: POS_COLOR[p], color: POS_COLOR[p] }}><PosBadge p={p} sm /><span>manjka</span></div>;
                  })}
                </div>
                <div className="lbl" style={{ margin: "10px 0 4px" }}>Klop</div>
                <div className="roster-grid">
                  {aBench.map((c) => <PlayerCard key={c.id} c={c} mini injured={g.injured.a === c.id} onClick={() => setInspect({ card: c, side: "a" })} />)}
                  {Array.from({ length: Math.max(0, 5 - aBench.length) }).map((_, i) => <div key={i} className="slot-empty">prosto</div>)}
                </div>
              </>;
            })() : <div className="roster-grid" style={{ marginTop: 6 }}><span style={{ fontSize: 13, color: "#8a7c63" }}>Še brez podpisov.</span></div>}
          </>}
        </div>

        {/* KUPI */}
        <div className={"panel" + (drawPhase ? " draw-hi" : "")}>
          <div className="lbl" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}><span>Trg <span className="lbl-sub">— vzemi 1 karto iz kupa ali AI-jevega odpada</span></span><button className="infob" onClick={() => setHelp("kupi")} aria-label="Pomoč: trg">?</button></div>
          <div className="piles">
            <button className="deckbtn" disabled={!drawPhase} onClick={drawDeck}>
              <span className="deckbtn-emblem"><Ico k="ball" s={34} style={{ verticalAlign: 0 }} /></span>
              <span className="deckbtn-title">SKRITI KUP</span>
              <span className="deckbtn-count">{g.deck.length} kart</span>
              <small>na slepo · polna cena</small>
            </button>
            <div className="market-zone">
              <div className="fa-row">
                {g.aDisc.slice(-8).map((c) => <PlayerCard key={c.id} c={c} dim={!drawPhase} ribbon={`−25% → ${discSal(c)}M`} onClick={() => { if (drawPhase) setInspect({ card: c, side: "market" }); }} />)}
                {g.aDisc.length === 0 && <span className="pile-empty">Prazno — AI še ni ničesar odvrgel.</span>}
              </div>
            </div>
          </div>
          {g.hDisc.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <button className="ai-tile" onClick={() => setDiscOpen(!discOpen)}>
                <div className="pile-cap" style={{ margin: 0 }}>Tvoj odpad <span className="pile-n">{g.hDisc.length}</span> <span className="pile-sub">· AI lahko pobere</span></div>
                <span className="chev">{discOpen ? "▲ skrij" : "▼ poglej"}</span>
              </button>
              {discOpen && (
                <div className="fa-row" style={{ marginTop: 6 }}>
                  {g.hDisc.slice(-8).map((c) => <PlayerCard key={c.id} c={c} dim onClick={() => {}} />)}
                </div>
              )}
            </div>
          )}
          <div className="mrow" style={{ marginTop: 10 }}>
            <button className="optbtn ico-btn" style={{ flex: 1 }} disabled={!canTrade} onClick={openTrade}><Ico k="trade" s={16} /> Trejd <span className="opt-sub">{g.h.tradeUsed ? "· že" : "· 1×/potezo"}</span></button>
            <button className="optbtn ico-btn" style={{ flex: 1, background: waiveMode ? "#C0392B" : "#152744" }} disabled={!myTurn || g.h.roster.length === 0} onClick={() => { setWaiveMode(!waiveMode); if (!waiveMode) say("Waive: tapni igralca v svojem rosterju, ki ga odpuščaš."); }}><Ico k="waive" s={16} /> {waiveMode ? "Prekliči" : "Waive"}</button>
          </div>
        </div>

        {/* MOJ ROSTER */}
        <div className="panel">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <div className="lbl" style={{ margin: 0 }}>Tvoj roster {g.h.roster.length}/10 · projekcija <b>{proj.total}</b>{g.franchise && g.season >= 2 && g.ownerBase ? <span style={{ fontWeight: 500, textTransform: "none", letterSpacing: 0 }}> · 👔 cilj {Math.round(g.ownerBase * Math.pow(1.12, g.season - 1))}</span> : ""}</div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {g.franchise && <span className="sklad-chip" title="🧱 Sklad — valuta za franšizno infrastrukturo (gradiš v prestopnem roku)">🧱 {g.h.sklad || 0}</span>}
              <Picks p={g.h.picks} />
              {g.h.roster.length > 0 && <button className="optbtn" onClick={optimize}>⚡ Peterka</button>}
              <button className="infob" onClick={() => setHelp("roster")} aria-label="Pomoč: roster">?</button>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {g.philosophy && g.philosophy.h && <button className="coach-chip" style={{ background: "#efe6fb", borderColor: "#d8c6f0" }} onClick={() => say(philOf(g.philosophy.h).d)}>🧭 <b>{philOf(g.philosophy.h).n}</b></button>}
            {g.h.coach && <button className="coach-chip" onClick={() => setHelp("roster")}><Ico k="cap" s={16} /> <b>{coachOf(g.h.coach).n}</b> · {coachOf(g.h.coach).t}</button>}
            {g.leagueRule && <button className="coach-chip" style={{ background: "#dfe7f5", borderColor: "#b9c9e6" }} onClick={() => say(`${LEAGUE_RULES[g.leagueRule].n}: ${LEAGUE_RULES[g.leagueRule].d}`)}>{LEAGUE_RULES[g.leagueRule].ico} <b>{LEAGUE_RULES[g.leagueRule].n}</b></button>}
          </div>
          {/* ☎️ ROLODEX — klici, ki jih odigraš med sezono */}
          <div className="rolodex">
            <span className="rolo-lbl">☎️ ROLODEX {(g.h.calls || []).length}/3</span>
            {(g.h.calls || []).map((id, i) => {
              const c = CALLS[id]; const react = c.kind === "reaction"; const elig = !react && callEligible(id) && (g.callTurnUsed || 0) < 1;
              return <button key={id + i} className={"call-chip" + (react ? " react" : elig ? "" : " dim")} title={c.d} onClick={() => { if (react) { say(`🛡️ »${c.n}« se odigra sam v svojem oknu (poškodba/dražba).`); return; } if ((g.callTurnUsed || 0) >= 1) { say("Na potezo lahko odigraš le 1 klic."); return; } if (!callEligible(id)) { say(id === "drbine" ? "Nisi poškodovan." : id === "kava" ? "Nimaš nezadovoljnega igralca." : c.d); return; } setCallModal({ id }); }}>{c.ico} {c.n.split(" ")[0]}</button>;
            })}
            {(g.h.calls || []).length === 0 && <span className="rolo-empty">— prazen (klice dobiš z izgubljeno dražbo in ob začetku sezone)</span>}
          </div>
          {g.h.deadCap > 0 && <div className="hint red">✂️ Dead cap: +{g.h.deadCap} M$ v plačni masi do konca runde (odpuščeni igralci).</div>}
          {g.h.summer && g.h.summer.length > 0 && <div className="hint" style={{ color: "#9a6a13" }}>☀️ V poletni ligi (letos ni na voljo, počasi raste): {g.h.summer.map((c) => `${surname(c.n)} (${c.ovr})`).join(", ")}</div>}
          <CapMeter salary={myEff + (g.h.deadCap || 0)} cap={capNow} />
          {(() => {
            const starterIds = new Set(POS.map((p) => g.h.starters[p]).filter((id) => id != null));
            const bench = g.h.roster.filter((c) => !starterIds.has(c.id));
            const tapCard = (c) => { if (waiveMode) { setWaiveTarget(c); return; } setInspect({ card: c, side: "h" }); };
            return <>
              <div className="lbl" style={{ margin: "10px 0 4px" }}>★ Prva peterka</div>
              <div className="roster-grid">
                {POS.map((p) => {
                  const st = g.h.roster.find((c) => c.id === g.h.starters[p]);
                  return st
                    ? <PlayerCard key={p} c={st} mini starter={g.injured.h !== st.id} injured={g.injured.h === st.id} stamped={stamp && stamp.id === st.id ? stamp.txt : null} onClick={() => tapCard(st)} />
                    : <div key={p} className="slot-empty need" style={{ borderColor: POS_COLOR[p], color: POS_COLOR[p] }}><PosBadge p={p} sm /><span>manjka</span></div>;
                })}
              </div>
              <div className="lbl" style={{ margin: "10px 0 4px" }}>Klop <span style={{ fontWeight: 500, textTransform: "none", letterSpacing: 0 }}>· tapni ↑ v peterko na kartici</span></div>
              <div className="roster-grid">
                {bench.map((c) => <PlayerCard key={c.id} c={c} mini injured={g.injured.h === c.id} stamped={stamp && stamp.id === c.id ? stamp.txt : null} onStar={() => setStarter(c)} onClick={() => tapCard(c)} />)}
                {Array.from({ length: Math.max(0, 5 - bench.length) }).map((_, i) => <div key={i} className="slot-empty">prosto</div>)}
              </div>
            </>;
          })()}
          <BonusChips r={proj} coach={g.h.coach} onExplain={say} />
        </div>

        {/* ROKA */}
        <div className="panel">
          <div className="lbl" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span>Tvoja roka ({g.h.hand.length})</span><button className="infob" onClick={() => setHelp("roka")} aria-label="Pomoč: roka">?</button></div>
          <div className="hand">
            {g.h.hand.map((c) => <PlayerCard key={c.id} c={c} selected={sel === c.id} onClick={() => setSel(sel === c.id ? null : c.id)} />)}
            {g.h.hand.length === 0 && <span style={{ fontSize: 13, color: "#8a7c63" }}>Roka je prazna.</span>}
          </div>
          {selCard && <>
            <UnlockPreview card={selCard} sCards={starterCards.filter((c) => c.pos !== selCard.pos || c.id === g.h.starters[selCard.pos])} />
            <button className="linkbtn" style={{ marginTop: 6 }} onClick={() => setInspect({ card: selCard, side: "hand" })}>ℹ️ Podrobnosti in točke ({surname(selCard.n)})</button>
          </>}
        </div>

        {/* DNEVNIK — enovrstični ticker, tap razširi */}
        <div className="panel">
          <button className="ai-tile" onClick={() => setLogOpen(!logOpen)}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div className="lbl" style={{ margin: 0 }}>Dnevnik lige</div>
              {!logOpen && <div className="ai-last">{g.log[g.log.length - 1]}</div>}
            </div>
            <span className="chev">{logOpen ? "▲ skrij" : "▼ vse"}</span>
          </button>
          {logOpen && <div className="log" style={{ marginTop: 6 }}>{[...g.log].reverse().map((l, i) => <div key={i}>{l}</div>)}</div>}
        </div>
        <div style={{ textAlign: "center" }}><button className="linkbtn" onClick={() => setShowRules(true)}>Pravila</button></div>
      </div>

      {/* AKCIJSKA VRSTICA — edini vodnik poteze */}
      {(drawPhase || actPhase) && (
        <div className="actions">
          {actPhase && <div className="act-hint">{(g.h.signedTurn || 0) >= SIGN_LIMIT ? "Meja podpisov (2/2) — ODVRZI 1 karto za konec poteze." : "Podpiši (do 2) ali kar ODVRZI 1 karto za konec poteze."}</div>}
          <div className="act-row">
            {drawPhase ? (
              <button key={"p" + sel} className={"actbar-prompt" + (selCard ? " nudge" : "")} onClick={() => say("⬆️ Najprej vzemi karto s trga — 🂠 skriti kup ali 🟢 prosti igralci.")}>
                ⬆️ {selCard ? "Najprej vzemi karto s trga, nato lahko podpišeš" : "Vzemi karto — 🂠 skriti kup ali 🟢 trg"}
              </button>
            ) : (
              <>
                <button className="abtn sign" disabled={!selCard || (selCard && !canSign(g.h.roster, selCard)) || (g.h.signedTurn || 0) >= SIGN_LIMIT} onClick={() => { const canDisc = selCard.sal > 2 && (g.h.picks.f > 0 || g.h.picks.s > 0); canDisc ? setSignOpts(selCard) : sign(); }}>
                  <span className="abtn-main">PODPIŠI ✍️</span>
                  <span className="abtn-sub">{g.h.signedTurn || 0}/{SIGN_LIMIT} na potezo</span>
                </button>
                {g.h.hand.length === 0 ? (
                  <button className="abtn go" onClick={() => finishTurn(g)}>
                    <span className="abtn-main">✅ KONČAJ POTEZO</span>
                    <span className="abtn-sub">roka je prazna</span>
                  </button>
                ) : (
                  <button className="abtn drop" disabled={!selCard} onClick={discard}>
                    <span className="abtn-main">ODVRZI 🗑️</span>
                    <span className="abtn-sub">konča potezo</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}

      {/* AI NA POTEZI — OVERLAY */}
      {aiThinking && (
        <div className="ai-overlay">
          <div className="ai-box">
            <div className="spin" />
            AI GM JE NA POTEZI
            <small>vleče karto → podpisuje → odvrže eno med proste igralce</small>
          </div>
        </div>
      )}

      {/* IZBIRA FILOZOFIJE (enkrat na dinastijo) */}
      {philPending && !g.result && (
        <div className="modal-bg">
          <div className="modal">
            <h3>🧭 Filozofija dinastije</h3>
            <p>Izberi <b>eno identiteto za celo franšizo</b> — nagrajuje predanost (snowball). Rival dobi svojo; kdo bo bolje gradil? Coacha izbereš zatem, vsako sezono.</p>
            {PHILOS.map((p) => (
              <button key={p.id} className="coachbtn" onClick={() => pickPhilosophy(p.id)}>
                <b>{p.ico} {p.n}</b>
                <div>{p.d}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* IZBIRA COACHA */}
      {coachPending && !g.result && (
        <div className="modal-bg">
          <div className="modal">
            <h3><Ico k="cap" s={20} /> Izberi coacha za rundo {g.round}</h3>
            <p>Vsak coach prinese bonus, ki ga lahko izkoristiš — ali pa tudi ne. AI dobi naključnega izmed preostalih.</p>
            {COACHES.map((c) => (
              <button key={c.id} className="coachbtn" onClick={() => pickCoach(c.id)}>
                <b>{c.n}</b><span className="ct">{c.t}</span>
                <div>{c.d}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* WAIVE POTRDITEV */}
      {waiveTarget && (
        <div className="modal-bg" onClick={() => setWaiveTarget(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>✂️ Waive: {waiveTarget.n}</h3>
            <div className="auc-card"><PlayerCard c={waiveTarget} onClick={() => {}} /></div>
            <p>Igralec gre v <b>tvoj odpad</b> (AI ga lahko vzame s popustom{waiveTarget.ovr >= AUCTION_OVR ? "; ker je superzvezdnik, se sproži DRAŽBA" : ""}). Njegovih {waiveTarget.sal} M$ pade iz plač, ostane pa <b>dead cap +{deadFor(waiveTarget)} M$</b> (četrtina plače, najmanj 3) do konca runde.{waiveTarget.ovr >= AUCTION_OVR ? "" : " Nato <b>potegneš 1 karto iz kupa</b> — obupan način, da uloviš manjkajočo pozicijo."}</p>
            <div className="mrow">
              <button className="abtn drop" style={{ flex: 1 }} onClick={doWaive}>Odpusti (+{deadFor(waiveTarget)} M$ dead cap)</button>
              <button className="abtn ghost" style={{ flex: 1 }} onClick={() => setWaiveTarget(null)}>Prekliči</button>
            </div>
          </div>
        </div>
      )}

      {/* REHAB */}
      {/* ☎️ igranje klica — potrditev ali izbira tarče */}
      {callModal && (() => {
        const c = CALLS[callModal.id];
        const targets = callModal.id === "kava" ? g.h.roster.filter((x) => x.unhappy) : callModal.id === "aneks" ? g.h.roster : null;
        return (
          <div className="modal-bg" onClick={() => setCallModal(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>{c.ico} {c.n}</h3>
              <p className="evt-text">{c.d}</p>
              {targets
                ? <div className="tr-col">{targets.map((t) => <button key={t.id} className="abtn sign" onClick={() => playCall(callModal.id, t)}>{surname(t.n)} <small>· OVR {t.ovr}{callModal.id === "aneks" && t.contract != null ? ` · 📄${t.contract}` : ""}</small></button>)}{targets.length === 0 && <div style={{ fontSize: 13, color: "#8a7c63" }}>Ni primerne tarče.</div>}</div>
                : <div className="mrow"><button className="bigbtn" style={{ flex: 1 }} onClick={() => playCall(callModal.id)}>Odigraj klic</button></div>}
              <div className="mrow"><button className="abtn ghost" style={{ flex: 1 }} onClick={() => setCallModal(null)}>Prekliči</button></div>
            </div>
          </div>
        );
      })()}
      {/* ⏰ ROK ZA PRESTOPE — izbereš 1 klic ali +2🧱 */}
      {deadline && (
        <div className="modal-bg">
          <div className="modal">
            <h3>⏰ Rok za prestope</h3>
            <p className="evt-text">Sredina sezone — telefoni žarijo. Izberi <b>1 klic</b> za svoj Rolodex ({(g.h.calls || []).length}/3) ali vzemi gradbeni <b>sklad</b>.</p>
            <div className="tr-col">
              {deadline.offers.map((id, i) => <button key={id + i} className="abtn sign" onClick={() => resolveDeadline(id)}>{CALLS[id].ico} {CALLS[id].n} <small>· {CALLS[id].d}</small></button>)}
              <button className="abtn ghost" onClick={() => resolveDeadline("sklad")}>🧱 Raje +2 v sklad</button>
            </div>
          </div>
        </div>
      )}
      {/* 🛡️ reakcija: tvoj igralec poškodovan + držiš Zavarovanje */}
      {injOffer && (
        <div className="modal-bg">
          <div className="modal">
            <h3>🛡️ Zavarovalna polica?</h3>
            <p className="evt-text"><b>{injOffer.card.n}</b> se je pravkar poškodoval. Uporabiš Zavarovalno polico in poškodbo takoj izničiš?</p>
            <div className="mrow">
              <button className="abtn sign" style={{ flex: 1 }} onClick={() => { setG({ ...g, injured: { ...g.injured, h: null }, h: { ...g.h, calls: g.h.calls.filter((x, i) => i !== g.h.calls.indexOf("zavarovanje")) }, log: [...g.log, `🛡️ Zavarovalna polica: ${surname(injOffer.card.n)} vendarle ostane zdrav.`] }); SFX.card(); setInjOffer(null); }}>🛡️ Uporabi (−1 klic)</button>
              <button className="abtn ghost" style={{ flex: 1 }} onClick={() => setInjOffer(null)}>Pusti poškodbo</button>
            </div>
          </div>
        </div>
      )}
      {rehab && (
        <div className="modal-bg" onClick={() => setRehab(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>🩹 {rehab.n} je poškodovan</h3>
            <p>Do konca runde ne more v prvo peterko (na klopi šteje normalno). Lahko ga pošlješ na <b>rehab za {rehabCostFor(g, "h")}× 🥈</b>{rehabCostFor(g, "h") === 1 && g.rehabUsed?.h ? " (🩺 Medicinski center)" : ""} — imaš jih {g.h.picks.s}.</p>
            <div className="mrow">
              <button className="abtn sign" style={{ flex: 1 }} disabled={g.h.picks.s < rehabCostFor(g, "h")} onClick={heal}>💪 Rehab ({rehabCostFor(g, "h")}× 🥈)</button>
              <button className="abtn ghost" style={{ flex: 1 }} onClick={() => setRehab(null)}>Pusti ga počivati</button>
            </div>
          </div>
        </div>
      )}

      {/* RAZKRITJE VLEČENE KARTE */}
      {reveal && (
        <div className="modal-bg" onClick={() => { if (flipped) setReveal(null); else setFlipped(true); }}>
          <div className="modal" onClick={(e) => { e.stopPropagation(); if (!flipped) setFlipped(true); }}>
            <h3>{flipped ? <>{reveal.disc ? "🟢 S popustom: " : "🂠 Vlekel si: "}{reveal.n}</> : "🂠 Skriti kup …"}</h3>
            <div className="auc-card flip-scene">
              <div className={"flip-inner" + (flipped ? " flipped" : "")}>
                <div className="flip-back"><CardBack tell={!reveal.disc && reveal.ovr >= 90 && !flipped} /></div>
                <div className="flip-front"><PlayerCard c={reveal} onClick={() => {}} /></div>
                {flipped && reveal.ovr >= 95 && Array.from({ length: 10 }).map((_, i) => (
                  <span key={i} className="flip-spark" style={{ left: "50%", top: "50%", "--sx": `${Math.cos((i / 10) * 2 * Math.PI) * 90}px`, "--sy": `${Math.sin((i / 10) * 2 * Math.PI) * 90}px`, animationDelay: `${0.65 + i * 0.015}s` }} />
                ))}
              </div>
            </div>
            <div className={"flip-info" + (flipped ? " show" : "")}>
            <p>Karta je zdaj <b>v tvoji roki</b> (že označena). Kaj pomenijo številke:</p>
            <ul>
              <li><b>OVR {reveal.ovr}</b> — kakovost igralca.</li>
              <li><b>Vpliv {reveal.pm >= 0 ? "+" : ""}{reveal.pm}</b> (zelena/rdeča) — šteje <b>dvojno</b>, a samo če je igralec v prvi peterki.</li>
              <li>V <b>prvi peterki</b> torej prinese <b>{spts(reveal)} točk</b> ({reveal.ovr} + 2×{reveal.pm}). Na <b>klopi</b> le {Math.floor(reveal.ovr / 2)}.</li>
              <li>{reveal.disc ? <>Plača <b>{reveal.sal} M$</b> (popust −25 %, prej {reveal.origSal} M$) — cenejši, ker si ga pobral iz AI-jevih odpuščenih.</> : <>Plača <b>{reveal.sal} M$</b> gre v plačno maso (limit {capNow} M$).</>}</li>
            </ul>
            <UnlockPreview card={reveal} sCards={starterCards} />
            {canSign(g.h.roster, reveal) && (
              <div className="addbox">
                <div className="addval">Ta igralec doda tvoji ekipi ≈ <b>{(() => { const v = addValue(g.h.roster, reveal, "h"); return (v >= 0 ? "+" : "") + v; })()}</b> tč</div>
                <div className="addstand">Trenutni izid runde — Ti <b>{proj.total}</b> · AI <b>{aiProj.total}</b></div>
              </div>
            )}
            {!canSign(g.h.roster, reveal) && <div className="addbox"><div className="addstand">Trenutni izid runde — Ti <b>{proj.total}</b> · AI <b>{aiProj.total}</b></div></div>}
            <div className="mrow"><button className="bigbtn" style={{ flex: 1 }} onClick={() => setReveal(null)}>Nadaljuj</button></div>
            </div>
          </div>
        </div>
      )}

      {/* DRAŽBA */}
      {aucCard && !aucReveal && (
        <div className="modal-bg">
          <div className="modal">
            <h3><span className="gavelstrike"><Gavel s={20} /></span> Dražba: {aucCard.n}</h3>
            <div className="auc-card"><PlayerCard c={aucCard} onClick={() => {}} /></div>
            <p>Superzvezdnik je na trgu! Skrivno ponudi picke — AI bo dal svojo ponudbo. <b>Višja ponudba igralca takoj podpiše.</b> Ob izenačenju ostane med prostimi igralci.</p>
            {!canSign(g.h.roster, aucCard) && <p className="red">Ne moreš ga podpisati (limit pozicije ali poln roster) — lahko samo odstopiš.</p>}
            {canSign(g.h.roster, aucCard) && (
              <>
                <div className="stepper"><span><Ico k="f" s={15} /> Pick 1. kroga (vreden {PV.f + (g.h.coach === "okc" ? 1 : 0)}) — imaš {g.h.picks.f}</span>
                  <span><button className="stbtn" disabled={bid.f <= 0} onClick={() => setBid({ ...bid, f: bid.f - 1 })}>−</button> <b> {bid.f} </b> <button className="stbtn" disabled={bid.f >= g.h.picks.f} onClick={() => setBid({ ...bid, f: bid.f + 1 })}>+</button></span>
                </div>
                <div className="stepper"><span><Ico k="s" s={15} /> Pick 2. kroga (vreden {PV.s + (g.h.coach === "okc" ? 1 : 0)}) — imaš {g.h.picks.s}</span>
                  <span><button className="stbtn" disabled={bid.s <= 0} onClick={() => setBid({ ...bid, s: bid.s - 1 })}>−</button> <b> {bid.s} </b> <button className="stbtn" disabled={bid.s >= g.h.picks.s} onClick={() => setBid({ ...bid, s: bid.s + 1 })}>+</button></span>
                </div>
                {g.h.picks.w > 0 && (
                  <div className="stepper"><span><Ico k="w" s={15} /> Pick swap (vreden {PV.w + (g.h.coach === "okc" ? 1 : 0)} — ob zmagi zamenjaš svoj najboljši pick za AI-jev najslabši)</span>
                    <span><button className="stbtn" onClick={() => setBid({ ...bid, w: bid.w ? 0 : 1 })}>{bid.w ? "✓" : "+"}</button></span>
                  </div>
                )}
                <div className="bidsum">Tvoja ponudba: {bidValC(bid, g.h.coach)}</div>
                {g.revealAiBid != null
                  ? <div className="bidsum" style={{ background: "#efe6fb", color: "#3a2a5c" }}>📞 AI-jeva ponudba: <b>{g.revealAiBid}</b> — preseži jo!</div>
                  : g.h.calls.includes("zadnja") && <button className="abtn ghost" style={{ width: "100%", marginTop: 6 }} onClick={() => { const v = bidValC(aiBidFor(aucCard, g), g.a.coach); setG({ ...g, revealAiBid: v, h: { ...g.h, calls: g.h.calls.filter((x, i) => i !== g.h.calls.indexOf("zadnja")) }, log: [...g.log, `📞 Zadnja ponudba: AI ponuja ${v}.`] }); SFX.card(); }}>📞 Zadnja ponudba <small>· razkrij AI-jevo ponudbo (−1 klic)</small></button>}
              </>
            )}
            <div className="mrow">
              {canSign(g.h.roster, aucCard) && <button className="abtn sign" style={{ flex: 1 }} disabled={bidValC(bid, g.h.coach) === 0} onClick={() => resolveAuction(bid)}>Oddaj ponudbo</button>}
              <button className="abtn ghost" style={{ flex: 1 }} onClick={() => resolveAuction(null)}>Odstopim</button>
            </div>
          </div>
        </div>
      )}

      {/* RAZPLET DRAŽBE — dvoboj zaprtih kuvert */}
      {aucReveal && (
        <div className="modal-bg">
          <div className={"modal" + (aucStage >= 2 ? " slam" : "")} onClick={() => setAucStage((s) => (s < 2 ? 2 : s))}>
            <h3><span className={aucStage >= 2 ? "gavelstrike" : ""}><Gavel s={20} /></span> Razplet dražbe: {surname(aucReveal.card.n)}</h3>
            <div className="env-row">
              <div className={"env" + (aucStage >= 2 && aucReveal.winner === "h" ? " win" : "")}>
                <div className="env-who">TI</div>
                <div className="env-bid">{pickStr(aucReveal.hB)}<b>{aucReveal.hV}</b></div>
                {aucStage >= 2 && aucReveal.winner === "h" && <div className="stamp"><span>PRODANO</span></div>}
              </div>
              <div className={"env" + (aucStage >= 2 && aucReveal.winner === "a" ? " win" : "")}>
                <div className="env-who">AI GM</div>
                {aucStage >= 1 ? <div className="env-bid">{pickStr(aucReveal.aB)}<b>{aucReveal.aV}</b></div> : <div className="env-seal" title="Zaprta kuverta …" />}
                {aucStage >= 2 && aucReveal.winner === "a" && <div className="stamp"><span>PRODANO</span></div>}
              </div>
            </div>
            {aucStage >= 2 && (
              <div className={"aucrev-res " + (aucReveal.winner === "h" ? "won" : aucReveal.winner === "a" ? "lost" : "")}>
                {aucReveal.winner === "h" ? <>✅ {aucReveal.card.n} je TVOJ!</> : aucReveal.winner === "a" ? <>❌ {aucReveal.card.n} gre AI-ju.</> : <>⚖️ Nihče ni dal dovolj — ostaja prost na trgu.</>}
              </div>
            )}
            {aucStage >= 2 && <div className="mrow"><button className="bigbtn" style={{ flex: 1 }} onClick={aucFinish}>Nadaljuj</button></div>}
            {aucStage < 2 && <div className="hint" style={{ textAlign: "center", opacity: .75 }}>Sodnik odpira kuverti … (tapni za preskok)</div>}
          </div>
          {aucStage === 2 && <div className="slam-flash" />}
        </div>
      )}

      {/* IZBIRA POGODBE OB PODPISU */}
      {signOpts && (
        <div className="modal-bg" onClick={() => setSignOpts(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            {(() => {
              const clen = signOpts.contract != null ? signOpts.contract : contractFor(signOpts);
              const clenTxt = clen === 1 ? "1 sezona" : clen === 2 ? "2 sezoni" : `${clen} sezone`;
              return <>
                <h3>✍️ Podpiši: {signOpts.n} <span className="h3-tag">za {clenTxt}</span></h3>
                <div className="pickbar">
                  <span className="pickbar-lbl">Tvoji picki</span>
                  <span className="pickbar-item"><Ico k="f" s={15} />×{g.h.picks.f}</span>
                  <span className="pickbar-item"><Ico k="s" s={15} />×{g.h.picks.s}</span>
                  {g.h.picks.w > 0 && <span className="pickbar-item"><Ico k="w" s={15} />×{g.h.picks.w}</span>}
                </div>
                <div className="hint" style={{ margin: "0 0 10px" }}>Pick je <b>valuta</b>: tu popust na pogodbo, drugje dražba, rehab in izravnava trejda.</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <button className="signopt" style={{ background: "#215c26" }} onClick={() => { setSignOpts(null); sign(); }}>
                    <span className="signopt-main">Redna cena · <b>{signOpts.sal} M$</b></span>
                  </button>
                  {g.h.picks.f > 0 && (
                    <button className="signopt" style={{ background: "#3a2a5c" }} onClick={() => { setSignOpts(null); sign("f"); }}>
                      <span className="signopt-main">S pickom <Ico k="f" s={14} /> · <b>{Math.max(2, signOpts.sal - PICK_DISC.f)} M$</b> <span style={{ color: "#8fd694" }}>(−{signOpts.sal - Math.max(2, signOpts.sal - PICK_DISC.f)})</span></span>
                    </button>
                  )}
                  {g.h.picks.s > 0 && (
                    <button className="signopt" style={{ background: "#2a3a5c" }} onClick={() => { setSignOpts(null); sign("s"); }}>
                      <span className="signopt-main">S pickom <Ico k="s" s={14} /> · <b>{Math.max(2, signOpts.sal - PICK_DISC.s)} M$</b> <span style={{ color: "#8fd694" }}>(−{signOpts.sal - Math.max(2, signOpts.sal - PICK_DISC.s)})</span></span>
                    </button>
                  )}
                  <button className="signopt" style={{ background: "#152744", textAlign: "center", marginTop: 2 }} onClick={() => setSignOpts(null)}>
                    <span className="signopt-main" style={{ width: "100%", textAlign: "center" }}>Prekliči</span>
                  </button>
                </div>
              </>;
            })()}
          </div>
        </div>
      )}

      {/* INFO / OGLED KARTICE */}
      {inspect && (() => {
        const side = inspect.side;
        const isHand = side === "hand", isMarket = side === "market";
        const c = isMarket ? asDiscount(inspect.card) : inspect.card; // v trgu prikaži s popustom
        const mine = side === "h";
        const rosterSide = (side === "h" || side === "a") ? side : "h";
        const roster = g[rosterSide].roster;
        const isStarter = mine ? (g.h.starters[c.pos] === c.id && g.injured.h !== c.id) : side === "a" ? (aiProj.starters[c.pos] && aiProj.starters[c.pos].id === c.id) : false;
        const injured = (side === "h" || side === "a") && g.injured[side] === c.id;
        const fiveCards = side === "a" ? Object.values(aiProj.starters) : starterCards;
        const others = fiveCards.filter((x) => x.id !== c.id);
        const signable = (isHand || isMarket) && canSign(g.h.roster, c);
        const emptyP = POS.filter((p) => p !== c.pos && !g.h.roster.some((x) => x.pos === p));
        const whyNot = g.h.roster.length >= 10 ? "Roster je poln (10)." : posCount(g.h.roster, c.pos) >= 3 ? `Že 3 igralci na poziciji ${c.pos}.` : `Ostati mora prostor za: ${emptyP.join(", ")}.`;
        return (
          <div className="modal-bg" onClick={() => setInspect(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>{side === "a" ? "AI · " : isMarket ? "🟢 Trg · " : ""}{c.n} {isStarter ? "★" : ""}{injured ? " 🩹" : ""}</h3>
              <div className="auc-card"><PlayerCard c={c} onClick={() => {}} /></div>
              <ul>
                <li><b>{c.pos}</b> · {c.club} · <b>{c.age} let</b>{c.rookie ? " · ROOKIE" : ""} · <Ico k={c.tr} s={14} /> {TRAITS[c.tr].n}</li>
                <li><b style={{ color: careerPhase(c.age).col }}>{careerPhase(c.age).ico} {careerPhase(c.age).label}</b> — {agingOutlook(c.age)}</li>
                <li>OVR <b>{c.ovr}</b> · vpliv {c.pm >= 0 ? "+" : ""}{c.pm} · plača {c.disc ? `${c.sal} M$ (popust −25 %, prej ${c.origSal})` : `${c.sal} M$`}</li>
                <li>V peterki <b>{spts(c)}</b> tč · na klopi {Math.floor(c.ovr / 2)} tč.</li>
                {c.rookie && <li className="pot" style={{ color: ROOK_TIER[c.tier].col }}><Ico k={c.tier} s={14} /> {ROOK_TIER[c.tier].n} · potencial {c.potLow}–{c.potHigh} — {ROOK_TIER[c.tier].job}.{c.hook && HOOKS[c.hook] ? ` ⭑ ${HOOKS[c.hook].n}: ${HOOKS[c.hook].d}.` : ""}</li>}
                {(side === "h" || side === "a") && !injured && <li>Prispevek {mine ? "tvoji" : "AI"} ekipi zdaj: <b className={contribOf(roster, c, side) >= 0 ? "" : "red"}>{contribOf(roster, c, side) >= 0 ? "+" : ""}{contribOf(roster, c, side)}</b> tč (koliko bi izgubil brez njega).</li>}
              </ul>
              {!injured && others.length > 0 && <UnlockPreview card={c} sCards={others} />}
              {(isHand || isMarket) && (
                <div className="addbox">
                  {signable
                    ? <><div className="addval">Doda tvoji ekipi ≈ <b>{(() => { const v = addValue(g.h.roster, c, "h"); return (v >= 0 ? "+" : "") + v; })()}</b> tč</div><div className="addstand">Trenutni izid — Ti <b>{proj.total}</b> · AI <b>{aiProj.total}</b></div></>
                    : <div className="addval" style={{ color: "#b23b2e" }}>Ne moreš podpisati: {whyNot}</div>}
                </div>
              )}
              <div className="mrow" style={{ marginTop: 10 }}>
                {isMarket && <button className="abtn sign" style={{ flex: 1 }} disabled={!signable || !drawPhase} onClick={() => { setInspect(null); takeMarket(inspect.card); }}>Vzemi s popustom ({c.sal} M$)</button>}
                {isHand && actPhase && <button className="abtn sign" style={{ flex: 1 }} disabled={!signable || (g.h.signedTurn || 0) >= SIGN_LIMIT} onClick={() => { setInspect(null); const canDisc = c.sal > 2 && (g.h.picks.f > 0 || g.h.picks.s > 0); canDisc ? setSignOpts(c) : sign(); }}>Podpiši ✍️</button>}
                {isHand && actPhase && <button className="abtn drop" style={{ flex: 1 }} onClick={() => { setInspect(null); discard(); }}>Odvrzi 🗑️</button>}
                {mine && !injured && !isStarter && <button className="abtn sign" style={{ flex: 1 }} onClick={() => { setStarter(c); setInspect(null); }}>★ V peterko</button>}
                {mine && !injured && isStarter && <button className="optbtn" style={{ flex: 1 }} onClick={() => { const st = { ...g.h.starters }; const alt = g.h.roster.filter((x) => x.pos === c.pos && x.id !== c.id && g.injured.h !== x.id).sort((x, y) => spts(y) - spts(x))[0]; if (alt) st[c.pos] = alt.id; else delete st[c.pos]; setG({ ...g, h: { ...g.h, starters: st } }); setInspect(null); say(`${surname(c.n)} gre na klop.`); }}>Na klop</button>}
                {mine && injured && <button className="abtn sign" style={{ flex: 1 }} disabled={g.h.picks.s < rehabCostFor(g, "h")} onClick={() => { setInspect(null); setRehab(c); }}>🩹 Rehab ({rehabCostFor(g, "h")}× 🥈)</button>}
                {mine && !injured && myTurn && <button className="abtn drop" style={{ flex: 1 }} onClick={() => { setInspect(null); setWaiveTarget(c); }}>✂️ Waive</button>}
                <button className="abtn ghost" style={{ flex: 1 }} onClick={() => setInspect(null)}>{isMarket ? "Prekliči" : "Zapri"}</button>
              </div>
            </div>
          </div>
        );
      })()}

      {trade && (
        <div className="modal-bg" onClick={() => setTrade(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>🔄 Predlagaj trejd</h3>
            <div className="lbl">1 · Koga daš (tvoj roster)</div>
            <div className="tr-col">{g.h.roster.map((c) => <PlayerCard key={c.id} c={c} mini selected={trade.give === c.id} onClick={() => setTrade({ ...trade, give: c.id })} />)}</div>
            <div className="lbl" style={{ marginTop: 10 }}>2 · Koga hočeš (AI roster)</div>
            <div className="tr-col">{g.a.roster.map((c) => <PlayerCard key={c.id} c={c} mini selected={trade.get === c.id} onClick={() => setTrade({ ...trade, get: c.id })} />)}</div>
            <div className="lbl" style={{ marginTop: 10 }}>3 · Dodaj picke za izravnavo (neobvezno)</div>
            <div className="stepper"><span>🥇 1. krog — imaš {g.h.picks.f} <small>(obdržati moraš 1)</small></span>
              <span><button className="stbtn" disabled={trade.f <= 0} onClick={() => setTrade({ ...trade, f: trade.f - 1 })}>−</button> <b> {trade.f} </b> <button className="stbtn" disabled={trade.f >= g.h.picks.f - 1} onClick={() => setTrade({ ...trade, f: trade.f + 1 })}>+</button></span>
            </div>
            <div className="stepper"><span>🥈 2. krog — imaš {g.h.picks.s}</span>
              <span><button className="stbtn" disabled={trade.s <= 0} onClick={() => setTrade({ ...trade, s: trade.s - 1 })}>−</button> <b> {trade.s} </b> <button className="stbtn" disabled={trade.s >= g.h.picks.s} onClick={() => setTrade({ ...trade, s: trade.s + 1 })}>+</button></span>
            </div>
            {trade.give && trade.get && (() => {
              const give = g.h.roster.find((c) => c.id === trade.give), get = g.a.roster.find((c) => c.id === trade.get);
              if (!give || !get) return null;
              const after = [...g.h.roster.filter((c) => c.id !== give.id), get];
              const delta = rScore(after, "h") - rScore(g.h.roster, "h");
              return <div className="addbox"><div className="addval">Če AI sprejme, učinek nate: <b className={delta >= 0 ? "" : "red"}>{delta >= 0 ? "+" : ""}{delta}</b> tč</div><div className="addstand">Daš {surname(give.n)} ({give.ovr}) → dobiš {surname(get.n)} ({get.ovr})</div></div>;
            })()}
            <div className="mrow">
              <button className="abtn sign" style={{ flex: 1 }} disabled={!trade.give || !trade.get} onClick={submitTrade}>Pošlji ponudbo</button>
              <button className="abtn ghost" style={{ flex: 1 }} onClick={() => setTrade(null)}>Premislim si</button>
            </div>
          </div>
        </div>
      )}

      {showIntro && (
        <div className="modal-bg" onClick={closeIntro}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            {introPage === 1 ? <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><h3 style={{ margin: 0 }}>Cilj: zgradi dinastijo</h3><button className="linkbtn" style={{ marginTop: 0, fontSize: 14 }} onClick={closeIntro}>Preskoči ✕</button></div>
              <div className="step"><div className="stepn">🏆</div><p><b>Tekmuješ z rivalsko AI dinastijo.</b> Vsako sezono oba sestavita ekipo; boljša osvoji <b>naslov</b>. Po vseh sezonah zmaga tisti z <b>več naslovi</b> — premagaj rivala.</p></div>
              <div className="step"><div className="stepn">🌱</div><p><b>Razvij mlade.</b> V ustanovnem naboru dobiš 2 mlada temelja z nizkim OVR, ki skozi sezone <b>zrastejo v zvezdnike</b> — poceni jedro prihodnosti.</p></div>
              <div className="step"><div className="stepn">◆</div><p><b>Ujemi svoje okno.</b> Igralci se starajo (↗ V vzponu → ◆ Vrhunec → ↓ Upad). Ko je jedro v vrhuncu, greš <b>all-in</b> za naslov.</p></div>
              <div className="step"><div className="stepn">🎰</div><p><b>Draft loterija:</b> kdor sezono izgubi, v prestopnem roku <b>izbira prvi</b>. Slaba sezona ti prinese boljši izbor — <b>tankiranje</b> je veljavna strategija.</p></div>
              <div className="mrow"><button className="bigbtn" style={{ flex: 1, fontSize: 15 }} onClick={() => setIntroPage(2)}>Naprej: kako poteka poteza →</button></div>
            </> : <>
              <h3>Kako poteka poteza</h3>
              <div className="step"><div className="stepn">1</div><p><b>Vzemi karto:</b> s <b>skritega kupa</b> (na slepo) ali med <b>prostimi igralci</b> (vrhnjo prosto, globljo s trade-om).</p></div>
              <div className="step"><div className="stepn">2</div><p><b>Podpiši do {SIGN_LIMIT} igralca na potezo</b> (roster do 10, max 3 na pozicijo). Tapni igralca v rosterju, da postane <b>štartar</b>.</p></div>
              <div className="step"><div className="stepn">3</div><p><b>Odvrzi 1 karto</b> — konec poteze. Kar odvržeš, lahko AI pobere!</p></div>
              <div className="step"><div className="stepn"><Gavel s={18} style={{ filter: "drop-shadow(0 0 1px rgba(255,255,255,.9))" }} /></div><p><b>Dražbe:</b> ko igralec z OVR {AUCTION_OVR}+ pristane med prostimi, oba GM-ja skrivno ponudita <b>draft picke</b>. Neporabljeni picki ob koncu sezone štejejo točke — vsaka dražba stane prihodnost!</p></div>
              <div className="step"><div className="stepn">⇄</div><p><b>Trejd:</b> enkrat na potezo lahko AI-ju ponudiš menjavo igralcev 1:1 in dodaš picke za izravnavo.</p></div>
              <div className="mrow" style={{ gap: 8 }}>
                <button className="abtn ghost" onClick={() => setIntroPage(1)}>← Nazaj</button>
                <button className="bigbtn" style={{ flex: 1 }} onClick={closeIntro}>Razumem, gremo!</button>
              </div>
            </>}
          </div>
        </div>
      )}

      {/* ⓘ POMOČ ZA PANELE */}
      {help && (
        <div className="modal-bg" onClick={() => setHelp(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            {help === "kupi" && <>
              <h3>Trg — kako vzameš karto</h3>
              <ul>
                <li><b>🂠 Skriti kup:</b> vlečeš na slepo, igralec pride po polni plači.</li>
                <li><b>🟢 AI-jev odpad:</b> znana karta s <b>popustom −25 % na plačo</b> — cenejša pogodba, enak OVR in vpliv.</li>
                <li><b><Gavel s={14} /> Dražba:</b> igralec z OVR {AUCTION_OVR}+ med prostimi sproži skrivno dražbo z draft picki.</li>
                <li><b>🔴 Tvoj odpad:</b> kar odvržeš ali waivaš, lahko AI pobere s popustom — pazi, kaj mu podariš.</li>
                <li><b>🔄 Trejd:</b> 1× na potezo predlagaš menjavo 1:1 (+ picki za izravnavo). <b>✂️ Waive:</b> odpustiš podpisanega, ostane dead cap.</li>
              </ul>
            </>}
            {help === "roster" && <>
              <h3>Roster & točke</h3>
              <ul>
                <li><b>★ Prva peterka:</b> štartar šteje <b>OVR + 2× vpliv</b> (zeleno/rdeče število); klop le pol OVR. Tapni igralca → »V peterko«.</li>
                <li><b>⚡ Peterka</b> samodejno postavi najboljšo peterko.</li>
                <li><b>🩹 Poškodovan</b> igralec ne more v peterko — prvi rehab v franšizi stane 1× 🥈, vsak naslednji 2× 🥈 (tapni ga).</li>
                <li><b>Plačna masa:</b> nad {CAP} M$ plačuješ davek v točkah (−1/M, globlje v apron −2/M).</li>
                <li>Roster zaključiš pri 10 igralcih — vsaj 1 na vsaki poziciji, max 3 na pozicijo.</li>
                {g.h.coach && <li><b>🧢 {coachOf(g.h.coach).n}:</b> {coachOf(g.h.coach).d}{g.h.coach === "lue" && myEff !== salaryOf(g.h.roster) ? ` (plače ${salaryOf(g.h.roster)} → ${myEff} M$)` : ""}</li>}
              </ul>
            </>}
            {help === "roka" && <>
              <h3>Roka</h3>
              <ul>
                <li>Tapni karto → spodaj <b>PODPIŠI</b> (največ {SIGN_LIMIT} na potezo) ali <b>ODVRZI</b> (to konča potezo).</li>
                <li>Ob podpisu lahko vložiš pick za <b>trajni popust</b> na plačo.</li>
                <li>Vsaka karta v roki ob koncu runde šteje <b>−5</b> — ne kopiči jih.</li>
              </ul>
            </>}
            <div className="mrow"><button className="abtn ghost" style={{ flex: 1 }} onClick={() => setHelp(null)}>Zapri</button></div>
          </div>
        </div>
      )}

      {showRules && <Rules onClose={() => setShowRules(false)} />}
    </div>
  );
}

function Rules({ onClose }) {
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Pravila</h3>
        <ul>
          <li><b>Cilj:</b> roster 10 igralcev (max 3 na pozicijo), več točk kot AI. Sezona do {TARGET} točk.</li>
          <li><b>🏀 Vseh 5 pozicij:</b> podpisuješ svobodno, a roster lahko <b>zaključiš (10 igralcev) šele, ko imaš vsaj 1 igralca na vsaki poziciji</b> (PG, SG, SF, PF, C). Igra te samodejno ustavi, če bi podpis ali trejd pustil pozicijo, ki je ne bi mogel več zapolniti. Isto velja za AI.</li>
          <li><b>🧢 Coach:</b> na začetku vsake runde izbereš enega od 6 coachev — vsak da drugačen bonus (popust na zvezdnike, obrambne točke, močnejšo klop, boljše picke …). AI dobi naključnega izmed preostalih.</li>
          <li><b>🏗️ Ustanovni nabor (edini draft):</b> na začetku dinastije draftaš <b>2 mlada temelja</b> — in to je edini draft v celi dinastiji (vsako poletje NI novih rookiejev). Zato sta tvoja temelja dragocena: neguješ ju vseh 5 sezon. Vsak ima tier: 💎 <b>Elitni</b> (najvišji strop, a na klopi brez minut postane 😤), 🌱 <b>Projekt</b> (raste tudi s klopi ob ⭐ vodji ali J.J. Redicku), 🔒 <b>Pripravljen</b> (zaigra takoj). Vsak ima <b>⭑ kavelj</b> (posebnost). Potencialni razpon je viden, dejanski razvoj je loterija znotraj njega.</li>
          <li><b>🌱 Večletni razvoj + ☀️ poletna liga:</b> mladi (≤23) rastejo proti stropu <b>vsako sezono, dokler dobivajo minute</b>: <b>★ prva peterka</b> najhitreje, <b>🎓 klop</b> srednje. Če surovca še nočeš igrati (in bi ti kradel točke), ga pošlješ v <b>☀️ poletno ligo</b> (odločitev v prestopnem roku): tisto sezono ni na voljo in <b>sprosti mesto v rosterju</b>, a še vedno počasi raste. Igranje mladca stane točke zdaj, a ker ni novih draftov in veterani hitro starajo, je razvit lasten core edina vzdržna pot do dinastije.</li>
          <li><b>🩹 Poškodbe:</b> po vsakem krogu je ~12 % možnost (📋 pravilo lige lahko spremeni), da se naključen podpisani igralec poškoduje do konca runde — ne more v prvo peterko, na klopi šteje normalno. Rehab ga takoj pozdravi (tapni poškodovanca): prvi v franšizi stane 1× 🥈, vsak naslednji 2× 🥈 (🩺 Medicinski center pocenili). Klic 🛡️ Zavarovalna polica ga izniči zastonj. Največ 1 aktivna poškodba na GM-a.</li>
          <li><b>Poteza:</b> 1) vzemi 1 karto (skriti kup na slepo ALI karto iz AI-jevega odpada s popustom), 2) podpiši <b>največ {SIGN_LIMIT} igralca</b> (enako velja za AI), 3) odvrzi 1 karto. Omejitev podpisov pomeni: včasih se splača čakati na boljšega — a karta, ki jo odvržeš, lahko konča pri AI-ju!</li>
          <li><b>📻 Medsezonska drama:</b> po vsakem obračunu sezone te čaka dogodek z odločitvijo (podcast drama, rookie zid, poslovilna turneja …). Izbire so varne ali tvegane — posledice (vpliv, OVR, picki, poškodbe, celo nova vloga igralca) neseš v novo sezono.</li>
          <li><b>🔖 Ugodne pogodbe:</b> plače v kupu se vsako rundo/sezono <b>na novo naključno določijo</b> — ~12 igralcev dobi 🔖 ugodno pogodbo (55–70 % tržne cene), ostali so bliže tržni. Kradljivci so vsakič drugi, zato se kupa ne da naučiti na pamet.</li>
          <li><b>♻️ Odpadi (kaj se zgodi z discardi):</b> tvoji odvrženi in waivani igralci gredo v <b>tvoj odpad</b>, iz katerega jih AI lahko pobere s <b>popustom −25 % na plačo</b> — zato pazi, da mu ne odvržeš igralca, ki mu točno paše. AI-jevi odpadi so na voljo <b>tebi</b> s popustom. Popust pomeni cenejšo plačo (manj davka), OVR in vpliv ostaneta.</li>
          <li><b>Draft picki:</b> pick je valuta — »trejdaš« ga za <b>popust pri podpisu</b> (🥇 −14 M$, 🥈 −6 M$), <b>rehab</b> poškodovanca, ponudbo na <b>dražbi</b> ali izravnavo trejda. Vsak GM začne rundo z 2× 🥇 (vreden {PV.f}), 3× 🥈 ({PV.s}) in 1× 🔁 pick swap ({PV.w} v dražbi). Neporabljeni 🥇/🥈 ob koncu runde štejejo točke — a <b>pametno porabljen pick je praviloma vreden precej več</b> kot pick v žepu.</li>
          <li><b><Gavel s={14} /> Dražba:</b> ko igralec z OVR {AUCTION_OVR}+ pristane med prostimi igralci, oba GM-ja skrivno ponudita picke. Višja ponudba igralca takoj podpiše; picki zmagovalca so porabljeni, poraženec obdrži svoje. Pick swap ob zmagi zamenja tvoj najboljši preostali pick za nasprotnikovega najslabšega.</li>
          <li><b>🔄 Trejd:</b> enkrat <b>na vsako svojo potezo</b> predlagaš AI-ju menjavo podpisanih igralcev 1:1, s picki kot izravnavo. AI sprejme, če je zanj vrednost dovolj dobra.</li>
          <li><b>☎️ ROLODEX (klici):</b> držiš do <b>3 potrošne karte-klice</b> in sam izbereš trenutek igranja med sezono (pas pod tvojim rosterjem). Nekateri se igrajo takoj (Hitra poteza, Prišepnjen popust …), drugi kot <b>reakcija</b> v svojem oknu (🛡️ Zavarovalna polica ob poškodbi, 📞 Zadnja ponudba med dražbo). Klic <b>dobiš ob začetku sezone</b>, kot <b>tolažbo ob izgubljeni dražbi</b> in na <b>roku za prestope</b>. Največ 1 klic na svojo potezo. <b>AI ima svoj Rolodex</b> (☎️ N ob njegovem imenu) in klice tudi igra.</li>
          <li><b>⏰ Rok za prestope:</b> ko prvi GM napolni <b>8/10</b> rosterja, oba dobita priložnost — izbereš 1 od 3 klicev ali +2🧱 v sklad.</li>
          <li><b>🧱 SKLAD in 🏗️ Infrastruktura:</b> 🧱 sklad služiš z <b>igranjem sezone</b> (zmaga, razviti temelji, cilj lastnika) in z <b>žetvijo neporabljenih pickov</b> v prestopnem roku. V prestopnem roku ga vlagaš v <b>franšizno infrastrukturo</b> (Trening center, Akademija, Medicinski …) — vsaka linija ima 3 ravni (L3 skrit do L2) in <b>trajno spremeni pravila tvoje ekonomije</b> (hitrejši razvoj mladih, blažje staranje, cenejši rehab, bonus točke). AI gradi simetrično (🏗️ N ob imenu).</li>
          <li><b>👔 Pričakovanja lastnika:</b> po 1. sezoni lastnik postavi cilj, ki raste <b>+12 % vsako sezono</b>. Dosežen → +2🧱 + klic; zgrešen → obrezan proračun (−1🧱). Cilj vidiš med sezono (»👔 cilj N«).</li>
          <li><b>📋 Pravila lige:</b> vsako sezono velja <b>en proceduralni twist</b> za oba GM-a (razkrit v prestopnem roku, da gradiš z mislijo nanj): več/manj poškodb, hitrejši razvoj mladih, bogatejši sklad, dodatni klic ali pick. Jedro prejšnje sezone tako ni več samodejno optimalno.</li>
          <li><b>✂️ Waive:</b> podpisanega igralca lahko odpustiš med proste igralce (kjer ga lahko pobere AI, superzvezdnik pa sproži dražbo). Plača pade iz plačne mase, a ostane <b>dead cap: četrtina plače (najmanj 3 M$)</b> do konca runde — šteje v davek in Moneyball.</li>
          <li><b>Prva peterka</b> (tap na igralca): štartar šteje <b>OVR + 2× vpliv</b> (zeleno/rdeče število na karti). Klop šteje OVR÷2 — zato je vpliv pomemben samo pri štartarjih.</li>
          <li><b>Lastnosti:</b> 🎯 2+ snajperja v peterki +10 · 🛡️ 2+ branilca +10 · 🧠 organizator +8 · 🔥 najboljši šesti mož na klopi šteje poln OVR + doda svoj vpliv · ⭐ vodja v rosterju +8.</li>
          <li><b>Kemija:</b> klubski dvojec +10 (do 3×) · Big Three (3× OVR 90+ v rosterju) +20 · <b>🌟 Superteam (3 štartarji z OVR 93+) +35</b> · Moneyball (poln roster pod 85 % capa — 1. sezona {Math.round(CAP * 0.85)} M$, prag raste s capom) +25 · Dončić v peterki +5 🇸🇮.</li>
          <li><b>💸 Progresivni davek:</b> prvih {APRON} M$ nad plačnim limitom ({CAP} M$ v 1. sezoni, <b>raste 5 %/sezono</b> — enako kot plače) stane −1 točko/M$ (mehki davek), vsak milijon naprej pa −2 (apron). Svoje igralce podaljšaš z −15 % zvestobe (Bird pravica) — razen zvezdnikov 90+ pri 30+ letih, ki zahtevajo polno ceno. Superteam pot: 3 superzvezdniki + poceni klop se z bonusom +35 lahko splača kljub davku!</li>
          <li><b>Kazni:</b> manjkajoč igralec −20 · prazna pozicija −10 · karta v roki −5. Prvi zaključen roster +20.</li>
        </ul>
        <div className="mrow"><button className="abtn ghost" style={{ flex: 1 }} onClick={onClose}>Zapri</button></div>
      </div>
    </div>
  );
}
