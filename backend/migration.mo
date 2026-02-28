import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat8 "mo:core/Nat8";
import Array "mo:core/Array";
import Principal "mo:core/Principal";

module {
  type Coordinates = {
    birthTimestamp : Int;
    latMicro : Int;
    longMicro : Int;
  };

  type ChartData = {
    planetaryPositions : [(Text, Text)];
    housePositions : [(Text, Text)];
    aspects : [(Text, Text, Text)];
    elementDistribution : [(Text, Nat8)];
  };

  type EnergyConcentration = {
    planetsInSigns : [(Text, Nat8)];
    planetsInHouses : [(Text, Nat8)];
    aspectsCount : [(Text, Nat8)];
    aspectPatterns : [(Text, Text)];
    retrogradePlanets : [Text];
    elementsUsage : [(Text, Nat8)];
    dominantCardinalModes : [(Text, Nat8)];
  };

  type NatalAnalysis = {
    housesAnalysis : [(Text, Text)];
    planetaryAspectsAnalysis : [(Text, Text)];
    signsAnalysis : [(Text, Text)];
    planetaryPatternsAnalysis : [(Text, Text)];
  };

  type RelationshipAnalysis = {
    compatibilityScores : [(Text, Text, Nat8)];
    challengingAspects : [(Text, Text, Text)];
    harmonicAspects : [(Text, Text, Text)];
    lifeThemes : [Text];
  };

  type FinancialAnalysis = {
    primaryFinancialIndicators : [(Text, Text)];
    careerPotential : [(Text, Text)];
    wealthBuildingTraits : [(Text, Text)];
    financialStrategies : [Text];
  };

  type GeneralAnalysis = {
    lifeThemes : [Text];
    personalStrengths : [Text];
    potentialGrowthAreas : [Text];
    overarchingInsights : [Text];
  };

  type ReportData = {
    chart : ChartData;
    energyConcentration : EnergyConcentration;
    natalAnalysis : NatalAnalysis;
    relationshipAnalysis : RelationshipAnalysis;
    financialAnalysis : FinancialAnalysis;
    generalAnalysis : GeneralAnalysis;
  };

  type LiveChart = {
    positions : [(Text, Text)];
    aspects : [(Text, Text, Text, Text)];
    houses : [(Text, Text)];
    sunSign : Text;
    moonSign : Text;
    ascendant : Text;
    dominantElement : Text;
    dominantMode : Text;
    planetaryPatterns : [Text];
    chartShape : Text;
  };

  type GeneralReport = {
    chartData : Text;
    honkyChank : Text;
  };

  type AstrologyData = {
    planetaryPositions : [(Text, Text)];
    housePositions : [(Text, Text)];
    aspects : [(Text, Text, Text)];
    aspectType : Text;
    sunSign : Text;
    moonSign : Text;
    ascendant : Text;
  };

  type UserProfile = {
    name : Text;
    birthDate : ?Text;
    birthTime : ?Text;
    birthPlace : ?Text;
    preferredReferenceChart : ?Text;
  };

  type OldActor = {
    reports : Map.Map<Text, ReportData>;
    coordinates : Map.Map<Text, Coordinates>;
    liveCharts : Map.Map<Text, LiveChart>;
    astrologyReports : Map.Map<Text, GeneralReport>;
  };

  type NewActor = {
    reports : Map.Map<Text, ReportData>;
    coordinates : Map.Map<Text, Coordinates>;
    liveCharts : Map.Map<Text, LiveChart>;
    astrologyReports : Map.Map<Text, GeneralReport>;
    referenceCharts : Map.Map<Text, (Int, Text)>;
    userProfiles : Map.Map<Principal, UserProfile>;
  };

  public func run(old : OldActor) : NewActor {
    let newReferenceCharts = Map.empty<Text, (Int, Text)>();

    newReferenceCharts.add("fiat_money", (3233587200, "Washington DC"));
    newReferenceCharts.add("bitcoin", (1231001700, "Temple City, Cali"));

    let newUserProfiles = Map.empty<Principal, UserProfile>();

    {
      old with
      referenceCharts = newReferenceCharts;
      userProfiles = newUserProfiles;
    };
  };
};
