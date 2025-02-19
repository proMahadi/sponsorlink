import React from 'react';
import '../../styles/Footer.css';
import { Phone, Mail, Facebook, Instagram, Twitter, Linkedin } from '@geist-ui/icons';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <div className="footer">
      <div className='footer-container'>
        <Link to="/">
          <img src="/SponsorLinkLogo.png" alt="logo" width={50}/>
        </Link>

        <div className='useful-links'>
          <h4>Usesul links</h4>
          <div>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms and Conditions</Link>
          </div>
        </div>

        <div className='stay-connected'>
          <h4>Get in touch</h4>
          <div className='text-icon'><Phone size={18}/> Call (+250)782138100</div>
          <div className='text-icon'><Mail size={18}/> support@sponsorlink.com</div>
          <div className='social-icons'>
              <a href="#">
                  <Facebook size={18}></Facebook>
              </a>
              <a href="#">
                  <Instagram size={18}></Instagram>
              </a>
              <a href="#">
                  <Twitter size={18}></Twitter>
              </a>
              <a href="#">
                  <Linkedin size={18}></Linkedin>
              </a>
          </div>
        </div>
      </div>
      {/* <div className='footer-bottom desktop-only'>
      Copyright © All Rights Reserved
      </div> */}
    </div>
 );
}
