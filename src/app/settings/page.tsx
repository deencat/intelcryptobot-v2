import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiConfigurationForm } from "@/components/settings/api-configuration-form";
import { BotConfigurationForm } from "@/components/settings/bot-configuration-form";
import { AlertPreferencesForm } from "@/components/settings/alert-preferences-form";
import { UiPreferencesForm } from "@/components/settings/ui-preferences-form";
import { FreqtradeConfigForm } from "@/components/settings/freqtrade-config-form";

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Configure your trading bot and preferences</p>
      </div>
      
      <div className="grid gap-6 grid-cols-1">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>API Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <ApiConfigurationForm />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Bot Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <BotConfigurationForm />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Freqtrade Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <FreqtradeConfigForm />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Alert Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <AlertPreferencesForm />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>UI Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <UiPreferencesForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 