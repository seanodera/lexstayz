import React from "react";
import {Menu} from "antd";
import Link from "next/link";

export default function AboutUsPage() {
    return (
        <div className="md:px-16 px-7 py-4 bg-gradient-to-t from-primary-100 via-primary-100 via-60% to-transparent">
            <div className="grid grid-cols-3 gap-6 w-3/4">
                <div className="px-7 flex justify-end">
                    <Menu className="rounded-xl fixed ms-auto" items={[
                        {
                            key: 'About Us',
                            label: <Link href="#about">About Us</Link>,
                        },
                        {
                            key: 'Our Mission',
                            label: <Link href="#mission">Our Mission</Link>
                        },
                        {
                            key: 'What We Offer',
                            label: <Link href="#what-we-offer">What We Offer</Link>
                        },
                        {
                            key: 'Our Values',
                            label: <Link href="#values">Our Values</Link>
                        },
                        {
                            key: 'For Travelers',
                            label: <Link href="#for-travelers">For Travelers</Link>
                        },
                        {
                            key: 'For Property Managers and Hosts',
                            label: <Link href="#for-hosts">For Property Managers and Hosts</Link>
                        },
                        {
                            key: 'For Affiliate Marketers',
                            label: <Link href="#for-affiliates">For Affiliate Marketers</Link>
                        },
                        {
                            key: 'Join Us on the Journey',
                            label: <Link href="#join-us">Join Us on the Journey</Link>
                        },
                        {
                            key: 'Contact Us',
                            label: <Link href="#contact">Contact Us</Link>
                        },
                    ]}/>
                </div>
                <div className="col-span-2 space-y-8">
                    <div id="about" className="py-12 px-7 bg-white rounded-xl shadow-md ">
                        <h1 className="text-3xl font-bold mb-4">About Us</h1>
                        <p>Welcome to LexStayz, your comprehensive platform for discovering, booking, and managing
                            unique accommodations across the globe. Whether you&apos;re a traveler seeking a memorable
                            stay, a property manager or host looking to showcase your space, or an affiliate marketer
                            aiming to share the best travel experiences, LexStayz connects you with everything you need
                            to make your journey successful.</p>
                    </div>

                    <div id="mission" className="py-12 px-7 bg-white rounded-xl">
                        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                        <p>At LexStayz, our mission is to create a seamless, inclusive ecosystem that brings together
                            travelers, property managers, hosts, and affiliate marketers. We aim to provide exceptional
                            service and value to all our stakeholders, ensuring that every interaction with our platform
                            contributes to an outstanding travel or hosting experience.</p>
                    </div>

                    <div id="what-we-offer" className="py-12 px-7 rounded-xl bg-white">
                        <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>

                        <h3 className="font-medium text-gray-700 mb-2">Diverse Accommodations:</h3>
                        <p>From luxurious villas and cozy apartments to boutique hotels and unique stays, LexStayz
                            offers a wide range of accommodations tailored to every traveler&apos;s needs. Our listings
                            include detailed descriptions, high-quality photos, and real-time availability, making it
                            easy for travelers to find their ideal stay.</p>

                        <h3 className="font-medium text-gray-700 mb-2">Property Management Tools:</h3>
                        <p>For property managers and hosts, LexStayz provides robust tools to list, promote, and manage
                            your properties efficiently. Our platform offers everything from booking management and
                            calendar synchronization to guest communication and performance analytics, helping you
                            maximize your property&apos;s potential.</p>

                        <h3 className="font-medium text-gray-700 mb-2">Affiliate Marketing Opportunities:</h3>
                        <p>Affiliate marketers can partner with LexStayz to earn commissions by promoting our platform.
                            With competitive rates and a wide range of marketing tools, our affiliate program is
                            designed to help you succeed while sharing the best travel and accommodation options with
                            your audience.</p>

                        <h3 className="font-medium text-gray-700 mb-2">Seamless Booking Experience:</h3>
                        <p>We simplify the booking process with our user-friendly platform, allowing travelers to secure
                            their stay with just a few clicks. Our secure payment options and instant confirmations
                            ensure a hassle-free experience from start to finish.</p>

                        <h3 className="font-medium text-gray-700 mb-2">Personalized Recommendations:</h3>
                        <p>Whether you’re a traveler or a host, we provide personalized recommendations based on your
                            preferences and behavior on our platform, ensuring that you find the perfect match for your
                            needs.</p>

                        <h3 className="font-medium text-gray-700 mb-2">Global Reach with Local Touch:</h3>
                        <p>LexStayz operates globally, but with a local touch. We partner with trusted hosts, property
                            managers, and affiliates around the world to offer a diverse selection of accommodations,
                            all carefully vetted to ensure quality, comfort, and safety.</p>
                    </div>

                    <div id="values" className="py-12 px-7 bg-white rounded-xl">
                        <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
                        <h3 className="font-medium text-gray-700 mb-2">Customer-Centric Approach:</h3>
                        <p>Our users, including travelers, hosts, property managers, and affiliates, are at the heart of
                            everything we do. We strive to provide exceptional service and support, ensuring that your
                            experience with LexStayz exceeds expectations.</p>

                        <h3 className="font-medium text-gray-700 mb-2">Trust and Safety:</h3>
                        <p>Trust is the cornerstone of our platform. We implement robust security measures and work
                            closely with our hosts and property managers to maintain the highest standards of safety and
                            reliability.</p>

                        <h3 className="font-medium text-gray-700 mb-2">Community and Collaboration:</h3>
                        <p>LexStayz is a community that thrives on collaboration. We bring together travelers, hosts,
                            property managers, and affiliates to create a vibrant network where everyone can benefit and
                            grow.</p>

                        <h3 className="font-medium text-gray-700 mb-2">Innovation and Growth:</h3>
                        <p>We are committed to continuous innovation, offering the latest technology and tools to
                            enhance your experience on our platform. Whether you’re booking a stay, managing a property,
                            or promoting our services, LexStayz provides the resources you need to succeed.</p>
                    </div>

                    <div id="for-travelers" className="py-12 px-7 bg-white rounded-xl">
                        <h2 className="text-2xl font-semibold mb-4">For Travelers</h2>
                        <p>LexStayz offers you a world of accommodations at your fingertips. Whether you&apos;re
                            exploring a new city, attending an event, or looking for a weekend escape, we provide a
                            diverse selection of stays to suit every budget and preference. Our platform is designed to
                            make your booking experience easy, secure, and enjoyable.</p>
                    </div>

                    <div id="for-hosts" className="py-12 px-7 bg-white rounded-xl">
                        <h2 className="text-2xl font-semibold mb-4">For Property Managers and Hosts</h2>
                        <p>LexStayz is your partner in maximizing the potential of your property. Our platform provides
                            comprehensive tools to manage bookings, optimize occupancy, and enhance guest experiences.
                            Join our community of trusted hosts and showcase your property to a global audience.</p>
                    </div>

                    <div id="for-affiliates" className="py-12 px-7 bg-white rounded-xl">
                        <h2 className="text-2xl font-semibold mb-4">For Affiliate Marketers</h2>
                        <p>Become a part of our success by joining the LexStayz affiliate program. Share our platform
                            with your audience and earn commissions on bookings made through your referrals. We provide
                            you with all the tools and support you need to grow your affiliate business and maximize
                            your earnings.</p>
                    </div>

                    <div id="join-us" className="py-12 px-7 bg-white rounded-xl">
                        <h2 className="text-2xl font-semibold mb-4">Join Us on the Journey</h2>
                        <p>LexStayz is more than just a platform; it’s a thriving ecosystem that supports and connects
                            travelers, property managers, hosts, and affiliate marketers. Whether you’re searching for
                            your next stay, managing a property, or looking to share the best travel experiences,
                            LexStayz is here to make it all possible.</p>
                        <p>Thank you for choosing LexStayz. Together, we’re creating a world where travel is easy,
                            accommodations are exceptional, and opportunities are endless.</p>
                    </div>

                    <div id="contact" className="py-12 px-7 bg-white rounded-xl">
                        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                        <p>Have questions or need assistance? Our dedicated support team is here to help.</p>
                        <p>Email: [Insert Contact Email]</p>
                        <p>Phone: [Insert Contact Phone Number]</p>
                        <p>Follow us on [Social Media Links]</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
