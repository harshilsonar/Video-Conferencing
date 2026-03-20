function Footer() {
  return (
    <footer className="bg-black-900 text-gray-300 py-10 mt-10">
      <div className="max-w-7xl mx-auto px-5 grid md:grid-cols-4 gap-8">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white">VideoConferncing</h2>
          <p className="mt-3 text-sm">
            High-quality video conferencing for meetings, webinars, and collaboration.
          </p>
        </div>

        {/* Features */}
        <div>
          <h3 className="text-white font-semibold mb-3">Features</h3>
          <ul className="space-y-2 text-sm">
            <li>HD Video Calls</li>
            <li>Screen Sharing</li>
            <li>Chat & Messaging</li>
            <li>Recording</li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-white font-semibold mb-3">Company</h3>
          <ul className="space-y-2 text-sm">
            <li>About Us</li>
            <li>Careers</li>
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-white font-semibold mb-3">Connect</h3>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">Facebook</a>
            <a href="#" className="hover:text-white">Twitter</a>
            <a href="#" className="hover:text-white">LinkedIn</a>
          </div>

          <p className="mt-4 text-sm">support@videoConferncing.com</p>
        </div>

      </div>

      {/* Bottom */}
      <div className="text-center text-sm mt-10 border-t border-gray-700 pt-5">
        © {new Date().getFullYear()} VideoConferncing. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;