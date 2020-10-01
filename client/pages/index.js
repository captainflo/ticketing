import axios from 'axios';

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  return <h1>Landing Page</h1>;
};

LandingPage.getInitialProps = async ({ req }) => {
  if (typeof window === 'undefined') {
    const response = await axios.get(
      'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
      {
        headers: req.headers,
      }
    );
    return response.data;
    // We are on the server
    //  Request should be made to http://ingress-nginx.ingress-nginx...
  } else {
    const response = await axios.get('/api/users/currentuser');
    return response.data;
  }
};
export default LandingPage;
