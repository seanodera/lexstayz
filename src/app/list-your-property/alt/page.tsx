'use client'
import { Button, Input, Card, Row, Col } from 'antd';

const LexStayzListing = () => {
    return (
        <div className="bg-white p-8">
            {/* Header Section */}
            <section className="text-center mb-16">
                <h1 className="text-4xl font-bold mb-4">Partner with LexStayz: List Your Property Today</h1>
                <p className="text-lg text-gray-600">Maximize your property&apos;s potential with our global platform.</p>
            </section>

            {/* Why Choose LexStayz */}
            <section className="mb-16">
                <h2 className="text-3xl font-semibold mb-8 text-center">Why Choose LexStayz for Your Property?</h2>
                <Row gutter={[24, 24]}>
                    <Col xs={24} md={12} lg={8}>
                        <Card className="h-full">
                            <h3 className="text-xl font-bold mb-4">Global Reach & Diverse Audience</h3>
                            <p>LexStayz connects you with a global community of travelers, ensuring maximum visibility and occupancy.</p>
                        </Card>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <Card className="h-full">
                            <h3 className="text-xl font-bold mb-4">Advanced Management Tools</h3>
                            <p>Utilize our comprehensive suite of tools to manage your property efficiently.</p>
                        </Card>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <Card className="h-full">
                            <h3 className="text-xl font-bold mb-4">Secure and Reliable Payments</h3>
                            <p>Enjoy peace of mind with our secure payment processing system.</p>
                        </Card>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <Card className="h-full">
                            <h3 className="text-xl font-bold mb-4">Dedicated Host Support</h3>
                            <p>Our dedicated support team is available 24/7 to assist you with any questions or challenges.</p>
                        </Card>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <Card className="h-full">
                            <h3 className="text-xl font-bold mb-4">Tailored Pricing Strategies</h3>
                            <p>Set your own rates, availability, and cancellation policies to maximize your revenue.</p>
                        </Card>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <Card className="h-full">
                            <h3 className="text-xl font-bold mb-4">Quality Assurance</h3>
                            <p>We offer guidance on presenting your property to attract discerning travelers and ensure positive reviews.</p>
                        </Card>
                    </Col>
                </Row>
            </section>

            {/* How It Works */}
            <section className="mb-16">
                <h2 className="text-3xl font-semibold mb-8 text-center">How It Works</h2>
                <div className="space-y-8">
                    <div className="flex items-start">
                        <div className="text-2xl font-bold mr-4">1.</div>
                        <div>
                            <h3 className="text-xl font-semibold">Create Your Account</h3>
                            <p>Sign up as a host on LexStayz through our quick and easy registration process.</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <div className="text-2xl font-bold mr-4">2.</div>
                        <div>
                            <h3 className="text-xl font-semibold">List Your Property</h3>
                            <p>Complete your property profile by adding detailed descriptions, high-resolution photos, and important amenities.</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <div className="text-2xl font-bold mr-4">3.</div>
                        <div>
                            <h3 className="text-xl font-semibold">Maximize Your Exposure</h3>
                            <p>Once your listing is live, our platform ensures it reaches a wide audience.</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <div className="text-2xl font-bold mr-4">4.</div>
                        <div>
                            <h3 className="text-xl font-semibold">Manage Bookings with Ease</h3>
                            <p>Our intuitive dashboard allows you to handle all aspects of your property management.</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <div className="text-2xl font-bold mr-4">5.</div>
                        <div>
                            <h3 className="text-xl font-semibold">Secure Your Earnings</h3>
                            <p>Payments are automatically deposited into your account after guests check out.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="mb-16">
                <h2 className="text-3xl font-semibold mb-8 text-center">What Our Hosts Say</h2>
                <Row gutter={[24, 24]}>
                    <Col xs={24} md={12}>
                        <Card>
                            <p>"LexStayz has transformed the way we manage our properties."</p>
                            <div className="mt-4 font-semibold">— Host Name, Property Location</div>
                        </Card>
                    </Col>
                    <Col xs={24} md={12}>
                        <Card>
                            <p>The exposure we’ve gained through LexStayz has been remarkable.</p>
                            <div className="mt-4 font-semibold">— Host Name, Property Location</div>
                        </Card>
                    </Col>
                </Row>
            </section>

            {/* Call to Action */}
            <section className="text-center">
                <h2 className="text-3xl font-semibold mb-4">Ready to Grow Your Business?</h2>
                <p className="text-lg text-gray-600 mb-8">Join the LexStayz community today and unlock the full potential of your property.</p>
                <Button type="primary" size="large">List Your Property Now</Button>
            </section>
        </div>
    );
};

export default LexStayzListing;
