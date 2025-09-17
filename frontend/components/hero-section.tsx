"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, FileText, Users, Clock, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  const [currentStat, setCurrentStat] = useState(0)

  const stats = [
    { label: "Reports Filed", value: "12,847", icon: FileText },
    { label: "Cases Resolved", value: "9,234", icon: CheckCircle },
    { label: "Active Users", value: "5,678", icon: Users },
    { label: "Avg Response Time", value: "2.4 hrs", icon: Clock },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [stats.length])

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit">
                <Shield className="w-3 h-3 mr-1" />
                Trusted by 50+ Police Departments
              </Badge>

              <h1 className="text-4xl lg:text-6xl font-bold text-balance leading-tight">
                Report Crimes
                <span className="block text-primary">Safely & Securely</span>
              </h1>

              <p className="text-xl text-muted-foreground text-pretty max-w-2xl">
                A comprehensive platform connecting citizens, police, and administrators for efficient crime reporting
                and management. Your safety is our priority.
              </p>
            </div>



            {/* Trust Indicators */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-muted-foreground">24/7 Available</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">End-to-End Encrypted</span>
              </div>
            </div>
          </div>

          {/* Stats Dashboard */}
          <div className="relative animate-slide-in-right">
            <div className="bg-card/80 backdrop-blur-sm border rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Live Statistics</h3>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon
                  const isActive = index === currentStat

                  return (
                    <div
                      key={stat.label}
                      className={`p-4 rounded-xl transition-all duration-500 ${
                        isActive
                          ? "bg-primary/10 border-primary/20 border-2 scale-105"
                          : "bg-muted/50 border border-border"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${isActive ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className={`text-2xl font-bold ${isActive ? "text-foreground" : "text-foreground"}`}>
                            {stat.value}
                          </div>
                          <div className="text-xs text-foreground/70">{stat.label}</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground/70">System Status</span>
                  <span className="text-green-600 font-medium">All Systems Operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
