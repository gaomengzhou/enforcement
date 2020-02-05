// create history
const history = require('history/createHashHistory').default({
  basename: '/workorderweb/',
});
window.g_history = history;
export default history;
