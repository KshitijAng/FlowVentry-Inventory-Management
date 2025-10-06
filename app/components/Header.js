import React from "react";

const Header = () => {
  return (
    <header className="text-gray-600 body-font">
      <div className="container mx-auto flex flex-wrap py-7 flex-col md:flex-row items-center">
        <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
        <img
            src="/logo.png"  // put your PNG in /public as flowventry.png
            alt="Flowventry logo"
            className="p-5w-20 h-17 object-contain"
          />
        </a>
        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
          <a className="mr-10 text-lg hover:text-black-900 cursor-pointer"><b>Home</b></a>
          <a className="mr-10 text-lg hover:text-gray-900 cursor-pointer"><b>About</b></a>
          <a className="mr-10 text-lg hover:text-gray-900 cursor-pointer"><b>Contact</b></a>
        </nav>
      </div>
    </header>
  );
};

export default Header;