export default function TermsPage() {
  return (
    <div className="bg-slate-50 pb-16 pt-12">
      <div className="container space-y-10">
        <div className="text-center space-y-3">
          <p className="text-xs uppercase tracking-[0.25em] text-yellow-600">Legal</p>
          <h1 className="text-4xl font-semibold text-slate-900">Terms &amp; Conditions</h1>
          <p className="text-sm text-slate-600">Effective Date: January 1, 2025</p>
          <p className="text-base text-slate-600 max-w-3xl mx-auto">
            Welcome to ZOOZU_ng. By using our website, products, and services, you agree to the terms below.
            Please read carefully before placing an order or booking a service.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr,0.6fr]">
          <div className="space-y-6">
            {[
              {
                id: "orders",
                title: "Orders & Payments",
                body: [
                  "All prices are listed in Nigerian Naira (₦) unless stated otherwise.",
                  "Orders are confirmed once payment is received and you have accepted the order summary.",
                  "For bespoke orders, a non-refundable deposit may be required before production begins.",
                ],
              },
              {
                id: "shipping",
                title: "Shipping & Delivery",
                body: [
                  "Standard delivery timelines are estimates and may vary by location.",
                  "You are responsible for accurate delivery details; re-delivery fees may apply for incorrect addresses.",
                  "Customs, duties, or import fees (if applicable) are the responsibility of the recipient.",
                ],
              },
              {
                id: "returns",
                title: "Returns & Exchanges",
                body: [
                  "Ready-to-wear items may be eligible for returns or exchanges within 7 days if unworn and with tags attached.",
                  "Bespoke or custom-made items are final sale once production starts, except in cases of quality defects.",
                  "To initiate a return, contact us with your order number and reason for return; unauthorized returns may be rejected.",
                ],
              },
              {
                id: "fittings",
                title: "Fittings & Alterations",
                body: [
                  "Fitting appointments must be scheduled in advance; reschedules require at least 24 hours notice.",
                  "Minor alterations post-delivery may be offered at an additional fee depending on scope.",
                  "Missed appointments may incur a fee and delay delivery timelines.",
                ],
              },
              {
                id: "privacy",
                title: "Privacy",
                body: [
                  "We collect and process personal data to fulfill orders, provide services, and improve your experience.",
                  "We do not sell your data. Third-party processors (e.g., payment gateways) are bound by confidentiality and security obligations.",
                  "Review our Privacy Policy for full details on data usage, storage, and your rights.",
                ],
              },
              {
                id: "ip",
                title: "Intellectual Property",
                body: [
                  "All content, designs, logos, and imagery on this site are owned by ZOOZU_ng or licensed for use.",
                  "You may not reproduce, distribute, or modify any materials without prior written consent.",
                ],
              },
              {
                id: "liability",
                title: "Limitation of Liability",
                body: [
                  "We are not liable for indirect, incidental, or consequential damages arising from use of our products or services.",
                  "Our total liability for any claim is limited to the amount paid for the product or service in question.",
                ],
              },
              {
                id: "governing-law",
                title: "Governing Law & Disputes",
                body: [
                  "These terms are governed by the laws of the Federal Republic of Nigeria.",
                  "Disputes will be resolved amicably where possible; otherwise, they will be subject to the exclusive jurisdiction of Nigerian courts.",
                ],
              },
              {
                id: "updates",
                title: "Changes to These Terms",
                body: [
                  "We may update these terms from time to time. The revised date will be noted above.",
                  "Continued use of our site or services after updates constitutes acceptance of the revised terms.",
                ],
              },
            ].map((section) => (
              <div key={section.id} id={section.id} className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">{section.title}</h2>
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  {section.body.map((point) => (
                    <li key={point} className="flex gap-2">
                      <span className="text-yellow-600" aria-hidden>
                        •
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900">Need help?</h3>
              <p className="mt-2 text-sm text-slate-600">
                Questions about these terms or a specific order? Reach our support team.
              </p>
              <div className="mt-4 space-y-2 text-sm text-slate-800">
                <p>
                  Email: <span className="font-semibold">support@zoozu_ng.com</span>
                </p>
                <p>
                  Phone: <span className="font-semibold">+234 706 820 9546</span>
                </p>
                <p>
                  Address: <span className="font-semibold">123 Fashion Ave, Ikoyi, Lagos, Nigeria</span>
                </p>
              </div>
              <div className="mt-4 flex flex-col gap-2 text-sm font-semibold">
                <a href="/contact" className="rounded bg-yellow-600 px-4 py-2 text-center text-white transition hover:bg-yellow-500">
                  Contact Us
                </a>
                <a
                  href="/bespoke-fitting"
                  className="rounded border border-slate-200 px-4 py-2 text-center text-slate-800 transition hover:border-yellow-500"
                >
                  Book a Fitting
                </a>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900">Quick Links</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li>
                  <a href="#orders" className="hover:text-yellow-700">
                    Orders &amp; Payments
                  </a>
                </li>
                <li>
                  <a href="#shipping" className="hover:text-yellow-700">
                    Shipping &amp; Delivery
                  </a>
                </li>
                <li>
                  <a href="#returns" className="hover:text-yellow-700">
                    Returns &amp; Exchanges
                  </a>
                </li>
                <li>
                  <a href="#privacy" className="hover:text-yellow-700">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#governing-law" className="hover:text-yellow-700">
                    Governing Law
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

