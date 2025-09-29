'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { Button } from '../ui/button';
import { Check, Palette, Type } from 'lucide-react';

const colors = [
    { name: 'Slate', value: '220 20% 96%' },
    { name: 'Stone', value: '25 5% 95%' },
    { name: 'Red', value: '0 80% 96%' },
    { name: 'Orange', value: '25 95% 95%' },
    { name: 'Green', value: '142 60% 96%' },
    { name: 'Blue', value: '215 90% 96%' },
];

const primaryColors: { [key: string]: string } = {
    '220 20% 96%': '215 33% 50%',
    '25 5% 95%': '25 50% 50%',
    '0 80% 96%': '0 72% 51%',
    '25 95% 95%': '25 95% 53%',
    '142 60% 96%': '142 71% 41%',
    '215 90% 96%': '215 91% 55%',
};

export function SettingsClient() {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [background, setBackground] = useState('');
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    setIsClient(true);
    const savedBg = localStorage.getItem('remi-theme-background') || '220 20% 96%';
    const savedFontSize = localStorage.getItem('remi-theme-fontsize') || '16';
    setBackground(savedBg);
    setFontSize(parseInt(savedFontSize, 10));
    applySettings(savedBg, parseInt(savedFontSize, 10));
  }, []);

  const applySettings = (bg: string, size: number) => {
    const root = document.documentElement;
    root.style.setProperty('--background', bg);
    root.style.setProperty('--primary', primaryColors[bg] || '215 33% 50%');
    root.style.setProperty('font-size', `${size}px`);
  };

  const handleSave = () => {
    localStorage.setItem('remi-theme-background', background);
    localStorage.setItem('remi-theme-fontsize', fontSize.toString());
    applySettings(background, fontSize);
    toast({
        title: "Settings Saved!",
        description: "Your new theme settings have been applied."
    });
  };

  if (!isClient) {
    return <p>Loading settings...</p>;
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Label htmlFor="background-color" className="flex items-center gap-2 text-lg font-medium"><Palette/>Background Color</Label>
        <Select value={background} onValueChange={setBackground}>
          <SelectTrigger id="background-color" className="w-full">
            <SelectValue placeholder="Select a color theme" />
          </SelectTrigger>
          <SelectContent>
            {colors.map(color => (
              <SelectItem key={color.value} value={color.value}>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: `hsl(${color.value})` }} />
                    {color.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label htmlFor="font-size" className="flex items-center gap-2 text-lg font-medium"><Type/>Font Size</Label>
        <div className="flex items-center gap-4">
            <Slider
                id="font-size"
                min={12}
                max={20}
                step={1}
                value={[fontSize]}
                onValueChange={(value) => setFontSize(value[0])}
            />
            <span className="font-mono text-lg w-12 text-center">{fontSize}px</span>
        </div>
      </div>

      <Button onClick={handleSave} className="w-full">
        <Check className="mr-2 h-4 w-4"/>
        Save Settings
      </Button>
    </div>
  );
}
