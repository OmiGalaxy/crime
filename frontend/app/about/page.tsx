import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Users, Clock, Award, Target, Eye, Heart, Zap } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const stats = [
    { label: "Reports Processed", value: "50,000+", icon: Shield },
    { label: "Active Users", value: "25,000+", icon: Users },
    { label: "Average Response Time", value: "2.4 hrs", icon: Clock },
    { label: "Success Rate", value: "94%", icon: Award },
  ]

  const values = [
    {
      icon: Target,
      title: "Precision",
      description: "Every report matters. We ensure accurate processing and swift action on all crime reports.",
    },
    {
      icon: Eye,
      title: "Transparency",
      description: "Complete visibility into your case progress with real-time updates and clear communication.",
    },
    {
      icon: Heart,
      title: "Community",
      description: "Building safer communities through collaborative crime prevention and reporting.",
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Cutting-edge technology meets law enforcement for faster, smarter crime resolution.",
    },
  ]

  const team = [
    {
      name: "Sarah Chen",
      role: "Chief Technology Officer",
      description: "Former cybersecurity expert with 15+ years in law enforcement technology.",
      image: "/professional-woman-tech-executive.png",
    },
    {
      name: "Detective Mike Rodriguez",
      role: "Law Enforcement Advisor",
      description: "20-year veteran detective specializing in digital crime investigation.",
      image: "/professional-male-detective.jpg",
    },
    {
      name: "Dr. Emily Watson",
      role: "Data Security Lead",
      description: "PhD in Computer Science, expert in secure data handling and privacy protection.",
      image: "/professional-woman-data-scientist.png",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in-up">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">About CrimeWatch</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Protecting Communities Through Technology
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            CrimeWatch is a revolutionary crime reporting and management platform that bridges the gap between citizens,
            law enforcement, and community safety. Our mission is to create safer communities through innovative
            technology and collaborative crime prevention.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="text-center group hover:shadow-lg transition-all duration-300 border-primary/20 hover:border-primary/40"
            >
              <CardContent className="pt-6">
                <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform duration-300" />
                <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-4 text-primary">Our Mission</h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    To revolutionize crime reporting and law enforcement response through cutting-edge technology,
                    ensuring every citizen has a voice and every case receives the attention it deserves. We believe in
                    the power of community collaboration and transparent communication to build safer neighborhoods.
                  </p>
                  <Button asChild className="bg-primary hover:bg-primary/90">
                    <Link href="/register">Join Our Community</Link>
                  </Button>
                </div>
                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center overflow-hidden">
                    <img 
                      src="/crime.jpg" 
                      alt="Crime Prevention" 
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do, from product development to community engagement.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 border-primary/20 hover:border-primary/40"
              >
                <CardHeader className="text-center">
                  <value.icon className="h-12 w-12 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform duration-300" />
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our diverse team combines law enforcement expertise with cutting-edge technology to deliver the most
              effective crime reporting platform.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 border-primary/20 hover:border-primary/40"
              >
                <CardContent className="p-6 text-center">
                  <div className="relative mb-6">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-primary/20 group-hover:border-primary/40 transition-all duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">{member.role}</Badge>
                  <p className="text-muted-foreground text-sm leading-relaxed">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join thousands of citizens, police officers, and administrators who are already using CrimeWatch to
                build safer communities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                  <Link href="/register">Get Started Today</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-primary/20 hover:border-primary/40 bg-transparent"
                >
                  <Link href="/contact">Contact Our Team</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
