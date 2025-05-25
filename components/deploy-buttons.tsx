"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, Globe, Zap } from "lucide-react"

export function DeployButtons() {
  const deployToSurge = () => {
    const instructions = `
1. Download and extract your project
2. Open terminal in the project folder
3. Run: npm install -g surge
4. Run: surge
5. Follow prompts for instant deployment!
    `
    alert(instructions)
  }

  const deployToGitHub = () => {
    window.open("https://github.com/new", "_blank")
  }

  const deployToRender = () => {
    window.open("https://render.com/", "_blank")
  }

  const deployToFirebase = () => {
    window.open("https://firebase.google.com/", "_blank")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Zap className="h-5 w-5 mr-2" />
          One-Click Deploy Options
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button onClick={deployToSurge} className="flex items-center justify-center">
            <Globe className="h-4 w-4 mr-2" />
            Deploy to Surge.sh
          </Button>

          <Button onClick={deployToGitHub} variant="outline" className="flex items-center justify-center">
            <ExternalLink className="h-4 w-4 mr-2" />
            Upload to GitHub
          </Button>

          <Button onClick={deployToRender} variant="outline" className="flex items-center justify-center">
            <Globe className="h-4 w-4 mr-2" />
            Deploy to Render
          </Button>

          <Button onClick={deployToFirebase} variant="outline" className="flex items-center justify-center">
            <ExternalLink className="h-4 w-4 mr-2" />
            Deploy to Firebase
          </Button>
        </div>

        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-2">🎯 Recommended: Surge.sh</h4>
          <p className="text-sm text-green-800">
            Surge.sh is the most reliable option. Just extract your ZIP, open terminal, and run two commands!
          </p>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">📱 For Your Mentor Right Now:</h4>
          <p className="text-sm text-blue-800">
            Share this current v0 link:{" "}
            <code className="bg-blue-100 px-1 rounded">
              {typeof window !== "undefined" ? window.location.href : "Loading..."}
            </code>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
