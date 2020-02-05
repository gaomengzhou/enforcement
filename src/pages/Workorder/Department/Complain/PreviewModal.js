import React, { Component } from 'react';
import { Radio } from 'antd';
import styles from './Detail.less';
import classnames from 'classnames';
import pic1 from '@/assets/p1.jpg';
import pic2 from '@/assets/p2.jpg';
import pic3 from '@/assets/p3.jpg';
import pic4 from '@/assets/p4.jpg'
export default class PreviewModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            total: 4,
            current: 1
        }
    }
    onAnimate = (move, callback) => {
        let AnimateContainer = document.getElementById('animate-container');
        if (AnimateContainer.timeId) return;
        const { total, current } = this.state;
        if (move < 0 && current == total) return;
        if (move > 0 && current == 1) return;
        // AnimateContainer.timeId && clearInterval(AnimateContainer.timeId);
        let style = getComputedStyle(AnimateContainer, null);
        let source = parseInt(style.left);
        AnimateContainer.timeId = setInterval(() => {
            let newStyle = getComputedStyle(AnimateContainer, null);
            let current = parseInt(newStyle.left);
            let step = move / 15;
            step = step > 0 ? Math.ceil(step) : Math.floor(step);
            current += step;
            AnimateContainer.style.left = current + "px";
            if (current == (source + move)) {
                clearInterval(AnimateContainer.timeId);
                AnimateContainer.timeId = null;
                typeof callback == 'function' && callback();
            }
        }, 20)
    };
    //更新页
    onSetCurrent = (type) => {
        let { current } = this.state;
        type == 'prev' && (current -= 1);
        type == 'next' && (current += 1);
        this.setState({ current });
    }
    render() {
        const { total, current } = this.state;
        let prevStyle = current == 1 ? { color: '#ccc' } : {};
        let nextStyle = current == total ? { color: '#ccc' } : {};
        return (
            <div className={styles['detail_pannel']} onMouseLeave={() => { this.props.onDisplay(false) }}>
                <div>
                    <div className={styles['scroll-container']}>
                        <ul id='animate-container'>
                            <li><img src={pic1} /></li>
                            <li><img src={pic2} /></li>
                            <li><img src={pic3} /></li>
                            <li><img src={pic4} /></li>
                        </ul>
                    </div>
                </div>
                <span className={styles['scroll-prev']} style={nextStyle} onClick={this.onAnimate.bind(this, -450, this.onSetCurrent.bind(this, 'next'))}>&lt;</span>
                <span className={styles['scroll-next']} style={prevStyle} onClick={this.onAnimate.bind(this, 450, this.onSetCurrent.bind(this, 'prev'))}>&gt;</span>
                <div className={styles['text-decoration']}><span>上传人：</span>王多鱼&emsp;<span>上传时间：</span>2018-10-10 10:10:10&emsp;<span>上传时工单状态：</span>待派遣</div>
                <div style={{ textAlign: 'right', padding: '15px 15px 0 0' }}>
                    <span>
                        <Radio.Group defaultValue={1}>
                            <Radio value={1}>全部</Radio>
                            <Radio value={2}>整改前</Radio>
                            <Radio value={3}>整改后</Radio>
                        </Radio.Group>
                    </span>
                    <span>
                        {current} / {total}
                    </span>
                </div>
            </div>
        )
    }
}