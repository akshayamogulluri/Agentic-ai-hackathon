# 🌱 AgriSaarthi AI

**AgriSaarthi AI** is an AI-powered smart farming assistant designed to
help farmers make better decisions about crops, diseases, agricultural
products, soil health, irrigation, weather, and farm management.

The platform combines multiple AI-assisted modules into a single
farmer-friendly interface, with support for multilingual interaction and
voice-based assistance.

------------------------------------------------------------------------

## 🚜 Problem Statement

Farmers often need to make decisions about:

-   Crop diseases and visible plant symptoms
-   Pest and disease treatment
-   Agricultural product identification and suitability
-   Soil health and nutrient levels
-   Irrigation requirements
-   Weather conditions
-   Crop-stage-specific farm management

Access to timely and reliable agricultural guidance can be difficult,
especially when information is fragmented across different sources.

**AgriSaarthi AI** brings these capabilities together in one platform.

------------------------------------------------------------------------

## 💡 Solution

AgriSaarthi AI acts as a **multi-agent digital farm advisor**.

A farmer can create a farm profile and use different AI-powered tools to
receive contextual recommendations based on:

-   Farm location
-   Crop
-   Crop growth stage
-   Soil parameters
-   Weather conditions
-   Uploaded crop images
-   Agricultural product labels/images

The goal is not simply to provide generic AI answers, but to make
recommendations relevant to the farmer's actual farm context.

------------------------------------------------------------------------

## ✨ Key Features

### 1. 👨‍🌾 Farm Profile

Farmers can create a farm profile containing:

-   Farmer name
-   State
-   District
-   Village
-   Crop information
-   Farm-related details

The profile provides context for other modules.

------------------------------------------------------------------------

### 2. 🤖 AI Farm Assistant

A conversational AI assistant that allows farmers to ask questions about
their farm.

Example queries:

-   "How is the weather today?"
-   "Do I need to irrigate my field?"
-   "What should I do if my crop has yellow leaves?"
-   "How can I control this pest?"

The assistant is designed to provide simple, actionable responses.

------------------------------------------------------------------------

### 3. 🌿 Crop Doctor

Farmers can upload an image of a crop or plant symptom.

The module can:

1.  Analyze the uploaded image
2.  Identify the likely crop
3.  Detect possible visible symptoms
4.  Suggest possible causes
5.  Provide recommended next steps

The system should communicate uncertainty when image evidence is
insufficient rather than presenting an uncertain diagnosis as a
confirmed fact.

------------------------------------------------------------------------

### 4. 🧪 Agricultural Product Checker

Farmers can upload an image of an agricultural product or label.

The system extracts available information such as:

-   Product/brand name
-   Active ingredient
-   Formulation
-   Product category
-   Target pests/diseases
-   Safety information

The product can then be checked against the selected crop and available
agricultural-product data.

The intended verification flow is:

**Image → OCR/Product identification → Product database → Crop match →
Target pest/disease match → Result**

Possible outcomes:

-   🟢 Verified / Suitable
-   🟡 Needs verification
-   🔴 Not suitable

The system should not claim a product is suitable when its identity or
registration information cannot be reliably verified.

------------------------------------------------------------------------

### 5. 💧 Soil & Water

The Soil & Water module helps farmers understand soil and irrigation
conditions.

It can display:

-   Soil pH
-   Soil moisture
-   Soil temperature
-   Nitrogen (N)
-   Phosphorus (P)
-   Potassium (K)
-   Irrigation recommendation
-   Rainfall credit/forecast information
-   Next review time

Example:

> If soil moisture is already adequate and significant rainfall is
> expected, the system can recommend postponing irrigation to reduce
> unnecessary watering and waterlogging risk.

Soil values may come from sensors or manual input depending on the
deployment.

------------------------------------------------------------------------

### 6. 🌦️ Weather Intelligence

Weather information can be used together with farm conditions to support
decisions such as:

-   Irrigation planning
-   Rainfall preparation
-   Crop protection timing
-   Farm activity planning

The system distinguishes between **probability of rainfall** and
**expected rainfall amount**.

------------------------------------------------------------------------

### 7. 🔔 Alerts

The platform can surface important farm-related notifications such as:

-   Weather-related alerts
-   Irrigation reminders
-   Crop-health warnings
-   Product/safety warnings
-   Other farm actions requiring attention

------------------------------------------------------------------------

### 8. 🗣️ Multilingual & Voice Assistance

The interface is designed to be accessible to farmers who may prefer
regional languages.

The assistant can support:

-   Text interaction
-   Voice input
-   Text-to-speech/read-aloud functionality
-   Regional-language responses

------------------------------------------------------------------------

## 🏗️ System Architecture

``` text
                    ┌─────────────────────┐
                    │     Farmer/User     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   AgriSaarthi UI    │
                    └──────────┬──────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
          ▼                    ▼                    ▼
   ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
   │ Farm Profile│      │ AI Assistant│      │ Crop Doctor │
   └──────┬──────┘      └──────┬──────┘      └──────┬──────┘
          │                    │                    │
          │                    ▼                    ▼
          │             ┌─────────────┐      ┌─────────────┐
          │             │ AI / Agents │      │ Image Model │
          │             └──────┬──────┘      └─────────────┘
          │                    │
          ├────────────────────┼────────────────────┐
          │                    │                    │
          ▼                    ▼                    ▼
   ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
   │ Soil & Water│      │   Weather   │      │   Product   │
   │   Analysis  │      │ Intelligence│      │   Checker   │
   └─────────────┘      └─────────────┘      └──────┬──────┘
                                                     │
                                                     ▼
                                             ┌─────────────┐
                                             │ OCR + Product│
                                             │ Verification │
                                             └─────────────┘
```

------------------------------------------------------------------------

## 🧠 AI Agent Approach

AgriSaarthi AI can be structured as multiple specialized agents/modules
instead of relying on a single general-purpose assistant.

### Farm Context Agent

Maintains relevant farm information and provides context to other
modules.

### Crop Health Agent

Analyzes crop images and identifies possible diseases or symptoms.

### Weather Agent

Processes weather information and connects it with farming decisions.

### Soil & Irrigation Agent

Evaluates soil parameters and irrigation requirements.

### Product Verification Agent

Extracts product information from labels/images and checks it against
agricultural-product data.

### Conversational Agent

Acts as the farmer-facing interface and coordinates responses from
specialized capabilities.

------------------------------------------------------------------------

## 🔄 Example User Flow

``` text
1. Farmer registers
        ↓
2. Creates Farm Profile
        ↓
3. Selects crop
        ↓
4. Dashboard loads farm context
        ↓
5. Farmer uploads crop image
        ↓
6. Crop Doctor analyzes symptoms
        ↓
7. Farmer checks weather and soil
        ↓
8. Irrigation recommendation is generated
        ↓
9. Farmer uploads agricultural product label
        ↓
10. Product Checker verifies product/crop compatibility
        ↓
11. Farmer can ask follow-up questions through AI Assistant
```

------------------------------------------------------------------------

## 🧪 Demo Test Profile

For a consistent real-world demonstration profile:

  Field          Demo Value
  -------------- ------------
  Farmer Name    Ravi
  State          Telangana
  District       Suryapet
  Village        Chivvemla
  Primary Crop   Rice

This location combination is internally consistent and can be used for
testing the farm-profile flow.

------------------------------------------------------------------------

## 🛡️ Safety & Reliability

Agricultural recommendations can have real-world consequences.
Therefore, the system should avoid presenting uncertain information as
fact.

Important safeguards include:

-   Show confidence/verification status where appropriate
-   Do not invent product identities
-   Do not infer a product is suitable merely because a crop was
    selected
-   Show product-label and regulatory disclaimers
-   Encourage users to follow the physical product label
-   Avoid claiming symptoms that are not visible in the uploaded image
-   Distinguish simulated/demo sensor data from real sensor readings
-   Provide a fallback response when an AI service is temporarily
    unavailable

For pesticide/fertilizer recommendations, the physical product label and
applicable local agricultural regulations take priority over
AI-generated guidance.

------------------------------------------------------------------------

## 📊 Example Soil Analysis

Example dashboard values:

``` text
pH             6.5
Moisture       72%
Temperature    27°C

Nitrogen       78 mg/kg   → Adequate
Phosphorus     45 mg/kg   → Moderate
Potassium      32 mg/kg   → Deficient
```

The system can use these values to identify nutrient priorities and
support irrigation decisions.

> If these values are simulated or manually entered, the interface
> should clearly indicate that they are not live sensor readings.

------------------------------------------------------------------------

## 🔧 Technology Stack

The exact implementation can vary, but the platform is designed around:

-   **Frontend:** Modern web application
-   **AI/LLM:** AI-powered conversational and reasoning services
-   **Computer Vision:** Crop/image analysis
-   **OCR:** Agricultural product-label extraction
-   **Weather API:** Weather and rainfall information
-   **Database:** Farm profiles, agricultural knowledge, and product
    information
-   **Voice:** Speech-to-text and text-to-speech
-   **Deployment:** Web/cloud deployment

------------------------------------------------------------------------

## 📁 Suggested Project Structure

``` text
AgriSaarthi-AI/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── assets/
│
├── backend/
│   ├── api/
│   ├── agents/
│   ├── services/
│   └── database/
│
├── ai/
│   ├── crop-doctor/
│   ├── product-checker/
│   ├── weather-agent/
│   └── soil-agent/
│
├── public/
│
├── README.md
└── package.json
```

------------------------------------------------------------------------

## 🚀 Getting Started

### 1. Clone the repository

``` bash
git clone <YOUR_REPOSITORY_URL>
cd AgriSaarthi-AI
```

### 2. Install dependencies

``` bash
npm install
```

### 3. Configure environment variables

Create a `.env` file and add the required API keys/configuration.

Example:

``` env
AI_API_KEY=your_api_key
WEATHER_API_KEY=your_weather_api_key
DATABASE_URL=your_database_url
```

Do **not** commit API keys or secrets to GitHub.

### 4. Run the development server

``` bash
npm run dev
```

Open the local development URL shown in the terminal.

------------------------------------------------------------------------

## 🔐 Environment Variables

Typical configuration may include:

  Variable            Purpose
  ------------------- -------------------------------
  `AI_API_KEY`        AI/LLM service
  `WEATHER_API_KEY`   Weather service
  `DATABASE_URL`      Database connection
  `NEXT_PUBLIC_*`     Public frontend configuration

Use the actual variable names defined by the project.

------------------------------------------------------------------------

## 🎯 Hackathon Value Proposition

AgriSaarthi AI focuses on **practical farm decision support**, rather
than being only a generic chatbot.

### Key differentiators

-   🌾 Farm-context-aware assistance
-   🤖 Specialized AI agents
-   📷 Crop image analysis
-   🧪 Agricultural product checking
-   💧 Soil and irrigation intelligence
-   🌦️ Weather-aware recommendations
-   🗣️ Voice and multilingual interaction
-   🔔 Action-oriented alerts
-   🛡️ Safety and verification mechanisms

------------------------------------------------------------------------

## 🔮 Future Improvements

Potential future development includes:

-   IoT soil sensors
-   Satellite/crop-monitoring data
-   Regional-language voice models
-   More crop disease datasets
-   Verified agricultural-product databases
-   Government agricultural scheme integration
-   Fertilizer optimization
-   Market-price intelligence
-   Yield prediction
-   Farm history and seasonal analytics
-   WhatsApp/SMS-based farmer notifications
-   Offline/low-connectivity support

------------------------------------------------------------------------

## ⚠️ Disclaimer

AgriSaarthi AI is a decision-support and educational system.

AI-generated crop, disease, weather, soil, fertilizer, or pesticide
information should not replace advice from qualified agricultural
professionals or the instructions on legally registered product labels.

Users should verify agricultural chemical products, dosage, crop
registration, safety requirements, pre-harvest intervals, and local
regulations before use.

------------------------------------------------------------------------

## 🌱 Vision

**"Making intelligent agricultural guidance accessible to every
farmer."**

AgriSaarthi AI aims to turn complex agricultural information into
simple, contextual, and actionable guidance for farmers.
