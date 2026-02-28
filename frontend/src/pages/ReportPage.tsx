import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetReport, useCheckout } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Sparkles, TrendingUp, Target, Calendar, Zap, Crown, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function ReportPage() {
  const { reportId } = useParams({ from: '/report/$reportId' });
  const navigate = useNavigate();
  const { data: report, isLoading } = useGetReport(reportId);
  const checkout = useCheckout();

  const handleUpgrade = async () => {
    try {
      const result = await checkout.mutateAsync('financial_analysis');
      window.location.href = result.checkoutUrl;
    } catch (error) {
      toast.error('Checkout failed. Please try again.');
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <Sparkles className="w-16 h-16 text-cosmic-purple mx-auto animate-spin" />
          <p className="text-lg text-muted-foreground">Loading your cosmic insights...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <p className="text-lg text-muted-foreground">Report not found</p>
          <Button onClick={() => navigate({ to: '/' })}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate({ to: '/' })}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Badge className="bg-cosmic-purple/20 text-cosmic-purple border-cosmic-purple/30">
            Report #{reportId}
          </Badge>
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cosmic-pink via-cosmic-purple to-cosmic-turquoise bg-clip-text text-transparent">
            Your Financial Astrology Report
          </h1>
          <p className="text-lg text-muted-foreground">
            Personalized insights based on your birth chart and financial reference points
          </p>
        </div>

        <Card className="border-cosmic-pink/20 bg-gradient-to-br from-cosmic-pink/5 to-cosmic-purple/5 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cosmic-pink" />
              Money Personality Snapshot
            </CardTitle>
            <CardDescription>Your innate financial tendencies and patterns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Sun Sign: {report.chart.planetaryPositions[0]?.[1] || 'N/A'}</h3>
              <p className="text-muted-foreground">
                Your core financial identity is shaped by {report.chart.planetaryPositions[0]?.[1]}, indicating a natural approach to wealth that combines intuition with practical action.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Moon Sign: {report.chart.planetaryPositions[1]?.[1] || 'N/A'}</h3>
              <p className="text-muted-foreground">
                Your emotional relationship with money is influenced by {report.chart.planetaryPositions[1]?.[1]}, suggesting you find security through strategic planning and long-term investments.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Ascendant: {report.chart.housePositions[0]?.[1] || 'N/A'}</h3>
              <p className="text-muted-foreground">
                Your financial presentation to the world is colored by {report.chart.housePositions[0]?.[1]}, showing how others perceive your wealth-building approach.
              </p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="strengths" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="strengths">Strengths</TabsTrigger>
            <TabsTrigger value="season">Season</TabsTrigger>
            <TabsTrigger value="action">Action Plan</TabsTrigger>
            <TabsTrigger value="timing">Timing</TabsTrigger>
          </TabsList>

          <TabsContent value="strengths" className="space-y-4">
            <Card className="border-cosmic-purple/20 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cosmic-purple" />
                  Your Financial Strengths
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {report.financialAnalysis.wealthBuildingTraits.map(([trait, description], idx) => (
                  <div key={idx} className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cosmic-purple" />
                      {trait}
                    </h3>
                    <p className="text-muted-foreground pl-4">{description}</p>
                  </div>
                ))}
                <Separator className="my-4" />
                <div className="space-y-2">
                  <h3 className="font-semibold">Personal Strengths</h3>
                  <ul className="space-y-2">
                    {report.generalAnalysis.personalStrengths.map((strength, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                        <Zap className="w-4 h-4 text-cosmic-purple mt-0.5 flex-shrink-0" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="season" className="space-y-4">
            <Card className="border-cosmic-turquoise/20 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-cosmic-turquoise" />
                  Current Financial Season
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Planetary Patterns</h3>
                  {report.energyConcentration.aspectPatterns.map(([pattern, sign], idx) => (
                    <p key={idx} className="text-muted-foreground mb-2">
                      {pattern} in {sign}: A concentration of energy indicating focused opportunities in this area.
                    </p>
                  ))}
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Life Themes</h3>
                  <ul className="space-y-2">
                    {report.generalAnalysis.lifeThemes.map((theme, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-cosmic-turquoise mt-2 flex-shrink-0" />
                        {theme}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="action" className="space-y-4">
            <Card className="border-cosmic-pink/20 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-cosmic-pink" />
                  Action Translation Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Financial Strategies</h3>
                  <ul className="space-y-3">
                    {report.financialAnalysis.financialStrategies.map((strategy, idx) => (
                      <li key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-cosmic-pink/5 border border-cosmic-pink/20">
                        <div className="w-6 h-6 rounded-full bg-cosmic-pink/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-cosmic-pink">{idx + 1}</span>
                        </div>
                        <p className="text-muted-foreground">{strategy}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Career Potential</h3>
                  {report.financialAnalysis.careerPotential.map(([area, description], idx) => (
                    <div key={idx} className="mb-3">
                      <p className="font-medium text-cosmic-pink">{area}</p>
                      <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timing" className="space-y-4">
            <Card className="border-cosmic-purple/20 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-cosmic-purple" />
                  Timing Windows
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Planetary Aspects</h3>
                  {report.chart.aspects.slice(0, 3).map(([planet1, planet2, aspect], idx) => (
                    <div key={idx} className="mb-3 p-3 rounded-lg bg-cosmic-purple/5 border border-cosmic-purple/20">
                      <p className="font-medium">
                        {planet1} {aspect} {planet2}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        This aspect suggests {aspect === 'trine' ? 'harmonious' : aspect === 'sextile' ? 'opportunistic' : 'dynamic'} energy for financial decisions.
                      </p>
                    </div>
                  ))}
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Overarching Insights</h3>
                  <ul className="space-y-2">
                    {report.generalAnalysis.overarchingInsights.map((insight, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                        <Sparkles className="w-4 h-4 text-cosmic-purple mt-0.5 flex-shrink-0" />
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="border-cosmic-pink/30 bg-gradient-to-r from-cosmic-pink/10 via-cosmic-purple/10 to-cosmic-turquoise/10 backdrop-blur">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="w-6 h-6 text-cosmic-pink" />
                <CardTitle>Unlock Premium Insights</CardTitle>
              </div>
              <Badge className="bg-cosmic-pink/20 text-cosmic-pink border-cosmic-pink/30">
                $24.99
              </Badge>
            </div>
            <CardDescription>
              Get an in-depth financial analysis with personalized recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-cosmic-pink" />
                  Extended biwheel analysis with reference charts
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-cosmic-purple" />
                  Detailed timing windows for the next 12 months
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-cosmic-turquoise" />
                  Personalized wealth-building strategies
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-cosmic-pink" />
                  Career and investment recommendations
                </li>
              </ul>
              <Button
                onClick={handleUpgrade}
                disabled={checkout.isPending}
                className="w-full bg-gradient-to-r from-cosmic-pink via-cosmic-purple to-cosmic-turquoise hover:opacity-90"
              >
                {checkout.isPending ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Premium
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-muted bg-muted/20">
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground text-center">
              <strong>Disclaimer:</strong> This report is for entertainment purposes only and should not be considered financial advice. 
              Always consult with qualified financial professionals before making investment decisions.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
