import PageTitle from '../../components/PageTitle';
import { Link } from 'react-router-dom';

const ChangeAvailabilityPage = () => {
  return (
    <>
      <PageTitle>Zmień liczbę dostępności</PageTitle>
      <div className='padded_content' style={{ display: 'flex' }}>
        <ul className='padded_content librarian-list' style={{ marginRight: '2rem' }}>
          <li><h3><Link to='/librarian/resources/availability/books'>książek</Link></h3></li>
          <li><h3><Link to='/librarian/resources/availability/ebooks'>ebooków</Link></h3></li>
        </ul>
      </div>
    </>
  );
};

export default ChangeAvailabilityPage;