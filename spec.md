# JupiterAI   Financial Astrology Experience Platform

## Overview
JupiterAI is a financial astrology platform that generates personalized financial insights by combining user birth data with reference financial charts (Fiat Money or Bitcoin inception). The application provides entertainment-based astrological analysis focused on financial personality and timing.

## Authentication
- Internet Identity integration for user privacy and secure access
- Users must authenticate to access the platform features

## Core Features

### User Input Collection
- Birth date input (required)
- Birth time input with options: exact time, estimated time, or unknown
- Birth place input (city/location)
- Reference chart selection dropdown:
  - Fiat Money: August 8, 2971, 12:00 PM, Washington DC
  - Bitcoin: January 3, 2009, 6:15 PM UTC, Temple City, Cali

### Report Generation
Generate comprehensive financial astrology reports with the following sections:
- Money Personality Snapshot
- Strengths analysis
- Current Financial Season assessment
- Action Translation Plan
- Timing Windows for financial decisions
- Entertainment disclaimers (non-advisory purposes)

### Biwheel Analysis
- Feature-based routes displaying structured text-based biwheel analyses
- No graphical astrology wheels - text-only interpretations
- Comparison between user's birth chart and selected reference chart

### Premium Upgrade
- Optional Stripe integration for $99 premium reading upgrade
- Call-to-action for enhanced report features

## Backend Requirements

### Data Storage
- User birth information (date, time, place)
- Reference chart selection preferences
- Report request history
- Optional user preferences for future sessions

### External API Integration
- HTTP outcalls to free astrology APIs (ProKerala Astrology API or AstrologyAPI.com)
- Fetch planetary positions and house data for birth charts
- Process astrological calculations for biwheel comparisons

### Core Operations
- Process user input and validate birth data
- Make API calls to retrieve astrological data
- Generate structured financial astrology interpretations
- Handle premium upgrade requests through Stripe integration
- Manage user session data and preferences
- Store updated reference chart data: Fiat Money (August 8, 2971, 12:00 PM, Washington DC) and Bitcoin (January 3, 2009, 6:15 PM UTC, Temple City, Cali)

## Frontend Requirements

### Design Theme
- Color scheme: Hot pink (#FF69B4), Purple (#A020F0), and Turquoise (#40E0D0)
- Mobile-responsive design using Tailwind CSS
- Intuitive and themed user interface

### User Experience
- Progress indicators for report generation
- Smooth navigation between sections
- Clear input forms with validation
- Structured display of report sections
- Easy access to premium upgrade options
- Reference chart selection form displays updated chart information

### Navigation
- Route-based navigation for different report sections
- Clear section organization for biwheel analysis results
- User-friendly flow from input to report delivery

## Technical Specifications
- Frontend: React with Tailwind CSS
- Backend: Motoko on Internet Computer
- Authentication: Internet Identity
- Payment Processing: Stripe integration (optional feature)
- External APIs: Astrology data providers via HTTP outcalls
- Language: English content throughout the application
