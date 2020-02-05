import React, { Fragment } from 'react';
import { formatMessage } from 'umi/locale';
class UserLayout extends React.PureComponent {

  render() {
    const { children } = this.props;
    return (
      <div>
          {children}
      </div>
    );
  }
}

export default UserLayout;
