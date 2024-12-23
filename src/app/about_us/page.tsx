// src/app/about_us/page.tsx
import React from 'react';
import './about_us.css';

const AboutUsPage: React.FC = () => {
    return (
        <div className="about-us-container">
            <section className="about-us-header">
                <h1 className="about-us-title">About Tanacoin</h1>
                <p className="about-us-intro">
                    Welcome to Tanacoin – the next big revolution in the digital currency world! 
                    Tanacoin is a groundbreaking blockchain-powered currency designed to transform the way we think about money and transactions. 
                    With a focus on security, speed, and scalability, Tanacoin is poised to become the global standard for decentralized financial solutions. 
                    Whether you&apos;re an individual, institution, or business, Tanacoin offers a secure, fast, and transparent way to engage with the financial world.
                </p>
            </section>
            
            <section className="mission-section">
                <h2 className="section-title">Our Mission</h2>
                <p className="section-text">
                    At Tanacoin, our mission is simple yet powerful: to empower individuals and organizations by providing a seamless, decentralized financial system. 
                    We are committed to offering a digital currency that can be trusted for daily transactions, smart contracts, and decentralized finance (DeFi) applications. 
                    With Tanacoin, we aim to eliminate the barriers to financial inclusion, making transactions more accessible and efficient for everyone, everywhere.
                </p>
            </section>

            <section className="vision-section">
                <h2 className="section-title">Our Vision</h2>
                <p className="section-text">
                    We envision a future where Tanacoin is at the heart of the global economy. 
                    By offering a secure, transparent, and decentralized alternative to traditional financial services, we are creating a new ecosystem where individuals have control over their money, and businesses can trust digital currency for everyday transactions. 
                    Our goal is to be the driving force behind the financial evolution, where Tanacoin is the preferred currency for the next generation of global transactions.
                </p>
            </section>

            <section className="endorsements-section">
                <h2 className="section-title">Partnerships & Industry Recognition</h2>
                <p className="section-text">
                    Tanacoin has already garnered support from leading blockchain innovators and financial institutions that share our vision for a decentralized future. 
                    Our partners are excited about Tanacoin&apos;s potential to disrupt the financial system, and we are proud to be collaborating with pioneers in blockchain technology, DeFi, and fintech. 
                    These strategic alliances ensure that Tanacoin is not just a currency, but a revolutionary platform with strong technical backing and market trust.
                </p>
            </section>

            <section className="expertise-section">
                <h2 className="section-title">Our Expertise</h2>
                <p className="section-text">
                    Powered by a team of blockchain experts, financial visionaries, and world-class developers, Tanacoin is built on the latest blockchain technologies. 
                    We bring years of expertise in cryptocurrency, smart contracts, and decentralized finance, ensuring that Tanacoin will be the most reliable, secure, and scalable cryptocurrency available. 
                    Our team is constantly innovating and pushing the boundaries of what&apos;s possible with blockchain, aiming to provide unmatched value and convenience to our users.
                </p>
            </section>

            <section className="values-section">
                <h2 className="section-title">Core Values</h2>
                <ul className="values-list">
                    <li className="value-item">
                        <strong>Security:</strong> The security of our users is our top priority. Every Tanacoin transaction is backed by state-of-the-art encryption and blockchain protocols to ensure your money is always safe.
                    </li>
                    <li className="value-item">
                        <strong>Innovation:</strong> We are dedicated to driving innovation in the blockchain space, continually improving our technology to provide you with cutting-edge features and functionality.
                    </li>
                    <li className="value-item">
                        <strong>Decentralization:</strong> Tanacoin is built on the principles of decentralization, giving individuals the power to control their own finances without relying on third-party intermediaries.
                    </li>
                    <li className="value-item">
                        <strong>Transparency:</strong> Transparency is at the core of Tanacoin. With every transaction visible on the blockchain, you can trust that our operations are open, fair, and accessible.
                    </li>
                </ul>
            </section>

            <section className="upcoming-launch-section">
                <h2 className="section-title">Tanacoin – Coming Soon!</h2>
                <p className="section-text">
                    The wait is almost over! Tanacoin is set to launch soon, bringing with it a new era of decentralized finance. 
                    As we prepare for launch, we invite you to join us on this exciting journey. Get ready to be part of a global movement towards a more inclusive, secure, and efficient financial future. 
                    Stay tuned for updates and exclusive early access opportunities – we can&apos;t wait to share Tanacoin with the world!
                </p>
            </section>

            <section className="contact-section">
                <h2 className="section-title">Contact Us</h2>
                <p className="section-text">
                    Have questions about Tanacoin or want to learn more? We&apos;re here to help! Reach out to our team for more information, 
                    and stay connected with us on social media for the latest updates. 
                    You can contact us directly at <a href="mailto:support@tanacoin.com" className="contact-email">support@tanacoin.com</a> – 
                    we’re excited to hear from you and answer all your queries!
                </p>
            </section>
        </div>
    );
};

export default AboutUsPage;
