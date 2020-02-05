import moment from 'moment';

export default function range(length){
  const arr=[];
  const now=new Date().getTime();
  const num=3600*1000*24*length;
  const ago=now-num;
  arr.push(moment(moment(ago).format('YYYY-MM-DD'),'YYYY-MM-DD'));
  arr.push(moment(moment(now).format('YYYY-MM-DD'),'YYYY-MM-DD'));
  return arr
}

