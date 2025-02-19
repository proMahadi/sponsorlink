import React from "react";

export default function Pricing() {
    return (
        <div className="pricing-section">
          <div className="title">Subscription Tiers</div>
            <div className="pricing-container">
                {/* Free Tier - Active */}
                <div className="pricing-card free active">
                    <h2>Free Tier</h2>
                    <p className="price">£0/month</p>
                    <div className="features">
                        <div>- 10 searches per week</div>
                        <div>- 5 new listings per month</div>
                        <div>- 2 profile integrations</div>
                        <div>- Filtering by cost and location</div>
                        <div>- 'Online' listing type</div>
                        <div>- Limited collaboration option</div>
                    </div>
                    <div className="plan-status">
                      Current Plan
                    </div>
                </div>

                {/* Premium Tier - Upgrade */}
                <div className="pricing-card premium">
                    <h2>Premium Tier</h2>
                    <p className="price">£1.99/month</p>
                    <div className="features">
                        <div>- 50 searches per week</div>
                        <div>- 20 new listings per month</div>
                        <div>- All profile integrations</div>
                        <div>- Advanced filtering options</div>
                        <div>- Full listing types</div>
                        <div>- Unlimited collaboration</div>
                        <div>- Multiple license discounts available</div>
                    </div>
                    <button className="signup-btn">Upgrade Now</button>
                </div>
            </div>
            <p className="contact-info">Contact us for multi-license rates.</p>
        </div>
    );
}
