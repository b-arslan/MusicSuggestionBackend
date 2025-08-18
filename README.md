# Music Suggestion Backend

This project is a backend API built with NestJS that provides music recommendations based on user input. It leverages OpenAI's GPT-4o model to generate suggestions tailored to song, artist, mood, and popularity preferences.

## Features

- Recommend songs based on title, artist, and mood
- Option to suggest less popular tracks
- Integration with OpenAI GPT-4o
- Robust API validation and error handling

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation

```zsh
npm install
```

### Running the Application

```zsh
# Development mode
npm run start

# Watch mode
npm run start:dev

# Production mode
npm run start:prod
```

### Testing

```zsh
# Unit tests
npm run test

# End-to-end tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## API Usage

### Endpoint: `POST /api/v1/recommend`

**Request Body:**
```json
{
  "song": ["Believer"],
  "artist": ["Imagine Dragons"],
  "mood": "Energetic",
  "lessPopular": true
}
```

**Response:**
```json
{
  "success": true,
  "recommendations": "1. ...\n2. ..."
}
```

## Environment Variables

Create a `.env` file in the root directory and add your OpenAI API key:
```
OPENAI_API_KEY=your_openai_api_key
```

## License

This project is licensed under the MIT License.
