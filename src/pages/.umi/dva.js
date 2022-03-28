import dva from 'dva';
import { Component } from 'react';
import createLoading from 'dva-loading';
import history from '@tmp/history';

let app = null;

export function _onCreate() {
  const plugins = require('umi/_runtimePlugin');
  const runtimeDva = plugins.mergeConfig('dva');
  app = dva({
    history,
    
    ...(runtimeDva.config || {}),
    ...(window.g_useSSR ? { initialState: window.g_initialData } : {}),
  });
  
  app.use(createLoading());
  (runtimeDva.plugins || []).forEach(plugin => {
    app.use(plugin);
  });
  
  app.model({ namespace: 'attachment', ...(require('/Users/gaomengzhou/project/enforcement/src/models/attachment.js').default) });
app.model({ namespace: 'category', ...(require('/Users/gaomengzhou/project/enforcement/src/models/category.js').default) });
app.model({ namespace: 'checkNotice', ...(require('/Users/gaomengzhou/project/enforcement/src/models/checkNotice.js').default) });
app.model({ namespace: 'complain', ...(require('/Users/gaomengzhou/project/enforcement/src/models/complain.js').default) });
app.model({ namespace: 'comprehensive', ...(require('/Users/gaomengzhou/project/enforcement/src/models/comprehensive.js').default) });
app.model({ namespace: 'effectivenes', ...(require('/Users/gaomengzhou/project/enforcement/src/models/effectivenes.js').default) });
app.model({ namespace: 'files', ...(require('/Users/gaomengzhou/project/enforcement/src/models/files.js').default) });
app.model({ namespace: 'global', ...(require('/Users/gaomengzhou/project/enforcement/src/models/global.js').default) });
app.model({ namespace: 'home', ...(require('/Users/gaomengzhou/project/enforcement/src/models/home.js').default) });
app.model({ namespace: 'increase', ...(require('/Users/gaomengzhou/project/enforcement/src/models/increase.js').default) });
app.model({ namespace: 'inspectors', ...(require('/Users/gaomengzhou/project/enforcement/src/models/inspectors.js').default) });
app.model({ namespace: 'leader', ...(require('/Users/gaomengzhou/project/enforcement/src/models/leader.js').default) });
app.model({ namespace: 'list', ...(require('/Users/gaomengzhou/project/enforcement/src/models/list.js').default) });
app.model({ namespace: 'login', ...(require('/Users/gaomengzhou/project/enforcement/src/models/login.js').default) });
app.model({ namespace: 'map', ...(require('/Users/gaomengzhou/project/enforcement/src/models/map.js').default) });
app.model({ namespace: 'match', ...(require('/Users/gaomengzhou/project/enforcement/src/models/match.js').default) });
app.model({ namespace: 'menu', ...(require('/Users/gaomengzhou/project/enforcement/src/models/menu.js').default) });
app.model({ namespace: 'process', ...(require('/Users/gaomengzhou/project/enforcement/src/models/process.js').default) });
app.model({ namespace: 'project', ...(require('/Users/gaomengzhou/project/enforcement/src/models/project.js').default) });
app.model({ namespace: 'register', ...(require('/Users/gaomengzhou/project/enforcement/src/models/register.js').default) });
app.model({ namespace: 'select', ...(require('/Users/gaomengzhou/project/enforcement/src/models/select.js').default) });
app.model({ namespace: 'setting', ...(require('/Users/gaomengzhou/project/enforcement/src/models/setting.js').default) });
app.model({ namespace: 'source', ...(require('/Users/gaomengzhou/project/enforcement/src/models/source.js').default) });
app.model({ namespace: 'statisticsTotal', ...(require('/Users/gaomengzhou/project/enforcement/src/models/statisticsTotal.js').default) });
app.model({ namespace: 'system', ...(require('/Users/gaomengzhou/project/enforcement/src/models/system.js').default) });
app.model({ namespace: 'timing', ...(require('/Users/gaomengzhou/project/enforcement/src/models/timing.js').default) });
app.model({ namespace: 'user', ...(require('/Users/gaomengzhou/project/enforcement/src/models/user.js').default) });
  return app;
}

export function getApp() {
  return app;
}

export class _DvaContainer extends Component {
  render() {
    const app = getApp();
    app.router(() => this.props.children);
    return app.start()();
  }
}
