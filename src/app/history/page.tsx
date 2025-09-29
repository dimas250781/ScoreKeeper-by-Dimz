import { GameHistoryClient } from "@/components/game/game-history-client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default function HistoryPage() {
    return (
        <main className="container mx-auto max-w-4xl py-8 px-4">
            <div className="flex items-center gap-4 mb-6">
                <Button asChild variant="outline" size="icon">
                    <Link href="/">
                        <ArrowLeft />
                        <span className="sr-only">Back</span>
                    </Link>
                </Button>
                <h1 className="text-3xl font-headline font-bold">Game History</h1>
            </div>
            <Suspense fallback={<p>Loading history...</p>}>
                <GameHistoryClient />
            </Suspense>
        </main>
    );
}
