import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ThemeCheck() {
  return (
    <div className="min-h-screen bg-background text-foreground p-4 space-y-6">
      <header className="text-center">
        <h1 className="text-4xl font-bold">ShadCN Theme Preview</h1>
        <p className="text-muted-foreground">Theme: Emerald / Sky / Pink / Neutral</p>
      </header>

      <section className="flex flex-wrap justify-center gap-4">
        <Button variant="default">Primary Button</Button>
        <Button variant="secondary">Secondary Button</Button>
        <Button variant="destructive">Destructive Button</Button>
        <Button variant="outline">Outline Button</Button>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Primary Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This card shows the primary color scheme (emerald).</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accent Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Accent color (pink) can be used for highlights or links.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gray Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Neutral tones (gray) are used for background, borders, and text.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
