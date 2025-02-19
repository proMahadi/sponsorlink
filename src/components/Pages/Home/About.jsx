import '@/styles/About.css'
import { Collapse } from '@geist-ui/core'
import Footer from '@/components/Footer/Footer'


export default function About() {
    return (
        <>
            <div className="about-container">
                <div className="faq-section">
                    <h1>Frequently asked <span>questions</span>.</h1>
                    <Collapse.Group className='faq-group'>
                        <Collapse title="Question A" initialVisible>
                            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>
                        </Collapse>
                        <Collapse title="Question B">
                            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>
                        </Collapse>
                        <Collapse title="Question C">
                            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>
                        </Collapse>
                        <Collapse title="Question D">
                            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>
                        </Collapse>
                        <Collapse title="Question E">
                            <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>
                        </Collapse>
                    </Collapse.Group>
                </div>
            </div>
            <Footer/>
        </>
    )
}