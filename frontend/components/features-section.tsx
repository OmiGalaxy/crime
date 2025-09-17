"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Shield, Clock, Users, Bell, Eye, Database } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: FileText,
      title: "Easy Report Filing",
      description:
        "Submit crime reports with our intuitive form system. Upload evidence, add details, and track progress.",
      badge: "For Citizens",
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      icon: Eye,
      title: "Real-time Monitoring",
      description:
        "Police officers can view, review, and process complaints in real-time with professional dashboards.",
      badge: "For Police",
      color: "bg-green-500/10 text-green-600",
    },
    {
      icon: Users,
      title: "Admin Control Panel",
      description: "Complete administrative control over users, complaints, and system management.",
      badge: "For Admins",
      color: "bg-purple-500/10 text-purple-600",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Get instant updates when your complaint status changes. Stay informed throughout the process.",
      badge: "Real-time",
      color: "bg-orange-500/10 text-orange-600",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "End-to-end encryption ensures your sensitive information remains protected and confidential.",
      badge: "Security",
      color: "bg-red-500/10 text-red-600",
    },
    {
      icon: Clock,
      title: "Fast Response",
      description: "Average response time of 2.4 hours. Our system prioritizes urgent cases automatically.",
      badge: "Efficient",
      color: "bg-yellow-500/10 text-yellow-600",
    },
  ]

  const processSteps = [
    {
      step: "01",
      title: "File Report",
      description: "Citizens submit detailed crime reports through our secure platform",
    },
    {
      step: "02",
      title: "Police Review",
      description: "Law enforcement reviews and validates the submitted complaints",
    },
    {
      step: "03",
      title: "Case Processing",
      description: "Approved cases are processed and assigned to appropriate departments",
    },
    {
      step: "04",
      title: "Resolution",
      description: "Citizens receive updates and final resolution of their cases",
    },
  ]

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Features Grid */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <Shield className="w-3 h-3 mr-1" />
            Platform Features
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Everything You Need for
            <span className="block text-primary">Crime Management</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our comprehensive platform provides all the tools needed for efficient crime reporting, tracking, and
            management.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={feature.title}
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-card/50 backdrop-blur-sm"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${feature.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Process Flow */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <Database className="w-3 h-3 mr-1" />
            How It Works
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Simple 4-Step Process</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From filing a report to resolution, our streamlined process ensures efficient handling of every case.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {processSteps.map((step, index) => (
            <div key={step.step} className="relative">
              <div className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {step.step}
                  </div>
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-border -translate-x-8">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full" />
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
