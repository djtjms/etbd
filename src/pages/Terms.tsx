import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { FileText, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export default function Terms() {
  const { t } = useLanguage();

  return (
    <Layout>
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors">
              <ArrowLeft size={16} />{t("terms.back")}
            </Link>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center">
                <FileText size={28} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">{t("terms.title")}</h1>
                <p className="text-muted-foreground">Last updated: December 2024</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content - legal text kept in English */}
      <section className="py-12 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-card rounded-2xl border border-border/50 p-8 space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground">By accessing and using the services provided by engineersTech, you agree to be bound by these Terms of Service.</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">2. Services Description</h2>
                <p className="text-muted-foreground">engineersTech provides software development, consulting, and related technology services. The specific scope, deliverables, and terms for each project will be outlined in a separate agreement or statement of work.</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">3. Client Responsibilities</h2>
                <p className="text-muted-foreground mb-4">As a client, you agree to:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Provide accurate and complete information required for the project</li>
                  <li>Make timely payments as agreed in the project contract</li>
                  <li>Provide feedback and approvals within reasonable timeframes</li>
                  <li>Ensure you have the rights to any materials you provide</li>
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">4. Intellectual Property</h2>
                <p className="text-muted-foreground">Upon full payment, clients receive ownership of the custom code developed specifically for their project. engineersTech retains ownership of any pre-existing code, frameworks, or tools used in the development process.</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">5. Payment Terms</h2>
                <p className="text-muted-foreground mb-4">Payment terms will be specified in the project agreement. Generally:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>A deposit may be required before work begins</li>
                  <li>Payments are due according to the agreed milestones</li>
                  <li>Late payments may incur additional fees</li>
                  <li>All fees are non-refundable unless otherwise agreed</li>
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">6. Confidentiality</h2>
                <p className="text-muted-foreground">Both parties agree to keep confidential any proprietary information shared during the course of the project.</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">7. Limitation of Liability</h2>
                <p className="text-muted-foreground">engineersTech shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">8. Termination</h2>
                <p className="text-muted-foreground">Either party may terminate the agreement with written notice. Upon termination, the client shall pay for all work completed up to the termination date.</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">9. Governing Law</h2>
                <p className="text-muted-foreground">These terms shall be governed by and construed in accordance with the laws of Bangladesh.</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">10. Changes to Terms</h2>
                <p className="text-muted-foreground">We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on our website.</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">11. Contact Information</h2>
                <p className="text-muted-foreground">For questions about these Terms of Service, please contact us at:</p>
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
