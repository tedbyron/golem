import { Link } from 'gatsby'

import Layout from '../components/layout'

const NotFoundPage = () => (
  <Layout
    title='404'
    description='404 not found.'
    pathname='404'
  >
    <section>
      <div className='golem-heading-wrapper'>
        <h1 className='golem-heading'>404</h1>
        <h2 className='golem-subheading'>That route doesn&apos;t exist…</h2>
      </div>

      <div className='golem-link-wrapper'>
        <Link to='/' className='golem-link'>
          Golem&nbsp;-&gt;
        </Link>
      </div>
    </section>
  </Layout>
)

export default NotFoundPage
