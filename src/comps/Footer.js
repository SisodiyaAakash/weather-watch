import GitHubIcon from '../assets/media/icons/github.svg';
import DribbbleIcon from '../assets/media/icons/dribbble.svg';
import InstagramIcon from '../assets/media/icons/instagram.svg';

const Footer = () => {
   return (
      <footer className="footer">
         <div className="footer-inner-wrap container">
            <a className='social-icon' href='https://github.com/SisodiyaAakash/weather-watch/'>
               <img src={GitHubIcon} alt="GitHub" />
            </a>
            <a className='social-icon' href='https://dribbble.com/shots/23653438-Weather-Watch'>
               <img src={DribbbleIcon} alt="Instagram" />
            </a>
            <a className='social-icon' href='https://instagram.com/aakash.s27'>
               <img src={InstagramIcon} alt="Instagram" />
            </a>
         </div>
      </footer>
   );
};

export default Footer;
