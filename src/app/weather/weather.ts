import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: string;
  humidity: number;
  windSpeed: number;
  description: string;
  updatedTime: string;
}

interface CitySuggestion {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

@Component({
  selector: 'app-weather',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './weather.html',
  styleUrl: './weather.css',
})
export class Weather implements OnInit {
  searchInput: string = '';
  suggestions: CitySuggestion[] = [];
  showSuggestions: boolean = false;
  weatherData: WeatherData | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';

  private apiKey: string = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your API key from openweathermap.org

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Optional: Load weather for a default city on init
  }

  onSearchInput() {
    this.errorMessage = '';
    if (this.searchInput.trim().length < 2) {
      this.suggestions = [];
      this.showSuggestions = false;
      return;
    }

    this.fetchCitySuggestions(this.searchInput);
  }

  fetchCitySuggestions(query: string) {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${this.apiKey}`;
    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.suggestions = data.map((city) => ({
          name: city.name,
          country: city.country,
          lat: city.lat,
          lon: city.lon,
        }));
        this.showSuggestions = this.suggestions.length > 0;
      },
      error: () => {
        this.suggestions = [];
        this.showSuggestions = false;
      },
    });
  }

  selectSuggestion(suggestion: CitySuggestion) {
    this.searchInput = `${suggestion.name}, ${suggestion.country}`;
    this.showSuggestions = false;
    this.searchWeather(suggestion.lat, suggestion.lon);
  }

  onSearch() {
    if (this.searchInput.trim().length > 0) {
      this.showSuggestions = false;
      // If a suggestion is available, use it
      if (this.suggestions.length > 0) {
        const firstSuggestion = this.suggestions[0];
        this.searchWeather(firstSuggestion.lat, firstSuggestion.lon);
      } else {
        // Fetch suggestions and then get weather for the first one
        this.fetchCitySuggestionsAndSearch();
      }
    }
  }

  fetchCitySuggestionsAndSearch() {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${this.searchInput}&limit=1&appid=${this.apiKey}`;
    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        if (data.length > 0) {
          this.searchWeather(data[0].lat, data[0].lon);
        } else {
          this.errorMessage = 'City not found. Please try another search.';
        }
      },
      error: () => {
        this.errorMessage = 'Failed to fetch weather data. Please check your API key.';
      },
    });
  }

  searchWeather(lat: number, lon: number) {
    this.isLoading = true;
    this.errorMessage = '';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;

    this.http.get<any>(url).subscribe({
      next: (data) => {
        this.weatherData = {
          city: data.name,
          country: data.sys.country,
          temperature: Math.round(data.main.temp),
          feelsLike: data.weather[0].main,
          humidity: data.main.humidity,
          windSpeed: parseFloat(data.wind.speed.toFixed(1)),
          description: data.weather[0].description,
          updatedTime: 'Just now',
        };
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to fetch weather data. Please try again.';
        this.isLoading = false;
      },
    });
  }

  hideSuggestions() {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }
}
