import { RuleSuggestionClient } from "@/components/ai/rule-suggestion-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RulesPage() {
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
                        <CardTitle className="text-2xl font-headline">AI Rule Helper</CardTitle>
                        <CardDescription>
                            Have a question about a tricky scoring situation in Remi? Ask our AI expert for a suggestion.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RuleSuggestionClient />
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
