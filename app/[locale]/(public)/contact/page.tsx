import Link from "next/link";
import { Mail, MapPin, PhoneCall } from "lucide-react";

const contactCards = [
  {
    title: "Phone",
    value: "+880 1700-000000",
    subtext: "Sat-Thu, 10:00 AM - 7:00 PM",
    icon: PhoneCall,
  },
  {
    title: "Email",
    value: "support@smarttaxbd.com",
    subtext: "We usually reply within 24 hours",
    icon: Mail,
  },
  {
    title: "Office",
    value: "Dhaka, Bangladesh",
    subtext: "Remote and in-person consultation",
    icon: MapPin,
  },
];

export default function ContactPage() {
  return (
    <main className="bg-gradient-to-b from-white via-green-50/50 to-slate-50">
      <section className="container mx-auto px-4 lg:px-8 py-14 lg:py-20">
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <p className="inline-flex rounded-full border border-green-200 bg-green-100 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-green-700">
            Contact Smart Tax
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
            Let&apos;s discuss your tax needs
          </h1>
          <p className="text-base leading-relaxed text-slate-600 md:text-lg">
            Reach out to our team for service details, onboarding support, or
            help with your ongoing tax requests.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 pb-16">
        <div className="grid gap-5 md:grid-cols-3">
          {contactCards.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <item.icon className="mb-4 h-10 w-10 rounded-full bg-green-100 p-2 text-green-700" />
              <h2 className="text-lg font-semibold text-slate-900">
                {item.title}
              </h2>
              <p className="mt-2 text-sm font-medium text-slate-800">
                {item.value}
              </p>
              <p className="mt-1 text-sm text-slate-600">{item.subtext}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 lg:p-10">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Next Steps
          </h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            Already have an account? Create a tax order directly and we&apos;ll
            follow up with document requirements and estimated timelines.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/profile/orders/create"
              className="rounded-full bg-green-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700"
            >
              Create Tax Order
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-green-600 px-6 py-2.5 text-sm font-semibold text-green-700 transition-colors hover:bg-green-100"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
