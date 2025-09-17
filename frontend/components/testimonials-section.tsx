"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Citizen",
      location: "Downtown District",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      content:
        "The platform made reporting a break-in so much easier. I received updates throughout the entire process and felt heard by law enforcement.",
      badge: "Verified User",
    },
    {
      name: "Officer Michael Chen",
      role: "Police Officer",
      location: "Metro Police Department",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      content:
        "This system has revolutionized how we handle complaints. The dashboard is intuitive and helps us prioritize cases effectively.",
      badge: "Law Enforcement",
    },
    {
      name: "David Rodriguez",
      role: "System Administrator",
      location: "City Hall",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      content:
        "Managing users and overseeing the entire system has never been easier. The admin panel provides all the tools we need.",
      badge: "Administrator",
    },
    {
      name: "Emily Watson",
      role: "Citizen",
      location: "Riverside Community",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      content:
        "I was skeptical about online reporting, but this platform exceeded my expectations. Fast, secure, and professional.",
      badge: "Verified User",
    },
  ]

  const stats = [
    { label: "User Satisfaction", value: "98%" },
    { label: "Average Rating", value: "4.9/5" },
    { label: "Response Time", value: "2.4hrs" },
    { label: "Cases Resolved", value: "9,234" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <Star className="w-3 h-3 mr-1" />
            Testimonials
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Trusted by Thousands
            <span className="block text-primary">Across the Nation</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See what citizens, police officers, and administrators are saying about our crime management platform.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Testimonial Carousel */}
          <div className="relative">
            <Card className="bg-card/50 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <Quote className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="text-lg leading-relaxed mb-6">"{testimonials[currentTestimonial].content}"</p>

                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={testimonials[currentTestimonial].avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {testimonials[currentTestimonial].name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{testimonials[currentTestimonial].name}</div>
                          <div className="text-sm text-muted-foreground">
                            {testimonials[currentTestimonial].role} • {testimonials[currentTestimonial].location}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">{testimonials[currentTestimonial].badge}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentTestimonial ? "bg-primary w-8" : "bg-muted"
                    }`}
                    onClick={() => setCurrentTestimonial(index)}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={prevTestimonial}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={nextTestimonial}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <Card key={stat.label} className="text-center p-6 bg-muted/30 border-0">
                  <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                  <div className="text-sm text-foreground/70">{stat.label}</div>
                </Card>
              ))}
            </div>

            <Card className="p-6 bg-primary/5 border-primary/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="font-semibold">Live Impact</span>
              </div>
              <p className="text-sm text-foreground/70">
                Over 12,000 crime reports processed this month, with 94% of users reporting improved satisfaction with
                law enforcement response times.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
