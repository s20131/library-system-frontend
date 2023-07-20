import PageTitle from '../../components/PageTitle';
import { Link } from 'react-router-dom';

const AddNewResourcePage = () => {
  return (
    <>
      <PageTitle>Dodaj nowy zasób</PageTitle>
      <div className='padded_content' style={{ display: 'flex' }}>
        <ul className='padded_content librarian-list' style={{ marginRight: '2rem' }}>
          <li><h3><Link to='/librarian/resources/add/book'>Dodaj książkę</Link></h3></li>
        </ul>
      </div>
    </>
  );
};

export default AddNewResourcePage;