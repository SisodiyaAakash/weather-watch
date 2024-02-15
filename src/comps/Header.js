import WeatherLogo from '../assets/media/logo.svg';

const Header = () => {
   return (
      <header className="header">
         <div className="header-inner-wrap container">
            <div className="app-heading">
               <img className='logo' src={WeatherLogo} alt='WW'/>
               <h1 className='logo-label'>
                  <span>Weather</span>
                  <span>Watch</span>
               </h1>
            </div>
         </div>
      </header> 
   ); 
};

export default Header;
