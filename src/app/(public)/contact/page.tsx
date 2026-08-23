export default function ContactPage() {
  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-6 md:px-12 py-16 flex-grow">
      <div className="text-center mb-12">
        <p className="text-xs font-extrabold tracking-[0.16em] uppercase text-gold mb-4">Get in Touch</p>
        <h1 className="text-4xl md:text-5xl font-bold font-fraunces text-wine-deep leading-tight">
          Contact the Studio
        </h1>
        <p className="mt-4 text-ink-soft text-[15.5px] max-w-xl mx-auto">
          We look forward to making your special day unforgettable. Reach out to us directly via email or phone for any inquiries outside of standard bookings.
        </p>
      </div>

      <div className="bg-white rounded-[24px] p-8 md:p-12 shadow-card border border-border flex flex-col md:flex-row gap-12 justify-center">
        <div className="flex flex-col items-center text-center flex-1">
          <div className="w-16 h-16 rounded-full bg-secondary text-gold-light flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          </div>
          <h2 className="font-fraunces font-bold text-xl text-wine-deep mb-2">Email Us</h2>
          <a href="mailto:Gladysmomoh18@gmail.com" className="text-[15px] font-semibold text-ink hover:text-wine transition-colors">
            Gladysmomoh18@gmail.com
          </a>
        </div>
        
        <div className="w-px bg-border hidden md:block"></div>
        
        <div className="flex flex-col items-center text-center flex-1">
          <div className="w-16 h-16 rounded-full bg-secondary text-gold-light flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          </div>
          <h2 className="font-fraunces font-bold text-xl text-wine-deep mb-2">Call Us</h2>
          <a href="tel:9292464115" className="text-[15px] font-semibold text-ink hover:text-wine transition-colors">
            (929) 246-4115
          </a>
        </div>
      </div>
    </div>
  );
}