import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles } from 'lucide-react';

interface BirthDataFormProps {
  onSubmit: (data: BirthData) => void;
  isLoading?: boolean;
}

export interface BirthData {
  birthDate: string;
  birthTime: string;
  birthTimeType: 'exact' | 'estimated' | 'unknown';
  birthPlace: string;
  referenceChart: 'fiat' | 'bitcoin';
}

export default function BirthDataForm({ onSubmit, isLoading }: BirthDataFormProps) {
  const [formData, setFormData] = useState<BirthData>({
    birthDate: '',
    birthTime: '12:00',
    birthTimeType: 'exact',
    birthPlace: '',
    referenceChart: 'bitcoin',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="border-cosmic-purple/20 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cosmic-purple" />
          Your Birth Information
        </CardTitle>
        <CardDescription>
          Enter your birth details to generate your personalized financial astrology report
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="birthDate">Birth Date *</Label>
            <Input
              id="birthDate"
              type="date"
              required
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              className="border-cosmic-purple/30 focus:border-cosmic-purple"
            />
          </div>

          <div className="space-y-2">
            <Label>Birth Time Accuracy</Label>
            <Tabs
              value={formData.birthTimeType}
              onValueChange={(value) => setFormData({ ...formData, birthTimeType: value as any })}
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="exact">Exact</TabsTrigger>
                <TabsTrigger value="estimated">Estimated</TabsTrigger>
                <TabsTrigger value="unknown">Unknown</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {formData.birthTimeType !== 'unknown' && (
            <div className="space-y-2">
              <Label htmlFor="birthTime">Birth Time</Label>
              <Input
                id="birthTime"
                type="time"
                value={formData.birthTime}
                onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
                className="border-cosmic-purple/30 focus:border-cosmic-purple"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="birthPlace">Birth Place *</Label>
            <Input
              id="birthPlace"
              type="text"
              placeholder="City, Country"
              required
              value={formData.birthPlace}
              onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
              className="border-cosmic-purple/30 focus:border-cosmic-purple"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="referenceChart">Reference Chart *</Label>
            <Select
              value={formData.referenceChart}
              onValueChange={(value) => setFormData({ ...formData, referenceChart: value as any })}
            >
              <SelectTrigger className="border-cosmic-purple/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bitcoin">
                  Bitcoin (Jan 3, 2009, 6:15 PM UTC, Temple City, Cali)
                </SelectItem>
                <SelectItem value="fiat">
                  Fiat Money (Aug 8, 2971, 12:00 PM, Washington DC)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-cosmic-pink via-cosmic-purple to-cosmic-turquoise hover:opacity-90"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                Generating Report...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate My Report
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
