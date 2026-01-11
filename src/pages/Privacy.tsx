import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Privacy() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 bg-gradient-hero" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors">
              <ArrowLeft size={16} />
              Back to Home
            </Link>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Shield size={28} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Privacy Policy
                </h1>
                <p className="text-muted-foreground">Last updated: December 2024</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto prose prose-invert">
            <div className="bg-gradient-card rounded-2xl border border-border/50 p-8 space-y-8">
              
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">1. Information We Collect</h2>
                <p className="text-muted-foreground mb-4">
                  At engineersTech, we collect information you provide directly to us, including:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Name and contact information (email, phone number)</li>
                  <li>Company/organization details</li>
                  <li>Project requirements and communication preferences</li>
                  <li>Any other information you choose to provide</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">2. How We Use Your Information</h2>
                <p className="text-muted-foreground mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Respond to your inquiries and provide customer support</li>
                  <li>Send you technical notices, updates, and administrative messages</li>
                  <li>Communicate with you about products, services, and events</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">3. Information Sharing</h2>
                <p className="text-muted-foreground">
                  We do not sell, trade, or otherwise transfer your personal information to outside parties. 
                  We may share information with trusted third parties who assist us in operating our website, 
                  conducting our business, or serving you, as long as those parties agree to keep this information confidential.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">4. Data Security</h2>
                <p className="text-muted-foreground">
                  We implement appropriate security measures to protect your personal information against 
                  unauthorized access, alteration, disclosure, or destruction. However, no method of 
                  transmission over the Internet or electronic storage is 100% secure.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">5. Cookies</h2>
                <p className="text-muted-foreground">
                  We use cookies and similar tracking technologies to enhance your experience on our website. 
                  You can choose to disable cookies through your browser settings, although this may affect 
                  some functionality.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">6. Your Rights</h2>
                <p className="text-muted-foreground mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Access the personal data we hold about you</li>
                  <li>Request correction of inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Object to our processing of your data</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">7. Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <div className="mt-4 p-4 bg-secondary rounded-xl">
                  <p className="text-foreground font-medium">engineersTech</p>
                  <p className="text-muted-foreground">Email: info@engineerstechbd.com</p>
                  <p className="text-muted-foreground">Phone: +880 1234-567890</p>
                  <p className="text-muted-foreground">Address: Dhaka, Bangladesh</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
