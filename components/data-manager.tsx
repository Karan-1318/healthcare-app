"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Download, Upload, Share2, QrCode } from "lucide-react"

interface DataManagerProps {
  currentUser: any
  onDataImported: (userData: any) => void
}

export function DataManager({ currentUser, onDataImported }: DataManagerProps) {
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [importedData, setImportedData] = useState("")
  const [exportedData, setExportedData] = useState("")

  const exportData = () => {
    const dataToExport = {
      user: currentUser,
      exportDate: new Date().toISOString(),
      version: "1.0",
    }

    const jsonData = JSON.stringify(dataToExport, null, 2)
    setExportedData(jsonData)

    // Create downloadable file
    const blob = new Blob([jsonData], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `healthcare-data-${currentUser.firstName}-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setShowExportDialog(true)
  }

  const handleImportData = () => {
    try {
      const parsedData = JSON.parse(importedData)

      if (parsedData.user && parsedData.user.id) {
        // Update localStorage with imported data
        const users = JSON.parse(localStorage.getItem("users") || "[]")
        const existingUserIndex = users.findIndex((u: any) => u.email === parsedData.user.email)

        if (existingUserIndex !== -1) {
          users[existingUserIndex] = parsedData.user
        } else {
          users.push(parsedData.user)
        }

        localStorage.setItem("users", JSON.stringify(users))
        localStorage.setItem("currentUser", JSON.stringify(parsedData.user))

        onDataImported(parsedData.user)
        setShowImportDialog(false)
        setImportedData("")
        alert("Data imported successfully!")
      } else {
        alert("Invalid data format!")
      }
    } catch (error) {
      alert("Error importing data. Please check the format.")
    }
  }

  const generateShareableLink = () => {
    const dataToShare = {
      user: currentUser,
      shareDate: new Date().toISOString(),
    }

    const encodedData = btoa(JSON.stringify(dataToShare))
    const shareableLink = `${window.location.origin}?import=${encodedData}`

    navigator.clipboard
      .writeText(shareableLink)
      .then(() => {
        alert("Shareable link copied to clipboard!")
      })
      .catch(() => {
        prompt("Copy this link:", shareableLink)
      })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Share2 className="h-5 w-5 mr-2" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={exportData} className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>

            <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Data
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Import Healthcare Data</DialogTitle>
                  <DialogDescription>Paste your exported healthcare data JSON here</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="importedData">JSON Data</Label>
                    <Textarea
                      id="importedData"
                      value={importedData}
                      onChange={(e) => setImportedData(e.target.value)}
                      placeholder="Paste your exported JSON data here..."
                      rows={10}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleImportData}>Import</Button>
                    <Button variant="outline" onClick={() => setShowImportDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button onClick={generateShareableLink} variant="outline" className="flex items-center">
              <QrCode className="h-4 w-4 mr-2" />
              Share Link
            </Button>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">How to use on another device:</h4>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Click "Export Data" to download your data file</li>
              <li>2. On your other device, open this app</li>
              <li>3. Click "Import Data" and paste the content</li>
              <li>4. Or use "Share Link" to generate a direct import link</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Data Exported Successfully</DialogTitle>
            <DialogDescription>
              Your healthcare data has been exported. You can also copy the data below:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea value={exportedData} readOnly rows={15} className="font-mono text-xs" />
            <div className="flex space-x-2">
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(exportedData)
                  alert("Data copied to clipboard!")
                }}
              >
                Copy to Clipboard
              </Button>
              <Button variant="outline" onClick={() => setShowExportDialog(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
