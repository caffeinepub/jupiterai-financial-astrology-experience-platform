import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface RelationshipAnalysis {
    challengingAspects: Array<[string, string, string]>;
    lifeThemes: Array<string>;
    harmonicAspects: Array<[string, string, string]>;
    compatibilityScores: Array<[string, string, number]>;
}
export interface Coordinates {
    birthTimestamp: bigint;
    longMicro: bigint;
    latMicro: bigint;
}
export interface EnergyConcentration {
    retrogradePlanets: Array<string>;
    aspectPatterns: Array<[string, string]>;
    dominantCardinalModes: Array<[string, number]>;
    elementsUsage: Array<[string, number]>;
    planetsInHouses: Array<[string, number]>;
    planetsInSigns: Array<[string, number]>;
    aspectsCount: Array<[string, number]>;
}
export interface AstrologyData {
    sunSign: string;
    moonSign: string;
    aspects: Array<[string, string, string]>;
    housePositions: Array<[string, string]>;
    aspectType: string;
    ascendant: string;
    planetaryPositions: Array<[string, string]>;
}
export interface NatalAnalysis {
    signsAnalysis: Array<[string, string]>;
    planetaryPatternsAnalysis: Array<[string, string]>;
    housesAnalysis: Array<[string, string]>;
    planetaryAspectsAnalysis: Array<[string, string]>;
}
export interface PaymentSuccessResponse {
    message: string;
    payment: {
        status: string;
        paymentMethod: {
            last4: string;
            brand: string;
        };
        currency: string;
        amount: bigint;
    };
}
export interface GeneralAnalysis {
    overarchingInsights: Array<string>;
    lifeThemes: Array<string>;
    potentialGrowthAreas: Array<string>;
    personalStrengths: Array<string>;
}
export interface ReportData {
    energyConcentration: EnergyConcentration;
    chart: ChartData;
    relationshipAnalysis: RelationshipAnalysis;
    financialAnalysis: FinancialAnalysis;
    generalAnalysis: GeneralAnalysis;
    natalAnalysis: NatalAnalysis;
}
export interface GeneralReport {
    chartData: string;
    honkyChank: string;
}
export interface PaymentCancelResponse {
    message: string;
    sessionId: string;
}
export interface FinancialAnalysis {
    wealthBuildingTraits: Array<[string, string]>;
    careerPotential: Array<[string, string]>;
    financialStrategies: Array<string>;
    primaryFinancialIndicators: Array<[string, string]>;
}
export interface ChartData {
    aspects: Array<[string, string, string]>;
    housePositions: Array<[string, string]>;
    planetaryPositions: Array<[string, string]>;
    elementDistribution: Array<[string, number]>;
}
export interface UserProfile {
    birthDate?: string;
    birthTime?: string;
    name: string;
    birthPlace?: string;
    preferredReferenceChart?: string;
}
export interface CreatePaymentResponse {
    checkoutUrl: string;
    sessionId: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    checkout(productType: string): Promise<CreatePaymentResponse>;
    findChar(input: string, charToFind: string): Promise<bigint>;
    getAllChartKeys(): Promise<Array<string>>;
    getAstrologyReport(reportId: string): Promise<AstrologyData | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getChartData(reportId: string): Promise<ChartData | null>;
    getCoordinates(_reportId: string): Promise<Coordinates | null>;
    getGeneralReport(_reportId: string): Promise<GeneralReport | null>;
    getReferenceChart(chartType: string): Promise<[bigint, string] | null>;
    getReport(reportId: string): Promise<ReportData | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializePrices(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    paymentCancel(sessionId: string): Promise<PaymentCancelResponse>;
    paymentSuccess(sessionId: string, accountId: string, caffeineCustomerId: string): Promise<PaymentSuccessResponse>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
