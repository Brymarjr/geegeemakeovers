import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      
      <section className="relative w-full min-h-[85vh] flex items-center justify-center bg-background px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <span className="text-sm tracking-widest uppercase text-primary mb-6 font-medium">
            Mount Vernon, New York
          </span>
          
          <h1 className="text-5xl md:text-7xl font-medium tracking-tight text-foreground mb-8">
            Expert Makeup & Traditional Gele Artistry
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 font-light leading-relaxed">
            Specializing in flawless bridal, editorial, and event styling. We combine technical precision with an eye for natural beauty to deliver a sophisticated look tailored to your features.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link 
              href="/book"
              className="inline-flex h-14 w-full sm:w-auto items-center justify-center bg-primary px-10 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Request a Consultation
            </Link>
            <a 
              href="/#portfolio"
              className="inline-flex h-14 w-full sm:w-auto items-center justify-center border border-border bg-transparent px-10 text-base font-medium text-foreground transition-colors hover:bg-secondary"
            >
              View Portfolio
            </a>
          </div>
        </div>
      </section>

      {/* FIXED: Added id="process" right here so the navigation links can find it */}
      <section id="process" className="w-full py-24 bg-secondary/30 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-medium tracking-tight mb-4">The Booking Process</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg font-light">
              A seamless reservation experience designed to ensure we understand your specific styling requirements before locking in your appointment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 text-center md:text-left">
            <div className="flex flex-col space-y-4">
              <span className="text-sm tracking-widest text-primary uppercase font-medium">Step 01</span>
              <h3 className="text-xl font-medium">Select a Date</h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                Browse the availability calendar and select a date and time that suits your event schedule. Submitting a request holds your slot temporarily.
              </p>
            </div>
            
            <div className="flex flex-col space-y-4">
              <span className="text-sm tracking-widest text-primary uppercase font-medium">Step 02</span>
              <h3 className="text-xl font-medium">Consultation & Pricing</h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                We connect via phone or WhatsApp to discuss your specific Gele style, makeup preferences, location details, and finalize the pricing.
              </p>
            </div>
            
            <div className="flex flex-col space-y-4">
              <span className="text-sm tracking-widest text-primary uppercase font-medium">Step 03</span>
              <h3 className="text-xl font-medium">Confirmation</h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                Once the details and payment are confirmed, your time slot is officially locked into the calendar and secured for your event.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="portfolio" className="w-full py-24 bg-background px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-medium tracking-tight mb-12 text-center">Featured Work</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="aspect-[3/4] bg-secondary flex items-center justify-center text-muted-foreground font-light">
              Client Image Placeholder
            </div>
            <div className="grid grid-rows-2 gap-4">
              <div className="bg-secondary flex items-center justify-center text-muted-foreground font-light">
                Client Image Placeholder
              </div>
              <div className="bg-secondary flex items-center justify-center text-muted-foreground font-light">
                Client Image Placeholder
              </div>
            </div>
          </div>
          
        </div>
      </section>

    </div>
  );
}