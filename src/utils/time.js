 export default function residue(end) {
  let str='';
  let status='';
  const now=new Date().getTime();
  const num=end-now;
  const dayNum=1000*60*60*24;
  const hourNum=1000*60*60;
  const minNum=1000*60;
  const day=Math.floor(num/dayNum);
  const hour=Math.floor((num%dayNum)/hourNum);
  const min=Math.floor(((num%dayNum)%hourNum)/minNum);
  if(num<0){
    str+='已超时';
    status="4";
  }else{
    if(min&&hour&&day){
      str+=`${day}天${hour}小时${min}分钟`;
      status="3";
    }else if(min&&hour){
      str+=`${hour}小时${min}分钟`;
      status="2";
    }else if(min){
      str+=`${min}分钟`;
      status="1";
    }else{
      str+='小于一分钟';
      status="0";
    }
  }
  return {
    str,status,
  }
}
