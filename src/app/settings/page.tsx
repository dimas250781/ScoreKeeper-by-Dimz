import { SettingsClient } from "@/components/settings/settings-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl relative">
                <Button asChild variant="ghost" size="icon" className="absolute -top-14 left-0">
                <Link href="/">
                    <ArrowLeft />
                    <span className="sr-only">Back to home</span>
                </Link>
                </Button>
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-headline">App Settings</CardTitle>
                        <CardDescription>
                            Customize the look and feel of the application.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SettingsClient />
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
