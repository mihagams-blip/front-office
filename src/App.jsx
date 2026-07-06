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
  ["Jamal Murray","Denver","PG",46,88,5,"SN"],
  ["Ja Morant","Memphis","PG",39,88,2,"OR"],
  ["Trae Young","Atlanta","PG",46,88,-1,"OR"],
  ["Immanuel Quickley","Toronto","PG",33,84,0,"SN"],
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
  ["Devin Booker","Phoenix","SG",54,92,1,"SN"],
  ["Jaylen Brown","Boston","SG",53,91,4,"BR"],
  ["Tyrese Maxey","Philadelphia","SG",38,90,2,"SN"],
  ["Jalen Williams","Oklahoma City","SG",7,90,9,"BR"],
  ["Amen Thompson","Houston","SG",10,88,7,"BR"],
  ["Derrick White","Boston","SG",28,86,6,"BR"],
  ["Austin Reaves","LA Lakers","SG",14,86,3,"OR"],
  ["Zach LaVine","Sacramento","SG",48,85,-2,"SN"],
  ["Josh Giddey","Chicago","SG",25,85,1,"OR"],
  ["Christian Braun","Denver","SG",5,84,5,"BR"],
  ["Norman Powell","Miami","SG",21,84,2,"SN"],
  ["Cam Thomas","Brooklyn","SG",6,83,-2,"SM"],
  ["Malik Monk","Sacramento","SG",18,82,0,"SM"],
  ["Quentin Grimes","Philadelphia","SG",8,82,1,"SN"],
  ["Anfernee Simons","Boston","SG",27,82,-1,"SN"],
  ["Klay Thompson","Dallas","SG",17,80,-1,"SN"],
  ["Malik Beasley","Detroit","SG",6,80,0,"SN"],
  ["Isaiah Joe","Oklahoma City","SG",6,80,2,"SN"],
  ["Max Christie","Dallas","SG",8,80,1,"BR"],
  ["Buddy Hield","Golden State","SG",9,79,0,"SN"],
  ["Gradey Dick","Toronto","SG",6,79,-1,"SN"],
  // ---- SF (23) ----
  ["Jayson Tatum","Boston","SF",54,95,7,"SN"],
  ["Kevin Durant","Houston","SF",55,93,3,"SN"],
  ["LeBron James","LA Lakers","SF",53,93,4,"VD"],
  ["Kawhi Leonard","LA Clippers","SF",50,92,4,"BR"],
  ["Jimmy Butler","Golden State","SF",54,90,4,"VD"],
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
  ["Andrew Wiggins","Miami","SF",28,83,0,"BR"],
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
  ["Zion Williamson","New Orleans","PF",39,87,-1,"OR"],
  ["Scottie Barnes","Toronto","PF",40,87,0,"OR"],
  ["Lauri Markkanen","Utah","PF",46,86,-2,"SN"],
  ["Julius Randle","Minnesota","PF",33,85,2,"OR"],
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
  ["Kyle Kuzma","Milwaukee","PF",22,79,-2,"SN"],
  // ---- C (24) ----
  ["Nikola Jokić","Denver","C",55,99,13,"OR"],
  ["Victor Wembanyama","San Antonio","C",13,96,10,"BR"],
  ["Joel Embiid","Philadelphia","C",55,90,1,"VD"],
  ["Chet Holmgren","Oklahoma City","C",14,90,8,"BR"],
  ["Karl-Anthony Towns","New York","C",53,90,4,"SN"],
  ["Alperen Şengün","Houston","C",34,90,5,"OR"],
  ["Bam Adebayo","Miami","C",37,89,4,"BR"],
  ["Domantas Sabonis","Sacramento","C",42,88,1,"OR"],
  ["Ivica Zubac","LA Clippers","C",18,86,5,"BR"],
  ["Jarrett Allen","Cleveland","C",20,86,4,"BR"],
  ["Rudy Gobert","Minnesota","C",35,85,4,"BR"],
  ["Isaiah Hartenstein","Oklahoma City","C",28,84,6,"SM"],
  ["Walker Kessler","Utah","C",4,84,5,"BR"],
  ["Nic Claxton","Brooklyn","C",27,83,0,"BR"],
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
const ROOK_TIER = {
  safe: { ico: "🔒", n: "Varen", col: "#2f8f4e" },
  proj: { ico: "🌱", n: "Projekt", col: "#a8781a" },
  elite: { ico: "💎", n: "Elitni", col: "#7a4fd0" },
};
// draft 2026 prospekti (pozicije/ocene so ocena) — [ime, pos, plača, OVR zdaj, vpliv, lastnost, tier, potencial min, max, starost]
const ROOKIES_RAW = [
  ["AJ Dybantsa", "SF", 8, 74, 2, "SN", "elite", 84, 95, 19],
  ["Darryn Peterson", "SG", 7, 74, 3, "SN", "elite", 83, 94, 19],
  ["Cameron Boozer", "PF", 6, 73, 4, "VD", "elite", 82, 93, 19],
  ["Kingston Flemings", "PG", 5, 71, 3, "OR", "proj", 76, 91, 19],
  ["Nate Ament", "SF", 4, 70, 1, "SN", "proj", 74, 92, 19],
  ["Darius Acuff", "PG", 4, 71, 1, "OR", "proj", 75, 89, 19],
  ["Mikel Brown Jr.", "PG", 4, 70, 2, "OR", "proj", 74, 90, 19],
  ["Chris Cenac Jr.", "C", 3, 71, 3, "BR", "proj", 75, 90, 19],
  ["Meleek Thomas", "SG", 3, 70, 1, "SN", "proj", 74, 89, 18],
  ["Karim López", "SF", 3, 72, 2, "BR", "safe", 76, 84, 19],
  ["Yaxel Lendeborg", "PF", 3, 76, 3, "BR", "safe", 78, 84, 23],
  ["Koa Peat", "PF", 3, 72, 2, "BR", "safe", 76, 85, 19],
];
const ROOKIES = ROOKIES_RAW.map((r, i) => ({ id: 1000 + i, n: r[0], club: "Draft 2026", pos: r[1], sal: r[2], ovr: r[3], pm: r[4], tr: r[5], age: r[9], rookie: true, tier: r[6], potLow: r[7], potHigh: r[8] }));
const POS = ["PG", "SG", "SF", "PF", "C"];
const POS_COLOR = { PG: "#2563EB", SG: "#0D9488", SF: "#16A34A", PF: "#E07020", C: "#7C3AED" };
const CAP = 170, APRON = 20, MB = 145, TARGET = 500, AUCTION_OVR = 92;
const PV = { f: 3, s: 1, w: 2 }; // osnovna vrednost NEporabljenih pickov (množi se s slotom)
// slot = kje bi draftal; slabša ekipa (večji zaostanek) = boljši slot = dragocenejši pick
const baseStrOf = (p) => (p.starterPts || 0) + (p.benchPts || 0) + (p.syn ? p.syn.total : 0);
const slotTier = (gap) => gap >= 40 ? { label: "🎰 Loterija (top pick)", mult: 2.0, top: true } : gap >= 15 ? { label: "Zgodnji 1. krog", mult: 1.5, top: true } : gap > -15 ? { label: "Sredina 1. kroga", mult: 1.0, top: false } : { label: "Pozni pick", mult: 0.6, top: false };
// progresivni luksuzni davek: prvih APRON M$ nad limitom −1/M, naprej −2/M
const taxFor = (salary) => { const o = salary - CAP; if (o <= 0) return 0; return -(Math.min(o, APRON) + Math.max(0, o - APRON) * 2); };

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

// ============ COACHI ============
const COACHES = [
  { id: "lue", n: "Tyronn Lue", t: "Star whisperer", d: "Vsak igralec z OVR 93+ šteje 6 M$ manj v plačno maso." },
  { id: "thibs", n: "Tom Thibodeau", t: "Obramba pred vsem", d: "Vsak 🛡️ branilec v prvi peterki prinese +4." },
  { id: "kerr", n: "Steve Kerr", t: "Motion offense", d: "Spacing bonus je podvojen (+20), 🎯 snajperji na klopi štejejo 60 % OVR." },
  { id: "spo", n: "Erik Spoelstra", t: "Heat Culture", d: "Vsa klop šteje 60 % OVR namesto 50 %, Moneyball prag se dvigne na 155 M$." },
  { id: "okc", n: "Mark Daigneault", t: "Razvojni projekt", d: "Začneš z dodatnim 🥇 pickom, v dražbah vsak tvoj pick šteje +1." },
];
const coachOf = (id) => COACHES.find((c) => c.id === id);
const effSalary = (roster, coach) => roster.reduce((s, c) => s + c.sal - (coach === "lue" && c.ovr >= 93 ? 6 : 0), 0);
const benchPtsOf = (c, coach) => Math.floor(c.ovr * (coach === "spo" ? 0.6 : coach === "kerr" && c.tr === "SN" ? 0.6 : 0.5));
const mbFor = (coach) => (coach === "spo" ? 155 : MB);
const bidValC = (b, coach) => bidVal(b) + (coach === "okc" ? b.f + b.s + b.w : 0);

function lineupBonuses(cards, coach) {
  const t = (x) => cards.filter((c) => c.tr === x).length;
  return {
    spacing: t("SN") >= 2 ? (coach === "kerr" ? 20 : 10) : 0,
    wall: t("BR") >= 2 ? 10 : 0,
    dirigent: t("OR") >= 1 ? 8 : 0,
    coachPts: coach === "thibs" ? 4 * t("BR") : 0,
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

function scoreRoster(roster, handCount, isFirst, starterMap, picks, coach, injuredId, deadCap = 0) {
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
  const mbThr = mbFor(coach);
  const clubs = {};
  roster.forEach((c) => (clubs[c.club] = (clubs[c.club] || 0) + 1));
  const duoClubs = Object.keys(clubs).filter((k) => clubs[k] >= 2 && k !== "Vet. minimum" && k !== "Draft 2026");
  const duoPts = Math.min(duoClubs.length, 3) * 10;
  const big3 = roster.filter((c) => c.ovr >= 90).length >= 3 ? 20 : 0;
  const superteam = sCards.filter((c) => c.ovr >= 93).length >= 3 ? 35 : 0;
  const moneyball = roster.length === 10 && payroll < mbThr ? 25 : 0;
  const doncic = sCards.some((c) => c.n.includes("Dončić")) ? 5 : 0;
  const leader = roster.some((c) => c.tr === "VD") ? 8 : 0;
  const tax = taxFor(payroll);
  const missR = 10 - roster.length;
  const missPos = POS.filter((p) => !starters[p]).length;
  const pickPts = picks ? PV.f * picks.f + PV.s * picks.s : 0;
  const stackPos = POS.filter((p) => posCount(roster, p) >= 3);
  const stackPen = stackPos.length * -15;
  const total = starterPts + lb.spacing + lb.wall + lb.dirigent + lb.coachPts + syn.total + benchPts + sixthPts + duoPts + big3 + superteam + moneyball + doncic + leader + pickPts + tax + stackPen + missR * -20 + missPos * -10 + handCount * -5 + (isFirst ? 20 : 0);
  return { starters, bench, starterPts, ...lb, syn, benchPts, sixth, sixthPts, duoPts, duoClubs, big3, superteam, moneyball, doncic, leader, pickPts, picks, tax, stackPen, stackPos, salary, eff, payroll, deadCap: deadCap || 0, mbThr, coach, missR, missPos, handCount, isFirst, total };
}

function freshRound(round, totals) {
  const deck = shuffle(PLAYERS);
  const h = { hand: deck.splice(0, 8), roster: [], starters: {}, picks: { f: 2, s: 3, w: 1 }, tradeUsed: false, coach: null, deadCap: 0 };
  const a = { hand: deck.splice(0, 8), roster: [], picks: { f: 2, s: 3, w: 1 }, coach: null };
  const aDisc = [deck.pop()]; // trg prostih igralcev (ti kupuješ s popustom)
  const draftBoard = shuffle(ROOKIES).slice(0, 5).map((r, i) => ({ ...r, id: 2000 + round * 100 + i })); // deska prospektov za draft (unikatni id na rundo)
  return { round, totals, deck, hDisc: [], aDisc, draftBoard, draftUsed: { h: { f: 0, s: 0 }, a: { f: 0, s: 0 } }, h, a, injured: { h: null, a: null }, turn: "h", phase: "draw", finisher: null, finalFor: null, reshuffled: false, log: [`Runda ${round}: karte razdeljene. Najprej izberi coacha.`], result: null, aiTurns: 0, banner: null, champion: null, auction: null };
}

const contractFor = (c) => c.rookie ? 3 : c.age >= 30 ? 1 : 2; // rookie 3, veteran 1, ostali 2
const marketSal = (ovr) => Math.max(3, Math.min(58, Math.round((ovr - 70) * 2.1))); // tržna plača glede na OVR
const resignSal = (c) => Math.max(Math.round(c.sal * 1.25), marketSal(c.ovr)); // podaljšanje = tržna vrednost (zvezde/razviti dragi)
const ESCALATE = 1.06; // letni dvig plač obstoječim pogodbam

// franšizna sezona: season 1 = iz nič; season 2+ = ohrani roster (keepH/keepA)
function freshSeason(season, opts) {
  const { titles, keepH, keepA, seasons, cum, bonusPicks } = opts;
  const keptIds = new Set([...(keepH || []), ...(keepA || [])].map((c) => c.id));
  const deck = shuffle(PLAYERS.filter((p) => !keptIds.has(p.id)));
  const h = { hand: deck.splice(0, 8), roster: [...(keepH || [])], starters: {}, picks: { f: 2 + (bonusPicks ? bonusPicks.f : 0), s: 3 + (bonusPicks ? bonusPicks.s : 0), w: 1 }, tradeUsed: false, coach: null, deadCap: 0 };
  const a = { hand: deck.splice(0, 8), roster: [...(keepA || [])], picks: { f: 2, s: 3, w: 1 }, coach: null };
  const aDisc = [deck.pop()];
  const draftBoard = shuffle(ROOKIES).slice(0, 5).map((r, i) => ({ ...r, id: 2000 + season * 100 + i }));
  return { franchise: true, season, seasons: seasons || 3, cum: cum || { h: 0, a: 0 }, titles: titles || { h: 0, a: 0 }, round: season, totals: { h: 0, a: 0 }, deck, hDisc: [], aDisc, draftBoard, draftUsed: { h: { f: 0, s: 0 }, a: { f: 0, s: 0 } }, h, a, injured: { h: null, a: null }, turn: "h", phase: "draw", finisher: null, finalFor: null, reshuffled: false, log: [`SEZONA ${season}: ${keepH && keepH.length ? `obdržal si ${keepH.length} igralcev.` : "prazna ekipa."} Izberi coacha.`], result: null, aiTurns: 0, banner: null, champion: null, auction: null };
}

// ============ AI ============
function aiBidFor(card, g) {
  const none = { f: 0, s: 0, w: 0 };
  if (!canSign(g.a.roster, card)) return none;
  let maxBid = Math.round((spts(card) - 88) * 0.9);
  if (salaryOf(g.a.roster) + card.sal > CAP + APRON) maxBid -= 8;
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
  const a = { ...g.a, hand: [...g.a.hand], roster: [...g.a.roster] };
  let injured = { ...g.injured };
  if (injured.a && a.picks.s > 0) {
    const inj = a.roster.find((c) => c.id === injured.a);
    if (inj && spts(inj) >= 95) {
      a.picks = { ...a.picks, s: a.picks.s - 1 };
      injured = { ...injured, a: null };
      logs.push(`AI je s 🥈 pickom poslal ${inj.n} na rehab — spet je zdrav.`);
    }
  }
  const turnN = g.aiTurns + 1;
  let board = [...g.draftBoard];
  let draftUsed = g.draftUsed;
  // AI občasno draftira prospekta (1. krog), a največ 1 first na rundo
  if (board.length && a.picks.f > 0 && draftUsed.a.f < 1 && a.roster.length < 9 && a.hand.length < 9) {
    const aiBase = baseStrOf(scoreRoster(a.roster, 0, false, null, a.picks, a.coach, injured.a, 0));
    const hBase = baseStrOf(scoreRoster(g.h.roster, 0, false, null, g.h.picks, g.h.coach, g.injured.h, g.h.deadCap));
    const aiTop = slotTier(hBase - aiBase).top;
    const pool = board.filter((p) => p.tier !== "safe" && (p.tier !== "elite" || aiTop));
    const r1 = pool.sort((x, y) => (y.potLow + y.potHigh) - (x.potLow + x.potHigh))[0];
    if (r1 && (r1.potLow + r1.potHigh) / 2 >= 84) {
      board = board.filter((p) => p.id !== r1.id);
      a.picks = { ...a.picks, f: a.picks.f - 1 };
      draftUsed = { ...draftUsed, a: { ...draftUsed.a, f: draftUsed.a.f + 1 } };
      a.hand.push({ ...r1 });
      logs.push(`🎫 AI je draftal prospekta ${r1.n} (${r1.tier === "elite" ? "💎" : "🌱"}).`);
    }
  }
  const thrDraw = Math.max(58, 78 - 2 * turnN);
  // AI kupuje iz TVOJIH odpuščenih (hDisc) s popustom
  const market = hDisc.filter((c) => canSign(a.roster, c)).map((c) => asDiscount(c)).sort((x, y) => val(y) - val(x));
  const bestMarket = market[0];
  let drew;
  if (bestMarket && val(bestMarket) >= thrDraw) {
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
  const thr = Math.max(38, 68 - 2.5 * turnN) - (g.finalFor === "a" ? 40 : 0);
  let signed = true;
  while (signed && a.roster.length < 10) {
    signed = false;
    const cands = a.hand.filter((c) => canSign(a.roster, c)).sort((x, y) => val(y) - val(x));
    for (const c of cands) {
      const stack3 = posCount(a.roster, c.pos) === 2;
      const need = (salaryOf(a.roster) + c.sal > CAP + APRON ? thr + 15 : thr) + (stack3 ? 15 : 0);
      if (val(c) >= need || (g.finalFor === "a" && a.roster.length < 10)) {
        a.roster.push(g.franchise && c.contract == null ? { ...c, contract: contractFor(c) } : c); a.hand = a.hand.filter((x) => x.id !== c.id);
        logs.push(`AI je podpisal: ${c.n} (${c.pos}, OVR ${c.ovr}, ${c.sal} M$).`);
        signed = true; break;
      }
    }
  }
  let discardedCard = null;
  if (a.hand.length > 0) {
    const worst = [...a.hand].sort((x, y) => val(x) - val(y))[0];
    a.hand = a.hand.filter((x) => x.id !== worst.id);
    aDisc = [...aDisc, worst];
    discardedCard = worst;
    logs.push(`AI je odpustil: ${worst.n} (na voljo tebi s popustom).`);
  }
  return { ...g, deck, hDisc, aDisc, draftBoard: board, draftUsed, a, injured, reshuffled, aiTurns: turnN, log: [...g.log, ...logs], discardedCard };
}

// ============ VIZUALNE KOMPONENTE ============
function PosBadge({ p, sm }) {
  return <span className={"posb" + (sm ? " sm" : "")} style={{ background: POS_COLOR[p] }}>{p}</span>;
}

function PlayerCard({ c, onClick, selected, mini, starter, dim, ribbon, injured }) {
  if (mini) {
    return (
      <button className={"mini" + (starter ? " starter" : "") + (selected ? " msel" : "") + (injured ? " inj" : "")} style={{ borderTopColor: injured ? "#C0392B" : POS_COLOR[c.pos] }} onClick={onClick}>
        <div className="mini-top"><PosBadge p={c.pos} sm /><span>{injured ? "🩹" : c.rookie ? ROOK_TIER[c.tier].ico : TRAITS[c.tr].ico}</span><b>{c.ovr}</b></div>
        <div className="mini-name">{injured ? "🩹 " : starter ? "★ " : ""}{c.unhappy ? "😤" : ""}{surname(c.n)}</div>
        <div className="mini-sal">{injured ? "poškodovan" : `${starter ? `${spts(c)} tč · ` : ""}${c.sal} M$${c.contract != null ? ` · 📄${c.contract}` : ""}`}</div>
      </button>
    );
  }
  return (
    <button className={"card" + (selected ? " sel" : "") + (dim ? " dim" : "")} onClick={onClick} style={{ borderTopColor: POS_COLOR[c.pos] }}>
      {ribbon && <div className="ribbon">{ribbon}</div>}
      <div className="card-row"><PosBadge p={c.pos} /><span className="ovr">{c.ovr >= AUCTION_OVR ? "🔨" : ""}{c.ovr}</span></div>
      <div className="card-name">{c.unhappy ? "😤 " : ""}{c.n}</div>
      <div className="card-club">{c.club} · {c.age} let{c.rookie ? " · ROOKIE" : ""}{c.contract != null ? ` · 📄 ${c.contract} ${c.contract === 1 ? "sezona" : "sez."}` : ""}</div>
      <div className="trait">{TRAITS[c.tr].ico} {TRAITS[c.tr].n}</div>
      {c.rookie
        ? <div className="pot" style={{ color: ROOK_TIER[c.tier].col }}>{ROOK_TIER[c.tier].ico} {ROOK_TIER[c.tier].n} · potencial {c.potLow}–{c.potHigh}</div>
        : <div className="vals">v peterki <b>{spts(c)}</b> · klop {Math.floor(c.ovr / 2)}</div>}
      <div className="card-row btm">
        <span className="sal">{c.disc ? <><span className="oldsal">{c.origSal}</span> {c.sal} M$</> : `${c.sal} M$`}</span>
        <span className={"pm " + (c.pm >= 0 ? "pos" : "neg")}>vpliv {c.pm >= 0 ? "+" : ""}{c.pm}</span>
      </div>
    </button>
  );
}

function Picks({ p, dark }) {
  return <span className={"picks" + (dark ? " dark" : "")}>🥇×{p.f} 🥈×{p.s} {p.w ? "🔁×1" : ""}</span>;
}

function Scoreboard({ h, a, totalsH, totalsA }) {
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
  const lead = h - a;
  return (
    <div className="sb">
      <div className="sb-side">
        <div className="sb-team">TI</div>
        <div className="sb-num">{h}{d.h !== 0 && <span className={"sb-delta " + (d.h > 0 ? "up" : "down")}>{d.h > 0 ? "+" : ""}{d.h}</span>}</div>
        <div className="sb-season">sezona: {totalsH}</div>
      </div>
      <div className="sb-mid">
        <div className="sb-lbl">PROJEKCIJA RUNDE</div>
        <div className={"sb-lead " + (lead >= 0 ? "up" : "down")}>{lead === 0 ? "izenačeno" : lead > 0 ? `vodiš za ${lead}` : `zaostajaš za ${-lead}`}</div>
        <div className="sb-note">v živo · brez kazni za roko</div>
      </div>
      <div className="sb-side">
        <div className="sb-team">AI GM</div>
        <div className="sb-num">{a}{d.a !== 0 && <span className={"sb-delta " + (d.a > 0 ? "up" : "down")}>{d.a > 0 ? "+" : ""}{d.a}</span>}</div>
        <div className="sb-season">sezona: {totalsA}</div>
      </div>
    </div>
  );
}

function CapMeter({ salary }) {
  const pct = Math.min(100, (salary / 240) * 100);
  const capPct = (CAP / 240) * 100;
  const apronPct = ((CAP + APRON) / 240) * 100;
  const over = salary > CAP;
  const deep = salary > CAP + APRON;
  return (
    <div className="capm">
      <div className="capm-lbl"><span>Plačna masa</span><span className={over ? "red" : "green"}>{salary} / {CAP} M$ {over ? `→ davek ${taxFor(salary)}${deep ? " (apron!)" : " (mehki davek)"}` : "✓ pod limitom"}</span></div>
      <div className="capm-bar">
        <div className="capm-fill" style={{ width: pct + "%", background: deep ? "#8f1d12" : over ? "#D97706" : "#2E7D32" }} />
        <div className="capm-cap" style={{ left: capPct + "%" }} />
        <div className="capm-cap apron" style={{ left: apronPct + "%" }} />
      </div>
      <div className="capm-zones"><span>pod limitom −0/M</span><span>mehki davek −1/M</span><span>apron −2/M</span></div>
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
  }[coach]) : "🧢 Coach bonus.";
  const labelFor = { feeder: "🅿️ Hranilec", cover: "🛡️ Kritje zvezdnika", jam: "🧨 Zastoji" };
  if (r.syn) r.syn.items.forEach((it) => chips.push([`${labelFor[it.k]}: ${it.who}`, it.pts, it.txt]));
  if (r.spacing) chips.push(["🎯 Spacing", r.spacing, "🎯 Spacing: 2+ snajperja (🎯) v prvi peterki → +10 (s coachem Kerr +20)."]);
  if (r.wall) chips.push(["🛡️ Zid", r.wall, "🛡️ Obrambni zid: 2+ branilca (🛡️) v prvi peterki → +10."]);
  if (r.dirigent) chips.push(["🧠 Dirigent", r.dirigent, "🧠 Dirigent: vsaj en organizator (🧠) v prvi peterki → +8."]);
  if (r.coachPts) chips.push(["🧢 Coach", r.coachPts, coachExpl]);
  if (r.sixthPts) chips.push([`🔥 ${surname(r.sixth.n)} s klopi`, r.sixthPts, `🔥 Šesti mož: najboljši 🔥 na klopi šteje poln OVR (namesto pol) IN doda svoj vpliv (${r.sixth.pm >= 0 ? "+" : ""}${r.sixth.pm}). ${surname(r.sixth.n)} skupaj doda ${r.sixthPts}.`]);
  if (r.leader) chips.push(["⭐ Vodja", r.leader, "⭐ Vodja: igralec z lastnostjo ⭐ kjerkoli v rosterju → +8."]);
  if (r.duoPts) chips.push([`🤝 Dvojci ×${Math.min(r.duoClubs.length, 3)}`, r.duoPts, `🤝 Klubski dvojci: 2 igralca iz istega kluba → +10 (do 3 dvojci). Tvoji: ${r.duoClubs.slice(0, 3).join(", ")}.`]);
  if (r.big3) chips.push(["👑 Big Three", r.big3, "👑 Big Three: 3+ igralci z OVR 90+ v rosterju → +20."]);
  if (r.superteam) chips.push(["🌟 SUPERTEAM", r.superteam, "🌟 Superteam: 3 štartarji z OVR 93+ v prvi peterki → +35."]);
  if (r.moneyball) chips.push(["💰 Moneyball", r.moneyball, `💰 Moneyball: poln roster (10 igralcev) pod pragom plač (${r.mbThr || 145} M$) → +25.`]);
  if (r.doncic) chips.push(["🇸🇮 Dončić", r.doncic, "🇸🇮 Dončić v prvi peterki → +5."]);
  if (r.pickPts) chips.push(["🥇 Neporabljeni picki", r.pickPts, `🥇 Neporabljeni draft picki ob koncu runde: vsak 🥇 +${PV.f}, vsak 🥈 +${PV.s}. Namig: raje jih porabi za draft prospekta (gumb 🎫) — surov, a se razvije.`]);
  if (r.tax) chips.push(["💸 Luksuzni davek", r.tax, `💸 Luksuzni davek: plačna masa nad limitom 170 M$ — prvih 20 M$ čez po −1/M, nato po −2/M (apron). Tvoja masa: ${r.payroll} M$.`]);
  if (r.stackPen) chips.push([`🚫 Preveč na poziciji (${r.stackPos.join(", ")})`, r.stackPen, `🚫 Prenatrpana pozicija: 3 igralci na isti poziciji (${r.stackPos.join(", ")}) → −15 vsaka. Ne kopiči poceni globine — raje razporedi 2-2-2-2-2 ali vzemi manj, boljših.`]);
  if (!chips.length) return <div className="chips-empty">Še brez aktivnih bonusov — lovi lastnosti, klube in kombinacije peterke.</div>;
  return (
    <>
      <div className="chips-hint">👆 Tapni bonus za razlago točkovanja.</div>
      <div className="chips">{chips.map(([l, v, ex], i) => <button key={i} type="button" className={"chip" + (v < 0 ? " neg" : "")} title={ex} onClick={() => onExplain && onExplain(ex)}>{l} {v > 0 ? "+" : ""}{v}</button>)}</div>
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
      {r.coach && <div style={{ fontSize: 12, color: "#7a6a4f", marginBottom: 6 }}>🧢 {coachOf(r.coach).n} — {coachOf(r.coach).t}</div>}
      <div className="bd-five">
        {POS.map((p) => (
          <div key={p} className="bd-slot">
            <PosBadge p={p} sm />
            {r.starters[p] ? <span>{TRAITS[r.starters[p].tr].ico} {surname(r.starters[p].n)} <b>{spts(r.starters[p])}</b></span> : <span className="red">prazno −10</span>}
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
export default function App() {
  const [screen, setScreen] = useState("menu");
  const [g, setG] = useState(null);
  const [sel, setSel] = useState(null);
  const [toast, setToast] = useState(null);
  const [showRules, setShowRules] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const [bid, setBid] = useState({ f: 0, s: 0, w: 0 });
  const [trade, setTrade] = useState(null); // {give, get, f, s}
  const [reveal, setReveal] = useState(null); // karta, vlečena s skritega kupa
  const [rehab, setRehab] = useState(null); // poškodovan igralec za rehab
  const [waiveMode, setWaiveMode] = useState(false);
  const [waiveTarget, setWaiveTarget] = useState(null);
  const [inspect, setInspect] = useState(null); // {card, side} — info modal za igralca v rosterju
  const [draftOpen, setDraftOpen] = useState(false); // modal deske prospektov
  const [signOpts, setSignOpts] = useState(null); // izbira ob podpisu: redna cena ali s pickom
  const [offInfo, setOffInfo] = useState(null); // ogled karte v prestopnem roku
  const [offseason, setOffseason] = useState(null); // prestopni rok med sezonami
  const [lbName, setLbName] = useState("");
  const [lbSaved, setLbSaved] = useState(false);
  const [leaderboard, setLeaderboard] = useState(null); // null = še ne naloženo
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
    if (top && top.ovr >= AUCTION_OVR) { setBid({ f: 0, s: 0, w: 0 }); return { ...st, auction: { card: top, cont: "start" } }; }
    return st;
  };

  const start = () => { setG(freshRound(1, { h: 0, a: 0 })); setScreen("play"); setSel(null); setShowIntro(true); };
  const startFranchise = (seasons) => { setG(freshSeason(1, { titles: { h: 0, a: 0 }, keepH: [], keepA: [], seasons, cum: { h: 0, a: 0 } })); setScreen("play"); setSel(null); setShowIntro(true); setLbSaved(false); };
  const nextRound = () => { setG(freshRound(g.round + 1, g.totals)); setScreen("play"); setSel(null); };
  const goOffseason = () => {
    const R = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
    const ageReport = [];
    const ageRoster = (roster, coach, injuredId, side) => {
      const starterIds = new Set(Object.values(bestStarters(roster, coach, injuredId)));
      const kept = [];
      roster.forEach((c) => {
        const age = c.age + 1;
        let d = 0;
        if (c.age <= 23) d = starterIds.has(c.id) ? R(1, 3) : R(0, 2);       // mladi rastejo (minute → bolj)
        else if (c.age <= 30) d = R(-1, 1);                                   // najboljša leta: skoraj stabilno
        else if (c.age <= 33) d = -R(1, 3);                                   // pozna leta: blag upad
        else d = -R(2, 4);                                                    // veterani: hitrejši upad
        const ovr = Math.max(50, Math.min(99, c.ovr + d));
        const retired = (age >= 34 && ovr < 72) || age >= 41;
        if (Math.abs(d) >= 1 || retired) ageReport.push({ n: c.n, side, from: c.ovr, to: ovr, d, age, retired });
        if (!retired) kept.push({ ...c, age, ovr, developed: true });         // po prvi sezoni ne razvijaj več kot rookie
      });
      return kept;
    };
    const hAged = ageRoster(g.h.roster, g.h.coach, g.injured.h, "h");
    const aAged = ageRoster(g.a.roster, g.a.coach, g.injured.a, "a");
    const tick = (roster) => roster.map((c) => ({ ...c, contract: (c.contract ?? 1) - 1 }));
    const escalate = (c) => ({ ...c, sal: Math.round(c.sal * ESCALATE) });
    const hT = tick(hAged), aT = tick(aAged);
    const hExp = hT.filter((c) => c.contract <= 0), hKeepAuto = hT.filter((c) => c.contract > 0).map(escalate);
    const aExp = aT.filter((c) => c.contract <= 0), aKeepAuto = aT.filter((c) => c.contract > 0).map(escalate);
    let aRoster = [...aKeepAuto];
    aExp.sort((x, y) => val(y) - val(x)).forEach((c) => {
      const ns = resignSal(c);
      if (val(c) >= 58 && effSalary([...aRoster, { ...c, sal: ns }], g.a.coach) <= CAP + APRON + 15) aRoster.push({ ...c, sal: ns, contract: c.age >= 30 ? 1 : 2 });
    });
    // DRAFT LOTERIJA: poraženec sezone izbira prvi
    let draftClass = shuffle(ROOKIES).slice(0, 6).map((r, i) => ({ ...r, id: 3000 + g.season * 100 + i }));
    const humanFirst = g.result ? g.result.seasonWin !== "h" : true; // izgubil ali izenačeno → ti prvi
    let aiDraftPicks = [];
    if (!humanFirst) { // zmagal si → AI grabi najboljšega prospekta prvi
      const best = draftClass.filter((p) => p.tier !== "safe").sort((x, y) => (y.potLow + y.potHigh) - (x.potLow + x.potHigh))[0];
      if (best) { aiDraftPicks = [best]; draftClass = draftClass.filter((p) => p.id !== best.id); }
    }
    // "HOČEM VEN": nezadovoljni prek fita — zakopan zvezdnik, zastoj, zvezdnik po porazu
    const starterIdsH = new Set(Object.values(bestStarters(hAged.length ? hAged : [], g.h.coach, null)));
    const ballDom = hAged.filter((c) => isBallDom(c)).length;
    const lostSeason = g.result && g.result.seasonWin === "a";
    const unhappy = [];
    hAged.forEach((c) => {
      if (c.ovr >= 85 && !starterIdsH.has(c.id)) unhappy.push({ id: c.id, ovr: c.ovr, why: "zakopan na klopi (zvezdnik brez minut)" });
      else if (ballDom >= 3 && isBallDom(c) && c.ovr >= 88) unhappy.push({ id: c.id, ovr: c.ovr, why: "🧨 zastoj — preveč ball-dominantnih, hoče svojo ekipo" });
      else if (lostSeason && c.ovr >= 92 && c.age >= 28) unhappy.push({ id: c.id, ovr: c.ovr, why: "poraz sezone — zvezdnik v najboljših letih izgublja potrpljenje" });
    });
    unhappy.sort((x, y) => y.ovr - x.ovr).splice(2); // max 2 naenkrat (najvišja OVR)
    setOffseason({ hExp, hKeepAuto, aRoster, ageReport, draftClass, humanFirst, aiDraftPicks, hDraftPicks: [], hDraftUsed: { f: 0, s: 0 }, unhappy, sold: {}, bonusPicks: { f: 0, s: 0 }, decisions: Object.fromEntries(hExp.map((c) => [c.id, true])) });
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
      aRoster: offseason.aRoster.length < 10 && posCount(offseason.aRoster, c.pos) < 3 ? [...offseason.aRoster, { ...c, contract: 2 }] : offseason.aRoster,
    });
    say(`${surname(c.n)} prodan AI-ju za ${p.f ? p.f + "×🥇 " : ""}${p.s ? p.s + "×🥈" : ""} — picki pridejo naslednjo sezono.`);
  };
  const offDraft = (c) => {
    const rd = c.tier === "safe" ? 2 : 1;
    if ((rd === 1 ? offseason.hDraftUsed.f : offseason.hDraftUsed.s) >= 1) { say(`Ta krog si že draftal (max 1 first + 1 second).`); return; }
    setOffseason({ ...offseason, draftClass: offseason.draftClass.filter((x) => x.id !== c.id), hDraftPicks: [...offseason.hDraftPicks, c], hDraftUsed: { ...offseason.hDraftUsed, [rd === 1 ? "f" : "s"]: 1 } });
    say(`🎫 Draftal si ${surname(c.n)}! Priključi se ekipi naslednjo sezono.`);
  };
  const finalizeOffseason = () => {
    const resigned = offseason.hExp.filter((c) => offseason.decisions[c.id]).map((c) => ({ ...c, sal: resignSal(c), contract: c.age >= 30 ? 1 : 2 }));
    // AI dokonča svoj draft iz preostanka (če je človek izbiral prvi, AI zdaj vzame)
    let aiPicks = [...(offseason.aiDraftPicks || [])];
    if (offseason.humanFirst && offseason.draftClass.length) {
      const best = offseason.draftClass.filter((p) => p.tier !== "safe").sort((x, y) => (y.potLow + y.potHigh) - (x.potLow + x.potHigh))[0] || offseason.draftClass[0];
      if (best) aiPicks.push(best);
    }
    const rookieContract = (c) => ({ ...c, contract: 3, developed: false });
    const unhappyIds = new Set((offseason.unhappy || []).filter((u) => !offseason.sold[u.id]).map((u) => u.id));
    const morale = (c) => unhappyIds.has(c.id) ? { ...c, pm: Math.min(-4, c.pm - 8), unhappy: true } : c;
    const keptH = [...offseason.hKeepAuto, ...resigned, ...offseason.hDraftPicks.map(rookieContract)].map(morale);
    const keptA = [...offseason.aRoster, ...aiPicks.map(rookieContract)];
    setG(freshSeason(g.season + 1, { titles: g.titles, keepH: keptH, keepA: keptA, seasons: g.seasons, cum: g.cum, bonusPicks: offseason.bonusPicks }));
    setOffseason(null); setScreen("play"); setSel(null);
    say(`Sezona ${g.season + 1}! ${offseason.hDraftPicks.length ? `Draftani ${offseason.hDraftPicks.map((c) => surname(c.n)).join(", ")} se pridružijo.` : ""} Cap te stiska — mladi so poceni.`);
  };

  const pickCoach = (id) => {
    const others = COACHES.filter((c) => c.id !== id);
    const aiC = others[Math.floor(Math.random() * others.length)].id;
    const h = { ...g.h, coach: id, picks: { ...g.h.picks, f: g.h.picks.f + (id === "okc" ? 1 : 0) } };
    const a = { ...g.a, coach: aiC, picks: { ...g.a.picks, f: g.a.picks.f + (aiC === "okc" ? 1 : 0) } };
    setG(maybeAuctionStart({ ...g, h, a, log: [...g.log, `🧢 Coacha: TI — ${coachOf(id).n} (${coachOf(id).t}), AI — ${coachOf(aiC).n} (${coachOf(aiC).t}).`] }));
    say(`Tvoj coach: ${coachOf(id).n}. AI vodi ${coachOf(aiC).n}.`);
  };

  const endRound = (state) => {
    // razvoj rookiejev (enkraten): starter dobi minute → raste proti stropu, klop → proti tlom
    const dev = [];
    const grow = (roster, coach, injuredId, side) => {
      const starterIds = new Set(Object.values(bestStarters(roster, coach, injuredId)));
      return roster.map((c) => {
        if (!c.rookie || c.developed) return c;
        const isS = starterIds.has(c.id);
        const r1 = c.potLow + Math.random() * (c.potHigh - c.potLow);
        const r2 = c.potLow + Math.random() * (c.potHigh - c.potLow);
        const to = Math.round(isS ? Math.max(r1, r2) : Math.min(r1, r2));
        dev.push({ n: c.n, from: c.ovr, to, side, starter: isS });
        return { ...c, ovr: to, developed: true };
      });
    };
    const st = { ...state, h: { ...state.h, roster: grow(state.h.roster, state.h.coach, state.injured.h, "h") }, a: { ...state.a, roster: grow(state.a.roster, state.a.coach, state.injured.a, "a") } };
    const hs = scoreRoster(st.h.roster, st.h.hand.length, st.finisher === "h", st.h.starters, st.h.picks, st.h.coach, st.injured.h, st.h.deadCap);
    const as = scoreRoster(st.a.roster, st.a.hand.length, st.finisher === "a", null, st.a.picks, st.a.coach, st.injured.a, 0);
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
      setG({ ...st, result: { hs, as, dev, seasonWin }, totals: { h: hs.total, a: as.total }, titles, cum });
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
    // 🩹 naključna poškodba (12 % po vsakem krogu, max 1 aktivna na GM-a)
    if (!ns.finisher && Math.random() < 0.12) {
      const pool = [];
      if (!ns.injured.h) ns.h.roster.forEach((c) => pool.push(["h", c]));
      if (!ns.injured.a) ns.a.roster.forEach((c) => pool.push(["a", c]));
      if (pool.length) {
        const [side, c] = pool[Math.floor(Math.random() * pool.length)];
        let h = ns.h;
        if (side === "h" && ns.h.starters[c.pos] === c.id) {
          const starters = { ...ns.h.starters };
          const alt = ns.h.roster.filter((x) => x.pos === c.pos && x.id !== c.id).sort((x, y) => spts(y) - spts(x))[0];
          if (alt) starters[c.pos] = alt.id; else delete starters[c.pos];
          h = { ...ns.h, starters };
        }
        ns = { ...ns, h, injured: { ...ns.injured, [side]: c.id }, log: [...ns.log, `🩹 POŠKODBA: ${c.n} (${side === "h" ? "TVOJ" : "AI-jev"} igralec) do konca runde ne more v prvo peterko. Rehab stane 1× 🥈 pick.`] };
        say(`🩹 Poškodba: ${c.n} (${side === "h" ? "tvoj igralec!" : "AI-jev igralec"})`);
      }
    }
    if (ns.a.roster.length >= 10 && !ns.finisher) {
      ns = { ...ns, finisher: "a", finalFor: "h", banner: "AI je zaključil roster — to je tvoja ZADNJA poteza!", log: [...ns.log, "AI: »Roster zaključen!«"] };
    }
    setG({ ...ns, h: { ...ns.h, tradeUsed: false }, turn: "h", phase: "draw" });
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
        setG({ ...ns, auction: { card: dc, cont: "aiEnd", isFinal } });
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
    const logs = [`🔨 DRAŽBA za ${card.n}: ti ${pickStr(hB)} (${hV}) proti AI ${pickStr(aB)} (${aV}).`];
    if (hV > aV && hV > 0) {
      let hp = { f: g.h.picks.f - hB.f, s: g.h.picks.s - hB.s, w: g.h.picks.w - hB.w };
      let ap = { ...g.a.picks };
      if (hB.w) [hp, ap] = paySwap(hp, ap);
      const starters = { ...g.h.starters };
      if (!starters[card.pos]) starters[card.pos] = card.id;
      ns = { ...ns, ...rm, h: { ...g.h, roster: [...g.h.roster, g.franchise && card.contract == null ? { ...card, contract: contractFor(card) } : card], starters, picks: hp }, a: { ...g.a, picks: ap } };
      logs.push(`Zmagal si — ${card.n} je tvoj!`);
    } else if (aV > hV && aV > 0) {
      let ap = { f: g.a.picks.f - aB.f, s: g.a.picks.s - aB.s, w: g.a.picks.w - aB.w };
      let hp = { ...g.h.picks };
      if (aB.w) [ap, hp] = paySwap(ap, hp);
      ns = { ...ns, ...rm, a: { ...g.a, roster: [...g.a.roster, g.franchise && card.contract == null ? { ...card, contract: contractFor(card) } : card], picks: ap }, h: { ...g.h, picks: hp } };
      logs.push(`AI je zmagal in podpisal ${card.n}.`);
    } else {
      logs.push(`Nihče ni dal dovolj — ${card.n} ostaja na trgu.`);
    }
    ns = { ...ns, log: [...ns.log, ...logs] };
    say(logs[logs.length - 1]);
    if (au.cont === "start" || au.cont === "resume") setG(ns);
    else if (au.cont === "hDiscard") finishTurn(ns);
    else if (au.cont === "aiEnd") postAi(ns, au.isFinal);
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
    setG({ ...g, deck: deck.slice(0, -1), hDisc, aDisc, reshuffled, h: { ...g.h, hand: [...g.h.hand, c] }, phase: "action", log: [...g.log, `S skritega kupa si vlekel: ${c.n}.`] });
    setSel(c.id);
    setReveal(c);
  };

  // vzameš karto iz AI-jevega odpada s popustom (−25 % plače)
  const takeMarket = (card) => {
    const disc = asDiscount(card);
    setG({ ...g, aDisc: g.aDisc.filter((c) => c.id !== card.id), h: { ...g.h, hand: [...g.h.hand, disc] }, phase: "action", log: [...g.log, `Iz AI-jevih odpuščenih si vzel ${card.n} s popustom (${disc.sal} M$ namesto ${card.origSal}).`] });
    setSel(card.id);
    setReveal(disc);
  };

  // draft: prospekta z deske dobiš v roko za ceno picka (🥇 elite/projekt, 🥈 varni)
  const rookieRound = (c) => c.tier === "safe" ? 2 : 1;
  const draftProspect = (c) => {
    const rd = rookieRound(c);
    const used = rd === 1 ? g.draftUsed.h.f : g.draftUsed.h.s;
    if (used >= 1) { say(`V tej rundi si že draftal igralca ${rd}. kroga (max 1 first + 1 second).`); return; }
    const have = rd === 1 ? g.h.picks.f : g.h.picks.s;
    if (have < 1) { say(`Za ${c.n} rabiš ${rd === 1 ? "🥇 pick 1. kroga" : "🥈 pick 2. kroga"}, ki ga nimaš.`); return; }
    if (c.tier === "elite") {
      const myBase = baseStrOf(scoreRoster(g.h.roster, 0, false, null, g.h.picks, g.h.coach, g.injured.h, g.h.deadCap));
      const aiBase = baseStrOf(scoreRoster(g.a.roster, 0, false, null, g.a.picks, g.a.coach, g.injured.a, 0));
      if (!slotTier(aiBase - myBase).top) { say(`💎 ${surname(c.n)} je top prospekt — dosegljiv le z zgodnjim slotom (moraš zaostajati). Zdaj imaš pozni pick. Zgradi počasneje ali vzemi 🌱 projekt.`); return; }
    }
    const picks = { ...g.h.picks };
    if (rd === 1) picks.f -= 1; else picks.s -= 1;
    const du = { ...g.draftUsed, h: { ...g.draftUsed.h, [rd === 1 ? "f" : "s"]: used + 1 } };
    setG({ ...g, draftBoard: g.draftBoard.filter((x) => x.id !== c.id), draftUsed: du, h: { ...g.h, hand: [...g.h.hand, { ...c }], picks }, log: [...g.log, `🎫 DRAFT (${rd}. krog): izbral si ${c.n} — v tvoji roki, zdaj ga podpiši.`] });
    setSel(c.id);
    setDraftOpen(false);
    say(`Draftal si ${surname(c.n)}! Surov in poceni — razvije se, če dobi minute. Podpiši ga spodaj.`);
  };

  const PICK_DISC = { f: 14, s: 6 }; // olajšava plače ob podpisu s pickom (M$)
  const sign = (discKind) => {
    const c0 = g.h.hand.find((x) => x.id === sel);
    if (!c0) return;
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
    setG({ ...g, h: { ...withSigned(g.h, c), picks }, log: [...g.log, `Podpisal si: ${c0.n}${discKind ? ` (popust s ${discKind === "f" ? "🥇" : "🥈"} pickom)` : ""}.`] });
    setSel(null);
  };

  const discard = () => {
    const c = g.h.hand.find((x) => x.id === sel);
    if (!c) return;
    const ns = { ...g, hDisc: [...g.hDisc, c], h: { ...g.h, hand: g.h.hand.filter((x) => x.id !== c.id) }, log: [...g.log, `Odpustil si: ${c.n} (AI ga lahko vzame s popustom).`] };
    setSel(null);
    if (c.ovr >= AUCTION_OVR) { setBid({ f: 0, s: 0, w: 0 }); setG({ ...ns, auction: { card: c, cont: "hDiscard" } }); return; }
    finishTurn(ns);
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
    setG({ ...g, h: { ...g.h, starters: { ...g.h.starters, [c.pos]: c.id } } });
    say(`★ ${surname(c.n)} je zdaj štartar na ${c.pos}.`);
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
    let ns = { ...g, hDisc: [...g.hDisc, c], injured, h: { ...g.h, roster, starters, deadCap: (g.h.deadCap || 0) + dead }, log: [...g.log, `✂️ WAIVE: odpustil si ${c.n} (AI ga lahko vzame s popustom) — dead cap +${dead} M$ do konca runde.`] };
    setWaiveTarget(null); setWaiveMode(false);
    if (c.ovr >= AUCTION_OVR) { setBid({ f: 0, s: 0, w: 0 }); setG({ ...ns, auction: { card: c, cont: "resume" } }); return; }
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
    if (g.h.picks.s < 1) { say("Nimaš 🥈 picka za rehab."); setRehab(null); return; }
    setG({ ...g, injured: { ...g.injured, h: null }, h: { ...g.h, picks: { ...g.h.picks, s: g.h.picks.s - 1 } }, log: [...g.log, `Rehab: ${rehab.n} je spet zdrav (porabljen 1× 🥈 pick).`] });
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
      const gain = val(give) + PV.f * trade.f + PV.s * trade.s;
      const loss = val(get);
      accepted = gain >= loss + 4;
      verdict = accepted ? `AI sprejme trejd!` : `AI zavrne: ${get.n} mu je vreden več, kot ponujaš. Dodaj picke ali boljšega igralca.`;
    }
    let ns = { ...g, h: { ...g.h, tradeUsed: true }, log: [...g.log, `TREJD ponudba: ${give.n} + ${pickStr({ f: trade.f, s: trade.s, w: 0 })} za ${get.n} → ${accepted ? "SPREJETO" : "ZAVRNJENO"}.`] };
    if (accepted) {
      const hRoster = [...g.h.roster.filter((c) => c.id !== give.id), get];
      const aRoster = [...g.a.roster.filter((c) => c.id !== get.id), give];
      const starters = { ...g.h.starters };
      if (starters[give.pos] === give.id) { const alt = hRoster.filter((c) => c.pos === give.pos).sort((x, y) => spts(y) - spts(x))[0]; if (alt) starters[give.pos] = alt.id; else delete starters[give.pos]; }
      if (!starters[get.pos] || !hRoster.find((c) => c.id === starters[get.pos])) starters[get.pos] = get.id;
      ns = { ...ns, h: { ...ns.h, roster: hRoster, starters, picks: { ...g.h.picks, f: g.h.picks.f - trade.f, s: g.h.picks.s - trade.s } }, a: { ...g.a, roster: aRoster, picks: { ...g.a.picks, f: g.a.picks.f + trade.f, s: g.a.picks.s + trade.s } } };
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
        background: repeating-linear-gradient(90deg,#dcc296 0 46px,#d4b888 46px 92px); }
      .wrap { max-width:520px; margin:0 auto; padding:10px 10px 92px; }
      .hdr { background:#152744; color:#F5EBDC; border-radius:12px; padding:10px 14px; display:flex; justify-content:space-between; align-items:center; box-shadow:0 3px 0 #0c1830; }
      .hdr h1 { font-family:'Archivo Black','Arial Black',sans-serif; font-size:17px; letter-spacing:1px; }
      .hdr .sub { font-size:12px; opacity:.75; }
      .score-strip { display:flex; gap:10px; font-size:15px; font-weight:700; text-align:center; }
      .score-strip b { color:#F0B429; font-size:18px; display:block; }
      .panel { background:#fffdf7; border-radius:12px; padding:10px; margin-top:10px; box-shadow:0 2px 6px rgba(20,25,40,.15); }
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
      .card-club { font-size:11px; color:#8a7c63; }
      .trait { font-size:11px; font-weight:700; color:#4a4232; background:#f2e9d4; border-radius:5px; padding:1px 5px; margin-top:3px; display:inline-block; }
      .vals { font-size:10.5px; color:#215c26; background:#e7f3e7; border-radius:5px; padding:1px 5px; margin-top:3px; font-weight:700; }
      .sal { font-weight:700; color:#8a6d1a; font-size:13px; }
      .oldsal { text-decoration:line-through; color:#b3a37e; font-weight:600; font-size:11px; }
      .pot { font-size:11px; font-weight:700; margin-top:2px; }
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
      .mini { width:72px; background:#fff; border:1px solid #d8cdb8; border-top:4px solid; border-radius:8px; padding:4px 5px; font-size:11px; text-align:left; cursor:pointer; font-family:inherit; }
      .mini.starter { box-shadow:0 0 0 2.5px #F0B429; background:#fffaea; }
      .mini.msel { outline:3px solid #E4762B; }
      .mini-top { display:flex; justify-content:space-between; align-items:center; }
      .mini-name { font-weight:700; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
      .mini-sal { color:#8a6d1a; font-size:10px; }
      .roster-grid { display:flex; flex-wrap:wrap; gap:6px; }
      .slot-empty { width:72px; height:60px; border:2px dashed #c9b892; border-radius:8px; display:flex; align-items:center; justify-content:center; color:#b3a37e; font-size:11px; }
      .piles { display:flex; gap:10px; align-items:stretch; }
      .deckbtn { flex:0 0 104px; background:#152744; color:#F5EBDC; border:2px solid #2a3f66; border-radius:10px; font-family:'Archivo Black','Arial Black',sans-serif;
        font-size:13px; cursor:pointer; padding:10px 6px; line-height:1.35; box-shadow:0 3px 0 #0c1830; }
      .deckbtn:disabled { opacity:.4; cursor:default; }
      .deckbtn small { display:block; font-family:'Barlow Condensed',sans-serif; font-weight:500; font-size:12px; opacity:.8; margin-top:4px; }
      .fa-row { display:flex; gap:6px; overflow-x:auto; flex:1; padding:10px 2px 4px; }
      .phase { margin-top:10px; background:#E4762B; color:#fff; border-radius:10px; padding:8px 12px; font-weight:700; font-size:15px; text-align:center; box-shadow:0 3px 0 #b3541a; line-height:1.3; }
      .phase.warn { background:#C0392B; box-shadow:0 3px 0 #8f2a1f; }
      .actions { position:fixed; bottom:0; left:0; right:0; background:#152744; padding:10px; display:flex; gap:8px; justify-content:center; z-index:20; }
      .abtn { flex:1; max-width:170px; padding:12px 8px; border:none; border-radius:10px; font-family:'Archivo Black','Arial Black',sans-serif; font-size:14px; cursor:pointer; }
      .abtn:disabled { opacity:.35; cursor:default; }
      .abtn.sign { background:#2E7D32; color:#fff; }
      .abtn.drop { background:#C0392B; color:#fff; }
      .abtn.ghost { background:#F5EBDC; color:#152744; }
      .signopt { display:flex; flex-direction:column; align-items:flex-start; gap:2px; width:100%; padding:12px 14px; border:none; border-radius:10px; color:#f5efe0; cursor:pointer; text-align:left; }
      .signopt-main { font-family:'Archivo Black','Arial Black',sans-serif; font-size:15px; line-height:1.2; }
      .signopt-sub { font-size:12px; opacity:.8; font-family:inherit; }
      .age-sub { font-family:'Archivo Black','Arial Black',sans-serif; font-size:12px; letter-spacing:.5px; padding:2px 0; }
      .capm-lbl { display:flex; justify-content:space-between; font-size:13px; font-weight:700; }
      .capm-bar { position:relative; height:12px; background:#e7dcc4; border-radius:6px; margin-top:3px; overflow:hidden; }
      .capm-fill { height:100%; transition:width .3s; }
      .capm-cap { position:absolute; top:-2px; bottom:-2px; width:3px; background:#152744; }
      .capm-cap.apron { background:#8f1d12; }
      .capm-zones { display:flex; justify-content:space-between; font-size:10px; color:#8a7c63; margin-top:2px; }
      .red { color:#C0392B; } .green { color:#2E7D32; }
      .chips { display:flex; flex-wrap:wrap; gap:5px; margin-top:8px; }
      .chip { background:#e7f3e7; color:#215c26; border-radius:12px; padding:3px 10px; font-size:12px; font-weight:700; border:1px solid #c7e0c7; cursor:pointer; font-family:inherit; transition:transform .1s, box-shadow .1s; }
      .chip:hover, .chip:focus-visible { transform:translateY(-1px); box-shadow:0 2px 6px rgba(20,25,40,.2); outline:none; }
      .chip:active { transform:translateY(0); }
      .chip.neg { background:#fbe3e0; color:#8f2a1f; border-color:#eab3ac; }
      .chips-hint { font-size:11px; color:#8a7c63; margin-top:8px; font-weight:600; }
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
      .tr-col { max-height:150px; overflow-y:auto; display:flex; flex-wrap:wrap; gap:6px; padding:4px; background:#f7f1e2; border-radius:10px; }
      .bd { background:#fffdf7; border-radius:12px; padding:12px; flex:1; min-width:230px; }
      .bd-title { font-family:'Archivo Black','Arial Black',sans-serif; color:#152744; margin-bottom:8px; font-size:15px; }
      .bd-five { display:flex; flex-direction:column; gap:3px; margin-bottom:8px; font-size:13px; }
      .bd-slot { display:flex; gap:6px; align-items:center; }
      .brow { display:flex; justify-content:space-between; font-size:14px; padding:2px 0; border-bottom:1px dotted #e0d5bc; gap:8px; }
      .brow.total { border-top:2px solid #152744; border-bottom:none; margin-top:6px; padding-top:6px; font-size:17px; font-family:'Archivo Black','Arial Black',sans-serif; }
      .menu { text-align:center; padding-top:60px; }
      .menu h1 { font-family:'Archivo Black','Arial Black',sans-serif; font-size:44px; color:#152744; line-height:1; text-shadow:3px 3px 0 #F0B429; }
      .menu .tag { font-size:18px; margin:12px 0 26px; color:#4a4232; }
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
      .sb { margin-top:10px; background:#0e1c33; border:2px solid #2a3f66; border-radius:12px; padding:10px 12px; display:flex; align-items:stretch; gap:6px; color:#F5EBDC; box-shadow:0 3px 0 #0c1830; }
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
      @media (prefers-reduced-motion: reduce){ .fo * { transition:none !important; } }
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
          <h1>FRONT<br />OFFICE</h1>
          <div className="tag">Remi 500 za košarkarske generalne menedžerje.<br />116 pravih igralcev · plačni limit · draft picki in dražbe.</div>
          <div className="menu-btns">
            <button className="bigbtn" onClick={start}>Hitra sezona (do {TARGET})</button>
            <div className="menu-group-lbl">🏆 Franšiza · več sezon</div>
            <button className="bigbtn franchise" onClick={() => startFranchise(3)}>3 sezone</button>
            <button className="bigbtn franchise" onClick={() => startFranchise(5)}>5 sezon</button>
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
    return (
      <div className="fo">{css}
        <div className="wrap">
          <div className="hdr"><h1>{fr ? `SEZONA ${g.season}/${g.seasons} — OBRAČUN` : `RUNDA ${g.round} — OBRAČUN`}</h1><div className="score-strip">{fr ? <><span>naslovi<b>TI {g.titles.h} : {g.titles.a} AI</b></span><span>seštevek<b>{g.cum ? g.cum.h : 0}</b></span></> : <span>cilj<b>{TARGET}</b></span>}</div></div>
          {fr
            ? <div className="win-banner">{g.result.seasonWin === "h" ? "🏆 NASLOV je tvoj to sezono!" : g.result.seasonWin === "a" ? "AI GM osvoji sezono." : "Sezona izenačena."}</div>
            : g.champion ? (
            <div className="win-banner">🏆 {g.champion === "h" ? "TI SI PRVAK LIGE!" : g.champion === "a" ? "AI GM JE PRVAK LIGE." : "Izenačeno na vrhu!"}</div>
          ) : winner && <div className="win-banner">Rundo dobi: {winner} (+{Math.abs(hs.total - as.total)})</div>}
          {frDone && <div className="win-banner" style={{ background: frWinner === "h" ? "#1f7a3d" : frWinner === "a" ? "#7a2a2a" : "#555" }}>KONEC FRANŠIZE — {frWinner === "h" ? `DINASTIJA! Osvojil si ${g.titles.h} od ${g.seasons} naslovov.` : frWinner === "a" ? `AI GM je vladal (${g.titles.a}/${g.seasons}).` : `Izenačeno ${g.titles.h}:${g.titles.a}.`} · Tvoj seštevek: <b>{g.cum ? g.cum.h : 0} tč</b></div>}
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
              {g.result.dev.map((d, i) => {
                const diff = d.to - d.from;
                const big = diff >= 12, bust = diff <= 3;
                return <div key={i} className={"dev-row " + (big ? "boom" : bust ? "bust" : "")}>
                  <span>{d.side === "h" ? "TI" : "AI"} · {d.starter ? "★" : "klop"} {surname(d.n)}</span>
                  <b>{d.from} → {d.to} {big ? "💥" : bust ? "😐" : "↗"} ({diff >= 0 ? "+" : ""}{diff})</b>
                </div>;
              })}
              <div className="dev-note">Starterji dobijo minute → rastejo proti stropu. Klopni razvijajo počasneje.</div>
            </div>
          )}
          <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
            <Breakdown name={fr ? `TI — sezona ${hs.total}` : `TI — skupno ${g.totals.h}`} r={hs} />
            <Breakdown name={fr ? `AI GM — sezona ${as.total}` : `AI GM — skupno ${g.totals.a}`} r={as} />
          </div>
          <div className="mrow">
            {fr && !frDone && <button className="bigbtn" style={{ flex: 1, background: "#3a2a5c" }} onClick={goOffseason}>Prestopni rok →</button>}
            {fr && frDone && <button className="bigbtn" style={{ flex: 1 }} onClick={() => setScreen("menu")}>V meni</button>}
            {!fr && !g.champion && <button className="bigbtn" style={{ flex: 1 }} onClick={nextRound}>Runda {g.round + 1} →</button>}
            {!fr && <button className="bigbtn" style={{ flex: 1, background: "#152744", boxShadow: "0 4px 0 #0c1830" }} onClick={start}>Nova sezona</button>}
          </div>
        </div>
      </div>
    );
  }

  // ---- PRESTOPNI ROK (offseason) ----
  if (screen === "offseason" && offseason) {
    const { hExp, hKeepAuto, aRoster, decisions, draftClass, humanFirst, hDraftPicks, hDraftUsed } = offseason;
    const projectedSal = effSalary([...hKeepAuto, ...hExp.filter((c) => decisions[c.id]).map((c) => ({ ...c, sal: resignSal(c) }))], null);
    return (
      <div className="fo">{css}
        <div className="wrap">
          <div className="hdr"><h1>PRESTOPNI ROK · po sezoni {g.season}</h1></div>
          <div className="hint" style={{ marginBottom: 8 }}>Pogodbam je poteklo leto. Igralci brez pogodbe (spodaj) postanejo prosti — <b>podaljšaj po tržni ceni</b> (zvezde in razviti mladi so zdaj dragi!) ali <b>pusti oditi</b>. Obstoječim pogodbam plača zraste +6 %. Cap 170 M$ — če preplačaš, te davek požre v točkah.</div>
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
                <div className="dev-note">Mladi (≤23) rastejo z minutami, veterani (31+) upadajo; pri ~34 in nizkem OVR se upokojijo → mesto se sprosti.</div>
              </div>
            );
          })()}
          <div className="panel">
            <div className="lbl">Potekle pogodbe — tvoja odločitev ({hExp.length})</div>
            {hExp.length === 0 && <div style={{ fontSize: 13, color: "#8a7c63" }}>Nobena pogodba ni potekla to sezono.</div>}
            <div className="tr-col">
              {hExp.map((c) => (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <PlayerCard c={c} mini onClick={() => setOffInfo(c)} />
                  <div style={{ flex: 1, display: "flex", gap: 4 }}>
                    <button className={"abtn " + (decisions[c.id] ? "sign" : "ghost")} style={{ flex: 1 }} onClick={() => setOffseason({ ...offseason, decisions: { ...decisions, [c.id]: true } })}>Podaljšaj<br /><small>{c.sal} → {resignSal(c)} M$</small></button>
                    <button className={"abtn " + (!decisions[c.id] ? "drop" : "ghost")} style={{ flex: 1 }} onClick={() => setOffseason({ ...offseason, decisions: { ...decisions, [c.id]: false } })}>Pusti<br /><small>oditi</small></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="panel">
            <div className="lbl">Ostajajo (pogodba teče, plača +6 %) · {hKeepAuto.length}</div>
            <div className="roster-grid">{hKeepAuto.map((c) => <PlayerCard key={c.id} c={c} mini onClick={() => setOffInfo(c)} />)}</div>
          </div>
          <div className="hint">Projekcija plačne mase v novo sezono: <b style={{ color: projectedSal > CAP ? "#C0392B" : "#215c26" }}>{projectedSal} M$</b>{projectedSal > CAP + APRON ? " — globoko v davku! Razmisli, koga pustiš in nadomestiš s poceni draftom." : projectedSal > CAP ? " — nad limitom, davek te čaka." : " — pod limitom."} · AI obdrži {aRoster.length}.</div>
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
          <div className="panel">
            <div className="lbl">🎫 DRAFT {2026 + g.season} · {humanFirst ? "🎰 lani si izgubil — draftaš PRVI!" : "zmagal si lani — AI je vzel prvi izbor"}</div>
            <div className="hint" style={{ margin: "0 0 8px" }}>Izberi <b>1</b> prospekta 1. kroga (💎/🌱) in <b>1</b> 2. kroga (🔒). Draftani (📄3, poceni) se pridružijo naslednjo sezono in se razvijajo s starostjo. Izbral si: 1.krog {hDraftUsed.f}/1 · 2.krog {hDraftUsed.s}/1.</div>
            {hDraftPicks.length > 0 && <div className="hint" style={{ color: "#7a4fd0" }}>Tvoji izbori: {hDraftPicks.map((c) => `${surname(c.n)} (${ROOK_TIER[c.tier].ico})`).join(", ")}</div>}
            <div className="tr-col">
              {draftClass.map((c) => {
                const rd = c.tier === "safe" ? 2 : 1;
                const usedUp = rd === 1 ? hDraftUsed.f >= 1 : hDraftUsed.s >= 1;
                return (
                  <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 8, opacity: usedUp ? 0.5 : 1 }}>
                    <PlayerCard c={c} mini onClick={() => setOffInfo(c)} />
                    <button className="abtn sign" style={{ flex: 1 }} disabled={usedUp} onClick={() => offDraft(c)}>{usedUp ? `${rd}. krog izbran` : `Draftaj (${rd === 1 ? "🥇 1." : "🥈 2."} krog)`}</button>
                  </div>
                );
              })}
              {draftClass.length === 0 && <div style={{ fontSize: 13, color: "#8a7c63" }}>Razred izčrpan.</div>}
            </div>
          </div>
          <div className="mrow"><button className="bigbtn" style={{ flex: 1 }} onClick={finalizeOffseason}>Sezona {g.season + 1} →</button></div>
          {offInfo && (
            <div className="modal-bg" onClick={() => setOffInfo(null)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>{offInfo.unhappy ? "😤 " : ""}{offInfo.n}</h3>
                <div className="auc-card"><PlayerCard c={offInfo} onClick={() => {}} /></div>
                <ul>
                  <li><b>{offInfo.pos}</b> · {offInfo.club} · <b>{offInfo.age} let</b>{offInfo.rookie ? " · ROOKIE" : ""} · {TRAITS[offInfo.tr].ico} {TRAITS[offInfo.tr].n}</li>
                  <li>OVR <b>{offInfo.ovr}</b> · vpliv {offInfo.pm >= 0 ? "+" : ""}{offInfo.pm} · plača {offInfo.sal} M$ · pogodba 📄{offInfo.contract != null ? offInfo.contract : "—"}</li>
                  <li>V peterki <b>{spts(offInfo)}</b> tč · na klopi {Math.floor(offInfo.ovr / 2)} tč.</li>
                  {offInfo.rookie && <li className="pot" style={{ color: ROOK_TIER[offInfo.tier].col }}>{ROOK_TIER[offInfo.tier].ico} {ROOK_TIER[offInfo.tier].n} · potencial {offInfo.potLow}–{offInfo.potHigh} (raste s starostjo, če dobi minute).</li>}
                  {offInfo.contract != null && !offInfo.rookie && <li>Ob podaljšanju bi zahteval <b>{resignSal(offInfo)} M$</b> (tržna cena).</li>}
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
  const coachPending = !g.h.coach;
  const myEff = effSalary(g.h.roster, g.h.coach);
  const proj = scoreRoster(g.h.roster, 0, false, g.h.starters, g.h.picks, g.h.coach, g.injured.h, g.h.deadCap);
  const starterCards = Object.values(proj.starters);
  // ocena rosterja (najboljša peterka) — za mejni prispevek igralca
  const rScore = (roster, side) => scoreRoster(roster, 0, false, null, g[side].picks, g[side].coach, g.injured[side], side === "h" ? (g.h.deadCap || 0) : 0).total;
  const addValue = (roster, card, side) => rScore([...roster, card], side) - rScore(roster, side); // koliko doda nov igralec
  const contribOf = (roster, card, side) => rScore(roster, side) - rScore(roster.filter((c) => c.id !== card.id), side); // koliko že prispeva
  const aiProj = scoreRoster(g.a.roster, 0, false, null, g.a.picks, g.a.coach, g.injured.a, 0);
  const mySlot = slotTier(baseStrOf(aiProj) - baseStrOf(proj)); // moj draft slot (zaostajam = boljši)
  const drawPhase = g.phase === "draw" && !aiThinking && !g.auction && !coachPending;
  const actPhase = g.phase === "action" && !aiThinking && !g.auction && !coachPending;
  const aucCard = g.auction ? g.auction.card : null;
  const myTurn = drawPhase || actPhase;
  const canTrade = myTurn && !g.h.tradeUsed && g.h.roster.length > 0 && g.a.roster.length > 0;

  return (
    <div className="fo">{css}
      <div className="wrap">
        <div className="hdr">
          <div><h1>FRONT OFFICE</h1><div className="sub">Runda {g.round} · sezona do {TARGET} točk</div></div>
          <div className="score-strip"><span>picki<b style={{ fontSize: 14 }}>🥇{g.h.picks.f} 🥈{g.h.picks.s}{g.h.picks.w ? " 🔁" : ""}</b></span></div>
        </div>

        {g.banner && <div className="phase warn">⚠️ {g.banner}</div>}
        <div className={"phase" + (drawPhase || actPhase ? " go" : "")}>
          {aiThinking ? "🔴 AI GM je na potezi — počakaj…" : g.auction ? "🔨 DRAŽBA za superzvezdnika!" : coachPending ? "🧢 Izberi coacha za to rundo" : drawPhase ? "🟢 TVOJA POTEZA · 1) Vzemi karto: skriti kup ali prosti igralci" : "🟢 TVOJA POTEZA · 2) Podpiši igralce, nato ODVRZI 1 karto (to konča potezo)"}
        </div>

        <Scoreboard h={proj.total} a={aiProj.total} totalsH={g.totals.h} totalsA={g.totals.a} />

        {/* AI */}
        <div className="panel">
          <div className="lbl" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 4 }}>
            <span>AI GM {g.a.coach ? `· 🧢 ${coachOf(g.a.coach).n}` : ""} · roster {g.a.roster.length}/10 · roka {g.a.hand.length} · projekcija {aiProj.total}</span>
            <Picks p={g.a.picks} />
          </div>
          {g.a.roster.length > 0 && <CapMeter salary={effSalary(g.a.roster, g.a.coach)} />}
          {g.a.roster.length > 0 && <div className="hint" style={{ margin: "6px 0 4px" }}>★ = AI-jeva prva peterka. {(() => { const miss = POS.filter((p) => !aiProj.starters[p]); return miss.length ? `Manjkajo pozicije: ${miss.join(", ")} (−${miss.length * 10}).` : "Vseh 5 pozicij pokritih."; })()}</div>}
          <div className="roster-grid">
            {g.a.roster.map((c) => <PlayerCard key={c.id} c={c} mini starter={aiProj.starters[c.pos] && aiProj.starters[c.pos].id === c.id && g.injured.a !== c.id} injured={g.injured.a === c.id} onClick={() => setInspect({ card: c, side: "a" })} />)}
            {g.a.roster.length === 0 && <span style={{ fontSize: 13, color: "#8a7c63" }}>Še brez podpisov.</span>}
          </div>
        </div>

        {/* KUPI */}
        <div className="panel">
          <div className="lbl">1. korak — vzemi 1 karto</div>
          {drawPhase
            ? <div className="hint">Vleci <b>🂠 na slepo</b> (polna cena) <b>ALI</b> vzemi znano karto iz <b>AI-jevega odpada s popustom −25 % na plačo</b>.</div>
            : <div className="hint" style={{ opacity: .7 }}>{actPhase ? "Karto si vzel — spodaj podpiši/odvrzi." : "Ni tvoja poteza."}</div>}
          <div className="piles">
            <button className="deckbtn" disabled={!drawPhase} onClick={drawDeck}>🂠 SKRITI KUP<small>{g.deck.length} kart · na slepo · polna cena</small></button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="hint" style={{ margin: 0 }}>🟢 <b>AI-jev odpad</b> ({g.aDisc.length}) — tapni katerokoli, podpišeš s <b>popustom −25 %</b>. 🔨 (OVR {AUCTION_OVR}+) sproži dražbo.</div>
              <div className="fa-row">
                {g.aDisc.slice(-8).map((c) => <PlayerCard key={c.id} c={c} dim={!drawPhase} ribbon={`−25% → ${discSal(c)}M`} onClick={() => { if (drawPhase) setInspect({ card: c, side: "market" }); }} />)}
                {g.aDisc.length === 0 && <span style={{ fontSize: 13, color: "#8a7c63", alignSelf: "center" }}>Prazno — AI še ni ničesar odvrgel.</span>}
              </div>
            </div>
          </div>
          {g.hDisc.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <div className="hint" style={{ margin: 0 }}>🔴 <b>Tvoj odpad</b> ({g.hDisc.length}) — AI od tod kupuje s popustom. Pazi, kaj mu podariš!</div>
              <div className="fa-row">
                {g.hDisc.slice(-8).map((c) => <PlayerCard key={c.id} c={c} dim onClick={() => {}} />)}
              </div>
            </div>
          )}
          <div className="mrow" style={{ marginTop: 8 }}>
            <button className="optbtn" style={{ flex: 1 }} disabled={!canTrade} onClick={openTrade}>🔄 Predlagaj trejd {g.h.tradeUsed ? "(v tej potezi že)" : "(1× na potezo)"}</button>
            <button className="optbtn" style={{ flex: 1, background: waiveMode ? "#C0392B" : "#152744" }} disabled={!myTurn || g.h.roster.length === 0} onClick={() => { setWaiveMode(!waiveMode); if (!waiveMode) say("✂️ Waive: tapni igralca v svojem rosterju, ki ga odpuščaš."); }}>✂️ {waiveMode ? "Prekliči waive" : "Waive igralca"}</button>
          </div>
          {!g.franchise && <div className="mrow" style={{ marginTop: 6 }}>
            <button className="optbtn" style={{ flex: 1, background: "#3a2a5c" }} disabled={!myTurn || g.draftBoard.length === 0 || (g.draftUsed.h.f >= 1 && g.draftUsed.h.s >= 1)} onClick={() => setDraftOpen(true)}>🎫 Draftaj prospekta ({g.draftBoard.length}) · 1.krog {g.draftUsed.h.f}/1 · 2.krog {g.draftUsed.h.s}/1</button>
          </div>}
        </div>

        {/* MOJ ROSTER */}
        <div className="panel">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <div className="lbl" style={{ margin: 0 }}>Tvoj roster {g.h.roster.length}/10 · projekcija <b>{proj.total}</b></div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <Picks p={g.h.picks} />
              {g.h.roster.length > 0 && <button className="optbtn" onClick={optimize}>⚡ Peterka</button>}
            </div>
          </div>
          <div className="hint">★ zlata obroba = <b>prva peterka</b>. Štartar prinese <b>OVR + 2× vpliv</b> (zeleno/rdeče število) — mini karta štartarja kaže točen znesek. Klop šteje le pol OVR. <b>Tapni igralca, da postane štartar.</b> Poškodovanca 🩹 tapni za rehab.</div>
          {g.h.coach && <div className="hint">🧢 <b>{coachOf(g.h.coach).n}</b> — {coachOf(g.h.coach).d}{g.h.coach === "lue" && myEff !== salaryOf(g.h.roster) ? ` (plače ${salaryOf(g.h.roster)} → ${myEff} M$)` : ""}</div>}
          {g.h.deadCap > 0 && <div className="hint red">✂️ Dead cap: +{g.h.deadCap} M$ v plačni masi do konca runde (odpuščeni igralci).</div>}
          <CapMeter salary={myEff + (g.h.deadCap || 0)} />
          <div className="roster-grid" style={{ marginTop: 8 }}>
            {g.h.roster.map((c) => (
              <PlayerCard key={c.id} c={c} mini starter={g.h.starters[c.pos] === c.id && g.injured.h !== c.id} injured={g.injured.h === c.id} onClick={() => { if (waiveMode) { setWaiveTarget(c); return; } setInspect({ card: c, side: "h" }); }} />
            ))}
            {Array.from({ length: 10 - g.h.roster.length }).map((_, i) => <div key={i} className="slot-empty">prazno</div>)}
          </div>
          <BonusChips r={proj} coach={g.h.coach} onExplain={say} />
        </div>

        {/* ROKA */}
        <div className="panel">
          <div className="lbl">Tvoja roka ({g.h.hand.length}) — tapni karto, nato spodaj PODPIŠI ali ODVRZI</div>
          <div className="hand">
            {g.h.hand.map((c) => <PlayerCard key={c.id} c={c} selected={sel === c.id} onClick={() => setSel(sel === c.id ? null : c.id)} />)}
            {g.h.hand.length === 0 && <span style={{ fontSize: 13, color: "#8a7c63" }}>Roka je prazna.</span>}
          </div>
          {selCard && <>
            <UnlockPreview card={selCard} sCards={starterCards.filter((c) => c.pos !== selCard.pos || c.id === g.h.starters[selCard.pos])} />
            <button className="linkbtn" style={{ marginTop: 6 }} onClick={() => setInspect({ card: selCard, side: "hand" })}>ℹ️ Podrobnosti in točke ({surname(selCard.n)})</button>
          </>}
        </div>

        {/* DNEVNIK */}
        <div className="panel">
          <div className="lbl">Dnevnik lige</div>
          <div className="log">{[...g.log].reverse().map((l, i) => <div key={i}>{l}</div>)}</div>
        </div>
        <div style={{ textAlign: "center" }}><button className="linkbtn" onClick={() => setShowRules(true)}>Pravila</button></div>
      </div>

      {/* AKCIJSKA VRSTICA */}
      <div className="actions">
        <button className="abtn sign" disabled={!actPhase || !selCard || (selCard && !canSign(g.h.roster, selCard))} onClick={() => { const canDisc = selCard.sal > 2 && (g.h.picks.f > 0 || g.h.picks.s > 0); canDisc ? setSignOpts(selCard) : sign(); }}>PODPIŠI ✍️</button>
        <button className="abtn drop" disabled={!actPhase || !selCard} onClick={discard}>ODVRZI 🗑️</button>
        {actPhase && g.h.hand.length === 0 && <button className="abtn ghost" onClick={() => finishTurn(g)}>KONČAJ POTEZO</button>}
      </div>

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

      {/* IZBIRA COACHA */}
      {coachPending && !g.result && (
        <div className="modal-bg">
          <div className="modal">
            <h3>🧢 Izberi coacha za rundo {g.round}</h3>
            <p>Vsak coach prinese bonus, ki ga lahko izkoristiš — ali pa tudi ne. AI dobi naključnega izmed preostalih štirih.</p>
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
      {rehab && (
        <div className="modal-bg" onClick={() => setRehab(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>🩹 {rehab.n} je poškodovan</h3>
            <p>Do konca runde ne more v prvo peterko (na klopi šteje normalno). Lahko ga pošlješ na <b>rehab za 1× 🥈 pick</b> — imaš jih {g.h.picks.s}.</p>
            <div className="mrow">
              <button className="abtn sign" style={{ flex: 1 }} disabled={g.h.picks.s < 1} onClick={heal}>💪 Rehab (1× 🥈)</button>
              <button className="abtn ghost" style={{ flex: 1 }} onClick={() => setRehab(null)}>Pusti ga počivati</button>
            </div>
          </div>
        </div>
      )}

      {/* RAZKRITJE VLEČENE KARTE */}
      {reveal && (
        <div className="modal-bg" onClick={() => setReveal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{reveal.disc ? "🟢 S popustom: " : "🂠 Vlekel si: "}{reveal.n}</h3>
            <div className="auc-card"><PlayerCard c={reveal} onClick={() => {}} /></div>
            <p>Karta je zdaj <b>v tvoji roki</b> (že označena). Kaj pomenijo številke:</p>
            <ul>
              <li><b>OVR {reveal.ovr}</b> — kakovost igralca.</li>
              <li><b>Vpliv {reveal.pm >= 0 ? "+" : ""}{reveal.pm}</b> (zelena/rdeča) — šteje <b>dvojno</b>, a samo če je igralec v prvi peterki.</li>
              <li>V <b>prvi peterki</b> torej prinese <b>{spts(reveal)} točk</b> ({reveal.ovr} + 2×{reveal.pm}). Na <b>klopi</b> le {Math.floor(reveal.ovr / 2)}.</li>
              <li>{reveal.disc ? <>Plača <b>{reveal.sal} M$</b> (popust −25 %, prej {reveal.origSal} M$) — cenejši, ker si ga pobral iz AI-jevih odpuščenih.</> : <>Plača <b>{reveal.sal} M$</b> gre v plačno maso (limit {CAP} M$).</>}</li>
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
      )}

      {/* DRAŽBA */}
      {aucCard && (
        <div className="modal-bg">
          <div className="modal">
            <h3>🔨 Dražba: {aucCard.n}</h3>
            <div className="auc-card"><PlayerCard c={aucCard} onClick={() => {}} /></div>
            <p>Superzvezdnik je na trgu! Skrivno ponudi picke — AI bo dal svojo ponudbo. <b>Višja ponudba igralca takoj podpiše.</b> Ob izenačenju ostane med prostimi igralci.</p>
            {!canSign(g.h.roster, aucCard) && <p className="red">Ne moreš ga podpisati (limit pozicije ali poln roster) — lahko samo odstopiš.</p>}
            {canSign(g.h.roster, aucCard) && (
              <>
                <div className="stepper"><span>🥇 Pick 1. kroga (vreden {PV.f + (g.h.coach === "okc" ? 1 : 0)}) — imaš {g.h.picks.f}</span>
                  <span><button className="stbtn" disabled={bid.f <= 0} onClick={() => setBid({ ...bid, f: bid.f - 1 })}>−</button> <b> {bid.f} </b> <button className="stbtn" disabled={bid.f >= g.h.picks.f} onClick={() => setBid({ ...bid, f: bid.f + 1 })}>+</button></span>
                </div>
                <div className="stepper"><span>🥈 Pick 2. kroga (vreden {PV.s + (g.h.coach === "okc" ? 1 : 0)}) — imaš {g.h.picks.s}</span>
                  <span><button className="stbtn" disabled={bid.s <= 0} onClick={() => setBid({ ...bid, s: bid.s - 1 })}>−</button> <b> {bid.s} </b> <button className="stbtn" disabled={bid.s >= g.h.picks.s} onClick={() => setBid({ ...bid, s: bid.s + 1 })}>+</button></span>
                </div>
                {g.h.picks.w > 0 && (
                  <div className="stepper"><span>🔁 Pick swap (vreden {PV.w + (g.h.coach === "okc" ? 1 : 0)} — ob zmagi zamenjaš svoj najboljši pick za AI-jev najslabši)</span>
                    <span><button className="stbtn" onClick={() => setBid({ ...bid, w: bid.w ? 0 : 1 })}>{bid.w ? "✓" : "+"}</button></span>
                  </div>
                )}
                <div className="bidsum">Tvoja ponudba: {bidValC(bid, g.h.coach)}</div>
              </>
            )}
            <div className="mrow">
              {canSign(g.h.roster, aucCard) && <button className="abtn sign" style={{ flex: 1 }} disabled={bidValC(bid, g.h.coach) === 0} onClick={() => resolveAuction(bid)}>Oddaj ponudbo</button>}
              <button className="abtn ghost" style={{ flex: 1 }} onClick={() => resolveAuction(null)}>Odstopim</button>
            </div>
          </div>
        </div>
      )}

      {/* IZBIRA POGODBE OB PODPISU */}
      {signOpts && (
        <div className="modal-bg" onClick={() => setSignOpts(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>✍️ Podpiši: {signOpts.n}</h3>
            <div className="hint" style={{ margin: "0 0 10px" }}>Pick lahko vložiš kot popust na pogodbo (trajna cap olajšava) — ali ga prihraniš za draft, dražbo ali trejd.</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button className="signopt" style={{ background: "#215c26" }} onClick={() => { setSignOpts(null); sign(); }}>
                <span className="signopt-main">Redna cena · <b>{signOpts.sal} M$</b></span>
                <span className="signopt-sub">Picki ostanejo (🥇{g.h.picks.f} · 🥈{g.h.picks.s})</span>
              </button>
              {g.h.picks.f > 0 && (
                <button className="signopt" style={{ background: "#3a2a5c" }} onClick={() => { setSignOpts(null); sign("f"); }}>
                  <span className="signopt-main">S 🥇 pickom · <b>{Math.max(2, signOpts.sal - PICK_DISC.f)} M$</b> <span style={{ color: "#8fd694" }}>(−{signOpts.sal - Math.max(2, signOpts.sal - PICK_DISC.f)})</span></span>
                  <span className="signopt-sub">Porabiš 1× 🥇 (ostane {g.h.picks.f - 1})</span>
                </button>
              )}
              {g.h.picks.s > 0 && (
                <button className="signopt" style={{ background: "#2a3a5c" }} onClick={() => { setSignOpts(null); sign("s"); }}>
                  <span className="signopt-main">S 🥈 pickom · <b>{Math.max(2, signOpts.sal - PICK_DISC.s)} M$</b> <span style={{ color: "#8fd694" }}>(−{signOpts.sal - Math.max(2, signOpts.sal - PICK_DISC.s)})</span></span>
                  <span className="signopt-sub">Porabiš 1× 🥈 (ostane {g.h.picks.s - 1})</span>
                </button>
              )}
              <button className="signopt" style={{ background: "#152744", textAlign: "center" }} onClick={() => setSignOpts(null)}>
                <span className="signopt-main" style={{ width: "100%", textAlign: "center" }}>Prekliči</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DRAFT DESKA */}
      {draftOpen && (
        <div className="modal-bg" onClick={() => setDraftOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>🎫 Draft prospektov</h3>
            <div className="hint" style={{ margin: "0 0 8px" }}>Tvoj draft slot: <b style={{ color: mySlot.top ? "#7a4fd0" : "#5a6b85" }}>{mySlot.label}</b> (slabša ekipa = boljši slot). 💎 elitni dosegljivi le z zgodnjim slotom. Na rundo: <b>1×</b> 1. krog (🥇) + <b>1×</b> 2. krog (🥈). Porabljeno: {g.draftUsed.h.f}/1 · {g.draftUsed.h.s}/1.</div>
            {g.draftBoard.length === 0 && <p style={{ fontSize: 13, color: "#8a7c63" }}>Deska je prazna — vsi prospekti so že draftani.</p>}
            <div className="tr-col">
              {g.draftBoard.map((c) => {
                const rd = c.tier === "safe" ? 2 : 1;
                const usedUp = rd === 1 ? g.draftUsed.h.f >= 1 : g.draftUsed.h.s >= 1;
                const eliteLock = c.tier === "elite" && !mySlot.top;
                const canD = !usedUp && !eliteLock && (rd === 1 ? g.h.picks.f > 0 : g.h.picks.s > 0);
                return (
                  <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 8, opacity: canD ? 1 : 0.5 }}>
                    <PlayerCard c={c} mini onClick={() => setInspect({ card: c, side: "draftview" })} />
                    <button className="abtn sign" style={{ flex: 1 }} disabled={!canD} onClick={() => draftProspect(c)}>{usedUp ? `${rd}. krog porabljen` : eliteLock ? "🔒 rabi zgodnji slot" : `Draftaj (${rd === 1 ? "🥇 1." : "🥈 2."} krog)`}</button>
                  </div>
                );
              })}
            </div>
            <div className="mrow" style={{ marginTop: 10 }}>
              <button className="abtn ghost" style={{ flex: 1 }} onClick={() => setDraftOpen(false)}>Zapri</button>
            </div>
          </div>
        </div>
      )}

      {/* INFO / OGLED KARTICE */}
      {inspect && (() => {
        const side = inspect.side;
        const isHand = side === "hand", isMarket = side === "market", isDraftView = side === "draftview";
        const c = isMarket ? asDiscount(inspect.card) : inspect.card; // v trgu prikaži s popustom
        const mine = side === "h";
        const rosterSide = (side === "h" || side === "a") ? side : "h";
        const roster = g[rosterSide].roster;
        const isStarter = mine ? (g.h.starters[c.pos] === c.id && g.injured.h !== c.id) : side === "a" ? (aiProj.starters[c.pos] && aiProj.starters[c.pos].id === c.id) : false;
        const injured = (side === "h" || side === "a") && g.injured[side] === c.id;
        const fiveCards = side === "a" ? Object.values(aiProj.starters) : starterCards;
        const others = fiveCards.filter((x) => x.id !== c.id);
        const signable = (isHand || isMarket || isDraftView) && canSign(g.h.roster, c);
        const emptyP = POS.filter((p) => p !== c.pos && !g.h.roster.some((x) => x.pos === p));
        const whyNot = g.h.roster.length >= 10 ? "Roster je poln (10)." : posCount(g.h.roster, c.pos) >= 3 ? `Že 3 igralci na poziciji ${c.pos}.` : `Ostati mora prostor za: ${emptyP.join(", ")}.`;
        return (
          <div className="modal-bg" onClick={() => setInspect(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>{side === "a" ? "AI · " : isMarket ? "🟢 Trg · " : isDraftView ? "🎫 Prospekt · " : ""}{c.n} {isStarter ? "★" : ""}{injured ? " 🩹" : ""}</h3>
              <div className="auc-card"><PlayerCard c={c} onClick={() => {}} /></div>
              <ul>
                <li><b>{c.pos}</b> · {c.club} · <b>{c.age} let</b>{c.rookie ? " · ROOKIE" : ""} · {TRAITS[c.tr].ico} {TRAITS[c.tr].n}</li>
                <li>OVR <b>{c.ovr}</b> · vpliv {c.pm >= 0 ? "+" : ""}{c.pm} · plača {c.disc ? `${c.sal} M$ (popust −25 %, prej ${c.origSal})` : `${c.sal} M$`}</li>
                <li>V peterki <b>{spts(c)}</b> tč · na klopi {Math.floor(c.ovr / 2)} tč.</li>
                {c.rookie && <li className="pot" style={{ color: ROOK_TIER[c.tier].col }}>{ROOK_TIER[c.tier].ico} {ROOK_TIER[c.tier].n} · potencial {c.potLow}–{c.potHigh} (razvije se ob koncu runde, če dobi minute).</li>}
                {(side === "h" || side === "a") && !injured && <li>Prispevek {mine ? "tvoji" : "AI"} ekipi zdaj: <b className={contribOf(roster, c, side) >= 0 ? "" : "red"}>{contribOf(roster, c, side) >= 0 ? "+" : ""}{contribOf(roster, c, side)}</b> tč (koliko bi izgubil brez njega).</li>}
              </ul>
              {!injured && others.length > 0 && <UnlockPreview card={c} sCards={others} />}
              {(isHand || isMarket || isDraftView) && (
                <div className="addbox">
                  {signable
                    ? <><div className="addval">Doda tvoji ekipi ≈ <b>{(() => { const v = addValue(g.h.roster, c, "h"); return (v >= 0 ? "+" : "") + v; })()}</b> tč{isDraftView ? " (surov; z minutami raste)" : ""}</div><div className="addstand">Trenutni izid — Ti <b>{proj.total}</b> · AI <b>{aiProj.total}</b></div></>
                    : <div className="addval" style={{ color: "#b23b2e" }}>Ne moreš podpisati: {whyNot}</div>}
                </div>
              )}
              <div className="mrow" style={{ marginTop: 10 }}>
                {isDraftView && <button className="abtn sign" style={{ flex: 1 }} disabled={!myTurn || (rookieRound(c) === 1 ? (g.draftUsed.h.f >= 1 || g.h.picks.f < 1) : (g.draftUsed.h.s >= 1 || g.h.picks.s < 1))} onClick={() => { setInspect(null); draftProspect(c); }}>{(rookieRound(c) === 1 ? g.draftUsed.h.f >= 1 : g.draftUsed.h.s >= 1) ? "krog porabljen" : `Draftaj (${rookieRound(c) === 1 ? "🥇" : "🥈"})`}</button>}
                {isMarket && <button className="abtn sign" style={{ flex: 1 }} disabled={!signable || !drawPhase} onClick={() => { setInspect(null); takeMarket(inspect.card); }}>Vzemi s popustom ({c.sal} M$)</button>}
                {isHand && actPhase && <button className="abtn sign" style={{ flex: 1 }} disabled={!signable} onClick={() => { setInspect(null); const canDisc = c.sal > 2 && (g.h.picks.f > 0 || g.h.picks.s > 0); canDisc ? setSignOpts(c) : sign(); }}>Podpiši ✍️</button>}
                {isHand && actPhase && <button className="abtn drop" style={{ flex: 1 }} onClick={() => { setInspect(null); discard(); }}>Odvrzi 🗑️</button>}
                {mine && !injured && !isStarter && <button className="abtn sign" style={{ flex: 1 }} onClick={() => { setStarter(c); setInspect(null); }}>★ V peterko</button>}
                {mine && !injured && isStarter && <button className="optbtn" style={{ flex: 1 }} onClick={() => { const st = { ...g.h.starters }; const alt = g.h.roster.filter((x) => x.pos === c.pos && x.id !== c.id && g.injured.h !== x.id).sort((x, y) => spts(y) - spts(x))[0]; if (alt) st[c.pos] = alt.id; else delete st[c.pos]; setG({ ...g, h: { ...g.h, starters: st } }); setInspect(null); say(`${surname(c.n)} gre na klop.`); }}>Na klop</button>}
                {mine && injured && <button className="abtn sign" style={{ flex: 1 }} disabled={g.h.picks.s < 1} onClick={() => { setInspect(null); setRehab(c); }}>🩹 Rehab (1× 🥈)</button>}
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
        <div className="modal-bg" onClick={() => setShowIntro(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Kako poteka poteza</h3>
            <div className="step"><div className="stepn">1</div><p><b>Vzemi karto:</b> s <b>skritega kupa</b> (na slepo) ali med <b>prostimi igralci</b> (vrhnjo prosto, globljo s trade-om).</p></div>
            <div className="step"><div className="stepn">2</div><p><b>Podpiši</b> igralce iz roke (do 10, max 3 na pozicijo). Tapni igralca v rosterju, da postane <b>štartar</b>.</p></div>
            <div className="step"><div className="stepn">3</div><p><b>Odvrzi 1 karto</b> — konec poteze. Kar odvržeš, lahko AI pobere!</p></div>
            <div className="step"><div className="stepn">🔨</div><p><b>Dražbe:</b> ko igralec z OVR {AUCTION_OVR}+ pristane med prostimi, oba GM-ja skrivno ponudita <b>draft picke</b> (🥇 {PV.f} · 🥈 {PV.s} · 🔁 swap {PV.w}). Neporabljeni picki ob koncu runde štejejo točke — vsaka dražba stane prihodnost!</p></div>
            <div className="step"><div className="stepn">🔄</div><p><b>Trejd:</b> enkrat na rundo lahko AI-ju ponudiš menjavo igralcev 1:1 in dodaš picke za izravnavo.</p></div>
            <div className="mrow"><button className="bigbtn" style={{ flex: 1 }} onClick={() => setShowIntro(false)}>Razumem, gremo!</button></div>
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
          <li><b>🧢 Coach:</b> na začetku vsake runde izbereš enega od 5 coachev — vsak da drugačen bonus (popust na zvezdnike, obrambne točke, močnejšo klop, boljše picke …). AI dobi naključnega izmed preostalih.</li>
          <li><b>🎫 Draft prospektov:</b> z gumbom odpreš desko mladih. Na rundo lahko draftaš <b>največ 1 igralca 1. kroga</b> (💎/🌱, porabi 🥇 pick) in <b>1 igralca 2. kroga</b> (🔒, porabi 🥈 pick) — kot prava ekipa na draftu. Prospekt je poceni in surov (nizek OVR zdaj), a se ob koncu runde <b>razvije</b> — če je v prvi peterki (dobi minute), raste proti stropu potenciala; na klopi počasneje. Stava na potencial namesto na takojšnjo moč. AI prav tako drafta.</li>
          <li><b>🩹 Poškodbe:</b> po vsakem krogu je 12 % možnost, da se naključen podpisani igralec (tvoj ali AI-jev) poškoduje do konca runde — ne more v prvo peterko, na klopi šteje normalno. Rehab: 1× 🥈 pick ga takoj pozdravi (tapni poškodovanca). Največ 1 aktivna poškodba na GM-a; globok roster je zavarovanje.</li>
          <li><b>Poteza:</b> 1) vzemi 1 karto (skriti kup na slepo ALI karto iz AI-jevega odpada s popustom), 2) podpiši poljubno igralcev, 3) odvrzi 1 karto.</li>
          <li><b>♻️ Odpadi (kaj se zgodi z discardi):</b> tvoji odvrženi in waivani igralci gredo v <b>tvoj odpad</b>, iz katerega jih AI lahko pobere s <b>popustom −25 % na plačo</b> — zato pazi, da mu ne odvržeš igralca, ki mu točno paše. AI-jevi odpadi so na voljo <b>tebi</b> s popustom. Popust pomeni cenejšo plačo (manj davka), OVR in vpliv ostaneta.</li>
          <li><b>Draft picki:</b> vsak GM začne rundo z 2× 🥇 (vreden {PV.f}), 3× 🥈 ({PV.s}) in 1× 🔁 pick swap ({PV.w} v dražbi). Neporabljeni 🥇/🥈 ob koncu runde štejejo točke.</li>
          <li><b>🔨 Dražba:</b> ko igralec z OVR {AUCTION_OVR}+ pristane med prostimi igralci, oba GM-ja skrivno ponudita picke. Višja ponudba igralca takoj podpiše; picki zmagovalca so porabljeni, poraženec obdrži svoje. Pick swap ob zmagi zamenja tvoj najboljši preostali pick za nasprotnikovega najslabšega.</li>
          <li><b>🔄 Trejd:</b> enkrat <b>na vsako svojo potezo</b> predlagaš AI-ju menjavo podpisanih igralcev 1:1, s picki kot izravnavo. AI sprejme, če je zanj vrednost dovolj dobra.</li>
          <li><b>✂️ Waive:</b> podpisanega igralca lahko odpustiš med proste igralce (kjer ga lahko pobere AI, superzvezdnik pa sproži dražbo). Plača pade iz plačne mase, a ostane <b>dead cap: četrtina plače (najmanj 3 M$)</b> do konca runde — šteje v davek in Moneyball.</li>
          <li><b>Prva peterka</b> (tap na igralca): štartar šteje <b>OVR + 2× vpliv</b> (zeleno/rdeče število na karti). Klop šteje OVR÷2 — zato je vpliv pomemben samo pri štartarjih.</li>
          <li><b>Lastnosti:</b> 🎯 2+ snajperja v peterki +10 · 🛡️ 2+ branilca +10 · 🧠 organizator +8 · 🔥 najboljši šesti mož na klopi šteje poln OVR + doda svoj vpliv · ⭐ vodja v rosterju +8.</li>
          <li><b>Kemija:</b> klubski dvojec +10 (do 3×) · Big Three (3× OVR 90+ v rosterju) +20 · <b>🌟 Superteam (3 štartarji z OVR 93+) +35</b> · Moneyball (poln roster pod {MB} M$) +25 · Dončić v peterki +5 🇸🇮.</li>
          <li><b>💸 Progresivni davek:</b> prvih {APRON} M$ nad limitom {CAP} M$ stane −1 točko/M$ (mehki davek), vsak milijon naprej pa −2 (apron). Superteam pot: 3 superzvezdniki + poceni klop se z bonusom +35 lahko splača kljub davku!</li>
          <li><b>Kazni:</b> manjkajoč igralec −20 · prazna pozicija −10 · karta v roki −5. Prvi zaključen roster +20.</li>
        </ul>
        <div className="mrow"><button className="abtn ghost" style={{ flex: 1 }} onClick={onClose}>Zapri</button></div>
      </div>
    </div>
  );
}
