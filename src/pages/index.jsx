import loadable from '@loadable/component';

const IndexPage = loadable(() => import('../components/index'));
IndexPage.preload();
export default IndexPage;
