import { Routes } from '@angular/router';
import { Quoteapp } from './quoteapp/quoteapp';
import { App } from './app';
import { Navbar } from './navbar/navbar';
import { HeroSection } from './hero-section/hero-section';
import { Weather } from './weather/weather';

export const routes: Routes = [
  {path: '', component: HeroSection},
  {path: 'quote', component: Quoteapp},
  {path: 'navbar', component: Navbar},
  {path: 'weather', component: Weather}

];
