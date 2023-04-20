import PageTitle from '../components/PageTitle';

const HomePage = () => {
  return (
    <>
      <PageTitle>Witaj na stronie systemu bibliotecznego!</PageTitle>
      <div className='padded_content'>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sit amet tellus rutrum, consequat est vel,
          dapibus urna. Donec sit amet tortor auctor, egestas sapien eu, pulvinar quam. Suspendisse consectetur nisi sit
          amet elit euismod, sit amet pellentesque urna fringilla. Curabitur id neque tempus, sagittis enim lobortis,
          ornare orci. In venenatis justo et lorem malesuada interdum. Nunc lorem mauris, finibus eu elementum eu,
          tempus
          vel ex. Mauris iaculis blandit ligula sed porta.</p>
        <p>
          Donec lacinia fringilla convallis. Etiam vestibulum diam in porta congue. Sed neque diam, suscipit at urna eu,
          fringilla laoreet neque. Suspendisse egestas felis et velit fringilla accumsan. Vestibulum posuere, libero sit
          amet tristique vestibulum, metus orci pellentesque nunc, quis sodales odio nibh sit amet leo. Sed faucibus
          euismod maximus. Vivamus tempus nibh ut est congue, vel placerat arcu viverra.
        </p>
      </div>
    </>
  );
};

export default HomePage;