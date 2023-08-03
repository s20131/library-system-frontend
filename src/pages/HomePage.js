import PageTitle from '../components/PageTitle';

const HomePage = () => {
  return (
    <>
      <PageTitle>Witaj na stronie systemu bibliotecznego!</PageTitle>
      <div className='padded_content'>
        <p>
          Załóż darmowe konto i zacznij w prosty i szybki sposób wypożyczać książki oraz ebooki z partnerskich bibliotek.
        </p>
      </div>
    </>
  );
};

export default HomePage;