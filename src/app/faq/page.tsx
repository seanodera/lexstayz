'use client'
import { Collapse } from 'antd';

const FAQPage = () => {
    const faqItems = [
        {
            key: '1',
            header: 'General Questions',
            items: [
                {
                    key: '1-1',
                    question: 'Q1: What is LexStayz?',
                    answer: 'LexStayz is a platform that connects travelers with a diverse range of accommodations worldwide. We offer an easy-to-use interface for booking short-term stays, as well as tools for property owners and managers to list and manage their properties.',
                },
                {
                    key: '1-2',
                    question: 'Q2: How does LexStayz work?',
                    answer: 'Travelers can search for accommodations by location, date, and other preferences. Once a suitable property is found, bookings can be made directly through the LexStayz platform. Property owners and managers can list their properties, manage bookings, and communicate with guests through our platform.',
                },
                {
                    key: '1-3',
                    question: 'Q3: Is LexStayz available in my country?',
                    answer: 'LexStayz operates globally, offering accommodations in numerous countries. You can search for properties in your desired location through our platform.',
                },
                {
                    key: '1-4',
                    question: 'Q4: How do I create an account?',
                    answer: 'You can create an account by clicking on the "Sign Up" button on our homepage. You\'ll need to provide some basic information, such as your name, email address, and password.',
                },
            ],
        },
        {
            key: '2',
            header: 'For Travelers',
            items: [
                {
                    key: '2-1',
                    question: 'Q5: How do I book a property on LexStayz?',
                    answer: 'Simply search for your desired destination, choose your dates, and browse available properties. Once you find a property you like, click "Book Now" and follow the prompts to complete your reservation.',
                },
                {
                    key: '2-2',
                    question: 'Q6: What payment methods are accepted?',
                    answer: 'We accept various payment methods, including major credit/debit cards, PayPal, and other regional payment options depending on your location.',
                },
                {
                    key: '2-3',
                    question: 'Q7: Can I cancel or modify my booking?',
                    answer: 'Yes, you can cancel or modify your booking, but this is subject to the host\'s cancellation policy. Please review the cancellation policy on the property listing page before booking.',
                },
                {
                    key: '2-4',
                    question: 'Q8: What if I have a problem with my booking?',
                    answer: 'If you encounter any issues with your booking, please contact our customer support team through the platform, and we will assist you in resolving the problem.',
                },
                {
                    key: '2-5',
                    question: 'Q9: How can I leave a review for a property?',
                    answer: 'After your stay, you\'ll receive an email invitation to review the property. You can also leave a review by logging into your account and going to the "Past Bookings" section.',
                },
            ],
        },
        {
            key: '3',
            header: 'For Hosts and Property Managers',
            items: [
                {
                    key: '3-1',
                    question: 'Q10: How do I list my property on LexStayz?',
                    answer: 'To list your property, sign up for a host account and follow the prompts to add your property details, upload photos, and set your pricing and availability.',
                },
                {
                    key: '3-2',
                    question: 'Q11: What are the fees for listing a property?',
                    answer: 'LexStayz charges a service fee on each booking. The fee is a percentage of the booking total and helps cover the cost of running the platform. You can view the exact fee structure in your host dashboard.',
                },
                {
                    key: '3-3',
                    question: 'Q12: How do I manage my bookings?',
                    answer: 'You can manage your bookings through the LexStayz host dashboard. Here, you can view upcoming reservations, communicate with guests, and update your property’s availability.',
                },
                {
                    key: '3-4',
                    question: 'Q13: Can I set my own cancellation policy?',
                    answer: 'Yes, as a host, you have the flexibility to set your own cancellation policy. We offer several standard options, or you can customize your own.',
                },
                {
                    key: '3-5',
                    question: 'Q14: How do I get paid for bookings?',
                    answer: 'Payments are processed securely through the LexStayz platform. After a guest checks out, the payment will be released to your account according to our payment schedule, typically within 24-72 hours.',
                },
                {
                    key: '3-6',
                    question: 'Q15: What if I need to cancel a guest\'s booking?',
                    answer: 'If you need to cancel a booking, please do so through your host dashboard as soon as possible. Keep in mind that frequent cancellations can affect your listing\'s visibility and your status as a host.',
                },
            ],
        },
        {
            key: '4',
            header: 'Security and Privacy',
            items: [
                {
                    key: '4-1',
                    question: 'Q16: How does LexStayz ensure the security of my personal information?',
                    answer: 'We take your privacy and security very seriously. LexStayz uses encryption and other security measures to protect your personal information. Please review our Privacy Policy for more details.',
                },
                {
                    key: '4-2',
                    question: 'Q17: What should I do if I suspect fraudulent activity?',
                    answer: 'If you suspect any fraudulent activity, contact our customer support team immediately. We will investigate the issue and take appropriate action to protect your account.',
                },
                {
                    key: '4-3',
                    question: 'Q18: How does LexStayz verify hosts and properties?',
                    answer: 'We have a verification process for hosts that may include identity checks and property reviews. Additionally, guest reviews help ensure that listings meet our community standards.',
                },
            ],
        },
        {
            key: '5',
            header: 'Technical Support',
            items: [
                {
                    key: '5-1',
                    question: 'Q19: I forgot my password. How do I reset it?',
                    answer: 'Click on the "Forgot Password?" link on the login page. You\'ll receive an email with instructions on how to reset your password.',
                },
                {
                    key: '5-2',
                    question: 'Q20: How do I contact customer support?',
                    answer: 'You can contact our customer support team by clicking on the "Contact Us" link at the bottom of our website, or through the support section in your account dashboard.',
                },
                {
                    key: '5-3',
                    question: 'Q21: The website/app isn’t working properly. What should I do?',
                    answer: 'If you encounter any technical issues, try refreshing the page or restarting the app. If the problem persists, contact our support team for assistance.',
                },
            ],
        },
    ];

    return (
        <div className="md:px-24 px-7 py-4 text-center lg:w-2/3 mx-auto">
            <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>
            <p>This are the most commonly asked questions about lexstayz. If you have any further questions please contact support</p>
            <Collapse accordion>
                {faqItems.map(({ key, header, items }) => (
                    <Collapse.Panel header={header} key={key}>
                        <Collapse accordion>
                            {items.map(({ key, question, answer }) => (
                                <Collapse.Panel header={question} key={key}>
                                    <p>{answer}</p>
                                </Collapse.Panel>
                            ))}
                        </Collapse>
                    </Collapse.Panel>
                ))}
            </Collapse>
        </div>
    );
};

export default FAQPage;
