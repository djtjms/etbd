import { useState } from "react";
import { Cookie, Settings, Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useConsent } from "@/hooks/useConsent";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function CookieConsent() {
  const { consent, acceptAll, acceptNecessaryOnly, updateConsent, showBanner, setShowBanner } = useConsent();
  const [showSettings, setShowSettings] = useState(false);

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom duration-500">
      <div className="max-w-4xl mx-auto bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
        {showSettings ? (
          // Settings View
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Cookie Preferences
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setShowSettings(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Necessary */}
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">Necessary Cookies</p>
                  <p className="text-sm text-muted-foreground">
                    Required for the website to function. Cannot be disabled.
                  </p>
                </div>
                <Switch checked disabled />
              </div>

              {/* Analytics */}
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">Analytics Cookies</p>
                  <p className="text-sm text-muted-foreground">
                    Help us understand how visitors interact with our website.
                  </p>
                </div>
                <Switch
                  checked={consent.analytics}
                  onCheckedChange={(checked) => updateConsent("analytics", checked)}
                />
              </div>

              {/* Marketing */}
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium">Marketing Cookies</p>
                  <p className="text-sm text-muted-foreground">
                    Used to show you relevant advertisements.
                  </p>
                </div>
                <Switch
                  checked={consent.marketing}
                  onCheckedChange={(checked) => updateConsent("marketing", checked)}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button onClick={acceptNecessaryOnly} variant="outline" className="flex-1">
                Save Preferences
              </Button>
              <Button onClick={acceptAll} className="flex-1">
                Accept All
              </Button>
            </div>
          </div>
        ) : (
          // Banner View
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Cookie className="w-6 h-6 text-primary" />
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">We value your privacy</h3>
                <p className="text-sm text-muted-foreground">
                  We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
                  By clicking "Accept All", you consent to our use of cookies.{" "}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Learn more
                  </Link>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <Button
                  variant="outline"
                  onClick={() => setShowSettings(true)}
                  className="gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Customize
                </Button>
                <Button variant="secondary" onClick={acceptNecessaryOnly}>
                  Necessary Only
                </Button>
                <Button onClick={acceptAll}>
                  Accept All
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
