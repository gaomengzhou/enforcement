/* eslint-disable no-use-before-define */
/* eslint-disable func-names */
import React,{PureComponent} from 'react';
import echarts from 'echarts'

class ExtendLeader extends PureComponent {
  state={
    name:this.props.name?this.props.name:'echarts'
  };

  componentDidMount(){
    // 多图表自适应
    window.addEventListener("resize", function () {
      myCharts.resize();
    });
    const myCharts=echarts.init(document.getElementById(this.state.name));
    const option = {
      legend: {
        orient: 'vertical',
        x: 'right',
        selectedMode:false,// 禁止点击
        data:['已废案','待处理','待结案','已结案']
      },
      series: [
        {
          name:'访问来源',
          type:'pie',
          selectedMode: 'single',
          radius: [0, '30%'],

          label: {
            normal: {
              position: 'inner'
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data:[
            {
              value:this.props.totalOrder,
              name:`工单总数${this.props.totalOrder}`
            },
          ]
        },
        {
          name:'访问来源',
          type:'pie',
          radius: ['40%', '55%'],
          label: {
            normal: {
              formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
              backgroundColor: '#eee',
              borderColor: '#aaa',
              borderWidth: 1,
              borderRadius: 4,
              rich: {
                a: {
                  color: '#999',
                  lineHeight: 22,
                  align: 'center'
                },
                hr: {
                  borderColor: '#aaa',
                  width: '100%',
                  borderWidth: 0.5,
                  height: 0
                },
                b: {
                  fontSize: 16,
                  lineHeight: 33
                },
                per: {
                  color: '#eee',
                  backgroundColor: '#334455',
                  padding: [2, 4],
                  borderRadius: 2
                }
              }
            }
          },
          data:[
            {
              value:this.props.hasAbolished,
              name:'已废案'
            },
            {
              value:this.props.toBeProcessed,
              name:'待处理'
            },
            {
              value:this.props.toBeClosed,
              name:'待结案'
            },
            {
              value:this.props.hasBeenClosed,
              name:'已结案'
            },
          ]
        }
      ]
    };
    myCharts.setOption(option)
  }

  render(){
    const {name} = this.state;
     return(
       <div id={name} style={{width:'100%',height:500}} />

     )
  }
}
export default ExtendLeader;
