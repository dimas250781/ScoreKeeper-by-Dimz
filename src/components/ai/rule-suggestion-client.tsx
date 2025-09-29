'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { getRuleSuggestion } from '@/lib/actions';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Wand2, BrainCircuit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const initialState = {
  message: null,
  suggestion: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
            <Wand2 className="mr-2 h-4 w-4 animate-spin" />
            Thinking...
        </>
      ) : (
        <>
            <Wand2 className="mr-2 h-4 w-4" />
            Get Suggestion
        </>
      )}
    </Button>
  );
}

export function RuleSuggestionClient() {
  const [state, formAction] = useFormState(getRuleSuggestion, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.error) {
      toast({
        title: 'Error',
        description: state.error,
        variant: 'destructive',
      });
    }
    if (state.message) {
      formRef.current?.reset();
    }
  }, [state, toast]);

  return (
    <div className="space-y-6">
      <form ref={formRef} action={formAction} className="space-y-4">
        <div className="grid w-full gap-1.5">
          <Label htmlFor="ruleInquiry">Your Rule Question</Label>
          <Textarea
            id="ruleInquiry"
            name="ruleInquiry"
            placeholder="e.g., 'How do you score if a player goes out on their first turn with a full hand meld?'"
            required
            rows={4}
          />
        </div>
        <SubmitButton />
      </form>

      {state.suggestion && (
        <Card className="bg-primary/5">
           <CardHeader className="flex-row items-center gap-2 space-y-0">
            <BrainCircuit className="w-6 h-6 text-primary"/>
            <CardTitle>AI Suggestion</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap font-body text-foreground/90">{state.suggestion}</p>
          </CardContent>
        </Card>
      )}

      {!state.suggestion && (
         <Alert>
            <Wand2 className="h-4 w-4" />
            <AlertTitle>Example</AlertTitle>
            <AlertDescription>
                Try asking about specific scenarios like going out, penalties for wrong discards, or scoring special melds.
            </AlertDescription>
        </Alert>
      )}

    </div>
  );
}
