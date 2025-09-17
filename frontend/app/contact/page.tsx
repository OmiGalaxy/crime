"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
    priority: "normal",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Support",
      details: "support@crimewatch.com",
      description: "Get help within 24 hours",
      action: "mailto:support@crimewatch.com",
    },
    {
      icon: Phone,
      title: "Emergency Hotline",
      details: "+1 (555) 911-HELP",
      description: "24/7 emergency support",
      action: "tel:+15559114357",
    },
    {
      icon: MapPin,
      title: "Headquarters",
      details: "123 Safety Street, Security City, SC 12345",
      description: "Visit our main office",
      action: "#",
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: "Mon-Fri: 8AM-8PM EST",
      description: "Weekend support available",
      action: "#",
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "Message Sent Successfully!",
      description: "We'll get back to you within 24 hours.",
    })

    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      category: "",
      message: "",
      priority: "normal",
    })
    setIsSubmitting(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in-up">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Contact Us</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            We're Here to Help
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Have questions about CrimeWatch? Need technical support? Want to report an issue? Our dedicated team is
            ready to assist you 24/7.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <Card className="mb-8 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Get in Touch
                </CardTitle>
                <CardDescription>Multiple ways to reach our support team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="group">
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-primary/5 transition-colors duration-300">
                      <info.icon className="h-5 w-5 text-primary mt-1 group-hover:scale-110 transition-transform duration-300" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{info.title}</h3>
                        <p className="text-sm text-primary font-medium">{info.details}</p>
                        <p className="text-xs text-muted-foreground">{info.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Emergency Notice */}
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive mt-1" />
                  <div>
                    <h3 className="font-semibold text-destructive mb-2">Emergency Situations</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      For immediate emergencies, please contact your local emergency services directly.
                    </p>
                    <Button variant="destructive" size="sm" className="w-full">
                      Call 911
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-primary" />
                  Send us a Message
                </CardTitle>
                <CardDescription>Fill out the form below and we'll get back to you as soon as possible</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Enter your full name"
                        required
                        className="border-primary/20 focus:border-primary/40"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="border-primary/20 focus:border-primary/40"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                        <SelectTrigger className="border-primary/20 focus:border-primary/40">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">Technical Support</SelectItem>
                          <SelectItem value="account">Account Issues</SelectItem>
                          <SelectItem value="feature">Feature Request</SelectItem>
                          <SelectItem value="bug">Bug Report</SelectItem>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority Level</Label>
                      <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                        <SelectTrigger className="border-primary/20 focus:border-primary/40">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      placeholder="Brief description of your inquiry"
                      required
                      className="border-primary/20 focus:border-primary/40"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Please provide detailed information about your inquiry..."
                      required
                      rows={6}
                      className="border-primary/20 focus:border-primary/40 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Quick answers to common questions about CrimeWatch
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                question: "How secure is my data on CrimeWatch?",
                answer:
                  "We use end-to-end encryption and follow industry-standard security protocols to protect all user data and crime reports.",
              },
              {
                question: "How quickly are reports processed?",
                answer:
                  "Most reports are reviewed within 2-4 hours. Urgent cases are prioritized and processed immediately.",
              },
              {
                question: "Can I track the status of my report?",
                answer:
                  "Yes! You can track your report status in real-time through your dashboard and receive notifications on updates.",
              },
              {
                question: "Is CrimeWatch available 24/7?",
                answer:
                  "Yes, our platform is available 24/7 for report filing. Our support team is available during business hours with emergency support available.",
              },
            ].map((faq, index) => (
              <Card key={index} className="border-primary/20 hover:border-primary/40 transition-colors duration-300">
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
