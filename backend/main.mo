import Text "mo:core/Text";
import Map "mo:core/Map";
import Nat8 "mo:core/Nat8";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Stripe "stripe/Stripe";
import StripeMixin "stripe/StripeMixin";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Management
  public type UserProfile = {
    name : Text;
    birthDate : ?Text;
    birthTime : ?Text;
    birthPlace : ?Text;
    preferredReferenceChart : ?Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  type ChartData = {
    planetaryPositions : [(Text, Text)];
    housePositions : [(Text, Text)];
    aspects : [(Text, Text, Text)];
    elementDistribution : [(Text, Nat8)];
  };

  module ChartData {
    public func fromText(_chartData : Text) : ChartData {
      {
        planetaryPositions = [
          ("Sun", "Pisces"),
          ("Moon", "Capricorn"),
          ("Mercury", "Aquarius"),
        ];
        housePositions = [
          ("1st House", "Scorpio"),
          ("2nd House", "Sagittarius"),
          ("3rd House", "Capricorn"),
        ];
        aspects = [
          ("Sun", "Moon", "sextile"),
          ("Mercury", "Venus", "trine"),
        ];
        elementDistribution = [
          ("Fire", 2),
          ("Earth", 3),
          ("Air", 1),
          ("Water", 4),
        ];
      };
    };
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

  module EnergyConcentration {
    public func fromChartData(_chartData : ChartData) : EnergyConcentration {
      {
        planetsInSigns = [
          ("Pisces", 3),
          ("Capricorn", 2),
        ];
        planetsInHouses = [
          ("1st", 2),
          ("2nd", 1),
        ];
        aspectsCount = [
          ("sextile", 2),
          ("trine", 1),
        ];
        aspectPatterns = [("Stellium", "Pisces")];
        retrogradePlanets = ["Pluto"];
        elementsUsage = [
          ("Fire", 2),
          ("Earth", 3),
          ("Air", 1),
          ("Water", 4),
        ];
        dominantCardinalModes = [("Pisces", 2), ("Capricorn", 1)];
      };
    };
  };

  type NatalAnalysis = {
    housesAnalysis : [(Text, Text)];
    planetaryAspectsAnalysis : [(Text, Text)];
    signsAnalysis : [(Text, Text)];
    planetaryPatternsAnalysis : [(Text, Text)];
  };

  module NatalAnalysis {
    public func fromChartData(_chartData : ChartData) : NatalAnalysis {
      {
        housesAnalysis = [
          ("1st House", "Indicates strong ambition and drive."),
          ("2nd House", "Focus on material possessions."),
        ];
        planetaryAspectsAnalysis = [
          ("Sun/Moon", "Harmonious aspects indicate emotional stability."),
          ("Mars/Pluto", "Represents intense energy and transformation."),
        ];
        signsAnalysis = [
          ("Pisces", "Represents intuition, compassion, and creativity."),
          ("Capricorn", "Signifies discipline and ambition."),
        ];
        planetaryPatternsAnalysis = [
          ("Stellium", "Indicates focused planetary energy."),
        ];
      };
    };
  };

  type RelationshipAnalysis = {
    compatibilityScores : [(Text, Text, Nat8)];
    challengingAspects : [(Text, Text, Text)];
    harmonicAspects : [(Text, Text, Text)];
    lifeThemes : [Text];
  };

  module RelationshipAnalysis {
    public func fromChartData(_chartData : ChartData) : RelationshipAnalysis {
      {
        compatibilityScores = [
          ("Pisces", "Capricorn", 78),
          ("Aquarius", "Virgo", 62),
        ];
        challengingAspects = [
          ("Sun", "Moon", "square"),
          ("Mars", "Venus", "opposition"),
        ];
        harmonicAspects = [
          ("Mercury", "Jupiter", "trine"),
          ("Venus", "Saturn", "sextile"),
        ];
        lifeThemes = [
          "Emotional growth",
          "Intellectual stimulation",
        ];
      };
    };
  };

  type FinancialAnalysis = {
    primaryFinancialIndicators : [(Text, Text)];
    careerPotential : [(Text, Text)];
    wealthBuildingTraits : [(Text, Text)];
    financialStrategies : [Text];
  };

  module FinancialAnalysis {
    public func fromChartData(_chartData : ChartData) : FinancialAnalysis {
      {
        primaryFinancialIndicators = [
          ("2nd House", "Focus on income and material resources."),
          ("Venus", "Influential in financial matters."),
        ];
        careerPotential = [
          ("10th House", "Indicates career focus."),
          ("Saturn", "Represents discipline and long-term success."),
        ];
        wealthBuildingTraits = [
          ("Venus", "Represents financial harmony."),
          ("Jupiter", "Signifies abundance and growth."),
        ];
        financialStrategies = [
          "Invest in long-term assets.",
          "Utilize networking for opportunities.",
        ];
      };
    };
  };

  type GeneralAnalysis = {
    lifeThemes : [Text];
    personalStrengths : [Text];
    potentialGrowthAreas : [Text];
    overarchingInsights : [Text];
  };

  module GeneralAnalysis {
    public func fromChartData(_chartData : ChartData) : GeneralAnalysis {
      {
        lifeThemes = [
          "Emotional growth",
          "Intellectual stimulation",
          "Creative expression",
        ];
        personalStrengths = [
          "Strong analytical skills",
          "Intuitive decision-making",
        ];
        potentialGrowthAreas = [
          "Emotional resilience",
          "Financial planning",
        ];
        overarchingInsights = [
          "Embrace change and transformation.",
          "Focus on long-term goals.",
        ];
      };
    };
  };

  type ReportData = {
    chart : ChartData;
    energyConcentration : EnergyConcentration;
    natalAnalysis : NatalAnalysis;
    relationshipAnalysis : RelationshipAnalysis;
    financialAnalysis : FinancialAnalysis;
    generalAnalysis : GeneralAnalysis;
  };

  module ReportData {
    public func fromChartData(chartData : ChartData) : ReportData {
      {
        chart = chartData;
        energyConcentration = EnergyConcentration.fromChartData(chartData);
        natalAnalysis = NatalAnalysis.fromChartData(chartData);
        relationshipAnalysis = RelationshipAnalysis.fromChartData(chartData);
        financialAnalysis = FinancialAnalysis.fromChartData(chartData);
        generalAnalysis = GeneralAnalysis.fromChartData(chartData);
      };
    };
  };

  let reports = Map.empty<Text, ReportData>();

  let exampleReports = [
    ("102", "Sun=16.23,Pisces#Moon=27.45,Capricorn#Mercury=5.13,Aquarius#Venus=29.53,Aquarius#Mars=22.43,Taurus#Jupiter=12.58,Taurus#Saturn=1.10,Pisces#Uranus=1.53,Aquarius#Neptune=8.55,Pisces#Pluto=23.38,Capricorn#Chiron=19.05,Cancer#Lilith=7.41,Aries#Ceres=1.29,Aquarius#Node=3.38,Libra#Asc=14.38,Scorpio#MC=9.23,Leo#2nd=11.19,Sagittarius#3rd=15.42,Capricorn#4th=16.38,Aquarius#5th=13.56,Pisces#6th=9.23,Aries#IC=9.23,Aquarius#Point1=11.875,Virgo#Point2=11.875,Virgo"),
    ("101", "Sun=5.96,Aries#Moon=20.98,Taurus#Mercury=21.43,Aquarius#Venus=19.41,Aquarius#Mars=27.52,Libra#Jupiter=2.23,Pisces#Saturn=19.06,Aquarius#Uranus=10.21,Capricorn#Neptune=24.17,Capricorn#Pluto=28.23,Scorpio#Chiron=16.47,Leo#Lilith=6.23,Capricorn#Ceres=13.23,Aries#Node=18.15,Gemini#Asc=17.39,Capricorn#MC=12.23,Sagittarius#2nd=18.67,Pisces#3rd=22.93,Pisces#4th=28.23,Aries#5th=28.14,Taurus#6th=11.24,Brown#IC=12.23,Purple#Point1=18.281,Cancer#Point2=18.281,Cancer"),
    ("122", "Sun=4.66,Aries#Moon=28.56,Libra#Mercury=7.13,Aquarius#Venus=8.23,Virgo#Mars=8.26,Aquarius#Jupiter=0.02,Libra#Saturn=5.16,Aquarius#Uranus=13.21,Capricorn#Neptune=20.58,Capricorn#Pluto=24.25,Scorpio#Chiron=19.13,Cancer#Lilith=8.57,Capricorn#Ceres=5.03,Aries#Node=22.19,Leo#Asc=28.39,Capricorn#MC=11.23,Aries#2nd=7.11,Pisces#3rd=2.81,Taurus#4th=5.23,Aries#5th=3.04,Taurus#6th=18.83,Libra#IC=3.23,Aries#Point1=15.23,Capricorn#Point2=15.23,Capricorn"),
    ("123", "Sun=14.67,Scorpio#Moon=0.87,Cancer#Mercury=2.03,Capricorn#Venus=20.43,Capricorn#Mars=3.32,Cancer#Jupiter=16.52,Cancer#Saturn=28.07,Cancer#Uranus=6.41,Aquarius#Neptune=18.54,Aquarius#Pluto=7.43,Libra#Chiron=8.24,Gemini#Lilith=11.24,Aquarius#Ceres=13.93,Cancer#Node=3.51,Pisces#Asc=14.36,Scorpio#MC=17.40,Libra#2nd=19.56,Sagittarius#3rd=13.97,Pisces#4th=10.40,Capricorn#5th=6.51,Aquarius#6th=2.46,Aries#IC=17.23,Scorpio#Point1=11.875,Virgo#Point2=11.875,Virgo"),
  ];

  Array.tabulate(
    exampleReports.size(),
    func(i) { exampleReports[i] },
  ).forEach(
    func(tuple) {
      switch (reports.get(tuple.0)) {
        case (null) {
          reports.add(tuple.0, ReportData.fromChartData(ChartData.fromText(tuple.1)));
        };
        case (?_) {};
      };
    }
  );

  type Coordinates = {
    birthTimestamp : Int;
    latMicro : Int;
    longMicro : Int;
  };

  let coordinates = Map.empty<Text, Coordinates>();

  let exampleCoordinates = [
    ("102", { birthTimestamp = 983079600; latMicro = 41822222; longMicro = -6784416 }),
    ("101", { birthTimestamp = 957278400; latMicro = 40765000; longMicro = -73939600 }),
    ("122", { birthTimestamp = 920073600; latMicro = 34105289; longMicro = -118264358 }),
    ("123", { birthTimestamp = 1055270400; latMicro = 51209968; longMicro = -11408012 }),
  ];

  Array.tabulate<(Text, Coordinates)>(
    exampleCoordinates.size(),
    func(i) { exampleCoordinates[i] },
  ).forEach(func(tuple) { coordinates.add(tuple.0, tuple.1) });

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

  let astrologyReports = Map.empty<Text, GeneralReport>();

  module FindChar {
    public func find(textToSearch : Text, charToFind : Text) : Int {
      var charPosition : Int = 0;
      var foundPosition : Int = -1;
      let chars : [Char] = textToSearch.toArray();
      for (char in chars.values()) {
        if (charPosition >= 0) {
          if (_charEq(char, charToFind)) {
            foundPosition := charPosition;
            charPosition := -16;
          };
          charPosition += 1;
        };
      };
      foundPosition;
    };

    func _charEq(_ch : Char, _charToFind : Text) : Bool {
      false;
    };
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

  module LiveChart {
    public func generate(_positions : [(Text, Text)], _aspects : [(Text, Text, Text, Text)], _houses : [(Text, Text)]) : LiveChart {
      {
        positions = [
          ("Sun", "Pisces"),
          ("Moon", "Capricorn"),
        ];
        aspects = [
          ("Sun", "Moon", "sextile", "Pisces"),
        ];
        houses = [
          ("1st House", "Scorpio"),
        ];
        sunSign = "Pisces";
        moonSign = "Capricorn";
        ascendant = "Scorpio";
        dominantElement = "Water";
        dominantMode = "Mutable";
        planetaryPatterns = ["Stellium"];
        chartShape = "Bowl";
      };
    };
  };

  let liveCharts = Map.empty<Text, LiveChart>();

  liveCharts.add("102", LiveChart.generate([], [], [("1st House", "Scorpio")]));

  let stripe = Stripe.init(accessControlState, "usd");
  include StripeMixin(stripe);

  public shared ({ caller }) func initializePrices() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can initialize prices");
    };
    stripe.addStripePrice(caller, {
      priceId = "astrology_report";
      name = "Astrology Report";
      description = "Detailed astrology report based on birth data";
      unitAmount = 1999;
    });
    stripe.addStripePrice(caller, {
      priceId = "natal_chart";
      name = "Natal Chart";
      description = "In-depth natal chart interpretation";
      unitAmount = 3999;
    });
    stripe.addStripePrice(caller, {
      priceId = "relationship_analysis";
      name = "Relationship Analysis";
      description = "Comprehensive relationship compatibility analysis";
      unitAmount = 2999;
    });
    stripe.addStripePrice(caller, {
      priceId = "financial_analysis";
      name = "Financial Analysis";
      description = "Astrology-based financial insights";
      unitAmount = 2499;
    });
    stripe.addStripePrice(caller, {
      priceId = "general_consultation";
      name = "General Consultation";
      description = "Personalized astrological consultation";
      unitAmount = 1499;
    });
    stripe.addStripePrice(caller, {
      priceId = "premium_membership";
      name = "Premium Membership";
      description = "Access to exclusive astrology resources and discounts";
      unitAmount = 499;
    });
    stripe.addStripePrice(caller, {
      priceId = "elemental_analysis";
      name = "Elemental Analysis";
      description = "Detailed analysis of elemental distribution in chart";
      unitAmount = 999;
    });
  };

  public shared ({ caller }) func checkout(productType : Text) : async Stripe.CreatePaymentResponse {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can checkout");
    };
    var priceId : Text = "";
    var productName : Text = "";
    var description : Text = "";
    var unitAmount : Nat = 0;

    switch (productType) {
      case ("astrology_report") {
        priceId := "astrology_report";
        productName := "Astrology Report";
        description := "Detailed astrology report based on birth data";
        unitAmount := 1999;
      };
      case ("natal_chart") {
        priceId := "natal_chart";
        productName := "Natal Chart";
        description := "In-depth natal chart interpretation";
        unitAmount := 3999;
      };
      case ("relationship_analysis") {
        priceId := "relationship_analysis";
        productName := "Relationship Analysis";
        description := "Comprehensive relationship compatibility analysis";
        unitAmount := 2999;
      };
      case ("financial_analysis") {
        priceId := "financial_analysis";
        productName := "Financial Analysis";
        description := "Astrology-based financial insights";
        unitAmount := 2499;
      };
      case ("general_consultation") {
        priceId := "general_consultation";
        productName := "General Consultation";
        description := "Personalized astrological consultation";
        unitAmount := 1499;
      };
      case ("premium_membership") {
        priceId := "premium_membership";
        productName := "Premium Membership";
        description := "Access to exclusive astrology resources and discounts";
        unitAmount := 499;
      };
      case ("elemental_analysis") {
        priceId := "elemental_analysis";
        productName := "Elemental Analysis";
        description := "Detailed analysis of elemental distribution in chart";
        unitAmount := 999;
      };
      case (_) {};
    };

    let lineItem : Stripe.LineItem = {
      priceId;
      quantity = 1;
      comment = ?"Astrology Report";
    };

    await Stripe.createPayment(stripe, caller, [lineItem], "/payment-success", "/payment-cancel");
  };

  public query ({ caller }) func getAstrologyReport(reportId : Text) : async ?AstrologyData {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access reports");
    };
    switch (reports.get(reportId)) {
      case (null) { null };
      case (?report) {
        ?{
          planetaryPositions = report.chart.planetaryPositions;
          housePositions = report.chart.housePositions;
          aspects = report.chart.aspects;
          aspectType = if (report.chart.aspects.size() > 0) { report.chart.aspects[0].2 } else { "N/A" };
          sunSign = if (report.chart.planetaryPositions.size() > 0) { report.chart.planetaryPositions[0].1 } else { "N/A" };
          moonSign = if (report.chart.planetaryPositions.size() > 0) { report.chart.planetaryPositions[0].1 } else { "N/A" };
          ascendant = if (report.chart.housePositions.size() > 0) { report.chart.housePositions[0].1 } else { "N/A" };
        };
      };
    };
  };

  public query ({ caller }) func findChar(input : Text, charToFind : Text) : async Int {
    FindChar.find(input, charToFind);
  };

  public query ({ caller }) func getReport(reportId : Text) : async ?ReportData {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access reports");
    };
    reports.get(reportId);
  };

  public query ({ caller }) func getAllChartKeys() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access chart keys");
    };
    reports.keys().toArray();
  };

  public query ({ caller }) func getCoordinates(_reportId : Text) : async ?Coordinates {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access coordinates");
    };
    coordinates.get("101");
  };

  public query ({ caller }) func getGeneralReport(_reportId : Text) : async ?GeneralReport {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access general reports");
    };
    astrologyReports.get("102");
  };

  public query ({ caller }) func getChartData(reportId : Text) : async ?ChartData {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access chart data");
    };
    switch (reports.get(reportId)) {
      case (null) { null };
      case (?report) { ?report.chart };
    };
  };

  let referenceCharts = Map.empty<Text, (Int, Text)>();

  referenceCharts.add("fiat_money", (3233587200, "Washington DC"));
  referenceCharts.add("bitcoin", (1231001700, "Temple City, Cali"));

  public query ({ caller }) func getReferenceChart(chartType : Text) : async ?(Int, Text) {
    referenceCharts.get(chartType);
  };
};
