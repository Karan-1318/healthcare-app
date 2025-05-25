"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Download, Globe, Smartphone, Copy } from "lucide-react"

export function DeploymentHelper() {
  const [copied, setCopied] = useState(false)

  const deploymentSteps = [
    {
      step: 1,
      title: "Download Project",
      description: "Click 'Download Code' button in v0 interface",
      icon: <Download className="h-5 w-5" />,
      status: "ready",
    },
    {
      step: 2,
      title: "Go to Vercel",
      description: "Visit vercel.com and sign up/login",
      icon: <Globe className="h-5 w-5" />,
      status: "ready",
      link: "https://vercel.com",
    },
    {
      step: 3,
      title: "Deploy Project",
      description: "Add New Project → Browse → Upload ZIP → Deploy",
      icon: <ExternalLink className="h-5 w-5" />,
      status: "pending",
    },
    {
      step: 4,
      title: "Get Permanent Link",
      description: "Copy your https://your-project.vercel.app URL",
      icon: <Smartphone className="h-5 w-5" />,
      status: "pending",
    },
  ]

  const copyCurrentURL = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Deployment Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deploymentSteps.map((step) => (
              <div key={step.step} className="flex items-start space-x-4 p-4 border rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">{step.step}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    {step.icon}
                    <h3 className="font-semibold">{step.title}</h3>
                    <Badge variant={step.status === "ready" ? "default" : "secondary"}>{step.status}</Badge>
                  </div>
                  <p className="text-gray-600 mt-1">{step.description}</p>
                  {step.link && (
                    <a
                      href={step.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center mt-2 text-blue-600 hover:underline"
                    >
                      Open Vercel <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current v0 Link</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">You can share this current v0 link with your mentor for immediate access:</p>
            <div className="flex items-center space-x-2">
              <code className="flex-1 p-2 bg-gray-100 rounded text-sm">
                {typeof window !== "undefined" ? window.location.href : "Loading..."}
              </code>
              <Button onClick={copyCurrentURL} variant="outline" size="sm">
                {copied ? "Copied!" : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Benefits of Permanent Deployment:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✅ Works on any device without v0 access</li>
                <li>✅ Professional URL for your mentor</li>
                <li>✅ Faster loading and better performance</li>
                <li>✅ Can be added to your portfolio</li>
                <li>✅ No dependency on v0 availability</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alternative: Netlify Deployment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-gray-600">If you prefer Netlify over Vercel:</p>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>
                Go to{" "}
                <a href="https://netlify.com" className="text-blue-600 hover:underline">
                  netlify.com
                </a>
              </li>
              <li>Drag and drop your downloaded ZIP file</li>
              <li>Get instant deployment</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
