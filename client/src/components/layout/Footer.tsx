import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-[#1E40AF] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:mb-0">
            <div className="flex items-center mb-4">
              <div className="text-2xl font-bold">
                <i className="fas fa-bolt text-[#FAFF00] mr-1"></i>
                MindSpark
              </div>
            </div>
            <p className="max-w-sm text-white/70 mb-4">Learn faster, study smarter with AI-powered flashcards and quizzes.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <i className="fab fa-twitter text-lg"></i>
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <i className="fab fa-instagram text-lg"></i>
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <i className="fab fa-facebook text-lg"></i>
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <i className="fab fa-youtube text-lg"></i>
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/features"><a className="text-white/70 hover:text-white transition-colors">Features</a></Link></li>
                <li><Link href="/pricing"><a className="text-white/70 hover:text-white transition-colors">Pricing</a></Link></li>
                <li><Link href="/for-teachers"><a className="text-white/70 hover:text-white transition-colors">For Teachers</a></Link></li>
                <li><Link href="/for-students"><a className="text-white/70 hover:text-white transition-colors">For Students</a></Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/help"><a className="text-white/70 hover:text-white transition-colors">Help Center</a></Link></li>
                <li><Link href="/blog"><a className="text-white/70 hover:text-white transition-colors">Blog</a></Link></li>
                <li><Link href="/tutorials"><a className="text-white/70 hover:text-white transition-colors">Tutorials</a></Link></li>
                <li><Link href="/api-docs"><a className="text-white/70 hover:text-white transition-colors">API</a></Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about"><a className="text-white/70 hover:text-white transition-colors">About Us</a></Link></li>
                <li><Link href="/careers"><a className="text-white/70 hover:text-white transition-colors">Careers</a></Link></li>
                <li><Link href="/privacy"><a className="text-white/70 hover:text-white transition-colors">Privacy</a></Link></li>
                <li><Link href="/terms"><a className="text-white/70 hover:text-white transition-colors">Terms</a></Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/70">&copy; {new Date().getFullYear()} MindSpark. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
              <Link href="/privacy"><a className="text-white/70 hover:text-white transition-colors mr-4">Privacy Policy</a></Link>
              <Link href="/terms"><a className="text-white/70 hover:text-white transition-colors">Terms of Service</a></Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
