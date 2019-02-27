import component from './components/Root';
import paths from '../../constants/paths';
import routes from '../../constants/routes';

const { [paths.ROOT]: ROOT } = routes;
const { path } = ROOT;

export default { component, path };
