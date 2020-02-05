import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={[
        {
          key: '建设单位：南京市栖霞区人民政府尧化办事处',
          title: '建设单位：南京市栖霞区人民政府尧化办事处',
          blankTarget: true,
        },
        {
          key: '承建单位：武汉烽火信息集成技术有限公司',
          title: '承建单位：武汉烽火信息集成技术有限公司',
          blankTarget: true,
        },
      ]}
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" /> 2018 All Rights Reserved
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
