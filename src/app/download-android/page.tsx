import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MobileMenu } from "@/components/MobileMenu";
import { 
  Download,
  Smartphone,
  Shield,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ExternalLink
} from "lucide-react";

const APK_DOWNLOAD_LINK =
  process.env.APK_DOWNLOAD_LINK ||
  "https://docs.google.com/uc?export=download&id=18gLmlOO-iOdvAKrjUFgWu4XmDjyPBkFK";

export default function DownloadAndroid() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/doorbel-icon.png"
                alt="DoorBel Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="text-2xl font-bold text-green-600">DoorBel</span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-600 hover:text-green-600 transition-colors">Home</Link>
              <Link href="/waitlist" className="text-gray-600 hover:text-green-600 transition-colors">Join Waitlist</Link>
              <Button className="bg-green-600 hover:bg-green-700" asChild>
                <a href={APK_DOWNLOAD_LINK} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" />
                  Download APK
                </a>
              </Button>
            </div>
            <MobileMenu />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
              <Smartphone className="mr-2 h-4 w-4" />
              Android App Download
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Download DoorBel for Android
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get the DoorBel delivery app on your Android device. Follow the simple steps below to download and install.
            </p>
          </div>
        </div>
      </section>

      {/* Download Instructions */}
      <section className="py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Download Button */}
          <Card className="border-2 border-green-200 shadow-lg mb-12">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Ready to Download?</CardTitle>
              <CardDescription className="text-lg">
                Click the button below to download the DoorBel Android APK (95MB)
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-lg px-8 py-6"
                asChild
              >
                <a href={APK_DOWNLOAD_LINK} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-5 w-5" />
                  Download Android APK
                  <ExternalLink className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <p className="text-sm text-gray-500 mt-4">
                File size: 95MB | Requires Android 6.0 or higher
              </p>
            </CardContent>
          </Card>

          {/* Google Drive Warning Instructions */}
          <Card className="border-2 border-amber-200 bg-amber-50/50 shadow-lg mb-8">
            <CardHeader>
              <div className="flex items-center space-x-3 mb-2">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
                <CardTitle className="text-xl text-amber-900">
                  Important: Google Drive Security Warning
                </CardTitle>
              </div>
              <CardDescription className="text-amber-800">
                When you click the download link, Google Drive will show a security warning. This is normal for APK files. Follow the steps below to proceed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-4 border border-amber-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="flex items-center justify-center w-8 h-8 bg-amber-100 text-amber-700 rounded-full mr-3 text-sm font-bold">1</span>
                    You&apos;ll see this warning message:
                  </h4>
                  <div className="bg-gray-50 rounded p-4 border-l-4 border-amber-500 ml-11">
                    <p className="font-medium text-gray-900 mb-2">Google Drive has detected issues with your download</p>
                    <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                      <li>This file is too large for Google to scan for viruses.</li>
                      <li>This file is executable and may harm your computer.</li>
                    </ul>
                    <p className="text-sm text-gray-600 mt-3 font-medium">
                      application-9879f51a-806b-4f80-af88-aa1b3762f345.apk (95M)
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-amber-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="flex items-center justify-center w-8 h-8 bg-amber-100 text-amber-700 rounded-full mr-3 text-sm font-bold">2</span>
                    Click &quot;Download anyway&quot; button
                  </h4>
                  <p className="text-gray-700 ml-11">
                    Don&apos;t worry - this is a safe APK file from DoorBel. The warning appears because APK files are executable files, which is normal for Android apps. Click the grey &quot;Download anyway&quot; button to proceed with the download.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-amber-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="flex items-center justify-center w-8 h-8 bg-amber-100 text-amber-700 rounded-full mr-3 text-sm font-bold">3</span>
                    Wait for download to complete
                  </h4>
                  <p className="text-gray-700 ml-11">
                    The APK file (95MB) will begin downloading. Depending on your internet connection, this may take a few minutes. The file will be saved to your device&apos;s Downloads folder.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Installation Instructions */}
          <Card className="shadow-lg mb-8">
            <CardHeader>
              <div className="flex items-center space-x-3 mb-2">
                <Smartphone className="h-6 w-6 text-green-600" />
                <CardTitle className="text-xl">How to Install the APK</CardTitle>
              </div>
              <CardDescription>
                After downloading, follow these steps to install DoorBel on your Android device
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-100 text-green-700 rounded-full flex-shrink-0 font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">Enable Installation from Unknown Sources</h4>
                    <p className="text-gray-700 mb-2">
                      Before installing, you need to allow your device to install apps from sources other than the Google Play Store:
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4 list-disc">
                      <li>Go to <strong>Settings</strong> → <strong>Security</strong> (or <strong>Privacy</strong> on newer devices)</li>
                      <li>Find <strong>&quot;Install unknown apps&quot;</strong> or <strong>&quot;Unknown sources&quot;</strong></li>
                      <li>Select your browser (Chrome, Firefox, etc.) and toggle it <strong>ON</strong></li>
                      <li>On Android 8.0+, you may see <strong>&quot;Allow from this source&quot;</strong> - enable it</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-100 text-green-700 rounded-full flex-shrink-0 font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">Open the Downloaded APK</h4>
                    <p className="text-gray-700 mb-2">
                      Navigate to your Downloads folder and tap on the APK file:
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4 list-disc">
                      <li>Open your device&apos;s <strong>Files</strong> or <strong>Downloads</strong> app</li>
                      <li>Find <strong>application-9879f51a-806b-4f80-af88-aa1b3762f345.apk</strong></li>
                      <li>Tap on the file to open it</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-100 text-green-700 rounded-full flex-shrink-0 font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">Install the App</h4>
                    <p className="text-gray-700 mb-2">
                      You&apos;ll see an installation screen:
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4 list-disc">
                      <li>Review the app permissions (location, camera, storage, etc.)</li>
                      <li>Tap <strong>&quot;Install&quot;</strong> to proceed</li>
                      <li>Wait for the installation to complete (usually takes 10-30 seconds)</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-100 text-green-700 rounded-full flex-shrink-0 font-bold">
                    4
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">Open DoorBel</h4>
                    <p className="text-gray-700 mb-2">
                      Once installation is complete:
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4 list-disc">
                      <li>Tap <strong>&quot;Open&quot;</strong> from the installation screen, or</li>
                      <li>Find the DoorBel icon in your app drawer and tap to launch</li>
                      <li>Sign up or log in to start using DoorBel!</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Note */}
          <Card className="border-2 border-green-200 bg-green-50/50 shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-3 mb-2">
                <Shield className="h-6 w-6 text-green-600" />
                <CardTitle className="text-xl text-green-900">Is This Safe?</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p><strong>Yes, this APK is safe!</strong> The Google Drive warning appears for all APK files because they&apos;re executable files, which is normal for Android applications.</p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p>This is the official DoorBel app. We provide direct downloads while the app is being prepared for the Google Play Store.</p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p>Android will scan the APK during installation to ensure it&apos;s safe. The warning is just Google Drive&apos;s standard security protocol for large executable files.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Back to Home */}
          <div className="mt-12 text-center">
            <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Image
                src="/doorbel-logo.png"
                alt="DoorBel Logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-xl font-bold">DoorBel</span>
            </div>
            <p className="text-gray-400 mb-6">
              Ghana&apos;s next-generation delivery platform
            </p>
            <div className="flex justify-center space-x-6">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">Home</Link>
              <Link href="/waitlist" className="text-gray-400 hover:text-white transition-colors text-sm">Join Waitlist</Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</Link>
            </div>
            <p className="text-gray-500 text-sm mt-8">
              © 2025 DoorBel. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
