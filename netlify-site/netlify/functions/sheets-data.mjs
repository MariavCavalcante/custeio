import * as XLSX from "xlsx";

const SAMU_ID="1_a5uBxC0puDYcVsYeIk6tyHPOq02ditnhn8laX0IqcU";
const UPA_ID="1MvkjwDCPl-N6HfC8akNG8fwtM1AhDmR5Q35PhYweTww";
const MONTHS={JANEIRO:1,FEVEREIRO:2,"MARÇO":3,MARCO:3,ABRIL:4,MAIO:5,JUNHO:6,JULHO:7,AGOSTO:8,SETEMBRO:9,OUTUBRO:10,NOVEMBRO:11,DEZEMBRO:12};
const MONTH_NAMES={1:"JANEIRO",2:"FEVEREIRO",3:"MARÇO",4:"ABRIL",5:"MAIO",6:"JUNHO",7:"JULHO",8:"AGOSTO",9:"SETEMBRO",10:"OUTUBRO",11:"NOVEMBRO",12:"DEZEMBRO"};

function norm(s){return String(s??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase().trim().replace(/[^A-Z0-9 ]/g," ").replace(/\s+/g," ")}
const aliases={"AP GOIANIA":"Aparecida de Goiânia","APARECIDA DE GOIANIA":"Aparecida de Goiânia","AGUAS LINDAS":"Águas Lindas de Goiás","AGUAS LINDAS DE GOIAS":"Águas Lindas de Goiás","SANTA HELENA":"Santa Helena de Goiás","SANTA HELENA DE GOIAS":"Santa Helena de Goiás","VALPARAISO":"Valparaíso de Goiás","VALPARAISO DE GOIAS":"Valparaíso de Goiás","PLANALTINA":"Planaltina de Goiás","PLANALTINA DE GOIAS":"Planaltina de Goiás","JATAI":"Jataí","ACREUNA":"Acreúna"};
function muni(v){const k=norm(v);if(aliases[k])return aliases[k];return String(v??"").trim().toLowerCase().split(/\s+/).map(p=>["de","da","do","das","dos","e"].includes(p)?p:p.charAt(0).toUpperCase()+p.slice(1)).join(" ")}
function money(v){if(v===null||v===undefined||v==="")return 0;if(typeof v==="number")return v;let s=String(v).replace("R$","").replace(/\s/g,"");if(s.includes(",")&&s.includes(".")){if(s.lastIndexOf(",")>s.lastIndexOf("."))s=s.replace(/\./g,"").replace(",",".");else s=s.replace(/,/g,"")}else if(s.includes(","))s=s.replace(/\./g,"").replace(",",".");const n=Number(s);return Number.isFinite(n)?n:0}
function num(v){const n=Number(v);return Number.isFinite(n)?n:0}
function period(name){const m=String(name).trim().toUpperCase().match(/^(JANEIRO|FEVEREIRO|MARÇO|MARCO|ABRIL|MAIO|JUNHO|JULHO|AGOSTO|SETEMBRO|OUTUBRO|NOVEMBRO|DEZEMBRO)\s+(\d{4})$/);return m?{year:+m[2],month:MONTHS[m[1]]}:null}
function idx(headers){const h={};headers.forEach((v,i)=>{if(String(v??"").trim())h[norm(v)]=i});return (...names)=>{for(const n of names){if(h[norm(n)]!==undefined)return h[norm(n)]}return null}}
function get(row,ix,...names){const i=ix(...names);return i===null?null:row[i]}
function titleCase(s){return String(s??"").trim().toLowerCase().split(/\s+/).map(p=>["de","da","do","das","dos","e"].includes(p)?p:p.charAt(0).toUpperCase()+p.slice(1)).join(" ")}

async function workbook(id){
  const url=`https://docs.google.com/spreadsheets/d/${id}/export?format=xlsx&t=${Date.now()}`;
  const res=await fetch(url,{redirect:"follow",cache:"no-store"});
  if(!res.ok)throw new Error(`Google Sheets retornou ${res.status} para a planilha ${id}`);
  const ct=res.headers.get("content-type")||"";
  if(ct.includes("text/html"))throw new Error("A planilha não está disponível para leitura pública por link.");
  const buf=Buffer.from(await res.arrayBuffer());
  return XLSX.read(buf,{type:"buffer",cellDates:false,raw:true});
}
function matrix(wb,name){const ws=wb.Sheets[name];return ws?XLSX.utils.sheet_to_json(ws,{header:1,raw:true,defval:"",blankrows:false}):[]}

export async function handler(){
  try{
    const [sw,uw]=await Promise.all([workbook(SAMU_ID),workbook(UPA_ID)]);
    const samu=[],upa=[],glosas=[],devolucoes=[],empenhos=[],quality=[];

    for(const sh of sw.SheetNames){
      const p=period(sh);
      if(p){
        const vv=matrix(sw,sh);const headers=vv[1]||[];const ix=idx(headers);
        for(let r=2;r<vv.length;r++){
          const row=vv[r]||[];const mr=get(row,ix,"Município");if(!mr)continue;
          const mf=get(row,ix,"Mês");if(mf&&norm(mf)!==norm(MONTH_NAMES[p.month]))quality.push({type:"Divergência de período",source:"SAMU 192",sheet:sh});
          const ms=["Central (habitada) - MS","Central (habilitada) - MS","Central (qualificada) - MS","USA (habilitada) - MS","USA (qualificada) - MS","USB (habilitada) - MS","USB (qualificada) - MS","Moto - MS"].reduce((a,n)=>a+money(get(row,ix,n)),0);
          const ses=money(get(row,ix,"Valor Mensal da SES"));
          samu.push({year:p.year,month:p.month,competence:`${p.year}-${String(p.month).padStart(2,"0")}`,component:"SAMU 192",municipality:muni(mr),macro:titleCase(get(row,ix,"Macrorregião")),region:titleCase(get(row,ix,"Região")),usa_hab:num(get(row,ix,"USA (habilitada)")),usa_qual:num(get(row,ix,"USA (qualificada)")),usb_hab:num(get(row,ix,"USB (habilitada)")),usb_qual:num(get(row,ix,"USB (qualificada)")),moto:num(get(row,ix,"Moto")),central_hab_ms:money(get(row,ix,"Central (habitada) - MS","Central (habilitada) - MS")),central_qual_ms:money(get(row,ix,"Central (qualificada) - MS")),usa_hab_ms:money(get(row,ix,"USA (habilitada) - MS")),usa_qual_ms:money(get(row,ix,"USA (qualificada) - MS")),usb_hab_ms:money(get(row,ix,"USB (habilitada) - MS")),usb_qual_ms:money(get(row,ix,"USB (qualificada) - MS")),moto_ms:money(get(row,ix,"Moto - MS")),ses_bruto:ses,ms_bruto:ms,glosa:money(get(row,ix,"Glosa")),devolucao:money(get(row,ix,"Devoluções")),complemento:money(get(row,ix,"Complemento")),source_sheet:sh});
        }
      }else if(/^Empenho\s+\d{4}$/i.test(sh)){
        const vv=matrix(sw,sh),y=Number((sh.match(/\d{4}/)||[])[0]),row=vv[3]||[];
        if(row[1]!==undefined&&row[1]!=="")empenhos.push({year:y,component:"UPA 24h",value:money(row[1])});
        if(row[2]!==undefined&&row[2]!=="")empenhos.push({year:y,component:"SAMU 192",value:money(row[2])});
      }else if(norm(sh)==="GLOSAS"){
        const vv=matrix(sw,sh),headers=vv[0]||[],ix=idx(headers);
        for(let r=1;r<vv.length;r++){const row=vv[r]||[],val=money(get(row,ix,"valor_glosa"));if(!val)continue;let c=get(row,ix,"cnes");c=c?String(Math.trunc(Number(c)||0)).padStart(7,"0"):"";glosas.push({year:num(get(row,ix,"ano")),month:num(get(row,ix,"mes_numero")),component:String(get(row,ix,"componente")||"").trim(),municipality:muni(get(row,ix,"municipio")),unit:String(get(row,ix,"unidade")||"").trim(),cnes:c,source:String(get(row,ix,"fonte_pagadora")||"").trim(),value:val,status:String(get(row,ix,"situacao")||"").trim()})}
      }else if(norm(sh)==="DEVOLUCOES"){
        const vv=matrix(sw,sh),headers=vv[0]||[],ix=idx(headers);
        for(let r=1;r<vv.length;r++){const row=vv[r]||[],val=money(get(row,ix,"valor_devolvido"));if(!val)continue;devolucoes.push({year:num(get(row,ix,"ano")),component:String(get(row,ix,"componente")||"").trim(),municipality:muni(get(row,ix,"municipio")),value:val,status:String(get(row,ix,"situacao")||"").trim()})}
      }else quality.push({type:"Aba não classificada",source:"SAMU 192",sheet:sh});
    }

    for(const sh of uw.SheetNames){
      const p=period(sh);if(!p){quality.push({type:"Aba não classificada",source:"UPA 24h",sheet:sh});continue}
      const vv=matrix(uw,sh),headers=vv[0]||[],ix=idx(headers);
      for(let r=1;r<vv.length;r++){
        const row=vv[r]||[],mr=get(row,ix,"Município");if(!mr)continue;
        const mf=get(row,ix,"Mês");if(mf&&norm(mf)!==norm(MONTH_NAMES[p.month]))quality.push({type:"Divergência de período",source:"UPA 24h",sheet:sh});
        const ses=money(get(row,ix,"Valor Mensal - SES/GO")),ms=money(get(row,ix,"Valor Mensal - MS"));let c=get(row,ix,"CNES");c=c?String(Math.trunc(Number(c)||0)).padStart(7,"0"):"";
        upa.push({year:p.year,month:p.month,competence:`${p.year}-${String(p.month).padStart(2,"0")}`,component:"UPA 24h",unit:String(get(row,ix,"UPA 24h")||"").trim(),municipality:muni(mr),macro:titleCase(get(row,ix,"Macrorregião")),region:titleCase(get(row,ix,"Região")),cnes:c,status:String(get(row,ix,"Descrição")||"").trim().toUpperCase(),ses_bruto:ses,ms_bruto:ms,glosa:money(get(row,ix,"Glosa")),devolucao:money(get(row,ix,"Devoluções")),source_sheet:sh});
      }
    }

    for(const row of [...samu,...upa]){
      const matches=glosas.filter(g=>Number(g.year)===Number(row.year)&&Number(g.month)===Number(row.month)&&g.component===row.component&&((g.cnes&&row.cnes&&g.cnes===String(row.cnes).padStart(7,"0"))||(!g.cnes&&norm(g.municipality)===norm(row.municipality))));
      const mensal=Number(row.glosa)||0,aux=matches.reduce((a,g)=>a+Number(g.value||0),0),abatida=mensal>0?mensal:aux;
      const fontes=matches.map(g=>norm(g.source));let gs=0,gm=0;
      if(abatida>0&&fontes.some(f=>f==="MS"||f.includes("MINISTERIO"))&&!fontes.some(f=>f.includes("SES")))gm=abatida;else gs=abatida;
      row.glosa_abatida=abatida;row.ses=Number(row.ses_bruto||0)-gs;row.ms=Number(row.ms_bruto||0)-gm;row.total=row.ses+row.ms;
    }

    return {statusCode:200,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store, no-cache, must-revalidate","access-control-allow-origin":"*"},body:JSON.stringify({generatedAt:new Date().toISOString(),samu,upa,glosas,devolucoes,empenhos,quality})};
  }catch(e){
    return {statusCode:500,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store"},body:JSON.stringify({error:e.message})};
  }
}