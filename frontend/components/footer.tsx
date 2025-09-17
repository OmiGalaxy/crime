import Link from "next/link"
import { Shield, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  const footerLinks = {
    platform: [
      { name: "File Complaint", href: "/complaint" },
      { name: "Track Status", href: "/track" },
      { name: "Dashboard", href: "/dashboard" },
      { name: "Profile", href: "/profile" },
    ],
    support: [
      { name: "Help Center", href: "/help" },
      { name: "Contact Us", href: "/contact" },
      { name: "Emergency", href: "/emergency" },
      { name: "FAQ", href: "/faq" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "Compliance", href: "/compliance" },
    ],
    resources: [
      { name: "About Us", href: "/about" },
      { name: "News", href: "/news" },
      { name: "Blog", href: "/blog" },
      { name: "API Docs", href: "/api" },
    ],
  }

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
  ]

  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              <Link href="/" className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold">CrimeWatch</span>
              </Link>

              <p className="text-muted-foreground max-w-md">
                A comprehensive crime report management system connecting citizens, police, and administrators for safer
                communities nationwide.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>Emergency: 911 | Support: (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>support@crimewatch.gov</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>123 Justice Ave, Capital City, CC 12345</span>
                </div>
              </div>


            </div>

            {/* Links Sections */}
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-3">
                {footerLinks.platform.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-3 mb-6">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Social Links */}
              <div>
                <h4 className="font-semibold mb-4">Follow Us</h4>
                <div className="flex gap-3">
                  {socialLinks.map((social) => {
                    const Icon = social.icon
                    return (
                      <Button key={social.name} variant="ghost" size="sm" className="h-9 w-9 p-0" asChild>
                        <Link href={social.href}>
                          <Icon className="h-4 w-4" />
                          <span className="sr-only">{social.name}</span>
                        </Link>
                      </Button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Bottom Footer */}
        <div className="py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2025 CrimeWatch. All rights reserved. | Built for safer communities.
            </div>

            <div className="flex items-center gap-6 text-sm">
              {footerLinks.legal.map((link, index) => (
                <div key={link.name} className="flex items-center gap-6">
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                  {index < footerLinks.legal.length - 1 && <span className="text-muted-foreground">•</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
