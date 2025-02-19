import '@/styles/Contact.css'
import { Input, Textarea, Button } from '@geist-ui/core'
import { Phone, Mail, Facebook, Instagram, Twitter, Linkedin } from '@geist-ui/icons'

export default function Contact() {
    return (
        <>
            <div className="contact-container">
                <h1>Contact our <span>support</span> team.</h1>
                <div className="contact-section">
                    <div className='contact-form'>
                        <div>
                            <Input htmlType='name' placeholder="John Smith" >
                                Name
                            </Input>
                            <Input htmlType='email'  placeholder="example@email.com" >
                                Email
                            </Input>
                        </div>
                    <Textarea style={{minHeight:"100px"}}    placeholder="Your message..." />
                    <Button type="secondary-light" >
                    Send
                    </Button>
                    </div>
                    <div className='contact-info'>
                        <div className='info-unit'>
                            <h3>Get in touch</h3>
                            <div className='text-icon'><Phone size={18}/> Call (+250)782138100</div>
                            <div className='text-icon'><Mail size={18}/> support@sponsorlink.com</div>
                        </div>
                        <div className='info-unit'>
                            <h3>Follow us</h3>
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
                </div>
            </div>

        </>
    )
}