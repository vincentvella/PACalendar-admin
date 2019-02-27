import component from './components';
import paths from '../../constants/paths';
import routes from '../../constants/routes';

const { [paths.EVENT_MANAGER]: EVENT_MANAGER } = routes;
const { path, icon, alias } = EVENT_MANAGER;

export default { component, path, icon, alias };
